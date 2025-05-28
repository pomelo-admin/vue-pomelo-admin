<!-- 验证码显示组件 -->
<template>
  <div class="captcha-display" @click="refresh">
    <span v-for="(digit, index) in digits" :key="index" class="captcha-display__digit">
      {{ digit }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  length: {
    type: Number,
    default: 4,
  },
  // 是否使用字母数字混合模式
  alphanumeric: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['refresh', 'update:captcha']);

// 验证码数组
const digits = ref<string[]>(Array(props.length).fill(''));
// 实际生成的验证码
const captchaValue = ref('');

// 生成随机数字验证码
const generateCaptcha = () => {
  const characters = props.alphanumeric ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '0123456789';
  let result = '';

  for (let i = 0; i < props.length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  captchaValue.value = result;
  digits.value = result.split('');

  // 向父组件发送新的验证码
  emit('update:captcha', result);
};

// 刷新验证码
const refresh = () => {
  generateCaptcha();
  emit('refresh');
};

// 监听长度变化，重新生成验证码
watch(
  () => props.length,
  () => {
    generateCaptcha();
  }
);

// 监听模式变化，重新生成验证码
watch(
  () => props.alphanumeric,
  () => {
    generateCaptcha();
  }
);

onMounted(() => {
  generateCaptcha();
});

defineExpose({
  refresh,
  captchaValue,
});
</script>

<style lang="scss" scoped>
.captcha-display {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: calc(100% - 2px);
  padding: 0 8px;
  cursor: pointer;
  user-select: none;
  background-color: #f5f7fa;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e6e8eb;
  }

  &__digit {
    font-family: 'Courier New', Courier, monospace;
    font-size: 18px;
    font-weight: bold;
    color: #606266;
    letter-spacing: 2px;
    text-decoration: line-through;
    text-decoration-color: rgb(0 0 0 / 20%);
    transform: skewX(-10deg);
  }
}
</style>
