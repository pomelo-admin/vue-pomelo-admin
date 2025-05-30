import type { RouteRecordRaw } from 'vue-router';
import commonRoutes from './modules/common';
import dashboardRoutes from './modules/dashboard';
import errorRoutes from './modules/error';
import systemRoutes from './modules/system';
import featuresRoutes from './modules/features';
import lowcodeRoutes from './modules/lowcode';
import commonFeaturesRoutes from './modules/common-features';

// 将独立的错误页面路由和通配符路由从 commonRoutes 中分离出来
const notFoundRoute = commonRoutes.find(route => route.path === '/:pathMatch(.*)*');
const errorPageRoutes = commonRoutes.filter(route => ['/404', '/403', '/500'].includes(route.path));
const filteredCommonRoutes = commonRoutes.filter(
  route => !['/:pathMatch(.*)*', '/404', '/403', '/500'].includes(route.path)
);

// 路由配置：先加载常规路由，然后加载错误页面模块路由，再加载独立的错误页面路由，最后加载通配符路由
const routes: RouteRecordRaw[] = [
  ...filteredCommonRoutes,
  dashboardRoutes,
  errorRoutes,
  ...errorPageRoutes,
  systemRoutes,
  featuresRoutes,
  commonFeaturesRoutes,
  lowcodeRoutes,
];

// 将通配符路由添加到最后
if (notFoundRoute) {
  routes.push(notFoundRoute);
}

export default routes;
