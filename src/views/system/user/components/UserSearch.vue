<template>
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
  search: [params: { username: string; realName: string }];
  reset: [];
}>();

const searchForm = reactive({
  username: '',
  realName: '',
});

const handleSearch = () => {
  emit('search', {
    username: searchForm.username,
    realName: searchForm.realName,
  });
};

const handleReset = () => {
  searchForm.username = '';
  searchForm.realName = '';
  emit('reset');
};
</script>
