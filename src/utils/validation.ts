import { LeaveType, EmployeeBalances, LeaveRequest } from '../types/leave';
import { calculateDuration } from './date';

export interface ValidationResult {
  isValid: boolean;
  errors: {
    leaveType?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
    general?: string;
  };
}

export const validateLeaveRequest = (
  fields: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  },
  balances: EmployeeBalances,
  existingRequests: LeaveRequest[],
  currentEmployeeId: string
): ValidationResult => {
  const errors: ValidationResult['errors'] = {};
  let isValid = true;

  // 1. Leave Type validation
  if (!fields.leaveType) {
    errors.leaveType = 'Leave type is required.';
    isValid = false;
  }

  // 2. Start Date validation
  if (!fields.startDate) {
    errors.startDate = 'Start date is required.';
    isValid = false;
  }

  // 3. End Date validation
  if (!fields.endDate) {
    errors.endDate = 'End date is required.';
    isValid = false;
  }

  // If both dates are provided, do date logic validation
  if (fields.startDate && fields.endDate) {
    const start = new Date(fields.startDate);
    const end = new Date(fields.endDate);
    
    // Set time to midnight for comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime())) {
      errors.startDate = 'Invalid start date format.';
      isValid = false;
    }

    if (isNaN(end.getTime())) {
      errors.endDate = 'Invalid end date format.';
      isValid = false;
    }

    if (isValid) {
      if (end < start) {
        errors.endDate = 'End date cannot be before the start date.';
        isValid = false;
      }
      
      // Calculate duration
      const duration = calculateDuration(fields.startDate, fields.endDate);
      
      if (duration <= 0) {
        errors.general = 'Duration must be at least 1 day.';
        isValid = false;
      }

      // Check balance
      if (fields.leaveType) {
        const type = fields.leaveType as LeaveType;
        const balance = balances[type];
        if (balance && balance.remaining < duration) {
          errors.general = `Insufficient leave balance. You have ${balance.remaining} days remaining for ${type} leave, but requested ${duration} days.`;
          isValid = false;
        }
      }

      // Check overlapping requests for this employee
      if (isValid) {
        const hasOverlap = existingRequests
          .filter(req => req.employeeId === currentEmployeeId && req.status !== 'rejected')
          .some(req => {
            const reqStart = new Date(req.startDate);
            const reqEnd = new Date(req.endDate);
            reqStart.setHours(0, 0, 0, 0);
            reqEnd.setHours(0, 0, 0, 0);
            
            return start <= reqEnd && end >= reqStart;
          });
          
        if (hasOverlap) {
          errors.general = 'You already have a pending or approved leave request overlapping with these dates.';
          isValid = false;
        }
      }
    }
  }

  // 4. Reason validation
  if (!fields.reason || fields.reason.trim().length === 0) {
    errors.reason = 'Reason for leave is required.';
    isValid = false;
  } else if (fields.reason.trim().length < 5) {
    errors.reason = 'Please provide a more detailed reason (at least 5 characters).';
    isValid = false;
  }

  return { isValid, errors };
};
