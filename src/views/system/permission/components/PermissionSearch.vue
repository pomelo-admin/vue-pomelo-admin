<template>
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
      <el-button type="primary" @click="handleSearch">{{ t('permission.search') }}</el-button>
      <el-button @click="handleReset">{{ t('permission.reset') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits<{
  search: [params: { name: string; code: string }];
  reset: [];
}>();

const searchForm = reactive({
  name: '',
  code: '',
});

const handleSearch = () => {
  emit('search', {
    name: searchForm.name,
    code: searchForm.code,
  });
};

const handleReset = () => {
  searchForm.name = '';
  searchForm.code = '';
  emit('reset');
};
</script>
