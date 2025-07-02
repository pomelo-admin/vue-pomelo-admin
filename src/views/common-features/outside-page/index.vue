<template>
  <Frame
    src="https://ak.hypergryph.com/"
    :showLoading="true"
    height="100%"
    :sandbox="'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads'"
    @load="() => ElMessage.success(t('features.outsidePage.loadSuccess'))"
    @error="() => ElMessage.error(t('features.outsidePage.loadFailed'))"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Frame } from '@/components/common';

const { t } = useI18n();
</script>
