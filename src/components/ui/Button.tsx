import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          border: '1px solid transparent'
        };
      case 'secondary':
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          border: '1px solid transparent'
        };
      case 'outline':
        return {
          backgroundColor: '#FFFFFF',
          color: '#374151',
          border: '1px solid var(--color-border)'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger)',
          color: '#FFFFFF',
          border: '1px solid transparent'
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-success)',
          color: '#FFFFFF',
          border: '1px solid transparent'
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '1px solid transparent',
          padding: '4px 8px'
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '12px',
          borderRadius: '8px'
        };
      case 'lg':
        return {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '12px'
        };
      case 'md':
      default:
        return {
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '10px'
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: 'all 0.15s ease-in-out',
    fontFamily: 'inherit',
    outline: 'none',
    boxShadow: variant === 'text' ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (disabled || isLoading) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#E5E7EB';
        if (variant === 'outline') e.currentTarget.style.backgroundColor = '#F9FAFB';
        if (variant === 'danger') e.currentTarget.style.backgroundColor = '#B91C1C';
        if (variant === 'success') e.currentTarget.style.backgroundColor = '#15803D';
        if (variant === 'text') e.currentTarget.style.textDecoration = 'underline';
      }}
      onMouseLeave={(e) => {
        if (disabled || isLoading) return;
        const defaultStyles = getVariantStyles();
        e.currentTarget.style.backgroundColor = defaultStyles.backgroundColor || 'transparent';
        if (variant === 'text') e.currentTarget.style.textDecoration = 'none';
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.4)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = variant === 'text' ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            style={{
              animation: 'spin 1s linear infinite',
              marginRight: '8px',
              height: '16px',
              width: '16px',
              color: 'currentColor'
            }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              style={{ opacity: 0.25 }}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              style={{ opacity: 0.75 }}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
export default Button;
