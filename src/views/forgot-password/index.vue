<template>
  <div class="forgot-password-container">
    <div class="forgot-password-content">
      <div class="forgot-password-card">
        <!-- Logo 和标题区域 -->
        <div class="forgot-password-header">
          <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-16 h-16 mb-4 mx-auto" />
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {{ t('forgotPassword.welcome') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-8">
            {{ t('forgotPassword.description') }}
          </p>
        </div>

        <!-- 表单内容 -->
        <div class="forgot-password-form">
          <div v-if="!emailSent">
            <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" size="large">
              <el-form-item prop="email" class="custom-form-item">
                <el-input
                  v-model="forgotForm.email"
                  :placeholder="t('forgotPassword.emailPlaceholder')"
                  :prefix-icon="Message"
                  class="custom-input"
                />
              </el-form-item>

              <el-button
                type="primary"
                class="w-full custom-button"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ t('forgotPassword.submit') }}
              </el-button>
            </el-form>
          </div>

          <div v-else class="text-center">
            <div class="success-content">
              <div class="success-icon mb-4">
                <el-icon size="48" color="#67c23a">
                  <SuccessFilled />
                </el-icon>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {{ t('forgotPassword.emailSentTitle') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {{ t('forgotPassword.emailSentDesc') }}
              </p>
              <el-button
                type="primary"
                class="custom-button"
                @click="resendEmail"
                :loading="resendLoading"
              >
                {{ t('forgotPassword.resendEmail') }}
              </el-button>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('forgotPassword.backToLogin') }}
              <el-button link class="custom-link login-link" @click="goToLogin"
                >{{ t('common.signIn') }}
              </el-button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚版权信息 -->
    <Footer class="forgot-password-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { Message, SuccessFilled } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { Footer } from '@/components/common';

const { t } = useI18n();
const loading = ref(false);
const resendLoading = ref(false);
const emailSent = ref(false);
const forgotFormRef = ref();
const router = useRouter();

// 表单数据
const forgotForm = reactive({
  email: '',
});

// 表单验证规则
const forgotRules = reactive<FormRules>({
  email: [
    { required: true, message: t('forgotPassword.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('forgotPassword.emailInvalid'), trigger: 'blur' },
  ],
});

// 提交处理
const handleSubmit = async () => {
  if (!forgotFormRef.value) return;

  await forgotFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 假设发送成功
        emailSent.value = true;
        ElMessage.success(t('forgotPassword.emailSentSuccess'));
      } catch (error: any) {
        ElMessage.error(error.message || t('forgotPassword.error'));
      } finally {
        loading.value = false;
      }
    }
  });
};

// 重新发送邮件
const resendEmail = async () => {
  resendLoading.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 假设重新发送成功
    ElMessage.success(t('forgotPassword.resendSuccess'));
  } catch (error: any) {
    ElMessage.error(error.message || t('forgotPassword.error'));
  } finally {
    resendLoading.value = false;
  }
};

// 返回登录页
const goToLogin = () => {
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.forgot-password-container {
  @apply h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden;

  &::before {
    content: '';

    @apply absolute inset-0 opacity-30;

    background:
      radial-gradient(circle at 20% 80%, rgb(120 119 198 / 30%) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgb(255 119 198 / 30%) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgb(120 219 255 / 20%) 0%, transparent 50%);
  }

  .forgot-password-content {
    @apply flex-1 flex items-center justify-center relative z-10 px-4;
  }

  .forgot-password-card {
    @apply w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative;

    border: 1px solid rgb(255 255 255 / 10%);
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 10%),
      0 10px 10px -5px rgb(0 0 0 / 4%),
      0 0 0 1px rgb(255 255 255 / 5%);
    backdrop-filter: blur(10px);
    transform: translateY(0);
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
    animation: fade-in 0.6s ease-out;

    &:hover {
      box-shadow:
        0 25px 50px -12px rgb(0 0 0 / 25%),
        0 0 0 1px rgb(255 255 255 / 10%);
      transform: translateY(-2px);
    }

    .forgot-password-header {
      @apply text-center mb-8;
    }

    .forgot-password-form {
      @apply w-full;
    }

    .success-content {
      .success-icon {
        @apply flex justify-center;
      }
    }
  }

  .forgot-password-footer {
    @apply absolute bottom-0 left-0 right-0 w-full py-4 z-10;
  }
}

.custom-form-item {
  margin-bottom: 20px;
}

.custom-input :deep(.el-input__wrapper) {
  padding: 2px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 5%);
  transition: all 0.3s;

  &:hover,
  &:focus-within {
    box-shadow:
      0 3px 15px rgb(99 102 241 / 12%),
      0 0 0 1px rgb(99 102 241 / 20%);
  }

  &.is-focus {
    box-shadow:
      0 3px 15px rgb(99 102 241 / 15%),
      0 0 0 1px rgb(99 102 241 / 40%);
  }
}

.custom-button {
  @apply bg-gradient-primary;

  height: 48px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.025em;
  border: none;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover,
  &:focus {
    @apply bg-gradient-secondary shadow-neon;

    transform: translateY(-2px);
  }
}

.custom-link {
  font-weight: 500;
  color: #6366f1;

  &:hover,
  &:focus {
    color: #8b5cf6;
  }

  &.login-link {
    font-weight: 600;
    color: #8b5cf6;

    &:hover,
    &:focus {
      color: #ec4899;
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (width <= 768px) {
  .forgot-password-container {
    .forgot-password-content {
      @apply px-4;
    }

    .forgot-password-card {
      @apply w-full max-w-sm p-6;

      .forgot-password-header {
        @apply mb-6;

        img {
          @apply w-12 h-12;
        }

        h1 {
          @apply text-xl;
        }

        p {
          @apply text-xs;
        }
      }
    }
  }
}

@media (width <= 480px) {
  .forgot-password-card {
    @apply p-4 mx-2;
  }
}
</style>
