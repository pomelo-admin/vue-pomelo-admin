<template>
  <vue-pdf-embed ref="pdfRef" :source="props.src" @rendered="handleRendered" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';

const props = defineProps({
  src: {
    type: [String, ArrayBuffer],
    required: true,
  },
});

const pdfRef = ref<any>(null);
const loading = ref(true);

// 处理PDF渲染完成
const handleRendered = () => {
  loading.value = false;
};
</script>
