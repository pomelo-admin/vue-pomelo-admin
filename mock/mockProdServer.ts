import { createProdMockServer } from 'vite-plugin-mock/client';

// 导入所有模块的 mock 数据
import userMock from './modules/user';
import roleMock from './modules/role';
import dashboardMock from './modules/dashboard';

export function setupProdMockServer() {
  createProdMockServer([...userMock, ...roleMock, ...dashboardMock]);
}
