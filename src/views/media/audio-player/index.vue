<template>
  <div class="p-[10px]">
    <el-card>
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon><video-camera /></el-icon>
          <span>{{ t('menu.media') }}</span>
        </div>
      </template>
      <div class="text-gray-500">
        {{ t('common.usageNote') }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
