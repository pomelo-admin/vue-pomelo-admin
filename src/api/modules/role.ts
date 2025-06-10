import { request } from '@/utils';

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

export interface RoleListParams {
  page: number;
  pageSize: number;
  name?: string;
  code?: string;
}

export interface PermissionListParams {
  page: number;
  pageSize: number;
  name?: string;
  code?: string;
}

export interface RoleCreateParams {
  name: string;
  code: string;
  description: string;
}

export interface RoleUpdateParams {
  id: string;
  name?: string;
  code?: string;
  description?: string;
}

export interface PermissionCreateParams {
  name: string;
  code: string;
  description: string;
}

export interface PermissionUpdateParams {
  id: string;
  name?: string;
  code?: string;
  description?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface ListResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取角色列表
export function getRoleListService(params: RoleListParams) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
  }) as Promise<ApiResponse<ListResponse<Role>>>;
}

// 获取权限列表
export function getPermissionListService(params: PermissionListParams) {
  return request({
    url: '/permission/list',
    method: 'get',
    params,
  }) as Promise<ApiResponse<ListResponse<Permission>>>;
}

// 获取角色详情
export function getRoleDetailService(id: string) {
  return request({
    url: `/role/${id}`,
    method: 'get',
  }) as Promise<ApiResponse<Role>>;
}

// 创建角色
export function createRoleService(data: RoleCreateParams) {
  return request({
    url: '/role/create',
    method: 'post',
    data,
  }) as Promise<ApiResponse>;
}

// 更新角色
export function updateRoleService(data: RoleUpdateParams) {
  return request({
    url: '/role/update',
    method: 'put',
    data,
  }) as Promise<ApiResponse>;
}

// 删除角色
export function deleteRoleService(id: string) {
  return request({
    url: `/role/delete/${id}`,
    method: 'delete',
  }) as Promise<ApiResponse>;
}

// 分配角色权限
export function assignRolePermissionsService(data: { roleId: string; permissionCodes: string[] }) {
  return request({
    url: '/role/assign-permissions',
    method: 'post',
    data,
  }) as Promise<ApiResponse>;
}

// 创建权限
export function createPermissionService(data: PermissionCreateParams) {
  return request({
    url: '/permission/create',
    method: 'post',
    data,
  }) as Promise<ApiResponse>;
}

// 更新权限
export function updatePermissionService(data: PermissionUpdateParams) {
  return request({
    url: '/permission/update',
    method: 'put',
    data,
  }) as Promise<ApiResponse>;
}

// 删除权限
export function deletePermissionService(id: string) {
  return request({
    url: `/permission/delete/${id}`,
    method: 'delete',
  }) as Promise<ApiResponse>;
}
