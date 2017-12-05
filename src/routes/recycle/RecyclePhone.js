import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal, Spin, message, notification, Radio } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;

const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

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
            totalPrice: '',
            isUseRecycle: 1,
            isUseHotRecycle: 1
        },
        modalVisible: false,
        operation: false,
        quesVisible: false,
        quesOperation: false
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
        let { addPhone } = this.state;
        addPhone.name = e.target.value;
        this.setState({
            addPhone: addPhone
        });
    }
    onChangeIsUseRecycle = (e) => {
        let { addPhone } = this.state;
        addPhone.isUseRecycle = e.target.value;
        this.setState({
            addPhone: addPhone
        });
    }
    onChangeIsUseHotRecycle = (e) => {
        let { addPhone } = this.state;
        addPhone.isUseHotRecycle = e.target.value;
        this.setState({
            addPhone: addPhone
        });
    }
    handleUrl = (e) => {
        let { addPhone } = this.state;
        addPhone.url = e.target.value;
        this.setState({
            addPhone: addPhone
        });
    }
    handleModelId = (value) => {
        let { addPhone } = this.state;
        addPhone.modelId = e.target.value;
        this.setState({
            addPhone: addPhone
        });
    }
    handleTotalPrice = (e) => {
        let { addPhone } = this.state;
        addPhone.totalPrice = e.target.value;
        this.setState({
            addPhone: addPhone
        });
    }
    handleAdd = () => {
        const { addPhone: { name, url, modelId, totalPrice } } = this.state;
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
    handleQues() {

    }
    handleDelete() {
        notification.warn({
            message: '创手机后台提示您',
            description: '该功能还在开发中...',
        });
    }

    render() {
        const { recycle: { loading, data }, brands } = this.props;
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
                    console.log(val)
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
                dataIndex: 'url',
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
                    let result = <Button type="normal" onClick={this.handleQues}>编辑</Button>;
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

        return (
            <PageHeaderLayout title="热门回收手机管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
                            <div style={{ margin: "20px 0" }}>
                                <Select style={{ width: 120 }} defaultValue={'1'} onChange={this.handleGetPhones} >{brandOpts}</Select>
                            </div>
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
                    <RadioGroup onChange={this.onChangeIsUseRecycle} value={addPhone.isUseRecycle}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                    <RadioGroup onChange={this.onChangeIsUseHotRecycle} value={addPhone.isUseHotRecycle}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="图片地址"
                    >
                        <Input placeholder="请输入图片地址" value={addPhone.url} onChange={this.handleUrl} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="最高回收价格"
                    >
                        <InputNumber
                            defaultValue={1000}
                            placeholder="请输入回收价格" value={addPhone.totalPrice} onChange={this.handleTotalPrice} />
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
