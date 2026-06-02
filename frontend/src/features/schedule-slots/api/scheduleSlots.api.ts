import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { ScheduleSlotResponse, ScheduleSlotUpsertRequest } from '../../../types/yoedu';

export const getScheduleSlots = async (keyword?: string): Promise<ScheduleSlotResponse[]> => {
  const response = await apiClient.get<any>('/schedule-slots', {
    params: cleanParams({ keyword })
  });
  return response.data;
};

export const getScheduleSlotById = async (id: number): Promise<ScheduleSlotResponse> => {
  const response = await apiClient.get<any>(`/schedule-slots/${id}`);
  return response.data;
};

export const createScheduleSlot = async (data: ScheduleSlotUpsertRequest): Promise<ScheduleSlotResponse> => {
  const response = await apiClient.post<any>('/schedule-slots', data);
  return response.data;
};

export const updateScheduleSlot = async (id: number, data: ScheduleSlotUpsertRequest): Promise<ScheduleSlotResponse> => {
  const response = await apiClient.put<any>(`/schedule-slots/${id}`, data);
  return response.data;
};

export const deleteScheduleSlot = async (id: number): Promise<void> => {
  await apiClient.delete(`/schedule-slots/${id}`);
};
