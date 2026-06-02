import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEnrollment } from '../api/enrollments.api';
import { getStudents } from '../../students/api/students.api';
import { getCourseClasses } from '../../courseClasses/api/courseClasses.api';
import { FormField } from '../../../components/common/FormField';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const enrollmentSchema = z.object({
  studentId: z.number().min(1, 'Vui lòng chọn học viên'),
  courseClassId: z.number().min(1, 'Vui lòng chọn lớp học'),
  enrolledAt: z.string().min(1, 'Vui lòng chọn ngày ghi danh'),
  status: z.enum(['ACTIVE', 'PAUSED', 'DROPPED', 'COMPLETED']),
  note: z.string().optional()
});

type FormData = z.infer<typeof enrollmentSchema>;

interface Props {
  onClose: () => void;
}

export const EnrollmentFormModal = ({ onClose }: Props) => {
  const queryClient = useQueryClient();

  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => getStudents('') });
  const { data: classes } = useQuery({ queryKey: ['classes'], queryFn: getCourseClasses });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: 0,
      courseClassId: 0,
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      note: ''
    }
  });

  const mutation = useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Đã ghi danh thành công');
      onClose();
    },
    onError: (err: any) => {
      // Vì API có thể chưa có, báo lỗi rõ ràng nếu 404
      if (err?.response?.status === 404) {
        toast.error('Chức năng Ghi danh đang bảo trì (Lỗi 404 - Chưa có API)');
      } else {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  });

  const studentOptions = [{ value: 0, label: '-- Chọn học viên --' }].concat(
    (students || []).map(s => ({ value: s.id, label: `${s.studentCode} - ${s.fullname}` }))
  );
  
  const classOptions = [{ value: 0, label: '-- Chọn lớp học --' }].concat(
    (classes || []).map(c => ({ value: c.id, label: `${c.classCode} - ${c.name}` }))
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Thêm Ghi danh mới</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className="modal-body">
            <div className="form-grid">
              
              <FormField label="Học viên *" as="select" {...register('studentId', { valueAsNumber: true })} error={errors.studentId} options={studentOptions} fullWidth />
              <FormField label="Lớp học *" as="select" {...register('courseClassId', { valueAsNumber: true })} error={errors.courseClassId} options={classOptions} fullWidth />
              
              <FormField label="Ngày ghi danh *" type="date" {...register('enrolledAt')} error={errors.enrolledAt} />
              <FormField label="Trạng thái *" as="select" {...register('status')} error={errors.status} options={[
                { value: 'ACTIVE', label: 'Đang học' },
                { value: 'PAUSED', label: 'Bảo lưu' },
                { value: 'DROPPED', label: 'Nghỉ học' },
                { value: 'COMPLETED', label: 'Hoàn thành' }
              ]} />
              
              <FormField label="Ghi chú" as="textarea" rows={3} fullWidth {...register('note')} error={errors.note} />

            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Ghi danh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
