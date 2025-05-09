<template>
  <div class="dashboard-container">
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card">
            <div class="card-header">
              <div class="card-icon bg-blue-100 text-blue-500">
                <el-icon :size="24">
                  <User />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ $t('dashboard.totalUsers') }}</div>
                <div class="card-value">1,856</div>
                <div class="card-footer">
                  <span class="text-green-500">
                    <el-icon>
                      <ArrowUp />
                    </el-icon>
                    12%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card">
            <div class="card-header">
              <div class="card-icon bg-green-100 text-green-500">
                <el-icon :size="24">
                  <ShoppingCart />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ $t('dashboard.totalOrders') }}</div>
                <div class="card-value">438</div>
                <div class="card-footer">
                  <span class="text-green-500">
                    <el-icon>
                      <ArrowUp />
                    </el-icon>
                    8%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card">
            <div class="card-header">
              <div class="card-icon bg-orange-100 text-orange-500">
                <el-icon :size="24">
                  <Wallet />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ $t('dashboard.totalIncome') }}</div>
                <div class="card-value">¥ 25,680</div>
                <div class="card-footer">
                  <span class="text-red-500">
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                    5%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card shadow="hover" class="overview-card">
            <div class="card-header">
              <div class="card-icon bg-purple-100 text-purple-500">
                <el-icon :size="24">
                  <View />
                </el-icon>
              </div>
              <div class="card-content">
                <div class="card-title">{{ $t('dashboard.totalViews') }}</div>
                <div class="card-value">42,359</div>
                <div class="card-footer">
                  <span class="text-green-500">
                    <el-icon>
                      <ArrowUp />
                    </el-icon>
                    15%
                  </span>
                  较上周
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="data-analysis mt-6">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <el-card shadow="hover" class="h-[400px]">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-bold">{{ $t('dashboard.salesTrend') }}</span>
                <el-radio-group v-model="chartTimeRange" size="small">
                  <el-radio-button value="week">{{ $t('dashboard.week') }}</el-radio-button>
                  <el-radio-button value="month">{{ $t('dashboard.month') }}</el-radio-button>
                  <el-radio-button value="year">{{ $t('dashboard.year') }}</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="h-[300px] flex items-center justify-center">
              <!-- 此处可以添加图表组件，如ECharts -->
              <el-empty description="销售趋势图表" />
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-card shadow="hover" class="h-[400px]">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-bold">{{ $t('dashboard.salesCategory') }}</span>
                <el-button link>{{ $t('dashboard.more') }}</el-button>
              </div>
            </template>
            <div class="h-[300px] flex items-center justify-center">
              <!-- 此处可以添加饼图组件 -->
              <el-empty description="销售类别饼图" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="recent-activity mt-6">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">{{ $t('dashboard.recentActivity') }}</span>
            <el-button link>{{ $t('dashboard.viewAll') }}</el-button>
          </div>
        </template>
        <el-table :data="activities" style="width: 100%">
          <el-table-column prop="time" :label="$t('dashboard.time')" width="180" />
          <el-table-column prop="user" :label="$t('dashboard.user')" width="180" />
          <el-table-column prop="activity" :label="$t('dashboard.activity')" />
          <el-table-column prop="status" :label="$t('dashboard.status')">
            <template #default="scope">
              <el-tag
                :type="
                  scope.row.status === '成功'
                    ? 'success'
                    : scope.row.status === '失败'
                      ? 'danger'
                      : 'info'
                "
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, ShoppingCart, Wallet, View, ArrowUp, ArrowDown } from '@element-plus/icons-vue';

const chartTimeRange = ref('month');

// 假数据
const activities = ref([
  {
    time: '2023-10-15 10:30:24',
    user: '管理员',
    activity: '登录系统',
    status: '成功',
  },
  {
    time: '2023-10-15 09:12:53',
    user: '张三',
    activity: '创建新订单 #23456',
    status: '成功',
  },
  {
    time: '2023-10-14 16:45:12',
    user: '李四',
    activity: '更新商品价格',
    status: '成功',
  },
  {
    time: '2023-10-14 14:22:37',
    user: '王五',
    activity: '尝试删除系统日志',
    status: '失败',
  },
  {
    time: '2023-10-14 11:05:49',
    user: '赵六',
    activity: '导出用户数据',
    status: '进行中',
  },
]);
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
