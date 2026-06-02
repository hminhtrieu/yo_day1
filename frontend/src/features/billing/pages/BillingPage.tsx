import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInvoicesByStudentId } from '../api/billing.api';
import { getStudents } from '../../students/api/students.api';
import type { InvoiceResponse, InvoiceStatus } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { InvoiceFormModal } from '../components/InvoiceFormModal';

export const BillingPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

  const { data: students } = useQuery({ queryKey: ['students', ''], queryFn: () => getStudents('') });

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', selectedStudentId],
    queryFn: () => getInvoicesByStudentId(selectedStudentId),
    enabled: selectedStudentId > 0
  });

  const getStatusBadge = (status: InvoiceStatus | string) => {
    switch (status) {
      case 'PAID': return <span className="status-badge status-active">Đã thanh toán</span>;
      case 'PARTIAL': return <span className="status-badge" style={{ background: '#fef08a', color: '#854d0e' }}>Đã trả một phần</span>;
      case 'OVERPAID': return <span className="status-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Trả dư</span>;
      case 'UNPAID': return <span className="status-badge status-inactive">Chưa thanh toán</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const columns: Column<InvoiceResponse>[] = [
    { key: 'invoiceCode', header: 'Mã HĐ', render: (inv) => <strong>{inv.invoiceCode}</strong> },
    { key: 'className', header: 'Lớp học' },
    { key: 'billingMonth', header: 'Tháng thu', render: (inv) => {
        const d = new Date(inv.billingMonth);
        return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
    }},
    { key: 'finalAmount', header: 'Tổng tiền', render: (inv) => inv.finalAmount.toLocaleString('vi-VN') + ' đ' },
    { key: 'amountPaid', header: 'Đã trả', render: (inv) => inv.amountPaid.toLocaleString('vi-VN') + ' đ' },
    { key: 'balanceAmount', header: 'Còn nợ', render: (inv) => <span style={{ color: inv.balanceAmount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>{inv.balanceAmount.toLocaleString('vi-VN')} đ</span> },
    { key: 'status', header: 'Trạng thái', render: (inv) => getStatusBadge(inv.status) },
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Hóa đơn Học phí" 
        addLabel="Tạo Hóa đơn mới"
        onAddClick={() => setIsFormOpen(true)}
      />

      <div style={{ marginBottom: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Chọn Học viên để xem công nợ:</label>
        <select 
          className="form-control"
          value={selectedStudentId} 
          onChange={(e) => setSelectedStudentId(Number(e.target.value))}
          style={{ width: '100%', maxWidth: '400px', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
        >
          <option value={0}>-- Vui lòng chọn học viên --</option>
          {(students || []).map(s => (
            <option key={s.id} value={s.id}>{s.studentCode} - {s.fullname}</option>
          ))}
        </select>
      </div>

      {!selectedStudentId ? (
         <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
          Vui lòng chọn học viên để xem dữ liệu hóa đơn.
        </div>
      ) : isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</div>
      ) : (
        <DataTable 
          data={invoices || []} 
          columns={columns} 
          keyExtractor={(inv) => inv.id}
        />
      )}

      {isFormOpen && (
        <InvoiceFormModal 
          onClose={() => setIsFormOpen(false)} 
          defaultStudentId={selectedStudentId > 0 ? selectedStudentId : undefined}
        />
      )}
    </div>
  );
};
