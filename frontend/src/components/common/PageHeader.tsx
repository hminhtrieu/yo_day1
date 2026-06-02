
import { Plus, Search } from 'lucide-react';

interface Props {
  title: string;
  onAddClick?: () => void;
  addLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const PageHeader = ({
  title,
  onAddClick,
  addLabel = 'Thêm mới',
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...'
}: Props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', color: '#1e293b', fontWeight: 700, margin: 0 }}>{title}</h1>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {onSearchChange && (
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder={searchPlaceholder} 
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px', outline: 'none' }}
            />
            <Search size={18} style={{ position: 'absolute', right: '12px', top: '10px', color: '#94a3b8' }} />
          </div>
        )}
        
        {onAddClick && (
          <button 
            onClick={onAddClick}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px',
              fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <Plus size={18} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};
