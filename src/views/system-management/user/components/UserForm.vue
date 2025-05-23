<template>
  <el-dialog
    v-model="visible"
    :title="dialogType === 'add' ? t('permission.addUser') : t('permission.editUser')"
    width="500px"
  >
    <el-form ref="userFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="t('common.username')" prop="username">
        <el-input v-model="form.username" :disabled="dialogType === 'edit'" />
      </el-form-item>
      <el-form-item :label="t('permission.realName')" prop="realName">
        <el-input v-model="form.realName" />
      </el-form-item>
      <el-form-item :label="t('common.password')" prop="password" v-if="dialogType === 'add'">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('permission.email')" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item :label="t('permission.phone')" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item :label="t('permission.status')">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ t('permission.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ t('permission.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormRules, FormInstance } from 'element-plus';

const { t } = useI18n();

interface Role {
  id: string;
  name: string;
  code: string;
}

interface User {
  id: string;
  username: string;
  realName: string;
  password?: string;
  email: string;
  phone: string;
  status: number;
  roles: Role[];
}

interface Props {
  visible: boolean;
  loading: boolean;
  dialogType: 'add' | 'edit';
  user: User;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [formData: Partial<User>];
  cancel: [];
}>();

const visible = ref(props.visible);
watch(
  () => props.visible,
  val => {
    visible.value = val;
  }
);
watch(visible, val => {
  emit('update:visible', val);
});

// 表单对象和引用
const userFormRef = ref<FormInstance>();
const form = reactive<Partial<User>>({
  id: '',
  username: '',
  realName: '',
  password: '',
  email: '',
  phone: '',
  status: 1,
  roles: [],
});

// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: t('common.username'), trigger: 'blur' },
    { min: 3, max: 20, message: t('register.usernameLength'), trigger: 'blur' },
  ],
  realName: [{ required: true, message: t('permission.realName'), trigger: 'blur' }],
  password: [
    { required: true, message: t('common.password'), trigger: 'blur' },
    { min: 6, max: 20, message: t('register.passwordLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('permission.email'), trigger: 'blur' },
    { type: 'email', message: t('register.emailInvalid'), trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: t('permission.phone'), trigger: 'blur' }],
});

// 当传入的用户对象变化时，更新表单
watch(
  () => props.user,
  val => {
    form.id = val.id;
    form.username = val.username;
    form.realName = val.realName;
    form.password = '';
    form.email = val.email;
    form.phone = val.phone;
    form.status = val.status;
    form.roles = val.roles;
  },
  { immediate: true }
);

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return;

  await userFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit('submit', form);
    }
  });
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>
