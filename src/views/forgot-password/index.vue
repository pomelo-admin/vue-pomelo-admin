<template>
  <div class="forgot-password-container">
    <div class="forgot-password-content">
      <div class="forgot-password-panel">
        <!-- 左侧 -->
        <div class="forgot-password-left">
          <div class="forgot-password-image"></div>
          <div class="forgot-password-text">
            <img
              src="@/assets/images/pomelo-logo.svg"
              alt="Logo"
              class="w-32 h-32 mb-6 mx-auto animate-pulse-slow"
            />
            <h2 class="text-3xl font-bold text-white mb-3">{{ t('forgotPassword.welcome') }}</h2>
            <p class="text-white text-lg mt-2 opacity-90 max-w-xs mx-auto">
              {{ t('forgotPassword.description') }}
            </p>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="forgot-password-form">
          <div class="flex flex-col items-center mb-8">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-primary">
              {{ t('forgotPassword.title') }}
            </h2>
          </div>

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
            <el-result
              icon="success"
              :title="t('forgotPassword.emailSentTitle')"
              :sub-title="t('forgotPassword.emailSentDesc')"
            >
              <template #extra>
                <el-button
                  type="primary"
                  class="custom-button"
                  @click="resendEmail"
                  :loading="resendLoading"
                >
                  {{ t('forgotPassword.resendEmail') }}
                </el-button>
              </template>
            </el-result>
          </div>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              {{ t('forgotPassword.backToLogin') }}
              <el-button link class="custom-link login-link" @click="goToLogin">{{
                t('common.login')
              }}</el-button>
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
import { Message } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import Footer from '@/components/common/Footer.vue';

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
  @apply h-screen w-full flex flex-col bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden;

  &::before {
    content: '';

    @apply absolute inset-0 bg-gradient-pattern opacity-70;
  }

  .forgot-password-content {
    @apply flex-1 flex items-center justify-center relative z-10;
  }

  .forgot-password-panel {
    @apply flex w-[900px] h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden;

    box-shadow:
      0 10px 30px rgb(99 102 241 / 20%),
      0 1px 8px rgb(99 102 241 / 10%);
    transform: translateY(0);
    transition:
      transform 0.3s ease-in-out,
      box-shadow 0.3s ease-in-out;
    animation: fade-in 0.6s ease-out;

    &:hover {
      box-shadow:
        0 20px 40px rgb(99 102 241 / 25%),
        0 5px 20px rgb(99 102 241 / 15%);
      transform: translateY(-5px);
    }

    .forgot-password-left {
      @apply w-1/2 relative flex flex-col items-center justify-center bg-gradient-primary overflow-hidden;

      position: relative;

      &::before {
        content: '';

        @apply absolute inset-0 bg-gradient-pattern opacity-20;
      }

      .forgot-password-image {
        @apply absolute inset-0 opacity-20;
      }

      .forgot-password-text {
        @apply z-10 text-white text-center p-12;
      }
    }

    .forgot-password-form {
      @apply w-1/2 p-12 flex flex-col justify-center;
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
  .forgot-password-panel {
    @apply w-[90%] max-w-md h-auto flex-col;

    .forgot-password-left {
      @apply w-full h-64;
    }

    .forgot-password-form {
      @apply w-full;
    }
  }
}
</style>
