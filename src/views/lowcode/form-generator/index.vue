<template>
  <div class="form-generator-container">
    <el-card class="form-generator-card">
      <template #header>
        <div class="card-header">
          <span>表单生成器</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="previewForm">
              <el-icon><View /></el-icon>
              预览
            </el-button>
            <el-button type="success" size="small" @click="generateCode">
              <el-icon><DocumentCopy /></el-icon>
              生成代码
            </el-button>
            <el-button type="warning" size="small" @click="resetForm">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </div>
        </div>
      </template>

      <div class="form-designer">
        <div class="components-panel">
          <h4 class="panel-title">组件</h4>
          <div class="components-list">
            <div
              v-for="item in componentList"
              :key="item.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, item)"
            >
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div class="form-canvas" @dragover.prevent @drop="handleDrop">
          <div v-if="formItems.length === 0" class="empty-tip">拖拽组件到此区域</div>
          <template v-else>
            <el-form :model="formData" label-width="100px" class="preview-form">
              <div
                v-for="(item, index) in formItems"
                :key="index"
                class="form-item-wrapper"
                :class="{ active: selectedIndex === index }"
                @click="selectItem(index)"
              >
                <FormItemRenderer
                  :item="item"
                  :index="index"
                  :formData="formData"
                  @remove="removeItem"
                  @update="updateFormItemValue"
                />
              </div>
            </el-form>
          </template>
        </div>

        <div class="properties-panel">
          <h4 class="panel-title">属性</h4>
          <div v-if="selectedIndex === -1" class="no-selection">请选择一个表单项</div>
          <div v-else class="properties-form">
            <el-form label-position="top" size="small">
              <el-form-item label="标签">
                <el-input v-model="formItems[selectedIndex].label" />
              </el-form-item>
              <el-form-item label="字段名">
                <el-input v-model="formItems[selectedIndex].prop" />
              </el-form-item>
              <el-form-item label="占位文本" v-if="formItems[selectedIndex].type !== 'switch'">
                <el-input v-model="formItems[selectedIndex].placeholder" />
              </el-form-item>
              <el-form-item label="是否必填">
                <el-switch v-model="formItems[selectedIndex].required" />
              </el-form-item>
              <!-- 特定组件的属性 -->
              <template
                v-if="
                  formItems[selectedIndex].type === 'select' ||
                  formItems[selectedIndex].type === 'radio' ||
                  formItems[selectedIndex].type === 'checkbox'
                "
              >
                <el-divider>选项设置</el-divider>
                <div
                  v-for="(option, optIndex) in formItems[selectedIndex].options"
                  :key="optIndex"
                  class="option-item"
                >
                  <el-input v-model="option.label" placeholder="选项名" class="option-input" />
                  <el-input v-model="option.value" placeholder="选项值" class="option-input" />
                  <el-button
                    type="danger"
                    size="small"
                    circle
                    @click="removeOption(selectedIndex, optIndex)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
                <el-button type="primary" size="small" @click="addOption(selectedIndex)">
                  <el-icon><Plus /></el-icon>
                  添加选项
                </el-button>
              </template>
            </el-form>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="表单预览" width="60%">
      <el-form :model="formData" label-width="100px">
        <FormItemRenderer
          v-for="(item, index) in formItems"
          :key="index"
          :item="item"
          :index="index"
          :formData="formData"
          :preview="true"
          @update="updateFormItemValue"
        />
        <el-form-item>
          <el-button type="primary">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 代码生成对话框 -->
    <el-dialog v-model="codeDialogVisible" title="生成的表单代码" width="70%">
      <pre class="code-block"><code>{{ generatedCode }}</code></pre>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="copyCode">
            <el-icon><DocumentCopy /></el-icon>
            复制代码
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { View, DocumentCopy, RefreshRight, Delete, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import FormItemRenderer from './components/FormItemRenderer.vue';
import { generateFormCode } from './components/CodeGenerator';

// 组件列表
const componentList = [
  { type: 'input', label: '输入框', icon: 'EditPen' },
  { type: 'textarea', label: '文本域', icon: 'Memo' },
  { type: 'number', label: '数字输入框', icon: 'Odometer' },
  { type: 'select', label: '下拉选择框', icon: 'Select' },
  { type: 'radio', label: '单选框', icon: 'Check' },
  { type: 'checkbox', label: '多选框', icon: 'List' },
  { type: 'switch', label: '开关', icon: 'Switch' },
  { type: 'date', label: '日期选择器', icon: 'Calendar' },
  { type: 'time', label: '时间选择器', icon: 'Clock' },
  { type: 'datetime', label: '日期时间选择器', icon: 'Timer' },
];

// 表单项列表
interface FormItem {
  type: string;
  label: string;
  prop: string;
  placeholder: string;
  required: boolean;
  options?: Array<{ label: string; value: any }>;
}

const formItems = ref<FormItem[]>([]);
const formData = reactive<Record<string, any>>({});
const selectedIndex = ref(-1);

// 对话框控制
const previewDialogVisible = ref(false);
const codeDialogVisible = ref(false);
const generatedCode = ref('');

// 拖拽处理
const handleDragStart = (event: DragEvent, item: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('componentType', item.type);
  }
};

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer) {
    const componentType = event.dataTransfer.getData('componentType');
    addComponent(componentType);
  }
};

