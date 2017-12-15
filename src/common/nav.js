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
          name: '手机管理',
          path: 'phone',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        },{
          name: '订单管理',
          path: 'order',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        }],
      },{
        name: '维修管理',
        icon: 'tool',
        path: 'repair',
        children: [{
          name: '手机管理',
          path: 'phone',
          component: dynamicWrapper(app, ['brand','maintain'], () => import('../routes/maintain/MaintainPhone')),
        },{
          name: '订单管理',
          path: 'order',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
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
          }
        ]
      },
    ],
  },
];

