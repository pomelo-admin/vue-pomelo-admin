// 导出认证相关 API
export * from './modules/auth';

// 导出角色相关 API
export * from './modules/role';

// 导出用户相关 API
export * from './modules/user';

// 导出仪表盘相关 API
export * from './modules/dashboard';

// 导出通用接口，解决命名冲突
export { type ApiResponse } from './modules/role';
export { type ListResponse } from './modules/role';
