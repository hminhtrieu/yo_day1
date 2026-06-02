import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCourseClass, updateCourseClass } from '../api/courseClasses.api';
import { getCourses } from '../../courses/api/courses.api';
import { getRooms } from '../../rooms/api/rooms.api';
import { getTeachers } from '../../teachers/api/teachers.api';
import type { CourseClassResponse } from '../../../types/yoedu';
import { FormField } from '../../../components/common/FormField';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const classSchema = z.object({
  classCode: z.string().min(2, 'Mã lớp quá ngắn'),
  name: z.string().min(2, 'Tên lớp quá ngắn'),
  courseId: z.number().min(1, 'Vui lòng chọn khóa học'),
  roomId: z.number().min(1, 'Vui lòng chọn phòng học'),
  scheduleSlotId: z.number().min(1, 'Vui lòng chọn ca học'),
  mainTeacherId: z.number().min(1, 'Vui lòng chọn GV chính'),
  assistantTeacherId: z.number().optional(),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().optional(),
  maxStudents: z.number().min(1, 'Sĩ số tối đa > 0'),
  tuitionFee: z.number().min(0, 'Học phí không hợp lệ'),
  status: z.enum(['OPEN', 'ONGOING', 'CLOSED', 'FULL'])
});

type FormData = z.infer<typeof classSchema>;

interface Props {
  courseClass?: CourseClassResponse;
  onClose: () => void;
}

export const CourseClassFormModal = ({ courseClass, onClose }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!courseClass;

  const { data: courses } = useQuery({ queryKey: ['courses', ''], queryFn: () => getCourses('') });
  const { data: rooms } = useQuery({ queryKey: ['rooms', ''], queryFn: () => getRooms('') });
  const { data: teachers } = useQuery({ queryKey: ['teachers', ''], queryFn: () => getTeachers('') });

  // Mock schedule slots because backend is missing it
  const scheduleSlots = [
    { id: 1, label: 'Ca 1 (17:30 - 19:00)' },
    { id: 2, label: 'Ca 2 (19:30 - 21:00)' },
    { id: 3, label: 'Thứ 7 - Sáng (08:00 - 10:00)' }
  ];

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      classCode: courseClass?.classCode || '',
      name: courseClass?.name || '',
      courseId: courseClass?.course?.id || 0,
      roomId: courseClass?.room?.id || 0,
      scheduleSlotId: courseClass?.slot?.id || 0,
      mainTeacherId: courseClass?.mainTeacher?.id || 0,
      assistantTeacherId: courseClass?.assistantTeacher?.id,
      startDate: courseClass?.startTime?.split('T')[0] || '',
      endDate: courseClass?.endTime?.split('T')[0] || '',
      maxStudents: courseClass?.maxStudents || 20,
      tuitionFee: courseClass?.tuitionFee || 0,
      status: courseClass?.status || 'OPEN'
    }
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (isEdit) {
        return updateCourseClass(courseClass.id, data);
      }
      return createCourseClass(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success(isEdit ? 'Đã cập nhật lớp học' : 'Đã tạo lớp học mới');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const courseOptions = [{ value: 0, label: '-- Chọn khóa học --' }].concat(
    (courses || []).map(c => ({ value: c.id, label: c.name }))
  );
  
  const roomOptions = [{ value: 0, label: '-- Chọn phòng học --' }].concat(
    (rooms || []).map(r => ({ value: r.id, label: r.name }))
  );

  const teacherOptions = [{ value: 0, label: '-- Chọn giáo viên --' }].concat(
    (teachers || []).map(t => ({ value: t.id, label: t.fullname }))
  );

  const assistantOptions = [{ value: 0, label: '-- Không có trợ giảng --' }].concat(
    (teachers || []).filter(t => t.teacherRole !== 'TEACHER').map(t => ({ value: t.id, label: t.fullname }))
  );

  const slotOptions = [{ value: 0, label: '-- Chọn ca học --' }].concat(
    scheduleSlots.map(s => ({ value: s.id, label: s.label }))
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2>{isEdit ? 'Sửa Lớp học' : 'Thêm Lớp học mới'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit((d) => mutation.mutate({ ...d, assistantTeacherId: d.assistantTeacherId || undefined }))} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div className="modal-body">
            <div className="form-grid">
              
              <FormField label="Mã lớp *" {...register('classCode')} error={errors.classCode} />
              <FormField label="Tên lớp *" {...register('name')} error={errors.name} />
              
              <FormField label="Khóa học *" as="select" {...register('courseId', { valueAsNumber: true })} error={errors.courseId} options={courseOptions} fullWidth />
              
              <FormField label="Phòng học *" as="select" {...register('roomId', { valueAsNumber: true })} error={errors.roomId} options={roomOptions} />
              <FormField label="Ca học *" as="select" {...register('scheduleSlotId', { valueAsNumber: true })} error={errors.scheduleSlotId} options={slotOptions} />
              
              <FormField label="Giáo viên chính *" as="select" {...register('mainTeacherId', { valueAsNumber: true })} error={errors.mainTeacherId} options={teacherOptions} />
              <FormField label="Trợ giảng" as="select" {...register('assistantTeacherId', { valueAsNumber: true })} error={errors.assistantTeacherId} options={assistantOptions} />
              
              <FormField label="Sĩ số tối đa *" type="number" {...register('maxStudents', { valueAsNumber: true })} error={errors.maxStudents} />
              <FormField label="Học phí lớp (VNĐ) *" type="number" {...register('tuitionFee', { valueAsNumber: true })} error={errors.tuitionFee} />

              <FormField label="Ngày bắt đầu *" type="date" {...register('startDate')} error={errors.startDate} />
              <FormField label="Ngày kết thúc (Dự kiến)" type="date" {...register('endDate')} error={errors.endDate} />
              
              <FormField label="Trạng thái *" as="select" {...register('status')} error={errors.status} options={[
                { value: 'OPEN', label: 'Mở đăng ký' },
                { value: 'ONGOING', label: 'Đang diễn ra' },
                { value: 'CLOSED', label: 'Đã đóng' },
                { value: 'FULL', label: 'Đã đầy' }
              ]} />

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
