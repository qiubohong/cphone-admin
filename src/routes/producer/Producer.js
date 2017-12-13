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
    producer: state.producer,
}))
@Form.create()
export default class Producer extends PureComponent {
    state = {
        addProducer: {
            number: '', 
            role: 0, 
            bussiness: 0, 
            name:'',
            passwd: ''
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
    }

    initQuery(){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'producer/count',
        })
        dispatch({
            type: 'producer/fetch',
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
        let addProducer = Object.assign({},this.state.addProducer);
        addProducer.name = e.target.value;
        this.setState({
            addProducer
        });
    }
    handleNumber = (e) => {
        let addProducer = Object.assign({},this.state.addProducer);
        addProducer.number = e.target.value;
        this.setState({
            addProducer
        });
    }
    handlePasswd = (e) => {
        let addProducer = Object.assign({},this.state.addProducer);
        addProducer.passwd = e.target.value;
        this.setState({
            addProducer
        });
    }
    handleBussiness = (e) => {
        let addProducer = Object.assign({},this.state.addProducer);
        addProducer.bussiness = e.target.value;
        this.setState({
            addProducer
        });
    }
    handleRole = (e) => {
        let addProducer = Object.assign({},this.state.addProducer);
        addProducer.role = e.target.value;
        this.setState({
            addProducer
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
            addProducer:{
                number: '', 
                role: '', 
                bussiness: '', 
                name:'',
                passwd: ''
            }
        });
    }
    handleAdd = () => {
        const { addProducer} = this.state;
        const {dispatch} = this.props;
        this.setState({
            operation:true
        })
        if(addProducer.id){
            dispatch({
                type: 'producer/update',
                payload: {
                    ...addProducer
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
                type: 'producer/add',
                payload: {
                    ...addProducer
                },
                callback: () => {
                    this.afterAddOrUpdate("添加成功！")
                }
            });
        }
    }

    handleDel(producerId){
        this.props.dispatch({
            type:"producer/del",
            payload:{
                producerId
            },
            callback:()=>{
                this.initQuery('删除成功！')
            }
        })
    }

    handleEdit(record){
        this.setState({
            addProducer: {
                ...record
            }
        })
        this.handleModalVisible(true);
    }

    render() {
        const { producer: { loading, data } } = this.props;
        const { modalVisible, addProducer, operation , pagination} = this.state;
        //业务：0所有，1维修， 2回收
        const bussiness = {
            0:"所有",
            1:"维修",
            2:"回收"
        };
        //0所有，1上门，2门店
        const role = {
            0:"所有",
            1:"上门",
            2:"门店"
        };
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '服务方名称',
                dataIndex: 'name',
            },
            {
                title: '联系电话',
                dataIndex: 'number'
            },
            {
                title: '业务',
                dataIndex: 'bussiness',
                render:(val)=>{
                    return bussiness[val]
                }
            },
            {
                title: '角色',
                dataIndex: 'role',
                render:(val)=>{
                    return role[val]
                }
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
            <PageHeaderLayout title="工作人员管理">
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
                        <Input placeholder="请输入用户昵称" onChange={this.handleName} value={addProducer.name} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="联系方式"
                    >
                        <Input placeholder="请输入用户联系方式" onChange={this.handleNumber} value={addProducer.number} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="用户密码"
                    >
                        <Input placeholder="请输入用户密码" onChange={this.handlePasswd} value={addProducer.passwd} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="服务角色"
                    >
                        <RadioGroup onChange={this.handleRole} value={addProducer.role}>
                            <Radio value={0}>{role["0"]}</Radio>
                            <Radio value={1}>{role["1"]}</Radio>
                            <Radio value={2}>{role["2"]}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="业务范围"
                    >
                        <RadioGroup onChange={this.handleBussiness} value={addProducer.bussiness}>
                            <Radio value={0}>{bussiness["0"]}</Radio>
                            <Radio value={1}>{bussiness["1"]}</Radio>
                            <Radio value={2}>{bussiness["2"]}</Radio>
                        </RadioGroup>
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
