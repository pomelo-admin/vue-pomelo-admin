import { defineStore } from 'pinia';
import { ref } from 'vue';
import { removeToken, setToken, getToken } from '@/utils/auth';

// 虚假的API调用
const mockLogin = async (credentials: { username: string; password: string }) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 检查用户名和密码（仅为演示）
  if (credentials.username === 'admin' && credentials.password === 'admin123') {
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: '1',
        username: 'admin',
        avatar: '',
        roles: ['admin'],
        permissions: ['*']
      }
    };
  }
  
  throw new Error('用户名或密码错误');
};

// 模拟获取用户信息
const mockGetUserInfo = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: '1',
    username: 'admin',
    avatar: '',
    roles: ['admin'],
    permissions: ['*']
  };
};

// 模拟退出登录
const mockLogout = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '');
  const userInfo = ref({
    id: '',
    username: '',
    avatar: '',
    roles: [] as string[],
  });
  const permissions = ref<string[]>([]);

  // 登录
  async function loginAction(loginForm: { username: string; password: string }) {
    try {
      const { token: userToken, user } = await mockLogin(loginForm);
      token.value = userToken;
      setToken(userToken);
      userInfo.value = user;
      permissions.value = user.permissions;
      return { success: true };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 获取用户信息
  async function getUserInfoAction() {
    try {
      const data = await mockGetUserInfo();
      userInfo.value = {
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        roles: data.roles,
      };
      permissions.value = data.permissions || [];
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 登出
  async function logout() {
    try {
      await mockLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      resetState();
    }
  }

  // 重置状态
  function resetState() {
    token.value = '';
    userInfo.value = {
      id: '',
      username: '',
      avatar: '',
      roles: [],
    };
    permissions.value = [];
    removeToken();
  }

  return {
    token,
    userInfo,
    permissions,
    loginAction,
    getUserInfoAction,
    logout,
    resetState,
  };
}); 