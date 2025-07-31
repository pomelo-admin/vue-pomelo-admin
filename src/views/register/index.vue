<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-card">
        <!-- Logo 和标题区域 -->
        <div class="register-header">
          <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-16 h-16 mb-4 mx-auto" />
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {{ t('register.welcome') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-8">
            {{ t('register.description') }}
          </p>
        </div>

        <!-- 注册表单 -->
        <div class="register-form">
          <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
            <el-form-item prop="username" class="custom-form-item">
              <el-input
                v-model="registerForm.username"
                :placeholder="t('common.username')"
                :prefix-icon="User"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="email" class="custom-form-item">
              <el-input
                v-model="registerForm.email"
                :placeholder="t('register.emailPlaceholder')"
                :prefix-icon="Message"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="password" class="custom-form-item">
              <el-input
                v-model="registerForm.password"
                :placeholder="t('common.password')"
                :prefix-icon="Lock"
                type="password"
                show-password
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="confirmPassword" class="custom-form-item">
              <el-input
                v-model="registerForm.confirmPassword"
                :placeholder="t('register.confirmPassword')"
                :prefix-icon="Lock"
                type="password"
                show-password
                class="custom-input"
              />
            </el-form-item>

            <div class="w-full flex items-center mb-6">
              <el-checkbox v-model="agreeTerms" class="custom-checkbox">
                {{ t('register.agreeTerms') }}
                <el-button link class="custom-link">{{ t('register.termsLink') }}</el-button>
              </el-checkbox>
            </div>

            <el-button
              type="primary"
              class="w-full custom-button"
              :loading="loading"
              @click="handleRegister"
            >
              {{ t('common.register') }}
            </el-button>
          </el-form>

          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('register.haveAccount') }}
              <el-button link class="custom-link login-link" @click="goToLogin"
                >{{ t('common.signIn') }}
              </el-button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚版权信息 -->
    <Footer class="register-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus';
import { User, Lock, Message } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { Footer } from '@/components/common';

const { t } = useI18n();
const loading = ref(false);
const agreeTerms = ref(false);
const registerFormRef = ref();
const router = useRouter();

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// 密码确认验证器
const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error(t('register.confirmPasswordRequired')));
  } else if (value !== registerForm.password) {
    callback(new Error(t('register.passwordMismatch')));
  } else {
    callback();
  }
};

// 注册规则
const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: t('register.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: t('register.usernameLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('register.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('register.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('register.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('register.passwordLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: t('register.confirmPasswordRequired'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
});

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  if (!agreeTerms.value) {
    ElMessage.warning(t('register.agreeTermsRequired'));
    return;
  }

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 简单的用户名检查 - 在实际应用中应该通过API检查
        if (registerForm.username === 'admin') {
          throw new Error(t('register.usernameTaken'));
        }

        // 假设注册成功
        ElMessage.success(t('register.success'));
        router.push('/login');
      } catch (error: any) {
        console.error('注册失败:', error);
        ElMessage.error(error.message || t('register.error'));
      } finally {
        loading.value = false;
      }
    }
  });
};

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.register-container {
  @apply h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden;

  &::before {
    content: '';
    @apply absolute inset-0 opacity-30;
    background:
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  }

  .register-content {
    @apply flex-1 flex items-center justify-center relative z-10 px-4;
  }

  .register-card {
    @apply w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative;

    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 10%),
      0 10px 10px -5px rgb(0 0 0 / 4%),
      0 0 0 1px rgb(255 255 255 / 5%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
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

    .register-header {
      @apply text-center mb-8;
    }

    .register-form {
      @apply w-full;
    }
  }

  .register-footer {
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

.custom-checkbox {
  :deep(.el-checkbox__inner) {
    border-color: #d1d5db;
    border-radius: 6px;

    &:hover {
      border-color: #6366f1;
    }
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
  .register-container {
    .register-content {
      @apply px-4;
    }

    .register-card {
      @apply w-full max-w-sm p-6;

      .register-header {
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
  .register-card {
    @apply p-4 mx-2;
  }
}
</style>
