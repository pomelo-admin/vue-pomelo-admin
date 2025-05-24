import type { RouteRecordRaw } from 'vue-router';

// 功能示例相关路由
const featuresRoutes: RouteRecordRaw = {
  path: '/features',
  name: 'Features',
  component: () => import('@/layout/index.vue'),
  redirect: '/features/slider-captcha',
  meta: {
    title: 'features',
    icon: 'Grid',
    alwaysShow: true,
  },
  children: [
    {
      path: 'slider-captcha',
      name: 'SliderCaptcha',
      component: () => import('@/views/features/slider-captcha/index.vue'),
      meta: {
        title: 'sliderCaptcha',
        icon: 'Connection',
      },
    },
  ],
};

export default featuresRoutes;
