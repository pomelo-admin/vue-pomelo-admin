<template>
  <div>
    <el-table :data="userList" stripe style="width: 100%" v-loading="loading">
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
            @click="handleAssignRole(row)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Role {
  id: string;
  name: string;
  code: string;
}

interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  status: number;
  roles: Role[];
}

interface Props {
  loading: boolean;
  userList: User[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:currentPage': [value: number];
  'update:pageSize': [value: number];
  edit: [user: User];
  delete: [user: User];
  'assign-role': [user: User];
  'page-change': [page: number];
  'size-change': [size: number];
}>();

const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);

watch(
  () => props.currentPage,
  val => {
    currentPage.value = val;
  }
);

watch(
  () => props.pageSize,
  val => {
    pageSize.value = val;
  }
);

watch(currentPage, val => {
  emit('update:currentPage', val);
});

watch(pageSize, val => {
  emit('update:pageSize', val);
});

const handleEdit = (row: User) => {
  emit('edit', row);
};

const handleDelete = (row: User) => {
  emit('delete', row);
};

const handleAssignRole = (row: User) => {
  emit('assign-role', row);
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  emit('size-change', size);
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  emit('page-change', page);
};
</script>
