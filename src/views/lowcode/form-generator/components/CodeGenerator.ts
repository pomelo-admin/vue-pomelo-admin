/**
 * 表单代码生成器 - 生成表单的Vue代码
 */

interface FormItem {
  type: string;
  label: string;
  prop: string;
  placeholder: string;
  required: boolean;
  options?: Array<{ label: string; value: any }>;
}

/**
 * 生成表单代码
 * @param formItems 表单项配置
 * @returns 生成的Vue代码
 */
export function generateFormCode(formItems: FormItem[]): string {
  if (formItems.length === 0) {
    return '';
  }

  // 构建代码字符串
  let code = '<template>\n';
  code += '  <el-form :model="formData" label-width="100px">\n';

  // 添加表单项
  formItems.forEach(item => {
    code += `    <el-form-item label="${item.label}" prop="${item.prop}"${item.required ? ' required' : ''}>\n`;

    switch (item.type) {
      case 'input':
        code += `      <el-input v-model="formData.${item.prop}" placeholder="${item.placeholder}" />\n`;
        break;
      case 'textarea':
        code += `      <el-input v-model="formData.${item.prop}" type="textarea" placeholder="${item.placeholder}" />\n`;
        break;
      case 'number':
        code += `      <el-input-number v-model="formData.${item.prop}" controls-position="right" />\n`;
        break;
      case 'select':
        code += `      <el-select v-model="formData.${item.prop}" placeholder="${item.placeholder}" style="width: 100%">\n`;
        item.options?.forEach(option => {
          code += `        <el-option label="${option.label}" value="${option.value}" />\n`;
        });
        code += `      </el-select>\n`;
        break;
      case 'radio':
        code += `      <el-radio-group v-model="formData.${item.prop}">\n`;
        item.options?.forEach(option => {
          code += `        <el-radio label="${option.value}">${option.label}</el-radio>\n`;
        });
        code += `      </el-radio-group>\n`;
        break;
      case 'checkbox':
        code += `      <el-checkbox-group v-model="formData.${item.prop}">\n`;
        item.options?.forEach(option => {
          code += `        <el-checkbox label="${option.value}">${option.label}</el-checkbox>\n`;
        });
        code += `      </el-checkbox-group>\n`;
        break;
      case 'switch':
        code += `      <el-switch v-model="formData.${item.prop}" />\n`;
        break;
      case 'date':
        code += `      <el-date-picker v-model="formData.${item.prop}" type="date" placeholder="${item.placeholder}" style="width: 100%" />\n`;
        break;
      case 'time':
        code += `      <el-time-picker v-model="formData.${item.prop}" placeholder="${item.placeholder}" style="width: 100%" />\n`;
        break;
      case 'datetime':
        code += `      <el-date-picker v-model="formData.${item.prop}" type="datetime" placeholder="${item.placeholder}" style="width: 100%" />\n`;
        break;
    }

    code += `    </el-form-item>\n`;
  });

  // 添加按钮
  code += '    <el-form-item>\n';
  code += '      <el-button type="primary" @click="submitForm">提交</el-button>\n';
  code += '      <el-button @click="resetForm">重置</el-button>\n';
  code += '    </el-form-item>\n';
  code += '  </el-form>\n';
  code += '</template>\n\n';

  // 脚本部分
  code += '<script setup lang="ts">\n';
  code += "import { reactive } from 'vue';\n";
  code += "import { ElMessage } from 'element-plus';\n\n";

  code += 'const formData = reactive({\n';
  // 添加表单数据
  formItems.forEach(item => {
    let defaultValue = "''";
    if (item.type === 'checkbox') {
      defaultValue = '[]';
    } else if (item.type === 'switch') {
      defaultValue = 'false';
    }
    code += `  ${item.prop}: ${defaultValue},\n`;
  });
  code += '});\n\n';

  code += '// 表单校验规则\n';
  code += 'const rules = {\n';
  // 添加校验规则
  formItems.forEach(item => {
    if (item.required) {
      const triggerType = ['radio', 'checkbox', 'select', 'switch'].includes(item.type)
        ? 'change'
        : 'blur';
      const messagePrefix = item.type === 'select' ? '选择' : '输入';
      code += `  ${item.prop}: [\n`;
      code += `    { required: true, message: '请${messagePrefix}${item.label}', trigger: '${triggerType}' },\n`;
      code += `  ],\n`;
    }
  });
  code += '};\n\n';

  code += '// 提交表单\n';
  code += 'const submitForm = () => {\n';
  code += '  // 这里添加表单提交逻辑\n';
  code += "  console.log('表单数据:', formData);\n";
  code += "  ElMessage.success('表单提交成功');\n";
  code += '};\n\n';

  code += '// 重置表单\n';
  code += 'const resetForm = () => {\n';
  // 添加重置逻辑
  formItems.forEach(item => {
    let defaultValue = "''";
    if (item.type === 'checkbox') {
      defaultValue = '[]';
    } else if (item.type === 'switch') {
      defaultValue = 'false';
    }
    code += `  formData.${item.prop} = ${defaultValue};\n`;
  });
  code += "  ElMessage.info('表单已重置');\n";
  code += '};\n';
  code += '</script>';

  return code;
}
