import type { RouteRecordRaw } from 'vue-router';

// 低代码相关路由
const lowcodeRoutes: RouteRecordRaw = {
  path: '/lowcode',
  name: 'Lowcode',
  component: () => import('@/layout/index.vue'),
  redirect: '/lowcode/form-generator',
  meta: {
    title: 'lowcode',
    icon: 'Edit',
    alwaysShow: true,
  },
  children: [
    {
      path: 'form-generator',
      name: 'FormGenerator',
      component: () => import('@/views/lowcode/form-generator/index.vue'),
      meta: {
        title: 'formGenerator',
        icon: 'DataLine',
      },
    },
  ],
};

export default lowcodeRoutes;
