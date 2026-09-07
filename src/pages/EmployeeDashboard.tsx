import React, { useState } from 'react';
import { Employee, LeaveRequest, LeaveType } from '../types/leave';
import { LeaveBalanceCard } from '../components/leave/LeaveBalanceCard';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { LeaveRequestCard } from '../components/leave/LeaveRequestCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { downloadTextFile } from '../utils/download';
import { 
  CalendarPlus, 
  Download, 
  TrendingUp, 
  Calendar, 
  FileSpreadsheet,
  Award,
  ChevronRight
} from 'lucide-react';

interface EmployeeDashboardProps {
  currentUser: Employee;
  requests: LeaveRequest[];
  onSubmitLeave: (leaveType: LeaveType, startDate: string, endDate: string, reason: string) => boolean | Promise<boolean>;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onNavigate: (tab: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  requests,
  onSubmitLeave,
  addToast,
  onNavigate
}) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Filter requests specifically for the current employee
  const myRequests = requests.filter(req => req.employeeId === currentUser.id);
  const approvedDays = myRequests
    .filter(req => req.status === 'approved')
    .reduce((sum, req) => sum + req.duration, 0);
  const pendingDays = myRequests
    .filter(req => req.status === 'pending')
    .reduce((sum, req) => sum + req.duration, 0);

  const usedDays = currentUser.balances.annual.total - currentUser.balances.annual.remaining;
  const annualUtilisation = currentUser.balances.annual.total > 0
    ? Math.min(100, Math.round((usedDays / currentUser.balances.annual.total) * 100))
    : 0;

  const handleLeaveSubmit = async (
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ) => {
    const success = await onSubmitLeave(leaveType, startDate, endDate, reason);
    if (success) {
      setIsLeaveModalOpen(false);
    }
    return success;
  };

  const handleDownloadPayslip = () => {
    const payslip = [
      'PeopleOS Payslip',
      'Pay Period: July 2026',
      `Employee: ${currentUser.name}`,
      `Role: ${currentUser.title}`,
      `Department: ${currentUser.department}`,
      '',
      'Earnings',
      'Basic Pay: INR 95,000',
      'Allowances: INR 18,000',
      'Deductions: INR 8,500',
      '',
      'Net Pay: INR 104,500',
      'Status: Paid'
    ].join('\n');

    downloadTextFile('peopleos-july-2026-payslip.txt', payslip);
    addToast('Payslip downloaded.', 'success');
  };

  const handleGrowthAction = () => {
    onNavigate('performance');
    addToast('Opened Performance Growth Plan details.', 'info');
  };

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
            Good morning, Ananya 👋
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#4F46E5', fontWeight: 500 }}>
            How can we help you today?
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={handleDownloadPayslip} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            View Payslip
          </Button>
          <Button variant="primary" onClick={() => setIsLeaveModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarPlus size={16} />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Main Grid: Visual Hero Balances & Growth Panel */}
      <div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
          Your Leave Balance Overview
        </h2>
        <LeaveBalanceCard balances={currentUser.balances} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Leave Used</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{approvedDays}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>approved days this year</p>
        </Card>
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Pending Requests</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-warning)' }}>{pendingDays}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>awaiting review</p>
        </Card>
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Utilization</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>{annualUtilisation}%</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>annual leave usage</p>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Side: Growth & Performance */}
        <Card 
          title="Your Growth & Goals" 
          subtitle="Annual review metrics and career progress"
          extra={
            <Button variant="text" size="sm" onClick={handleGrowthAction} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Details <ChevronRight size={14} />
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <TrendingUp size={20} style={{ color: 'var(--color-primary)', margin: '0 auto 8px auto' }} />
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Performance</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>82%</p>
              </div>
              
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <Award size={20} style={{ color: 'var(--color-success)', margin: '0 auto 8px auto' }} />
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Goals Completed</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>85%</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderLeft: '3px solid var(--color-info)', backgroundColor: '#EFF6FF', borderRadius: '4px 8px 8px 4px', fontSize: '13px' }}>
                <strong>New Feedback:</strong> "Excellent delivery on the HRIS mockup prototype. UX layout is clean."
              </div>
              <div style={{ padding: '12px', borderLeft: '3px solid var(--color-success)', backgroundColor: '#F0FDF4', borderRadius: '4px 8px 8px 4px', fontSize: '13px' }}>
                <strong>Goal Met:</strong> Completed typography modernization for the product design system.
              </div>
            </div>

          </div>
        </Card>

        {/* Right Side: Timeline Upcoming Events */}
        <Card title="Upcoming Timeline" subtitle="Reminders and system actions for the next 30 days">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>AUG 15, 2026</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Performance Check-in</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>10:30 AM with Arjun Mehta (Manager)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                <FileSpreadsheet size={16} style={{ color: 'var(--color-info)' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-info)' }}>AUG 21, 2026</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Goal Review Submission</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Submit Self-evaluation template</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                <Calendar size={16} style={{ color: 'var(--color-success)' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)' }}>AUG 30, 2026</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Salary Credited</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Monthly direct deposit processed</p>
              </div>
            </div>

          </div>
        </Card>

      </div>

      {/* Leave Request List */}
      <div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
          Your Leave Request History
        </h2>
        {myRequests.length === 0 ? (
          <Card padding="32px" style={{ textAlign: 'center' }}>
            <Calendar size={32} style={{ color: '#9CA3AF', margin: '0 auto 12px auto' }} />
            <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-text)', fontWeight: 600 }}>No requests submitted yet</p>
            <p style={{ margin: '4px 0 16px 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              You haven't requested any time off yet.
            </p>
            <Button variant="primary" onClick={() => setIsLeaveModalOpen(true)}>
              Request Leave
            </Button>
          </Card>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '20px' 
            }}
          >
            {myRequests.map(req => (
              <LeaveRequestCard 
                key={req.id} 
                request={req}
              />
            ))}
          </div>
        )}
      </div>

      {/* Leave Form Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Submit New Leave Request"
      >
        <LeaveRequestForm 
          balances={currentUser.balances}
          existingRequests={requests}
          employeeId={currentUser.id}
          onSubmit={handleLeaveSubmit}
          onCancel={() => setIsLeaveModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
export default EmployeeDashboard;
