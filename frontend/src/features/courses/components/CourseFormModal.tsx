import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse, updateCourse } from '../api/courses.api';
import type { CourseResponse } from '../../../types/yoedu';
import { FormField } from '../../../components/common/FormField';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/Course.css';

const courseSchema = z.object({
  courseCode: z.string().min(2, 'Mã KH phải từ 2-10 ký tự').max(10),
  name: z.string().min(2, 'Tên KH phải từ 2-20 ký tự').max(20),
  decsciption: z.string().max(500).optional(),
  tuitionFee: z.number().min(0, 'Học phí phải >= 0'),
  totalSessions: z.number().min(1, 'Số buổi phải >= 1'),
  isActive: z.number().min(0).max(1)
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Props {
  course?: CourseResponse;
  onClose: () => void;
}

export const CourseFormModal = ({ course, onClose }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!course;

  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: course?.courseCode || '',
      name: course?.name || '',
      decsciption: course?.decsciption || '',
      tuitionFee: course?.tuitionFee || 0,
      totalSessions: course?.totalSessions || 1,
      isActive: course?.isActive ?? 1
    }
  });

  const mutation = useMutation({
    mutationFn: (data: CourseFormData) => {
      return isEdit ? updateCourse(course.id, data) : createCourse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success(isEdit ? 'Đã cập nhật khóa học' : 'Đã thêm khóa học mới');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu khóa học');
    }
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? 'Sửa Khóa học' : 'Thêm Khóa học mới'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className="modal-body">
            <div className="form-grid">
              
              <FormField label="Mã Khóa học *" {...register('courseCode')} error={errors.courseCode} placeholder="VD: ENG01" />
              <FormField label="Tên Khóa học *" {...register('name')} error={errors.name} placeholder="VD: Tiếng Anh giao tiếp" />
              <FormField label="Học phí (VNĐ) *" type="number" {...register('tuitionFee', { valueAsNumber: true })} error={errors.tuitionFee} />
              <FormField label="Số buổi học *" type="number" {...register('totalSessions', { valueAsNumber: true })} error={errors.totalSessions} />
              
              <FormField label="Mô tả" as="textarea" rows={3} fullWidth {...register('decsciption')} error={errors.decsciption} placeholder="Mô tả chi tiết khóa học..." />
              
              <FormField label="Trạng thái *" as="select" {...register('isActive', { valueAsNumber: true })} error={errors.isActive} options={[
                { value: 1, label: 'Hoạt động' }, { value: 0, label: 'Tạm dừng' }
              ]} />

            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
