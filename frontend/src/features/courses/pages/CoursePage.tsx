import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, deleteCourse } from '../api/courses.api';
import { CourseFormModal } from '../components/CourseFormModal';
import type { CourseResponse } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import '../styles/Course.css';

export const CoursePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseResponse | undefined>(undefined);
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', debouncedSearch],
    queryFn: () => getCourses(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Đã xóa thành công');
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa khóa học. Có thể khóa học đang được sử dụng.');
      setDeleteId(null);
    }
  });

  const columns: Column<CourseResponse>[] = [
    { key: 'courseCode', header: 'Mã KH', render: (c) => <strong>{c.courseCode}</strong> },
    { key: 'name', header: 'Tên khóa học' },
    { key: 'tuitionFee', header: 'Học phí', render: (c) => `${c.tuitionFee.toLocaleString('vi-VN')} đ` },
    { key: 'totalSessions', header: 'Số buổi' },
    { 
      key: 'isActive', 
      header: 'Trạng thái', 
      render: (c) => (
        <span className={`status-badge ${c.isActive ? 'status-active' : 'status-inactive'}`}>
          {c.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </span>
      )
    },
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Khóa học" 
        addLabel="Thêm Khóa học"
        onAddClick={() => { setEditingCourse(undefined); setIsModalOpen(true); }}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : (
        <DataTable 
          data={courses || []} 
          columns={columns} 
          keyExtractor={(c) => c.id}
          onEdit={(c) => { setEditingCourse(c); setIsModalOpen(true); }}
          onDelete={(c) => setDeleteId(c.id)}
        />
      )}

      {isModalOpen && (
        <CourseFormModal 
          course={editingCourse} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      <ConfirmDialog 
        isOpen={deleteId !== null}
        title="Xóa Khóa học"
        message="Bạn có chắc chắn muốn xóa khóa học này không? Thao tác không thể hoàn tác!"
        onConfirm={() => deleteMutation.mutate(deleteId!)}
        onCancel={() => setDeleteId(null)}
        isDestructive
      />
    </div>
  );
};
