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
        icon: 'mobile',
        path: 'table-list',
        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
      },{
        name: '手机管理',
        icon: 'android',
        path: 'mobile',
        children: [{
          name: '手机品牌',
          path: 'brand',
          component: dynamicWrapper(app, ['brand'], () => import('../routes/phone/Brand')),
        }],
      },
    ],
  },
];

