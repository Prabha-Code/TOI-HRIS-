import { Employee, EmployeeBalances, LeaveRequest, LeaveType, PayrollRun, Role } from '../types/leave';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'peopleos_api_token';
const ROLE_KEY = 'peopleos_current_role';

const demoAccounts: Record<Role, { email: string; password: string }> = {
  employee: { email: 'employee@example.com', password: 'password123' },
  manager: { email: 'manager@example.com', password: 'password123' },
  hr: { email: 'hr@example.com', password: 'password123' },
};

type ApiResult<T> = { success: boolean; message?: string } & T;

const emptyBalances: EmployeeBalances = {
  annual: { total: 30, used: 0, remaining: 30 },
  sick: { total: 10, used: 0, remaining: 10 },
  personal: { total: 5, used: 0, remaining: 5 },
};

const normalizeDate = (value: string) => value ? value.slice(0, 10) : '';

const toBalances = (leaveBalance?: Record<LeaveType, number>): EmployeeBalances => {
  const totals = { annual: 30, sick: 10, personal: 5 };
  if (!leaveBalance) return emptyBalances;

  return {
    annual: { total: totals.annual, used: totals.annual - (leaveBalance.annual ?? totals.annual), remaining: leaveBalance.annual ?? totals.annual },
    sick: { total: totals.sick, used: totals.sick - (leaveBalance.sick ?? totals.sick), remaining: leaveBalance.sick ?? totals.sick },
    personal: { total: totals.personal, used: totals.personal - (leaveBalance.personal ?? totals.personal), remaining: leaveBalance.personal ?? totals.personal },
  };
};

const toEmployee = (data: any): Employee => ({
  id: data.id || data._id,
  name: data.name,
  email: data.email,
  role: data.role,
  title: data.title || 'Employee',
  department: data.department || 'Unassigned',
  avatar: data.avatar,
  balances: toBalances(data.leaveBalance),
});

const toLeaveRequest = (data: any): LeaveRequest => {
  const employee = typeof data.employeeId === 'object' ? data.employeeId : data.employee;
  const employeeId = employee?.id || employee?._id || data.employeeId;

  return {
    id: data.id || data._id,
    employeeId,
    employeeName: employee?.name || 'Employee',
    employeeRole: employee?.title || employee?.department || 'Employee',
    leaveType: data.leaveType,
    startDate: normalizeDate(data.startDate),
    endDate: normalizeDate(data.endDate),
    duration: data.numberOfDays || data.duration || 0,
    reason: data.reason,
    status: data.status,
    createdDate: normalizeDate(data.createdAt) || normalizeDate(new Date().toISOString()),
    rejectionReason: data.approverNotes,
  };
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new Error(body.message || 'API request failed');
  }

  return body as T;
};

export const api = {
  getStoredRole: (): Role => (localStorage.getItem(ROLE_KEY) as Role) || 'employee',

  login: async (email: string, password: string): Promise<Employee> => {
    const response = await request<ApiResult<{ token: string; user: any }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(ROLE_KEY, response.user.role);
    return toEmployee(response.user);
  },

  loginAsRole: async (role: Role): Promise<Employee> => {
    const account = demoAccounts[role];
    return api.login(account.email, account.password);
  },

  loadWorkspace: async () => {
    const [me, employees, leaves] = await Promise.all([
      request<ApiResult<{ user: any }>>('/auth/me'),
      request<ApiResult<{ employees: any[] }>>('/employees'),
      request<ApiResult<{ leaves: any[] }>>('/leaves'),
    ]);

    return {
      currentUser: toEmployee(me.user),
      currentRole: me.user.role as Role,
      employees: employees.employees.map(toEmployee),
      requests: leaves.leaves.map(toLeaveRequest),
    };
  },

  addEmployee: async (employee: Omit<Employee, 'id' | 'balances'>) => {
    await request('/employees', {
      method: 'POST',
      body: JSON.stringify({
        ...employee,
        email: employee.email || `${employee.name.trim().toLowerCase().replace(/\s+/g, '.')}@peopleos.local`,
      }),
    });
  },

  updateEmployee: async (employeeId: string, updates: Omit<Employee, 'id' | 'balances'>) => {
    await request(`/employees/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updates,
        email: updates.email || `${updates.name.trim().toLowerCase().replace(/\s+/g, '.')}@peopleos.local`,
      }),
    });
  },

  deleteEmployee: async (employeeId: string) => {
    await request(`/employees/${employeeId}`, { method: 'DELETE' });
  },

  submitLeave: async (leaveType: LeaveType, startDate: string, endDate: string, reason: string) => {
    await request('/leaves/request', {
      method: 'POST',
      body: JSON.stringify({ leaveType, startDate, endDate, reason }),
    });
  },

  approveLeave: async (leaveId: string) => {
    await request('/leaves/approve', {
      method: 'POST',
      body: JSON.stringify({ leaveId }),
    });
  },

  rejectLeave: async (leaveId: string, approverNotes?: string) => {
    await request('/leaves/reject', {
      method: 'POST',
      body: JSON.stringify({ leaveId, approverNotes }),
    });
  },

  updateLeave: async (leaveId: string, updates: Pick<LeaveRequest, 'leaveType' | 'startDate' | 'endDate' | 'reason'>) => {
    await request(`/leaves/${leaveId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteLeave: async (leaveId: string) => {
    await request(`/leaves/${leaveId}`, { method: 'DELETE' });
  },

  addPayrollRun: async (payrollRun: Omit<PayrollRun, 'id'>) => {
    await request('/payroll', {
      method: 'POST',
      body: JSON.stringify(payrollRun),
    });
  },

  updatePayrollRun: async (id: string, payrollRun: Omit<PayrollRun, 'id'>) => {
    await request(`/payroll/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payrollRun),
    });
  },

  deletePayrollRun: async (id: string) => {
    await request(`/payroll/${id}`, { method: 'DELETE' });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