// 添加组件
const addComponent = (type: string) => {
  const component = componentList.find(item => item.type === type);
  if (!component) return;

  // 创建表单项
  const newItem: FormItem = {
    type,
    label: `${component.label}`,
    prop: `field${formItems.value.length + 1}`,
    placeholder: `请输入${component.label}`,
    required: false,
  };

  // 添加选项属性
  if (['select', 'radio', 'checkbox'].includes(type)) {
    newItem.options = [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
    ];
  }

  formItems.value.push(newItem);
  formData[newItem.prop] = '';

  // 选中新添加的项
  selectedIndex.value = formItems.value.length - 1;
};

// 选择表单项
const selectItem = (index: number) => {
  selectedIndex.value = index;
};

// 移除表单项
const removeItem = (index: number) => {
  const prop = formItems.value[index].prop;
  formItems.value.splice(index, 1);
  delete formData[prop];

  if (selectedIndex.value === index) {
    selectedIndex.value = -1;
  } else if (selectedIndex.value > index) {
    selectedIndex.value--;
  }
};

// 添加选项
const addOption = (itemIndex: number) => {
  const item = formItems.value[itemIndex];
  if (item.options) {
    const newOptionIndex = item.options.length + 1;
    item.options.push({
      label: `选项${newOptionIndex}`,
      value: `option${newOptionIndex}`,
    });
  }
};

// 移除选项
const removeOption = (itemIndex: number, optionIndex: number) => {
  const item = formItems.value[itemIndex];
  if (item.options && item.options.length > 1) {
    item.options.splice(optionIndex, 1);
  } else {
    ElMessage.warning('至少保留一个选项');
  }
};

// 更新表单数据值
const updateFormItemValue = ({ prop, value }: { prop: string; value: any }) => {
  formData[prop] = value;
};

// 重置表单
const resetForm = () => {
  if (formItems.value.length > 0) {
    const confirm = window.confirm('确定要重置表单吗？这将清空所有表单项。');
    if (confirm) {
      formItems.value = [];
      selectedIndex.value = -1;
      for (const key in formData) {
        delete formData[key];
      }
    }
  } else {
    ElMessage.info('表单已经是空的了');
  }
};

// 预览表单
const previewForm = () => {
  if (formItems.value.length === 0) {
    ElMessage.warning('请先添加表单项');
    return;
  }
  previewDialogVisible.value = true;
};

// 生成表单代码
const generateCode = () => {
  if (formItems.value.length === 0) {
    ElMessage.warning('请先添加表单项');
    return;
  }

  generatedCode.value = generateFormCode(formItems.value);
  codeDialogVisible.value = true;
};

// 复制代码
const copyCode = () => {
  navigator.clipboard
    .writeText(generatedCode.value)
    .then(() => {
      ElMessage.success('代码已复制到剪贴板');
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制');
    });
};
</script>

<style scoped>
.form-generator-container {
  padding: 5px;
}

.form-generator-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.form-designer {
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  gap: 20px;
  min-height: 600px;
}

.panel-title {
  padding-bottom: 10px;
  margin-top: 0;
  border-bottom: 1px solid #eee;
}

.components-panel,
.properties-panel {
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
}

.components-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70px;
  padding: 10px;
  font-size: 12px;
  cursor: move;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.3s;
}

.component-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.component-item .el-icon {
  margin-bottom: 5px;
  font-size: 24px;
  color: #409eff;
}

.form-canvas {
  min-height: 500px;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #909399;
}

.form-item-wrapper {
  position: relative;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px dashed transparent;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-item-wrapper:hover {
  border-color: #409eff;
}

.form-item-wrapper.active {
  background-color: rgb(64 158 255 / 5%);
  border-color: #409eff;
}

.item-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}

.form-item-wrapper:hover .item-actions {
  display: block;
}

.properties-form {
  height: 100%;
  overflow-y: auto;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.option-item {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.option-input {
  flex: 1;
}

.code-block {
  max-height: 500px;
  padding: 15px;
  overflow: auto;
  font-family: monospace;
  white-space: pre-wrap;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
