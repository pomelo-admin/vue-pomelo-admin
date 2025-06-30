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
    {
      path: 'heat-map',
      name: 'HeatMap',
      component: () => import('@/views/features/heat-map/index.vue'),
      meta: {
        title: 'heatMap',
        icon: 'MapLocation',
      },
    },
    {
      path: 'pdf-viewer',
      name: 'PdfViewer',
      component: () => import('@/views/features/pdf-viewer/index.vue'),
      meta: {
        title: 'pdfViewer',
        icon: 'Document',
      },
    },
    {
      path: 'debounced-search-select',
      name: 'DebouncedSearchSelect',
      component: () => import('@/views/features/debounced-search-select/index.vue'),
      meta: {
        title: 'debouncedSearchSelect',
        icon: 'Search',
      },
    },
    {
      path: 'throttled-search-select',
      name: 'ThrottledSearchSelect',
      component: () => import('@/views/features/throttled-search-select/index.vue'),
      meta: {
        title: 'throttledSearchSelect',
        icon: 'Timer',
      },
    },
    {
      path: 'rich-text-editor',
      name: 'RichTextEditor',
      component: () => import('@/views/features/rich-text-editor/index.vue'),
      meta: {
        title: 'richTextEditor',
        icon: 'EditPen',
      },
    },
    {
      path: 'code-editor',
      name: 'CodeEditor',
      component: () => import('@/views/features/code-editor/index.vue'),
      meta: {
        title: 'codeEditor',
        icon: 'Document',
      },
    },
  ],
};

export default featuresRoutes;
