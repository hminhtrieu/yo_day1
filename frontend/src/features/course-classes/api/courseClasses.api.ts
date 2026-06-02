import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { CourseClassResponse, CourseClassCreateRequest } from '../../../types/yoedu';

export const getCourseClasses = async (keyword?: string): Promise<CourseClassResponse[]> => {
  const response = await apiClient.get<any>('/course-classes', {
    params: cleanParams({ keyword })
  });
  return response.data;
};

export const getCourseClassById = async (id: number): Promise<CourseClassResponse> => {
  const response = await apiClient.get<any>(`/course-classes/${id}`);
  return response.data;
};

export const getCourseClassesByCourseId = async (courseId: number): Promise<CourseClassResponse[]> => {
  const response = await apiClient.get<any>(`/course-classes/course/${courseId}`);
  return response.data;
};

export const createCourseClass = async (data: CourseClassCreateRequest): Promise<CourseClassResponse> => {
  const response = await apiClient.post<any>('/course-classes', data);
  return response.data;
};

export const updateCourseClass = async (id: number, data: CourseClassCreateRequest): Promise<CourseClassResponse> => {
  const response = await apiClient.put<any>(`/course-classes/${id}`, data);
  return response.data;
};

export const deleteCourseClass = async (id: number): Promise<void> => {
  await apiClient.delete(`/course-classes/${id}`);
};
