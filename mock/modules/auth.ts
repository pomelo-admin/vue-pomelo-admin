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
      const { username } = body;

      // 简单的身份验证逻辑
      if (username === 'admin') {
        return {
          code: 200,
          data: {
            token: 'mock-token-admin',
          },
          message: '登录成功',
        };
      } else if (username === 'user') {
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
    url: '/auth/user-info',
    method: 'get',
    timeout: 300,
    response: ({ headers }: RequestParams) => {
      console.log(headers);
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
] as MockMethod[];
