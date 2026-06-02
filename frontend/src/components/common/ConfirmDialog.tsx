

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog = ({
  isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Xác nhận', cancelLabel = 'Hủy', isDestructive = false
}: Props) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'white', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '1.5rem', animation: 'slideUp 0.2s ease-out' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.2rem' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem 0', color: '#475569', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} style={{ background: 'white', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{ background: isDestructive ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
