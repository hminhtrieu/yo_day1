import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { RoomResponse, RoomUpsertRequest } from '../../../types/yoedu';

export const getRooms = async (keyword?: string): Promise<RoomResponse[]> => {
  const response = await apiClient.get<any>('/rooms', {
    params: cleanParams({ keyword })
  });
  return (response as any).data;
};

export const getRoomById = async (id: number): Promise<RoomResponse> => {
  const response = await apiClient.get<any>(`/rooms/${id}`);
  return (response as any).data;
};

export const createRoom = async (data: RoomUpsertRequest): Promise<RoomResponse> => {
  const response = await apiClient.post<any>('/rooms', data);
  return (response as any).data;
};

export const updateRoom = async (id: number, data: RoomUpsertRequest): Promise<RoomResponse> => {
  const response = await apiClient.put<any>(`/rooms/${id}`, data);
  return (response as any).data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await apiClient.delete(`/rooms/${id}`);
};
