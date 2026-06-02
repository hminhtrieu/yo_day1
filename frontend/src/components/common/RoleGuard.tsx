import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation } from 'react-router-dom';
import { getMe } from '../../features/auth/api/auth';
import type { UserRole } from '../../types/api';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { data: user, isLoading } = useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });
  const location = useLocation();

  if (isLoading) {
    return <div className="p-4">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'PARENT') {
      return <Navigate to="/parent" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
