import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Radio,  Popconfirm, Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    prize: state.prize,
}))
@Form.create()
export default class Prize extends PureComponent {
    state = {
        addPrize: {
            producerId:-1,
            number: '', 
            name:'', 
            address: '',
            lat: '',
            lng: '',
        },
        modalVisible: false,
        operation: false,
        pagination:{
            startIndex: 0,
            pageSize: 100,
            total: 0,
            onChange: (page, pageSize)=>{
                this.paginationChange(page,pageSize);
            }
        },
    };

    componentDidMount() {
        this.initQuery();
        const {pagination:{startIndex, pageSize}} = this.state;
        this.props.dispatch({
            type: 'producer/fetch',
            payload: {
                startIndex,
                pageSize,
            }
        });
    }

    initQuery(){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'store/count',
        })
        dispatch({
            type: 'store/fetch',
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
    handleName = (e) => {
        let addStore = Object.assign({},this.state.addStore);
        addStore.name = e.target.value;
        this.setState({
            addStore
        });
    }
    handleProducerId = (val)=>{
        let addStore = Object.assign({},this.state.addStore);
        addStore.producerId = val;
        this.setState({
            addStore
        });
    }
    handleNumber = (e) => {
        let addStore = Object.assign({},this.state.addStore);
        addStore.number = e.target.value;
        this.setState({
            addStore
        });
    }
    handleAddress = (e) => {
        let addStore = Object.assign({},this.state.addStore);
        addStore.address = e.target.value;
        this.setState({
            addStore
        });
    }
    handleLng = (e) => {
        let addStore = Object.assign({},this.state.addStore);
        addStore.lng = e.target.value;
        this.setState({
            addStore
        });
    }
    handleLat = (e) => {
        let addStore = Object.assign({},this.state.addStore);
        addStore.lat = e.target.value;
        this.setState({
            addStore
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
            addStore:{
                producerId:-1,
                number: '', 
                name:'', 
                address: '',
                lat: '',
                lng: '',
            }
        });
    }
    handleAdd = () => {
        const { addStore} = this.state;
        const {dispatch} = this.props;
        this.setState({
            operation:true
        })
        if(addStore.id){
            dispatch({
                type: 'store/update',
                payload: {
                    ...addStore
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
                type: 'store/add',
                payload: {
                    ...addStore
                },
                callback: () => {
                    this.afterAddOrUpdate("添加成功！")
                }
            });
        }
    }

    handleDel(storeId){
        this.props.dispatch({
            type:"store/del",
            payload:{
                storeId
            },
            callback:()=>{
                this.initQuery('删除成功！')
            }
        })
    }

    handleEdit(record){
        this.setState({
            addStore: {
                ...record
            }
        })
        this.handleModalVisible(true);
    }

    render() {
        const { store: { loading, data }, producer} = this.props;
        const producers = producer.data;
        const { modalVisible, addStore, operation , pagination} = this.state;
        
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '门店名称',
                dataIndex: 'name',
            },
            {
                title: '工作人员',
                dataIndex: 'producerId',
                render: (val) =>{
                    let result = "";
                    producers.forEach((item)=>{
                        if(item.id == val){
                            result = item.name
                        }
                    })
                    return result;
                }
            },
            {
                title: '联系电话',
                dataIndex: 'number'
            },
            {
                title: '地址',
                dataIndex: 'address'
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


        let producerOpts = [];
        producers.forEach((item, index) => {
            producerOpts.push(<Option key={"item" + index} value={item.id} >{item.name}</Option>)
        });

        return (
            <PageHeaderLayout title="门店管理">
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
                            pagination={pagination}
                        />
                    </div>
                </Card>
                <Modal
                    title="添加新门店"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="工作人员"
                >
                    <Select style={{ width: 120 }} defaultValue={addStore.producerId} onChange={this.handleProducerId}>{producerOpts}</Select>
                </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="门店名称"
                    >
                        <Input placeholder="请输入门店昵称" onChange={this.handleName} value={addStore.name} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="联系方式"
                    >
                        <Input placeholder="请输入门店联系方式" onChange={this.handleNumber} value={addStore.number} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="门店地址"
                    >
                        <Input placeholder="请输入门店地址" onChange={this.handleAddress} value={addStore.address} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="经度"
                    >
                        <Input placeholder="请输入经度" onChange={this.handleLng} value={addStore.lng} />
                    </FormItem>
                       <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="纬度"
                    >
                       <Input placeholder="请输入纬度" onChange={this.handleLat} value={addStore.lat} />
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
