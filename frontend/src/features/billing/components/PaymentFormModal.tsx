import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createPayment, getInvoicesByStudentId } from '../api/billing.api';
import { getStudents } from '../../students/api/students.api';
import { FormField } from '../../../components/common/FormField';
import toast from 'react-hot-toast';
import type { PaymentCreateRequest } from '../../../types/yoedu';

const schema = z.object({
  paymentCode: z.string().min(1, "Mã phiếu thu là bắt buộc"),
  invoiceId: z.coerce.number().min(1, "Vui lòng chọn Hóa đơn"),
  paidAmount: z.coerce.number().min(1, "Số tiền thu phải lớn hơn 0"),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER'] as const),
  paidAt: z.string().min(1, "Vui lòng chọn thời gian thanh toán"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const PaymentFormModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => getStudents('') });
  
  // Only fetch invoices if a student is selected
  const { data: invoices } = useQuery({
    queryKey: ['invoices', selectedStudentId],
    queryFn: () => getInvoicesByStudentId(selectedStudentId),
    enabled: selectedStudentId > 0
  });

  // Filter out fully paid invoices
  const unpaidInvoices = useMemo(() => {
    return (invoices || []).filter(inv => inv.balanceAmount > 0 && inv.status !== 'PAID');
  }, [invoices]);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentCode: `PT-${new Date().getTime().toString().slice(-6)}`,
      invoiceId: 0,
      paidAmount: 0,
      paymentMethod: 'CASH',
      paidAt: new Date().toISOString().slice(0, 16) // datetime-local format
    }
  });

  // Auto set paidAmount to balanceAmount when invoice is selected
  const watchInvoiceId = watch('invoiceId') as number;
  useMemo(() => {
    if (watchInvoiceId > 0 && unpaidInvoices.length > 0) {
      const selectedInv = unpaidInvoices.find(inv => inv.id === Number(watchInvoiceId));
      if (selectedInv) {
        setValue('paidAmount', selectedInv.balanceAmount);
      }
    }
  }, [watchInvoiceId, unpaidInvoices, setValue]);

  const mutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'all'] });
      // Also invalidate invoices so BillingPage updates
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Ghi nhận thanh toán thành công!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data as PaymentCreateRequest);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Lập Phiếu thu</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>1. Tìm Hóa đơn theo Học viên:</label>
          <select 
            className="form-control"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
          >
            <option value={0}>-- Chọn học viên --</option>
            {(students || []).map(s => (
              <option key={s.id} value={s.id}>{s.studentCode} - {s.fullname}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body" style={{ paddingTop: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <FormField 
                label="Hóa đơn cần thanh toán (*)" 
                error={errors.invoiceId as any}
                as="select"
                disabled={selectedStudentId === 0}
                options={[
                  { value: 0, label: '-- Chọn hóa đơn --' },
                  ...unpaidInvoices.map(inv => ({
                    value: inv.id,
                    label: `${inv.invoiceCode} (Nợ: ${inv.balanceAmount.toLocaleString('vi-VN')}đ)`
                  }))
                ]}
                {...register('invoiceId')}
              />
              {selectedStudentId > 0 && unpaidInvoices.length === 0 && (
                <small style={{ color: '#ef4444' }}>Học viên này không có nợ.</small>
              )}
            </div>

            <FormField 
              type="number"
              label="Số tiền thu (VNĐ) (*)" 
              error={errors.paidAmount as any}
              {...register('paidAmount')}
            />

            <FormField 
              label="Phương thức (*)" 
              error={errors.paymentMethod as any}
              as="select"
              options={[
                { value: 'CASH', label: 'Tiền mặt' },
                { value: 'BANK_TRANSFER', label: 'Chuyển khoản' }
              ]}
              {...register('paymentMethod')}
            />

            <FormField 
              type="text"
              label="Mã Phiếu thu (*)" 
              error={errors.paymentCode as any}
              {...register('paymentCode')}
            />

            <FormField 
              type="datetime-local"
              label="Thời gian thanh toán (*)" 
              error={errors.paidAt as any}
              {...register('paidAt')}
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
              {mutation.isPending ? 'Đang lưu...' : 'Lưu Phiếu thu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
