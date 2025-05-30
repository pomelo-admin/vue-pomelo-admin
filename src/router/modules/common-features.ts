import type { RouteRecordRaw } from 'vue-router';

// 常用功能相关路由
const commonFeaturesRoutes: RouteRecordRaw = {
  path: '/common-features',
  name: 'CommonFeatures',
  component: () => import('@/layout/index.vue'),
  redirect: '/common-features/watermark',
  meta: {
    title: 'commonFeatures',
    icon: 'Star',
    alwaysShow: true,
  },
  children: [
    {
      path: 'watermark',
      name: 'Watermark',
      component: () => import('@/views/common-features/watermark/index.vue'),
      meta: {
        title: 'watermark',
        icon: 'Stamp',
      },
    },
    // 可以在这里添加更多常用功能路由
  ],
};

export default commonFeaturesRoutes;
