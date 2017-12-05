import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message, notification } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
    recycle: state.recycle,
    brands: state.brand.data
}))
@Form.create()
export default class Phone extends PureComponent {
    state = {
        addPhone: {
            name: '',
            url: '',
            modelId: '',
            totalPrice: ''
        },
        modalVisible: false,
        operation: false
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'recycle/hot',
        });
        dispatch({
            type: 'brand/fetch',
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }
    handleName = (e) => {
        let { addPhone: {url, totalPrice , modelId}} = this.state;
        let name = e.target.value;
        this.setState({
            addPhone: {
                name,
                url,
                totalPrice,
                modelId
            }
        });
    }
    handleUrl = (e) => {
        let { addPhone: {name, totalPrice , modelId}} = this.state;
        let url = e.target.value;
        this.setState({
            addPhone: {
                name,
                url,
                totalPrice,
                modelId
            }
        });
    }
    handleModelId = (value) => {
        let { addPhone: {name, url , totalPrice}} = this.state;
        let modelId = value + "";
        this.setState({
            addPhone: {
                name,
                url,
                totalPrice,
                modelId
            }
        });
    }
    handleTotalPrice = (e) => {
        let { addPhone: {name, url , modelId}} = this.state;
        let totalPrice = e.target.value;
        this.setState({
            addPhone: {
                name,
                url,
                totalPrice,
                modelId
            }
        });
    }
    handleAdd = () => {
        const { addPhone: { name, url, modelId, totalPrice} } = this.state;
        if(modelId === ""){
            message.warn('请填写手机品牌！');
            return;
        }
        if(name === ""){
            message.warn('请填写手机型号！');
            return;
        }
        if(totalPrice === ""){
            message.warn('请填写手机回收价格！');
            return;
        }
        if(url === ""){
            message.warn('请填写手机图片地址！');
            return;
        }
        this.setState({
            operation:true
        });
        this.props.dispatch({
            type: 'recycle/add',
            payload: {
                name,
                url,
                totalPrice,
                modelId
            },
            callback: () => {
                this.setState({
                    modalVisible: false,
                    operation: false
                });
                console.log("添加成功！");
                message.success('添加成功');
                this.props.dispatch({
                    type: 'recycle/hot',
                });
            }
        });


    }

    handleDelete(){
        notification.warn({
            message: '创手机后台提示您',
            description: '该功能还在开发中...',
          });
    }

    render() {
        const { recycle: { loading, data } , brands} = this.props;
        const {  modalVisible, addPhone, operation } = this.state;
        const columns = [
            {
                title: '所属品牌',
                dataIndex: 'modelId',
                render: val=>{
                    var result = val;
                    brands.forEach((item)=>{
                        if(item.id == val){
                            result = item.brandName
                        }
                    })
                    return result; 
                }
            },
            {
                title: '手机型号',
                dataIndex: 'name',
            },
            {
                title: '最高回收价格',
                dataIndex: 'totalPrice',
            },
            {
                title: '图片',
                dataIndex: 'url',
                render: val => (
                    val ? <img src={val.indexOf('http') == 0 ? val : 'http://' + val} style={{ height: 60 }} /> : '无图片'
                ),
            },{
                title: '操作',
                render: val=>{
                    let result =  <Button type="danger" onClick={this.handleDelete}>删除</Button>;
                    return result; 
                }
            }
        ];
        let brandOpts =  [];
        brands.forEach((item,index) => {
            brandOpts.push(<Option key={"brand"+index} value={item.id+""} >{item.brandName}</Option>)
        });

        return (
            <PageHeaderLayout title="回收手机问题管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
                        </div>
                        <Table
                            rowKey={record => record.id}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    </div>
                </Card>
                <Modal
                    title="添加新热门回收"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="选择品牌"
                    >
                        <Select style={{ width: 120 }} onChange={this.handleModelId}>{brandOpts}</Select>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="手机型号"
                    >
                        <Input placeholder="请输入手机型号" value={addPhone.name} onChange={this.handleName}/>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="最高回收价格"
                    >
                        <Input placeholder="请输入回收价格" type="number" value={addPhone.totalPrice} onChange={this.handleTotalPrice}/>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="图片地址"
                    >
                        <Input placeholder="请输入图片地址" value={addPhone.url} onChange={this.handleUrl}/>
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
