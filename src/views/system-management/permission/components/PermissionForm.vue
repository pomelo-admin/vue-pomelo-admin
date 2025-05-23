<template>
  <el-dialog
    v-model="visible"
    :title="dialogType === 'add' ? t('permission.addPermission') : t('permission.editPermission')"
    width="500px"
  >
    <el-form ref="permissionFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="t('permission.permissionName')" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="t('permission.permissionCode')" prop="code">
        <el-input v-model="form.code" :disabled="dialogType === 'edit'" />
        <div class="text-xs text-gray-400 leading-normal mt-1">
          {{ t('permission.codeFormatTip') }}
        </div>
      </el-form-item>
      <el-form-item :label="t('permission.permissionDesc')" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" />
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
import type { Permission } from '@/store/modules/system';

const { t } = useI18n();

interface Props {
  visible: boolean;
  loading: boolean;
  dialogType: 'add' | 'edit';
  permission: Permission | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [formData: Partial<Permission>];
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
const permissionFormRef = ref<FormInstance>();
const form = reactive<Partial<Permission>>({
  id: '',
  name: '',
  code: '',
  description: '',
});

// 表单验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: t('permission.permissionName'), trigger: 'blur' }],
  code: [
    { required: true, message: t('permission.permissionCode'), trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$/,
      message: t('permission.codeFormatTip'),
      trigger: 'blur',
    },
  ],
});

// 重置表单函数，提前定义避免在watch immediate调用时报错
const resetForm = () => {
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields();
  }

  form.id = '';
  form.name = '';
  form.code = '';
  form.description = '';
};

// 当传入的权限对象变化时，更新表单
watch(
  () => props.permission,
  val => {
    if (val) {
      form.id = val.id;
      form.name = val.name;
      form.code = val.code;
      form.description = val.description || '';
    } else {
      // 重置表单
      resetForm();
    }
  },
  { immediate: true }
);

// 提交表单
const handleSubmit = async () => {
  if (!permissionFormRef.value) return;

  await permissionFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit('submit', form);
    }
  });
};

// 取消
const handleCancel = () => {
  resetForm();
  emit('cancel');
};
</script>
