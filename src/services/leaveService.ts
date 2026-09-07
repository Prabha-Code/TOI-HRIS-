import { LeaveRequest, Employee, LeaveType } from '../types/leave';
import { storage } from './storage';
import { calculateDuration } from '../utils/date';

export const leaveService = {
  getRequests: (): LeaveRequest[] => {
    return storage.getLeaveRequests();
  },

  getEmployees: (): Employee[] => {
    return storage.getEmployees();
  },

  getEmployeeById: (id: string): Employee | undefined => {
    return storage.getEmployees().find(emp => emp.id === id);
  },

  addEmployee: (
    employee: Omit<Employee, 'id' | 'balances'>
  ): { success: boolean; employee?: Employee; error?: string } => {
    const employees = storage.getEmployees();
    const nameExists = employees.some(emp => emp.name.trim().toLowerCase() === employee.name.trim().toLowerCase());

    if (!employee.name.trim() || !employee.title.trim() || !employee.department.trim()) {
      return { success: false, error: 'Name, title, and department are required.' };
    }

    if (nameExists) {
      return { success: false, error: 'An employee with this name already exists.' };
    }

    const newEmployee: Employee = {
      ...employee,
      id: `emp-${Date.now()}`,
      avatar: employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=4F46E5&color=fff`,
      balances: {
        annual: { total: 30, used: 0, remaining: 30 },
        sick: { total: 10, used: 0, remaining: 10 },
        personal: { total: 5, used: 0, remaining: 5 }
      }
    };

    storage.saveEmployees([newEmployee, ...employees]);
    return { success: true, employee: newEmployee };
  },

  updateEmployee: (
    employeeId: string,
    updates: Omit<Employee, 'id' | 'balances'>
  ): { success: boolean; error?: string } => {
    const employees = storage.getEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);

    if (employeeIndex === -1) {
      return { success: false, error: 'Employee not found.' };
    }

    if (!updates.name.trim() || !updates.title.trim() || !updates.department.trim()) {
      return { success: false, error: 'Name, title, and department are required.' };
    }

    const updatedEmployee: Employee = {
      ...employees[employeeIndex],
      ...updates,
      avatar: updates.avatar || employees[employeeIndex].avatar
    };

    employees[employeeIndex] = updatedEmployee;
    storage.saveEmployees(employees);

    const requests = storage.getLeaveRequests().map(req => (
      req.employeeId === employeeId
        ? { ...req, employeeName: updatedEmployee.name, employeeRole: updatedEmployee.title }
        : req
    ));
    storage.saveLeaveRequests(requests);

    return { success: true };
  },

  deleteEmployee: (employeeId: string): { success: boolean; error?: string } => {
    const employees = storage.getEmployees();
    const employee = employees.find(emp => emp.id === employeeId);

    if (!employee) {
      return { success: false, error: 'Employee not found.' };
    }

    const protectedIds = ['emp-ananya', 'emp-arjun', 'emp-priya'];
    if (protectedIds.includes(employeeId)) {
      return { success: false, error: 'Demo persona users cannot be deleted.' };
    }

    storage.saveEmployees(employees.filter(emp => emp.id !== employeeId));
    storage.saveLeaveRequests(storage.getLeaveRequests().filter(req => req.employeeId !== employeeId));
    return { success: true };
  },

  submitRequest: (
    employeeId: string,
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ): { success: boolean; request?: LeaveRequest; error?: string } => {
    const employees = storage.getEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      return { success: false, error: 'Employee not found.' };
    }

    const duration = calculateDuration(startDate, endDate);
    if (duration <= 0) {
      return { success: false, error: 'Invalid dates.' };
    }

    // Check balance
    const balance = employee.balances[leaveType];
    if (balance.remaining < duration) {
      return { success: false, error: 'Insufficient leave balance.' };
    }

    const newRequest: LeaveRequest = {
      id: `req-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.title,
      leaveType,
      startDate,
      endDate,
      duration,
      reason,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    const requests = storage.getLeaveRequests();
    requests.unshift(newRequest); // Add to beginning
    storage.saveLeaveRequests(requests);

    return { success: true, request: newRequest };
  },

  approveRequest: (
    requestId: string
  ): { success: boolean; error?: string } => {
    const requests = storage.getLeaveRequests();
    const reqIndex = requests.findIndex(req => req.id === requestId);

    if (reqIndex === -1) {
      return { success: false, error: 'Leave request not found.' };
    }

    const request = requests[reqIndex];
    if (request.status !== 'pending') {
      return { success: false, error: 'Request is already processed.' };
    }

    // Update employee balance
    const employees = storage.getEmployees();
    const empIndex = employees.findIndex(emp => emp.id === request.employeeId);

    if (empIndex === -1) {
      return { success: false, error: 'Associated employee not found.' };
    }

    const employee = employees[empIndex];
    const balance = employee.balances[request.leaveType];

    // Double check balance just in case
    if (balance.remaining < request.duration) {
      return { success: false, error: 'Insufficient leave balance remaining for this employee.' };
    }

    // Deduct balance
    balance.remaining -= request.duration;
    balance.used += request.duration;

    // Update status to approved
    request.status = 'approved';

    // Save changes
    employees[empIndex] = employee;
    requests[reqIndex] = request;

    storage.saveEmployees(employees);
    storage.saveLeaveRequests(requests);

    return { success: true };
  },

  rejectRequest: (
    requestId: string,
    rejectionReason?: string
  ): { success: boolean; error?: string } => {
    const requests = storage.getLeaveRequests();
    const reqIndex = requests.findIndex(req => req.id === requestId);

    if (reqIndex === -1) {
      return { success: false, error: 'Leave request not found.' };
    }

    const request = requests[reqIndex];
    if (request.status !== 'pending') {
      return { success: false, error: 'Request is already processed.' };
    }

    // Update status to rejected and save reason
    request.status = 'rejected';
    if (rejectionReason && rejectionReason.trim() !== '') {
      request.rejectionReason = rejectionReason.trim();
    }

    requests[reqIndex] = request;
    storage.saveLeaveRequests(requests);

    return { success: true };
  },

  updateRequest: (
    requestId: string,
    updates: Pick<LeaveRequest, 'leaveType' | 'startDate' | 'endDate' | 'reason'>
  ): { success: boolean; error?: string } => {
    const requests = storage.getLeaveRequests();
    const reqIndex = requests.findIndex(req => req.id === requestId);

    if (reqIndex === -1) {
      return { success: false, error: 'Leave request not found.' };
    }

    if (requests[reqIndex].status !== 'pending') {
      return { success: false, error: 'Only pending requests can be edited.' };
    }

    const duration = calculateDuration(updates.startDate, updates.endDate);
    if (duration <= 0) {
      return { success: false, error: 'Invalid dates.' };
    }

    const employee = storage.getEmployees().find(emp => emp.id === requests[reqIndex].employeeId);
    if (!employee) {
      return { success: false, error: 'Associated employee not found.' };
    }

    if (employee.balances[updates.leaveType].remaining < duration) {
      return { success: false, error: 'Insufficient leave balance.' };
    }

    requests[reqIndex] = {
      ...requests[reqIndex],
      ...updates,
      duration
    };
    storage.saveLeaveRequests(requests);
    return { success: true };
  },

  deleteRequest: (requestId: string): { success: boolean; error?: string } => {
    const requests = storage.getLeaveRequests();
    const request = requests.find(req => req.id === requestId);

    if (!request) {
      return { success: false, error: 'Leave request not found.' };
    }

    if (request.status === 'approved') {
      const employees = storage.getEmployees();
      const employeeIndex = employees.findIndex(emp => emp.id === request.employeeId);

      if (employeeIndex !== -1) {
        const balance = employees[employeeIndex].balances[request.leaveType];
        balance.used = Math.max(0, balance.used - request.duration);
        balance.remaining = Math.min(balance.total, balance.remaining + request.duration);
        storage.saveEmployees(employees);
      }
    }

    storage.saveLeaveRequests(requests.filter(req => req.id !== requestId));
    return { success: true };
  }
};
