<template>
  <el-dialog
    v-model="visible"
    :title="t('common.userCenter')"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="80px">
      <!-- 用户头像 -->
      <el-form-item :label="t('common.avatar')" class="avatar-form-item">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleAvatarChange"
        >
          <el-avatar :size="100" :src="avatarUrl || defaultAvatar" class="avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
          <div class="avatar-hover-mask">
            <el-icon class="upload-icon"><Plus /></el-icon>
          </div>
        </el-upload>
        <div class="avatar-tip">{{ t('profile.avatarTip') }}</div>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item :label="t('common.username')" prop="username">
        <el-input v-model="form.username" disabled />
      </el-form-item>

      <!-- 角色 -->
      <el-form-item :label="t('permission.role')">
        <div class="role-tags">
          <el-tag v-for="role in userRoles" :key="role" class="mr-[5px]">
            {{ role }}
          </el-tag>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ t('common.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Plus, UserFilled } from '@element-plus/icons-vue';
import { useAuthStore } from '@/store/modules/auth';
import { useSystemStore } from '@/store/modules/system';
import type { FormInstance } from 'element-plus';
import { updateUserService } from '@/api';
import defaultAvatar from '@/assets/images/default-avatar.png';

const { t } = useI18n();
const authStore = useAuthStore();
const systemStore = useSystemStore();

// 属性定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

// 事件
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

// 响应式状态
const visible = ref(props.visible);
const loading = ref(false);
const formRef = ref<FormInstance>();
const avatarFile = ref<File | null>(null);
const avatarUrl = ref('');
const isUserInfoLoaded = ref(false);

// 表单数据
const form = reactive({
  username: '',
});

// 计算用户角色名称
const userRoles = computed(() => {
  const roleIds = authStore.userInfo.roles || [];
  return roleIds.map(roleId => {
    const role = systemStore.roles.find(r => r.code === roleId);
    return role ? role.name : roleId;
  });
});

// 检查用户信息是否已加载
const checkUserInfo = async () => {
  // 如果用户信息为空或角色为空，重新获取
  if (
    !authStore.userInfo.id ||
    !authStore.userInfo.roles ||
    authStore.userInfo.roles.length === 0
  ) {
    try {
      loading.value = true;
      await authStore.getUserInfoAction();

      // 如果系统角色为空，初始化权限
      if (!systemStore.roles || systemStore.roles.length === 0) {
        await systemStore.initPermissions();
      }

      isUserInfoLoaded.value = true;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      ElMessage.error(t('profile.loadUserInfoFailed'));
    } finally {
      loading.value = false;
    }
  } else {
    isUserInfoLoaded.value = true;
  }
};

// 组件挂载时检查用户信息
onMounted(async () => {
  await checkUserInfo();
  // 初始化表单数据
  updateFormData();
});

// 更新表单数据
const updateFormData = () => {
  form.username = authStore.userInfo.username || '';
  avatarUrl.value = authStore.userInfo.avatar || '';
};

// 监听visible属性变化
watch(
  () => props.visible,
  async val => {
    visible.value = val;
    if (val) {
      // 对话框打开时，确保用户信息已加载
      if (!isUserInfoLoaded.value) {
        await checkUserInfo();
      }
      // 重置表单数据
      resetForm();
    }
  }
);

// 监听内部visible变化，同步到父组件
watch(visible, val => {
  emit('update:visible', val);
});

// 监听authStore.userInfo变化，更新表单数据
watch(
  () => authStore.userInfo,
  () => {
    updateFormData();
  },
  { deep: true }
);

// 重置表单
const resetForm = () => {
  updateFormData();
  avatarFile.value = null;
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 处理头像变更
const handleAvatarChange = (file: any) => {
  // 限制文件大小为2MB
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error(t('profile.avatarSizeLimit'));
    return;
  }

  // 限制文件类型
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error(t('profile.avatarTypeLimit'));
    return;
  }

  avatarFile.value = file.raw;
  avatarUrl.value = URL.createObjectURL(file.raw);
};

// 转换头像为base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;

  try {
    let avatarData = authStore.userInfo.avatar;

    // 如果有新上传的头像，转换为base64
    if (avatarFile.value) {
      avatarData = await getBase64(avatarFile.value);
    }

    // 调用API更新用户信息
    const res = await updateUserService({
      id: authStore.userInfo.id,
      avatar: avatarData,
    });

    if (res.code === 200) {
      ElMessage.success(t('profile.updateSuccess'));

      // 更新store中的用户信息
      authStore.userInfo = {
        ...authStore.userInfo,
        avatar: avatarData,
      };

      // 关闭对话框
      visible.value = false;
    } else {
      ElMessage.error(res.message || t('profile.updateFailed'));
    }
  } catch (error) {
    console.error('更新用户信息失败:', error);
    ElMessage.error(t('profile.updateFailed'));
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.avatar-form-item {
  :deep(.el-form-item__content) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-uploader {
    position: relative;
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;

    .avatar {
      display: block;
      width: 100%;
      height: 100%;
    }

    .avatar-hover-mask {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgb(0 0 0 / 50%);
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s;

      .upload-icon {
        font-size: 24px;
        color: #fff;
      }
    }

    &:hover {
      .avatar-hover-mask {
        opacity: 1;
      }
    }
  }

  .avatar-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
  }
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
