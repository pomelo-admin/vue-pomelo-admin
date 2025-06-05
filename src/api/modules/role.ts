import request from '@/utils/request';

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
}

// 获取角色列表
export function getRoleListService(params: { page: number; pageSize: number }) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
  });
}

// 获取权限列表
export function getPermissionListService(params: { page: number; pageSize: number }) {
  return request({
    url: '/permission/list',
    method: 'get',
    params,
  });
}

// 获取角色详情
export function getRoleDetailService(id: string) {
  return request({
    url: `/role/${id}`,
    method: 'get',
  });
}

// 分配角色权限
export function assignRolePermissionsService(data: { roleId: string; permissionCodes: string[] }) {
  return request({
    url: '/role/assign-permissions',
    method: 'post',
    data,
  });
}
