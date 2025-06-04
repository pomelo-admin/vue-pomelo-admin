import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
const { Random } = Mock;

// 定义类型
interface VisitData {
  date: string;
  count: number;
}

interface SalesData {
  date: string;
  amount: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  type: string;
  time: string;
}

// 生成过去30天的日期数组
const generateDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// 生成过去30天的随机访问量数据
const generateVisitData = (): VisitData[] => {
  const dates = generateDates();
  return dates.map(date => ({
    date,
    count: Random.integer(100, 1000),
  }));
};

// 生成随机销售数据
const generateSalesData = (): SalesData[] => {
  const dates = generateDates();
  return dates.map(date => ({
    date,
    amount: Random.float(1000, 10000, 2, 2),
  }));
};

// 生成随机销售类别数据
const generateSalesCategoryData = (): CategoryData[] => {
  return [
    { name: '电子产品', value: Random.integer(200, 500) },
    { name: '服装', value: Random.integer(150, 400) },
    { name: '食品', value: Random.integer(100, 300) },
    { name: '家居', value: Random.integer(80, 250) },
    { name: '书籍', value: Random.integer(50, 200) },
  ];
};

// 生成随机活动数据
const generateActivities = (count: number): Activity[] => {
  const activities: Activity[] = [];
  const types = ['info', 'success', 'warning', 'error'];
  const actions = [
    '创建了任务',
    '完成了任务',
    '更新了文档',
    '删除了文件',
    '上传了图片',
    '审核了内容',
  ];

  for (let i = 0; i < count; i++) {
    activities.push({
      id: Random.id(),
      user: Random.name(),
      action: Random.pick(actions),
      target: Random.word(3, 8),
      type: Random.pick(types),
      time: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    });
  }

  return activities;
};

export default [
  // 获取仪表盘概览数据
  {
    url: '/dashboard/overview',
    method: 'get',
    timeout: 300,
    response: () => {
      return {
        code: 200,
        data: {
          totalUsers: Random.integer(1000, 5000),
          totalOrders: Random.integer(5000, 10000),
          totalIncome: Random.float(100000, 500000, 2, 2),
          totalViews: Random.integer(50000, 100000),
          weekGrowth: {
            users: Random.float(-10, 30, 1, 1),
            orders: Random.float(-5, 20, 1, 1),
            income: Random.float(-8, 25, 1, 1),
            views: Random.float(0, 40, 1, 1),
          },
        },
        message: '获取成功',
      };
    },
  },

  // 获取访问量趋势数据
  {
    url: '/dashboard/visits',
    method: 'get',
    timeout: 300,
    response: () => {
      return {
        code: 200,
        data: generateVisitData(),
        message: '获取成功',
      };
    },
  },

  // 获取销售趋势数据
  {
    url: '/dashboard/sales',
    method: 'get',
    timeout: 300,
    response: ({ query }) => {
      const { type = 'week' } = query;

      return {
        code: 200,
        data: {
          trend: generateSalesData(),
          categories: generateSalesCategoryData(),
          type,
        },
        message: '获取成功',
      };
    },
  },

  // 获取最近活动
  {
    url: '/dashboard/activities',
    method: 'get',
    timeout: 300,
    response: ({ query }) => {
      const { limit = 10 } = query;

      return {
        code: 200,
        data: generateActivities(Number(limit)),
        message: '获取成功',
      };
    },
  },
] as MockMethod[];
