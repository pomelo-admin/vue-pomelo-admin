/**
 * 处理token的工具函数
 */

const TOKEN_KEY = 'pomelo_admin_token';

/**
 * 获取token
 */
export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

/**
 * 设置token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 移除token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
} 