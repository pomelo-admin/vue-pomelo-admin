import type { RouteRecordRaw } from 'vue-router';

// 基础路由，包括登录页、根路径重定向和错误页面
const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: { hidden: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'login', hidden: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: { title: 'register', hidden: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/forgot-password/index.vue'),
    meta: { title: 'forgotPassword', hidden: true },
  },
  // 独立的错误页面路由
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: 'notFound', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: 'forbidden', hidden: true },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500.vue'),
    meta: { title: 'serverError', hidden: true },
  },
  // 通配符路由，匹配所有未匹配的路径
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error/404',
    meta: { hidden: true },
  },
];

export default commonRoutes;
