import { request } from '@/utils';

// 用户列表查询参数
export interface UserListParams {
  page: number;
  pageSize: number;
  username?: string;
  realName?: string;
  email?: string;
  status?: number; // 0-禁用，1-启用
  roleId?: string;
  createTimeRange?: [string, string];
}

// 用户信息接口
export interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: number; // 0-禁用，1-启用
  roles: string[]; // 角色ID列表
  department?: string;
  position?: string;
  createTime: string;
  updateTime: string;
  lastLoginTime?: string;
}

// 创建用户参数
export interface UserCreateParams {
  username: string;
  password: string;
  realName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status?: number;
  roles: string[]; // 角色ID列表
  department?: string;
  position?: string;
}

// 更新用户参数
export interface UserUpdateParams {
  id: string;
  realName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: number;
  roles?: string[]; // 角色ID列表
  department?: string;
  position?: string;
}

// 修改密码参数
export interface ChangePasswordParams {
  id: string;
  oldPassword?: string; // 管理员可能不需要旧密码
  newPassword: string;
}

// API响应格式
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 列表响应格式
export interface ListResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 获取用户列表
 * @param params 查询参数
 */
export function getUserListService(params: UserListParams) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  }) as Promise<ApiResponse<ListResponse<User>>>;
}

/**
 * 获取用户详情
 * @param id 用户ID
 */
export function getUserDetailService(id: string) {
  return request({
    url: `/user/${id}`,
    method: 'get',
  }) as Promise<ApiResponse<User>>;
}

/**
 * 创建用户
 * @param data 用户数据
 */
export function createUserService(data: UserCreateParams) {
  return request({
    url: '/user/create',
    method: 'post',
    data,
  }) as Promise<ApiResponse>;
}

/**
 * 更新用户
 * @param data 用户数据
 */
export function updateUserService(data: UserUpdateParams) {
  return request({
    url: '/user/update',
    method: 'put',
    data,
  }) as Promise<ApiResponse>;
}

/**
 * 删除用户
 * @param id 用户ID
 */
export function deleteUserService(id: string) {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete',
  }) as Promise<ApiResponse>;
}

/**
 * 为用户分配角色
 * @param data 用户ID和角色ID列表
 */
export function assignUserRolesService(data: { userId: string; roleIds: string[] }) {
  return request({
    url: '/user/assign-roles',
    method: 'post',
    data,
  }) as Promise<ApiResponse>;
}

/**
 * 重置用户密码
 * @param id 用户ID
 */
export function resetUserPasswordService(id: string) {
  return request({
    url: '/user/reset-password',
    method: 'put',
    data: { id },
  }) as Promise<ApiResponse>;
}
