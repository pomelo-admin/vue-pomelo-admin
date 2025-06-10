import { request } from '@/utils';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  code: number;
  data: {
    token: string;
  };
  message: string;
}

export interface UserInfoResponse {
  code: number;
  data: UserInfo;
  message: string;
}

export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  roles: string[];
  permissions?: string[];
}

// 登录
export function loginService(data: LoginParams) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  }) as Promise<LoginResult>;
}

// 获取用户信息
export function getUserInfoService() {
  return request({
    url: '/auth/user-info',
    method: 'get',
  }) as Promise<UserInfoResponse>;
}

// 登出
export function logoutService() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}
