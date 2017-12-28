import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Upload, Popconfirm, Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import moment from 'moment';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    recycleOrder: state.recycleOrder
}))
@Form.create()
export default class RecycleOrder extends PureComponent {
    state = {
        lookOrder:{},
        modalVisible: false,
        expandForm: false,
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
        modalLoading: false,
        editJSON:{
            "amount" : 1 //1 展示 2 编辑
        }
    };

    componentDidMount() {
        this.initQuery();
    }

    initQuery(msg){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'recycleOrder/count',
        })
        dispatch({
            type: 'recycleOrder/fetch',
            payload: {
                startIndex,
                pageSize,
            }
        });
        msg && message.success(msg);
    }
    paginationChange(page, pageSize){
        
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    handleDetail(record){
        this.setState({
            modalVisible: true,
            lookOrder:{
                ...record
            }
        })
    }

    handleDel(recycleOrderId){
        this.props.dispatch({
            type:"recycleOrder/del",
            payload:{
                recycleOrderId
            },
            callback:()=>{
                this.initQuery('删除成功！')
            }
        })
    }

    handleEditVisible(key,flag){
        let {editJSON} = this.state;
        let {lookOrder} = this.state;
        if(!flag){
            lookOrder[key] = editJSON[key];
        }
        editJSON[key] = flag ? lookOrder[key] : 1;
        
        this.setState({
            editJSON:{
                ...editJSON
            },
            lookOrder:{
                ...lookOrder
            }
        })
    }
    handleEdit(key){
        let {lookOrder} = this.state;
        this.setState({
            modalLoading:true
        })
        this.props.dispatch({
            type:'recycleOrder/update',
            payload:{
                ...lookOrder
            },
            callback:(res)=>{
                let {editJSON} = this.state;
                editJSON[key] = 1;
                this.setState({
                    modalLoading:false,
                    editJSON: {
                        ...editJSON
                    }
                });

                this.initQuery('更新成功！')
            }
        })
    }
    handleEditChange(key,e){
        let {lookOrder} = this.state;
        lookOrder[key] = e.target.value;
        this.setState({
            lookOrder:{
                ...lookOrder
            }
        })
    }
    getUserInfo(customerId){
        this.setState({
            modalLoading:true
        })
        this.props.dispatch({
            type:'customer/queryById',
            payload:{
                customerId
            },
            callback:(res)=>{
                this.setState({
                    modalLoading:false
                })
                if(!res.data){
                    message.error('查无此用户');
                    return;
                }

                Modal.info({
                    title: '查看用户信息',
                    content: (
                      <div>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="用户id"
                        >
                            {res.data.id}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="用户姓名"
                        >
                            {res.data.name}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="用户电话"
                        >
                            {res.data.number}
                        </FormItem>
                      </div>
                    ),
                    onOk() {},
                  });
            }
        })
    }

    getPhoneInfo(recyclePhoneId){
        this.setState({
            modalLoading:true
        })
        this.props.dispatch({
            type:'recycle/queryById',
            payload:{
                recyclePhoneId
            },
            callback:(res)=>{
                this.setState({
                    modalLoading:false
                })
                if(!res.data){
                    message.error('查无此手机');
                    return;
                }

                Modal.info({
                    title: '查看手机信息',
                    content: (
                      <div>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="手机id"
                        >
                            {res.data.id}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="手机型号"
                        >
                            {res.data.name}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="回收总价"
                        >
                            ￥{res.data.totalPrice}
                        </FormItem>
                      </div>
                    ),
                    onOk() {},
                  });
            }
        })
    }

    getProducerInfo(producerId){
        this.setState({
            modalLoading:true
        })
        this.props.dispatch({
            type:'producer/queryById',
            payload:{
                producerId
            },
            callback:(res)=>{
                this.setState({
                    modalLoading:false
                })
                if(!res.data){
                    message.error('查无此服务方');
                    return;
                }

                Modal.info({
                    title: '查看服务方信息',
                    content: (
                      <div>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="服务方id"
                        >
                            {res.data.id}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="服务方"
                        >
                            {res.data.name}
                        </FormItem>
                        <FormItem
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label="电话"
                        >
                            {res.data.number}
                        </FormItem>
                      </div>
                    ),
                    onOk() {},
                  });
            }
        })
    }
    render() {
        const { recycleOrder: { loading, data } } = this.props;
        const { modalVisible, addRecycleOrder, operation , pagination, editJSON} = this.state;
        const key2Name = {
            "id":"编号",
            "cancelTime":"取消时间",
            "remark":"备注",
            "status" : "状态",
            "producerId":"服务方信息",
            "applyTime":"下单时间",
            "serialNumber":"流水号",
            "iphonePasswd":"解锁密码",
            "period":"预约时间",
            "serviceType":"服务方式",
            "recyclePhoneId":"回收手机",
            "expressCompany":"快递公司名称",
            "expressNumber":"快递单号",
            "amount":"订单金额",
            "confirmTime":"确认时间",
            "problemSelects":"已选问题",
            "customerId":"用户信息",
            "address":"用户详细地址",
            "acceptTime":"接单时间",
            "finishTime":"服务完成时间",
            "storeId":"门店id",
        };
        const status = {
            "0":"下单",
            "1":"分配待接受",
            "2":"已接单",
            "3":"服务完成",
            "4":"确认",
            "5":"取消",
        };
        const serviceType = {
            "1":"上门",
            "2":"门店",
            "3":"邮寄"
        };
        const columns = [
            {
                title: key2Name['id'],
                dataIndex: 'id',
            },
            {
                title: key2Name['status'],
                dataIndex: 'status',
                render(val){
                    return status[val];
                }
            },
            {
                title: key2Name['customerId'],
                dataIndex: 'customerId',
                render:(val)=>{
                    return <Button type="primary" onClick={()=>{this.getUserInfo(val)}}>查看</Button>
                }
            },
            {
                title: key2Name['applyTime'],
                dataIndex: 'applyTime',
                render(value){
                    return moment(value).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            {
                title: key2Name['amount'],
                dataIndex: 'amount',
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 180,
                render: (text, record) => (<div>
                    <Button onClick={()=>this.handleDetail(record)}>查看</Button>&nbsp;
                    <Popconfirm title="确定删除？" onConfirm={() => this.handleDel(record.id)}>
                        <Button type="danger">删除</Button>
                    </Popconfirm>
                    
                </div>),
            },
        ];

        const getLookView = ()=>{
            let temp = [];
            for(let key in this.state.lookOrder){
                if(key == 'problems' || key == 'problemSelects'){
                    continue;
                }
                let value = this.state.lookOrder[key];
                if(key == 'status'){
                    value = status[value];
                }

                if(key.indexOf('Time') > 0){
                    if(value > 0){
                        value = moment(value).format('YYYY-MM-DD HH:mm:ss')
                    }else{
                        value = "未知？"
                    }
                }

                if(key == 'serviceType'){
                    value = serviceType[value]
                }

                if(key == 'customerId'){
                    value = <Button type="primary" onClick={()=>{this.getUserInfo(this.state.lookOrder[key])}}>查看用户信息</Button>
                }

                if(key == 'recyclePhoneId'){
                    value = <Button type="primary" onClick={()=>{this.getPhoneInfo(this.state.lookOrder[key])}}>查看手机信息</Button>
                }

                if(key == 'producerId'){
                    value = <Button type="primary" onClick={()=>{this.getProducerInfo(this.state.lookOrder[key])}}>查看服务方信息</Button>
                }
                let edit = <span>{value}</span>;
                if(editJSON[key]){
                    if(editJSON[key] == 1){
                        edit = <div>
                            <span>{value}</span>
                            <Button style={{marginLeft:4}} shape="circle" icon="edit"  onClick={()=>{this.handleEditVisible(key, true)}}></Button>
                            </div>
                    }else{
                        edit = (<div>
                            <Input style={{width:100}} value={value} onChange={(e)=>{this.handleEditChange(key,e)}}/>
                            <Button style={{marginLeft:4}} type="primary" onClick={()=>{this.handleEdit(key)}}>保存</Button>
                            <Button style={{marginLeft:4}} onClick={()=>{this.handleEditVisible(key, false)}}>取消</Button>
                        </div>);
                    }
                }
                if(!!value){
                    temp.push(
                        <FormItem
                            key = {'view'+key}
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 15 }}
                            label={key2Name[key]}
                        >
                            {edit}
                        </FormItem>)
                }
            }
            return temp;
        }
        return (
            <PageHeaderLayout title="订单管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
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
                    title="查看订单详情"
                    visible={modalVisible}
                    footer={null}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                    <Spin spinning={this.state.modalLoading}>
                    {getLookView()}
                    </Spin>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
