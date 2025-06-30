<template>
  <FeatureDemo
    :title="t('features.throttledSearchSelect.title', '节流远程搜索选择框')"
    :description="
      t(
        'features.throttledSearchSelect.description',
        '一个基于 Element Plus 的节流远程搜索选择框组件，支持单选、多选和自定义选项模板'
      )
    "
    path="src/components/features/throttled-search-select"
  >
    <!-- 基本用法 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.throttledSearchSelect.basicUsage', '基本用法') }}</span>
        </div>
      </template>
      <p>
        {{ t('features.throttledSearchSelect.basicDescription', '通过输入关键词来搜索匹配的用户') }}
      </p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloThrottledSearchSelect
            v-model="singleSelected"
            placeholder="请输入关键词搜索用户"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
            @change="handleSingleChange"
          />
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.throttledSearchSelect.currentValue', '当前选中值') }}:
            {{ singleSelected }}
          </p>
          <p v-if="singleSelectedInfo">
            {{ t('features.throttledSearchSelect.selectedUser', '选中用户') }}:
            {{ singleSelectedInfo.name }} ({{ singleSelectedInfo.email }})
          </p>
        </div>
      </div>
    </el-card>

    <!-- 多选模式 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.throttledSearchSelect.multipleMode', '多选模式') }}</span>
        </div>
      </template>
      <p>{{ t('features.throttledSearchSelect.multipleDescription', '支持选择多个选项') }}</p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloThrottledSearchSelect
            v-model="multipleSelected"
            placeholder="请输入关键词搜索用户"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
            :multiple="true"
            @change="handleMultipleChange"
          />
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.throttledSearchSelect.currentValue', '当前选中值') }}:
            {{ multipleSelected }}
          </p>
          <div v-if="multipleSelectedInfo.length">
            <p>{{ t('features.throttledSearchSelect.selectedUsers', '选中用户列表') }}:</p>
            <ul>
              <li v-for="user in multipleSelectedInfo" :key="user.id">
                {{ user.name }} ({{ user.email }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 自定义节流时间 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.throttledSearchSelect.customThrottle', '自定义节流时间') }}</span>
        </div>
      </template>
      <p>
        {{
          t(
            'features.throttledSearchSelect.customThrottleDescription',
            '设置更长的节流时间（800毫秒），适用于高频输入场景'
          )
        }}
      </p>
      <div class="demo-container">
        <div class="demo-component">
          <PomeloThrottledSearchSelect
            v-model="customThrottleSelected"
            placeholder="请输入关键词搜索用户"
            :fetch-options="fetchUserOptions"
            :load-by-values="loadUsersByIds"
            :throttle-wait="800"
          />
        </div>
        <div class="demo-result">
          <p>
            {{ t('features.throttledSearchSelect.currentValue', '当前选中值') }}:
            {{ customThrottleSelected }}
          </p>
          <p v-if="customThrottleSelectedInfo">
            {{ t('features.throttledSearchSelect.selectedUser', '选中用户') }}:
            {{ customThrottleSelectedInfo.name }} ({{ customThrottleSelectedInfo.email }})
          </p>
        </div>
      </div>
    </el-card>

    <!-- 防抖与节流对比 -->
    <el-card class="demo-section" shadow="hover">
      <template #header>
        <div class="section-header">
          <span>{{ t('features.throttledSearchSelect.comparison', '防抖与节流对比') }}</span>
        </div>
      </template>
      <p>
        {{
          t(
            'features.throttledSearchSelect.comparisonDescription',
            '对比防抖和节流的不同效果，节流会在输入过程中持续触发请求，而防抖只在停止输入后触发'
          )
        }}
      </p>
      <div class="demo-container">
        <div class="demo-component">
          <h4>{{ t('features.throttledSearchSelect.throttledVersion', '节流版本') }}</h4>
          <PomeloThrottledSearchSelect
            v-model="comparisonThrottleSelected"
            placeholder="请输入关键词搜索用户"
            :fetch-options="fetchUserOptionsWithLog('throttle')"
            :load-by-values="loadUsersByIds"
          />
          <h4 class="mt-4">
            {{ t('features.throttledSearchSelect.debouncedVersion', '防抖版本') }}
          </h4>
          <PomeloDebouncedSearchSelect
            v-model="comparisonDebounceSelected"
            placeholder="请输入关键词搜索用户"
            :fetch-options="fetchUserOptionsWithLog('debounce')"
            :load-by-values="loadUsersByIds"
          />
        </div>
        <div class="demo-result">
          <h4>{{ t('features.throttledSearchSelect.apiCallLog', 'API 调用日志') }}</h4>
          <div class="api-log-container">
            <div v-for="(log, index) in apiCallLogs" :key="index" class="api-log-item">
              <span class="log-time">{{ log.time }}</span>
              <span :class="['log-type', `log-${log.type}`]">{{ log.type }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
            <div v-if="!apiCallLogs.length" class="no-logs">
              {{ t('features.throttledSearchSelect.noLogs', '暂无日志，请在输入框中输入内容') }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </FeatureDemo>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { FeatureDemo } from '@/components/common';
import { PomeloThrottledSearchSelect, PomeloDebouncedSearchSelect } from '@/components/features';
import type { OptionItem } from '@/components/features/throttled-search-select/types';

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

// API调用日志
interface ApiCallLog {
  type: 'throttle' | 'debounce';
  message: string;
  time: string;
}

const apiCallLogs = ref<ApiCallLog[]>([]);

// 添加API调用日志
const addApiCallLog = (type: 'throttle' | 'debounce', query: string) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, '0')}`;

  apiCallLogs.value.unshift({
    type,
    message: `搜索: "${query}"`,
    time,
  });

  // 最多保留10条日志
  if (apiCallLogs.value.length > 10) {
    apiCallLogs.value.pop();
  }
};

// 带日志的远程搜索方法
const fetchUserOptionsWithLog = (type: 'throttle' | 'debounce') => {
  return async (query: string): Promise<OptionItem[]> => {
    // 添加日志
    addApiCallLog(type, query);

    // 调用原始方法
    return fetchUserOptions(query);
  };
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

// 自定义节流时间
const customThrottleSelected = ref<number | null>(null);
const customThrottleSelectedInfo = computed(
  () => users.find(user => user.id === customThrottleSelected.value) || null
);

// 对比版本
const comparisonThrottleSelected = ref<number | null>(null);
const comparisonDebounceSelected = ref<number | null>(null);

// 示例初始化数据
onMounted(() => {
  // 默认选择几个值作为示例
  setTimeout(() => {
    multipleSelected.value = [1, 3];
  }, 500);
});
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

    &.mt-4 {
      margin-top: 20px;
    }
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

  .api-log-container {
    max-height: 300px;
    padding: 10px 0;
    overflow-y: auto;

    .api-log-item {
      display: flex;
      align-items: center;
      padding: 8px;
      margin-bottom: 5px;
      background-color: #fff;
      border-radius: 4px;

      .log-time {
        margin-right: 10px;
        font-family: monospace;
        font-size: 12px;
        color: #909399;
      }

      .log-type {
        padding: 2px 6px;
        margin-right: 10px;
        font-size: 12px;
        font-weight: bold;
        border-radius: 3px;

        &.log-throttle {
          color: #409eff;
          background-color: rgb(64 158 255 / 10%);
        }

        &.log-debounce {
          color: #67c23a;
          background-color: rgb(103 194 58 / 10%);
        }
      }
    }

    .no-logs {
      padding: 20px 0;
      color: #909399;
      text-align: center;
    }
  }
}
</style>
