<template>
  <div class="p-[5px]">
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between items-center">
          <el-form :inline="true" :model="searchForm" class="flex-1">
            <el-form-item :label="t('common.username')">
              <el-input
                v-model="searchForm.username"
                :placeholder="t('common.username')"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item :label="t('permission.realName')">
              <el-input
                v-model="searchForm.realName"
                :placeholder="t('permission.realName')"
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
            <el-button type="success" @click="handleAdd" v-permission="'user:create'">
              {{ t('permission.addUser') }}
            </el-button>
          </div>
        </div>
      </template>
      <el-table :data="userList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" :label="t('common.username')" width="120" />
        <el-table-column prop="realName" :label="t('permission.realName')" width="120" />
        <el-table-column prop="email" :label="t('permission.email')" />
        <el-table-column prop="phone" :label="t('permission.phone')" width="120" />
        <el-table-column :label="t('permission.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? t('permission.enabled') : t('permission.disabled') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('permission.role')" width="180">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role.id" class="mr-[5px]" type="info">
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('permission.operation')" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
              v-permission="'user:edit'"
            >
              {{ t('permission.edit') }}
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleSetRole(row)"
              v-permission="'user:edit'"
            >
              {{ t('permission.assignRole') }}
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
              v-permission="'user:delete'"
            >
              {{ t('permission.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-5 flex justify-start">
        <el-pagination
          v-model:current-page="page"
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

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? t('permission.addUser') : t('permission.editUser')"
      width="500px"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="80px">
        <el-form-item :label="t('common.username')" prop="username">
          <el-input v-model="userForm.username" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item :label="t('permission.realName')" prop="realName">
          <el-input v-model="userForm.realName" />
        </el-form-item>
        <el-form-item :label="t('common.password')" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item :label="t('permission.email')" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item :label="t('permission.phone')" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item :label="t('permission.status')">
          <el-switch v-model="userForm.status" :active-value="1" :inactive-value="0" />
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

    <!-- 角色分配对话框 -->
    <el-dialog v-model="roleDialogVisible" :title="t('permission.assignRole')" width="500px">
      <div v-if="currentUser">
        <p>{{ t('permission.user') }}：{{ currentUser.username }} ({{ currentUser.realName }})</p>
        <el-checkbox-group v-model="selectedRoles">
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
          <el-button @click="roleDialogVisible = false">{{ t('permission.cancel') }}</el-button>
          <el-button type="primary" @click="handleSaveRoles" :loading="saveRolesLoading">
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
import { InfoFilled } from '@element-plus/icons-vue';
import { usePermissionStore } from '@/store/modules/permission';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 类型定义
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

// 状态变量
const loading = ref(false);
const saveLoading = ref(false);
const saveRolesLoading = ref(false);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const userList = ref<User[]>([]);
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const roleDialogVisible = ref(false);
const currentUser = ref<User | null>(null);
const selectedRoles = ref<string[]>([]);
const permissionStore = usePermissionStore();
const roleList = computed(() => permissionStore.roles);

// 搜索表单
const searchForm = reactive({
  username: '',
  realName: '',
});

// 用户表单
const userFormRef = ref();
const userForm = reactive({
  id: '',
  username: '',
  realName: '',
  password: '',
  email: '',
  phone: '',
  status: 1,
});

// 表单验证规则
const userRules = reactive<FormRules>({
  username: [
    { required: true, message: t('common.username'), trigger: 'blur' },
    { min: 3, max: 20, message: t('register.usernameLength'), trigger: 'blur' },
  ],
  realName: [{ required: true, message: t('permission.realName'), trigger: 'blur' }],
  password: [
    { required: true, message: t('common.password'), trigger: 'blur' },
    { min: 6, max: 20, message: t('register.passwordLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('permission.email'), trigger: 'blur' },
    { type: 'email', message: t('register.emailInvalid'), trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: t('permission.phone'), trigger: 'blur' }],
});

// 初始化方法
onMounted(async () => {
  await permissionStore.getRoles();
  fetchUserList();
});

// 模拟从API获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟数据
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        realName: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        status: 1,
        roles: [{ id: '1', name: '超级管理员', code: 'admin' }],
      },
      {
        id: '2',
        username: 'test',
        realName: '测试用户',
        email: 'test@example.com',
        phone: '13800138001',
        status: 1,
        roles: [{ id: '2', name: '普通用户', code: 'user' }],
      },
      {
        id: '3',
        username: 'user_manager',
        realName: '用户管理员',
        email: 'user_manager@example.com',
        phone: '13800138002',
        status: 1,
        roles: [{ id: '3', name: '用户管理员', code: 'user_manager' }],
      },
      {
        id: '4',
        username: 'role_manager',
        realName: '角色管理员',
        email: 'role_manager@example.com',
        phone: '13800138003',
        status: 1,
        roles: [{ id: '4', name: '角色管理员', code: 'role_manager' }],
      },
      {
        id: '5',
        username: 'system_manager',
        realName: '系统管理员',
        email: 'system_manager@example.com',
        phone: '13800138004',
        status: 0, // 禁用状态
        roles: [{ id: '5', name: '系统管理员', code: 'system_manager' }],
      },
    ];

    // 根据搜索条件过滤
    const filteredUsers = mockUsers.filter(user => {
      const usernameMatch = !searchForm.username || user.username.includes(searchForm.username);
      const realNameMatch = !searchForm.realName || user.realName.includes(searchForm.realName);
      return usernameMatch && realNameMatch;
    });

    total.value = filteredUsers.length;

    // 分页
    const start = (page.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    userList.value = filteredUsers.slice(start, end);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  page.value = 1;
  fetchUserList();
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchUserList();
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  fetchUserList();
};

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add';
  resetUserForm();
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row: User) => {
  dialogType.value = 'edit';
  resetUserForm();
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    realName: row.realName,
    email: row.email,
    phone: row.phone,
    status: row.status,
  });
  dialogVisible.value = true;
};

