import { Employee, LeaveRequest, Role } from '../types/leave';
import { SEED_EMPLOYEES, SEED_LEAVE_REQUESTS } from '../data/seedData';

const KEYS = {
  EMPLOYEES: 'peopleos_employees',
  LEAVE_REQUESTS: 'peopleos_leave_requests',
  CURRENT_ROLE: 'peopleos_current_role',
  CURRENT_USER_ID: 'peopleos_current_user_id'
};

export const storage = {
  getEmployees: (): Employee[] => {
    try {
      const data = localStorage.getItem(KEYS.EMPLOYEES);
      if (!data) {
        localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(SEED_EMPLOYEES));
        return SEED_EMPLOYEES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse employees from localStorage, re-seeding...', e);
      localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(SEED_EMPLOYEES));
      return SEED_EMPLOYEES;
    }
  },

  saveEmployees: (employees: Employee[]): void => {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getLeaveRequests: (): LeaveRequest[] => {
    try {
      const data = localStorage.getItem(KEYS.LEAVE_REQUESTS);
      if (!data) {
        localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify(SEED_LEAVE_REQUESTS));
        return SEED_LEAVE_REQUESTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse leave requests from localStorage, re-seeding...', e);
      localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify(SEED_LEAVE_REQUESTS));
      return SEED_LEAVE_REQUESTS;
    }
  },

  saveLeaveRequests: (requests: LeaveRequest[]): void => {
    localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
  },

  getCurrentRole: (): Role => {
    const role = localStorage.getItem(KEYS.CURRENT_ROLE);
    return (role as Role) || 'employee';
  },

  setCurrentRole: (role: Role): void => {
    localStorage.setItem(KEYS.CURRENT_ROLE, role);
    // Auto-update mock current employee ID
    if (role === 'employee') {
      localStorage.setItem(KEYS.CURRENT_USER_ID, 'emp-ananya');
    } else if (role === 'manager') {
      localStorage.setItem(KEYS.CURRENT_USER_ID, 'emp-arjun');
    } else if (role === 'hr') {
      localStorage.setItem(KEYS.CURRENT_USER_ID, 'emp-priya');
    }
  },

  getCurrentUserId: (): string => {
    const userId = localStorage.getItem(KEYS.CURRENT_USER_ID);
    if (userId) return userId;
    
    // Default to Ananya
    const currentRole = storage.getCurrentRole();
    if (currentRole === 'manager') return 'emp-arjun';
    if (currentRole === 'hr') return 'emp-priya';
    return 'emp-ananya';
  },

  resetAll: (): void => {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(SEED_EMPLOYEES));
    localStorage.setItem(KEYS.LEAVE_REQUESTS, JSON.stringify(SEED_LEAVE_REQUESTS));
    localStorage.setItem(KEYS.CURRENT_ROLE, 'employee');
    localStorage.setItem(KEYS.CURRENT_USER_ID, 'emp-ananya');
  }
};
