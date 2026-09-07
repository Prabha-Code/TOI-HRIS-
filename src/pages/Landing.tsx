import React from 'react';
import { Role } from '../types/leave';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, User, Users, ShieldAlert } from 'lucide-react';

interface LandingProps {
  onSelectRole: (role: Role) => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelectRole }) => {
  const personas = [
    {
      role: 'employee' as Role,
      name: 'Ananya Sharma',
      title: 'Senior Product Designer',
      department: 'Product Design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      description: 'Request personal leave, check payslips, review performance check-ins, and manage goals.',
      icon: <User size={24} style={{ color: 'var(--color-primary)' }} />,
      bgColor: '#EEF2FF',
      borderColor: '#C7D2FE',
      ctaText: 'Enter as Ananya'
    },
    {
      role: 'manager' as Role,
      name: 'Arjun Mehta',
      title: 'Engineering Manager',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      description: 'Approve or reject team leave, review team availability timeline, check performance reviews.',
      icon: <Users size={24} style={{ color: 'var(--color-success)' }} />,
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      ctaText: 'Enter as Arjun'
    },
    {
      role: 'hr' as Role,
      name: 'Priya Nair',
      title: 'HR Director',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      description: 'Monitor total company headcount metrics, manage recruitment pipeline, process payroll.',
      icon: <Shield size={24} style={{ color: 'var(--color-info)' }} />,
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      ctaText: 'Enter as Priya'
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC', // Slate 50 background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: 'var(--font-inter)'
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--color-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
              fontWeight: 800,
              fontSize: '24px',
              color: '#FFFFFF'
            }}
          >
            P
          </div>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
            PeopleOS
          </h1>
          <p style={{ margin: 0, fontSize: '18px', color: 'var(--color-text-secondary)', fontWeight: 500, maxWidth: '600px', lineHeight: '1.4' }}>
            One place to understand your people, act on priorities, and keep work moving.
          </p>
        </div>

        {/* Warning Indicator */}
        <div 
          style={{ 
            backgroundColor: '#FFFBEB', 
            border: '1px solid #FDE68A', 
            borderRadius: '12px', 
            padding: '16px 20px', 
            display: 'inline-flex', 
            alignItems: 'flex-start',
            gap: '12px',
            textAlign: 'left',
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          <ShieldAlert size={20} style={{ color: '#D97706', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#92400E' }}>
              Simulated Demo Environment
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#B45309', lineHeight: '1.4' }}>
              This prototype simulates role-based views. Selecting a user below logs you in instantly with persistent local state. No server credentials required.
            </p>
          </div>
        </div>

        {/* Personas cards grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '24px',
            width: '100%',
            marginTop: '12px'
          }}
        >
          {personas.map((persona) => (
            <Card
              key={persona.role}
              style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                textAlign: 'left',
                border: `1px solid var(--color-border)`
              }}
              padding="24px"
              onClick={() => onSelectRole(persona.role)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = persona.borderColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #E2E8F0'
                    }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {persona.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {persona.title}
                    </p>
                  </div>
                </div>

                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: persona.bgColor }}>
                    {persona.role} View
                  </span>
                  <span>• {persona.department}</span>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5', flexGrow: 1 }}>
                  {persona.description}
                </p>

                <Button 
                  variant={persona.role === 'employee' ? 'primary' : persona.role === 'manager' ? 'success' : 'outline'}
                  style={{ width: '100%', pointerEvents: 'none' }} // Button styling inside clickable card
                >
                  {persona.ctaText}
                </Button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};
export default Landing;