// 分配角色
const handleSetRole = (row: User) => {
  currentUser.value = row;
  selectedRoles.value = row.roles.map(role => role.id);
  roleDialogVisible.value = true;
};

// 保存用户分配的角色
const handleSaveRoles = async () => {
  if (!currentUser.value) return;

  saveRolesLoading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    ElMessage.success(t('permission.assignRoleSuccess'));
    roleDialogVisible.value = false;
    fetchUserList(); // 刷新用户列表
  } catch (error) {
    console.error('角色分配失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveRolesLoading.value = false;
  }
};

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(
    t('permission.deleteUserConfirm', { username: row.username }),
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

        ElMessage.success(t('permission.deleteUserSuccess'));
        fetchUserList(); // 刷新用户列表
      } catch (error) {
        console.error('删除用户失败:', error);
        ElMessage.error(t('permission.error'));
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 保存用户
const handleSave = async () => {
  if (!userFormRef.value) return;

  await userFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    saveLoading.value = true;
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));

      if (dialogType.value === 'add') {
        ElMessage.success(t('permission.createUserSuccess'));
      } else {
        ElMessage.success(t('permission.updateUserSuccess'));
      }

      dialogVisible.value = false;
      fetchUserList(); // 刷新用户列表
    } catch (error) {
      console.error('保存用户失败:', error);
      ElMessage.error(t('permission.error'));
    } finally {
      saveLoading.value = false;
    }
  });
};

// 重置用户表单
const resetUserForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields();
  }
  Object.assign(userForm, {
    id: '',
    username: '',
    realName: '',
    password: '',
    email: '',
    phone: '',
    status: 1,
  });
};

// 重置搜索
const handleResetSearch = () => {
  searchForm.username = '';
  searchForm.realName = '';
  page.value = 1;
  fetchUserList();
};
</script>
