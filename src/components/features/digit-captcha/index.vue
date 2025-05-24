<!-- 数字验证码组件 -->
<template>
  <div class="digit-captcha">
    <el-input
      v-model="inputValue"
      :placeholder="placeholder"
      :maxlength="length"
      class="digit-captcha__input"
      @input="handleInput"
      @keydown.delete="handleDelete"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <template #prepend>
        <el-icon><Lock /></el-icon>
      </template>
      <template #append>
        <CaptchaDisplay
          :length="length"
          :alphanumeric="alphanumeric"
          @refresh="handleCaptchaRefresh"
          v-model:captcha="actualCaptcha"
          ref="captchaDisplayRef"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Lock } from '@element-plus/icons-vue';
import CaptchaDisplay from './components/CaptchaDisplay.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  length: {
    type: Number,
    default: 4,
  },
  // 是否使用字母数字混合模式
  alphanumeric: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '请输入验证码',
  },
  // 是否自动检查验证结果
  autoCheck: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['success', 'failure', 'change', 'update:modelValue']);

// 验证码组件引用
const captchaDisplayRef = ref<{
  refresh: () => void;
  captchaValue: string;
} | null>(null);
// 用户输入的验证码
const inputValue = ref(props.modelValue);
// 实际生成的验证码
const actualCaptcha = ref('');
// 是否已经输入过
const isDirty = ref(false);
// 输入框是否聚焦
const isFocused = ref(false);
// 验证结果
const isValid = ref(false);

// 处理验证码刷新
const handleCaptchaRefresh = () => {
  inputValue.value = '';
  isDirty.value = false;
  isValid.value = false;
  emit('change', '');
  emit('update:modelValue', '');
};

// 刷新验证码
const refresh = () => {
  if (captchaDisplayRef.value) {
    captchaDisplayRef.value.refresh();
  }
};

// 检查验证结果
const checkResult = () => {
  isDirty.value = true;
  const value = inputValue.value.trim();

  // 验证长度不够时不做验证
  if (value.length < props.length) {
    isValid.value = false;
    return false;
  }

  isValid.value = value === actualCaptcha.value;

  if (isValid.value) {
    emit('success', value);
  } else {
    emit('failure', value);
  }

  return isValid.value;
};

// 处理输入
const handleInput = (value: string) => {
  // 如果是字母数字混合模式，则将字母转为大写
  if (props.alphanumeric) {
    inputValue.value = value.toUpperCase();
  }

  emit('change', inputValue.value);
  emit('update:modelValue', inputValue.value);

  if (props.autoCheck && inputValue.value.length === props.length) {
    checkResult();
  }
};

// 处理删除键
const handleDelete = () => {
  // 这里不需要特殊处理，el-input已经处理了删除操作
};

// 监听用户输入变化
watch(inputValue, newValue => {
  if (newValue.length === 0) {
    isDirty.value = false;
    isValid.value = false;
  }
});

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== inputValue.value) {
      inputValue.value = newValue;
    }
  }
);

onMounted(() => {
  // 在这里不需要生成验证码，CaptchaDisplay 组件会自动生成
});

defineExpose({
  refresh,
  checkResult,
  get actualCaptcha() {
    return actualCaptcha.value;
  },
  get isValid() {
    return isValid.value;
  },
});
</script>

<style lang="scss" scoped>
.digit-captcha {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__input {
    width: 100%;
  }
}
</style>
