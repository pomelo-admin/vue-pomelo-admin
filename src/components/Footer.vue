<template>
  <div class="footer">
    <p>{{ t('common.copyright') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.footer {
  @apply py-3 text-center text-sm text-gray-500 dark:text-gray-400;
}
</style>
