import React from 'react';
import { LeaveStatus } from '../../types/leave';
import { Badge } from '../ui/Badge';

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
}

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'rejected':
      return <Badge variant="danger">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="warning">Pending Approval</Badge>;
  }
};
export default LeaveStatusBadge;
