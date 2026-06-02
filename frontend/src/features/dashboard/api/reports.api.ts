import { apiClient } from '../../../lib/api';
import type { 
  DashboardStatsResponse, 
  MonthlyRevenueResponse, 
  CourseRevenueResponse 
} from '../../../types/yoedu';

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await apiClient.get<any>('/reports/dashboard-stats');
  return response.data?.data || response.data || response;
};

export const getMonthlyRevenue = async (year: number): Promise<MonthlyRevenueResponse[]> => {
  const response = await apiClient.get<any>('/reports/revenue/monthly', { params: { year } });
  return response.data?.data || response.data || response || [];
};

export const getCourseRevenue = async (year: number, month?: number): Promise<CourseRevenueResponse[]> => {
  const params: Record<string, any> = { year };
  if (month !== undefined) params.month = month;
  const response = await apiClient.get<any>('/reports/revenue/course', { params });
  return response.data?.data || response.data || response || [];
};
