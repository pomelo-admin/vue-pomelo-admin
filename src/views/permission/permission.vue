<template>
  <div class="p-[5px]">
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between items-center">
          <el-form :inline="true" :model="searchForm" class="flex-1">
            <el-form-item :label="t('permission.permissionName')">
              <el-input
                v-model="searchForm.name"
                :placeholder="t('permission.permissionName')"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item :label="t('permission.permissionCode')">
              <el-input
                v-model="searchForm.code"
                :placeholder="t('permission.permissionCode')"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">{{
                t('permission.search')
              }}</el-button>
              <el-button @click="handleResetSearch">{{ t('permission.reset') }}</el-button>
            </el-form-item>
          </el-form>
          <div class="flex items-center">
            <el-button type="success" @click="handleAdd" v-permission="'permission:create'">
              {{ t('permission.addPermission') }}
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="permissionList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="t('permission.permissionName')" width="180" />
        <el-table-column prop="code" :label="t('permission.permissionCode')" width="180" />
        <el-table-column prop="description" :label="t('permission.permissionDesc')" />
        <el-table-column :label="t('permission.operation')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
              v-permission="'permission:edit'"
            >
              {{ t('permission.edit') }}
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
              v-permission="'permission:delete'"
            >
              {{ t('permission.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-5 flex justify-start">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? t('permission.addPermission') : t('permission.editPermission')"
      width="500px"
    >
      <el-form
        ref="permissionFormRef"
        :model="permissionForm"
        :rules="permissionRules"
        label-width="80px"
      >
        <el-form-item :label="t('permission.permissionName')" prop="name">
          <el-input v-model="permissionForm.name" />
        </el-form-item>
        <el-form-item :label="t('permission.permissionCode')" prop="code">
          <el-input v-model="permissionForm.code" :disabled="dialogType === 'edit'" />
          <div class="text-xs text-gray-400 leading-normal mt-1">
            {{ t('permission.codeFormatTip') }}
          </div>
        </el-form-item>
        <el-form-item :label="t('permission.permissionDesc')" prop="description">
          <el-input v-model="permissionForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('permission.cancel') }}</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">
            {{ t('permission.save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormRules } from 'element-plus';
import { usePermissionStore } from '@/store/modules/permission';
import type { Permission } from '@/store/modules/permission';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 状态变量
const loading = ref(false);
const saveLoading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const permissionStore = usePermissionStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const permissionList = ref<Permission[]>([]);

// 搜索表单
const searchForm = reactive({
  name: '',
  code: '',
});

// 初始化方法
onMounted(async () => {
  await permissionStore.initPermissions();
  fetchPermissionList();
});

// 从API获取权限列表（模拟）
const fetchPermissionList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从store获取全部权限，在真实环境中这应该是从API获取
    const allPermissions = permissionStore.permissions;

    // 根据搜索条件过滤
    const filteredPermissions = allPermissions.filter(permission => {
      const nameMatch =
        !searchForm.name || permission.name.toLowerCase().includes(searchForm.name.toLowerCase());
      const codeMatch =
        !searchForm.code || permission.code.toLowerCase().includes(searchForm.code.toLowerCase());
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
const handleSearch = () => {
  currentPage.value = 1;
  fetchPermissionList();
};

// 重置搜索
const handleResetSearch = () => {
  searchForm.name = '';
  searchForm.code = '';
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
  resetPermissionForm();
  dialogVisible.value = true;
};

// 编辑权限
const handleEdit = (row: Permission) => {
  dialogType.value = 'edit';
  resetPermissionForm();
  Object.assign(permissionForm, {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description || '',
  });
  dialogVisible.value = true;
};

// 删除权限
const handleDelete = (row: Permission) => {
  // 检查是否有角色使用该权限
  const isUsedByRole = permissionStore.roles.some(
    role => role.permissions.includes(row.id) || role.permissions.includes('*')
  );

  if (isUsedByRole) {
    ElMessage.warning(t('permission.usedByRole'));
    return;
  }

  ElMessageBox.confirm(t('permission.deleteConfirm', { name: row.name }), t('permission.warning'), {
    confirmButtonText: t('permission.confirm'),
    cancelButtonText: t('permission.cancel'),
    type: 'warning',
  })
    .then(async () => {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));

        // 从列表移除权限
        const index = permissionStore.permissions.findIndex(p => p.id === row.id);
        if (index !== -1) {
          permissionStore.permissions.splice(index, 1);
        }

        ElMessage.success(t('permission.deleteSuccess'));
        fetchPermissionList(); // 刷新列表
      } catch (error) {
        console.error('删除权限失败:', error);
        ElMessage.error(t('permission.error'));
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 保存权限
const handleSave = async () => {
  if (!permissionFormRef.value) return;

  await permissionFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    saveLoading.value = true;
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));

      if (dialogType.value === 'add') {
        // 检查权限标识是否已存在
        const existingPermission = permissionStore.permissions.find(
          p => p.code === permissionForm.code
        );
        if (existingPermission) {
          ElMessage.error(t('permission.codeExists', { code: permissionForm.code }));
          saveLoading.value = false;
          return;
        }

        // 新增权限
        const newPermission: Permission = {
          id: 'perm_' + Date.now().toString(),
          name: permissionForm.name,
          code: permissionForm.code,
          description: permissionForm.description,
        };
        permissionStore.permissions.push(newPermission);
        ElMessage.success(t('permission.createSuccess'));
      } else {
        // 更新权限
        const index = permissionStore.permissions.findIndex(p => p.id === permissionForm.id);
        if (index !== -1) {
          permissionStore.permissions[index] = {
            ...permissionStore.permissions[index],
            name: permissionForm.name,
            description: permissionForm.description,
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
  });
};

// 权限表单
const permissionFormRef = ref();
const permissionForm = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
});

// 表单验证规则
const permissionRules = reactive<FormRules>({
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

// 重置权限表单
const resetPermissionForm = () => {
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields();
  }
  Object.assign(permissionForm, {
    id: '',
    name: '',
    code: '',
    description: '',
  });
};
</script>
