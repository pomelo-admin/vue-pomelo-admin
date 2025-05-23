<template>
  <div class="p-[5px]">
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between items-center">
          <PermissionSearch @search="handleSearch" @reset="handleResetSearch" />
          <div class="flex items-center">
            <el-button type="success" @click="handleAdd" v-permission="'permission:create'">
              {{ t('permission.addPermission') }}
            </el-button>
          </div>
        </div>
      </template>

      <PermissionTable
        :loading="loading"
        :permission-list="permissionList"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @edit="handleEdit"
        @delete="handleDelete"
        @page-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 权限表单对话框 -->
    <PermissionForm
      v-model:visible="dialogVisible"
      :loading="saveLoading"
      :dialog-type="dialogType"
      :permission="currentPermission"
      @submit="handleSave"
      @cancel="handleFormCancel"
    />

    <!-- 删除确认对话框 -->
    <DeleteConfirmation ref="deleteConfirmationRef" @delete="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useSystemStore } from '@/store/modules/system';
import type { Permission } from '@/store/modules/system';
import { useI18n } from 'vue-i18n';
import PermissionSearch from './components/PermissionSearch.vue';
import PermissionTable from './components/PermissionTable.vue';
import PermissionForm from './components/PermissionForm.vue';
import DeleteConfirmation from '@/components/common/DeleteConfirmation.vue';

const { t } = useI18n();

// 状态变量
const loading = ref(false);
const saveLoading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const systemStore = useSystemStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const permissionList = ref<Permission[]>([]);
const currentPermission = ref<Permission | null>(null);
const deleteConfirmationRef = ref();

// 搜索参数
const searchParams = reactive({
  name: '',
  code: '',
});

// 初始化方法
onMounted(async () => {
  await systemStore.initPermissions();
  fetchPermissionList();
});

// 从API获取权限列表（模拟）
const fetchPermissionList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从store获取全部权限，在真实环境中这应该是从API获取
    const allPermissions = systemStore.permissions;

    // 根据搜索条件过滤
    const filteredPermissions = allPermissions.filter(permission => {
      const nameMatch =
        !searchParams.name ||
        permission.name.toLowerCase().includes(searchParams.name.toLowerCase());
      const codeMatch =
        !searchParams.code ||
        permission.code.toLowerCase().includes(searchParams.code.toLowerCase());
      return nameMatch && codeMatch;
    });

    // 设置总数
    total.value = filteredPermissions.length;

    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    permissionList.value = filteredPermissions.slice(start, end);
  } catch (error) {
    console.error('获取权限列表失败:', error);
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
  fetchPermissionList();
};

// 重置搜索
const handleResetSearch = () => {
  searchParams.name = '';
  searchParams.code = '';
  currentPage.value = 1;
  fetchPermissionList();
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchPermissionList();
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchPermissionList();
};

// 新增权限
const handleAdd = () => {
  dialogType.value = 'add';
  currentPermission.value = null;
  dialogVisible.value = true;
};

// 编辑权限
const handleEdit = (row: Permission) => {
  dialogType.value = 'edit';
  currentPermission.value = row;
  dialogVisible.value = true;
};

// 删除权限
const handleDelete = (row: Permission) => {
  if (deleteConfirmationRef.value) {
    deleteConfirmationRef.value.handleDelete(row);
  }
};

// 确认删除
const confirmDelete = async (permission: Permission) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从列表移除权限
    const index = systemStore.permissions.findIndex(p => p.id === permission.id);
    if (index !== -1) {
      systemStore.permissions.splice(index, 1);
    }

    ElMessage.success(t('permission.deleteSuccess'));
    fetchPermissionList(); // 刷新列表
  } catch (error) {
    console.error('删除权限失败:', error);
    ElMessage.error(t('permission.error'));
  }
};

// 保存权限
const handleSave = async (formData: Partial<Permission>) => {
  saveLoading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    if (dialogType.value === 'add') {
      // 检查权限标识是否已存在
      const existingPermission = systemStore.permissions.find(p => p.code === formData.code);
      if (existingPermission) {
        ElMessage.error(t('permission.codeExists', { code: formData.code }));
        saveLoading.value = false;
        return;
      }

      // 新增权限
      const newPermission: Permission = {
        id: 'perm_' + Date.now().toString(),
        name: formData.name || '',
        code: formData.code || '',
        description: formData.description || '',
      };
      systemStore.permissions.push(newPermission);
      ElMessage.success(t('permission.createSuccess'));
    } else {
      // 更新权限
      const index = systemStore.permissions.findIndex(p => p.id === formData.id);
      if (index !== -1) {
        systemStore.permissions[index] = {
          ...systemStore.permissions[index],
          name: formData.name || systemStore.permissions[index].name,
          description: formData.description || systemStore.permissions[index].description,
        };
      }
      ElMessage.success(t('permission.updateSuccess'));
    }

    dialogVisible.value = false;
    fetchPermissionList(); // 刷新列表
  } catch (error) {
    console.error('保存权限失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveLoading.value = false;
  }
};

// 取消表单
const handleFormCancel = () => {
  dialogVisible.value = false;
};
</script>
