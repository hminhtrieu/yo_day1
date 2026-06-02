import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachers, deleteTeacher } from '../api/teachers.api';
import type { TeacherResponse } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { TeacherFormModal } from '../components/TeacherFormModal';
import toast from 'react-hot-toast';

export const TeacherPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherResponse | undefined>(undefined);
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers', debouncedSearch],
    queryFn: () => getTeachers(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Đã xóa thành công');
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa');
      setDeleteId(null);
    }
  });

  const columns: Column<TeacherResponse>[] = [
    { key: 'teacherCode', header: 'Mã GV', render: (t) => <strong>{t.teacherCode}</strong> },
    { key: 'fullname', header: 'Họ và tên' },
    { key: 'phone', header: 'SĐT' },
    { key: 'teacherRole', header: 'Vai trò', render: (t) => t.teacherRole === 'TEACHER' ? 'Giáo viên' : t.teacherRole === 'ASSISTANT' ? 'Trợ giảng' : 'Cả hai' },
    { 
      key: 'isActive', 
      header: 'Trạng thái', 
      render: (t) => (
        <span className={`status-badge ${t.isActive ? 'status-active' : 'status-inactive'}`}>
          {t.isActive ? 'Đang làm' : 'Đã nghỉ'}
        </span>
      )
    },
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Giáo viên" 
        addLabel="Thêm Giáo viên"
        onAddClick={() => { setSelectedTeacher(undefined); setIsFormOpen(true); }}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
      ) : (
        <DataTable 
          data={teachers || []} 
          columns={columns} 
          keyExtractor={(t) => t.id}
          onEdit={(t) => { setSelectedTeacher(t); setIsFormOpen(true); }}
          onDelete={(t) => setDeleteId(t.id)}
        />
      )}

      {isFormOpen && (
        <TeacherFormModal teacher={selectedTeacher} onClose={() => setIsFormOpen(false)} />
      )}

      <ConfirmDialog 
        isOpen={deleteId !== null}
        title="Xóa Giáo viên"
        message="Bạn có chắc chắn muốn xóa giáo viên này không? Thao tác không thể hoàn tác!"
        onConfirm={() => deleteMutation.mutate(deleteId!)}
        onCancel={() => setDeleteId(null)}
        isDestructive
      />
    </div>
  );
};
