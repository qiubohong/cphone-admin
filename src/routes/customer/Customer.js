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
    customer: state.customer,
}))
@Form.create()
export default class Customer extends PureComponent {
    state = {
        addCustomer: {
            number: '', 
            wxOpenid: '', 
            name: '', 
            passwd: ''
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
    };

    componentDidMount() {
        this.initQuery();
    }

    initQuery(){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'customer/count',
        })
        dispatch({
            type: 'customer/fetch',
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
        let addCustomer = Object.assign({},this.state.addCustomer);
        addCustomer.name = e.target.value;
        this.setState({
            addCustomer
        });
    }
    handleNumber = (e) => {
        let addCustomer = Object.assign({},this.state.addCustomer);
        addCustomer.number = e.target.value;
        this.setState({
            addCustomer
        });
    }
    handleWxOpenid = (e) => {
        let addCustomer = Object.assign({},this.state.addCustomer);
        addCustomer.wxOpenid = e.target.value;
        this.setState({
            addCustomer
        });
    }
    handlePasswd = (e) => {
        let addCustomer = Object.assign({},this.state.addCustomer);
        addCustomer.passwd = e.target.value;
        this.setState({
            addCustomer
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
            addCustomer:{
                number: '', 
                wxOpenid: '', 
                name: '', 
                passwd: ''
            }
        });
    }
    handleAdd = () => {
        const { addCustomer} = this.state;
        const {dispatch} = this.props;
        this.setState({
            operation:true
        })
        if(addCustomer.id){
            dispatch({
                type: 'customer/update',
                payload: {
                    ...addCustomer
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
                type: 'customer/add',
                payload: {
                    ...addCustomer
                },
                callback: () => {
                    this.afterAddOrUpdate("添加成功！")
                }
            });
        }
    }

    handleDel(customerId){
        this.props.dispatch({
            type:"customer/del",
            payload:{
                customerId
            },
            callback:()=>{
                this.initQuery('删除成功！')
            }
        })
    }

    handleEdit(record){
        this.setState({
            addCustomer: {
                ...record
            }
        })
        this.handleModalVisible(true);
    }

    render() {
        const { customer: { loading, data } } = this.props;
        const { modalVisible, addCustomer, operation , pagination} = this.state;
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '客户名称',
                dataIndex: 'name',
            },
            {
                title: '联系电话',
                dataIndex: 'number'
            },
            {
                title: '微信openid',
                dataIndex: 'wxOpenid'
            },
            {
                title: '用户密码',
                dataIndex: 'passwd'
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

        return (
            <PageHeaderLayout title="用户管理">
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
                    title="添加新用户"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="用户昵称"
                    >
                        <Input placeholder="请输入用户昵称" onChange={this.handleName} value={addCustomer.name} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="联系方式"
                    >
                        <Input placeholder="请输入用户联系方式" onChange={this.handleNumber} value={addCustomer.number} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="微信openid"
                    >
                        <Input placeholder="请输入用户微信openid" onChange={this.handleWxOpenid} value={addCustomer.wxOpenid} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="用户密码"
                    >
                        <Input placeholder="请输入用户微信openid" onChange={this.handlePasswd} value={addCustomer.passwd} />
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
