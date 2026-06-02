import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { CoursePage } from '../features/courses/pages/CoursePage';
import { StudentPage } from '../features/students/pages/StudentPage';
import { TeacherPage } from '../features/teachers/pages/TeacherPage';
import { RoomPage } from '../features/rooms/pages/RoomPage';
import { CourseClassPage } from '../features/courseClasses/pages/CourseClassPage';
import { EnrollmentPage } from '../features/enrollments/pages/EnrollmentPage';
import { AttendancePage } from '../features/attendance/pages/AttendancePage';
import { BillingPage } from '../features/billing/pages/BillingPage';
import { PaymentPage } from '../features/billing/pages/PaymentPage';
import { Login } from '../features/auth/routes/Login';
import { Dashboard } from '../features/dashboard/routes/Dashboard';
import { ParentDashboardPage } from '../features/parent/pages/ParentDashboardPage';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../features/auth/api/auth';
import { Navigate } from 'react-router-dom';
import { RoleGuard } from '../components/common/RoleGuard';

const RoleBasedDashboard = () => {
  const { data: user, isLoading } = useQuery({ queryKey: ['me'], queryFn: getMe });
  if (isLoading) return <div>Đang tải...</div>;
  if (user?.role === 'PARENT') {
    return <Navigate to="/parent" replace />;
  }
  return <Dashboard />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <RoleBasedDashboard />,
      },
      {
        path: 'parent',
        element: (
          <RoleGuard allowedRoles={['PARENT', 'ADMIN']}>
            <ParentDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: 'courses',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <CoursePage />
          </RoleGuard>
        ),
      },
      {
        path: 'students',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <StudentPage />
          </RoleGuard>
        ),
      },
      {
        path: 'teachers',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <TeacherPage />
          </RoleGuard>
        ),
      },
      {
        path: 'rooms',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <RoomPage />
          </RoleGuard>
        ),
      },
      {
        path: 'classes',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <CourseClassPage />
          </RoleGuard>
        ),
      },
      {
        path: 'enrollments',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <EnrollmentPage />
          </RoleGuard>
        ),
      },
      {
        path: 'attendance',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'ACADEMIC_STAFF']}>
            <AttendancePage />
          </RoleGuard>
        ),
      },
      {
        path: 'billing',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'CASHIER']}>
            <BillingPage />
          </RoleGuard>
        ),
      },
      {
        path: 'payments',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'CASHIER']}>
            <PaymentPage />
          </RoleGuard>
        ),
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
