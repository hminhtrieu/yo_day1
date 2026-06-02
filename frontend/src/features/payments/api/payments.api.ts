import { apiClient } from '../../../lib/api';
import type { PaymentResponse } from '../../../types/yoedu';

export const getPaymentsByStudent = async (studentId: number): Promise<PaymentResponse[]> => {
  const response = await apiClient.get<any>(`/payments/student/${studentId}`);
  return response.data;
};

export const getAllPayments = async (): Promise<PaymentResponse[]> => {
  const response = await apiClient.get<any>('/payments/all');
  return response.data;
};

export const getPaymentById = async (id: number): Promise<PaymentResponse> => {
  const response = await apiClient.get<any>(`/payments/${id}`);
  return response.data;
};
