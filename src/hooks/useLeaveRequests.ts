import { useState, useEffect, useCallback } from 'react';
import { LeaveRequest, Employee, Role, LeaveType } from '../types/leave';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useLeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentRole, setCurrentRole] = useState<Role>('employee');
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notifications helpers
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch/load data from storage
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const workspace = await api.loadWorkspace();
      setRequests(workspace.requests);
      setEmployees(workspace.employees);
      setCurrentRole(workspace.currentRole);
      setCurrentUser(workspace.currentUser);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Could not load application data.');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    if (localStorage.getItem('peopleos_api_token')) {
      void loadData();
    } else {
      setLoading(false);
    }
  }, [loadData]);

  // Handle role switching
  const switchRole = useCallback(async (role: Role): Promise<boolean> => {
    try {
      setLoading(true);
      await api.loginAsRole(role);
      await loadData();
      addToast(`Signed in as ${role.toUpperCase()}.`, 'success');
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Could not sign in.', 'error');
      setLoading(false);
      return false;
    }
  }, [loadData, addToast]);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await api.login(email, password);
      await loadData();
      addToast('Signed in successfully.', 'success');
      return true;
    } catch (err) {
      api.logout();
      setCurrentUser(null);
      setLoading(false);
      addToast(err instanceof Error ? err.message : 'Could not sign in.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  // Submit new leave request
  const submitRequest = useCallback(async (
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ): Promise<boolean> => {
    if (!currentUser) {
      addToast('No active user profile selected.', 'error');
      return false;
    }

    try {
      await api.submitLeave(leaveType, startDate, endDate, reason);
      addToast('Leave request submitted successfully!', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to submit leave request.', 'error');
      return false;
    }
  }, [currentUser, loadData, addToast]);

  const addEmployee = useCallback(async (employee: Omit<Employee, 'id' | 'balances'>): Promise<boolean> => {
    try {
      await api.addEmployee(employee);
      addToast('Employee added successfully.', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to add employee.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  const updateEmployee = useCallback(async (employeeId: string, updates: Omit<Employee, 'id' | 'balances'>): Promise<boolean> => {
    try {
      await api.updateEmployee(employeeId, updates);
      addToast('Employee updated successfully.', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update employee.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  const deleteEmployee = useCallback(async (employeeId: string): Promise<boolean> => {
    try {
      await api.deleteEmployee(employeeId);
      addToast('Employee deleted successfully.', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete employee.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  // Approve a leave request
  const approveRequest = useCallback(async (requestId: string): Promise<boolean> => {
    try {
      await api.approveLeave(requestId);
      addToast('Leave request approved successfully.', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to approve request.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  // Reject a leave request
  const rejectRequest = useCallback(async (requestId: string, rejectionReason?: string): Promise<boolean> => {
    try {
      await api.rejectLeave(requestId, rejectionReason);
      addToast('Leave request rejected.', 'warning');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to reject request.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  const updateRequest = useCallback(async (
    requestId: string,
    updates: Pick<LeaveRequest, 'leaveType' | 'startDate' | 'endDate' | 'reason'>
  ): Promise<boolean> => {
    try {
      await api.updateLeave(requestId, updates);
      addToast('Leave request updated successfully.', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update leave request.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  const deleteRequest = useCallback(async (requestId: string): Promise<boolean> => {
    try {
      await api.deleteLeave(requestId);
      addToast('Leave request deleted successfully.', 'success');
      await loadData();
      return true;
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete leave request.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  // Reset demo storage data
  const resetDemo = useCallback(() => {
    api.logout();
    localStorage.removeItem('peopleos_current_role');
    setCurrentUser(null);
    setRequests([]);
    setEmployees([]);
    addToast('Signed out. Choose a role to sign in again.', 'info');
  }, [addToast]);

  return {
    requests,
    employees,
    currentRole,
    currentUser,
    loading,
    error,
    toasts,
    addToast,
    dismissToast,
    signIn,
    switchRole,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    submitRequest,
    approveRequest,
    rejectRequest,
    updateRequest,
    deleteRequest,
    resetDemo,
    reload: loadData
  };
};
export type UseLeaveRequestsType = ReturnType<typeof useLeaveRequests>;
