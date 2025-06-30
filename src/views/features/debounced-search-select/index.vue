<template>
  <FeatureDemo
    :title="t('features.debouncedSearchSelect.title', '防抖远程搜索选择框')"
    :description="
      t(
        'features.debouncedSearchSelect.description',
        '一个基于 Element Plus 的防抖远程搜索选择框组件，支持单选、多选和自定义选项模板'
      )
    "
    path="src/components/features/debounced-search-select"
  >
    <!-- 基本用法 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.debouncedSearchSelect.basicUsage', '基本用法') }}</span>
        </div>
      </template>
      <p>
        {{ t('features.debouncedSearchSelect.basicDescription', '通过输入关键词来搜索匹配的用户') }}
      </p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloDebouncedSearchSelect
            v-model="singleSelected"
            placeholder="请输入关键词搜索用户"
            label-key="name"
            value-key="id"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
            @change="handleSingleChange"
          />
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.debouncedSearchSelect.currentValue', '当前选中值') }}:
            {{ singleSelected }}
          </p>
          <p v-if="singleSelectedInfo">
            {{ t('features.debouncedSearchSelect.selectedUser', '选中用户') }}:
            {{ singleSelectedInfo.name }} ({{ singleSelectedInfo.email }})
          </p>
        </div>
      </div>
    </el-card>

    <!-- 多选模式 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.debouncedSearchSelect.multipleMode', '多选模式') }}</span>
        </div>
      </template>
      <p>{{ t('features.debouncedSearchSelect.multipleDescription', '支持选择多个选项') }}</p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloDebouncedSearchSelect
            v-model="multipleSelected"
            placeholder="请输入关键词搜索用户"
            label-key="name"
            value-key="id"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
            :multiple="true"
            @change="handleMultipleChange"
          />
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.debouncedSearchSelect.currentValue', '当前选中值') }}:
            {{ multipleSelected }}
          </p>
          <div v-if="multipleSelectedInfo.length">
            <p>{{ t('features.debouncedSearchSelect.selectedUsers', '选中用户列表') }}:</p>
            <ul>
              <li v-for="user in multipleSelectedInfo" :key="user.id">
                {{ user.name }} ({{ user.email }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 自定义选项模板 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.debouncedSearchSelect.customTemplate', '自定义选项模板') }}</span>
        </div>
      </template>
      <p>
        {{
          t(
            'features.debouncedSearchSelect.customTemplateDescription',
            '使用插槽自定义选项的显示方式'
          )
        }}
      </p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloDebouncedSearchSelect
            v-model="customTemplateSelected"
            placeholder="请输入关键词搜索用户"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
          >
            <template #option="{ item }">
              <div class="custom-option">
                <div class="option-avatar" :style="{ backgroundColor: getRandomColor(item.id) }">
                  {{ item.name.charAt(0).toUpperCase() }}
                </div>
                <div class="option-info">
                  <div class="option-name">{{ item.name }}</div>
                  <div class="option-email">{{ item.email }}</div>
                </div>
              </div>
            </template>
          </PomeloDebouncedSearchSelect>
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.debouncedSearchSelect.currentValue', '当前选中值') }}:
            {{ customTemplateSelected }}
          </p>
          <p v-if="customTemplateSelectedInfo">
            {{ t('features.debouncedSearchSelect.selectedUser', '选中用户') }}:
            {{ customTemplateSelectedInfo.name }} ({{ customTemplateSelectedInfo.email }})
          </p>
        </div>
      </div>
    </el-card>

    <!-- 加载默认选项 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.debouncedSearchSelect.loadDefaultOptions', '加载默认选项') }}</span>
        </div>
      </template>
      <p>
        {{
          t(
            'features.debouncedSearchSelect.defaultOptionsDescription',
            '点击选择框自动加载默认选项（不需要输入搜索词）'
          )
        }}
      </p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloDebouncedSearchSelect
            v-model="defaultOptionsSelected"
            placeholder="点击加载默认选项"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
            :load-default-options="true"
          />
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.debouncedSearchSelect.currentValue', '当前选中值') }}:
            {{ defaultOptionsSelected }}
          </p>
          <p v-if="defaultOptionsSelectedInfo">
            {{ t('features.debouncedSearchSelect.selectedUser', '选中用户') }}:
            {{ defaultOptionsSelectedInfo.name }} ({{ defaultOptionsSelectedInfo.email }})
          </p>
        </div>
      </div>
    </el-card>
  </FeatureDemo>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { PomeloDebouncedSearchSelect } from '@/components/features';
import type { OptionItem } from '@/components/features/debounced-search-select/types';

const { t } = useI18n();

// 模拟用户数据
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', department: '研发部' },
  { id: 2, name: '李四', email: 'lisi@example.com', department: '设计部' },
  { id: 3, name: '王五', email: 'wangwu@example.com', department: '市场部' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', department: '研发部' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', department: '人事部' },
  { id: 6, name: '孙八', email: 'sunba@example.com', department: '财务部' },
  { id: 7, name: '周九', email: 'zhoujiu@example.com', department: '行政部' },
  { id: 8, name: '吴十', email: 'wushi@example.com', department: '研发部' },
  { id: 9, name: '郑十一', email: 'zheng11@example.com', department: '设计部' },
  { id: 10, name: '王十二', email: 'wang12@example.com', department: '市场部' },
  { id: 11, name: '刘十三', email: 'liu13@example.com', department: '研发部' },
  { id: 12, name: '陈十四', email: 'chen14@example.com', department: '人事部' },
];

// 远程搜索方法
const fetchUserOptions = async (query: string): Promise<OptionItem[]> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!query) {
    // 确保返回的数据有正确的 id 和 name 字段
    return users.slice(0, 5).map(user => ({
      ...user,
      id: user.id || 0, // 确保 id 不为 undefined
      name: user.name || '', // 确保 name 不为 undefined
    }));
  }

  return users
    .filter(
      user =>
        user.name.includes(query) ||
        user.email.includes(query) ||
        user.department.includes(query) ||
        String(user.id).includes(query)
    )
    .map(user => ({
      ...user,
      id: user.id || 0,
      name: user.name || '',
    }));
};

