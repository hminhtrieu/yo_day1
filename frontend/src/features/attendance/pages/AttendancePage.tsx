import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendancesByClassId, createAttendanceBatch, getAttendanceMatrix } from '../api/attendance.api';
import { getCourseClasses } from '../../courseClasses/api/courseClasses.api';
import { getEnrollmentsByClassId } from '../../enrollments/api/enrollments.api';
import type { AttendanceStatus, StudentAttendanceRowDto } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import toast from 'react-hot-toast';

export const AttendancePage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'DAILY' | 'MATRIX'>('DAILY');
  
  const [selectedClassId, setSelectedClassId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Form State for Daily Attendance
  const [attendanceData, setAttendanceData] = useState<Record<number, StudentAttendanceRowDto>>({});

  const { data: classes } = useQuery({ queryKey: ['classes'], queryFn: getCourseClasses });

  const { data: enrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['enrollments', 'class', selectedClassId],
    queryFn: () => getEnrollmentsByClassId(selectedClassId),
    enabled: selectedClassId > 0 && activeTab === 'DAILY'
  });

  const { data: existingAttendances } = useQuery({
    queryKey: ['attendances', 'class', selectedClassId],
    queryFn: () => getAttendancesByClassId(selectedClassId),
    enabled: selectedClassId > 0 && activeTab === 'DAILY'
  });

  const { data: matrixData, isLoading: loadingMatrix } = useQuery({
    queryKey: ['attendanceMatrix', selectedClassId],
    queryFn: () => getAttendanceMatrix(selectedClassId),
    enabled: selectedClassId > 0 && activeTab === 'MATRIX'
  });

  const batchMutation = useMutation({
    mutationFn: createAttendanceBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances', 'class', selectedClassId] });
      queryClient.invalidateQueries({ queryKey: ['attendanceMatrix', selectedClassId] });
      toast.success('Đã lưu điểm danh thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi khi lưu điểm danh');
    }
  });

  // Khởi tạo data điểm danh khi load xong học viên và dữ liệu điểm danh cũ
  useEffect(() => {
    if (enrollments && Array.isArray(enrollments)) {
      const initialData: Record<number, StudentAttendanceRowDto> = {};
      
      const todayAttendances = Array.isArray(existingAttendances) 
        ? existingAttendances.filter(a => a.attendanceDate === selectedDate)
        : [];

      enrollments.forEach(en => {
        // Find if already attended
        const existing = todayAttendances.find(a => a.studentId === en.studentId);
        initialData[en.studentId] = {
          studentId: en.studentId,
          status: existing ? existing.status : 'PRESENT', // default to PRESENT
          note: existing ? existing.note || '' : ''
        };
      });
      setAttendanceData(initialData);
    }
  }, [enrollments, existingAttendances, selectedDate]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note }
    }));
  };

  const handleSaveBatch = () => {
    if (selectedClassId === 0) return toast.error('Vui lòng chọn lớp học');
    if (!selectedDate) return toast.error('Vui lòng chọn ngày điểm danh');
    
    const attendances = Object.values(attendanceData);
    if (attendances.length === 0) return toast.error('Không có học viên nào để điểm danh');

    batchMutation.mutate({
      courseClassId: selectedClassId,
      attendanceDate: selectedDate,
      attendances
    });
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT': return <span className="status-badge status-active" title="Có mặt">V</span>;
      case 'ABSENT': return <span className="status-badge status-inactive" title="Vắng mặt">X</span>;
      case 'LATE': return <span className="status-badge" style={{ background: '#fef08a', color: '#854d0e' }} title="Đi trễ">T</span>;
      case 'EXCUSED': return <span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }} title="Có phép">P</span>;
      default: return <span>-</span>;
    }
  };

  return (
    <div className="course-page-container">
      <PageHeader title="Điểm danh Học viên" />

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('DAILY')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            color: activeTab === 'DAILY' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'DAILY' ? '2px solid #2563eb' : '2px solid transparent'
          }}
        >
          Điểm danh Hàng ngày
        </button>
        <button 
          onClick={() => setActiveTab('MATRIX')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            color: activeTab === 'MATRIX' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'MATRIX' ? '2px solid #2563eb' : '2px solid transparent'
          }}
        >
          Ma trận Điểm danh
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Chọn Lớp học:</label>
          <select 
            className="form-control"
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          >
            <option value={0}>-- Vui lòng chọn lớp học --</option>
            {(classes || []).map(c => (
              <option key={c.id} value={c.id}>{c.classCode} - {c.name}</option>
            ))}
          </select>
        </div>
        
        {activeTab === 'DAILY' && (
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ngày điểm danh:</label>
            <input 
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>
        )}
      </div>

      {!selectedClassId ? (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
          Vui lòng chọn lớp học để xem dữ liệu.
        </div>
      ) : activeTab === 'DAILY' ? (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          {loadingEnrollments ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải danh sách học viên...</div>
          ) : !enrollments || enrollments.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Lớp học này chưa có học viên nào ghi danh.</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Mã HV</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Tên Học viên</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Có mặt</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Vắng mặt</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Đi trễ</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Có phép</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(en => {
                      const rowData = attendanceData[en.studentId];
                      if (!rowData) return null;
                      
                      return (
                        <tr key={en.studentId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '1rem' }}>{en.studentId}</td>
                          <td style={{ padding: '1rem', fontWeight: 500 }}>{en.studentName}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <input type="radio" name={`status-${en.studentId}`} checked={rowData.status === 'PRESENT'} onChange={() => handleStatusChange(en.studentId, 'PRESENT')} />
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <input type="radio" name={`status-${en.studentId}`} checked={rowData.status === 'ABSENT'} onChange={() => handleStatusChange(en.studentId, 'ABSENT')} />
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <input type="radio" name={`status-${en.studentId}`} checked={rowData.status === 'LATE'} onChange={() => handleStatusChange(en.studentId, 'LATE')} />
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <input type="radio" name={`status-${en.studentId}`} checked={rowData.status === 'EXCUSED'} onChange={() => handleStatusChange(en.studentId, 'EXCUSED')} />
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <input 
                              type="text" 
                              className="form-control"
                              value={rowData.note || ''} 
                              onChange={(e) => handleNoteChange(en.studentId, e.target.value)}
                              style={{ width: '100%', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                              placeholder="Ghi chú..."
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '1rem', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleSaveBatch}
                  disabled={batchMutation.isPending}
                >
                  {batchMutation.isPending ? 'Đang lưu...' : 'Lưu Điểm danh'}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          {loadingMatrix ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải ma trận...</div>
          ) : !matrixData || !matrixData.students || matrixData.students.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Chưa có dữ liệu điểm danh nào cho lớp này.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, position: 'sticky', left: 0, background: '#f8fafc', zIndex: 10 }}>Học viên</th>
                    {matrixData.dates.map((date: string) => (
                      <th key={date} style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, minWidth: '100px' }}>
                        {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixData.students.map((student: any) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', fontWeight: 500, position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>
                        {student.studentCode} - {student.fullname}
                      </td>
                      {matrixData.dates.map((date: string) => {
                        const status = matrixData.matrix[student.id]?.[date];
                        const note = matrixData.notes?.[student.id]?.[date];
                        return (
                          <td key={date} style={{ padding: '1rem', textAlign: 'center' }}>
                            {status ? (
                              <div title={note || ''}>
                                {getStatusBadge(status)}
                              </div>
                            ) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
