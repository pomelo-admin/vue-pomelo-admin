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
import type { Role, Permission } from '@/store/modules/system';
import { useI18n } from 'vue-i18n';
import RoleSearch from './components/RoleSearch.vue';
import RoleTable from './components/RoleTable.vue';
import RoleForm from './components/RoleForm.vue';
import PermissionAssignment from './components/PermissionAssignment.vue';
import { DeleteConfirmation } from '@/components/common';

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

// 从API获取角色列表（模拟）
const fetchRoleList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从store获取全部角色，在真实环境这应该是从API获取
    const allRoles = systemStore.roles;

    // 根据搜索条件过滤
    const filteredRoles = allRoles.filter(role => {
      const nameMatch =
        !searchParams.name || role.name.toLowerCase().includes(searchParams.name.toLowerCase());
      const codeMatch =
        !searchParams.code || role.code.toLowerCase().includes(searchParams.code.toLowerCase());
      return nameMatch && codeMatch;
    });

    // 设置总数
    total.value = filteredRoles.length;

    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    roleList.value = filteredRoles.slice(start, end);
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
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从store移除角色
    const index = systemStore.roles.findIndex(r => r.id === role.id);
    if (index !== -1) {
      systemStore.roles.splice(index, 1);
    }

    ElMessage.success(t('permission.deleteSuccess'));
    fetchRoleList(); // 刷新列表
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
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 更新角色的权限
    const role = systemStore.roles.find(r => r.id === currentRole.value?.id);
    if (role) {
      role.permissions = [...selectedPermissions.value];
    }

    ElMessage.success(t('permission.assignSuccess'));
    permissionDialogVisible.value = false;
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
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    if (dialogType.value === 'add') {
      // 检查角色标识是否已存在
      const existingRole = systemStore.roles.find(r => r.code === formData.code);
      if (existingRole) {
        ElMessage.error(t('permission.codeExists', { code: formData.code }));
        saveLoading.value = false;
        return;
      }

      // 新增角色
      const newRole: Role = {
        id: 'role_' + Date.now().toString(),
        name: formData.name || '',
        code: formData.code || '',
        description: formData.description || '',
        permissions: [],
      };
      systemStore.roles.push(newRole);
      ElMessage.success(t('permission.createSuccess'));
    } else {
      // 更新角色
      const index = systemStore.roles.findIndex(r => r.id === formData.id);
      if (index !== -1) {
        systemStore.roles[index] = {
          ...systemStore.roles[index],
          name: formData.name || systemStore.roles[index].name,
          description: formData.description || systemStore.roles[index].description,
        };
      }
      ElMessage.success(t('permission.updateSuccess'));
    }

    dialogVisible.value = false;
    fetchRoleList(); // 刷新列表
  } catch (error) {
    console.error('保存角色失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveLoading.value = false;
  }
};
</script>
