<template>
  <FeatureDemo
    :title="t('features.digitCaptcha.title')"
    :description="t('features.digitCaptcha.description')"
    path="src/components/features/digit-captcha"
  >
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.digitCaptcha.numericMode') }}</span>
        </div>
      </template>
      <p>{{ t('features.digitCaptcha.numericDescription') }}</p>

      <div class="captcha-container">
        <el-form :model="form" label-position="top">
          <el-form-item
            :label="t('features.digitCaptcha.captchaLabel')"
            :error="numericCaptchaError"
          >
            <DigitCaptcha
              ref="numericCaptchaRef"
              v-model="form.captcha"
              :length="4"
              :alphanumeric="false"
              :placeholder="t('features.digitCaptcha.alphaPlaceholder')"
              @success="handleSuccess"
              @failure="handleFailure"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">{{ t('common.submit') }}</el-button>
            <el-button @click="resetForm">{{ t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.digitCaptcha.alphanumericMode') }}</span>
        </div>
      </template>
      <p>{{ t('features.digitCaptcha.alphanumericDescription') }}</p>

      <div class="captcha-container">
        <el-form :model="formAlpha" label-position="top">
          <el-form-item
            :label="t('features.digitCaptcha.captchaLabel')"
            :error="alphaNumericCaptchaError"
          >
            <DigitCaptcha
              ref="alphaNumericCaptchaRef"
              v-model="formAlpha.captcha"
              :length="6"
              :alphanumeric="true"
              :placeholder="t('features.digitCaptcha.alphaPlaceholder')"
              @success="handleAlphaSuccess"
              @failure="handleAlphaFailure"
              @change="handleAlphaChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAlphaSubmit">{{
              t('common.submit')
            }}</el-button>
            <el-button @click="resetAlphaForm">{{ t('common.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="event-log" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.digitCaptcha.eventLog') }}</span>
        </div>
      </template>
      <div class="log-container">
        <el-empty
          v-if="!logMessages.length"
          :description="t('features.digitCaptcha.noLog')"
        ></el-empty>
        <div v-else v-for="(log, index) in logMessages" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span :class="['log-type', `log-${log.type}`]">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </el-card>
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FeatureDemo from '@/components/common/FeatureDemo.vue';
import DigitCaptcha from '@/components/features/digit-captcha/index.vue';

const { t } = useI18n();

// 定义组件的类型
type DigitCaptchaInstance = {
  refresh: () => void;
  checkResult: () => boolean;
  actualCaptcha: string;
  isValid: boolean;
};

// 表单数据
const form = ref({
  captcha: '',
});

const formAlpha = ref({
  captcha: '',
});

const numericCaptchaRef = ref<DigitCaptchaInstance | null>(null);
const alphaNumericCaptchaRef = ref<DigitCaptchaInstance | null>(null);

// 验证码错误信息
const numericCaptchaError = ref('');
const alphaNumericCaptchaError = ref('');

// 日志记录
const logMessages = ref<{ time: string; type: string; message: string }[]>([]);
const alphaResult = ref('pending');

// 添加日志
const addLog = (type: string, message: string) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  logMessages.value.unshift({
    time,
    type,
    message,
  });

  // 最多保留20条日志
  if (logMessages.value.length > 20) {
    logMessages.value.pop();
  }
};

// 处理纯数字验证码相关事件
const handleChange = (value: string) => {
  numericCaptchaError.value = '';
  addLog('info', `${t('features.digitCaptcha.inputChange')}: ${value}`);
};

const handleSuccess = (value: string) => {
  numericCaptchaError.value = '';
  addLog('success', `${t('features.digitCaptcha.inputSuccess')}: ${value}`);
};

const handleFailure = (value: string) => {
  numericCaptchaError.value = t('features.digitCaptcha.inputError');
  addLog('error', `${t('features.digitCaptcha.inputFail')}: ${value}`);
};

const handleSubmit = () => {
  const captchaComponent = numericCaptchaRef.value;
  if (captchaComponent && captchaComponent.isValid) {
    addLog('success', t('features.digitCaptcha.formSuccess'));
  } else {
    numericCaptchaError.value = t('features.digitCaptcha.inputError');
    addLog('error', t('features.digitCaptcha.formFail'));
  }
};

const resetForm = () => {
  form.value = {
    captcha: '',
  };
  numericCaptchaError.value = '';
  if (numericCaptchaRef.value) {
    numericCaptchaRef.value.refresh();
  }
  addLog('info', t('features.digitCaptcha.formReset'));
};

// 处理字母数字混合验证码相关事件
const handleAlphaChange = (value: string) => {
  alphaNumericCaptchaError.value = '';
  alphaResult.value = 'pending';
  addLog('info', `${t('features.digitCaptcha.alphaInputChange')}: ${value}`);
};

const handleAlphaSuccess = (value: string) => {
  alphaNumericCaptchaError.value = '';
  alphaResult.value = 'success';
  addLog('success', `${t('features.digitCaptcha.alphaInputSuccess')}: ${value}`);
};

const handleAlphaFailure = (value: string) => {
  alphaNumericCaptchaError.value = t('features.digitCaptcha.inputError');
  alphaResult.value = 'failure';
  addLog('error', `${t('features.digitCaptcha.alphaInputFail')}: ${value}`);
};

const handleAlphaSubmit = () => {
  const captchaComponent = alphaNumericCaptchaRef.value;
  if (captchaComponent && captchaComponent.isValid) {
    addLog('success', t('features.digitCaptcha.alphaFormSuccess'));
  } else if (captchaComponent) {
    // 手动检查一次验证结果
    if (captchaComponent.checkResult()) {
      addLog('success', t('features.digitCaptcha.alphaFormSuccess'));
    } else {
      alphaNumericCaptchaError.value = t('features.digitCaptcha.inputError');
      addLog('error', t('features.digitCaptcha.alphaFormFail'));
    }
  }
};

const resetAlphaForm = () => {
  formAlpha.value = {
    captcha: '',
  };
  alphaNumericCaptchaError.value = '';
  if (alphaNumericCaptchaRef.value) {
    alphaNumericCaptchaRef.value.refresh();
  }
  alphaResult.value = 'pending';
  addLog('info', t('features.digitCaptcha.alphaFormReset'));
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

  .captcha-container {
    margin: 20px 0;
  }
}

.event-log {
  margin-bottom: 20px;

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

        &.log-error {
          color: #f56c6c;
          background-color: rgb(245 108 108 / 10%);
        }

        &.log-info {
          color: #409eff;
          background-color: rgb(64 158 255 / 10%);
        }
      }

      .log-message {
        word-break: break-all;
      }
    }
  }
}
</style>
