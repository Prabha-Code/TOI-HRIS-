import React, { useState, useEffect } from 'react';
import { LeaveType, EmployeeBalances, LeaveRequest } from '../../types/leave';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { calculateDuration } from '../../utils/date';
import { validateLeaveRequest, ValidationResult } from '../../utils/validation';

interface LeaveRequestFormProps {
  balances: EmployeeBalances;
  existingRequests: LeaveRequest[];
  employeeId: string;
  onSubmit: (leaveType: LeaveType, startDate: string, endDate: string, reason: string) => boolean | Promise<boolean>;
  onCancel?: () => void;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  balances,
  existingRequests,
  employeeId,
  onSubmit,
  onCancel
}) => {
  const [leaveType, setLeaveType] = useState<string>('annual');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  
  const [errors, setErrors] = useState<ValidationResult['errors']>({});

  // Auto-calculate duration when start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateDuration(startDate, endDate);
      setDuration(days);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLeaveRequest(
      { leaveType, startDate, endDate, reason },
      balances,
      existingRequests,
      employeeId
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const success = await onSubmit(leaveType as LeaveType, startDate, endDate, reason);
    if (success) {
      // Clear form
      setStartDate('');
      setEndDate('');
      setReason('');
      setDuration(0);
    }
  };

  const leaveOptions = [
    { value: 'annual', label: `Annual Leave (Remaining: ${balances.annual.remaining} days)` },
    { value: 'sick', label: `Sick Leave (Remaining: ${balances.sick.remaining} days)` },
    { value: 'personal', label: `Personal Leave (Remaining: ${balances.personal.remaining} days)` }
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Select
        label="Leave Type"
        options={leaveOptions}
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
        error={errors.leaveType}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={errors.startDate}
          min={new Date().toISOString().split('T')[0]}
        />

        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          error={errors.endDate}
          min={startDate || new Date().toISOString().split('T')[0]}
        />
      </div>

      {duration > 0 && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Calculated Duration
          </span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
            {duration} {duration === 1 ? 'day' : 'days'}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor="leave-reason"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-text)'
          }}
        >
          Reason for Leave
        </label>
        <textarea
          id="leave-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please explain the reason for your leave request..."
          rows={3}
          style={{
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: '8px',
            border: `1px solid ${errors.reason ? 'var(--color-danger)' : 'var(--color-border)'}`,
            backgroundColor: '#FFFFFF',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'all 0.15s ease-in-out',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = errors.reason ? 'var(--color-danger)' : 'var(--color-primary)';
            e.currentTarget.style.boxShadow = errors.reason
              ? '0 0 0 3px rgba(220, 38, 38, 0.2)'
              : '0 0 0 3px rgba(79, 70, 229, 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.reason ? 'var(--color-danger)' : 'var(--color-border)';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        />
        {errors.reason && (
          <span style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 500 }}>
            {errors.reason}
          </span>
        )}
      </div>

      {errors.general && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            color: 'var(--color-danger)',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          {errors.general}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          Submit Leave Request
        </Button>
      </div>
    </form>
  );
};
export default LeaveRequestForm;
