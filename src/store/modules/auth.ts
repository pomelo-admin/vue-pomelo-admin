import { defineStore } from 'pinia';
import { ref } from 'vue';
import { removeToken, setToken, getToken } from '@/utils';
import { loginService, getUserInfoService, logoutService } from '@/api';

export const useAuthStore = defineStore('auth', () => {
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
      const { data } = await loginService(loginForm);
      token.value = data.token;
      setToken(data.token);
      // 登录成功后获取用户信息
      await getUserInfoAction();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 获取用户信息
  async function getUserInfoAction() {
    try {
      const response = await getUserInfoService();
      const userData = response.data;

      userInfo.value = {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        roles: userData.roles,
      };
      permissions.value = userData.permissions || [];
      return userData;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 登出
  async function logout() {
    try {
      await logoutService();
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
