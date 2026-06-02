import { X } from 'lucide-react';
import type { StudentResponse } from '../../../types/yoedu';

interface Props {
  student: StudentResponse;
  onClose: () => void;
}

export const StudentDetailModal = ({ student, onClose }: Props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>Chi tiết Học viên: {student.fullname}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <div className="form-grid">
            
            {/* Thông tin học viên */}
            <div className="detail-card">
              <h3>Thông tin Học viên</h3>
              <div className="detail-row">
                <div className="detail-label">Mã HV:</div>
                <div className="detail-value">{student.studentCode}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Họ và tên:</div>
                <div className="detail-value">{student.fullname}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Giới tính:</div>
                <div className="detail-value">{student.gender === 'MALE' ? 'Nam' : student.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Ngày sinh:</div>
                <div className="detail-value">{student.dateOfBirth || '-'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Số điện thoại:</div>
                <div className="detail-value">{student.phone}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Khối lớp:</div>
                <div className="detail-value">{student.gradeLevel}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Trường học:</div>
                <div className="detail-value">{student.schoolName || '-'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Trạng thái:</div>
                <div className="detail-value">{student.status}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Ghi chú:</div>
                <div className="detail-value">{student.note || '-'}</div>
              </div>
            </div>

            {/* Thông tin phụ huynh */}
            <div className="detail-card">
              <h3>Thông tin Phụ huynh</h3>
              {student.parent ? (
                <>
                  <div className="detail-row">
                    <div className="detail-label">Họ và tên:</div>
                    <div className="detail-value">{student.parent.fullname}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Quan hệ:</div>
                    <div className="detail-value">{student.parent.relationship || '-'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Điện thoại:</div>
                    <div className="detail-value">{student.parent.phone}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Email:</div>
                    <div className="detail-value">{student.parent.email || '-'}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Địa chỉ:</div>
                    <div className="detail-value">{student.parent.address || '-'}</div>
                  </div>
                </>
              ) : (
                <div style={{ color: '#64748b' }}>Chưa có thông tin phụ huynh</div>
              )}
            </div>

          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
