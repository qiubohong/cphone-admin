import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Switch, Popconfirm,Row, Col, Card, Collapse, Form, Input, Select,Upload, Icon, Button, InputNumber, Table, Modal, Spin, message, notification, Radio } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;

const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    recycle: state.recycle,
    brands: state.brand.data
}))
@Form.create()
export default class RecyclePhone extends PureComponent {
    state = {
        addPhone: {
            name: 'iphone6',
            picUrl: 'http://ww1.sinaimg.cn/bmiddle/7fa9a04fgy1fk9yle453xj20lu0ghwpe.jpg',
            brandId: '',
            totalPrice: '3000',
            isHot: 1
        },
        modalVisible: false,
        operation: false,
        quesVisible: false,
        quesOperation: false,
        editPhoneId: -1,
        newQues: [],
        tempNewQues:[],
        quesLoading: false,
        fileList: []
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'brand/fetch',
            payload:{
                startIndex: 0,
                pageSize:1000,
            },
            callback: () => {
                dispatch({
                    type: 'recycle/query',
                    payload: {
                        startIndex:0,
                        pageSize:1000
                    }
                });
            }
        });
    }

    initPhones(msg){
        this.setState({
            modalVisible: false,
            operation: false
        });
        message.success(msg);
        this.props.dispatch({
            type: 'recycle/query',
            payload: {
                startIndex:0,
                pageSize:1000
            }
        });
    }

    handleGetPhones = (val) => {
        this.props.dispatch({
            type: 'recycle/query',
            payload: val
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }
    handleName = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ name: e.target.value }) 
        this.setState({
            addPhone
        });
    }
    onChangeIsHot = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ isHot: e.target.value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    handlePicUrl = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ picUrl: e.target.value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    handleBrandId = (value) => {
        let addPhone = Object.assign({},this.state.addPhone,{ brandId: value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    handleTotalPrice = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ totalPrice: e.target.value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    handleAdd = () => {
        const { addPhone } = this.state;
        if (addPhone.brandId === "") {
            message.warn('请填写手机品牌！');
            return;
        }
        if (addPhone.name === "") {
            message.warn('请填写手机型号！');
            return;
        }
        if (addPhone.totalPrice === "") {
            message.warn('请填写手机回收价格！');
            return;
        }
        if (addPhone.url === "") {
            message.warn('请填写手机图片地址！');
            return;
        }
        this.setState({
            operation: true
        });
        if(addPhone.id){
            this.props.dispatch({
                type: 'recycle/update',
                payload: {
                    ...addPhone
                },
                callback: () => {
                    this.setState({
                        addPhone:{
                            name: 'iphone6',
                            picUrl: 'http://ww1.sinaimg.cn/bmiddle/7fa9a04fgy1fk9yle453xj20lu0ghwpe.jpg',
                            brandId: '',
                            totalPrice: '3000',
                            isHot: 1
                        }
                    })
                    this.initPhones('更新成功');
                }
            });
        }else{
            this.props.dispatch({
                type: 'recycle/add',
                payload: {
                    ...addPhone
                },
                callback: () => {
                    this.initPhones('添加成功');
                }
            });
        }
        
    }


    onStatusChange(checked, record){
        record.status = checked ? 1 : 0;
        this.props.dispatch({
            type: 'recycle/update',
            payload: {
                ...record
            },
            callback: () => {
                this.initPhones('更新成功');
            }
        });
    }
    handleQuesVisible = (flag, id) => {
        if(!id){
            this.setState({
                quesVisible: !!flag,
                editPhoneId: -1
            });
            return;
        }
        this.setState({
            editPhoneId: id
        });
        this.props.dispatch({
            type:"recycle/queryProblem",
            payload:{
                pageSize: 100,
                startIndex: 0,
                recyclePhoneId: id
            },
            callback: (res)=>{
                this.setState({
                    quesVisible: !!flag,
                });
                if(!res.data){
                    return;
                }
                res.data.forEach((item)=>{
                    item.edit = false;
                    if(item.selects === null){
                        item.selects = [];
                    }
                });

                const temp = JSON.parse(JSON.stringify(res.data))
                this.setState({
                    tempNewQues:[
                        ...temp
                    ],
                    newQues:[
                        ...res.data
                    ]
                })
            }
        })
        
    }
    handleAddNewQues = () => {
        if(this.state.editPhoneId === -1){
            return;
        }
        let {editPhoneId} = this.state;
        let newQues = Object.assign([],this.state.newQues);
        newQues.push({
            phoneId : editPhoneId,
            problemName: "",
            problemType: 0,
            edit: true,
            selects: [{
                problemItem: "",
                cost: ""
            }]
        });
        this.setState({
            newQues
        });
    }
    handleAddNewQuesOpt = (index, problemId,e) => {
        let newQues = Object.assign([],this.state.newQues);
        newQues[index].selects.push({
            problemId,
            problemItem: "",
            cost: ""
        })
        this.setState({
            newQues:[
                ...newQues
            ]
        });
    }

    handleQuesCon (e,key,quesIndex, selectIndex){
        let newQues = Object.assign([], this.state.newQues);
        newQues.forEach((item,i1)=>{
            if(i1 === quesIndex){
                if(selectIndex === -1){
                    item[key] = e.target.value;
                }else{
                    item.selects.forEach((item2, i2)=>{
                        if(i2 === selectIndex){
                            item2[key] = e.target.value;
                        }
                    })
                }
            }
        });

        this.setState({
            newQues
        })
    }

    handleDelQuesOpt(quesIndex, selectIndex){
        console.log(selectIndex)
        let newQues = [...this.state.newQues];
        let temp = [...newQues]
        temp.forEach((item,i1)=>{
            if(quesIndex === i1){
                item.selects.forEach((item2, i2)=>{
                    if(i2 === selectIndex){
                        if(item2.id){
                            this.props.dispatch({
                                type : "recycle/delSelect",
                                payload: {
                                    recycleProblemSelectId : item2.id
                                }
                            })
                        }
                        newQues[i1].selects.splice(i2,1); 
                        this.setState({
                            newQues
                        });
                    }
                })
            }
        });
    }

    handleEdit(record){
        this.setState({
            addPhone: record
        });
        this.handleModalVisible(true);
    }

    handleDel(recyclePhoneId){
        this.props.dispatch({
            type: "recycle/del",
            payload:{
                recyclePhoneId
            },
            callback:()=>{
                this.initPhones("删除成功!");
            }
        })
    }

    handleQuesEdit(index, flag){
        let newQues = Object.assign([], this.state.newQues);
        if(!flag){
            this.state.tempNewQues.forEach((item,i1)=>{
                newQues.forEach((item2,i2)=>{
                    if(i1 === i2){
                        item2.problemName = item.problemName;
                        item2.problemType = item.problemType;

                        let selectsTemp = [];
                        item2.selects.forEach(i2s=>{
                            item.selects.forEach(i1s=>{
                                if(i2s.id == i1s.id){
                                    selectsTemp.push({...i1s});
                                }
                            })
                        });

                        newQues[i2].selects = [...selectsTemp];
                    }
                });
            });
        }
        newQues.forEach((item,i1)=>{
            if(i1 === index){
                item.edit = !!flag;
            }
        });
        this.setState({
            newQues
        })
    }

    handleQuesDel(ques){
        this.setState({
            quesLoading: true
        });
        this.props.dispatch({
            type: "recycle/delProblem",
            payload:{
                recycleProblemId: ques.id
            },
            callback:(res)=>{
                this.props.dispatch({
                    type:"recycle/queryProblem",
                    payload:{
                        pageSize: 100,
                        startIndex: 0,
                        recyclePhoneId: ques.phoneId
                    },
                    callback: (res)=>{
                        if(!res.data){
                            return;
                        }
                        res.data.forEach((item)=>{
                            item.edit = false;
                            if(item.selects === null){
                                item.selects = [];
                            }
                        });
                        this.setState({
                            newQues:[
                                ...res.data
                            ]
                        })
                        this.setState({
                            quesLoading: false
                        });
                    }
                })
            }
        })
    }

    handleSaveQues(index, ques){
        let {newQues,editPhoneId} = this.state;
        newQues[index].edit = false;
        this.setState({
            quesLoading: true,
            newQues
        });
        if(ques.id){
            this.props.dispatch({
                type:"recycle/batchUpdateProblem",
                urlParam:{
                    phoneId: editPhoneId,
                },
                bodyParam:[
                    ...[ques]
                ],
                callback:(res)=>{
                    this.setState({
                        quesLoading: false
                    });
                }
            })
        }else{
            this.props.dispatch({
                type:"recycle/batchAddProblem",
                urlParam:{
                    phoneId: editPhoneId,
                },
                bodyParam:[
                    ...[ques]
                ],
                callback:(res)=>{
                    this.setState({
                        quesLoading: false
                    });
                }
            })
        }
    }

    getQuesById = () => {
        let result = [];
        this.state.newQues.forEach((ques, index) => {
            result.push (
                <Panel header={ques.problemName === "" ? "问题描述" : ques.problemName} key={'ques'+index}>
                    {(
                        function(obj){
                            if (!ques.edit) { 
                                return (<div style={{marginBottom:10}}>
                                    <Button type="primary" icon="edit" size="small" onClick={()=>obj.handleQuesEdit(index, true)}>编辑</Button>
                                    <Popconfirm title="确定删除？" onConfirm={()=>obj.handleQuesDel(ques)}>
                                        <Button style={{marginLeft:8}} icon="delete" type="danger" size="small">删除</Button>
                                    </Popconfirm>
                                </div>)
                            }else{
                                return (<div style={{marginBottom:10}}>
                                    <Button type="default" size="small" onClick={()=>obj.handleSaveQues(index,ques)}>保存</Button>
                                    <Button style={{marginLeft:8}} type="danger" size="small" onClick={()=>obj.handleQuesEdit(index, false)}>取消</Button>
                                </div>) ;
                            }
                        }(this)
                    )}
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="问题"
                    >{(
                        function(obj){
                            if (ques.edit) { 
                                return <Input placeholder="请输入问题" value={ques.problemName} onChange={(e)=>obj.handleQuesCon(e,'problemName', index, -1)} />
                            }else{
                                return ques.problemName;
                            }
                        }(this)
                    )}
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="类型"
                    >
                    {(
                        function(obj){
                            if (ques.edit) { 
                                return (<div>
                                    <RadioGroup value={ques.problemType} onChange={(e)=>obj.handleQuesCon(e,'problemType', index, -1)}>
                                        <Radio value={0}>单选</Radio>
                                        <Radio value={1}>多选</Radio>
                                    </RadioGroup>
                                    </div>)
                            }else{
                                return ques.problemType === 0 ? "单选" : "多选";
                            }
                        }(this)
                    )}
                    </FormItem>
                    {  
                        ques.selects && ques.selects.map((item,idx) => {
                                return (<FormItem
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 15 }}
                                    label={"选项"+(idx+1)}
                                    key={idx}
                                >
                                {(
                        function(obj){
                            if (ques.edit) { 
                                return (<div>
                                <Input placeholder="选项描述" value={item.problemItem} style={{marginBottom:20}} onChange={(e)=>obj.handleQuesCon(e,'problemItem', index, idx)}/>
                                <Input placeholder="选项折扣" type="number" value={item.cost} onChange={(e)=>obj.handleQuesCon(e,'cost', index, idx)} />
                                {item.id ?
                                    <Popconfirm title="删除不可恢复？" onConfirm={()=>obj.handleDelQuesOpt(index,idx)}>
                                        <Button type="danger" size="small" icon="close" shape="circle"></Button>
                                    </Popconfirm>
                                    :
                                    <Button type="danger" size="small" icon="close" shape="circle" onClick={()=>{obj.handleDelQuesOpt(index,idx)}}></Button>
                                }
                                </div>)
                            }else{
                                return (<div>
                                    <div>描述:{item.problemItem}</div>
                                    <div>折扣:{item.cost}</div>
                                </div>);
                            }
                        }(this)
                    )}
                                
                                
                                </FormItem>)
                            })
                    }
                    <Button onClick={this.handleAddNewQuesOpt.bind(this,index,ques.id)}>新增问题</Button>
                </Panel>
            )
        })
        return (
            <div>
                <Collapse accordion defaultActiveKey={['ques0']}>
                    {result}
                </Collapse>
                <Button style={{marginTop:20}} type="primary" onClick={this.handleAddNewQues}>新增问题</Button>
            </div>
        );
    }

    render() {
        const { recycle: { loading, data }, brands = [] } = this.props;
        const { modalVisible, addPhone, operation, quesVisible, quesOperation } = this.state;
        const okOrNo = {
            0: <Icon type="close" />,
            1: <Icon type="check" />
        }
        const columns = [
            {
                title: "编号",
                dataIndex: "id",
            },
            {
                title: '品牌',
                dataIndex: 'brandId',
                render: val => {
                    var result = val;
                    brands.forEach((item) => {
                        if (item.id == val) {
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
                title: '最高回收价',
                dataIndex: 'totalPrice',
            },
            {
                title: '图片',
                dataIndex: 'picUrl',
                render: val => (
                    val ? <img src={val.indexOf('http') == 0 ? val : 'http://' + val} style={{ height: 60 }} /> : '无图片'
                ),
            },
            {
                title: '上架',
                dataIndex: 'status',
                render: (text,record) => {
                    return record.status == 0 ? 
                    <Switch checkedChildren="上" unCheckedChildren="下" onChange={(checked)=>{this.onStatusChange(checked, record)}} />
                    : <Switch checkedChildren="上" unCheckedChildren="下" defaultChecked onChange={(checked)=>{this.onStatusChange(checked, record)}} />;
                } 
            },
            {
                title: '是热门?',
                dataIndex: 'isHot',
                render: val => (
                    okOrNo[val]
                ),
            }, {
                title: '问题',
                render: (text,record) => {
                    let result = <Button type="normal" onClick={()=>this.handleQuesVisible(true,record.id)}>编辑</Button>;
                    return result;
                }
            }, {
                title: '操作',
                width:180,
                render: (text,record) => (<div>
                    <Button onClick={()=>this.handleEdit(record)}>编辑</Button>&nbsp;
                    <Popconfirm title="确定删除？" onConfirm={() => this.handleDel(record.id)}>
                        <Button type="danger">删除</Button>
                    </Popconfirm>
                </div>)
            }
        ];
        let brandOpts = [];
        brands.forEach((item, index) => {
            brandOpts.push(<Option key={"brand" + index} value={item.id} >{item.brandName}</Option>)
        });
        if(addPhone.brandId == "" && brands.length > 0){
            addPhone.brandId = brands[0].id;
        }
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
                    let addPhone = Object.assign({},this.state.addPhone,{ picUrl }) 
                    this.setState({
                        addPhone: addPhone
                    });
                }else if(file.status === "removed"){
                    let addPhone = Object.assign({},this.state.addPhone,{ picUrl:"" }) 
                    this.setState({
                        addPhone: addPhone
                    });
                }
            }
        }
        return (
            <PageHeaderLayout title="回收手机管理">
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
                <Modal title="编辑问题"
                    visible={quesVisible}
                    onCancel={() => this.handleQuesVisible(false)}
                    confirmLoading={quesOperation}
                    footer = {null}
                >
                    <Spin spinning={this.state.quesLoading}>
                        {this.getQuesById()}
                    </Spin>
                </Modal>
                <Modal
                    title="添加"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading={operation}
                >
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="选择品牌"
                    >
                        <Select style={{ width: 120 }} defaultValue={addPhone.brandId} onChange={this.handleBrandId}>{brandOpts}</Select>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="手机型号"
                    >
                        <Input placeholder="请输入手机型号" value={addPhone.name} onChange={this.handleName} />
                    </FormItem>

                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="是热门"
                    >
                    <RadioGroup onChange={this.onChangeIsHot} value={addPhone.isHot}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="图片地址"
                    >
                        <Input style={{marginBottom:10}} placeholder="请输入图片地址" value={addPhone.picUrl} onChange={this.handlePicUrl} />
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" />上传图片
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="最高回收价格"
                    >
                        <Input
                            addonBefore="￥"
                            type={"number"}
                            defaultValue={1000}
                            placeholder="请输入回收价格" value={addPhone.totalPrice} onChange={this.handleTotalPrice} />
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
