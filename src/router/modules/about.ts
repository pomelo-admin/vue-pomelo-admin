import type { RouteRecordRaw } from 'vue-router';

const aboutRoutes: RouteRecordRaw = {
  path: '/about',
  name: 'About',
  component: () => import('@/layout/index.vue'),
  meta: { title: 'about', icon: 'InfoFilled' },
  children: [
    {
      path: '',
      name: 'AboutIndex',
      component: () => import('@/views/about/index.vue'),
      meta: { title: 'about', icon: 'InfoFilled', activeMenu: '/about', breadcrumb: false },
    },
  ],
};

export default aboutRoutes;
