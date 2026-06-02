// ENUMS (String Literals)
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type StudentStatus = 'ACTIVE' | 'PAUSED' | 'DROPPED';
export type TeacherRole = 'TEACHER' | 'ASSISTANT' | 'BOTH';
export type ClassStatus = 'OPEN' | 'ONGOING' | 'CLOSED' | 'FULL';
export type EnrollmentStatus = 'ACTIVE' | 'PAUSED' | 'DROPPED' | 'COMPLETED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER';
export type DiscountType = 'PERCENTAGE' | 'FIXED' | 'PERCENT' | 'AMOUNT';
export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERPAID';
export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ==========================================
// COURSE & COURSE CLASS
// ==========================================
export interface CourseResponse {
  id: number;
  courseCode: string;
  name: string;
  decsciption: string;
  tuitionFee: number;
  totalSessions: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseUpsertRequest {
  courseCode: string;
  name: string;
  decsciption?: string;
  tuitionFee: number;
  totalSessions: number;
  isActive: number;
}

export interface CourseClassResponse {
  id: number;
  classCode: string;
  name: string;
  course: CourseResponse;
  room: RoomResponse;
  slot: ScheduleSlotResponse;
  mainTeacher: TeacherResponse;
  assistantTeacher?: TeacherResponse;
  startTime: string;
  endTime: string;
  maxStudents: number;
  tuitionFee: number;
  status: ClassStatus;
}

export interface CourseClassCreateRequest {
  classCode: string;
  name: string;
  courseId: number;
  roomId: number;
  scheduleSlotId: number;
  mainTeacherId: number;
  assistantTeacherId?: number;
  startDate: string;
  endDate?: string;
  maxStudents: number;
  tuitionFee: number;
  status: ClassStatus;
}

// ==========================================
// STUDENT & PARENT
// ==========================================
export interface ParentResponse {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  relationship: string;
}

export interface ParentUpsertRequest {
  fullname: string;
  phone: string;
  email?: string;
  address?: string;
  relationship?: string;
}

export interface StudentResponse {
  id: number;
  studentCode: string;
  fullname: string;
  dateOfBirth: string;
  gradeLevel: string;
  schoolName: string;
  lastScore: number;
  note: string;
  phone: string;
  gender: Gender;
  parent: ParentResponse;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentUpsertRequest {
  studentCode: string;
  fullname: string;
  dateOfBirth?: string;
  gradeLevel: string;
  schoolName?: string;
  lastScore?: number;
  note?: string;
  phone: string;
  gender: Gender;
  parentId?: number;
  status: StudentStatus;
}

export interface StudentWithParentUpsertRequest {
  student: StudentUpsertRequest;
  parent: {
    fullname: string;
    phone: string;
    email?: string;
    address?: string;
    relationship?: string;
  };
}

// ==========================================
// TEACHER
// ==========================================
export interface TeacherResponse {
  id: number;
  teacherCode: string;
  fullname: string;
  phone: string;
  email: string;
  teacherRole: TeacherRole;
  cccdImageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherUpsertRequest {
  teacherCode: string;
  fullname: string;
  phone: string;
  email?: string;
  teacherRole: TeacherRole;
  cccdImageUrl: string;
  isActive: boolean;
}

// ==========================================
// ROOM & SCHEDULE
// ==========================================
export interface RoomResponse {
  id: number;
  roomCode: string;
  name: string;
  capacity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomUpsertRequest {
  roomCode: string;
  name: string;
  capacity: number;
  description?: string;
}

export interface ScheduleSlotResponse {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

export interface ScheduleSlotUpsertRequest {
  name: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

// ==========================================
// ENROLLMENT & ATTENDANCE
// ==========================================
export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseClassId: number;
  className: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentCreateRequest {
  studentId: number;
  courseClassId: number;
  enrolledAt: string;
  status: EnrollmentStatus;
  note?: string;
}

export interface AttendanceResponse {
  id: number;
  courseClassId: number;
  className: string;
  studentId: number;
  studentName: string;
  attendanceDate: string;
  status: AttendanceStatus;
  note: string;
  recordedByUserId: number;
  recordedByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceCreateRequest {
  courseClassId: number;
  studentId: number;
  attendanceDate: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentAttendanceRowDto {
  studentId: number;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceBatchRequest {
  courseClassId: number;
  attendanceDate: string;
  attendances: StudentAttendanceRowDto[];
}

export interface AttendanceMatrixResponse {
  students: {
    id: number;
    fullname: string;
    studentCode: string;
  }[];
  dates: string[];
  matrix: Record<number, Record<string, AttendanceStatus>>;
  notes: Record<number, Record<string, string>>;
}

// ==========================================
// BILLING (INVOICE & PAYMENT)
// ==========================================
export interface InvoiceResponse {
  id: number;
  invoiceCode: string;
  studentId: number;
  studentName: string;
  courseClassId: number;
  className: string;
  billingMonth: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  status: InvoiceStatus;
  promotionId?: number;
  promotionName?: string;
  dueDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCreateRequest {
  invoiceCode: string;
  studentId: number;
  courseClassId: number;
  billingMonth: string;
  originalAmount: number;
  promotionId?: number;
  dueDate?: string;
  note?: string;
}

export interface PaymentResponse {
  id: number;
  invoiceId: number;
  invoiceCode: string;
  paymentCode: string;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  cashierUserId: number;
  cashierUsername: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCreateRequest {
  invoiceId: number;
  paymentCode: string;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  note?: string;
}

export interface PromotionResponse {
  id: number;
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionUpsertRequest {
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ==========================================
// LEARNING RESULT & LEAVE REQUEST
// ==========================================
export interface LearningResultResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseClassId: number;
  className: string;
  resultMonth: string;
  score: number;
  teacherComment: string;
  createdByUserId: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningResultCreateRequest {
  studentId: number;
  courseClassId: number;
  resultMonth: string;
  score: number;
  teacherComment?: string;
}

export interface LeaveRequestResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseClassId: number;
  className: string;
  leaveDate: string;
  reason: string;
  status: LeaveRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequestCreateRequest {
  studentId: number;
  courseClassId: number;
  leaveDate: string;
  reason: string;
}

// ==========================================
// DASHBOARD & STATS
// ==========================================
export interface DashboardStatsResponse {
  studentsCount: number;
  coursesCount: number;
  classesCount: number;
  currentMonthRevenue: number;
  unpaidInvoicesCount: number;
}

export interface MonthlyRevenueResponse {
  month: number;
  revenue: number;
}

export interface CourseRevenueResponse {
  courseName: string;
  revenue: number;
}

export interface StudentCard {
  studentId: number;
  studentCode: string;
  fullname: string;
  status: string;
  lastScore: number;
}

export interface InvoiceCard {
  id: number;
  invoiceCode: string;
  studentName: string;
  className: string;
  billingMonth: string;
  finalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  status: string;
  dueDate?: string;
}

export interface NotificationCard {
  id: number;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ParentDashboardResponse {
  parentId: number;
  parentName: string;
  username: string;
  students: StudentCard[];
  invoices: InvoiceCard[];
  notifications: NotificationCard[];
}
