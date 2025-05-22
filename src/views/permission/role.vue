<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <div class="right-panel">
            <el-button type="success" @click="handleAdd" v-permission="'role:create'">
              新增角色
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="roleList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色标识" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
              v-permission="'role:edit'"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              link
              size="small"
              @click="handleSetPermission(row)"
              v-permission="'permission:assign'"
            >
              分配权限
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
              v-permission="'role:delete'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="500px"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="roleForm.code" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="分配权限" width="600px">
      <div v-if="currentRole">
        <p>角色：{{ currentRole.name }} ({{ currentRole.code }})</p>
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTreeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectedPermissions"
          :props="{ label: 'name', children: 'children' }"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSavePermissions"
            :loading="savePermissionsLoading"
          >
            确定
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
import type { Role, Permission } from '@/store/modules/permission';

// 状态变量
const loading = ref(false);
const saveLoading = ref(false);
const savePermissionsLoading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const permissionDialogVisible = ref(false);
const currentRole = ref<Role | null>(null);
const selectedPermissions = ref<string[]>([]);
const permissionStore = usePermissionStore();
const roleList = computed(() => permissionStore.roles);
const permissionList = computed(() => permissionStore.permissions);
const permissionTreeRef = ref();

// 角色表单
const roleFormRef = ref();
const roleForm = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  permissions: [] as string[],
});

// 表单验证规则
const roleRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '角色标识只能包含字母、数字和下划线', trigger: 'blur' },
  ],
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

// 新增角色
const handleAdd = () => {
  dialogType.value = 'add';
  resetRoleForm();
  dialogVisible.value = true;
};

// 编辑角色
const handleEdit = (row: Role) => {
  dialogType.value = 'edit';
  resetRoleForm();
  Object.assign(roleForm, {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    permissions: [...row.permissions],
  });
  dialogVisible.value = true;
};

// 分配权限
const handleSetPermission = async (row: Role) => {
  currentRole.value = row;

  // 设置已选中的权限
  selectedPermissions.value = row.permissions.includes('*')
    ? permissionList.value.map(p => p.id)
    : [...row.permissions];

  permissionDialogVisible.value = true;
};

// 保存权限分配
const handleSavePermissions = async () => {
  if (!currentRole.value || !permissionTreeRef.value) return;

  savePermissionsLoading.value = true;
  try {
    // 获取选中的节点
    const checkedNodes = permissionTreeRef.value.getCheckedNodes();
    const checkedKeys = checkedNodes
      .filter((node: any) => !node.children) // 只获取叶子节点
      .map((node: any) => node.id);

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 更新当前角色的权限
    if (currentRole.value) {
      const roleIndex = permissionStore.roles.findIndex(r => r.id === currentRole.value?.id);
      if (roleIndex !== -1) {
        permissionStore.roles[roleIndex].permissions = checkedKeys;
      }
    }

    ElMessage.success('权限分配成功');
    permissionDialogVisible.value = false;
  } catch (error) {
    console.error('权限分配失败:', error);
    ElMessage.error('权限分配失败');
  } finally {
    savePermissionsLoading.value = false;
  }
};

// 删除角色
const handleDelete = (row: Role) => {
  // 阻止删除超级管理员
  if (row.code === 'admin') {
    ElMessage.warning('不能删除超级管理员角色');
    return;
  }

  ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));

        // 从列表移除角色
        const index = permissionStore.roles.findIndex(r => r.id === row.id);
        if (index !== -1) {
          permissionStore.roles.splice(index, 1);
        }

        ElMessage.success('删除成功');
      } catch (error) {
        console.error('删除角色失败:', error);
        ElMessage.error('删除角色失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 保存角色
const handleSave = async () => {
  if (!roleFormRef.value) return;

  await roleFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    saveLoading.value = true;
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));

      if (dialogType.value === 'add') {
        // 新增角色
        const newRole: Role = {
          id: 'role_' + Date.now().toString(),
          name: roleForm.name,
          code: roleForm.code,
          description: roleForm.description,
          permissions: [],
        };
        permissionStore.roles.push(newRole);
      } else {
        // 更新角色
        const index = permissionStore.roles.findIndex(r => r.id === roleForm.id);
        if (index !== -1) {
          permissionStore.roles[index] = {
            ...permissionStore.roles[index],
            name: roleForm.name,
            description: roleForm.description,
          };
        }
      }

      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功');
      dialogVisible.value = false;
    } catch (error) {
      console.error('保存角色失败:', error);
      ElMessage.error('保存角色失败');
    } finally {
      saveLoading.value = false;
    }
  });
};

// 重置角色表单
const resetRoleForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields();
  }
  Object.assign(roleForm, {
    id: '',
    name: '',
    code: '',
    description: '',
    permissions: [],
  });
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
</style>
