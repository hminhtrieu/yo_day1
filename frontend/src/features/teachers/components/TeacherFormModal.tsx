import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeacher, updateTeacher } from '../api/teachers.api';
import type { TeacherResponse } from '../../../types/yoedu';
import { FormField } from '../../../components/common/FormField';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const teacherSchema = z.object({
  teacherCode: z.string().min(2, 'Mã GV quá ngắn'),
  fullname: z.string().min(2, 'Tên GV quá ngắn'),
  phone: z.string().regex(/^(84|0[35789])+([0-9]{8})$/, 'SĐT không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  teacherRole: z.enum(['TEACHER', 'ASSISTANT', 'BOTH']),
  cccdImageUrl: z.string().optional(),
  isActive: z.number().min(0).max(1)
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface Props {
  teacher?: TeacherResponse;
  onClose: () => void;
}

export const TeacherFormModal = ({ teacher, onClose }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!teacher;

  const { register, handleSubmit, formState: { errors } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      teacherCode: teacher?.teacherCode || '',
      fullname: teacher?.fullname || '',
      phone: teacher?.phone || '',
      email: teacher?.email || '',
      teacherRole: teacher?.teacherRole || 'TEACHER',
      cccdImageUrl: teacher?.cccdImageUrl || '',
      isActive: teacher?.isActive ? 1 : (isEdit ? 0 : 1)
    }
  });

  const mutation = useMutation({
    mutationFn: (data: TeacherFormData) => {
      const payload = { ...data, isActive: data.isActive === 1, cccdImageUrl: data.cccdImageUrl || 'https://via.placeholder.com/150' };
      if (isEdit) {
        return updateTeacher(teacher.id, payload);
      }
      return createTeacher(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success(isEdit ? 'Đã cập nhật Giáo viên' : 'Đã thêm Giáo viên mới');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>{isEdit ? 'Sửa Giáo viên' : 'Thêm Giáo viên mới'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="modal-body">
            <div className="form-grid">
              
              <FormField label="Mã Giáo viên *" {...register('teacherCode')} error={errors.teacherCode} />
              <FormField label="Họ và tên *" {...register('fullname')} error={errors.fullname} />
              
              <FormField label="Số điện thoại *" {...register('phone')} error={errors.phone} />
              <FormField label="Email" type="email" {...register('email')} error={errors.email} />

              <FormField label="Vai trò *" as="select" {...register('teacherRole')} error={errors.teacherRole} options={[
                { value: 'TEACHER', label: 'Giáo viên' }, 
                { value: 'ASSISTANT', label: 'Trợ giảng' }, 
                { value: 'BOTH', label: 'Cả hai' }
              ]} />
              <FormField label="Trạng thái *" as="select" {...register('isActive', { valueAsNumber: true })} error={errors.isActive} options={[
                { value: 1, label: 'Đang làm việc' }, { value: 0, label: 'Đã nghỉ' }
              ]} />

              <FormField label="URL CCCD" fullWidth {...register('cccdImageUrl')} error={errors.cccdImageUrl} placeholder="Link ảnh CCCD..." />

            </div>
          </div>
          
          <div className="modal-footer" style={{ marginTop: 'auto' }}>
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
