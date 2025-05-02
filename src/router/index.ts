import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard/index',
    meta: { title: '控制台', icon: 'dashboard' },
    children: [
      {
        path: 'index',
        name: 'DashboardIndex',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// 进度条配置
NProgress.configure({ showSpinner: false });

// 白名单
const whiteList = ['/login', '/404'];

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 启动进度条
  NProgress.start();

  // 设置页面标题
  document.title = `${to.meta.title || ''} - ${import.meta.env.VITE_APP_TITLE}`;

  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，重定向到首页
      next({ path: '/' });
      NProgress.done();
    } else {
      // 获取用户信息
      const userStore = useUserStore();
      const hasRoles = userStore.userInfo.roles && userStore.userInfo.roles.length > 0;
      
      if (hasRoles) {
        next();
      } else {
        try {
          // 获取用户信息
          await userStore.getUserInfoAction();
          
          // 此处可根据用户角色动态添加路由
          
          // 确保路由完成
          next({ ...to, replace: true });
        } catch (error) {
          // 获取用户信息失败，重置Token并跳转登录页
          userStore.resetState();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 白名单路由放行
      next();
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

// 全局后置守卫
router.afterEach(() => {
  NProgress.done();
});

export default router; 