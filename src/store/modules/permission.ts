import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from './user';

// 权限类型定义
export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
}

// 角色类型定义
export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[]; // 权限ID列表
}

// 模拟权限数据
const mockPermissions: Permission[] = [
  { id: '1', name: '仪表盘查看', code: 'dashboard:view', description: '允许查看仪表盘' },
  { id: '2', name: '用户管理查看', code: 'user:view', description: '允许查看用户列表' },
  { id: '3', name: '用户管理创建', code: 'user:create', description: '允许创建用户' },
  { id: '4', name: '用户管理编辑', code: 'user:edit', description: '允许编辑用户' },
  { id: '5', name: '用户管理删除', code: 'user:delete', description: '允许删除用户' },
  { id: '6', name: '角色管理查看', code: 'role:view', description: '允许查看角色列表' },
  { id: '7', name: '角色管理创建', code: 'role:create', description: '允许创建角色' },
  { id: '8', name: '角色管理编辑', code: 'role:edit', description: '允许编辑角色' },
  { id: '9', name: '角色管理删除', code: 'role:delete', description: '允许删除角色' },
  { id: '10', name: '权限管理查看', code: 'permission:view', description: '允许查看权限列表' },
  { id: '11', name: '权限管理分配', code: 'permission:assign', description: '允许分配权限' },
  { id: '12', name: '系统设置查看', code: 'setting:view', description: '允许查看系统设置' },
  { id: '13', name: '系统设置编辑', code: 'setting:edit', description: '允许编辑系统设置' },
  { id: '14', name: '权限管理创建', code: 'permission:create', description: '允许创建权限' },
  { id: '15', name: '权限管理编辑', code: 'permission:edit', description: '允许编辑权限' },
  { id: '16', name: '权限管理删除', code: 'permission:delete', description: '允许删除权限' },
];

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    permissions: ['*'], // 通配符表示所有权限
  },
  {
    id: '2',
    name: '普通用户',
    code: 'user',
    description: '基本用户权限',
    permissions: ['1'], // 只能查看仪表盘
  },
  {
    id: '3',
    name: '用户管理员',
    code: 'user_manager',
    description: '管理用户的角色',
    permissions: ['1', '2', '3', '4', '5'], // 仪表盘和用户管理权限
  },
  {
    id: '4',
    name: '角色管理员',
    code: 'role_manager',
    description: '管理角色的角色',
    permissions: ['1', '6', '7', '8', '9'], // 仪表盘和角色管理权限
  },
  {
    id: '5',
    name: '系统管理员',
    code: 'system_manager',
    description: '管理系统设置的角色',
    permissions: ['1', '12', '13'], // 仪表盘和系统设置权限
  },
];

// 模拟API调用
const mockGetPermissions = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPermissions;
};

const mockGetRoles = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRoles;
};

const mockGetRolePermissions = async (roleId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const role = mockRoles.find(r => r.id === roleId);
  if (!role) return [];

  if (role.permissions.includes('*')) {
    return mockPermissions;
  }

  return mockPermissions.filter(permission => role.permissions.includes(permission.id));
};

export const usePermissionStore = defineStore('permission', () => {
  const roles = ref<Role[]>([]);
  const permissions = ref<Permission[]>([]);
  const userStore = useUserStore();

  // 用户拥有的权限代码列表
  const userPermissionCodes = computed(() => {
    // 如果用户有 admin 角色，直接返回所有权限
    if (userStore.userInfo.roles.includes('admin')) {
      return ['*'];
    }

    // 找出用户对应的角色，并获取这些角色拥有的所有权限ID
    const userRoleIds = userStore.userInfo.roles;
    const userRoles = roles.value.filter(role => userRoleIds.includes(role.code));

    // 如果任一角色有 '*' 权限，则返回所有权限
    if (userRoles.some(role => role.permissions.includes('*'))) {
      return ['*'];
    }

    // 收集用户所有角色的权限ID
    const permissionIds = userRoles.flatMap(role => role.permissions);

    // 返回这些权限ID对应的权限代码
    return permissions.value
      .filter(permission => permissionIds.includes(permission.id))
      .map(permission => permission.code);
  });

  // 检查是否有某项权限
  const hasPermission = (permissionCode: string) => {
    const permCodes = userPermissionCodes.value;
    return permCodes.includes('*') || permCodes.includes(permissionCode);
  };

  // 过滤路由，根据权限决定哪些路由可访问
  const filterRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    return routes.filter(route => {
      // 如果路由没有meta或没有设置权限，则所有人可访问
      if (!route.meta || !route.meta.permission) {
        return true;
      }

      // 检查是否有权限访问该路由
      const requiredPermission = route.meta.permission;
      let hasAccess = false;

      if (typeof requiredPermission === 'string') {
        // 单个权限
        hasAccess = hasPermission(requiredPermission);
      } else if (Array.isArray(requiredPermission)) {
        // 多个权限（满足其中一个即可）
        hasAccess = requiredPermission.some(permission => hasPermission(permission));
      }

      // 如果有子路由，递归过滤
      if (hasAccess && route.children && route.children.length) {
        const filteredChildren = filterRoutes(route.children);
        route.children = filteredChildren;
      }

      return hasAccess;
    });
  };

  // 获取所有角色
  const getRoles = async () => {
    try {
      const data = await mockGetRoles();
      roles.value = data;
      return data;
    } catch (error) {
      console.error('获取角色失败:', error);
      return Promise.reject(error);
    }
  };

  // 获取所有权限
  const getPermissions = async () => {
    try {
      const data = await mockGetPermissions();
      permissions.value = data;
      return data;
    } catch (error) {
      console.error('获取权限失败:', error);
      return Promise.reject(error);
    }
  };

  // 获取角色的权限
  const getRolePermissions = async (roleId: string) => {
    try {
      return await mockGetRolePermissions(roleId);
    } catch (error) {
      console.error('获取角色权限失败:', error);
      return Promise.reject(error);
    }
  };

  // 初始化权限数据
  const initPermissions = async () => {
    await getPermissions();
    await getRoles();
  };

  return {
    roles,
    permissions,
    userPermissionCodes,
    hasPermission,
    filterRoutes,
    getRoles,
    getPermissions,
    getRolePermissions,
    initPermissions,
  };
});
