import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Collapse, Form, Input, Select,Upload, Icon, Button, InputNumber, Table, Modal, Spin, message, notification, Radio } from 'antd';
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
            name: '',
            url: '',
            modelId: '',
            totalPrice: '',
            isUseRecycle: 1,
            isUseHotRecycle: 1
        },
        modalVisible: false,
        operation: false,
        quesVisible: false,
        quesOperation: false,
        newQues: [{
            problemName: "",
            problemType: 1,
            selects: [{
                problemItem: "",
                cost: ""
            }]
        }]
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'brand/fetch',
            callback: () => {
                const { brands } = this.props;
                if (!brands) {
                    return;
                }
                dispatch({
                    type: 'recycle/query',
                    payload: brands[0].id
                });
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
    onChangeIsUseRecycle = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ isUseRecycle: e.target.value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    onChangeIsUseHotRecycle = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ isUseHotRecycle: e.target.value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    handleUrl = (e) => {
        let addPhone = Object.assign({},this.state.addPhone,{ url: e.target.value }) 
        this.setState({
            addPhone: addPhone
        });
    }
    handleModelId = (value) => {
        let addPhone = Object.assign({},this.state.addPhone,{ modelId: value }) 
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
        const { addPhone: { name, url, modelId, totalPrice, isUseRecycle,isUseHotRecycle } } = this.state;
        if (modelId === "") {
            message.warn('请填写手机品牌！');
            return;
        }
        if (name === "") {
            message.warn('请填写手机型号！');
            return;
        }
        if (totalPrice === "") {
            message.warn('请填写手机回收价格！');
            return;
        }
        if (url === "") {
            message.warn('请填写手机图片地址！');
            return;
        }
        this.setState({
            operation: true
        });
        this.props.dispatch({
            type: 'recycle/add',
            payload: {
                name,
                url,
                totalPrice,
                brandId:modelId,
                isUseRecycle,
                isUseHotRecycle,
            },
            callback: () => {
                this.setState({
                    modalVisible: false,
                    operation: false
                });
                message.success('添加成功');
                this.props.dispatch({
                    type: 'recycle/hot',
                });
            }
        });
    }

    handleQues = () => {
        console.log(this.state.newQues)
    }
    handleQuesVisible = (flag) => {
        this.setState({
            quesVisible: !!flag,
        });
    }
    handleDelete = () => {
        notification.warn({
            message: '创手机后台提示您',
            description: '该功能还在开发中...',
        });
    }
    handleAddNewQues = () => {
        let newQues = Object.assign([],this.state.newQues);
        newQues.push({
            problemName: "",
            problemType: 1,
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
            newQues
        });
    }

    getQuesById = () => {
        let result = [];
        this.state.newQues.forEach((ques, index) => {
            result.push (
                <Panel header={ques.problemName === "" ? "问题描述" : ques.problemName} key={'ques'+index}>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="问题"
                    >
                        <Input placeholder="请输入问题" value={ques.problemName} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="类型"
                    >
                        <RadioGroup value={ques.problemType}>
                            <Radio value={1}>单选</Radio>
                            <Radio value={0}>多选</Radio>
                        </RadioGroup>
                    </FormItem>
                    {
                        ques.selects.map((item,idx) => {
                            return (<FormItem
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 15 }}
                                label={"选项"+(idx+1)}
                                key={idx}
                            >
                            <Input placeholder="选项描述" value={item.problemItem} style={{marginBottom:20}}/>
                            <InputNumber placeholder="选项折扣" value={item.cost}/>
                            </FormItem>)
                        })
                    }
                    <Button onClick={this.handleAddNewQuesOpt.bind(this,index)}>新增问题</Button>
                </Panel>
            )
        })
        return (
            <div>
                <Collapse defaultActiveKey={['ques0']}>
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
                title: '可回收?',
                dataIndex: 'status',
                render: val => (
                    okOrNo[val]
                ),
            },
            {
                title: '是热门?',
                dataIndex: 'isHot',
                render: val => (
                    okOrNo[val]
                ),
            }, {
                title: '问题',
                render: val => {
                    let result = <Button type="normal" onClick={this.handleQuesVisible}>编辑</Button>;
                    return result;
                }
            }, {
                title: '操作',
                render: val => {
                    let result = <Button type="danger" onClick={this.handleDelete}>删除</Button>;
                    return result;
                }
            }
        ];
        let brandOpts = [];
        brands.forEach((item, index) => {
            brandOpts.push(<Option key={"brand" + index} value={item.id + ""} >{item.brandName}</Option>)
        });

        const uploadProps ={
            accept:"image/*",
            action: "//chuangshouji.com/cphone/phone/uploadFile/",
            listType: 'picture',
            defaultFileList: [],
            className: 'upload-list-inline',
            name: "productFile",
            onChange: (file,fileList)=>{
                console.log(file);
            }
        }
        return (
            <PageHeaderLayout title="热门回收手机管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            <FormItem label="品牌筛选">
                                <Select style={{ width: 120 }} defaultValue={'1'} onChange={this.handleGetPhones} >{brandOpts}</Select>
                            </FormItem>
                        </div>
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
                    onOk={this.handleQues}
                    onCancel={() => this.handleQuesVisible()}
                    confirmLoading={quesOperation}
                >
                    {this.getQuesById()}
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
                        <Select style={{ width: 120 }} onChange={this.handleModelId}>{brandOpts}</Select>
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
                        label="可回收"
                    >
                        <RadioGroup onChange={this.onChangeIsUseRecycle} value={addPhone.isUseRecycle}>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="是热门"
                    >
                    <RadioGroup onChange={this.onChangeIsUseHotRecycle} value={addPhone.isUseHotRecycle}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="图片地址"
                    >
                        <Input placeholder="请输入图片地址" value={addPhone.url} onChange={this.handleUrl} />
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
