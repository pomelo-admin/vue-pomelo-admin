import { ref, onMounted, onUnmounted } from 'vue';
import { ElNotification } from 'element-plus';

// 版本信息接口
interface VersionInfo {
  version: string;
  buildTime: string;
}

// 当前应用版本 - 初始化为加载时的时间戳或环境变量中的版本号
const currentVersion = ref<string>(import.meta.env.VITE_APP_VERSION || String(Date.now()));
const needRefresh = ref(false);

// 检测周期 (毫秒)
const CHECK_INTERVAL = 60 * 1000; // 每分钟检查一次
let checkTimer: number | null = null;

/**
 * 从服务器获取最新版本信息
 */
async function fetchLatestVersion(): Promise<VersionInfo | null> {
  try {
    // 添加时间戳参数防止缓存
    const timestamp = Date.now();
    const response = await fetch(`/version.json?t=${timestamp}`, {
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

  // 如果版本不同，则提示更新
  if (latestVersion.version !== currentVersion.value) {
    needRefresh.value = true;
    showUpdateNotification();
  }
}

/**
 * 显示更新通知
 */
function showUpdateNotification() {
  ElNotification({
    title: '新版本可用',
    message: '应用已更新，请刷新页面以使用最新版本',
    type: 'info',
    duration: 0, // 不自动关闭
    position: 'top-right',
    showClose: true,
    onClick: () => {
      window.location.reload();
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

  onUnmounted(() => {
    stopVersionCheck();
  });

  return {
    needRefresh,
    checkForUpdates,
    reload: () => window.location.reload(),
  };
}

// 在开发环境中禁用自动检查
if (import.meta.env.DEV) {
  stopVersionCheck();
}
