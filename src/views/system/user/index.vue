<template>
  <div class="p-[5px]">
    <el-card class="box-card">
      <template #header>
        <div class="flex justify-between items-center">
          <UserSearch @search="handleSearch" @reset="handleResetSearch" />
          <div class="flex items-center">
            <el-button type="success" @click="handleAdd" v-permission="'user:create'">
              {{ t('permission.addUser') }}
            </el-button>
          </div>
        </div>
      </template>

      <UserTable
        :loading="loading"
        :user-list="userList"
        :total="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        @edit="handleEdit"
        @delete="handleDelete"
        @assign-role="handleSetRole"
        @page-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 用户表单对话框 -->
    <UserForm
      v-model:visible="dialogVisible"
      :loading="saveLoading"
      :dialog-type="dialogType"
      :user="userForm"
      @submit="handleSave"
      @cancel="dialogVisible = false"
    />

    <!-- 角色分配对话框 -->
    <RoleAssignment
      v-model:visible="roleDialogVisible"
      :loading="saveRolesLoading"
      :current-user="currentUser"
      :role-list="roleList"
      :selected-roles="selectedRoles"
      @submit="handleSaveRoles"
      @cancel="roleDialogVisible = false"
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
import UserSearch from './components/UserSearch.vue';
import UserTable from './components/UserTable.vue';
import UserForm from './components/UserForm.vue';
import RoleAssignment from './components/RoleAssignment.vue';
import { DeleteConfirmation } from '@/components/common';

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
const systemStore = useSystemStore();
const roleList = computed(() => systemStore.roles);
const deleteConfirmationRef = ref();

// 搜索参数
const searchParams = reactive({
  username: '',
  realName: '',
});

// 用户表单
const userForm = reactive({
  id: '',
  username: '',
  realName: '',
  password: '',
  email: '',
  phone: '',
  status: 1,
  roles: [] as { id: string; name: string; code: string }[],
});

// 初始化方法
onMounted(async () => {
  await systemStore.getRoles();
  fetchUserList();
});

// 模拟从API获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 在实际应用中，这里应该是从API获取数据
    // 模拟一些用户数据
    const mockUsers: User[] = [
      {
        id: 'user_1',
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        status: 1,
        roles: [{ id: 'role_1', name: '管理员', code: 'admin' }],
      },
      {
        id: 'user_2',
        username: 'user',
        realName: '普通用户',
        email: 'user@example.com',
        phone: '13900139000',
        status: 1,
        roles: [{ id: 'role_2', name: '用户', code: 'user' }],
      },
    ];

    // 根据搜索条件过滤
    const filteredUsers = mockUsers.filter(user => {
      const usernameMatch =
        !searchParams.username ||
        user.username.toLowerCase().includes(searchParams.username.toLowerCase());
      const realNameMatch =
        !searchParams.realName ||
        user.realName.toLowerCase().includes(searchParams.realName.toLowerCase());
      return usernameMatch && realNameMatch;
    });

    // 设置总数
    total.value = filteredUsers.length;

    // 分页处理
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
const handleSearch = (params: { username: string; realName: string }) => {
  searchParams.username = params.username;
  searchParams.realName = params.realName;
  page.value = 1;
  fetchUserList();
};

// 重置搜索
const handleResetSearch = () => {
  searchParams.username = '';
  searchParams.realName = '';
  page.value = 1;
  fetchUserList();
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchUserList();
};

const handleCurrentChange = (currentPage: number) => {
  page.value = currentPage;
  fetchUserList();
};

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add';
  // 重置表单
  userForm.id = '';
  userForm.username = '';
  userForm.realName = '';
  userForm.password = '';
  userForm.email = '';
  userForm.phone = '';
  userForm.status = 1;
  userForm.roles = [];
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row: User) => {
  dialogType.value = 'edit';
  // 填充表单
  userForm.id = row.id;
  userForm.username = row.username;
  userForm.realName = row.realName;
  userForm.password = '';
  userForm.email = row.email;
  userForm.phone = row.phone;
  userForm.status = row.status;
  userForm.roles = row.roles;
  dialogVisible.value = true;
};

// 删除用户
const handleDelete = (row: User) => {
  if (deleteConfirmationRef.value) {
    deleteConfirmationRef.value.handleDelete(row);
  }
};

// 确认删除
const confirmDelete = async (user: User) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从列表中移除用户
    const index = userList.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      userList.value.splice(index, 1);
    }

    ElMessage.success(t('permission.deleteSuccess'));
  } catch (error) {
    console.error('删除用户失败:', error);
    ElMessage.error(t('permission.error'));
  }
};

// 设置角色
const handleSetRole = (row: User) => {
  currentUser.value = row;
  selectedRoles.value = row.roles.map(role => role.id);
  roleDialogVisible.value = true;
};

// 保存角色分配
const handleSaveRoles = async () => {
  if (!currentUser.value) return;

  saveRolesLoading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 更新用户的角色
    const user = userList.value.find(u => u.id === currentUser.value?.id);
    if (user) {
      user.roles = systemStore.roles
        .filter(role => selectedRoles.value.includes(role.id))
        .map(role => ({ id: role.id, name: role.name, code: role.code }));
    }

    ElMessage.success(t('permission.assignSuccess'));
    roleDialogVisible.value = false;
  } catch (error) {
    console.error('设置角色失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveRolesLoading.value = false;
  }
};

// 保存用户
const handleSave = async (formData: Partial<User>) => {
  saveLoading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    if (dialogType.value === 'add') {
      // 检查用户名是否已存在
      const existingUser = userList.value.find(u => u.username === formData.username);
      if (existingUser) {
        ElMessage.error(t('permission.usernameExists', { username: formData.username }));
        saveLoading.value = false;
        return;
      }

      // 新增用户
      const newUser: User = {
        id: 'user_' + Date.now().toString(),
        username: formData.username || '',
        realName: formData.realName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        status: formData.status ?? 1,
        roles: [],
      };
      userList.value.push(newUser);
      ElMessage.success(t('permission.createSuccess'));
    } else {
      // 更新用户
      const index = userList.value.findIndex(u => u.id === formData.id);
      if (index !== -1) {
        userList.value[index] = {
          ...userList.value[index],
          realName: formData.realName || userList.value[index].realName,
          email: formData.email || userList.value[index].email,
          phone: formData.phone || userList.value[index].phone,
          status: formData.status ?? userList.value[index].status,
        };
      }
      ElMessage.success(t('permission.updateSuccess'));
    }

    dialogVisible.value = false;
  } catch (error) {
    console.error('保存用户失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveLoading.value = false;
  }
};
</script>
