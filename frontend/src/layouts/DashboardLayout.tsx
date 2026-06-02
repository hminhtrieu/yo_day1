import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, UserCheck, LogOut, Menu, Monitor, Layers, ClipboardCheck, DollarSign, FileText } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../features/auth/api/auth';
import { Toaster } from 'react-hot-toast';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="logo-text">YOEDU</h2>
        </div>
        
        <nav className="sidebar-nav">
          {user?.role === 'PARENT' && (
            <Link to="/parent" className="nav-item">
              <Home size={20} />
              <span>Tổng quan</span>
            </Link>
          )}

          {user?.role !== 'PARENT' && (
            <Link to="/" className="nav-item">
              <Home size={20} />
              <span>Tổng quan</span>
            </Link>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'ACADEMIC_STAFF') && (
            <>
              <Link to="/courses" className="nav-item">
                <BookOpen size={20} />
                <span>Khóa học</span>
              </Link>
              <Link to="/classes" className="nav-item">
                <Layers size={20} />
                <span>Lớp học</span>
              </Link>
              <Link to="/students" className="nav-item">
                <Users size={20} />
                <span>Học viên</span>
              </Link>
              <Link to="/teachers" className="nav-item">
                <UserCheck size={20} />
                <span>Giáo viên</span>
              </Link>
              <Link to="/rooms" className="nav-item">
                <Monitor size={20} />
                <span>Phòng học</span>
              </Link>
              <Link to="/enrollments" className="nav-item">
                <ClipboardCheck size={20} />
                <span>Ghi danh</span>
              </Link>
              <Link to="/attendance" className="nav-item">
                <UserCheck size={20} />
                <span>Điểm danh</span>
              </Link>
            </>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'CASHIER') && (
            <>
              <Link to="/billing" className="nav-item">
                <FileText size={20} />
                <span>Hóa đơn</span>
              </Link>
              <Link to="/payments" className="nav-item">
                <DollarSign size={20} />
                <span>Phiếu thu</span>
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-header">
          <button 
            className="menu-toggle-btn" 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="avatar" style={{ backgroundColor: '#3b82f6', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.fullname ? user.fullname.substring(0, 2).toUpperCase() : (user?.username || '..').substring(0, 2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>{user?.fullname || user?.username || 'Đang tải...'}</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user?.username} - {user?.role}</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
