<template>
  <el-select
    v-model="localModelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :multiple="multiple"
    :clearable="clearable"
    :filterable="true"
    :remote="true"
    :remote-method="throttledRemoteMethod"
    :loading="loading"
    :no-data-text="noDataText"
    :no-match-text="noMatchText"
    :reserve-keyword="reserveKeyword"
    class="throttled-search-select"
    v-bind="$attrs"
    @change="handleChange"
    @visible-change="handleVisibleChange"
    @clear="handleClear"
    @remove-tag="handleRemoveTag"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>

    <template v-if="!customOptions">
      <el-option
        v-for="item in validOptions"
        :key="item[valueKey]"
        :label="item[labelKey] || ''"
        :value="item[valueKey]"
        :disabled="item.disabled"
      >
        <slot name="option" :item="item">
          {{ item[labelKey] || '' }}
        </slot>
      </el-option>
    </template>
    <slot v-else></slot>

    <template v-if="$slots.empty" #empty>
      <slot name="empty"></slot>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { throttle } from 'lodash-es';
import type { ThrottledSearchSelectProps, ThrottledSearchSelectEmits, OptionItem } from './types';

// 定义组件属性
const props = withDefaults(defineProps<ThrottledSearchSelectProps>(), {
  modelValue: undefined,
  placeholder: '请选择',
  disabled: false,
  multiple: false,
  clearable: true,
  valueKey: 'value',
  labelKey: 'label',
  noDataText: '无数据',
  noMatchText: '无匹配数据',
  reserveKeyword: true,
  throttleWait: 300,
  customOptions: false,
});

// 定义事件
const emit = defineEmits<ThrottledSearchSelectEmits>();

// 创建本地计算属性来处理v-model
const localModelValue = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value);
  },
});

// 组件状态
const loading = ref(false);
const options = ref<OptionItem[]>([]);
const keyword = ref('');

// 过滤有效的选项
const validOptions = computed(() => {
  return options.value.filter(
    item => item && item[props.valueKey] !== undefined && item[props.valueKey] !== null
  );
});

// 创建节流函数
const throttledFetch = throttle(async (query: string) => {
  if (!props.fetchOptions || typeof props.fetchOptions !== 'function') return;

  try {
    loading.value = true;
    const data = await props.fetchOptions(query);
    options.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching options:', error);
    options.value = [];
  } finally {
    loading.value = false;
  }
}, props.throttleWait);

// 远程搜索方法
const throttledRemoteMethod = (query: string) => {
  keyword.value = query;
  if (query !== '') {
    throttledFetch(query);
  } else {
    options.value = [];
  }
};

// 初始化时加载选中项的详细信息
const initSelectedOptions = async () => {
  if (!props.modelValue || !props.loadByValues || typeof props.loadByValues !== 'function') return;

  try {
    loading.value = true;

    const values = props.multiple
      ? Array.isArray(props.modelValue)
        ? props.modelValue
        : []
      : [props.modelValue];

    if (values.length > 0) {
      const data = await props.loadByValues(values);
      options.value = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error('Error loading selected options:', error);
  } finally {
    loading.value = false;
  }
};

// 处理选择变化
const handleChange = (value: any) => {
  emit('change', value);
};

// 处理下拉框显示/隐藏
const handleVisibleChange = (visible: boolean) => {
  emit('visible-change', visible);

  // 打开下拉框且没有搜索词时，可以加载默认选项
  if (visible && !keyword.value && props.loadDefaultOptions) {
    throttledFetch('');
  }
};

// 处理清除
const handleClear = () => {
  emit('clear');
};

// 处理移除标签（多选模式）
const handleRemoveTag = (value: any) => {
  emit('remove-tag', value);
};

// 监听modelValue变化，确保选中项的详细信息被加载
watch(
  () => props.modelValue,
  () => {
    if (options.value.length === 0) {
      initSelectedOptions();
    }
  },
  { immediate: true }
);

// 组件挂载时初始化
onMounted(() => {
  initSelectedOptions();
});

// 组件卸载前清除节流函数
onBeforeUnmount(() => {
  if (typeof throttledFetch.cancel === 'function') {
    throttledFetch.cancel();
  }
});

// 暴露方法
defineExpose({
  refreshOptions: (query = '') => throttledFetch(query),
  clearOptions: () => {
    options.value = [];
  },
});
</script>

<style scoped>
.throttled-search-select {
  width: 100%;
}
</style>
