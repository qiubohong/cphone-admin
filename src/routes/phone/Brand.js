import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    brand: state.brand,
}))
@Form.create()
export default class Brand extends PureComponent {
    state = {
        addBrand: {
            brandName: '',
            picUrl: ''
        },
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        operation: false
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'brand/fetch',
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }
    handleBrandName = (e) => {
        let picUrl = this.state.addBrand.picUrl
        this.setState({
            addBrand: {
                brandName: e.target.value,
                picUrl
            }
        });
    }
    handlePicUrl = (e) => {
        let brandName = this.state.addBrand.brandName
        this.setState({
            addBrand: {
                brandName,
                picUrl: e.target.value
            }
        });
    }
    handleAdd = () => {
        const { addBrand: { brandName, picUrl } } = this.state;
        this.setState({
            operation:true
        })
        this.props.dispatch({
            type: 'brand/add',
            payload: {
                brandName,
                url:picUrl,
            },
            callback: () => {
                this.setState({
                    operation:false
                })
                message.success('添加成功');
                this.setState({
                    modalVisible: false,
                });
                this.props.dispatch({
                    type: 'brand/fetch',
                });
            }
        });


    }

    render() {
        const { brand: { loading, data } } = this.props;
        const { selectedRows, modalVisible, addBrand, operation } = this.state;
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
            },
            {
                title: '名称',
                dataIndex: 'brandName',
            },
            {
                title: '图片',
                dataIndex: 'picUrl',
                render: val => (
                    val ? <img src={val.indexOf('http') == 0 ? val : 'http://' + val} style={{ height: 60 }} /> : '无图片'
                ),
            }
        ];

        return (
            <PageHeaderLayout title="手机品牌管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>
                            {
                                selectedRows.length > 0 && (
                                    <span>
                                        <Button>批量操作</Button>
                                        <Dropdown overlay={menu}>
                                            <Button>
                                                更多操作 <Icon type="down" />
                                            </Button>
                                        </Dropdown>
                                    </span>
                                )
                            }
                        </div>
                        <Table
                            rowKey={record => record.id}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    </div>
                </Card>
                <Modal
                    title="添加新品牌"
                    visible={modalVisible}
                    onOk={this.handleAdd}
                    onCancel={() => this.handleModalVisible()}
                    confirmLoading = {operation}
                >
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="品牌名称"
                    >
                        <Input placeholder="请输入品牌名称" onChange={this.handleBrandName} value={addBrand.brandName} />
                    </FormItem>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label="图片地址"
                    >
                        <Input placeholder="请输入图片地址" onChange={this.handlePicUrl} value={addBrand.picUrl} />
                    </FormItem>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
