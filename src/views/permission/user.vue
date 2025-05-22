<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="right-panel">
            <el-input
              v-model="searchText"
              placeholder="搜索用户"
              clearable
              style="width: 200px; margin-right: 10px"
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" @click="handleAdd" v-permission="'user:create'">
              新增用户
            </el-button>
          </div>
        </div>
      </template>
      <el-table :data="userList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="180">
          <template #default="{ row }">
            <el-tag v-for="role in row.roles" :key="role.id" style="margin-right: 5px" type="info">
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
              v-permission="'user:edit'"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              size="small"
              @click="handleSetRole(row)"
              v-permission="'user:edit'"
            >
              分配角色
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
              v-permission="'user:delete'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
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
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="500px"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="userForm.realName" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="userForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog v-model="roleDialogVisible" title="分配角色" width="500px">
      <div v-if="currentUser">
        <p>用户：{{ currentUser.username }} ({{ currentUser.realName }})</p>
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
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRoles" :loading="saveRolesLoading">
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
import { InfoFilled } from '@element-plus/icons-vue';
import { usePermissionStore } from '@/store/modules/permission';

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
const searchText = ref('');
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
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
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

    // 假设搜索匹配用户名或姓名
    const filteredUsers = searchText.value
      ? mockUsers.filter(
          user =>
            user.username.includes(searchText.value) || user.realName.includes(searchText.value)
        )
      : mockUsers;

    total.value = filteredUsers.length;

    // 分页
    const start = (page.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    userList.value = filteredUsers.slice(start, end);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error('获取用户列表失败');
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

    ElMessage.success('角色分配成功');
    roleDialogVisible.value = false;
    fetchUserList(); // 刷新用户列表
  } catch (error) {
    console.error('角色分配失败:', error);
    ElMessage.error('角色分配失败');
  } finally {
    saveRolesLoading.value = false;
  }
};

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 500));

        ElMessage.success('删除成功');
        fetchUserList(); // 刷新用户列表
      } catch (error) {
        console.error('删除用户失败:', error);
        ElMessage.error('删除用户失败');
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

      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功');
      dialogVisible.value = false;
      fetchUserList(); // 刷新用户列表
    } catch (error) {
      console.error('保存用户失败:', error);
      ElMessage.error('保存用户失败');
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

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.right-panel {
  display: flex;
  align-items: center;
}
</style>
