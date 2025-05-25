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
    {
      path: 'digit-captcha',
      name: 'DigitCaptcha',
      component: () => import('@/views/features/digit-captcha/index.vue'),
      meta: {
        title: 'digitCaptcha',
        icon: 'Tickets',
      },
    },
    {
      path: 'json-editor',
      name: 'JsonEditor',
      component: () => import('@/views/features/json-editor/index.vue'),
      meta: {
        title: 'jsonEditor',
        icon: 'Edit',
      },
    },
    {
      path: 'json-visualizer',
      name: 'JsonVisualizer',
      component: () => import('@/views/features/json-visualizer/index.vue'),
      meta: {
        title: 'jsonVisualizer',
        icon: 'View',
      },
    },
  ],
};

export default featuresRoutes;
