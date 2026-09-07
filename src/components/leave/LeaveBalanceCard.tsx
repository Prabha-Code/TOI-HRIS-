import React from 'react';
import { EmployeeBalances } from '../../types/leave';
import { Card } from '../ui/Card';
import { Calendar, AlertCircle, Heart } from 'lucide-react';

interface LeaveBalanceCardProps {
  balances: EmployeeBalances;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balances }) => {
  const categories = [
    {
      key: 'annual' as const,
      label: 'Annual Leave',
      description: 'Paid vacation time',
      balance: balances.annual,
      color: 'var(--color-primary)',
      bgColor: '#EEF2FF',
      icon: <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
    },
    {
      key: 'sick' as const,
      label: 'Sick Leave',
      description: 'Medical and health recovery',
      balance: balances.sick,
      color: 'var(--color-success)',
      bgColor: '#F0FDF4',
      icon: <Heart size={20} style={{ color: 'var(--color-success)' }} />
    },
    {
      key: 'personal' as const,
      label: 'Personal Leave',
      description: 'Short emergencies or events',
      balance: balances.personal,
      color: 'var(--color-warning)',
      bgColor: '#FFFBEB',
      icon: <AlertCircle size={20} style={{ color: 'var(--color-warning)' }} />
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%'
      }}
    >
      {categories.map((category) => {
        const { label, description, balance, color, bgColor, icon } = category;
        const percentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;

        return (
          <Card key={category.key} padding="20px" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {description}
                </p>
              </div>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
                {balance.remaining}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                days left
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, percentage))}%`,
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease-out'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <div>
                <strong>{balance.used}</strong> used
              </div>
              <div>
                <strong>{balance.total}</strong> total
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
export default LeaveBalanceCard;
