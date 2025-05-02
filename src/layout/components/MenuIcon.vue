<template>
  <el-icon v-if="icon" :size="16" class="mr-2">
    <component :is="resolveIcon" />
  </el-icon>
  <el-icon v-else :size="16" class="mr-2">
    <Menu />
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as Icons from '@element-plus/icons-vue';
import { Menu } from '@element-plus/icons-vue';

const props = defineProps({
  icon: {
    type: String,
    default: ''
  }
});

// 解析图标名称，使用element-plus内置图标
const resolveIcon = computed(() => {
  return props.icon ? Icons[props.icon as keyof typeof Icons] : Menu;
});
</script>