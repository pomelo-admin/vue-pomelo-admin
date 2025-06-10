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
import {
  getUserListService,
  createUserService,
  updateUserService,
  deleteUserService,
  assignUserRolesService,
  type User as ApiUser,
  type UserCreateParams,
  type UserUpdateParams,
} from '@/api';

const { t } = useI18n();

// 定义与UserTable组件兼容的用户类型
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
const apiUserList = ref<ApiUser[]>([]);
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
  email: '',
  status: undefined as number | undefined,
  roleId: '',
});

// 用户表单
const userForm = reactive<{
  id: string;
  username: string;
  realName: string;
  password: string;
  email: string;
  phone: string;
  status: number;
  roles: {
    id: string;
    name: string;
    code: string;
  }[];
}>({
  id: '',
  username: '',
  realName: '',
  password: '',
  email: '',
  phone: '',
  status: 1,
  roles: [],
});

// 初始化方法
onMounted(async () => {
  await systemStore.getRoles();
  fetchUserList();
});

// 将API用户转换为组件用户
const convertApiUserToUser = (apiUser: ApiUser): User => {
  // 将用户角色ID转换为角色对象
  const userRoles = apiUser.roles.map(roleId => {
    const role = systemStore.roles.find(r => r.id === roleId) || {
      id: roleId,
      name: roleId,
      code: roleId,
    };
    return {
      id: role.id,
      name: role.name,
      code: role.code,
    };
  });

  return {
    id: apiUser.id,
    username: apiUser.username,
    realName: apiUser.realName,
    email: apiUser.email,
    phone: apiUser.phone || '',
    status: apiUser.status,
    roles: userRoles,
  };
};

// 从API获取用户列表
const fetchUserList = async () => {
  loading.value = true;
  try {
    const res = await getUserListService({
      page: page.value,
      pageSize: pageSize.value,
      username: searchParams.username || undefined,
      realName: searchParams.realName || undefined,
      email: searchParams.email || undefined,
      status: searchParams.status,
      roleId: searchParams.roleId || undefined,
    });

    if (res.code === 200) {
      apiUserList.value = res.data.list;
      userList.value = res.data.list.map(convertApiUserToUser);
      total.value = res.data.total;
    } else {
      ElMessage.error(res.message || t('permission.error'));
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = (params: {
  username: string;
  realName: string;
  email?: string;
  status?: number;
  roleId?: string;
}) => {
  searchParams.username = params.username;
  searchParams.realName = params.realName;
  searchParams.email = params.email || '';
  searchParams.status = params.status;
  searchParams.roleId = params.roleId || '';
  page.value = 1;
  fetchUserList();
};

// 重置搜索
const handleResetSearch = () => {
  searchParams.username = '';
  searchParams.realName = '';
  searchParams.email = '';
  searchParams.status = undefined;
  searchParams.roleId = '';
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
  userForm.password = ''; // 编辑时不需要填写密码
  userForm.email = row.email;
  userForm.phone = row.phone || '';
  userForm.status = row.status;
  userForm.roles = [...row.roles]; // 复制角色数组
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
    const res = await deleteUserService(user.id);

    if (res.code === 200) {
      ElMessage.success(t('permission.deleteSuccess'));
      fetchUserList(); // 重新获取列表
    } else {
      ElMessage.error(res.message || t('permission.error'));
    }
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
    const res = await assignUserRolesService({
      userId: currentUser.value.id,
      roleIds: selectedRoles.value,
    });

    if (res.code === 200) {
      ElMessage.success(t('permission.assignSuccess'));
      roleDialogVisible.value = false;
      fetchUserList(); // 重新获取列表
    } else {
      ElMessage.error(res.message || t('permission.error'));
    }
  } catch (error) {
    console.error('设置角色失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveRolesLoading.value = false;
  }
};

// 保存用户
const handleSave = async () => {
  saveLoading.value = true;
  try {
    if (dialogType.value === 'add') {
      // 创建用户
      const params: UserCreateParams = {
        username: userForm.username,
        password: userForm.password,
        realName: userForm.realName,
        email: userForm.email,
        phone: userForm.phone,
        status: userForm.status,
        roles: userForm.roles.map(role => role.id),
      };

      const res = await createUserService(params);

      if (res.code === 200) {
        ElMessage.success(t('permission.createSuccess'));
        dialogVisible.value = false;
        fetchUserList(); // 重新获取列表
      } else {
        ElMessage.error(res.message || t('permission.error'));
      }
    } else {
      // 更新用户
      const params: UserUpdateParams = {
        id: userForm.id,
        realName: userForm.realName,
        email: userForm.email,
        phone: userForm.phone,
        status: userForm.status,
        roles: userForm.roles.map(role => role.id),
      };

      const res = await updateUserService(params);

      if (res.code === 200) {
        ElMessage.success(t('permission.updateSuccess'));
        dialogVisible.value = false;
        fetchUserList(); // 重新获取列表
      } else {
        ElMessage.error(res.message || t('permission.error'));
      }
    }
  } catch (error) {
    console.error('保存用户失败:', error);
    ElMessage.error(t('permission.error'));
  } finally {
    saveLoading.value = false;
  }
};
</script>
