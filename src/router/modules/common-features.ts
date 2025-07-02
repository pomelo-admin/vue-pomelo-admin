import type { RouteRecordRaw } from 'vue-router';

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
    {
      path: 'white-board',
      name: 'WhiteBoard',
      component: () => import('@/views/common-features/white-board/index.vue'),
      meta: {
        title: 'whiteBoard',
        icon: 'Edit',
      },
    },
    {
      path: 'outside-page',
      name: 'OutsidePage',
      component: () => import('@/views/common-features/outside-page/index.vue'),
      meta: {
        title: 'outsidePage',
        icon: 'Link',
      },
    },
  ],
};

export default commonFeaturesRoutes;
