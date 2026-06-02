import { apiClient } from '../../../lib/api';
import type { ParentDashboardResponse, ParentResponse, ParentUpsertRequest } from '../../../types/yoedu';

export const getParentDashboard = async (): Promise<ParentDashboardResponse> => {
  const response = await apiClient.get<any>('/parent/dashboard');
  // the parent portal returns ApiResponse<ParentDashboardResponse> according to ParentController.java
  return response.data;
};

export const getParents = async (): Promise<ParentResponse[]> => {
  const response = await apiClient.get<any>('/parent');
  return response as any;
};

export const getParentById = async (id: number): Promise<ParentResponse> => {
  const response = await apiClient.get<any>(`/parent/${id}`);
  return response as any;
};

export const createParent = async (data: ParentUpsertRequest): Promise<ParentResponse> => {
  const response = await apiClient.post<any>('/parent', data);
  return response as any;
};

export const updateParent = async (id: number, data: ParentUpsertRequest): Promise<ParentResponse> => {
  const response = await apiClient.put<any>(`/parent/${id}`, data);
  return response as any;
};
