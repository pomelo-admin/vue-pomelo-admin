<template>
  <el-dialog v-model="visible" :title="t('permission.assignRole')" width="500px">
    <div v-if="currentUser">
      <p>{{ t('permission.user') }}：{{ currentUser.username }} ({{ currentUser.realName }})</p>
      <el-checkbox-group v-model="localSelectedRoles">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
          {{ role.name }}
          <el-tooltip :content="role.description" placement="top">
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </el-checkbox>
      </el-checkbox-group>
    </div>
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
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { InfoFilled } from '@element-plus/icons-vue';
import type { Role } from '@/store/modules/system';

const { t } = useI18n();

interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  status: number;
  roles: {
    id: string;
    name: string;
    code: string;
  }[];
}

interface Props {
  visible: boolean;
  loading: boolean;
  currentUser: User | null;
  roleList: Role[];
  selectedRoles: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [roleIds: string[]];
  cancel: [];
}>();

const visible = ref(props.visible);
const localSelectedRoles = ref<string[]>([]);

watch(
  () => props.visible,
  val => {
    visible.value = val;
  }
);

watch(visible, val => {
  emit('update:visible', val);
});

watch(
  () => props.selectedRoles,
  val => {
    localSelectedRoles.value = [...val];
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', localSelectedRoles.value);
};

const handleCancel = () => {
  emit('cancel');
};
</script>
