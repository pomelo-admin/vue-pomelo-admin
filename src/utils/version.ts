import { ref, onMounted, onUnmounted } from 'vue';
import { ElNotification } from 'element-plus';

// 版本信息接口
interface VersionInfo {
  version: string;
}

// 当前应用版本 - 初始化为加载时的时间戳或环境变量中的版本号
const currentVersion = ref<string>(import.meta.env.VITE_APP_VERSION || String(Date.now()));
const needRefresh = ref(false);

// 检测周期 (毫秒)
const CHECK_INTERVAL = 60 * 1000; // 每分钟检查一次
let checkTimer: number | null = null;
let notificationInstance: any = null; // 保存当前的通知实例

/**
 * 从服务器获取最新版本信息
 */
async function fetchLatestVersion(): Promise<VersionInfo | null> {
  try {
    // 添加时间戳参数防止缓存
    const timestamp = Date.now();
    const response = await fetch(`${import.meta.env.BASE_URL}version.json?t=${timestamp}`, {
      cache: 'no-cache',
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('获取版本信息失败:', error);
    return null;
  }
}

/**
 * 检查应用是否有更新
 */
async function checkForUpdates() {
  const latestVersion = await fetchLatestVersion();

  if (!latestVersion) return;

  // 如果版本不同，且当前没有显示的通知，则提示更新
  if (latestVersion.version !== currentVersion.value && !notificationInstance) {
    needRefresh.value = true;
    showUpdateNotification();
  }
}

/**
 * 显示更新通知
 */
function showUpdateNotification() {
  // 如果已经有通知在显示，就不再显示新的通知
  if (notificationInstance) return;

  notificationInstance = ElNotification({
    title: '新版本可用',
    message: '应用已更新，请刷新页面以使用最新版本',
    type: 'info',
    duration: 0, // 不自动关闭
    position: 'top-right',
    showClose: true,
    onClick: () => {
      window.location.reload();
    },
    onClose: () => {
      // 通知关闭时，清除实例引用，允许下次检查时再次显示
      notificationInstance = null;
    },
  });
}

/**
 * 开始版本检查
 */
function startVersionCheck() {
  checkForUpdates();
  checkTimer = window.setInterval(checkForUpdates, CHECK_INTERVAL);
}

/**
 * 停止版本检查
 */
function stopVersionCheck() {
  if (checkTimer !== null) {
    clearInterval(checkTimer);
    checkTimer = null;
  }
  // 清除可能存在的通知
  if (notificationInstance) {
    // 调用close确保关闭了通知
    notificationInstance.close();
    // 确保通知实例被重置
    notificationInstance = null;
  }
}

/**
 * Vue Composition API hook 用于检测应用更新
 */
export function useVersionCheck() {
  onMounted(() => {
    // 只在生产环境启动版本检查
    if (!import.meta.env.DEV) {
      startVersionCheck();
    }
  });

  // 组件卸载时停止版本检查
  onUnmounted(() => {
    stopVersionCheck();
  });

  return {
    needRefresh,
    checkForUpdates,
    reload: () => window.location.reload(),
  };
}
