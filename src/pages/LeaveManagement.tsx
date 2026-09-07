import React, { useState } from 'react';
import { Employee, LeaveRequest, Role, LeaveType } from '../types/leave';
import { LeaveBalanceCard } from '../components/leave/LeaveBalanceCard';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { LeaveRequestCard } from '../components/leave/LeaveRequestCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatDate } from '../utils/date';
import { Calendar, Filter, Plus } from 'lucide-react';

interface LeaveManagementProps {
  currentRole: Role;
  currentUser: Employee | null;
  requests: LeaveRequest[];
  employees: Employee[];
  onSubmitLeave: (leaveType: LeaveType, startDate: string, endDate: string, reason: string) => boolean | Promise<boolean>;
  onApproveLeave: (id: string) => boolean | Promise<boolean>;
  onRejectLeave: (id: string, reason?: string) => boolean | Promise<boolean>;
  onUpdateLeave: (id: string, updates: Pick<LeaveRequest, 'leaveType' | 'startDate' | 'endDate' | 'reason'>) => boolean | Promise<boolean>;
  onDeleteLeave: (id: string) => boolean | Promise<boolean>;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({
  currentRole,
  currentUser,
  requests,
  employees,
  onSubmitLeave,
  onApproveLeave,
  onRejectLeave,
  onUpdateLeave,
  onDeleteLeave
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [editForm, setEditForm] = useState<Pick<LeaveRequest, 'leaveType' | 'startDate' | 'endDate' | 'reason'>>({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Rejection state
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  const scopedRequests = currentRole === 'employee' && currentUser
    ? requests.filter(req => req.employeeId === currentUser.id)
    : currentRole === 'manager'
      ? requests.filter(req => {
          const emp = employees.find(e => e.id === req.employeeId);
          return emp?.department === 'Engineering' || req.employeeId === currentUser?.id;
        })
      : requests;

  // Filter requests based on role and active filters
  let filteredRequests = [...scopedRequests];

  if (searchTerm.trim()) {
    const query = searchTerm.trim().toLowerCase();
    filteredRequests = filteredRequests.filter(req =>
      req.employeeName.toLowerCase().includes(query) ||
      req.reason.toLowerCase().includes(query) ||
      req.leaveType.toLowerCase().includes(query)
    );
  }

  if (filterType !== 'all') {
    filteredRequests = filteredRequests.filter(req => req.status === filterType);
  }

  const requestSummary = {
    total: scopedRequests.length,
    pending: scopedRequests.filter(req => req.status === 'pending').length,
    approved: scopedRequests.filter(req => req.status === 'approved').length,
    rejected: scopedRequests.filter(req => req.status === 'rejected').length
  };

  const handleLeaveSubmit = async (
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ) => {
    const success = await onSubmitLeave(leaveType, startDate, endDate, reason);
    if (success) {
      setSearchTerm('');
      setFilterType('all');
      setIsSubmitModalOpen(false);
    }
    return success;
  };

  const handleApprove = async (id: string) => {
    await onApproveLeave(id);
    if (selectedRequest?.id === id) {
      setSelectedRequest(null);
    }
  };

  const handleEditClick = (request: LeaveRequest) => {
    setEditingRequest(request);
    setEditForm({
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason
    });
  };

  const handleEditSubmit = async () => {
    if (!editingRequest) return;
    const success = await onUpdateLeave(editingRequest.id, editForm);
    if (success) {
      setEditingRequest(null);
    }
  };

  const handleDelete = async (request: LeaveRequest) => {
    if (window.confirm(`Delete ${request.employeeName}'s ${request.leaveType} leave request?`)) {
      await onDeleteLeave(request.id);
      if (selectedRequest?.id === request.id) {
        setSelectedRequest(null);
      }
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

  // Find associated employee balances for the selected request
  const selectedRequestEmployee = selectedRequest 
    ? employees.find(e => e.id === selectedRequest.employeeId)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Leave Management
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {currentRole === 'employee' 
              ? 'Submit time-off requests and track your leave history.'
              : 'Review, approve, or reject employee leave requests.'}
          </p>
        </div>

        {currentRole === 'employee' && currentUser && (
          <Button variant="primary" onClick={() => setIsSubmitModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} />
            Request Leave
          </Button>
        )}
      </div>

      {/* Balance Cards for Employees */}
      {currentRole === 'employee' && currentUser && (
        <div>
          <h2 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
            Available Balances
          </h2>
          <LeaveBalanceCard balances={currentUser.balances} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <Card padding="18px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 700, color: 'var(--color-text)' }}>{requestSummary.total}</h3>
        </Card>
        <Card padding="18px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Pending</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 700, color: 'var(--color-warning)' }}>{requestSummary.pending}</h3>
        </Card>
        <Card padding="18px">
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Approved</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 700, color: 'var(--color-success)' }}>{requestSummary.approved}</h3>
        </Card>
      </div>

      {/* Filter and Content Card */}
      <Card>
        {/* Table/Card Header with Filters */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Filter by Status:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', backgroundColor: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '8px 12px' }}>
              <Filter size={14} style={{ color: 'var(--color-text-secondary)' }} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests"
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--color-text)', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['all', 'pending', 'approved', 'rejected'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${filterType === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: filterType === type ? 'var(--color-primary)' : '#FFFFFF',
                    color: filterType === type ? '#FFFFFF' : 'var(--color-text-secondary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Calendar size={40} style={{ color: '#9CA3AF', margin: '0 auto 12px auto' }} />
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>No leave requests found</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              There are no requests matching the selected filter.
            </p>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '20px' 
            }}
          >
            {filteredRequests.map(req => {
              const isPending = req.status === 'pending';
              const isUserReport = employees.find(e => e.id === req.employeeId)?.department === 'Engineering';
              const showActions = currentRole === 'manager' && isPending && isUserReport;

              return (
                <div key={req.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <LeaveRequestCard
                    request={req}
                    showActions={showActions}
                    onApprove={handleApprove}
                    onReject={handleRejectClick}
                    onViewDetails={handleViewDetails}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {req.status === 'pending' && (
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(req)}>
                        Edit
                      </Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(req)}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Leave Form Modal */}
      {currentUser && (
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Submit New Leave Request"
        >
          <LeaveRequestForm 
            balances={currentUser.balances}
            existingRequests={requests}
            employeeId={currentUser.id}
            onSubmit={handleLeaveSubmit}
            onCancel={() => setIsSubmitModalOpen(false)}
          />
        </Modal>
      )}

      {/* Details Dialog Modal */}
      {selectedRequest && selectedRequestEmployee && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Leave Request Details"
          footer={
            currentRole === 'manager' && selectedRequest.status === 'pending' ? (
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
            ) : (
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            )
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
          <label htmlFor="reject-comment-shared" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>
            Provide comments regarding this rejection (visible to employee):
          </label>
          <textarea
            id="reject-comment-shared"
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

      <Modal
        isOpen={!!editingRequest}
        onClose={() => setEditingRequest(null)}
        title="Edit Leave Request"
        maxWidth="620px"
        footer={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => setEditingRequest(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Update Request
            </Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            Leave Type
            <select
              value={editForm.leaveType}
              onChange={(event) => setEditForm({ ...editForm, leaveType: event.target.value as LeaveType })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
            >
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="personal">Personal</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            Start Date
            <input
              type="date"
              value={editForm.startDate}
              onChange={(event) => setEditForm({ ...editForm, startDate: event.target.value })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            End Date
            <input
              type="date"
              value={editForm.endDate}
              onChange={(event) => setEditForm({ ...editForm, endDate: event.target.value })}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, gridColumn: '1 / -1' }}>
            Reason
            <textarea
              value={editForm.reason}
              onChange={(event) => setEditForm({ ...editForm, reason: event.target.value })}
              rows={3}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
};
export default LeaveManagement;
