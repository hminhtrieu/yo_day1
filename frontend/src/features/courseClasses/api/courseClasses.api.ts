import { apiClient } from '../../../lib/api';
import type { CourseClassResponse, CourseClassCreateRequest } from '../../../types/yoedu';

export const getCourseClasses = async (): Promise<CourseClassResponse[]> => {
  const response = await apiClient.get<any>('/courseclass');
  return (response as any).data;
};

export const getCourseClassById = async (id: number): Promise<CourseClassResponse> => {
  const response = await apiClient.get<any>(`/courseclass/${id}`);
  return (response as any).data;
};

export const createCourseClass = async (data: CourseClassCreateRequest): Promise<CourseClassResponse> => {
  const response = await apiClient.post<any>('/courseclass', data);
  return (response as any).data;
};

export const updateCourseClass = async (id: number, data: CourseClassCreateRequest): Promise<CourseClassResponse> => {
  const response = await apiClient.put<any>(`/courseclass/${id}`, data);
  return (response as any).data;
};

export const deleteCourseClass = async (id: number): Promise<void> => {
  await apiClient.delete(`/courseclass/${id}`);
};
