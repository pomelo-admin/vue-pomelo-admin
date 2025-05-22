import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import i18n from '@/locales';
// 导入路由配置，所有路由模块已在routes.ts中聚合
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// 进度条配置
NProgress.configure({ showSpinner: false });

// 白名单
const whiteList = [
  '/login',
  '/register',
  '/forgot-password',
  '/404',
  '/403',
  '/500',
  '/error/404',
  '/error/403',
  '/error/500',
  '/dashboard',
  '/dashboard/index',
];

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 启动进度条
  NProgress.start();

  // 设置页面标题
  const title = to.meta.title ? i18n.global.t(`menu.${to.meta.title as string}`) : '';
  const appTitle = i18n.global.t('common.appTitle');
  document.title = title ? `${title} | ${appTitle}` : appTitle;

  const hasToken = getToken();

  // 检查是否是错误页面模块路由或控制台页面
  const isErrorModulePage = to.path.startsWith('/error/');
  const isDashboardPage = to.path === '/dashboard' || to.path === '/dashboard/index';

  if (isErrorModulePage || isDashboardPage) {
    // 特殊处理控制台首页
    if (to.path === '/dashboard') {
      next('/dashboard/index');
      return;
    }
    next();
    return;
  }

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，重定向到首页
      next({ path: '/' });
      NProgress.done();
    } else {
      // 获取用户信息和权限信息
      const userStore = useUserStore();
      const permissionStore = usePermissionStore();
      const hasRoles = userStore.userInfo.roles && userStore.userInfo.roles.length > 0;

      if (hasRoles) {
        // 检查用户是否有权限访问此路由
        if (to.meta && to.meta.permission) {
          const permissions = to.meta.permission as string[];
          const hasPermission = permissions.some(p => permissionStore.hasPermission(p));
          if (!hasPermission && to.path !== '/403') {
            next('/403'); // 如果没权限，跳转到403页面
            NProgress.done();
            return;
          }
        }
        next();
      } else {
        try {
          // 获取用户信息
          await userStore.getUserInfoAction();

          // 初始化权限信息
          await permissionStore.initPermissions();

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
