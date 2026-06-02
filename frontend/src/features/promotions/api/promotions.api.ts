import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { PromotionResponse, PromotionUpsertRequest } from '../../../types/yoedu';

export const getPromotions = async (keyword?: string): Promise<PromotionResponse[]> => {
  const response = await apiClient.get<any>('/promotions', {
    params: cleanParams({ keyword })
  });
  return response.data;
};

export const getPromotionById = async (id: number): Promise<PromotionResponse> => {
  const response = await apiClient.get<any>(`/promotions/${id}`);
  return response.data;
};

export const createPromotion = async (data: PromotionUpsertRequest): Promise<PromotionResponse> => {
  const response = await apiClient.post<any>('/promotions', data);
  return response.data;
};

export const updatePromotion = async (id: number, data: PromotionUpsertRequest): Promise<PromotionResponse> => {
  const response = await apiClient.put<any>(`/promotions/${id}`, data);
  return response.data;
};

export const deletePromotion = async (id: number): Promise<void> => {
  await apiClient.delete(`/promotions/${id}`);
};
