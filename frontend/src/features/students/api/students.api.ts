import { apiClient } from '../../../lib/api';
import { cleanParams } from '../../../utils/api-utils';
import type { 
  StudentResponse, 
  StudentUpsertRequest, 
  StudentWithParentUpsertRequest 
} from '../../../types/yoedu';


export const getStudents = async (keyword?: string): Promise<StudentResponse[]> => {
  const response = await apiClient.get<any>('/students', {
    params: cleanParams({ keyword })
  });
  return response as any;
};

export const getStudentById = async (id: number): Promise<StudentResponse> => {
  const response = await apiClient.get<any>(`/students/${id}`);
  return response as any;
};

export const createStudent = async (data: StudentUpsertRequest): Promise<StudentResponse> => {
  const response = await apiClient.post<any>('/students', data);
  return response as any;
};

export const createStudentWithParent = async (data: StudentWithParentUpsertRequest): Promise<StudentResponse> => {
  const response = await apiClient.post<any>('/students/with-parent', data);
  return response as any;
};

export const updateStudent = async (id: number, data: StudentUpsertRequest): Promise<StudentResponse> => {
  const response = await apiClient.put<any>(`/students/${id}`, data);
  return response as any;
};

export const updateStudentWithParent = async (id: number, data: StudentWithParentUpsertRequest): Promise<StudentResponse> => {
  const response = await apiClient.put<any>(`/students/${id}/with-parent`, data);
  return response as any;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await apiClient.delete(`/students/${id}`);
};
