import request from '@/utils/request';

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

// 获取仪表盘概览数据
export function getDashboardOverview() {
  return request({
    url: '/dashboard/overview',
    method: 'get',
  });
}

// 获取访问量趋势数据
export function getVisitsData() {
  return request({
    url: '/dashboard/visits',
    method: 'get',
  });
}

// 获取销售趋势数据
export function getSalesData(params: { type: string }) {
  return request({
    url: '/dashboard/sales',
    method: 'get',
    params,
  });
}

// 获取最近活动
export function getActivities(params: { limit: number }) {
  return request({
    url: '/dashboard/activities',
    method: 'get',
    params,
  });
}
