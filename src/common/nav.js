import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '品牌管理',
        icon: 'bars',
        path: 'brand',
        component: dynamicWrapper(app, ['brand'], () => import('../routes/phone/Brand')),
      },{
        name: '回收管理',
        icon: 'retweet',
        path: 'recycle',
        children: [{
          name: '回收手机',
          path: 'phone1',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        },{
          name: '回收订单',
          path: 'order1',
          component: dynamicWrapper(app, ['recycleOrder','customer','recycle','producer'], () => import('../routes/recycle/RecycleOrder')),
        },{
          name: '新建订单',
          path: 'new1',
          component: dynamicWrapper(app, ['recycleOrder','customer','recycle','producer'], () => import('../routes/recycle/NewOrder')),
        }],
      },{
        name: '维修管理',
        icon: 'tool',
        path: 'repair',
        children: [{
          name: '维修手机',
          path: 'phone',
          component: dynamicWrapper(app, ['brand','maintain'], () => import('../routes/maintain/MaintainPhone')),
        },{
          name: '维修订单',
          path: 'order',
          component: dynamicWrapper(app, ['maintainOrder','customer','maintain','producer'], () => import('../routes/maintain/MaintainOrder')),
        }],
      },
      {
        name: '用户管理',
        icon: 'user',
        path: 'customer',
        component: dynamicWrapper(app, ['customer'], () => import('../routes/customer/Customer')),
      },
      {
        name: '服务方管理',
        icon: 'customer-service',
        path: 'service',
        children:[
          {
            name:"工作人员",
            path: 'producer',
            component: dynamicWrapper(app, ['producer'], () => import('../routes/producer/Producer')),
          },
          {
            name:"门店管理",
            path: 'store',
            component: dynamicWrapper(app, ['store','producer'], () => import('../routes/producer/Store')),
          },
          {
            name:"奖品管理",
            path: 'prize',
            component: dynamicWrapper(app, ['prize'], () => import('../routes/producer/Prize')),
          }
        ]
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          }
        ],
      },
    ],
  },
];

