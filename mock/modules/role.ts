import type { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import type { RequestParams } from '../types';
const { Random } = Mock;

// 角色类型定义
interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// 权限类型定义
interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 生成权限数据
const generatePermissions = (): Permission[] => {
  return [
    {
      id: '1',
      name: '仪表盘查看',
      code: 'read:dashboard',
      description: '允许查看仪表盘',
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
    {
      id: '2',
      name: '仪表盘编辑',
      code: 'write:dashboard',
      description: '允许编辑仪表盘',
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
    {
      id: '3',
      name: '用户管理',
      code: 'manage:users',
      description: '允许管理用户',
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
    {
      id: '4',
      name: '角色管理',
      code: 'manage:roles',
      description: '允许管理角色',
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
    {
      id: '5',
      name: '权限管理',
      code: 'manage:permissions',
      description: '允许管理权限',
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
  ];
};

// 生成角色数据
const generateRoles = (): Role[] => {
  return [
    {
      id: '1',
      name: '管理员',
      code: 'admin',
      description: '系统管理员，拥有所有权限',
      permissions: [
        'read:dashboard',
        'write:dashboard',
        'manage:users',
        'manage:roles',
        'manage:permissions',
      ],
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
    {
      id: '2',
      name: '普通用户',
      code: 'user',
      description: '普通用户，拥有基本权限',
      permissions: ['read:dashboard'],
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
    {
      id: '3',
      name: '编辑者',
      code: 'editor',
      description: '内容编辑者，拥有编辑权限',
      permissions: ['read:dashboard', 'write:dashboard'],
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    },
  ];
};

const permissions = generatePermissions();
const roles = generateRoles();

export default [
  // 获取角色列表
  {
    url: '/role/list',
    method: 'get',
    timeout: 300,
    response: ({ query }: RequestParams) => {
      const { page = 1, pageSize = 10 } = query;

      const pageRoles = roles.slice((page - 1) * pageSize, page * pageSize);

      return {
        code: 200,
        data: {
          list: pageRoles,
          total: roles.length,
          page: Number(page),
          pageSize: Number(pageSize),
        },
        message: '获取成功',
      };
    },
  },

  // 获取权限列表
  {
    url: '/permission/list',
    method: 'get',
    timeout: 300,
    response: ({ query }: RequestParams) => {
      const { page = 1, pageSize = 10 } = query;

      const pagePermissions = permissions.slice((page - 1) * pageSize, page * pageSize);

      return {
        code: 200,
        data: {
          list: pagePermissions,
          total: permissions.length,
          page: Number(page),
          pageSize: Number(pageSize),
        },
        message: '获取成功',
      };
    },
  },

  // 获取角色详情
  {
    url: '/role/:id',
    method: 'get',
    timeout: 200,
    response: ({ params }: RequestParams) => {
      const { id } = params;
      const role = roles.find(role => role.id === id);

      if (role) {
        return {
          code: 200,
          data: role,
          message: '获取成功',
        };
      }

      return {
        code: 404,
        message: '角色不存在',
        data: null,
      };
    },
  },

  // 分配角色权限
  {
    url: '/role/assign-permissions',
    method: 'post',
    timeout: 300,
    response: ({ body }: RequestParams) => {
      const { roleId, permissionCodes } = body;
      const roleIndex = roles.findIndex(role => role.id === roleId);

      if (roleIndex === -1) {
        return {
          code: 404,
          message: '角色不存在',
          data: null,
        };
      }

      // 更新角色权限
      roles[roleIndex].permissions = permissionCodes;

      return {
        code: 200,
        data: roles[roleIndex],
        message: '权限分配成功',
      };
    },
  },
] as MockMethod[];
