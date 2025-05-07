<template>
  <div class="login-container">
    <div class="login-panel">
      <!-- 登录面板左侧 -->
      <div class="login-left">
        <div class="login-image"></div>
        <div class="login-text">
          <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-32 h-32 mb-4 mx-auto" />
          <h2 class="text-2xl font-bold text-white">{{ $t('login.welcome') }}</h2>
          <p class="text-white mt-2 opacity-90">{{ $t('login.description') }}</p>
        </div>
      </div>

      <!-- 登录面板右侧 -->
      <div class="login-form">
        <div class="flex flex-col items-center mb-8">
          <h2 class="text-2xl font-bold">{{ $t('login.title') }}</h2>
        </div>

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" :placeholder="$t('common.username')" :prefix-icon="User" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" :placeholder="$t('common.password')" :prefix-icon="Lock"
              type="password" show-password />
          </el-form-item>

          <div class="w-full flex justify-between items-center mb-4">
            <el-checkbox v-model="rememberMe">{{ $t('common.rememberMe') }}</el-checkbox>
            <el-button link>{{ $t('common.forgotPassword') }}</el-button>
          </div>

          <el-button type="primary" class="w-full" :loading="loading" @click="handleLogin">
            {{ $t('common.login') }}
          </el-button>
        </el-form>

        <div class="mt-4 text-center">
          <p class="text-gray-500">{{ $t('common.noAccount') }} <el-button link>{{ $t('common.register') }}</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const loading = ref(false);
const rememberMe = ref(false);
const loginFormRef = ref();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 登录表单
const loginForm = reactive({
  username: 'admin',
  password: 'admin123'
});

// 登录规则
const loginRules = {
  username: [
    { required: true, message: t('common.username') + '不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('common.password') + '不能为空', trigger: 'blur' },
    { min: 6, message: t('common.password') + '长度至少为6个字符', trigger: 'blur' }
  ]
};

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        await userStore.loginAction(loginForm);
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
</script>

<style lang="scss" scoped>
.login-container {
  @apply h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900;

  .login-panel {
    @apply flex w-[800px] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden;

    .login-left {
      @apply w-1/2 relative flex flex-col items-center justify-center bg-primary;

      .login-image {
        @apply absolute inset-0 opacity-20;
      }

      .login-text {
        @apply z-10 text-white text-center;
      }
    }

    .login-form {
      @apply w-1/2 p-10 flex flex-col justify-center;
    }
  }
}

@media (max-width: 768px) {
  .login-panel {
    @apply w-[90%] max-w-md h-auto flex-col;

    .login-left {
      @apply w-full h-32;
    }

    .login-form {
      @apply w-full;
    }
  }
}
</style>