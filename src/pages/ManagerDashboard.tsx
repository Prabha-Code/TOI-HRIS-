import React, { useState } from 'react';
import { LeaveRequest, Employee } from '../types/leave';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { LeaveRequestCard } from '../components/leave/LeaveRequestCard';
import { formatDate } from '../utils/date';
import {
  Users,
  CheckCircle2,
  Search
} from 'lucide-react';
import { MANAGER_METRICS } from '../data/seedData';

interface ManagerDashboardProps {
  requests: LeaveRequest[];
  employees: Employee[];
  onApproveLeave: (id: string) => boolean | Promise<boolean>;
  onRejectLeave: (id: string, reason?: string) => boolean | Promise<boolean>;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onNavigate: (tab: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  requests,
  employees,
  onApproveLeave,
  onRejectLeave,
  addToast,
  onNavigate
}) => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pending requests for direct reports in the active manager view
  const pendingTeamRequests = requests.filter(req => {
    const emp = employees.find(e => e.id === req.employeeId);
    return req.status === 'pending' && emp?.department === 'Engineering';
  }).sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  const filteredPendingRequests = pendingTeamRequests.filter(req => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      req.employeeName.toLowerCase().includes(query) ||
      req.reason.toLowerCase().includes(query) ||
      req.leaveType.toLowerCase().includes(query)
    );
  });

  const handleApprove = async (id: string) => {
    await onApproveLeave(id);
    if (selectedRequest?.id === id) {
      setSelectedRequest(null);
    }
  };

  const handleRejectClick = (id: string) => {
    setRejectingRequestId(id);
    setRejectionReason('');
    setIsRejectionModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectingRequestId) return;
    await onRejectLeave(rejectingRequestId, rejectionReason);
    setIsRejectionModalOpen(false);
    setRejectingRequestId(null);
    if (selectedRequest?.id === rejectingRequestId) {
      setSelectedRequest(null);
    }
  };

  const handleViewTeam = () => {
    onNavigate('teams');
    addToast('Opened Teams availability roster.', 'info');
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  // Find associated employee balances for the selected request
  const selectedRequestEmployee = selectedRequest 
    ? employees.find(e => e.id === selectedRequest.employeeId)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Banner */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          backgroundColor: '#ECFDF5', 
          padding: '24px 28px', 
          borderRadius: '16px',
          border: '1px solid #D1FAE5'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
            Good morning, Arjun Mehta 👋
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#059669', fontWeight: 500 }}>
            Here's what's happening with your team.
          </p>
        </div>
        
        <Button variant="success" onClick={handleViewTeam} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} />
          View Team Availability
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Team Members</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-text)' }}>{MANAGER_METRICS.teamMembersCount}</h2>
        </Card>
        
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Working Today</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-success)' }}>{MANAGER_METRICS.workingToday}</h2>
        </Card>
        
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>On Leave Today</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-warning)' }}>{MANAGER_METRICS.onLeave}</h2>
        </Card>
        
        <Card padding="20px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Pending Requests</span>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700, color: 'var(--color-primary)' }}>{pendingTeamRequests.length}</h2>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Pending Requests Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
              Pending Leave Requests ({filteredPendingRequests.length})
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', backgroundColor: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '8px 12px' }}>
              <Search size={14} style={{ color: 'var(--color-text-secondary)' }} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests"
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--color-text)', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {filteredPendingRequests.length === 0 ? (
            <Card padding="32px" style={{ textAlign: 'center' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--color-success)', margin: '0 auto 12px auto' }} />
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-text)', fontWeight: 600 }}>
                {searchTerm ? 'No requests match your search' : "You're all caught up!"}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {searchTerm ? 'Try a different name or leave type.' : 'No pending leave requests from your team.'}
              </p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredPendingRequests.map(req => (
                <LeaveRequestCard
                  key={req.id}
                  request={req}
                  showActions={true}
                  onApprove={handleApprove}
                  onReject={handleRejectClick}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Weekly Availability Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
            Team Availability — This Week
          </h2>
          <Card padding="20px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MANAGER_METRICS.teamAvailability.map((avail, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingBottom: '12px',
                    borderBottom: idx === MANAGER_METRICS.teamAvailability.length - 1 ? 'none' : '1px solid #F3F4F6'
                  }}
                >
                  <div style={{ width: '50px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{avail.day}</span>
                  </div>
                  
                  <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
                    <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', flexGrow: 1, overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(avail.working / MANAGER_METRICS.teamMembersCount) * 100}%`,
                          backgroundColor: 'var(--color-success)',
                          borderRadius: '4px'
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500, width: '45px', textAlign: 'right' }}>
                      {avail.working}/{MANAGER_METRICS.teamMembersCount}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '130px' }}>
                    {avail.leave > 0 ? (
                      <Badge variant="warning">{avail.leave} on leave</Badge>
                    ) : (
                      <Badge variant="success">Full strength</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Performance & Reviews Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Team Performance Summary */}
        <Card title="Team Performance Overview" subtitle="Average team score is 84%">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ fontWeight: 500 }}>Exceeds expectations</span>
              <strong style={{ color: 'var(--color-success)' }}>{MANAGER_METRICS.performance.exceeds} members</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ fontWeight: 500 }}>Meets expectations</span>
              <strong style={{ color: 'var(--color-primary)' }}>{MANAGER_METRICS.performance.meets} members</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ fontWeight: 500 }}>Needs improvement</span>
              <strong style={{ color: 'var(--color-danger)' }}>{MANAGER_METRICS.performance.needsImprovement} members</strong>
            </div>
            
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', marginTop: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>AVERAGE REVIEW SCORE</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>
                {MANAGER_METRICS.performance.averageScore}%
              </h3>
            </div>
          </div>
        </Card>

        {/* Upcoming Performance Reviews */}
        <Card title="Upcoming Performance Reviews" subtitle="Review sessions scheduled for this cycle">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MANAGER_METRICS.upcomingReviews.map((review, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px', 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-border)' 
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{review.name}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{review.role}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>{review.date}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>1-on-1 scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Details Dialog Modal */}
      {selectedRequest && selectedRequestEmployee && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Leave Request Details"
          footer={
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                variant="outline" 
                onClick={() => handleRejectClick(selectedRequest.id)}
                style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
              >
                Reject Request
              </Button>
              <Button 
                variant="success" 
                onClick={() => handleApprove(selectedRequest.id)}
              >
                Approve Request
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Employee Bio */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
              {selectedRequestEmployee.avatar ? (
                <img 
                  src={selectedRequestEmployee.avatar} 
                  alt={selectedRequestEmployee.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600 }}>
                  {selectedRequestEmployee.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
                  {selectedRequestEmployee.name}
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {selectedRequestEmployee.title} ({selectedRequestEmployee.department})
                </p>
              </div>
            </div>

            {/* Leave Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Leave Type</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600 }}>
                  {selectedRequest.leaveType.toUpperCase()} LEAVE
                </p>
              </div>
              
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Duration</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600 }}>
                  {selectedRequest.duration} {selectedRequest.duration === 1 ? 'Day' : 'Days'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Start Date</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 500 }}>
                  {formatDate(selectedRequest.startDate)}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>End Date</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 500 }}>
                  {formatDate(selectedRequest.endDate)}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Reason</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontStyle: 'italic', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                "{selectedRequest.reason}"
              </p>
            </div>

            {/* Employee Balance Stats */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Current Leave Balances for {selectedRequestEmployee.name}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {/* Annual */}
                <div style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Annual</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {selectedRequestEmployee.balances.annual.remaining}d / {selectedRequestEmployee.balances.annual.total}d
                  </p>
                </div>
                {/* Sick */}
                <div style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sick</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-success)' }}>
                    {selectedRequestEmployee.balances.sick.remaining}d / {selectedRequestEmployee.balances.sick.total}d
                  </p>
                </div>
                {/* Personal */}
                <div style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Personal</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-warning)' }}>
                    {selectedRequestEmployee.balances.personal.remaining}d / {selectedRequestEmployee.balances.personal.total}d
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        title="Reason for Rejection"
        footer={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => setIsRejectionModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleRejectSubmit}
              disabled={rejectionReason.trim().length === 0}
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="reject-comment" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>
            Provide comments regarding this rejection (visible to employee):
          </label>
          <textarea
            id="reject-comment"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="E.g., High-priority project deployment is scheduled. Please reschedule."
            rows={3}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              fontSize: '14px',
              fontFamily: 'inherit',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default ManagerDashboard;
