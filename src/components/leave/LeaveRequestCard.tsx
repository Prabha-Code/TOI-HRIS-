import React from 'react';
import { LeaveRequest } from '../../types/leave';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LeaveStatusBadge } from './LeaveStatusBadge';
import { formatDate } from '../../utils/date';
import { Calendar, User, FileText } from 'lucide-react';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetails?: (request: LeaveRequest) => void;
}

export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  showActions = false,
  onApprove,
  onReject,
  onViewDetails
}) => {
  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'annual': return 'Annual Leave';
      case 'sick': return 'Sick Leave';
      case 'personal': return 'Personal Leave';
      default: return type;
    }
  };

  const getLeaveTypeStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case 'annual': return { borderLeft: '4px solid var(--color-primary)' };
      case 'sick': return { borderLeft: '4px solid var(--color-success)' };
      case 'personal': return { borderLeft: '4px solid var(--color-warning)' };
      default: return {};
    }
  };

  return (
    <Card 
      padding="20px" 
      style={{ 
        position: 'relative', 
        ...getLeaveTypeStyle(request.leaveType),
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                {getLeaveTypeLabel(request.leaveType)}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                • {request.duration} {request.duration === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Submitted {formatDate(request.createdDate)}
            </p>
          </div>
          <LeaveStatusBadge status={request.status} />
        </div>

        {/* User Info (For Manager/HR view) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #F3F4F6', paddingTop: '10px' }}>
          <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={14} style={{ color: 'var(--color-text-secondary)' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
              {request.employeeName}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              {request.employeeRole}
            </p>
          </div>
        </div>

        {/* Dates and Reason */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
            <span>
              {formatDate(request.startDate)} – {formatDate(request.endDate)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <FileText size={14} style={{ color: 'var(--color-text-secondary)', marginTop: '2px', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', wordBreak: 'break-word' }}>
              "{request.reason}"
            </span>
          </div>
        </div>

        {/* Rejection Reason (If any) */}
        {request.status === 'rejected' && request.rejectionReason && (
          <div 
            style={{ 
              padding: '10px 12px', 
              backgroundColor: '#FEF2F2', 
              border: '1px solid #FCA5A5', 
              borderRadius: '8px', 
              fontSize: '12px', 
              color: 'var(--color-danger)'
            }}
          >
            <strong>Rejection Reason:</strong> {request.rejectionReason}
          </div>
        )}

        {/* Action Row */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '8px', 
            borderTop: '1px solid #F3F4F6', 
            paddingTop: '12px',
            marginTop: '4px'
          }}
        >
          {onViewDetails && (
            <Button variant="text" size="sm" onClick={() => onViewDetails(request)}>
              View Details
            </Button>
          )}

          {showActions && request.status === 'pending' && (
            <>
              {onReject && (
                <Button variant="outline" size="sm" onClick={() => onReject(request.id)} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button variant="success" size="sm" onClick={() => onApprove(request.id)}>
                  Approve
                </Button>
              )}
            </>
          )}
        </div>

      </div>
    </Card>
  );
};
export default LeaveRequestCard;
