import { Pencil, Trash2, Eye } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
}

export const DataTable = <T,>({ columns, data, onView, onEdit, onDelete, keyExtractor }: Props<T>) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Không có dữ liệu.</div>;
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', padding: '1rem 1.5rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                {col.header}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', padding: '1rem 1.5rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                Hành động
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} style={{ borderBottom: '1px solid #f1f5f9' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '1rem 1.5rem', color: '#334155', verticalAlign: 'middle' }}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
              {(onView || onEdit || onDelete) && (
                <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {onView && (
                      <button onClick={() => onView(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.4rem', borderRadius: '6px' }} title="Xem">
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.4rem', borderRadius: '6px' }} title="Sửa">
                        <Pencil size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.4rem', borderRadius: '6px' }} title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
