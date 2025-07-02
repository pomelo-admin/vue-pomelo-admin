<template>
  <div
    class="frame-container"
    style="position: relative"
    :style="{ width: props.width, height: props.height, ...props.customContainerStyle }"
  >
    <div v-if="loading" class="frame-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>{{ t('common.loading') }}</span>
    </div>
    <iframe
      :src="src"
      :title="title"
      :width="width"
      :height="height"
      :allow="allow"
      :sandbox="sandbox"
      :style="{ border: 'none', width: props.width, height: props.height, ...props.customStyle }"
      @load="handleLoad"
      @error="handleError"
      ref="frameRef"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Loading } from '@element-plus/icons-vue';

const { t } = useI18n();

const props = defineProps({
  /**
   * The URL of the external page to embed
   */
  src: {
    type: String,
    required: true,
  },
  /**
   * Title for the iframe (accessibility)
   */
  title: {
    type: String,
    default: 'Embedded content',
  },
  /**
   * Width of the iframe (can be px, %, vh, etc.)
   */
  width: {
    type: String,
    default: '100%',
  },
  /**
   * Height of the iframe (can be px, %, vh, etc.)
   */
  height: {
    type: String,
    default: '500px',
  },
  /**
   * Allow specific features in the iframe
   * e.g. "accelerometer; camera; microphone"
   */
  allow: {
    type: String,
    default: '',
  },
  /**
   * Sandbox attributes for security
   * Default allows scripts but restricts other potentially dangerous features
   * Set to empty string to remove sandbox (not recommended)
   */
  sandbox: {
    type: String,
    default: 'allow-scripts allow-same-origin allow-forms allow-popups',
  },
  /**
   * Auto resize iframe based on content height
   */
  autoResize: {
    type: Boolean,
    default: false,
  },
  /**
   * Custom styles for the iframe
   */
  customStyle: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Custom styles for the container
   */
  customContainerStyle: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Whether to show a loading indicator
   */
  showLoading: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['load', 'error', 'resize']);

const frameRef = ref<HTMLIFrameElement | null>(null);
const loading = ref(props.showLoading);

const handleLoad = (event: Event) => {
  loading.value = false;
  emit('load', event);

  if (props.autoResize) {
    setupAutoResize();
  }
};

const handleError = (event: Event) => {
  loading.value = false;
  emit('error', event);
};

// Auto-resize functionality
let resizeObserver: ResizeObserver | null = null;

const setupAutoResize = () => {
  if (!frameRef.value || !props.autoResize) return;

  try {
    const frameDocument = frameRef.value.contentDocument || frameRef.value.contentWindow?.document;

    if (!frameDocument) return;

    // Try to get the body or documentElement height
    const updateHeight = () => {
      const height = Math.max(
        frameDocument.body?.scrollHeight || 0,
        frameDocument.documentElement?.scrollHeight || 0
      );

      if (height > 0) {
        frameRef.value!.style.height = `${height}px`;
        emit('resize', { height });
      }
    };

    // Initial resize
    updateHeight();

    // Setup resize observer if available
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(frameDocument.body || frameDocument.documentElement);
    } else {
      // Fallback to interval for older browsers
      const interval = setInterval(updateHeight, 1000);
      onUnmounted(() => clearInterval(interval));
    }
  } catch (error) {
    console.error('Failed to setup auto-resize for iframe:', error);
  }
};

// Watch for src changes to reset loading state
watch(
  () => props.src,
  () => {
    if (props.showLoading) {
      loading.value = true;
    }
  }
);

onMounted(() => {
  if (props.autoResize && frameRef.value?.contentDocument?.readyState === 'complete') {
    setupAutoResize();
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// Expose methods to parent component
defineExpose({
  /**
   * Get the iframe element reference
   */
  getIframeElement: () => frameRef.value,

  /**
   * Manually trigger a resize calculation
   */
  recalculateSize: () => {
    if (props.autoResize) {
      setupAutoResize();
    }
  },

  /**
   * Check if the iframe has loaded
   */
  isLoaded: () => !loading.value,
});
</script>

<style scoped lang="scss">
.frame-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-bg-color);
  border-radius: 4px;

  .frame-loading {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--el-bg-color);

    span {
      margin-top: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  iframe {
    flex: 1;
    background-color: transparent;
  }
}
</style>
