import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { CourseResponse, CourseUpsertRequest } from '../../../types/yoedu';


export const getCourses = async (keyword?: string): Promise<CourseResponse[]> => {
  const response = await apiClient.get<any>('/course', {
    params: cleanParams({ keyword })
  });
  return response as any;
};

export const getCourseById = async (id: number): Promise<CourseResponse> => {
  const response = await apiClient.get<any>(`/course/${id}`);
  return response as any;
};

export const createCourse = async (data: CourseUpsertRequest): Promise<CourseResponse> => {
  const response = await apiClient.post<any>('/course', data);
  return response as any;
};

export const updateCourse = async (id: number, data: CourseUpsertRequest): Promise<CourseResponse> => {
  const response = await apiClient.put<any>(`/course/${id}`, data);
  return response as any;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await apiClient.delete(`/course/${id}`);
};
