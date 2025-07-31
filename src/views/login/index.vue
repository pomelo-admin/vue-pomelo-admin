<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-card">
        <!-- Logo 和标题区域 -->
        <div class="login-header">
          <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-16 h-16 mb-4 mx-auto" />
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {{ t('login.welcome') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-8">
            {{ t('login.description') }}
          </p>
        </div>

        <!-- 登录表单 -->
        <div class="login-form">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
            <el-form-item prop="username" class="custom-form-item">
              <el-input
                v-model="loginForm.username"
                :placeholder="t('common.username')"
                :prefix-icon="User"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="password" class="custom-form-item">
              <el-input
                v-model="loginForm.password"
                :placeholder="t('common.password')"
                :prefix-icon="Lock"
                type="password"
                show-password
                class="custom-input"
              />
            </el-form-item>

            <div class="w-full flex justify-between items-center mb-6">
              <el-checkbox v-model="rememberMe" class="custom-checkbox"
                >{{ t('common.rememberMe') }}
              </el-checkbox>
              <el-button link class="custom-link" @click="goToForgotPassword"
                >{{ t('common.forgotPassword') }}
              </el-button>
            </div>

            <el-button
              type="primary"
              class="w-full custom-button"
              :loading="loading"
              @click="handleLogin"
            >
              {{ t('common.signIn') }}
            </el-button>
          </el-form>

          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('common.noAccount') }}
              <el-button link class="custom-link register-link" @click="goToRegister"
                >{{ t('common.register') }}
              </el-button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚版权信息 -->
    <Footer class="login-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import type { FormRules } from 'element-plus';
import { Footer } from '@/components/common';

const { t } = useI18n();
const loading = ref(false);
const rememberMe = ref(false);
const loginFormRef = ref();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 登录表单
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
});

// 登录规则
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: t('common.username') + '不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: t('common.password') + '不能为空', trigger: 'blur' },
    { min: 6, message: t('common.password') + '长度至少为6个字符', trigger: 'blur' },
  ],
});

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        await authStore.loginAction(loginForm);
        ElMessage.success(t('login.success'));

        const redirect = route.query.redirect as string;
        router.push(redirect || '/');
      } catch (error: any) {
        console.error('登录失败:', error);
        ElMessage.error(error.message || t('login.error'));
      } finally {
        loading.value = false;
      }
    }
  });
};

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/forgot-password');
};

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register');
};
</script>

<style lang="scss" scoped>
.login-container {
  @apply h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden;

  &::before {
    content: '';

    @apply absolute inset-0 opacity-30;

    background:
      radial-gradient(circle at 20% 80%, rgb(120 119 198 / 30%) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgb(255 119 198 / 30%) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgb(120 219 255 / 20%) 0%, transparent 50%);
  }

  .login-content {
    @apply flex-1 flex items-center justify-center relative z-10 px-4;
  }

  .login-card {
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

    .login-header {
      @apply text-center mb-8;
    }

    .login-form {
      @apply w-full;
    }
  }

  .login-footer {
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

  &.register-link {
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
  .login-container {
    .login-content {
      @apply px-4;
    }

    .login-card {
      @apply w-full max-w-sm p-6;

      .login-header {
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
  .login-card {
    @apply p-4 mx-2;
  }
}
</style>
