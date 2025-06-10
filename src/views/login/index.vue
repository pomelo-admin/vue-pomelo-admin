<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-panel">
        <!-- 登录面板左侧 -->
        <div class="login-left">
          <div class="login-image"></div>
          <div class="login-text">
            <img
              src="@/assets/images/pomelo-logo.svg"
              alt="Logo"
              class="w-32 h-32 mb-6 mx-auto animate-pulse-slow"
            />
            <h2 class="text-3xl font-bold text-white mb-3">{{ t('login.welcome') }}</h2>
            <p class="text-white text-lg mt-2 opacity-90 max-w-xs mx-auto">
              {{ t('login.description') }}
            </p>
          </div>
        </div>

        <!-- 登录面板右侧 -->
        <div class="login-form">
          <div class="flex flex-col items-center mb-8">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-primary">
              {{ t('login.title') }}
            </h2>
          </div>

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
              <el-checkbox v-model="rememberMe" class="custom-checkbox">{{
                t('common.rememberMe')
              }}</el-checkbox>
              <el-button link class="custom-link" @click="goToForgotPassword">{{
                t('common.forgotPassword')
              }}</el-button>
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
            <p class="text-gray-600">
              {{ t('common.noAccount') }}
              <el-button link class="custom-link register-link" @click="goToRegister">{{
                t('common.register')
              }}</el-button>
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
  @apply h-screen w-full flex flex-col bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden;

  &::before {
    content: '';

    @apply absolute inset-0 bg-gradient-pattern opacity-70;
  }

  .login-content {
    @apply flex-1 flex items-center justify-center relative z-10;
  }

  .login-panel {
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

    .login-left {
      @apply w-1/2 relative flex flex-col items-center justify-center bg-gradient-primary overflow-hidden;

      position: relative;

      &::before {
        content: '';

        @apply absolute inset-0 bg-gradient-pattern opacity-20;
      }

      .login-image {
        @apply absolute inset-0 opacity-20;
      }

      .login-text {
        @apply z-10 text-white text-center p-12;
      }
    }

    .login-form {
      @apply w-1/2 p-12 flex flex-col justify-center;
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
  .login-panel {
    @apply w-[90%] max-w-md h-auto flex-col;

    .login-left {
      @apply w-full h-64;
    }

    .login-form {
      @apply w-full;
    }
  }
}
</style>
