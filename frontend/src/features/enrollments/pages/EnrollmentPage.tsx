import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEnrollmentsByClassId, getEnrollmentsByStudentId } from '../api/enrollments.api';
import { getCourseClasses } from '../../courseClasses/api/courseClasses.api';
import { getStudents } from '../../students/api/students.api';
import type { EnrollmentResponse } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { EnrollmentFormModal } from '../components/EnrollmentFormModal';

export const EnrollmentPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CLASS' | 'STUDENT'>('CLASS');
  const [selectedClassId, setSelectedClassId] = useState<number>(0);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

  const { data: classes } = useQuery({ queryKey: ['classes'], queryFn: getCourseClasses });
  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => getStudents('') });

  const { data: enrollmentsByClass, isLoading: loadingByClass, isError: errorByClass } = useQuery({
    queryKey: ['enrollments', 'class', selectedClassId],
    queryFn: () => getEnrollmentsByClassId(selectedClassId),
    enabled: selectedClassId > 0,
    retry: false 
  });

  const { data: enrollmentsByStudent, isLoading: loadingByStudent, isError: errorByStudent } = useQuery({
    queryKey: ['enrollments', 'student', selectedStudentId],
    queryFn: () => getEnrollmentsByStudentId(selectedStudentId),
    enabled: selectedStudentId > 0,
    retry: false 
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="status-badge status-active">Đang học</span>;
      case 'PAUSED': return <span className="status-badge" style={{ background: '#fef08a', color: '#854d0e' }}>Bảo lưu</span>;
      case 'COMPLETED': return <span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Hoàn thành</span>;
      case 'DROPPED': return <span className="status-badge status-inactive">Nghỉ học</span>;
      default: return <span>{status}</span>;
    }
  }

  const columnsByClass: Column<EnrollmentResponse>[] = [
    { key: 'studentName', header: 'Học viên', render: (e) => <strong>{e.studentName}</strong> },
    { key: 'enrolledAt', header: 'Ngày ghi danh', render: (e) => new Date(e.enrolledAt).toLocaleDateString('vi-VN') },
    { key: 'status', header: 'Trạng thái', render: (e) => getStatusBadge(e.status) },
    { key: 'note', header: 'Ghi chú' }
  ];

  const columnsByStudent: Column<EnrollmentResponse>[] = [
    { key: 'className', header: 'Lớp học', render: (e) => <strong>{e.className}</strong> },
    { key: 'enrolledAt', header: 'Ngày ghi danh', render: (e) => new Date(e.enrolledAt).toLocaleDateString('vi-VN') },
    { key: 'status', header: 'Trạng thái', render: (e) => getStatusBadge(e.status) },
    { key: 'note', header: 'Ghi chú' }
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Ghi danh" 
        addLabel="Thêm Ghi danh"
        onAddClick={() => setIsFormOpen(true)}
      />

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('CLASS')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            color: activeTab === 'CLASS' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'CLASS' ? '2px solid #2563eb' : '2px solid transparent'
          }}
        >
          Xem theo Lớp học
        </button>
        <button 
          onClick={() => setActiveTab('STUDENT')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            color: activeTab === 'STUDENT' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'STUDENT' ? '2px solid #2563eb' : '2px solid transparent'
          }}
        >
          Xem theo Học viên
        </button>
      </div>

      {(errorByClass || errorByStudent) && (
        <div style={{ padding: '1rem', marginBottom: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px' }}>
          Lỗi khi lấy dữ liệu: Vui lòng đảm bảo bạn đã RESTART Backend (Spring Boot) sau khi API được cập nhật! (Kiểm tra log F12 ở trình duyệt để xem mã lỗi).
        </div>
      )}

      {activeTab === 'CLASS' ? (
        <div>
          <div style={{ marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Chọn Lớp học để xem danh sách Học viên:</label>
            <select 
              className="form-control"
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              style={{ width: '100%', maxWidth: '400px', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            >
              <option value={0}>-- Vui lòng chọn lớp học --</option>
              {(classes || []).map(c => (
                <option key={c.id} value={c.id}>{c.classCode} - {c.name}</option>
              ))}
            </select>
          </div>

          {selectedClassId > 0 && (
            loadingByClass ? <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div> :
            <DataTable 
              data={Array.isArray(enrollmentsByClass) ? enrollmentsByClass : []} 
              columns={columnsByClass} 
              keyExtractor={(e) => e.id}
            />
          )}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Chọn Học viên để xem các Lớp đang học:</label>
            <select 
              className="form-control"
              value={selectedStudentId} 
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              style={{ width: '100%', maxWidth: '400px', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            >
              <option value={0}>-- Vui lòng chọn học viên --</option>
              {(students || []).map(s => (
                <option key={s.id} value={s.id}>{s.studentCode} - {s.fullname}</option>
              ))}
            </select>
          </div>

          {selectedStudentId > 0 && (
            loadingByStudent ? <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div> :
            <DataTable 
              data={Array.isArray(enrollmentsByStudent) ? enrollmentsByStudent : []} 
              columns={columnsByStudent} 
              keyExtractor={(e) => e.id}
            />
          )}
        </div>
      )}

      {isFormOpen && (
        <EnrollmentFormModal onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};
