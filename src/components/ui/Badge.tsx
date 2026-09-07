import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  style,
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          border: '1px solid #BBF7D0'
        };
      case 'warning':
        return {
          backgroundColor: '#FEF3C7',
          color: '#B45309',
          border: '1px solid #FDE68A'
        };
      case 'danger':
        return {
          backgroundColor: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FCA5A5'
        };
      case 'info':
        return {
          backgroundColor: '#EFF6FF',
          color: '#1D4ED8',
          border: '1px solid #BFDBFE'
        };
      case 'primary':
        return {
          backgroundColor: '#EEF2FF',
          color: '#4F46E5',
          border: '1px solid #C7D2FE'
        };
      case 'neutral':
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          border: '1px solid #E5E7EB'
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 8px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '9999px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...getStyles(),
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
