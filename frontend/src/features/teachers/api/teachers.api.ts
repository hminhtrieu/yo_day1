import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { TeacherResponse, TeacherUpsertRequest } from '../../../types/yoedu';


export const getTeachers = async (keyword?: string): Promise<TeacherResponse[]> => {
  const response = await apiClient.get<any>('/teacher', {
    params: cleanParams({ keyword })
  });
  return response as any;
};

export const getTeacherById = async (id: number): Promise<TeacherResponse> => {
  const response = await apiClient.get<any>(`/teacher/${id}`);
  return response as any;
};

export const createTeacher = async (data: TeacherUpsertRequest): Promise<TeacherResponse> => {
  const response = await apiClient.post<any>('/teacher', data);
  return response as any;
};

export const updateTeacher = async (id: number, data: TeacherUpsertRequest): Promise<TeacherResponse> => {
  const response = await apiClient.put<any>(`/teacher/${id}`, data);
  return response as any;
};

export const deleteTeacher = async (id: number): Promise<void> => {
  await apiClient.delete(`/teacher/${id}`);
};
