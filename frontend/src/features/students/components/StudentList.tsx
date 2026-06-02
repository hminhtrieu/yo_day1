import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { StudentResponse } from '../../../types/yoedu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent } from '../api/students.api';
import toast from 'react-hot-toast';

interface Props {
  students: StudentResponse[];
  onView: (student: StudentResponse) => void;
  onEdit: (student: StudentResponse) => void;
}

export const StudentList = ({ students, onView, onEdit }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Đã xóa học viên thành công');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa học viên');
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này không? Thao tác không thể hoàn tác!')) {
      deleteMutation.mutate(id);
    }
  };

  if (!students || students.length === 0) {
    return <div className="p-4 text-center">Không có dữ liệu học viên.</div>;
  }

  return (
    <div className="table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Mã HV</th>
            <th>Họ và Tên</th>
            <th>Giới tính</th>
            <th>Trường/Lớp</th>
            <th>Trạng thái</th>
            <th>Phụ huynh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st) => (
            <tr key={st.id}>
              <td style={{ fontWeight: 600 }}>{st.studentCode}</td>
              <td>{st.fullname}</td>
              <td>
                {st.gender === 'MALE' ? 'Nam' : st.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
              </td>
              <td>{st.schoolName ? `${st.schoolName} (${st.gradeLevel})` : st.gradeLevel}</td>
              <td>
                <span className={`status-badge status-${st.status.toLowerCase()}`}>
                  {st.status === 'ACTIVE' ? 'Đang học' : st.status === 'PAUSED' ? 'Bảo lưu' : 'Đã nghỉ'}
                </span>
              </td>
              <td>{st.parent?.fullname || '-'}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon btn-view" onClick={() => onView(st)} title="Xem chi tiết">
                    <Eye size={18} />
                  </button>
                  <button className="btn-icon btn-edit" onClick={() => onEdit(st)} title="Sửa">
                    <Pencil size={18} />
                  </button>
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(st.id)} title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
