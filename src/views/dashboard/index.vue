<template>
  <div class="dashboard-container">
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card" v-loading="loading.overview">
            <div class="card-header">
              <div class="card-icon bg-blue-100 text-blue-500">
                <el-icon :size="24">
                  <User />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ t('dashboard.totalUsers') }}</div>
                <div class="card-value">{{ formatNumber(overviewData.totalUsers) }}</div>
                <div class="card-footer">
                  <span
                    :class="overviewData.weekGrowth.users >= 0 ? 'text-green-500' : 'text-red-500'"
                  >
                    <el-icon>
                      <component :is="overviewData.weekGrowth.users >= 0 ? ArrowUp : ArrowDown" />
                    </el-icon>
                    {{ Math.abs(overviewData.weekGrowth.users) }}%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card" v-loading="loading.overview">
            <div class="card-header">
              <div class="card-icon bg-green-100 text-green-500">
                <el-icon :size="24">
                  <ShoppingCart />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ t('dashboard.totalOrders') }}</div>
                <div class="card-value">{{ formatNumber(overviewData.totalOrders) }}</div>
                <div class="card-footer">
                  <span
                    :class="overviewData.weekGrowth.orders >= 0 ? 'text-green-500' : 'text-red-500'"
                  >
                    <el-icon>
                      <component :is="overviewData.weekGrowth.orders >= 0 ? ArrowUp : ArrowDown" />
                    </el-icon>
                    {{ Math.abs(overviewData.weekGrowth.orders) }}%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card" v-loading="loading.overview">
            <div class="card-header">
              <div class="card-icon bg-orange-100 text-orange-500">
                <el-icon :size="24">
                  <Wallet />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ t('dashboard.totalIncome') }}</div>
                <div class="card-value">¥ {{ formatNumber(overviewData.totalIncome) }}</div>
                <div class="card-footer">
                  <span
                    :class="overviewData.weekGrowth.income >= 0 ? 'text-green-500' : 'text-red-500'"
                  >
                    <el-icon>
                      <component :is="overviewData.weekGrowth.income >= 0 ? ArrowUp : ArrowDown" />
                    </el-icon>
                    {{ Math.abs(overviewData.weekGrowth.income) }}%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card" v-loading="loading.overview">
            <div class="card-header">
              <div class="card-icon bg-purple-100 text-purple-500">
                <el-icon :size="24">
                  <View />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ t('dashboard.totalViews') }}</div>
                <div class="card-value">{{ formatNumber(overviewData.totalViews) }}</div>
                <div class="card-footer">
                  <span
                    :class="overviewData.weekGrowth.views >= 0 ? 'text-green-500' : 'text-red-500'"
                  >
                    <el-icon>
                      <component :is="overviewData.weekGrowth.views >= 0 ? ArrowUp : ArrowDown" />
                    </el-icon>
                    {{ Math.abs(overviewData.weekGrowth.views) }}%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="data-analysis">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <el-card shadow="hover" class="mb-4" :body-style="{ padding: '10px' }">
            <template #header>
              <div class="flex justify-between items-center py-2">
                <span class="text-lg font-medium">{{ t('dashboard.salesTrend') }}</span>
                <div>
                  <el-radio-group v-model="chartTimeRange" size="small">
                    <el-radio-button value="week">{{ t('dashboard.week') }}</el-radio-button>
                    <el-radio-button value="month">{{ t('dashboard.month') }}</el-radio-button>
                    <el-radio-button value="year">{{ t('dashboard.year') }}</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </template>
            <el-skeleton :loading="loading.sales" animated :rows="6">
              <template #default>
                <el-empty
                  v-if="!salesData.trend.length"
                  :description="t('dashboard.salesTrendEmpty')"
                />
                <div
                  v-else
                  ref="salesChartRef"
                  class="w-full flex items-center justify-center"
                  style="width: 100%; height: 320px; min-height: 320px"
                ></div>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-card shadow="hover" class="mb-4" :body-style="{ padding: '10px' }">
            <template #header>
              <div class="flex justify-between items-center py-2">
                <span class="text-lg font-medium">{{ t('dashboard.salesCategory') }}</span>
              </div>
            </template>
            <el-skeleton :loading="loading.sales" animated :rows="6">
              <template #default>
                <el-empty
                  v-if="!salesData.categories.length"
                  :description="t('dashboard.salesCategoryEmpty')"
                />
                <div
                  v-else
                  ref="categoryChartRef"
                  class="w-full flex items-center justify-center"
                  style="width: 100%; height: 320px; min-height: 320px"
                ></div>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="recent-activity">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">{{ t('dashboard.recentActivity') }}</span>
            <el-button link @click="loadMoreActivities">{{ t('dashboard.viewAll') }}</el-button>
          </div>
        </template>
        <el-table v-loading="loading.activities" :data="activities" style="width: 100%">
          <el-table-column prop="time" :label="t('dashboard.time')" width="180" />
          <el-table-column prop="user" :label="t('dashboard.user')" width="180" />
          <el-table-column prop="action" :label="t('dashboard.activity')" />
          <el-table-column prop="target" :label="t('dashboard.target')" width="120" />
          <el-table-column :label="t('dashboard.status')" width="100">
            <template #default="scope">
              <el-tag
                :type="
                  scope.row.type === 'success'
                    ? 'success'
                    : scope.row.type === 'error'
                      ? 'danger'
                      : scope.row.type === 'warning'
                        ? 'warning'
                        : 'info'
                "
              >
                {{ getStatusText(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { User, ShoppingCart, Wallet, View, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import {
  getDashboardOverviewService,
  getVisitsDataService,
  getSalesDataService,
  getActivitiesService,
  type Activity,
  type CategoryData,
  type SalesData,
  type OverviewData,
  type SalesApiData,
} from '@/api';
import { ElMessage } from 'element-plus';

const { t } = useI18n();

// 图表引用
const salesChartRef = ref<HTMLElement | null>(null);
let salesChart: echarts.ECharts | null = null;
const categoryChartRef = ref<HTMLElement | null>(null);
let categoryChart: echarts.ECharts | null = null;

// 加载状态
const loading = reactive({
  overview: false,
  visits: false,
  sales: false,
  activities: false,
});

// 图表时间范围
const chartTimeRange = ref('month');

// 概览数据
const overviewData = reactive<OverviewData>({
  totalUsers: 0,
  totalOrders: 0,
  totalIncome: 0,
  totalViews: 0,
  weekGrowth: {
    users: 0,
    orders: 0,
    income: 0,
    views: 0,
  },
});

// 销售数据
const salesData = reactive<SalesApiData>({
  trend: [],
  categories: [],
  type: 'month',
});

// 活动数据
const activities = ref<Activity[]>([]);
const activitiesLimit = ref(5);

// 格式化数字
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 获取状态文本
const getStatusText = (type: string): string => {
  switch (type) {
    case 'success':
      return '成功';
    case 'error':
      return '失败';
    case 'warning':
      return '警告';
    case 'info':
    default:
      return '信息';
  }
};

// 初始化销售趋势图表
const initSalesChart = () => {
  if (!salesChartRef.value) {
    console.error('销售趋势图表容器不存在');
    return;
  }

  console.log('开始初始化销售趋势图表', salesData.trend);

  // 销毁旧图表实例
  if (salesChart) {
    salesChart.dispose();
  }

  // 创建新图表实例
  salesChart = echarts.init(salesChartRef.value);

  // 准备数据
  const dates = salesData.trend.map((item: SalesData) => item.date);
  const amounts = salesData.trend.map((item: SalesData) => item.amount);

  if (dates.length === 0 || amounts.length === 0) {
    console.warn('销售趋势数据为空');
    return;
  }

  console.log('销售趋势数据:', { dates, amounts });

  // 图表配置
  const option = {
    title: {
      text: t('dashboard.salesTrendTitle', {
        type:
          salesData.type === 'week'
            ? t('dashboard.week')
            : salesData.type === 'month'
              ? t('dashboard.month')
              : t('dashboard.year'),
      }),
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>${data.marker}${t('dashboard.salesAmount', { value: data.value.toFixed(2) })}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `¥${value}`,
        color: '#666',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee',
        },
      },
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: amounts,
        smooth: true,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 10,
          shadowOffsetY: 10,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  };

  try {
    // 设置图表配置
    salesChart.setOption(option);
    console.log('销售趋势图表初始化成功');

    // 手动触发一次 resize，确保图表正确渲染
    setTimeout(() => {
      if (salesChart) {
        salesChart.resize();
        console.log('销售趋势图表大小已调整');
      }
    }, 300);
  } catch (error) {
    console.error('销售趋势图表初始化失败:', error);
  }
};

// 初始化销售分类图表
const initCategoryChart = () => {
  if (!categoryChartRef.value) return;

  // 销毁旧图表实例
  if (categoryChart) {
    categoryChart.dispose();
  }

  // 创建新图表实例
  categoryChart = echarts.init(categoryChartRef.value);

  // 准备数据
  const categoryData = salesData.categories.map((item: CategoryData) => ({
    name: item.name,
    value: item.value,
  }));

  if (categoryData.length === 0) {
    console.warn('销售分类数据为空');
    return;
  }

  // 图表配置
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return t('dashboard.salesCategoryTooltip', {
          name: params.name,
          value: params.value,
          percentage: params.percent.toFixed(1),
        });
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: {
        color: '#333',
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 10,
      textStyle: {
        fontSize: 12,
        color: '#666',
      },
    },
    series: [
      {
        name: '销售分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        labelLine: {
          show: false,
        },
        data: categoryData,
      },
    ],
  };

  // 设置图表配置
  categoryChart.setOption(option);

  // 手动触发一次 resize，确保图表正确渲染
  setTimeout(() => {
    categoryChart?.resize();
  }, 200);
};

// 获取概览数据
const fetchOverviewData = async () => {
  loading.overview = true;
  try {
    const { data } = await getDashboardOverviewService();
    Object.assign(overviewData, data);
  } catch (error) {
    console.error('获取概览数据失败:', error);
    ElMessage.error('获取概览数据失败');
  } finally {
    loading.overview = false;
  }
};

// 获取销售数据
const fetchSalesData = async () => {
  loading.sales = true;
  try {
    console.log('开始获取销售数据，类型:', chartTimeRange.value);
    const { data } = await getSalesDataService({ type: chartTimeRange.value });
    console.log('获取销售数据成功:', data);
    salesData.trend = data.trend;
    salesData.categories = data.categories;
    salesData.type = data.type;
    // 获取数据后初始化图表
    nextTick(() => {
      console.log('DOM已更新，准备初始化图表');
      // 确保DOM已更新并且容器已经渲染
      setTimeout(() => {
        if (salesData.trend.length > 0) {
          initSalesChart();
        } else {
          console.warn('销售趋势数据为空，不初始化图表');
        }

        if (salesData.categories.length > 0) {
          initCategoryChart();
        } else {
          console.warn('销售分类数据为空，不初始化图表');
        }
      }, 100);
    });
  } catch (error) {
    console.error('获取销售数据失败:', error);
    ElMessage.error('获取销售数据失败');
  } finally {
    loading.sales = false;
  }
};

// 获取活动数据
const fetchActivities = async () => {
  loading.activities = true;
  try {
    const { data } = await getActivitiesService({ limit: activitiesLimit.value });
    activities.value = data;
  } catch (error) {
    console.error('获取活动数据失败:', error);
    ElMessage.error('获取活动数据失败');
  } finally {
    loading.activities = false;
  }
};

// 加载更多活动
const loadMoreActivities = () => {
  activitiesLimit.value = 10;
  fetchActivities();
};

// 监听时间范围变化，重新获取销售数据
watch(chartTimeRange, () => {
  fetchSalesData();
});

// 页面加载时获取数据
onMounted(() => {
  console.log('组件已挂载');

  // 先获取概览数据和活动数据
  fetchOverviewData();
  fetchActivities();

  // 延迟获取销售数据，确保DOM已经完全渲染
  setTimeout(() => {
    fetchSalesData();
  }, 200);

  // 监听窗口大小变化，重新调整图表大小
  const resizeHandler = () => {
    if (salesChart) {
      salesChart.resize();
    }
    if (categoryChart) {
      categoryChart.resize();
    }
  };

  window.addEventListener('resize', resizeHandler);

  // 保存事件处理器引用，以便在卸载时移除
  (window as any).dashboardResizeHandler = resizeHandler;
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  console.log('组件即将卸载，清理资源');

  if (salesChart) {
    salesChart.dispose();
    salesChart = null;
  }
  if (categoryChart) {
    categoryChart.dispose();
    categoryChart = null;
  }

  // 移除窗口大小变化的监听器
  if ((window as any).dashboardResizeHandler) {
    window.removeEventListener('resize', (window as any).dashboardResizeHandler);
    delete (window as any).dashboardResizeHandler;
  }
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  .overview-cards {
    .overview-card {
      @apply mb-4;

      .card-header {
        @apply flex items-center;

        .card-icon {
          @apply rounded-lg p-3 mr-4 flex items-center justify-center;
        }

        .card-content {
          @apply flex-1;

          .card-title {
            @apply text-gray-500 text-sm mb-1;
          }

          .card-value {
            @apply text-2xl font-bold mb-1;
          }

          .card-footer {
            @apply text-sm text-gray-500;
          }
        }
      }
    }
  }
}
</style>
