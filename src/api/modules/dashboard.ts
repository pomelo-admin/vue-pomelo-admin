import request from '@/utils/request';

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface VisitData {
  date: string;
  count: number;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  type: string;
  time: string;
}

// 仪表盘概览数据类型
export interface OverviewData {
  totalUsers: number;
  totalOrders: number;
  totalIncome: number;
  totalViews: number;
  weekGrowth: {
    users: number;
    orders: number;
    income: number;
    views: number;
  };
}

// 销售数据类型
export interface SalesApiData {
  trend: SalesData[];
  categories: CategoryData[];
  type: string;
}

// 获取仪表盘概览数据
export function getDashboardOverviewService(): Promise<ApiResponse<OverviewData>> {
  return request({
    url: '/dashboard/overview',
    method: 'get',
  });
}

// 获取访问量趋势数据
export function getVisitsDataService(): Promise<ApiResponse<VisitData[]>> {
  return request({
    url: '/dashboard/visits',
    method: 'get',
  });
}

// 获取销售趋势数据
export function getSalesDataService(params: { type: string }): Promise<ApiResponse<SalesApiData>> {
  return request({
    url: '/dashboard/sales',
    method: 'get',
    params,
  });
}

// 获取最近活动
export function getActivitiesService(params: { limit: number }): Promise<ApiResponse<Activity[]>> {
  return request({
    url: '/dashboard/activities',
    method: 'get',
    params,
  });
}
