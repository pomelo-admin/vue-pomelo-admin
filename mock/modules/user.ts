import type { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import type { RequestParams } from '../types';
const { Random } = Mock;

// 用户类型定义
interface User {
  id: string;
  username: string;
  realName: string;
  avatar: string;
  email: string;
  phone: string;
  roles: string[];
  status: number; // 0-禁用，1-启用
  department?: string;
  position?: string;
  createTime: string;
  updateTime: string;
  lastLoginTime?: string;
}

// 生成用户数据
const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: Random.id(),
      username: Random.name().toLowerCase().replace(/\s/g, ''),
      realName: Random.cname(),
      avatar: Random.image('100x100', Random.color(), '#fff', 'Avatar'),
      email: Random.email(),
      phone: Random.string('number', 11),
      roles: ['user'],
      status: Random.boolean() ? 1 : 0,
      department: Random.pick(['技术部', '市场部', '销售部', '客服部']),
      position: Random.pick(['工程师', '经理', '专员', '总监']),
      createTime: Random.datetime(),
      updateTime: Random.datetime(),
      lastLoginTime: Random.datetime(),
    });
  }
  // 添加一个管理员用户
  users.push({
    id: '1',
    username: 'admin',
    realName: '系统管理员',
    avatar: Random.image('100x100', '#4A7BF7', '#fff', 'Admin'),
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    status: 1,
    department: '技术部',
    position: '系统管理员',
    createTime: Random.datetime(),
    updateTime: Random.datetime(),
    lastLoginTime: Random.datetime(),
  });
  return users;
};

const users = generateUsers(20);

export default [
  // 获取用户列表
  {
    url: '/user/list',
    method: 'get',
    timeout: 500,
    response: ({ query }: RequestParams) => {
      const { page = 1, pageSize = 10, username, realName, email, status, roleId } = query;

      let filteredUsers = [...users];

      // 根据查询条件过滤
      if (username) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(username.toLowerCase())
        );
      }

      if (realName) {
        filteredUsers = filteredUsers.filter(user => user.realName.includes(realName));
      }

      if (email) {
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(email.toLowerCase())
        );
      }

      if (status !== undefined && status !== '') {
        filteredUsers = filteredUsers.filter(user => user.status === parseInt(status));
      }

      if (roleId) {
        filteredUsers = filteredUsers.filter(user => user.roles.includes(roleId));
      }

      const total = filteredUsers.length;
      const pageUsers = filteredUsers.slice(
        (parseInt(page) - 1) * parseInt(pageSize),
        parseInt(page) * parseInt(pageSize)
      );

      return {
        code: 200,
        data: {
          list: pageUsers,
          total,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
        },
        message: '获取成功',
      };
    },
  },

  // 获取用户详情
  {
    url: '/user/:id',
    method: 'get',
    timeout: 300,
    response: ({ params }: RequestParams) => {
      const { id } = params;
      const user = users.find(u => u.id === id);

      if (user) {
        return {
          code: 200,
          data: user,
          message: '获取成功',
        };
      }

      return {
        code: 404,
        message: '用户不存在',
        data: null,
      };
    },
  },

  // 创建用户
  {
    url: '/user/create',
    method: 'post',
    timeout: 400,
    response: ({ body }: RequestParams) => {
      const { username } = body;

      // 检查用户名是否已存在
      if (users.some(u => u.username === username)) {
        return {
          code: 400,
          message: '用户名已存在',
          data: null,
        };
      }

      const newUser: User = {
        id: Random.id(),
        username: body.username,
        realName: body.realName || body.username,
        avatar: body.avatar || Random.image('100x100', Random.color(), '#fff', 'Avatar'),
        email: body.email || Random.email(),
        phone: body.phone || Random.string('number', 11),
        roles: body.roles || ['user'],
        status: body.status !== undefined ? body.status : 1,
        department: body.department,
        position: body.position,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };

      users.push(newUser);

      return {
        code: 200,
        data: null,
        message: '创建成功',
      };
    },
  },

  // 更新用户
  {
    url: '/user/update',
    method: 'put',
    timeout: 400,
    response: ({ body }: RequestParams) => {
      const { id } = body;
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        };
      }

      users[userIndex] = {
        ...users[userIndex],
        ...body,
        updateTime: new Date().toISOString(),
      };

      return {
        code: 200,
        data: null,
        message: '更新成功',
      };
    },
  },

  // 删除用户
  {
    url: '/user/delete/:id',
    method: 'delete',
    timeout: 300,
    response: ({ params }: RequestParams) => {
      const { id } = params;
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        };
      }

      // 保护admin用户不被删除
      if (users[userIndex].username === 'admin') {
        return {
          code: 403,
          message: '不能删除管理员账号',
          data: null,
        };
      }

      users.splice(userIndex, 1);

      return {
        code: 200,
        data: null,
        message: '删除成功',
      };
    },
  },

  // 为用户分配角色
  {
    url: '/user/assign-roles',
    method: 'post',
    timeout: 300,
    response: ({ body }: RequestParams) => {
      const { userId, roleIds } = body;
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        };
      }

      users[userIndex].roles = roleIds;
      users[userIndex].updateTime = new Date().toISOString();

      return {
        code: 200,
        data: null,
        message: '角色分配成功',
      };
    },
  },

  // 重置用户密码
  {
    url: '/user/reset-password',
    method: 'put',
    timeout: 300,
    response: ({ body }: RequestParams) => {
      const { id } = body;
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null,
        };
      }

      return {
        code: 200,
        data: null,
        message: '密码重置成功，新密码已发送至用户邮箱',
      };
    },
  },
] as MockMethod[];
