import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { DashboardStatsResponse } from '../../../types/yoedu';

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await apiClient.get<any>('/reports/dashboard-stats');
  return response.data;
};

export const getMonthlyRevenue = async (year?: number): Promise<any> => {
  const response = await apiClient.get<any>('/reports/revenue/monthly', {
    params: cleanParams({ year })
  });
  return response.data;
};

export const getCourseRevenue = async (year?: number, month?: number): Promise<any> => {
  const response = await apiClient.get<any>('/reports/revenue/course', {
    params: cleanParams({ year, month })
  });
  return response.data;
};
