import { useState, useEffect, useCallback } from 'react';
import { LeaveRequest, Employee, Role, LeaveType } from '../types/leave';
import { leaveService } from '../services/leaveService';
import { storage } from '../services/storage';

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
  const loadData = useCallback((roleOverride?: Role) => {
    try {
      setLoading(true);
      setError(null);
      
      const allRequests = leaveService.getRequests();
      const allEmployees = leaveService.getEmployees();
      const activeRole = roleOverride || storage.getCurrentRole();
      const activeUserId = storage.getCurrentUserId();
      const activeUser = leaveService.getEmployeeById(activeUserId);

      setRequests(allRequests);
      setEmployees(allEmployees);
      setCurrentRole(activeRole);
      setCurrentUser(activeUser || null);
    } catch (err) {
      console.error(err);
      setError('Could not load leave request data. Please try resetting.');
      addToast('Failed to load application data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle role switching
  const switchRole = useCallback((role: Role) => {
    storage.setCurrentRole(role);
    loadData(role);
    addToast(`Switched view to ${role.toUpperCase()} dashboard.`, 'info');
  }, [loadData, addToast]);

  // Submit new leave request
  const submitRequest = useCallback((
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ): boolean => {
    if (!currentUser) {
      addToast('No active user profile selected.', 'error');
      return false;
    }

    const result = leaveService.submitRequest(
      currentUser.id,
      leaveType,
      startDate,
      endDate,
      reason
    );

    if (result.success) {
      addToast('Leave request submitted successfully!', 'success');
      loadData();
      return true;
    } else {
      addToast(result.error || 'Failed to submit leave request.', 'error');
      return false;
    }
  }, [currentUser, loadData, addToast]);

  const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'balances'>): boolean => {
    const result = leaveService.addEmployee(employee);
    if (result.success) {
      addToast('Employee added successfully.', 'success');
      loadData();
      return true;
    }
    addToast(result.error || 'Failed to add employee.', 'error');
    return false;
  }, [loadData, addToast]);

  const updateEmployee = useCallback((employeeId: string, updates: Omit<Employee, 'id' | 'balances'>): boolean => {
    const result = leaveService.updateEmployee(employeeId, updates);
    if (result.success) {
      addToast('Employee updated successfully.', 'success');
      loadData();
      return true;
    }
    addToast(result.error || 'Failed to update employee.', 'error');
    return false;
  }, [loadData, addToast]);

  const deleteEmployee = useCallback((employeeId: string): boolean => {
    const result = leaveService.deleteEmployee(employeeId);
    if (result.success) {
      addToast('Employee deleted successfully.', 'success');
      loadData();
      return true;
    }
    addToast(result.error || 'Failed to delete employee.', 'error');
    return false;
  }, [loadData, addToast]);

  // Approve a leave request
  const approveRequest = useCallback((requestId: string): boolean => {
    const result = leaveService.approveRequest(requestId);
    if (result.success) {
      addToast('Leave request approved successfully.', 'success');
      loadData();
      return true;
    } else {
      addToast(result.error || 'Failed to approve request.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  // Reject a leave request
  const rejectRequest = useCallback((requestId: string, rejectionReason?: string): boolean => {
    const result = leaveService.rejectRequest(requestId, rejectionReason);
    if (result.success) {
      addToast('Leave request rejected.', 'warning');
      loadData();
      return true;
    } else {
      addToast(result.error || 'Failed to reject request.', 'error');
      return false;
    }
  }, [loadData, addToast]);

  const updateRequest = useCallback((
    requestId: string,
    updates: Pick<LeaveRequest, 'leaveType' | 'startDate' | 'endDate' | 'reason'>
  ): boolean => {
    const result = leaveService.updateRequest(requestId, updates);
    if (result.success) {
      addToast('Leave request updated successfully.', 'success');
      loadData();
      return true;
    }
    addToast(result.error || 'Failed to update leave request.', 'error');
    return false;
  }, [loadData, addToast]);

  const deleteRequest = useCallback((requestId: string): boolean => {
    const result = leaveService.deleteRequest(requestId);
    if (result.success) {
      addToast('Leave request deleted successfully.', 'success');
      loadData();
      return true;
    }
    addToast(result.error || 'Failed to delete leave request.', 'error');
    return false;
  }, [loadData, addToast]);

  // Reset demo storage data
  const resetDemo = useCallback(() => {
    storage.resetAll();
    loadData();
    addToast('Demo application data reset to initial seed values.', 'success');
  }, [loadData, addToast]);

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
