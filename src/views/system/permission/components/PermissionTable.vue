<template>
  <div>
    <el-table :data="permissionList" stripe style="width: 100%" v-loading="loading">
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
import type { Permission } from '@/store/modules/system';

const { t } = useI18n();

interface Props {
  loading: boolean;
  permissionList: Permission[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:currentPage': [value: number];
  'update:pageSize': [value: number];
  edit: [permission: Permission];
  delete: [permission: Permission];
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

const handleEdit = (row: Permission) => {
  emit('edit', row);
};

const handleDelete = (row: Permission) => {
  emit('delete', row);
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
