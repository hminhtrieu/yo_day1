import { apiClient } from '../../../lib/api';
import type { TeacherResponse, RoomResponse, ScheduleSlotResponse, PromotionResponse } from '../../../types/yoedu';

export const getReferenceTeachers = async (): Promise<TeacherResponse[]> => {
  const response = await apiClient.get<any>('/reference/teachers');
  return response.data;
};

export const getReferenceRooms = async (): Promise<RoomResponse[]> => {
  const response = await apiClient.get<any>('/reference/rooms');
  return response.data;
};

export const getReferenceScheduleSlots = async (): Promise<ScheduleSlotResponse[]> => {
  const response = await apiClient.get<any>('/reference/schedule-slots');
  return response.data;
};

export const getReferencePromotions = async (): Promise<PromotionResponse[]> => {
  const response = await apiClient.get<any>('/reference/promotions');
  return response.data;
};
