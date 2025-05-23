import type { RouteRecordRaw } from 'vue-router';

// 系统管理相关路由
const systemRoutes: RouteRecordRaw = {
  path: '/system',
  name: 'SystemManagement',
  component: () => import('@/layout/index.vue'),
  redirect: '/system/user',
  meta: {
    title: 'systemManagement',
    icon: 'Setting',
    alwaysShow: true,
  },
  children: [
    {
      path: 'user',
      name: 'UserManagement',
      component: () => import('@/views/system-management/user/index.vue'),
      meta: {
        title: 'userManagement',
        icon: 'User',
        permission: ['user:view'],
      },
    },
    {
      path: 'role',
      name: 'RoleManagement',
      component: () => import('@/views/system-management/role/index.vue'),
      meta: {
        title: 'roleManagement',
        icon: 'UserFilled',
        permission: ['role:view'],
      },
    },
    {
      path: 'permission',
      name: 'PermissionManagement',
      component: () => import('@/views/system-management/permission/index.vue'),
      meta: {
        title: 'permissionManagement',
        icon: 'Key',
        permission: ['permission:view'],
      },
    },
  ],
};

export default systemRoutes;
