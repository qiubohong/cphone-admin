import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Popconfirm,Row, Col, Card, Collapse, Form, Input, Select,Upload, Icon, Button, InputNumber, Table, Modal, Spin, message, notification, Radio } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;

const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    maintain: state.maintain,
    brands: state.brand.data
}))
@Form.create()
export default class MaintainPhone extends PureComponent {
    state = {
        addPhone: {
            name: 'iphone6',
            picUrl: 'http://ww1.sinaimg.cn/bmiddle/7fa9a04fgy1fk9yle453xj20lu0ghwpe.jpg',
            brandId: ''
        },
        modalVisible: false,
        operation: false,
        quesVisible: false,
        quesOperation: false,
        editPhoneId: -1,
        newQues: [],
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
                    type: 'maintain/query',
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
            type: 'maintain/query',
            payload: {
                startIndex:0,
                pageSize:1000
            }
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
        if (addPhone.url === "") {
            message.warn('请填写手机图片地址！');
            return;
        }
        this.setState({
            operation: true
        });
        if(addPhone.id){
            this.props.dispatch({
                type: 'maintain/update',
                payload: {
                    ...addPhone
                },
                callback: () => {
                    this.setState({
                        addPhone:{
                            name: 'iphone6',
                            picUrl: 'http://ww1.sinaimg.cn/bmiddle/7fa9a04fgy1fk9yle453xj20lu0ghwpe.jpg',
                            brandId: ''
                        }
                    })
                    this.initPhones('更新成功');
                }
            });
        }else{
            this.props.dispatch({
                type: 'maintain/add',
                payload: {
                    ...addPhone
                },
                callback: () => {
                    this.initPhones('添加成功');
                }
            });
        }
        
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
            type:"maintain/queryProblem",
            payload:{
                pageSize: 100,
                startIndex: 0,
                maintainPhoneId: id
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
                this.setState({
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
            problemType: 1,
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
    handleAddNewQuesOpt = (index,e) => {
        let newQues = Object.assign([],this.state.newQues);
        newQues[index].selects.push({
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
                item[key] = e.target.value;
            }
            item.selects.forEach((item2, i2)=>{
                if(i2 === selectIndex){
                    item2[key] = e.target.value;
                }
            })
        });

        this.setState({
            newQues
        })
    }

    handleEdit(record){
        this.setState({
            addPhone: record
        });
        this.handleModalVisible(true);
    }

    handleDel(maintainPhoneId){
        this.props.dispatch({
            type: "maintain/del",
            payload:{
                maintainPhoneId
            },
            callback:()=>{
                this.initPhones("删除成功!");
            }
        })
    }

    handleQuesEdit(index, flag){
        let newQues = Object.assign([], this.state.newQues);
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
            type: "maintain/delProblem",
            payload:{
                maintainProblemId: ques.id
            },
            callback:(res)=>{
                this.props.dispatch({
                    type:"maintain/queryProblem",
                    payload:{
                        pageSize: 100,
                        startIndex: 0,
                        recyclePhoneId: this.state.editPhoneId
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
                type:"maintain/batchUpdateProblem",
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
                type:"maintain/batchAddProblem",
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
                <Panel header={ques.problemName === "" ? "故障描述" : ques.problemName} key={'ques'+index}>
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
                        label="故障标题"
                    >{(
                        function(obj){
                            if (ques.edit) { 
                                return <Input placeholder="请输入故障标题" value={ques.problemName} onChange={(e)=>obj.handleQuesCon(e,'problemName', index, -1)} />
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
                                        <Radio value={1}>单选</Radio>
                                        <Radio value={0}>多选</Radio>
                                    </RadioGroup>
                                    <Button type="danger" size="small" icon="close" shape="circle"></Button>
                                    </div>)
                            }else{
                                return ques.problemType === 1 ? "单选" : "多选";
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
                                <Input placeholder="选项描述" value={item.problemItem} style={{marginBottom:20}} onChange={(e)=>obj.handleQuesCon(e,'problemItem', -1, idx)}/>
                                <Input placeholder="选项折扣" type="number" value={item.cost} onChange={(e)=>obj.handleQuesCon(e,'cost', -1, idx)} />
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
                    <Button onClick={this.handleAddNewQuesOpt.bind(this,index)}>新增问题</Button>
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
        const { maintain: { loading, data }, brands = [] } = this.props;
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
                title: '图片',
                dataIndex: 'picUrl',
                render: val => (
                    val ? <img src={val.indexOf('http') == 0 ? val : 'http://' + val} style={{ height: 60 }} /> : '无图片'
                ),
            },{
                title: '可维修故障',
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
            <PageHeaderLayout title="维修手机管理">
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
                    onOk={() => this.handleQuesVisible(false)}
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
                        label="图片地址"
                    >
                        <Input style={{marginBottom:10}} placeholder="请输入图片地址" value={addPhone.picUrl} onChange={this.handlePicUrl} />
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
