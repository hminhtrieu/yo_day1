import { useQuery } from '@tanstack/react-query';
import { getParentDashboard } from '../api/parent.api';
import { CreditCard, Bell, User } from 'lucide-react';

export const ParentDashboardPage = () => {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['parentDashboard'],
    queryFn: getParentDashboard
  });

  if (isLoading) return <div className="p-4">Đang tải...</div>;
  if (error || !dashboard) return <div className="p-4 text-red-500">Có lỗi xảy ra khi tải dữ liệu phụ huynh.</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>
          Xin chào Phụ huynh {dashboard.parentName}!
        </h1>
        <p style={{ color: '#64748b' }}>Cổng thông tin quản lý học viên</p>
      </div>

      {/* Học viên */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#334155' }}>
          <User size={20} /> Danh sách con em
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {dashboard.students.map((student: any) => (
            <div key={student.studentId} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>{student.fullname}</h3>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Mã: {student.studentCode}</span>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '9999px',
                    ...(student.status === 'ACTIVE' 
                      ? { backgroundColor: '#dcfce7', color: '#15803d' } 
                      : { backgroundColor: '#f1f5f9', color: '#334155' })
                  }}>
                    {student.status === 'ACTIVE' ? 'Đang học' : 'Đã nghỉ/Bảo lưu'}
                  </span>
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
                    Điểm kiểm tra gần nhất: <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{student.lastScore || 'Chưa có'}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
          {dashboard.students.length === 0 && <p>Chưa có học viên nào.</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Hóa đơn */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#334155' }}>
            <CreditCard size={20} /> Hóa đơn học phí
          </h2>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div>
              {dashboard.invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="data-table w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Học viên</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Tháng</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Số tiền</th>
                        <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.invoices.map((inv: any) => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem' }}>{inv.studentName}</td>
                          <td style={{ padding: '0.75rem' }}>{inv.billingMonth}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{inv.finalAmount.toLocaleString('vi-VN')}đ</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold',
                              ...(inv.status === 'PAID' ? { backgroundColor: '#dcfce7', color: '#15803d' } :
                                inv.status === 'UNPAID' ? { backgroundColor: '#fee2e2', color: '#b91c1c' } :
                                { backgroundColor: '#fef3c7', color: '#b45309' })
                            }}>
                              {inv.status === 'PAID' ? 'Đã thu' : inv.status === 'UNPAID' ? 'Chưa thu' : 'Thu 1 phần'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Chưa có hóa đơn nào</div>
              )}
            </div>
          </div>
        </div>

        {/* Thông báo */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#334155' }}>
            <Bell size={20} /> Thông báo
          </h2>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div>
              {dashboard.notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {dashboard.notifications.map((noti: any, index: number) => (
                    <div key={noti.id} style={{ 
                      padding: '1rem', 
                      backgroundColor: !noti.isRead ? '#eff6ff' : 'transparent',
                      borderBottom: index < dashboard.notifications.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{noti.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(noti.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>{noti.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Không có thông báo mới</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
