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
        name: '查询表格',
        icon: 'bars',
        path: 'table-list',
        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
      },{
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
          icon: 'mobile',
          path: 'phone',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        },{
          name: '订单管理',
          icon: 'mobile',
          path: 'order',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        }],
      },{
        name: '维修管理',
        icon: 'tool',
        path: 'repair',
        children: [{
          name: '手机管理',
          icon: 'mobile',
          path: 'phone',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        },{
          name: '订单管理',
          icon: 'mobile',
          path: 'order',
          component: dynamicWrapper(app, ['brand','recycle'], () => import('../routes/recycle/RecyclePhone')),
        }],
      },
    ],
  },
];

