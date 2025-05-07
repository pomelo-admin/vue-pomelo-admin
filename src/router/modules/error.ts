import type { RouteRecordRaw } from 'vue-router';

const errorRoutes: RouteRecordRaw = {
  path: '/error',
  name: 'Error',
  component: () => import('@/layout/index.vue'),
  redirect: '/error/404',
  meta: { 
    title: 'error', 
    icon: 'Warning',
    alwaysShow: true,
  },
  children: [
    {
      path: '403',
      name: 'Page403',
      component: () => import('@/views/error/403.vue'),
      meta: { 
        title: 'forbidden', 
        icon: 'WarningFilled',
      }
    },
    {
      path: '404',
      name: 'Page404',
      component: () => import('@/views/error/404.vue'),
      meta: { 
        title: 'notFound', 
        icon: 'CircleCloseFilled',
      }
    },
    {
      path: '500',
      name: 'Page500',
      component: () => import('@/views/error/500.vue'),
      meta: { 
        title: 'serverError', 
        icon: 'WarnTriangleFilled',
      }
    }
  ]
};

export default errorRoutes; 