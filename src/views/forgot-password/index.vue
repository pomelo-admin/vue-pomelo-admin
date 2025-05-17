<template>
  <div class="forgot-password-container">
    <div class="forgot-password-content">
      <div class="forgot-password-panel">
        <!-- 左侧 -->
        <div class="forgot-password-left">
          <div class="forgot-password-image"></div>
          <div class="forgot-password-text">
            <img src="@/assets/images/pomelo-logo.svg" alt="Logo" class="w-32 h-32 mb-4 mx-auto" />
            <h2 class="text-2xl font-bold text-white">{{ $t('forgotPassword.welcome') }}</h2>
            <p class="text-white mt-2 opacity-90">{{ $t('forgotPassword.description') }}</p>
          </div>
        </div>

        <!-- 右侧 -->
        <div class="forgot-password-form">
          <div class="flex flex-col items-center mb-8">
            <h2 class="text-2xl font-bold">{{ $t('forgotPassword.title') }}</h2>
          </div>

          <div v-if="!emailSent">
            <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" size="large">
              <el-form-item prop="email">
                <el-input
                  v-model="forgotForm.email"
                  :placeholder="$t('forgotPassword.emailPlaceholder')"
                  :prefix-icon="Message"
                />
              </el-form-item>

              <el-button type="primary" class="w-full" :loading="loading" @click="handleSubmit">
                {{ $t('forgotPassword.submit') }}
              </el-button>
            </el-form>
          </div>

          <div v-else class="text-center">
            <el-result
              icon="success"
              :title="$t('forgotPassword.emailSentTitle')"
              :sub-title="$t('forgotPassword.emailSentDesc')"
            >
              <template #extra>
                <el-button type="primary" @click="resendEmail" :loading="resendLoading">
                  {{ $t('forgotPassword.resendEmail') }}
                </el-button>
              </template>
            </el-result>
          </div>

          <div class="mt-4 text-center">
            <p class="text-gray-500">
              {{ $t('forgotPassword.backToLogin') }}
              <el-button link @click="goToLogin">{{ $t('common.login') }}</el-button>
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
import Footer from '@/components/Footer.vue';

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
  @apply h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900 relative;

  .forgot-password-content {
    @apply flex-1 flex items-center justify-center;
  }

  .forgot-password-panel {
    @apply flex w-[800px] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden;

    .forgot-password-left {
      @apply w-1/2 relative flex flex-col items-center justify-center bg-primary;

      .forgot-password-image {
        @apply absolute inset-0 opacity-20;
      }

      .forgot-password-text {
        @apply z-10 text-white text-center;
      }
    }

    .forgot-password-form {
      @apply w-1/2 p-10 flex flex-col justify-center;
    }
  }

  .forgot-password-footer {
    @apply absolute bottom-0 left-0 right-0 w-full py-4;
  }
}

@media (width <= 768px) {
  .forgot-password-panel {
    @apply w-[90%] max-w-md h-auto flex-col;

    .forgot-password-left {
      @apply w-full h-32;
    }

    .forgot-password-form {
      @apply w-full;
    }
  }
}
</style>
