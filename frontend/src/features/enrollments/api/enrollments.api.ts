import { apiClient } from '../../../lib/api';
import type { EnrollmentResponse, EnrollmentCreateRequest } from '../../../types/yoedu';

export const getEnrollments = async (): Promise<EnrollmentResponse[]> => {
  const response = await apiClient.get<any>('/enrollments');
  return response.data?.data || response.data || response || [];
};

export const getEnrollmentsByClassId = async (classId: number): Promise<EnrollmentResponse[]> => {
  const response = await apiClient.get<any>(`/enrollments/class/${classId}`);
  return response.data?.data || response.data || response || [];
};

export const getEnrollmentsByStudentId = async (studentId: number): Promise<EnrollmentResponse[]> => {
  const response = await apiClient.get<any>(`/enrollments/student/${studentId}`);
  return response.data?.data || response.data || response || [];
};

export const createEnrollment = async (data: EnrollmentCreateRequest): Promise<EnrollmentResponse> => {
  const response = await apiClient.post<any>('/enrollments', data);
  return response.data?.data || response.data || response;
};
