import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Upload, Popconfirm, Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    brand: state.brand,
}))
@Form.create()
export default class Brand extends PureComponent {
    state = {
        addBrand: {
            brandName: '',
            picUrl: ''
        },
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        operation: false,
        pagination:{
            startIndex: 0,
            pageSize: 100,
            total: 0,
            onChange: (page, pageSize)=>{
                this.paginationChange(page,pageSize);
            }
        },
        fileList:[]
    };

    componentDidMount() {
        this.initQuery();
    }

    initQuery(){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'brand/count',
        })
        dispatch({
            type: 'brand/fetch',
            payload: {
                startIndex,
                pageSize,
            }
        });
    }
    paginationChange(page, pageSize){
        
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }
    handleBrandName = (e) => {
        let addBrand = Object.assign({},this.state.addBrand);
        addBrand.brandName = e.target.value;
        this.setState({
            addBrand
        });
    }
    handlePicUrl = (e) => {
        let addBrand = Object.assign({},this.state.addBrand);
        addBrand.picUrl = e.target.value;
        this.setState({
            addBrand
        });
    }
    afterAddOrUpdate(msg){
        this.setState({
            operation:false
        })
        message.success(msg);
        this.setState({
            modalVisible: false,
        });
        this.initQuery();
        this.setState({
            addBrand:{
                picUrl:"",
                brandName:""
            }
        });
    }
    handleAdd = () => {
        const { addBrand} = this.state;
        const {dispatch} = this.props;
        this.setState({
            operation:true
        })
        if(addBrand.id){
            dispatch({
                type: 'brand/update',
                payload: {
                    ...addBrand
                },
                callback: (res) => {
                    if(!res || !res.data){
                        this.setState({
                            operation:false
                        })
                        return;
                    }
                    this.afterAddOrUpdate("修改成功！")
                }
            });
        }else{
            dispatch({
                type: 'brand/add',
                payload: {
                    ...addBrand
                },
                callback: () => {
                    this.afterAddOrUpdate("添加成功！")
                }
            });
        }
    }

    handleDel(phoneBrandId){
        this.props.dispatch({
            type:"brand/del",
            payload:{
                phoneBrandId
            },
            callback:()=>{
                this.initQuery('删除成功！')
            }
        })
    }

    handleEdit(record){
        this.setState({
            addBrand: {
                ...record
            }
        })
        this.handleModalVisible(true);
    }

    render() {
        const { brand: { loading, data } } = this.props;
        const { selectedRows, modalVisible, addBrand, operation , pagination} = this.state;
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '名称',
                dataIndex: 'brandName',
            },
            {
                title: '图片',
                dataIndex: 'picUrl',
                render: val => (
                    val ? <img src={val.indexOf('http') == 0 ? val : 'http://' + val} style={{ height: 60 }} /> : '无图片'
                ),
            },{
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 180,
                render: (text, record) => (<div>
                    <Button onClick={()=>this.handleEdit(record)}>编辑</Button>&nbsp;
                    <Popconfirm title="确定删除？" onConfirm={() => this.handleDel(record.id)}>
                        <Button type="danger">删除</Button>
                    </Popconfirm>
                    
                </div>),
            },
        ];

        const uploadProps ={
            accept:"image/*",
            action: "//chuangshouji.com/cphone/phone/uploadFile/",
            listType: 'picture',
            defaultFileList: [],
            fileList: this.state.fileList,
            className: 'upload-list-inline',
            name: "productFile",
            onChange: (res)=>{
                let file = res.file;
                let fileList = res.fileList;
                fileList = fileList.slice(-1);
                this.setState({ fileList });
                if(file.status === "done" && file.response){
                    let picUrl = file.response.data;
                    let addBrand = Object.assign({},this.state.addBrand,{ picUrl }) 
                    this.setState({
                        addBrand
                    });
                }else if(file.status === "removed"){
                    let addBrand = Object.assign({},this.state.addBrand,{ picUrl:"" }) 
                    this.setState({
                        addBrand
                    });
                }
            }
        }

        return (
            <PageHeaderLayout title="手机品牌管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
                            {
                                selectedRows.length > 0 && (
                                    <span>
                                        <Button>批量操作</Button>
                                        <Dropdown overlay={menu}>
                                            <Button>
                                                更多操作 <Icon type="down" />
                                            </Button>
                                        </Dropdown>
                                    </span>
                                )
                            }
                        </div>
                        <Table
                            rowKey={record => record.id}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                            pagination={pagination}
                        />
                    </div>
                </Card>
                <Modal
                    title="添加新品牌"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="品牌名称"
                    >
                        <Input placeholder="请输入品牌名称" onChange={this.handleBrandName} value={addBrand.brandName} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="图片地址"
                    >
                        <Input style={{marginBottom:10}} placeholder="请输入图片地址" onChange={this.handlePicUrl} value={addBrand.picUrl} />
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" />上传图片
                            </Button>
                        </Upload>
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
