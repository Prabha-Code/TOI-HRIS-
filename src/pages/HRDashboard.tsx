import React from 'react';
import { LeaveRequest } from '../types/leave';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HR_METRICS } from '../data/seedData';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  ChevronRight, 
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface HRDashboardProps {
  requests: LeaveRequest[];
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onNavigate: (tab: string) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  requests,
  addToast,
  onNavigate
}) => {
  // Count overall pending requests in the system
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  const handleAddEmployee = () => {
    onNavigate('employees');
    addToast('Opened Employees. Use Add Employee to create the new profile.', 'success');
  };

  const handleRunPayroll = () => {
    onNavigate('payroll');
    addToast('Opened Payroll processing.', 'success');
  };

  const handleActionClick = (actionName: string) => {
    const tabByAction: Record<string, string> = {
      'Leave approvals': 'leave',
      'Leave Approvals': 'leave',
      'Offer pipeline': 'recruitment',
      'Recruitment Pipeline': 'recruitment',
      'Payroll lock': 'payroll',
      'Payroll Processing': 'payroll',
      'Performance Reviews': 'performance'
    };

    const tab = tabByAction[actionName] || 'dashboard';
    onNavigate(tab);
    addToast(`Opened ${actionName}.`, 'info');
  };

  const priorityActions = [
    { title: 'Leave approvals', subtitle: `${pendingRequestsCount} items awaiting review`, tone: '#FFFBEB' },
    { title: 'Offer pipeline', subtitle: '3 offers pending sign-off', tone: '#F0FDF4' },
    { title: 'Payroll lock', subtitle: 'August cycle closes Friday', tone: '#EFF6FF' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Welcome Greeting Banner */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          backgroundColor: '#EEF2FF', 
          padding: '24px 28px', 
          borderRadius: '16px',
          border: '1px solid #E0E7FF'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
            Good morning, Priya 👋
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#4F46E5', fontWeight: 500 }}>
            Here's what needs your attention today.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={handleAddEmployee} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={16} />
            Add Employee
          </Button>
          <Button variant="primary" onClick={handleRunPayroll} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={16} />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Employees</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{HR_METRICS.totalEmployees}</h2>
        </Card>
        
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>On Leave Today</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-warning)' }}>{HR_METRICS.onLeaveToday}</h2>
        </Card>
        
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Open Positions</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>{HR_METRICS.openPositions}</h2>
        </Card>
        
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Pending Actions</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-danger)' }}>{HR_METRICS.pendingActions}</h2>
        </Card>
      </div>

      <Card title="Priority Tracker" subtitle="High-impact HR actions for this week">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {priorityActions.map((item) => (
            <div
              key={item.title}
              onClick={() => handleActionClick(item.title)}
              style={{
                backgroundColor: item.tone,
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                minHeight: '96px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</p>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>{item.subtitle}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>

        {/* Needs Your Attention Column */}
        <Card title="Needs Your Attention" subtitle="Critical workflow items awaiting action">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div 
              onClick={() => handleActionClick('Leave Approvals')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 14px', 
                backgroundColor: '#FFFBEB', 
                borderRadius: '8px', 
                border: '1px solid #FEF3C7',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <AlertCircle size={18} style={{ color: 'var(--color-warning)' }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                    {pendingRequestsCount} Leave Requests
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Waiting for department manager reviews</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            <div 
              onClick={() => handleActionClick('Performance Reviews')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 14px', 
                backgroundColor: '#EFF6FF', 
                borderRadius: '8px', 
                border: '1px solid #BFDBFE',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <FileCheck size={18} style={{ color: 'var(--color-info)' }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                    5 Performance Reviews
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Employee evaluations due this week</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            <div 
              onClick={() => handleActionClick('Recruitment Pipeline')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 14px', 
                backgroundColor: '#F3F4F6', 
                borderRadius: '8px', 
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Users size={18} style={{ color: 'var(--color-text-secondary)' }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                    3 Recruitment Tasks
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Candidate interview panels to schedule</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            <div 
              onClick={() => handleActionClick('Payroll Processing')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 14px', 
                backgroundColor: '#F0FDF4', 
                borderRadius: '8px', 
                border: '1px solid #BBF7D0',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CreditCard size={18} style={{ color: 'var(--color-success)' }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                    Payroll Processing
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Calculations start tomorrow morning</p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </div>

          </div>
        </Card>

        {/* Workforce Headcount Distribution */}
        <Card title="Workforce Overview" subtitle="Employee distribution by department (Headcount)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Engineering */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500 }}>Engineering</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>180 employees (36%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '36%', backgroundColor: 'var(--color-primary)' }} />
              </div>
            </div>

            {/* Sales */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500 }}>Sales</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>120 employees (24%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '24%', backgroundColor: 'var(--color-success)' }} />
              </div>
            </div>

            {/* Operations */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500 }}>Operations</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>95 employees (19%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '19%', backgroundColor: 'var(--color-info)' }} />
              </div>
            </div>

            {/* Marketing */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500 }}>Marketing</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>55 employees (11%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '11%', backgroundColor: 'var(--color-warning)' }} />
              </div>
            </div>

            {/* HR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500 }}>HR</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>30 employees (6%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '6%', backgroundColor: '#64748B' }} />
              </div>
            </div>

          </div>
        </Card>

      </div>

      {/* Recruitment Pipeline Overview */}
      <Card title="Recruitment Overview" subtitle="Open headcount hiring pipelines">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', textAlign: 'center' }}>
          
          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Open Positions</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
              {HR_METRICS.recruitment.openPositions}
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Candidates</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>
              {HR_METRICS.recruitment.candidates}
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Interviews Scheduled</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-warning)' }}>
              {HR_METRICS.recruitment.interviews}
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Offers Extended</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-success)' }}>
              {HR_METRICS.recruitment.offers}
            </p>
          </div>

        </div>
      </Card>
    </div>
  );
};
export default HRDashboard;
