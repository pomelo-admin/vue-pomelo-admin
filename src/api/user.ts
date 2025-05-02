import request from '@/utils/request';

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResult {
  token: string;
}

interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  roles: string[];
  permissions?: string[];
}

// 登录
export function login(data: LoginParams) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  }) as Promise<LoginResult>;
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  }) as Promise<UserInfo>;
}

// 登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
} 