<template>
  <div class="p-[5px]">
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between items-center">
          <RoleSearch @search="handleSearch" @reset="handleResetSearch" />
          <div class="flex items-center">
            <el-button type="success" @click="handleAdd" v-permission="'role:create'">
              {{ t('permission.addRole') }}
            </el-button>
          </div>
        </div>
      </template>

      <RoleTable
        :loading="loading"
        :role-list="roleList"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @edit="handleEdit"
        @delete="handleDelete"
        @assign-permission="handleSetPermission"
        @page-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 角色表单对话框 -->
    <RoleForm
      v-model:visible="dialogVisible"
      :loading="saveLoading"
      :dialog-type="dialogType"
      :role="roleForm"
      @submit="handleSave"
      @cancel="dialogVisible = false"
    />

    <!-- 权限分配对话框 -->
    <PermissionAssignment
      v-model:visible="permissionDialogVisible"
      :loading="savePermissionsLoading"
      :current-role="currentRole"
      :permission-tree-data="permissionTreeData"
      :selected-permissions="selectedPermissions"
      @submit="handleSavePermissions"
      @cancel="permissionDialogVisible = false"
    />

    <!-- 删除确认对话框 -->
    <DeleteConfirmation ref="deleteConfirmationRef" @delete="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useSystemStore } from '@/store/modules/system';
import { useI18n } from 'vue-i18n';
import RoleSearch from './components/RoleSearch.vue';
import RoleTable from './components/RoleTable.vue';
import RoleForm from './components/RoleForm.vue';
import PermissionAssignment from './components/PermissionAssignment.vue';
import { DeleteConfirmation } from '@/components/common';
import {
  getRoleListService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
  assignRolePermissionsService,
  type Role,
  type Permission,
  type RoleCreateParams,
  type RoleUpdateParams,
} from '@/api';

const { t } = useI18n();

// 状态变量
const loading = ref(false);
const saveLoading = ref(false);
const savePermissionsLoading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const permissionDialogVisible = ref(false);
const currentRole = ref<Role | null>(null);
const selectedPermissions = ref<string[]>([]);
const systemStore = useSystemStore();
const permissionList = computed(() => systemStore.permissions);
const total = ref(0);
const roleList = ref<Role[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const deleteConfirmationRef = ref();

// 角色表单
const roleForm = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
});

// 搜索参数
const searchParams = reactive({
  name: '',
  code: '',
});

// 权限树数据
const permissionTreeData = computed(() => {
  // 分类并组织权限树
  const treeData = [];
  const permissionMap = new Map<string, Permission[]>();

  // 将权限分组
  permissionList.value.forEach(permission => {
    const moduleName = permission.code.split(':')[0];
    if (!permissionMap.has(moduleName)) {
      permissionMap.set(moduleName, []);
    }
    permissionMap.get(moduleName)?.push(permission);
  });

  // 构建树结构
  for (const [moduleName, permissions] of permissionMap.entries()) {
    treeData.push({
      id: `module_${moduleName}`,
      name: getModuleName(moduleName),
      children: permissions.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code,
      })),
    });
  }

  return treeData;
});

// 获取模块名称
function getModuleName(code: string): string {
  const nameMap: Record<string, string> = {
    dashboard: '仪表盘',
    user: '用户管理',
    role: '角色管理',
    permission: '权限管理',
    setting: '系统设置',
  };
  return nameMap[code] || code;
}

// 初始化方法
onMounted(async () => {
  await systemStore.getRoles();
  await systemStore.initPermissions();
  fetchRoleList();
});

