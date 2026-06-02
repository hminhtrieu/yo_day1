import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPayments } from '../api/billing.api';
import type { PaymentResponse } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { PaymentFormModal } from '../components/PaymentFormModal';

export const PaymentPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', 'all'],
    queryFn: getAllPayments
  });

  const columns: Column<PaymentResponse>[] = [
    { key: 'paymentCode', header: 'Mã phiếu thu', render: (p) => <strong>{p.paymentCode}</strong> },
    { key: 'invoiceCode', header: 'Mã Hóa đơn', render: (p) => <span style={{ color: '#2563eb' }}>{p.invoiceCode}</span> },
    { key: 'paidAmount', header: 'Số tiền thu', render: (p) => <strong style={{ color: 'green' }}>{p.paidAmount.toLocaleString('vi-VN')} đ</strong> },
    { key: 'paymentMethod', header: 'Phương thức', render: (p) => p.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản' },
    { key: 'paidAt', header: 'Ngày thu', render: (p) => new Date(p.paidAt).toLocaleString('vi-VN') },
    { key: 'cashierUsername', header: 'Người thu' },
    { key: 'note', header: 'Ghi chú' }
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Phiếu thu (Thanh toán)" 
        addLabel="Lập Phiếu thu"
        onAddClick={() => setIsFormOpen(true)}
      />

      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải lịch sử thanh toán...</div>
        ) : (
          <DataTable 
            data={payments || []} 
            columns={columns} 
            keyExtractor={(p) => p.id}
          />
        )}
      </div>

      {isFormOpen && (
        <PaymentFormModal onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};
