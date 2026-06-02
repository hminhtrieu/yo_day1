import { apiClient } from '../../../lib/api';
import type { 
  InvoiceCreateRequest, 
  InvoiceResponse, 
  PaymentCreateRequest, 
  PaymentResponse 
} from '../../../types/yoedu';

export const createInvoice = async (data: InvoiceCreateRequest): Promise<InvoiceResponse> => {
  const response = await apiClient.post<any>('/billing/invoices', data);
  return response.data?.data || response.data || response;
};

export const getInvoicesByStudentId = async (studentId: number): Promise<InvoiceResponse[]> => {
  const response = await apiClient.get<any>(`/billing/students/${studentId}/invoices`);
  return response.data?.data || response.data || response || [];
};

export const createPayment = async (data: PaymentCreateRequest): Promise<PaymentResponse> => {
  const response = await apiClient.post<any>('/billing/payments', data);
  return response.data?.data || response.data || response;
};

export const getAllPayments = async (): Promise<PaymentResponse[]> => {
  const response = await apiClient.get<any>('/billing/payments/all');
  return response.data?.data || response.data || response || [];
};
