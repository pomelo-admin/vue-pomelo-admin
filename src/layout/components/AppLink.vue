<template>
  <component :is="linkType" v-bind="linkProps">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isExternal } from '@/utils';

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

// 判断链接类型
const linkType = computed(() => {
  return isExternal(props.to) ? 'a' : 'router-link';
});

// 链接属性
const linkProps = computed(() => {
  // console.log('AppLink to:', props.to);
  return isExternal(props.to)
    ? {
        href: props.to,
        target: '_blank',
        rel: 'noopener',
      }
    : {
        to: props.to,
      };
});
</script>