// 从API获取角色列表
const fetchRoleList = async () => {
  loading.value = true;
  try {
    const res = await getRoleListService({
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchParams.name || undefined,
      code: searchParams.code || undefined,
    });

    if (res.code === 200) {
      roleList.value = res.data.list;
      total.value = res.data.total;
    } else {
      ElMessage.error(res.message || t('permission.error'));
    }
  } catch (error) {
    console.error('获取角色列表失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = (params: { name: string; code: string }) => {
  searchParams.name = params.name;
  searchParams.code = params.code;
  currentPage.value = 1;
  fetchRoleList();
};

// 重置搜索
const handleResetSearch = () => {
  searchParams.name = '';
  searchParams.code = '';
  currentPage.value = 1;
  fetchRoleList();
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchRoleList();
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchRoleList();
};

// 新增角色
const handleAdd = () => {
  dialogType.value = 'add';
  roleForm.id = '';
  roleForm.name = '';
  roleForm.code = '';
  roleForm.description = '';
  roleForm.permissions = [];
  dialogVisible.value = true;
};

// 编辑角色
const handleEdit = (row: Role) => {
  dialogType.value = 'edit';
  roleForm.id = row.id;
  roleForm.name = row.name;
  roleForm.code = row.code;
  roleForm.description = row.description || '';
  roleForm.permissions = row.permissions || [];
  dialogVisible.value = true;
};

// 删除角色
const handleDelete = (row: Role) => {
  if (deleteConfirmationRef.value) {
    deleteConfirmationRef.value.handleDelete(row);
  }
};

// 确认删除
const confirmDelete = async (role: Role) => {
  try {
    const res = await deleteRoleService(role.id);

    if (res.code === 200) {
      ElMessage.success(t('permission.deleteRoleSuccess'));
      // 重新获取角色列表
      fetchRoleList();
      // 更新全局角色列表
      await systemStore.getRoles();
    } else {
      ElMessage.error(res.message || t('permission.error'));
    }
  } catch (error) {
    console.error('删除角色失败:', error);
    ElMessage.error(t('permission.error'));
  }
};

// 设置权限
const handleSetPermission = (row: Role) => {
  currentRole.value = row;
  selectedPermissions.value = row.permissions || [];
  permissionDialogVisible.value = true;
};

// 保存权限分配
const handleSavePermissions = async () => {
  if (!currentRole.value) return;

  savePermissionsLoading.value = true;
  try {
    const res = await assignRolePermissionsService({
      roleId: currentRole.value.id,
      permissionCodes: selectedPermissions.value,
    });

    if (res.code === 200) {
      ElMessage.success(t('permission.assignPermissionSuccess'));
      permissionDialogVisible.value = false;
      // 重新获取角色列表和全局角色数据
      fetchRoleList();
      await systemStore.getRoles();
    } else {
      ElMessage.error(res.message || t('permission.error'));
    }
  } catch (error) {
    console.error('设置权限失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    savePermissionsLoading.value = false;
  }
};

// 保存角色
const handleSave = async (formData: Partial<Role>) => {
  saveLoading.value = true;
  try {
    if (dialogType.value === 'add') {
      // 创建角色
      const params: RoleCreateParams = {
        name: formData.name || '',
        code: formData.code || '',
        description: formData.description || '',
      };

      const res = await createRoleService(params);

      if (res.code === 200) {
        ElMessage.success(t('permission.createRoleSuccess'));
        dialogVisible.value = false;
        // 重新获取角色列表和全局角色数据
        fetchRoleList();
        await systemStore.getRoles();
      } else {
        ElMessage.error(res.message || t('permission.error'));
      }
    } else {
      // 更新角色
      const params: RoleUpdateParams = {
        id: formData.id || '',
        name: formData.name,
        code: formData.code,
        description: formData.description,
      };

      const res = await updateRoleService(params);

      if (res.code === 200) {
        ElMessage.success(t('permission.updateRoleSuccess'));
        dialogVisible.value = false;
        // 重新获取角色列表和全局角色数据
        fetchRoleList();
        await systemStore.getRoles();
      } else {
        ElMessage.error(res.message || t('permission.error'));
      }
    }
  } catch (error) {
    console.error('保存角色失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveLoading.value = false;
  }
};
</script>
