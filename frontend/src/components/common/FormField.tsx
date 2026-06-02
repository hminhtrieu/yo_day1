import React from 'react';
import type { FieldError } from 'react-hook-form';

interface Props extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string | number; label: string }[];
  fullWidth?: boolean;
  rows?: number;
}

export const FormField = React.forwardRef<any, Props>(
  ({ label, error, as = 'input', options, fullWidth, className, style, ...rest }, ref) => {
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gridColumn: fullWidth ? '1 / -1' : undefined }}>
        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, color: '#334155', fontSize: '0.9rem' }}>
          {label}
        </label>
        
        {as === 'select' ? (
          <select 
            ref={ref} 
            className={`form-control ${error ? 'error' : ''} ${className || ''}`}
            style={{ width: '100%', padding: '0.6rem', border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`, borderRadius: '6px', fontFamily: 'inherit', ...style }}
            {...rest}
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : as === 'textarea' ? (
          <textarea
            ref={ref}
            className={`form-control ${error ? 'error' : ''} ${className || ''}`}
            style={{ width: '100%', padding: '0.6rem', border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`, borderRadius: '6px', fontFamily: 'inherit', ...style }}
            {...(rest as any)}
          />
        ) : (
          <input 
            ref={ref} 
            className={`form-control ${error ? 'error' : ''} ${className || ''}`}
            style={{ width: '100%', padding: '0.6rem', border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`, borderRadius: '6px', fontFamily: 'inherit', ...style }}
            {...(rest as any)} 
          />
        )}
        
        {error && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{error.message}</span>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
