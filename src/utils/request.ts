import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/store/modules/auth';
import router from '@/router';

// 定义不需要显示登录过期提示的路由路径数组
const noAuthNoticeRoutes = ['/login', '/', '/register', '/forgot-password'];

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      if (res.code === 401) {
        const currentRoute = router.currentRoute.value;
        const isNoAuthNoticePage = noAuthNoticeRoutes.includes(currentRoute.path);
        if (!isNoAuthNoticePage) {
          const authStore = useAuthStore();
          ElMessageBox.confirm('登录已过期，请重新登录', '确认退出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            authStore.logout().then(() => {
              router.push('/login');
            });
          });
        } else {
          const authStore = useAuthStore();
          authStore.resetState();
        }
      } else if (res.code === 403) {
        ElMessage({
          message: '权限不足，无法访问该资源',
          type: 'error',
          duration: 5 * 1000,
        });
      } else {
        ElMessage({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    const errorMessage = error.response?.data?.message || '请求失败，请稍后重试';
    ElMessage({
      message: errorMessage,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
