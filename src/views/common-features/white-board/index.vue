<template>
  <Frame
    src="https://songlh.top/paint-board/"
    :showLoading="true"
    height="100%"
    :sandbox="'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads'"
    @load="() => ElMessage.success(t('features.whiteBoard.frameLoaded'))"
    @error="() => ElMessage.error(t('features.whiteBoard.frameError'))"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Frame } from '@/components/common';

const { t } = useI18n();
</script>
