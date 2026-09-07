import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from '../../hooks/useLeaveRequests';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)'
      }}
    >
      {toasts.map(toast => {
        let icon = <Info size={18} />;
        let iconColor = 'var(--color-info)';
        let bgColor = '#EFF6FF';
        let borderColor = '#BFDBFE';

        switch (toast.type) {
          case 'success':
            icon = <CheckCircle size={18} />;
            iconColor = 'var(--color-success)';
            bgColor = '#F0FDF4';
            borderColor = '#BBF7D0';
            break;
          case 'warning':
            icon = <AlertTriangle size={18} />;
            iconColor = 'var(--color-warning)';
            bgColor = '#FFFBEB';
            borderColor = '#FDE68A';
            break;
          case 'error':
            icon = <AlertCircle size={18} />;
            iconColor = 'var(--color-danger)';
            bgColor = '#FEF2F2';
            borderColor = '#FCA5A5';
            break;
        }

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.2s ease-in-out',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <span style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }}>
              {icon}
            </span>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#1F2937',
              flexGrow: 1,
              lineHeight: '1.4'
            }}>
              {toast.message}
            </p>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4B5563'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
