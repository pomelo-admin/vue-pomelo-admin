<template>
  <Vcode
    :show="isShow"
    :type="type"
    :canvasWidth="width"
    :canvasHeight="height"
    :puzzleScale="puzzleScale"
    :sliderSize="sliderSize"
    :range="tolerance"
    :successText="successText"
    :failText="failText"
    :sliderText="sliderText"
    @success="handleSuccess"
    @fail="handleFail"
    @close="handleClose"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
// @ts-ignore
import Vcode from 'vue3-puzzle-vcode';

const props = defineProps({
  // 是否显示验证码
  show: {
    type: Boolean,
    default: false,
  },
  // 展示类型：modal(模态框) 或 inside(内嵌)
  type: {
    type: String,
    default: 'modal',
  },
  // 容器宽度
  width: {
    type: Number,
    default: 320,
  },
  // 容器高度
  height: {
    type: Number,
    default: 160,
  },
  // 拼图块大小比例
  puzzleScale: {
    type: Number,
    default: 1,
  },
  // 滑块大小
  sliderSize: {
    type: Number,
    default: 50,
  },
  // 判定成功的误差范围
  tolerance: {
    type: Number,
    default: 10,
  },
  // 自定义图片
  imgs: {
    type: Array,
    default: () => [],
  },
  // 成功提示文字
  successText: {
    type: String,
    default: '验证通过！',
  },
  // 失败提示文字
  failText: {
    type: String,
    default: '验证失败，请重试',
  },
  // 滑动条文字
  sliderText: {
    type: String,
    default: '拖动滑块完成拼图',
  },
});

const emit = defineEmits<{
  (e: 'success', offset: number): void;
  (e: 'fail', offset: number): void;
  (e: 'close'): void;
  (e: 'reset'): void;
  (e: 'update:show', value: boolean): void;
}>();

// 控制验证码的显示
const isShow = ref(props.show);

// 监听props.show的变化
watch(
  () => props.show,
  newVal => {
    isShow.value = newVal;
  }
);

// 验证成功回调
const handleSuccess = (offset: number) => {
  emit('success', offset);
};

// 验证失败回调
const handleFail = (offset: number) => {
  emit('fail', offset);
};

// 关闭验证码回调
const handleClose = () => {
  isShow.value = false;
  emit('close');
  emit('update:show', false);
};

// 重置验证码回调
const handleReset = () => {
  emit('reset');
};
</script>
