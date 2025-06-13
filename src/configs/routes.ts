/**
 * 路由相关配置
 */

// 公共路由路径（无需登录即可访问的路由）
export const publicRoutes = ['/login', '/register', '/forgot-password'];

// 默认路由（登录后的默认跳转路径）
export const defaultRoute = '/dashboard';

// 登录路由（用于未登录时重定向）
export const loginRoute = '/login';

// 404路由（页面不存在时的跳转路径）
export const notFoundRoute = '/404';

// 无权限路由（无权限访问时的跳转路径）
export const forbiddenRoute = '/403';
