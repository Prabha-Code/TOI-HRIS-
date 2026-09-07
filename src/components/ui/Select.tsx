import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  styleContainer?: React.CSSProperties;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, styleContainer, disabled, style, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...styleContainer }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text)',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          style={{
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: '8px',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
            color: disabled ? '#9CA3AF' : 'var(--color-text)',
            outline: 'none',
            transition: 'all 0.15s ease-in-out',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            fontFamily: 'inherit',
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...style
          }}
          onFocus={(e) => {
            if (disabled) return;
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-primary)';
            e.currentTarget.style.boxShadow = error
              ? '0 0 0 3px rgba(220, 38, 38, 0.2)'
              : '0 0 0 3px rgba(79, 70, 229, 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 500 }}>
            {error}
          </span>
        )}
        {!error && helperText && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
