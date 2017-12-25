import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Upload, Radio,  Popconfirm, Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message } from 'antd';
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
            prizeName:"",
            prizeValue: '', 
            prizeRaffleNum:'', 
            prizeImgHttpPath: ''
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
        fileList:[]
    };

    componentDidMount() {
        this.initQuery();
    }

    initQuery(){
        const { dispatch } = this.props;
        const {pagination:{startIndex, pageSize}} = this.state;
        dispatch({
            type: 'prize/fetch',
            payload: {
                startIndex,
                pageSize,
            }
        });
        dispatch({
            type: 'prize/now',
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
            fileList:[],
            modalVisible: !!flag,
        });
    }
    handlePrizeName = (e) => {
        let addPrize = Object.assign({},this.state.addPrize);
        addPrize.prizeName = e.target.value;
        this.setState({
            addPrize
        });
    }

    handlePrizeValue = (e) => {
        let addPrize = Object.assign({},this.state.addPrize);
        addPrize.prizeValue = e.target.value;
        this.setState({
            addPrize
        });
    }

    handlePprizeRaffleNum = (e) => {
        let addPrize = Object.assign({},this.state.addPrize);
        addPrize.prizeRaffleNum = e.target.value;
        this.setState({
            addPrize
        });
    }

    handlePrizeImgHttpPath = (e) => {
        let addPrize = Object.assign({},this.state.addPrize);
        addPrize.prizeImgHttpPath = e.target.value;
        this.setState({
            addPrize
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
            addPrize: {
                prizeName:"",
                prizeValue: '', 
                prizeRaffleNum:'', 
                prizeImgHttpPath: ''
            }
        });
    }
    handleAdd = () => {
        const { addPrize} = this.state;
        const {dispatch} = this.props;
        this.setState({
            operation:true
        })
        dispatch({
            type: 'prize/add',
            payload: {
                ...addPrize
            },
            callback: () => {
                this.afterAddOrUpdate("添加成功！")
            }
        });
    }

    render() {
        const { prize: { loading, data, one },} = this.props;
        const { modalVisible, addPrize, operation , pagination} = this.state;
        const current = one.prizeName ? [one] : [];

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
                    let prizeImgHttpPath = "http://"+file.response.data;
                    let addPrize = Object.assign({},this.state.addPrize,{ prizeImgHttpPath }) 
                    this.setState({
                        addPrize
                    });
                }else if(file.status === "removed"){
                    let addPrize = Object.assign({},this.state.addPrize,{ prizeImgHttpPath:"" }) 
                    this.setState({
                        addPrize
                    });
                }
            }
        }

        const baseCol = [
            {
                title: '奖品名称',
                dataIndex: 'prizeName',
            },
            {
                title: '奖品价值',
                dataIndex: 'prizeValue',
            },
            {
                title: '兑换码个数',
                dataIndex: 'raffleNum'
            },
            {
                title: '奖品图片',
                dataIndex: 'prizeImgHttpPath',
                render(val){
                    var imgUrl = val;
                    if(val.indexOf('http') < 0 ){
                        imgUrl = "http://" + imgUrl;
                    }
                    return <img src={imgUrl} style={{height:100}} />
                }
            }
        ];
        const currentCol = [
            ...baseCol,
            {
                title: '发放个数',
                dataIndex: 'sentRaffleNum' 
            },
            {
                title: '添加时间',
                dataIndex: 'prizeAddTime'
            }
        ];

        const columns = [
            ...baseCol,
            {
                title: '中奖兑换码',
                dataIndex: 'awardRaffleId' 
            },{
                title: '中奖手机号',
                dataIndex: 'awardCustomerPhone'
            },{
                title: '中奖时间',
                dataIndex: 'awardTime'
            }
        ];


        return (
            <PageHeaderLayout title="奖品管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建or替换当前奖品</Button>
                        </div>
                        <h2>当前奖品</h2>
                        <Table
                            rowKey={record => record.id}
                            loading={loading}
                            dataSource={current}
                            columns={currentCol}
                        />
                        <h2>开奖记录</h2>
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
                    title="添加新奖品"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="奖品名"
                >
                    <Input placeholder="请输入奖品名" onChange={this.handlePrizeName} value={addPrize.prizeName} />
                </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="奖品价值"
                    >
                        <Input placeholder="请输入奖品价值" type="number" onChange={this.handlePrizeValue} value={addPrize.prizeValue} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="兑换码个数"
                    >
                        <Input placeholder="请输入兑换码个数" type="number" onChange={this.handlePprizeRaffleNum} value={addPrize.prizeRaffleNum} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="奖品图片"
                    >
                        <Input placeholder="请输入奖品图片" onChange={this.handlePrizeImgHttpPath} value={addPrize.prizeImgHttpPath} />
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
