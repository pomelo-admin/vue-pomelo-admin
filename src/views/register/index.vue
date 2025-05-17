<template>
  <div class="register-container">
    <div class="register-content">
      <div class="register-panel">
        <!-- 注册面板左侧 -->
        <div class="register-left">
          <div class="register-image"></div>
          <div class="register-text">
            <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-32 h-32 mb-4 mx-auto" />
            <h2 class="text-2xl font-bold text-white">{{ $t('register.welcome') }}</h2>
            <p class="text-white mt-2 opacity-90">{{ $t('register.description') }}</p>
          </div>
        </div>

        <!-- 注册面板右侧 -->
        <div class="register-form">
          <div class="flex flex-col items-center mb-8">
            <h2 class="text-2xl font-bold">{{ $t('register.title') }}</h2>
          </div>

          <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                :placeholder="$t('common.username')"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                :placeholder="$t('register.emailPlaceholder')"
                :prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                :placeholder="$t('common.password')"
                :prefix-icon="Lock"
                type="password"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                :placeholder="$t('register.confirmPassword')"
                :prefix-icon="Lock"
                type="password"
                show-password
              />
            </el-form-item>

            <div class="w-full flex items-center mb-4">
              <el-checkbox v-model="agreeTerms">
                {{ $t('register.agreeTerms') }}
                <el-button link>{{ $t('register.termsLink') }}</el-button>
              </el-checkbox>
            </div>

            <el-button type="primary" class="w-full" :loading="loading" @click="handleRegister">
              {{ $t('common.register') }}
            </el-button>
          </el-form>

          <div class="mt-4 text-center">
            <p class="text-gray-500">
              {{ $t('register.haveAccount') }}
              <el-button link @click="goToLogin">{{ $t('common.login') }}</el-button>
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
import Footer from '@/components/Footer.vue';

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
  @apply h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900 relative;

  .register-content {
    @apply flex-1 flex items-center justify-center;
  }

  .register-panel {
    @apply flex w-[800px] h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden;

    .register-left {
      @apply w-1/2 relative flex flex-col items-center justify-center bg-primary;

      .register-image {
        @apply absolute inset-0 opacity-20;
      }

      .register-text {
        @apply z-10 text-white text-center;
      }
    }

    .register-form {
      @apply w-1/2 p-10 flex flex-col justify-center;
    }
  }

  .register-footer {
    @apply absolute bottom-0 left-0 right-0 w-full py-4;
  }
}

@media (width <= 768px) {
  .register-panel {
    @apply w-[90%] max-w-md h-auto flex-col;

    .register-left {
      @apply w-full h-32;
    }

    .register-form {
      @apply w-full;
    }
  }
}
</style>
