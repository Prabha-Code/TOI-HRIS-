import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Network, 
  CalendarRange, 
  TrendingUp, 
  Briefcase, 
  CreditCard, 
  ChevronLeft, 
  RotateCcw
} from 'lucide-react';
import { Role } from '../../types/leave';
interface SidebarProps {
  currentRole: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onReset
}) => {

  const allowedTabs: Record<Role, string[]> = {
    employee: ['dashboard', 'leave'],
    manager: ['dashboard', 'employees', 'teams', 'organization', 'leave', 'performance'],
    hr: ['dashboard', 'employees', 'teams', 'organization', 'leave', 'performance', 'recruitment', 'payroll']
  };

  const navSections = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }
      ]
    },
    {
      title: 'PEOPLE',
      items: [
        { id: 'employees', label: 'Employees', icon: <Users size={20} /> },
        { id: 'teams', label: 'Teams', icon: <UserSquare2 size={20} /> },
        { id: 'organization', label: 'Organization', icon: <Network size={20} /> }
      ]
    },
    {
      title: 'WORKFORCE',
      items: [
        { id: 'leave', label: 'Leave Management', icon: <CalendarRange size={20} /> },
        { id: 'performance', label: 'Performance', icon: <TrendingUp size={20} /> },
        { id: 'recruitment', label: 'Recruitment', icon: <Briefcase size={20} /> }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'payroll', label: 'Payroll', icon: <CreditCard size={20} /> }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: collapsed ? '80px' : '260px',
        backgroundColor: '#1E293B', // Dark slate background for premium feel
        color: '#F8FAFC',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 100,
        borderRight: '1px solid #334155',
        boxShadow: 'var(--shadow-lg)'
      }}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Logo Header */}
      <div
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #334155',
          height: '70px',
          boxSizing: 'border-box'
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--color-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px',
                color: '#FFFFFF'
              }}
            >
              P
            </span>
            <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              PeopleOS
            </span>
          </div>
        )}
        {collapsed && (
          <span 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              backgroundColor: 'var(--color-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              color: '#FFFFFF'
            }}
          >
            P
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: collapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F8FAFC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <div 
        style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {navSections.map((section, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!collapsed && (
              <span 
                style={{ 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  color: '#64748B', 
                  paddingLeft: '12px', 
                  letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}
              >
                {section.title}
              </span>
            )}
            
            {section.items.filter(item => allowedTabs[currentRole].includes(item.id)).map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : '12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: '10px 12px',
                    width: '100%',
                    backgroundColor: isActive ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '14px',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (isActive) return;
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (isActive) return;
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                  title={item.label}
                >
                  {/* Left indicator bar for active item */}
                  {isActive && (
                    <div 
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '8px',
                        bottom: '8px',
                        width: '4px',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '0 4px 4px 0'
                      }}
                    />
                  )}
                  
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  
                  {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Area with System Reset */}
      <div 
        style={{ 
          padding: '16px 12px', 
          borderTop: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? '0' : '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '8px 12px',
            width: '100%',
            backgroundColor: 'transparent',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#E2E8F0',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#334155';
            e.currentTarget.style.borderColor = '#475569';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#334155';
          }}
          title="Reset Seed Data"
        >
          <RotateCcw size={16} />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>

        {!collapsed && (
          <div style={{ padding: '8px 4px 0 4px', fontSize: '11px', color: '#64748B', textAlign: 'center' }}>
            PeopleOS Prototype v1.0
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
