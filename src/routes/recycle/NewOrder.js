import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {List, DatePicker, Radio, Card, Form, Input, Select, Icon, Button, InputNumber, Table, Modal,Spin , message } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../Table.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const {confirm} = Modal;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
    recycle: state.recycle,
    recycleOrder: state.recycleOrder,
}))
@Form.create()
export default class NewOrder extends PureComponent {
    state = {
        addNewOrder: {
            "customerId":"",
            "recyclePhoneId": "",
            "serviceType": "",
            "storeId": "",
            "address": "",
            "period": "",
            "expressCompany": "",
            "expressNumber": "",
            "iphonePasswd": "",
            "remark": "",
        },
        modalVisible: false,
        loading: false,

        customerVisible: false,
        customerLoading: false,
        customerSelect: {},

        phones: [],
        phoneVisible:false,
        phoneLoading: false,
        phoneSelect:{},
        phoneStep: 1,
        phoneProblems:[],
    };

    componentDidMount() {
        
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }
    
    handleChange(e,key){
        let {addNewOrder} = this.state;
        addNewOrder[key] = e.target.value;
        this.setState({
            addNewOrder:{
                ...addNewOrder
            }
        })
    }
    onPeriodChange(value, string){
        //console.log(value.format("YYYY-MM-DD HH:mm"))
        let {addNewOrder} = this.state;
        addNewOrder["period"] = value;
        this.setState({
            addNewOrder:{
                ...addNewOrder
            }
        })
    }
    submitForm(){
        this.setState({
            loading : true
        })
        confirm({
            title: '订单提交成功！',
            content: '是否再来一单？',
            okText: '再来一单',
            okType: 'primary',
            cancelText: '不了',
            onOk:() => {
                this.setState({
                  loading : false
                })
            },
            onCancel:() =>{
                this.setState({
                    loading : false
                })
            },
          });
    }

    openPhone(){
        this.setState({
            phoneVisible: true,
            phoneLoading: true
        })

        this.props.dispatch({
            type: 'recycle/query',
            payload: {
                startIndex:0,
                pageSize:1000
            },
            callback:(data)=>{
                this.setState({
                    phoneLoading: false,
                    phones: [
                        ...data
                    ]
                })
            }
        });
    }
    handlePhone(e){
        this.state.phones.forEach((item)=>{
            if(item.id == e.target.value){
                this.setState({
                    phoneSelect:{
                        ...item
                    }
                })
            }
        })
    }
    nextPhone(){
        if(!this.state.phoneSelect.id){
            message.error("请选择手机！")
            return;
        }
        this.setState({
            phoneLoading:true,
            phoneStep:2
        })
        this.props.dispatch({
            type:"recycle/queryProblem",
            payload:{
                pageSize: 100,
                startIndex: 0,
                recyclePhoneId: this.state.phoneSelect.id
            },
            callback: (res)=>{
                this.setState({
                    phoneLoading:false,
                })
            }
        })
    }

    render() {
        const { recycleOrder, recycle} = this.props;
        const { modalVisible, addNewOrder, loading, 
            customerSelect,
            customerLoading,
            customerVisible,

            phones,
            phoneVisible,
            phoneLoading,
            phoneSelect,
            phoneStep,

        } = this.state;
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
            "storeId":"门店信息",
        };
        let getForm = ()=>{
            let temp = [];
            for(let key in addNewOrder){
                let edit = <Input value={addNewOrder[key]} onChange={(e)=>{this.handleChange(e,key)}} />
                if(key == 'customerId'){
                    edit = <Button type="primary" onClick={()=>{this.openCustomer()}}>
                        {
                            customerSelect.id ? "("+customerSelect.name+")" : "选择用户"
                        }
                    </Button>
                }

                if(key == 'recyclePhoneId'){
                    edit = <Button type="primary" onClick={()=>{this.openPhone()}}>{
                        phoneSelect.id ? phoneSelect.name : "选择手机"
                    }</Button>
                }

                if(key == 'storeId'){
                    edit = <Button type="primary">选择门店</Button>
                }

                if(key == 'serviceType'){
                    edit = <RadioGroup onChange={(e)=>{this.handleChange(e,key)}} value={addNewOrder[key]}>
                        <Radio value={1}>门店</Radio>
                        <Radio value={2}>指定服务</Radio>
                        <Radio value={3}>邮寄</Radio>
                    </RadioGroup>
                }

                if(key == 'period'){
                    edit = <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        value={addNewOrder[key]}
                        placeholder="预约时间"
                        onChange={(value, string)=>{this.onPeriodChange(value, string)}}
                    />
                }

                if(key == 'remark'){
                    edit = <TextArea value={addNewOrder[key]} onChange={(e)=>{this.handleChange(e,key)}} rows={4}/>
                }
                var formItem = (<FormItem
                        key = {'add'+key}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        label={key2Name[key]}
                    >
                        {edit}
                </FormItem>);
                
                temp.push(formItem)
            }

            return temp;
        }
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };
        let searchPhone = (value)=>{
            let result = recycle.data.filter((item)=>{
                return item.name.indexOf(value) >= 0;
            })
            this.setState({
                phones:[...result]
            })
        }
        return (
            <PageHeaderLayout title="新建订单">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                        </div>
                        <Form>
                            {getForm()}
                            <FormItem {...tailFormItemLayout}>
                                <Button style={{width:'50%'}} loading={loading} size={'large'} type="primary" onClick={()=>{this.submitForm()}}>保存</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
                <Modal
                    title="选择手机"
                    okText = "下一步"
                    visible={phoneVisible}
                    onOk={()=>{ this.nextPhone()}}
                    onCancel={() => { 
                        this.setState({
                            phoneVisible:false, 
                            phoneSelect:{},
                            phoneStep:1,
                        })}}
                    >
                    <Spin spinning={phoneLoading}>
                    {
                        phoneStep == 1?<div>
                        <Search
                            placeholder="请输入要搜索的手机号"
                            onSearch={value => {searchPhone(value)}}
                            enterButton
                        />
                        <div style={{margin:"8px 0px"}}>选中手机：{phoneSelect.name}</div>
                        <RadioGroup onChange={(e)=>{this.handlePhone(e)}} style={{display:"block", marginTop:8}}>
                            <List
                                bordered
                                dataSource={phones}
                                renderItem={item => (<List.Item><Radio value={item.id}>{item.name}</Radio></List.Item>)}
                            />
                        </RadioGroup>
                    </div>
                     : 
                     <div>
                     选择问题
                     </div>
                    }   
                    </Spin>
                </Modal>
            </PageHeaderLayout>
        );
    }
}
