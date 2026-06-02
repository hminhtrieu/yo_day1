import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseClasses, deleteCourseClass } from '../api/courseClasses.api';
import type { CourseClassResponse } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { CourseClassFormModal } from '../components/CourseClassFormModal';
import toast from 'react-hot-toast';

export const CourseClassPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CourseClassResponse | undefined>(undefined);
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: getCourseClasses,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourseClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Đã xóa thành công');
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa lớp');
      setDeleteId(null);
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="status-badge status-active">Mở đăng ký</span>;
      case 'ONGOING': return <span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Đang diễn ra</span>;
      case 'FULL': return <span className="status-badge" style={{ background: '#fef08a', color: '#854d0e' }}>Đã đầy</span>;
      case 'CLOSED': return <span className="status-badge status-inactive">Đã đóng</span>;
      default: return <span>{status}</span>;
    }
  }

  const columns: Column<CourseClassResponse>[] = [
    { key: 'classCode', header: 'Mã lớp', render: (c) => <strong>{c.classCode}</strong> },
    { key: 'name', header: 'Tên lớp' },
    { key: 'course', header: 'Khóa học', render: (c) => c.course?.name || '-' },
    { key: 'room', header: 'Phòng & Ca', render: (c) => 
      <div>
        <div>Phòng: {c.room?.name || '-'}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Ca: {c.slot?.name || `Slot ${c.slot?.id}`}</div>
      </div> 
    },
    { key: 'teachers', header: 'Giáo viên', render: (c) => 
      <div>
        <div>{c.mainTeacher?.fullname || '-'}</div>
        {c.assistantTeacher && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Trợ giảng: {c.assistantTeacher.fullname}</div>}
      </div> 
    },
    { key: 'status', header: 'Trạng thái', render: (c) => getStatusBadge(c.status) },
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Lớp học" 
        addLabel="Thêm Lớp học"
        onAddClick={() => { setSelectedClass(undefined); setIsFormOpen(true); }}
      />

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
      ) : (
        <DataTable 
          data={classes || []} 
          columns={columns} 
          keyExtractor={(c) => c.id}
          onEdit={(c) => { setSelectedClass(c); setIsFormOpen(true); }}
          onDelete={(c) => setDeleteId(c.id)}
        />
      )}

      {isFormOpen && (
        <CourseClassFormModal courseClass={selectedClass} onClose={() => setIsFormOpen(false)} />
      )}

      <ConfirmDialog 
        isOpen={deleteId !== null}
        title="Xóa Lớp học"
        message="Bạn có chắc chắn muốn xóa lớp học này không? Thao tác không thể hoàn tác!"
        onConfirm={() => deleteMutation.mutate(deleteId!)}
        onCancel={() => setDeleteId(null)}
        isDestructive
      />
    </div>
  );
};
