<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>权限管理</span>
          <div class="right-panel">
            <el-button type="success" @click="handleAdd" v-permission="'permission:create'">
              新增权限
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredPermissions" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="权限名称" width="180" />
        <el-table-column prop="code" label="权限标识" width="180" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
              v-permission="'permission:edit'"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
              v-permission="'permission:delete'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="permissionStore.permissions.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增权限' : '编辑权限'"
      width="500px"
    >
      <el-form
        ref="permissionFormRef"
        :model="permissionForm"
        :rules="permissionRules"
        label-width="80px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="permissionForm.code" :disabled="dialogType === 'edit'" />
          <div class="form-hint">格式: 模块:操作, 如: user:create</div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="permissionForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading"> 确定 </el-button>
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

// 状态变量
const loading = ref(false);
const saveLoading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const permissionStore = usePermissionStore();
const currentPage = ref(1);
const pageSize = ref(10);

// 分页过滤后的权限列表
const filteredPermissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return permissionStore.permissions.slice(start, end);
});

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
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$/,
      message: '权限标识格式不正确，应为：模块:操作',
      trigger: 'blur',
    },
  ],
});

// 初始化方法
onMounted(async () => {
  loading.value = true;
  try {
    await permissionStore.initPermissions();
  } catch (error) {
    console.error('初始化权限数据失败:', error);
    ElMessage.error('获取权限数据失败');
  } finally {
    loading.value = false;
  }
});

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
    ElMessage.warning('该权限已被角色使用，无法删除');
    return;
  }

  ElMessageBox.confirm(`确定要删除权限 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
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

        ElMessage.success('删除成功');
      } catch (error) {
        console.error('删除权限失败:', error);
        ElMessage.error('删除权限失败');
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
          ElMessage.error(`权限标识 ${permissionForm.code} 已存在`);
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
      }

      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功');
      dialogVisible.value = false;
    } catch (error) {
      console.error('保存权限失败:', error);
      ElMessage.error('保存权限失败');
    } finally {
      saveLoading.value = false;
    }
  });
};

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

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-panel {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}
</style>
