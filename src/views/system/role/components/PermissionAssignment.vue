<template>
  <el-dialog v-model="visible" :title="t('permission.assignPermission')" width="600px">
    <div v-if="currentRole">
      <p>{{ t('permission.role') }}：{{ currentRole.name }} ({{ currentRole.code }})</p>
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTreeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectedPermissions"
        :props="{ label: 'name', children: 'children' }"
        @check="handleCheckChange"
      />
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
import type { Role } from '@/store/modules/system';
import type { ElTree } from 'element-plus';

const { t } = useI18n();

interface TreeNode {
  id: string;
  name: string;
  code?: string;
  children?: TreeNode[];
}

interface Props {
  visible: boolean;
  loading: boolean;
  currentRole: Role | null;
  permissionTreeData: TreeNode[];
  selectedPermissions: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:visible': [value: boolean];
  submit: [permissions: string[]];
  cancel: [];
}>();

const visible = ref(props.visible);
const permissionTreeRef = ref<InstanceType<typeof ElTree>>();
const localSelectedPermissions = ref<string[]>([]);

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
  () => props.selectedPermissions,
  val => {
    localSelectedPermissions.value = [...val];
  },
  { immediate: true }
);

const handleCheckChange = () => {
  if (permissionTreeRef.value) {
    // 获取所有选中的节点（不包括父节点）
    const checkedNodes = permissionTreeRef.value.getCheckedNodes(false);
    // 提取节点ID，过滤掉模块节点
    localSelectedPermissions.value = checkedNodes
      .filter(node => !node.id.startsWith('module_'))
      .map(node => node.id);
  }
};

const handleSubmit = () => {
  emit('submit', localSelectedPermissions.value);
};

const handleCancel = () => {
  emit('cancel');
};
</script>
