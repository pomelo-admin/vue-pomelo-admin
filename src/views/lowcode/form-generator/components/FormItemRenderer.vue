<template>
  <el-form-item :label="item.label" :prop="item.prop" :required="item.required">
    <!-- 输入框 -->
    <el-input
      v-if="item.type === 'input'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      :placeholder="item.placeholder"
    />

    <!-- 文本域 -->
    <el-input
      v-else-if="item.type === 'textarea'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      type="textarea"
      :placeholder="item.placeholder"
    />

    <!-- 数字输入框 -->
    <el-input-number
      v-else-if="item.type === 'number'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      controls-position="right"
    />

    <!-- 下拉选择框 -->
    <el-select
      v-else-if="item.type === 'select'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      :placeholder="item.placeholder"
      style="width: 100%"
    >
      <el-option
        v-for="option in item.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <!-- 单选框 -->
    <el-radio-group
      v-else-if="item.type === 'radio'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
    >
      <el-radio v-for="option in item.options" :key="option.value" :label="option.value">
        {{ option.label }}
      </el-radio>
    </el-radio-group>

    <!-- 多选框 -->
    <el-checkbox-group
      v-else-if="item.type === 'checkbox'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
    >
      <el-checkbox v-for="option in item.options" :key="option.value" :label="option.value">
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 开关 -->
    <el-switch
      v-else-if="item.type === 'switch'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
    />

    <!-- 日期选择器 -->
    <el-date-picker
      v-else-if="item.type === 'date'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      type="date"
      :placeholder="item.placeholder"
      style="width: 100%"
    />

    <!-- 时间选择器 -->
    <el-time-picker
      v-else-if="item.type === 'time'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      :placeholder="item.placeholder"
      style="width: 100%"
    />

    <!-- 日期时间选择器 -->
    <el-date-picker
      v-else-if="item.type === 'datetime'"
      :model-value="getValue(item.prop)"
      @update:model-value="updateValue(item.prop, $event)"
      type="datetime"
      :placeholder="item.placeholder"
      style="width: 100%"
    />

    <!-- 操作按钮 -->
    <div v-if="!preview" class="item-actions">
      <el-button type="danger" size="small" circle @click.stop="$emit('remove', index)">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';

interface FormItem {
  type: string;
  label: string;
  prop: string;
  placeholder: string;
  required: boolean;
  options?: Array<{ label: string; value: any }>;
}

const props = defineProps({
  item: {
    type: Object as () => FormItem,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['remove', 'update']);

// 获取表单数据值
const getValue = (prop: string) => {
  return props.formData[prop];
};

// 更新表单数据
const updateValue = (prop: string, value: any) => {
  emit('update', { prop, value });
};
</script>

<style scoped>
.item-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
