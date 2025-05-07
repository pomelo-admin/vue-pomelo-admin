import type { RouteRecordRaw } from 'vue-router';

const dashboardRoutes: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layout/index.vue'),
  redirect: '/dashboard/index',
  meta: { title: 'dashboard', icon: 'DataBoard', alwaysShow: true },
  children: [
    {
      path: 'index',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: 'dashboard', icon: 'DataBoard' }
    }
  ]
};

export default dashboardRoutes; 