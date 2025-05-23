<template>
  <el-dialog
    v-model="visible"
    :title="dialogType === 'add' ? t('permission.addRole') : t('permission.editRole')"
    width="500px"
  >
    <el-form ref="roleFormRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item :label="t('permission.roleName')" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item :label="t('permission.roleCode')" prop="code">
        <el-input v-model="form.code" :disabled="dialogType === 'edit'" />
      </el-form-item>
      <el-form-item :label="t('permission.roleDesc')" prop="description">
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
import type { Role } from '@/store/modules/system';

const { t } = useI18n();

interface Props {
  visible: boolean;
  loading: boolean;
  dialogType: 'add' | 'edit';
  role: Role;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [formData: Partial<Role>];
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
const roleFormRef = ref<FormInstance>();
const form = reactive<Partial<Role>>({
  id: '',
  name: '',
  code: '',
  description: '',
  permissions: [],
});

// 表单验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: t('permission.roleName'), trigger: 'blur' }],
  code: [
    { required: true, message: t('permission.roleCode'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('permission.roleCode'), trigger: 'blur' },
  ],
});

// 当传入的角色对象变化时，更新表单
watch(
  () => props.role,
  val => {
    form.id = val.id;
    form.name = val.name;
    form.code = val.code;
    form.description = val.description || '';
    form.permissions = val.permissions || [];
  },
  { immediate: true }
);

// 提交表单
const handleSubmit = async () => {
  if (!roleFormRef.value) return;

  await roleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit('submit', {
        id: form.id,
        name: form.name,
        code: form.code,
        description: form.description,
        permissions: form.permissions,
      });
    }
  });
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>
