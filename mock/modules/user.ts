import type { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import type { RequestParams } from '../types';
const { Random } = Mock;

// 用户类型定义
interface User {
  id: string;
  username: string;
  avatar: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 生成用户数据
const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: Random.id(),
      username: Random.name(),
      avatar: Random.image('100x100', Random.color(), '#fff', 'Avatar'),
      email: Random.email(),
      phone: '13800138000',
      roles: ['user'],
      permissions: ['read:dashboard'],
      status: Random.boolean() ? 'active' : 'inactive',
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    });
  }
  // 添加一个管理员用户
  users.push({
    id: '1',
    username: 'admin',
    avatar: Random.image('100x100', '#4A7BF7', '#fff', 'Admin'),
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    permissions: ['read:dashboard', 'write:dashboard', 'manage:users'],
    status: 'active',
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  });
  return users;
};

const users = generateUsers(20);

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

  // 获取用户列表
  {
    url: '/user/list',
    method: 'get',
    timeout: 500,
    response: ({ query }: RequestParams) => {
      const { page = 1, pageSize = 10 } = query;

      const pageUsers = users.slice((page - 1) * pageSize, page * pageSize);

      return {
        code: 200,
        data: {
          list: pageUsers,
          total: users.length,
          page: Number(page),
          pageSize: Number(pageSize),
        },
        message: '获取成功',
      };
    },
  },
] as MockMethod[];
