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
    maintainOrder: state.maintainOrder,
}))
@Form.create()
export default class MaintainOrder extends PureComponent {
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
    };

    componentDidMount() {
        this.initQuery();
    }

    initQuery(){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'maintainOrder/count',
        })
        dispatch({
            type: 'maintainOrder/fetch',
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

    handleDetail(record){
        this.setState({
            modalVisible: true,
            lookOrder:{
                ...record
            }
        })
    }

    handleDel(maintainOrderId){
        this.props.dispatch({
            type:"maintainOrder/del",
            payload:{
                maintainOrderId
            },
            callback:()=>{
                this.initQuery('删除成功！')
            }
        })
    }
    render() {
        const { maintainOrder: { loading, data } } = this.props;
        const { modalVisible, addMaintainOrder, operation , pagination} = this.state;
        const key2Name = {
            "id":"编号",
            "cancelTime":"取消时间",
            "remark":"备注",
            "status" : "状态",
            "producerId":"服务方id",
            "applyTime":"服务方时间",
            "serialNumber":"流水号",
            "iphonePasswd":"解锁密码",
            "period":"预约时间",
            "serviceType":"服务方式",
            "maintainPhoneId":"回收手机id",
            "expressCompany":"快递公司名称",
            "expressNumber":"快递单号",
            "amount":"订单金额",
            "confirmTime":"确认时间",
            "problemSelects":"已选问题",
            "customerId":"用户id",
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
            },
            {
                title: key2Name['period'],
                dataIndex: 'period',
            },
            {
                title: key2Name['serialNumber'],
                dataIndex: 'serialNumber',
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
                    console.log(value)
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
                temp.push(
                <FormItem
                    key = {'view'+key}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label={key2Name[key]}
                >
                    <span>{value}</span>
                </FormItem>)
            }
            return temp;
        }
        return (
            <PageHeaderLayout title="用户管理">
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
                    {getLookView()}
                </Modal>
            </PageHeaderLayout>
        );
    }
}
