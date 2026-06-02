export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type UserRole = 'ADMIN' | 'ACADEMIC_STAFF' | 'CASHIER' | 'PARENT';
