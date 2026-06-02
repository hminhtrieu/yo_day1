import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent, updateStudent } from '../api/students.api';
import { createParent, updateParent } from '../../parent/api/parent.api';
import type { StudentResponse, Gender, StudentStatus } from '../../../types/yoedu';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const studentSchema = z.object({
  // Student Info
  studentCode: z.string().min(2, 'Mã HV quá ngắn'),
  fullname: z.string().min(2, 'Tên HV quá ngắn'),
  dateOfBirth: z.string().optional(),
  gradeLevel: z.string().min(1, 'Bắt buộc nhập khối lớp'),
  schoolName: z.string().optional(),
  phone: z.string().regex(/^(84|0[35789])+([0-9]{8})$/, 'SĐT không hợp lệ'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  status: z.enum(['ACTIVE', 'PAUSED', 'DROPPED']),
  note: z.string().optional(),

  // Parent Info
  parentFullname: z.string().min(2, 'Tên PH quá ngắn'),
  parentPhone: z.string().regex(/^(84|0[35789])+([0-9]{8})$/, 'SĐT không hợp lệ'),
  parentEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  parentAddress: z.string().optional(),
  parentRelationship: z.string().optional()
});

type StudentFormData = z.infer<typeof studentSchema>;

interface Props {
  student?: StudentResponse; // Edit Mode
  onClose: () => void;
}

export const StudentFormModal = ({ student, onClose }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!student;

  const { register, handleSubmit, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentCode: student?.studentCode || '',
      fullname: student?.fullname || '',
      dateOfBirth: student?.dateOfBirth || '',
      gradeLevel: student?.gradeLevel || '',
      schoolName: student?.schoolName || '',
      phone: student?.phone || '',
      gender: student?.gender || 'OTHER',
      status: student?.status || 'ACTIVE',
      note: student?.note || '',
      
      parentFullname: student?.parent?.fullname || '',
      parentPhone: student?.parent?.phone || '',
      parentEmail: student?.parent?.email || '',
      parentAddress: student?.parent?.address || '',
      parentRelationship: student?.parent?.relationship || 'Bố/Mẹ'
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      // 1. Create/Update Parent
      const parentData = {
        fullname: data.parentFullname,
        phone: data.parentPhone,
        email: data.parentEmail || undefined,
        address: data.parentAddress || undefined,
        relationship: data.parentRelationship || undefined
      };
      
      let savedParent;
      if (isEdit && student?.parent?.id) {
        savedParent = await updateParent(student.parent.id, parentData);
      } else {
        savedParent = await createParent(parentData);
      }

      // 2. Create/Update Student
      const studentData = {
        studentCode: data.studentCode,
        fullname: data.fullname,
        dateOfBirth: data.dateOfBirth || undefined,
        gradeLevel: data.gradeLevel,
        schoolName: data.schoolName || undefined,
        phone: data.phone,
        gender: data.gender as Gender,
        status: data.status as StudentStatus,
        note: data.note || undefined,
        parentId: savedParent.id
      };

      if (isEdit) {
        return updateStudent(student.id, studentData);
      } else {
        return createStudent(studentData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success(isEdit ? 'Đã cập nhật học viên' : 'Đã thêm học viên mới');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu học viên');
    }
  });

  const onSubmit = (data: StudentFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>{isEdit ? 'Sửa Học viên' : 'Thêm Học viên mới'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="modal-body">
            
            <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>1. Thông tin Học viên</h3>
            <div className="form-grid" style={{ marginBottom: '2rem' }}>
              
              <div className="form-group">
                <label>Mã Học viên *</label>
                <input type="text" {...register('studentCode')} className={`form-control ${errors.studentCode ? 'error' : ''}`} />
                {errors.studentCode && <span className="error-msg">{errors.studentCode.message}</span>}
              </div>

              <div className="form-group">
                <label>Họ và Tên HV *</label>
                <input type="text" {...register('fullname')} className={`form-control ${errors.fullname ? 'error' : ''}`} />
                {errors.fullname && <span className="error-msg">{errors.fullname.message}</span>}
              </div>

              <div className="form-group">
                <label>Giới tính *</label>
                <select {...register('gender')} className="form-control">
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input type="date" {...register('dateOfBirth')} className="form-control" />
              </div>

              <div className="form-group">
                <label>Số điện thoại HV *</label>
                <input type="text" {...register('phone')} className={`form-control ${errors.phone ? 'error' : ''}`} />
                {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label>Khối lớp *</label>
                <input type="text" {...register('gradeLevel')} className={`form-control ${errors.gradeLevel ? 'error' : ''}`} placeholder="VD: Lớp 10" />
                {errors.gradeLevel && <span className="error-msg">{errors.gradeLevel.message}</span>}
              </div>

              <div className="form-group">
                <label>Trường học</label>
                <input type="text" {...register('schoolName')} className="form-control" />
              </div>

              <div className="form-group">
                <label>Trạng thái *</label>
                <select {...register('status')} className="form-control">
                  <option value="ACTIVE">Đang học (ACTIVE)</option>
                  <option value="PAUSED">Bảo lưu (PAUSED)</option>
                  <option value="DROPPED">Đã nghỉ (DROPPED)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Ghi chú</label>
                <textarea {...register('note')} className="form-control" rows={2}></textarea>
              </div>

            </div>

            <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>2. Thông tin Phụ huynh</h3>
            <div className="form-grid">
              
              <div className="form-group">
                <label>Họ và tên Phụ huynh *</label>
                <input type="text" {...register('parentFullname')} className={`form-control ${errors.parentFullname ? 'error' : ''}`} />
                {errors.parentFullname && <span className="error-msg">{errors.parentFullname.message}</span>}
              </div>

              <div className="form-group">
                <label>Số điện thoại PH *</label>
                <input type="text" {...register('parentPhone')} className={`form-control ${errors.parentPhone ? 'error' : ''}`} />
                {errors.parentPhone && <span className="error-msg">{errors.parentPhone.message}</span>}
              </div>

              <div className="form-group">
                <label>Mối quan hệ</label>
                <input type="text" {...register('parentRelationship')} className="form-control" placeholder="Bố, Mẹ, Ông, Bà..." />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" {...register('parentEmail')} className={`form-control ${errors.parentEmail ? 'error' : ''}`} />
                {errors.parentEmail && <span className="error-msg">{errors.parentEmail.message}</span>}
              </div>

              <div className="form-group full-width">
                <label>Địa chỉ</label>
                <input type="text" {...register('parentAddress')} className="form-control" />
              </div>

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
