import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getMonthlyRevenue, getCourseRevenue } from '../api/reports.api';
import { Users, BookOpen, Layers, DollarSign, FileText } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

export const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  const { data: monthlyRevenue } = useQuery({
    queryKey: ['monthlyRevenue', selectedYear],
    queryFn: () => getMonthlyRevenue(selectedYear)
  });

  const { data: courseRevenue } = useQuery({
    queryKey: ['courseRevenue', selectedYear],
    queryFn: () => getCourseRevenue(selectedYear)
  });

  const monthlyData = (monthlyRevenue || []).map(item => ({
    name: `Tháng ${item.month}`,
    DoanhThu: item.revenue
  }));

  const pieData = (courseRevenue || []).map(item => ({
    name: item.courseName,
    value: item.revenue
  }));

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Tổng quan hệ thống</h1>
          <p style={{ color: '#64748b', margin: 0, marginTop: '0.25rem' }}>Thống kê và báo cáo hoạt động YOEDU.</p>
        </div>
        <div>
          <select 
            style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', outline: 'none' }}
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>Học viên</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, marginTop: '0.25rem' }}>{stats?.studentsCount || 0}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>Khóa học</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, marginTop: '0.25rem' }}>{stats?.coursesCount || 0}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>Lớp học</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, marginTop: '0.25rem' }}>{stats?.classesCount || 0}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef9c3', color: '#ca8a04', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>DT Tháng này</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, marginTop: '0.25rem' }}>{(stats?.currentMonthRevenue || 0).toLocaleString('vi-VN')}đ</h3>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>Hóa đơn chưa thu</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, marginTop: '0.25rem' }}>{stats?.unpaidInvoicesCount || 0}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: '#1e293b' }}>Biểu đồ doanh thu năm {selectedYear}</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val: number) => `${val / 1000000}M`} />
                  <RechartsTooltip formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')}đ`, 'Doanh thu']} />
                  <Legend />
                  <Bar dataKey="DoanhThu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: '#1e293b' }}>Cơ cấu theo Khóa học</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {pieData.length > 0 && pieData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')}đ`, 'Doanh thu']} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: '#6b7280' }}>
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
