import { ref, onMounted, onUnmounted, h } from 'vue';
import { ElNotification, ElButton } from 'element-plus';
import type { NotificationHandle } from 'element-plus';
import i18n from '@/locales';

// 版本信息接口
interface VersionInfo {
  version: string;
}

// 检测配置
const CONFIG = {
  CHECK_INTERVAL: 60 * 1000, // 检测周期：每分钟检查一次
  RETRY_INTERVAL: 30 * 1000, // 失败后重试间隔：30秒
  MAX_RETRIES: 3, // 最大重试次数
};

// 状态变量
const currentVersion = ref<string>(import.meta.env.VITE_APP_VERSION || String(Date.now()));
const needRefresh = ref<boolean>(false);
let checkTimer: number | null = null;
let notificationInstance: NotificationHandle | null = null;
let isPageVisible = true;
let retryCount = 0;

/**
 * 从服务器获取最新版本信息
 * @returns 版本信息对象或null（如果获取失败）
 */
async function fetchLatestVersion(): Promise<VersionInfo | null> {
  try {
    // 添加时间戳参数防止缓存
    const timestamp = Date.now();
    const url = `${import.meta.env.BASE_URL}version.json?t=${timestamp}`;

    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
      // 添加超时处理
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (!response.ok) {
      console.warn(`获取版本信息失败: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    // 简单验证返回的数据格式
    if (!data || typeof data.version !== 'string') {
      console.warn('版本信息格式无效');
      return null;
    }

    retryCount = 0; // 成功后重置重试计数
    return data;
  } catch (error) {
    // 区分不同类型的错误进行处理
    if (error instanceof TypeError && 'name' in error && error.name === 'AbortError') {
      console.warn('获取版本信息超时');
    } else {
      console.error('获取版本信息出错:', error);
    }

    // 增加重试逻辑
    if (retryCount < CONFIG.MAX_RETRIES) {
      retryCount++;
      console.log(
        `将在 ${CONFIG.RETRY_INTERVAL / 1000} 秒后重试 (${retryCount}/${CONFIG.MAX_RETRIES})`
      );
      setTimeout(checkForUpdates, CONFIG.RETRY_INTERVAL);
    } else {
      retryCount = 0; // 达到最大重试次数后重置
    }

    return null;
  }
}

/**
 * 检查应用是否有更新
 */
async function checkForUpdates(): Promise<void> {
  // 如果页面不可见，跳过检查
  if (!isPageVisible) return;

  const latestVersion = await fetchLatestVersion();
  if (!latestVersion) return;

  // 只有当版本不同，且当前没有显示的通知时，才提示更新
  if (latestVersion.version !== currentVersion.value && !notificationInstance) {
    needRefresh.value = true;
    showUpdateNotification();
  }
}

/**
 * 显示更新通知
 */
function showUpdateNotification(): void {
  // 防止重复显示通知
  if (notificationInstance) return;

  notificationInstance = ElNotification({
    title: i18n.global.t('common.update.title'),
    message: h('div', { style: 'margin-bottom: 10px' }, [
      h('p', { style: 'margin-bottom: 10px' }, i18n.global.t('common.update.message')),
      h(
        ElButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => {
            window.location.reload();
          },
        },
        { default: () => i18n.global.t('common.update.refresh') }
      ),
    ]),
    type: 'info',
    duration: 0, // 不自动关闭
    position: 'top-right',
    showClose: true,
    onClose: () => {
      // 通知关闭时，清除实例引用，允许下次检查时再次显示
      notificationInstance = null;
    },
  });
}

/**
 * 开始版本检查
 */
function startVersionCheck(): void {
  // 立即执行一次检查
  checkForUpdates();

  // 清除可能存在的旧定时器
  stopVersionCheck();

  // 设置新的定时器
  checkTimer = window.setInterval(checkForUpdates, CONFIG.CHECK_INTERVAL);
}

/**
 * 停止版本检查
 */
function stopVersionCheck(): void {
  if (checkTimer !== null) {
    window.clearInterval(checkTimer);
    checkTimer = null;
  }

  // 清除可能存在的通知
  if (notificationInstance) {
    notificationInstance.close();
    notificationInstance = null;
  }
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange(): void {
  isPageVisible = !document.hidden;

  // 页面重新可见时立即执行一次检查
  if (isPageVisible) {
    checkForUpdates();
  }
}

/**
 * 手动重新加载页面
 */
function reloadPage(): void {
  window.location.reload();
}

/**
 * Vue Composition API hook 用于检测应用更新
 */
export function useVersionCheck() {
  onMounted(() => {
    // 只在生产环境启动版本检查
    if (import.meta.env.DEV) {
      console.log('开发环境已禁用版本检查');
      return;
    }

    // 添加页面可见性变化事件监听
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 启动版本检查
    startVersionCheck();
  });

  // 组件卸载时清理资源
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    stopVersionCheck();
  });

  return {
    needRefresh,
    checkForUpdates,
    reload: reloadPage,
  };
}
