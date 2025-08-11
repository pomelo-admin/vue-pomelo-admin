import type { RouteRecordRaw } from 'vue-router';

const dashboardRoutes: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layout/index.vue'),
  meta: { title: 'dashboard', icon: 'DataBoard' },
  children: [
    {
      path: '',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: 'dashboard', icon: 'DataBoard', activeMenu: '/dashboard', breadcrumb: false },
    },
  ],
};

export default dashboardRoutes;
