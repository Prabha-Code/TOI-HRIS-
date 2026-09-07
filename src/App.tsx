import { useState } from 'react';
import { useLeaveRequests } from './hooks/useLeaveRequests';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Login } from './pages/Login';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { HRDashboard } from './pages/HRDashboard';
import { LeaveManagement } from './pages/LeaveManagement';
import {
  EmployeesPage,
  OrganizationPage,
  PayrollPage,
  PerformancePage,
  RecruitmentPage,
  TeamsPage
} from './pages/PeopleOpsModules';
import { Toast } from './components/ui/Toast';
import { Button } from './components/ui/Button';
import { LogOut } from 'lucide-react';
import { api } from './services/api';

function App() {
  const {
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
    resetDemo
  } = useLeaveRequests();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [showLogin, setShowLogin] = useState<boolean>(() => !localStorage.getItem('peopleos_api_token'));

  const handleLogin = async (email: string, password: string) => {
    const success = await signIn(email, password);
    if (success) setShowLogin(false);
    return success;
  };

  const handleDemoRole = async (role: typeof currentRole) => {
    const success = await switchRole(role);
    if (success) setShowLogin(false);
    return success;
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to default seed values?')) {
      resetDemo();
      setShowLogin(true);
      setActiveTab('dashboard');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #E2E8F0', 
            borderTop: '3px solid var(--color-primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 16px auto' 
          }} />
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Initializing PeopleOS...
          </p>
        </div>
      </div>
    );
  }

  if (showLogin || !currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} onDemoRole={handleDemoRole} error={error} />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // Renders the main dashboard depending on selected role
  const renderDashboard = () => {
    switch (currentRole) {
      case 'hr':
        return (
          <HRDashboard
            requests={requests}
            addToast={addToast}
            onNavigate={setActiveTab}
          />
        );
      case 'manager':
        return (
          <ManagerDashboard
            requests={requests}
            employees={employees}
            onApproveLeave={approveRequest}
            onRejectLeave={rejectRequest}
            addToast={addToast}
            onNavigate={setActiveTab}
          />
        );
      case 'employee':
      default:
        return (
          <EmployeeDashboard
            currentUser={currentUser}
            requests={requests}
            onSubmitLeave={submitRequest}
            addToast={addToast}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  const renderActiveTabContent = () => {
    if (activeTab === 'dashboard') {
      return renderDashboard();
    }

    if (activeTab === 'employees') {
      return (
        <EmployeesPage
          employees={employees}
          requests={requests}
          addToast={addToast}
          onAddEmployee={addEmployee}
          onUpdateEmployee={updateEmployee}
          onDeleteEmployee={deleteEmployee}
        />
      );
    }

    if (activeTab === 'teams') {
      return <TeamsPage employees={employees} requests={requests} addToast={addToast} />;
    }

    if (activeTab === 'organization') {
      return <OrganizationPage employees={employees} requests={requests} addToast={addToast} />;
    }

    if (activeTab === 'leave') {
      return (
        <LeaveManagement
          currentRole={currentRole}
          currentUser={currentUser}
          requests={requests}
          employees={employees}
          onSubmitLeave={submitRequest}
          onApproveLeave={approveRequest}
          onRejectLeave={rejectRequest}
          onUpdateLeave={updateRequest}
          onDeleteLeave={deleteRequest}
        />
      );
    }

    if (activeTab === 'performance') {
      return <PerformancePage employees={employees} requests={requests} addToast={addToast} />;
    }

    if (activeTab === 'recruitment') {
      return <RecruitmentPage employees={employees} requests={requests} addToast={addToast} />;
    }

    if (activeTab === 'payroll') {
      return <PayrollPage employees={employees} requests={requests} addToast={addToast} />;
    }

    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h3>Module not found</h3>
        <p>Select a module from the sidebar to continue.</p>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar navigation */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onReset={handleResetData}
      />

      {/* Main app container */}
      <div 
        style={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: sidebarCollapsed ? '80px' : '260px',
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: 0 // Prevent content overflow in flex container
        }}
      >
        <Topbar
          currentRole={currentRole}
          currentUser={currentUser}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Global Change Role Back button & Log out helper */}
        <div style={{ 
          height: '40px', 
          backgroundColor: '#FFFBEB', 
          borderBottom: '1px solid #FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          marginTop: '70px', // Topbar offset
          boxSizing: 'border-box'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#B45309' }}>
            🔒 Signed in as {currentRole.toUpperCase()}. Log out to sign in as another role.
          </span>
          <button 
            onClick={() => {
              api.logout();
              setShowLogin(true);
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-primary)', 
              fontSize: '12px', 
              fontWeight: 700, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            <LogOut size={12} />
            Exit Simulation Frame
          </button>
        </div>

        {/* Main scrollable content body */}
        <main
          style={{
            padding: '24px 32px 32px 32px',
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          {error ? (
            <div style={{ padding: '24px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', color: 'var(--color-danger)', textAlign: 'center' }}>
              <h3>System Error</h3>
              <p>{error}</p>
              <Button variant="danger" onClick={handleResetData} style={{ marginTop: '16px' }}>
                Reset Roster & Storage
              </Button>
            </div>
          ) : (
            renderActiveTabContent()
          )}
        </main>
      </div>

      {/* Global popup toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
