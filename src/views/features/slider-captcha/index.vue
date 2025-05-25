<template>
  <FeatureDemo
    :title="t('features.sliderCaptcha.title')"
    :description="t('features.sliderCaptcha.description')"
    path="src/components/features/slider-captcha"
  >
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
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import FeatureDemo from '@/components/common/FeatureDemo.vue';
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
.demo-section {
  margin-bottom: 20px;

  .section-header {
    font-size: 16px;
    font-weight: bold;
  }

  p {
    margin-bottom: 15px;
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
  .section-header {
    font-size: 16px;
    font-weight: bold;
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
      box-shadow: 0 1px 2px rgb(0 0 0 / 5%);

      .log-time {
        margin-right: 10px;
        font-family: monospace;
        color: #909399;
      }

      .log-type {
        padding: 2px 6px;
        margin-right: 10px;
        font-weight: bold;
        border-radius: 3px;

        &.log-success {
          color: #67c23a;
          background-color: rgb(103 194 58 / 10%);
        }

        &.log-fail {
          color: #f56c6c;
          background-color: rgb(245 108 108 / 10%);
        }

        &.log-close {
          color: #909399;
          background-color: rgb(144 147 153 / 10%);
        }

        &.log-reset {
          color: #e6a23c;
          background-color: rgb(230 162 60 / 10%);
        }
      }

      .log-message {
        word-break: break-all;
      }
    }
  }
}
</style>
