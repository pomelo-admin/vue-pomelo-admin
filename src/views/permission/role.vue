<template>
  <div class="p-[5px]">
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between items-center">
          <el-form :inline="true" :model="searchForm" class="flex-1">
            <el-form-item :label="t('permission.roleName')">
              <el-input
                v-model="searchForm.name"
                :placeholder="t('permission.roleName')"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item :label="t('permission.roleCode')">
              <el-input
                v-model="searchForm.code"
                :placeholder="t('permission.roleCode')"
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
            <el-button type="success" @click="handleAdd" v-permission="'role:create'">
              {{ t('permission.addRole') }}
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="roleList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" :label="t('permission.roleName')" width="150" />
        <el-table-column prop="code" :label="t('permission.roleCode')" width="150" />
        <el-table-column prop="description" :label="t('permission.roleDesc')" />
        <el-table-column :label="t('permission.operation')" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
              v-permission="'role:edit'"
            >
              {{ t('permission.edit') }}
            </el-button>
            <el-button
              type="success"
              link
              size="small"
              @click="handleSetPermission(row)"
              v-permission="'permission:assign'"
            >
              {{ t('permission.assignPermission') }}
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
              v-permission="'role:delete'"
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
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? t('permission.addRole') : t('permission.editRole')"
      width="500px"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="80px">
        <el-form-item :label="t('permission.roleName')" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item :label="t('permission.roleCode')" prop="code">
          <el-input v-model="roleForm.code" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item :label="t('permission.roleDesc')" prop="description">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" />
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

    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      :title="t('permission.assignPermission')"
      width="600px"
    >
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
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">{{
            t('permission.cancel')
          }}</el-button>
          <el-button
            type="primary"
            @click="handleSavePermissions"
            :loading="savePermissionsLoading"
          >
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
import type { Role, Permission } from '@/store/modules/permission';
import { useI18n } from 'vue-i18n';

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
const permissionStore = usePermissionStore();
const permissionList = computed(() => permissionStore.permissions);
const permissionTreeRef = ref();
const total = ref(0);
const roleList = ref<Role[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索表单
const searchForm = reactive({
  name: '',
  code: '',
});

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
  name: [{ required: true, message: t('permission.roleName'), trigger: 'blur' }],
  code: [
    { required: true, message: t('permission.roleCode'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: t('permission.roleCode'), trigger: 'blur' },
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

// 从API获取角色列表（模拟）
const fetchRoleList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从store获取全部角色，在真实环境中这应该是从API获取
    const allRoles = permissionStore.roles;

    // 根据搜索条件过滤
    const filteredRoles = allRoles.filter(role => {
      const nameMatch =
        !searchForm.name || role.name.toLowerCase().includes(searchForm.name.toLowerCase());
      const codeMatch =
        !searchForm.code || role.code.toLowerCase().includes(searchForm.code.toLowerCase());
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
const handleSearch = () => {
  currentPage.value = 1; // 重置为第一页
  fetchRoleList();
};

// 重置搜索
const handleResetSearch = () => {
  searchForm.name = '';
  searchForm.code = '';
  currentPage.value = 1; // 重置为第一页
  fetchRoleList();
};

// 初始化方法
onMounted(async () => {
  try {
    await permissionStore.initPermissions();
    await fetchRoleList();
  } catch (error) {
    console.error('初始化数据失败:', error);
    ElMessage.error('获取数据失败');
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

    ElMessage.success(t('permission.assignPermissionSuccess'));
    permissionDialogVisible.value = false;
    fetchRoleList(); // 刷新角色列表
  } catch (error) {
    console.error('权限分配失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    savePermissionsLoading.value = false;
  }
};

// 删除角色
const handleDelete = (row: Role) => {
  // 阻止删除超级管理员
  if (row.code === 'admin') {
    ElMessage.warning(t('permission.cantDeleteAdmin'));
    return;
  }

  ElMessageBox.confirm(
    t('permission.deleteRoleConfirm', { name: row.name }),
    t('permission.warning'),
    {
      confirmButtonText: t('permission.confirm'),
      cancelButtonText: t('permission.cancel'),
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));

        // 从列表移除角色
        const index = permissionStore.roles.findIndex(r => r.id === row.id);
        if (index !== -1) {
          permissionStore.roles.splice(index, 1);
        }

        ElMessage.success(t('permission.deleteRoleSuccess'));
        fetchRoleList(); // 刷新角色列表
      } catch (error) {
        console.error('删除角色失败:', error);
        ElMessage.error(t('permission.error'));
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
        ElMessage.success(t('permission.createRoleSuccess'));
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
        ElMessage.success(t('permission.updateRoleSuccess'));
      }

      dialogVisible.value = false;
      fetchRoleList(); // 刷新角色列表
    } catch (error) {
      console.error('保存角色失败:', error);
      ElMessage.error(t('permission.error'));
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

// 处理分页
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchRoleList();
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchRoleList();
};
</script>
