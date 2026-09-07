export type Role = 'employee' | 'manager' | 'hr';

export type LeaveType = 'annual' | 'sick' | 'personal';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

export interface EmployeeBalances {
  annual: LeaveBalance;
  sick: LeaveBalance;
  personal: LeaveBalance;
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
  role: Role;
  title: string;
  department: string;
  avatar?: string;
  balances: EmployeeBalances;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: LeaveStatus;
  createdDate: string;
  rejectionReason?: string;
}

export interface PayrollRun {
  id: string;
  month: string;
  employees: number;
  grossPay: number;
  status: 'Draft' | 'Processing' | 'Paid';
  dueDate: string;
}
