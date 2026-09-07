import React from 'react';
import { Role, Employee } from '../../types/leave';
import { Menu, ChevronDown, ShieldAlert } from 'lucide-react';

interface TopbarProps {
  currentRole: Role;
  onRoleSwitch: (role: Role) => void;
  currentUser: Employee | null;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRole,
  onRoleSwitch,
  currentUser,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const roles: { value: Role; label: string; color: string }[] = [
    { value: 'employee', label: 'Employee', color: 'var(--color-primary)' },
    { value: 'manager', label: 'Manager', color: 'var(--color-success)' },
    { value: 'hr', label: 'HR', color: 'var(--color-info)' }
  ];

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        position: 'fixed',
        top: 0,
        right: 0,
        left: sidebarCollapsed ? '80px' : '260px',
        transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 90,
        boxSizing: 'border-box'
      }}
    >
      {/* Left section: Toggle Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>
        
        {/* Title context */}
        <span className="hide-on-mobile-inline" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          HR Information System
        </span>
      </div>

      {/* Middle section: Demo Role Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F1F5F9',
          padding: '4px 6px',
          borderRadius: '24px',
          border: '1px solid #E2E8F0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '8px', paddingRight: '4px' }}>
          <ShieldAlert size={14} style={{ color: '#64748B' }} />
          <span className="hide-on-mobile-inline" style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Demo Role:
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '2px' }}>
          {roles.map((r) => {
            const isActive = currentRole === r.value;
            return (
              <button
                key={r.value}
                onClick={() => onRoleSwitch(r.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: isActive ? r.color : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  transition: 'all 0.15s ease-in-out',
                  boxShadow: isActive ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (isActive) return;
                  e.currentTarget.style.backgroundColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  if (isActive) return;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right section: Profile Info */}
      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="hide-on-mobile-block" style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', lineHeight: '1.2' }}>
              {currentUser.name}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {currentUser.title}
            </p>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '2px solid var(--color-border)',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                {currentUser.name.charAt(0)}
              </div>
            )}
            <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
          </div>
        </div>
      )}
    </header>
  );
};
export default Topbar;
