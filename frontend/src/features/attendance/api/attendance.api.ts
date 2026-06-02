import { apiClient } from '../../../lib/api';
import type { 
  AttendanceResponse, 
  AttendanceCreateRequest, 
  AttendanceBatchRequest, 
  AttendanceMatrixResponse 
} from '../../../types/yoedu';

export const createAttendance = async (data: AttendanceCreateRequest): Promise<AttendanceResponse> => {
  const response = await apiClient.post<any>('/attendance', data);
  return response.data?.data || response.data || response;
};

export const createAttendanceBatch = async (data: AttendanceBatchRequest): Promise<AttendanceResponse[]> => {
  const response = await apiClient.post<any>('/attendance/batch', data);
  return response.data?.data || response.data || response || [];
};

export const getAttendancesByClassId = async (classId: number): Promise<AttendanceResponse[]> => {
  const response = await apiClient.get<any>(`/attendance/class/${classId}`);
  return response.data?.data || response.data || response || [];
};

export const getAttendanceMatrix = async (classId: number): Promise<AttendanceMatrixResponse> => {
  const response = await apiClient.get<any>(`/attendance/matrix/${classId}`);
  return response.data?.data || response.data || response;
};
