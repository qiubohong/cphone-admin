import BasicLayout from '../layouts/BasicLayout';

import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

import Brand from '../routes/phone/Brand';
import RecyclePhone from '../routes/recycle/RecyclePhone';
import RecycleQues from '../routes/recycle/RecycleQues';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: '手机管理',
    icon: 'mobile',
    path: 'mobile',
    children: [{
      name: '手机品牌',
      path: 'brand',
      component: Brand,
    }],
  },{
    name: '回收管理',
    icon: 'retweet',
    path: 'recycle',
    children: [{
      name: '回收机型',
      path: 'phone',
      component: RecyclePhone,
    },{
      name: '回收问题',
      path: 'ques',
      component: RecycleQues,
    }, {
      name: '回收订单',
      path: 'monitor',
      component: RecyclePhone,
    }, {
      name: '工作台',
      path: 'workplace',
      component: RecyclePhone,
    }],
  }],
}];

export function getNavData() {
  return data;
}

export default data;
