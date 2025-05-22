import type { RouteRecordRaw } from 'vue-router';

// 权限管理相关路由
const permissionRoutes: RouteRecordRaw = {
  path: '/permission',
  name: 'Permission',
  component: () => import('@/layout/index.vue'),
  redirect: '/permission/user',
  meta: {
    title: 'permission',
    icon: 'Lock',
    alwaysShow: true,
  },
  children: [
    {
      path: 'user',
      name: 'UserManagement',
      component: () => import('@/views/permission/user.vue'),
      meta: {
        title: 'userManagement',
        icon: 'User',
        permission: ['user:view'],
      },
    },
    {
      path: 'role',
      name: 'RoleManagement',
      component: () => import('@/views/permission/role.vue'),
      meta: {
        title: 'roleManagement',
        icon: 'UserFilled',
        permission: ['role:view'],
      },
    },
    {
      path: 'permission',
      name: 'PermissionManagement',
      component: () => import('@/views/permission/permission.vue'),
      meta: {
        title: 'permissionManagement',
        icon: 'Key',
        permission: ['permission:view'],
      },
    },
  ],
};

export default permissionRoutes;
