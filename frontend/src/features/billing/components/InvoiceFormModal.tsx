import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createInvoice } from '../api/billing.api';
import { getStudents } from '../../students/api/students.api';
import { getCourseClasses } from '../../courseClasses/api/courseClasses.api';
// We would ideally fetch promotions, but we can mock or let user input ID for now since promotion API isn't fully detailed in prompt.
import { FormField } from '../../../components/common/FormField';
import toast from 'react-hot-toast';
import type { InvoiceCreateRequest } from '../../../types/yoedu';

const schema = z.object({
  invoiceCode: z.string().min(1, "Mã hóa đơn là bắt buộc"),
  studentId: z.coerce.number().min(1, "Vui lòng chọn học viên"),
  courseClassId: z.coerce.number().min(1, "Vui lòng chọn lớp học"),
  billingMonthRaw: z.string().min(1, "Vui lòng chọn tháng thu"),
  originalAmount: z.coerce.number().min(0, "Số tiền không hợp lệ"),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  defaultStudentId?: number;
}

export const InvoiceFormModal = ({ onClose, defaultStudentId }: Props) => {
  const queryClient = useQueryClient();

  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => getStudents('') });
  const { data: classes } = useQuery({ queryKey: ['classes'], queryFn: getCourseClasses });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceCode: `INV-${new Date().getTime().toString().slice(-6)}`,
      studentId: defaultStudentId || 0,
      courseClassId: 0,
      originalAmount: 0,
      billingMonthRaw: new Date().toISOString().slice(0, 7) // YYYY-MM
    }
  });

  const mutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.studentId] });
      toast.success('Tạo hóa đơn thành công!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const onSubmit = (data: FormValues) => {
    // Format billingMonth to YYYY-MM-01
    const payload: InvoiceCreateRequest = {
      invoiceCode: data.invoiceCode,
      studentId: data.studentId,
      courseClassId: data.courseClassId,
      billingMonth: `${data.billingMonthRaw}-01`,
      originalAmount: data.originalAmount,
      dueDate: data.dueDate ? data.dueDate : undefined,
      note: data.note
    };
    mutation.mutate(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Tạo Hóa đơn mới</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField 
              label="Mã hóa đơn (*)" 
              error={errors.invoiceCode as any}
              {...register('invoiceCode')}
            />

            <FormField 
              label="Học viên (*)" 
              error={errors.studentId as any}
              as="select"
              options={[
                { value: 0, label: '-- Chọn học viên --' },
                ...(students || []).map(s => ({ value: s.id, label: `${s.studentCode} - ${s.fullname}` }))
              ]}
              {...register('studentId')}
            />

            <FormField 
              label="Lớp học (*)" 
              error={errors.courseClassId as any}
              as="select"
              options={[
                { value: 0, label: '-- Chọn lớp học --' },
                ...(classes || []).map(c => ({ value: c.id, label: `${c.classCode} - ${c.name}` }))
              ]}
              {...register('courseClassId')}
            />

            <FormField 
              type="month"
              label="Tháng thu (*)" 
              error={errors.billingMonthRaw as any}
              {...register('billingMonthRaw')}
            />

            <div>
              <FormField 
                type="number"
                label="Số tiền thu (VNĐ)" 
                error={errors.originalAmount as any}
                {...register('originalAmount')}
              />
              <small style={{ color: '#64748b' }}>Để 0 nếu muốn tự động lấy học phí của lớp</small>
            </div>

            <FormField 
              type="date"
              label="Hạn chót thanh toán" 
              error={errors.dueDate as any}
              {...register('dueDate')}
            />
          </div>

          <FormField 
            as="textarea"
            rows={2}
            label="Ghi chú" 
            error={errors.note as any}
            {...register('note')}
          />

          <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Lưu Hóa đơn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
