import React from 'react';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  extra,
  padding = '24px',
  style,
  ...props
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style
      }}
      {...props}
    >
      {(title || subtitle || extra) && (
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {extra && <div style={{ display: 'flex', alignItems: 'center' }}>{extra}</div>}
        </div>
      )}
      <div style={{ padding, flexGrow: 1 }}>{children}</div>
    </div>
  );
};
export default Card;