// 根据ID加载用户数据
const loadUsersByIds = async (ids: number[]): Promise<OptionItem[]> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return users
    .filter(user => ids.includes(user.id))
    .map(user => ({
      ...user,
      id: user.id || 0,
      name: user.name || '',
    }));
};

// 单选模式
const singleSelected = ref<number | null>(null);
const singleSelectedInfo = computed(
  () => users.find(user => user.id === singleSelected.value) || null
);

const handleSingleChange = (value: number) => {
  console.log('单选值改变:', value);
};

// 多选模式
const multipleSelected = ref<number[]>([]);
const multipleSelectedInfo = computed(() =>
  users.filter(user => multipleSelected.value.includes(user.id))
);

const handleMultipleChange = (value: number[]) => {
  console.log('多选值改变:', value);
};

// 自定义选项模板
const customTemplateSelected = ref<number | null>(null);
const customTemplateSelectedInfo = computed(
  () => users.find(user => user.id === customTemplateSelected.value) || null
);

// 随机颜色生成
const getRandomColor = (id: number) => {
  const colors = [
    '#409EFF',
    '#67C23A',
    '#E6A23C',
    '#F56C6C',
    '#909399',
    '#3B71CA',
    '#14A44D',
    '#E4A11B',
    '#DC4C64',
    '#54B4D3',
  ];
  return colors[id % colors.length];
};

// 默认选项
const defaultOptionsSelected = ref<number | null>(null);
const defaultOptionsSelectedInfo = computed(
  () => users.find(user => user.id === defaultOptionsSelected.value) || null
);
</script>

<style lang="scss" scoped>
.demo-section {
  margin-bottom: 20px;

  .section-header {
    font-size: 16px;
    font-weight: bold;
  }

  p {
    margin-bottom: 15px;
    color: #606266;
  }

  h4 {
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: 500;
  }

  .demo-container {
    display: flex;
    gap: 30px;
    margin: 15px 0;

    @media (width <= 768px) {
      flex-direction: column;
    }

    .demo-component {
      flex: 1;
      min-width: 0;
    }

    .demo-result {
      flex: 1;
      min-width: 0;
      padding: 15px;
      overflow-wrap: break-word;
      background-color: #f5f7fa;
      border-radius: 4px;

      ul {
        padding-left: 20px;
        margin-top: 5px;

        li {
          margin-bottom: 5px;
        }
      }
    }
  }

  .code-block {
    padding: 16px;
    overflow: auto;
    background-color: #f5f7fa;
    border-radius: 4px;

    pre {
      margin: 0;

      code {
        font-family: Monaco, monospace;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
      }
    }
  }

  .custom-option {
    display: flex;
    align-items: center;
  }

  .option-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    font-weight: bold;
    color: white;
    background-color: #409eff;
    border-radius: 50%;
  }

  .option-info {
    display: flex;
    flex-direction: column;
  }

  .option-name {
    font-size: 14px;
    color: #303133;
  }

  .option-email {
    font-size: 12px;
    color: #909399;
  }
}
</style>
