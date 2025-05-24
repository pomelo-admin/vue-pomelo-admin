<template>
  <div class="slider-captcha-demo">
    <h2>{{ t('features.sliderCaptcha.title') }}</h2>
    <h3>
      {{
        t('features.sliderCaptcha.componentPath', {
          path: 'src/components/features/slider-captcha/index.vue',
        })
      }}
    </h3>

    <div class="demo-section">
      <h3>{{ t('features.sliderCaptcha.modalMode') }}</h3>
      <p>{{ t('features.sliderCaptcha.modalDescription') }}</p>
      <div class="demo-controls">
        <el-button type="primary" @click="showModal = true">
          {{ t('features.sliderCaptcha.showModal') }}
        </el-button>
      </div>

      <SliderCaptcha
        v-model:show="showModal"
        type="modal"
        @success="onSuccess"
        @fail="onFail"
        @close="onClose"
        @reset="onReset"
      />
    </div>

    <div class="demo-section">
      <h3>{{ t('features.sliderCaptcha.inlineMode') }}</h3>
      <p>{{ t('features.sliderCaptcha.inlineDescription') }}</p>
      <div class="demo-controls">
        <el-button type="primary" @click="showInline = !showInline">
          {{
            showInline
              ? t('features.sliderCaptcha.hideInline')
              : t('features.sliderCaptcha.showInline')
          }}
        </el-button>
      </div>

      <div v-if="showInline" class="inline-captcha-container">
        <SliderCaptcha
          :show="true"
          type="inside"
          @success="onSuccess"
          @fail="onFail"
          @reset="onReset"
        />
      </div>
    </div>

    <div class="event-log">
      <h3>{{ t('features.sliderCaptcha.eventLog') }}</h3>
      <div class="log-container">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span :class="['log-type', getLogTypeClass(log.type)]">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElButton, ElMessage } from 'element-plus';
import SliderCaptcha from '@/components/features/slider-captcha/index.vue';

const { t } = useI18n();

// 控制显示状态
const showModal = ref(false);
const showInline = ref(false);

// 事件日志
interface EventLog {
  type: 'success' | 'fail' | 'close' | 'reset';
  message: string;
  time: string;
}

const eventLogs = ref<EventLog[]>([]);

// 添加日志的辅助函数
const addLog = (type: EventLog['type'], message: string) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  eventLogs.value.unshift({
    type,
    message,
    time,
  });

  // 只保留最近10条日志
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10);
  }
};

// 获取日志类型的样式类
const getLogTypeClass = (type: EventLog['type']) => {
  return {
    success: 'log-success',
    fail: 'log-fail',
    close: 'log-close',
    reset: 'log-reset',
  }[type];
};

// 事件处理函数
const onSuccess = (offset: number) => {
  addLog('success', t('features.sliderCaptcha.successLog', { offset }));
  ElMessage.success(t('features.sliderCaptcha.successMessage'));
};

const onFail = (offset: number) => {
  addLog('fail', t('features.sliderCaptcha.failLog', { offset }));
};

const onClose = () => {
  addLog('close', t('features.sliderCaptcha.closeLog'));
};

const onReset = () => {
  addLog('reset', t('features.sliderCaptcha.resetLog'));
};
</script>

<style lang="scss" scoped>
.slider-captcha-demo {
  padding: 5px;

  .demo-section {
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid #ebeef5;
    border-radius: 4px;

    p {
      color: #606266;
    }

    .demo-controls {
      margin: 15px 0;
    }

    .inline-captcha-container {
      max-width: 400px;
      margin-top: 15px;
    }
  }

  .event-log {
    .log-container {
      height: 200px;
      padding: 10px;
      overflow-y: auto;
      background-color: #f5f7fa;
      border-radius: 4px;

      .log-item {
        padding: 6px 0;
        border-bottom: 1px solid #ebeef5;

        &:last-child {
          border-bottom: none;
        }

        .log-time {
          margin-right: 10px;
          color: #909399;
        }

        .log-type {
          margin-right: 10px;
          font-weight: bold;

          &.log-success {
            color: #67c23a;
          }

          &.log-fail {
            color: #f56c6c;
          }

          &.log-close {
            color: #909399;
          }

          &.log-reset {
            color: #e6a23c;
          }
        }
      }
    }
  }
}
</style>
