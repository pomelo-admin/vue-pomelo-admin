import type { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import type { RequestParams } from '../types';
const { Random } = Mock;

export default [
  // 用户登录
  {
    url: '/auth/login',
    method: 'post',
    timeout: 500,
    response: ({ body }: RequestParams) => {
      const { username, password } = body;

      // 简单的身份验证逻辑
      if (username === 'admin' && password === 'admin123') {
        return {
          code: 200,
          data: {
            token: 'mock-token-admin',
          },
          message: '登录成功',
        };
      } else if (username === 'user' && password === 'user123') {
        return {
          code: 200,
          data: {
            token: 'mock-token-user',
          },
          message: '登录成功',
        };
      }

      return {
        code: 401,
        message: '用户名或密码错误',
        data: null,
      };
    },
  },

  // 获取用户信息
  {
    url: '/user/info',
    method: 'get',
    timeout: 300,
    response: ({ headers }: RequestParams) => {
      const token = headers?.authorization?.replace('Bearer ', '');

      if (token === 'mock-token-admin') {
        return {
          code: 200,
          data: {
            id: '1',
            username: 'admin',
            avatar: Random.image('100x100', '#4A7BF7', '#fff', 'Admin'),
            roles: ['admin'],
            permissions: ['*'],
          },
          message: '获取成功',
        };
      } else if (token === 'mock-token-user') {
        return {
          code: 200,
          data: {
            id: '2',
            username: 'user',
            avatar: Random.image('100x100', '#1EBBEE', '#fff', 'User'),
            roles: ['user'],
            permissions: ['read:dashboard'],
          },
          message: '获取成功',
        };
      }

      return {
        code: 401,
        message: '未授权',
        data: null,
      };
    },
  },

  // 登出
  {
    url: '/auth/logout',
    method: 'post',
    timeout: 200,
    response: () => {
      return {
        code: 200,
        data: null,
        message: '登出成功',
      };
    },
  },

  // 刷新令牌
  {
    url: '/auth/refresh-token',
    method: 'post',
    timeout: 300,
    response: ({ headers }: RequestParams) => {
      const token = headers?.authorization?.replace('Bearer ', '');

      if (token && (token === 'mock-token-admin' || token === 'mock-token-user')) {
        return {
          code: 200,
          data: {
            token: `${token}-refreshed`,
          },
          message: '令牌刷新成功',
        };
      }

      return {
        code: 401,
        message: '令牌无效',
        data: null,
      };
    },
  },

  // 修改密码
  {
    url: '/auth/change-password',
    method: 'post',
    timeout: 400,
    response: ({ body, headers }: RequestParams) => {
      const { oldPassword, newPassword } = body;
      const token = headers?.authorization?.replace('Bearer ', '');

      // 验证令牌
      if (!token || (token !== 'mock-token-admin' && token !== 'mock-token-user')) {
        return {
          code: 401,
          message: '未授权',
          data: null,
        };
      }

      // 简单的密码验证逻辑
      if (token === 'mock-token-admin' && oldPassword === 'admin123') {
        return {
          code: 200,
          data: null,
          message: '密码修改成功',
        };
      } else if (token === 'mock-token-user' && oldPassword === 'user123') {
        return {
          code: 200,
          data: null,
          message: '密码修改成功',
        };
      }

      return {
        code: 400,
        message: '原密码错误',
        data: null,
      };
    },
  },
] as MockMethod[];
