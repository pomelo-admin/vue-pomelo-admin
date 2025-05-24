<template>
  <div class="slider-captcha-page">
    <el-card class="slider-captcha-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('features.sliderCaptcha.title') }}</span>
          <small>
            <a
              :href="'https://github.com/pomelo-admin/vue-pomelo-admin/blob/main/src/components/features/slider-captcha/index.vue'"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #409eff; text-decoration: none"
            >
              {{
                t('features.sliderCaptcha.componentPath', {
                  path: 'src/components/features/slider-captcha/index.vue',
                })
              }}
            </a>
          </small>
        </div>
      </template>

      <p class="component-description">{{ t('features.sliderCaptcha.description') }}</p>

      <el-divider />

      <el-card class="demo-section" shadow="hover">
        <template #header>
          <div class="section-header">
            <span>{{ t('features.sliderCaptcha.modalMode') }}</span>
          </div>
        </template>
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
      </el-card>

      <el-card class="demo-section" shadow="hover">
        <template #header>
          <div class="section-header">
            <span>{{ t('features.sliderCaptcha.inlineMode') }}</span>
          </div>
        </template>
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
      </el-card>

      <el-card class="event-log" shadow="hover">
        <template #header>
          <div class="section-header">
            <span>{{ t('features.sliderCaptcha.eventLog') }}</span>
          </div>
        </template>
        <div class="log-container">
          <el-empty v-if="!eventLogs.length" :description="'暂无日志'"></el-empty>
          <div v-else v-for="(log, index) in eventLogs" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span :class="['log-type', getLogTypeClass(log.type)]">{{ log.type }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElButton, ElMessage, ElCard, ElDivider, ElEmpty } from 'element-plus';
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
.slider-captcha-page {
  padding: 5px;
}

.slider-captcha-card {
  .card-header {
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
      font-size: 18px;
      font-weight: bold;
    }

    small {
      color: #909399;
      font-size: 16px;
    }
  }

  .component-description {
    color: #606266;
    margin-bottom: 20px;
  }

  .demo-section {
    margin-bottom: 20px;

    .section-header {
      font-weight: bold;
      font-size: 16px;
    }

    p {
      color: #606266;
      margin-bottom: 15px;
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
    .section-header {
      font-weight: bold;
      font-size: 16px;
    }

    .log-container {
      min-height: 150px;
      max-height: 250px;
      padding: 10px;
      overflow-y: auto;
      background-color: #f5f7fa;
      border-radius: 4px;

      .log-item {
        padding: 8px 10px;
        margin-bottom: 5px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

        .log-time {
          margin-right: 10px;
          color: #909399;
          font-family: monospace;
        }

        .log-type {
          margin-right: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 3px;

          &.log-success {
            color: #67c23a;
            background-color: rgba(103, 194, 58, 0.1);
          }

          &.log-fail {
            color: #f56c6c;
            background-color: rgba(245, 108, 108, 0.1);
          }

          &.log-close {
            color: #909399;
            background-color: rgba(144, 147, 153, 0.1);
          }

          &.log-reset {
            color: #e6a23c;
            background-color: rgba(230, 162, 60, 0.1);
          }
        }

        .log-message {
          word-break: break-all;
        }
      }
    }
  }
}
</style>
