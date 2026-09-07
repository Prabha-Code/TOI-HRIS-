import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Briefcase,
  Building2,
  CreditCard,
  Download,
  Filter,
  Network,
  Plus,
  Search,
  Send,
  TrendingUp,
  UserPlus,
  Users
} from 'lucide-react';
import { Employee, LeaveRequest } from '../types/leave';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  getDepartmentCount,
  orgNodes,
  payrollRuns,
  performanceCycles,
  recruitmentPipeline,
  teamMetrics
} from '../data/mockModules';
import { formatDate } from '../utils/date';
import { downloadTextFile } from '../utils/download';

type ToastFn = (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
type EmployeeFormData = Omit<Employee, 'id' | 'balances'>;

interface ModuleProps {
  employees: Employee[];
  requests: LeaveRequest[];
  addToast: ToastFn;
  onAddEmployee?: (employee: EmployeeFormData) => boolean;
  onUpdateEmployee?: (employeeId: string, updates: EmployeeFormData) => boolean;
  onDeleteEmployee?: (employeeId: string) => boolean;
}

const pageHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap'
};

const searchBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '240px',
  backgroundColor: '#FFFFFF',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  padding: '9px 12px'
};

const inputStyle: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: '13px',
  width: '100%',
  color: 'var(--color-text)',
  fontFamily: 'inherit'
};

const metricCard = (label: string, value: string | number, color = 'var(--color-text)') => (
  <Card padding="18px">
    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
      {label}
    </span>
    <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 800, color }}>{value}</h3>
  </Card>
);

const usePersistentList = <T extends { id: string }>(key: string, seed: T[]) => {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T[] : seed;
    } catch {
      return seed;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  const addItem = (item: Omit<T, 'id'>) => {
    setItems(current => [{ ...item, id: `${key}-${Date.now()}` } as T, ...current]);
  };

  const updateItem = (id: string, item: Partial<T>) => {
    setItems(current => current.map(existing => existing.id === id ? { ...existing, ...item } : existing));
  };

  const deleteItem = (id: string) => {
    setItems(current => current.filter(existing => existing.id !== id));
  };

  return { items, addItem, updateItem, deleteItem };
};

const emptyEmployeeForm: EmployeeFormData = {
  name: '',
  role: 'employee',
  title: '',
  department: '',
  avatar: ''
};

const fieldStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--color-border)',
  fontSize: '14px',
  fontFamily: 'inherit',
  width: '100%'
};

interface EmployeeEditorProps {
  value: EmployeeFormData;
  setValue: (value: EmployeeFormData) => void;
}

const EmployeeEditor: React.FC<EmployeeEditorProps> = ({ value, setValue }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
      Name
      <input value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} style={fieldStyle} />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
      Role
      <select value={value.role} onChange={(event) => setValue({ ...value, role: event.target.value as Employee['role'] })} style={fieldStyle}>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="hr">HR</option>
      </select>
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
      Title
      <input value={value.title} onChange={(event) => setValue({ ...value, title: event.target.value })} style={fieldStyle} />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
      Department
      <input value={value.department} onChange={(event) => setValue({ ...value, department: event.target.value })} style={fieldStyle} />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, gridColumn: '1 / -1' }}>
      Avatar URL
      <input value={value.avatar || ''} onChange={(event) => setValue({ ...value, avatar: event.target.value })} style={fieldStyle} />
    </label>
  </div>
);

export const EmployeesPage: React.FC<ModuleProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formValue, setFormValue] = useState<EmployeeFormData>(emptyEmployeeForm);
  const departments = ['All', ...Array.from(new Set(employees.map((employee) => employee.department)))];

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const matchesDepartment = department === 'All' || employee.department === department;
    const text = `${employee.name} ${employee.title} ${employee.department}`.toLowerCase();
    return matchesDepartment && text.includes(query.trim().toLowerCase());
  }), [department, employees, query]);

  const openCreate = () => {
    setEditingEmployee(null);
    setFormValue(emptyEmployeeForm);
    setIsEditorOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormValue({
      name: employee.name,
      role: employee.role,
      title: employee.title,
      department: employee.department,
      avatar: employee.avatar || ''
    });
    setIsEditorOpen(true);
  };

  const saveEmployee = () => {
    const success = editingEmployee
      ? onUpdateEmployee?.(editingEmployee.id, formValue)
      : onAddEmployee?.(formValue);

    if (success) {
      setIsEditorOpen(false);
    }
  };

  const deleteEmployee = (employee: Employee) => {
    if (window.confirm(`Delete ${employee.name} and their leave requests?`)) {
      onDeleteEmployee?.(employee.id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Employees</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Search the roster, review roles, and inspect leave balances.
          </p>
        </div>
        <Button onClick={openCreate} style={{ gap: '8px' }}>
          <UserPlus size={16} /> Add Employee
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {metricCard('Directory Size', employees.length)}
        {metricCard('Departments', departments.length - 1, 'var(--color-primary)')}
        {metricCard('Engineering', getDepartmentCount(employees, 'Engineering'), 'var(--color-success)')}
      </div>

      <Card>
        <div style={{ ...pageHeaderStyle, marginBottom: '18px' }}>
          <div style={searchBoxStyle}>
            <Search size={15} style={{ color: 'var(--color-text-secondary)' }} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Filter size={15} style={{ color: 'var(--color-text-secondary)' }} />
            {departments.map((item) => (
              <button
                key={item}
                onClick={() => setDepartment(item)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${department === item ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: department === item ? 'var(--color-primary)' : '#FFFFFF',
                  color: department === item ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '12px'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {filteredEmployees.map((employee) => (
            <div key={employee.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={employee.avatar} alt={employee.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>{employee.name}</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{employee.title}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '12px' }}>
                <Badge variant="info">{employee.department}</Badge>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                  {employee.balances.annual.remaining} annual days left
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <Button variant="outline" size="sm" onClick={() => openEdit(employee)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteEmployee(employee)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        maxWidth="680px"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button onClick={saveEmployee}>{editingEmployee ? 'Update Employee' : 'Create Employee'}</Button>
          </>
        }
      >
        <EmployeeEditor value={formValue} setValue={setFormValue} />
        {!onAddEmployee && (
          <p style={{ margin: '12px 0 0 0', color: 'var(--color-danger)', fontSize: '13px' }}>
            Employee actions are not connected.
          </p>
        )}
      </Modal>
    </div>
  );
};

export const TeamsPage: React.FC<ModuleProps> = ({ requests, addToast }) => {
  const { items: teams, addItem, updateItem, deleteItem } = usePersistentList('peopleos_teams', teamMetrics);
  const pendingCount = requests.filter((request) => request.status === 'pending').length;
  const averageCapacity = teams.length
    ? Math.round(teams.reduce((sum, team) => sum + team.capacity, 0) / teams.length)
    : 0;

  const addTeam = () => {
    const name = window.prompt('Team name');
    if (!name) return;
    const lead = window.prompt('Team lead', 'New Lead') || 'New Lead';
    addItem({ name, lead, members: 1, capacity: 75, health: 'Healthy' });
    addToast('Team added successfully.', 'success');
  };

  const editTeam = (team: typeof teamMetrics[number]) => {
    const members = Number(window.prompt('Members', String(team.members)));
    const capacity = Number(window.prompt('Capacity percent', String(team.capacity)));
    updateItem(team.id, {
      name: window.prompt('Team name', team.name) || team.name,
      lead: window.prompt('Team lead', team.lead) || team.lead,
      members: Number.isFinite(members) ? members : team.members,
      capacity: Number.isFinite(capacity) ? Math.min(100, Math.max(0, capacity)) : team.capacity,
      health: capacity >= 80 ? 'Healthy' : 'Watch'
    });
    addToast('Team updated successfully.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Teams</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Team capacity, ownership, and staffing health.
          </p>
        </div>
        <Button onClick={addTeam} style={{ gap: '8px' }}>
          <Plus size={16} /> Add Team
        </Button>
        <Button variant="outline" onClick={() => addToast('Team planning export prepared.', 'success')} style={{ gap: '8px' }}>
          <Download size={16} /> Export
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {metricCard('Active Teams', teams.length)}
        {metricCard('Pending Leave', pendingCount, 'var(--color-warning)')}
        {metricCard('Avg Capacity', `${averageCapacity}%`, 'var(--color-success)')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {teams.map((team) => (
          <Card key={team.name} title={team.name} subtitle={`Lead: ${team.lead}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Members</span>
                <strong>{team.members}</strong>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>Capacity</span>
                  <strong>{team.capacity}%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${team.capacity}%`, height: '100%', backgroundColor: team.capacity >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }} />
                </div>
              </div>
              <Badge variant={team.health === 'Healthy' ? 'success' : 'warning'}>{team.health}</Badge>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button variant="outline" size="sm" onClick={() => editTeam(team)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => {
                  deleteItem(team.id);
                  addToast('Team deleted successfully.', 'success');
                }}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const OrganizationPage: React.FC<ModuleProps> = ({ employees }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div>
      <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Organization</h1>
      <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
        A working mock organization map with reporting levels.
      </p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      {metricCard('People', employees.length)}
      {metricCard('Levels', orgNodes.length, 'var(--color-primary)')}
      {metricCard('Departments', new Set(employees.map((employee) => employee.department)).size, 'var(--color-success)')}
    </div>
    <Card title="Organization Structure" subtitle="Mocked reporting shape for the prototype">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {orgNodes.map((node, index) => (
          <div key={node.level} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px', alignItems: 'stretch' }}>
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: 'var(--color-primary)', fontWeight: 800 }}>
              {index + 1}. {node.level}
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{node.people.join(', ')}</p>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '13px' }}>{node.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export const PerformancePage: React.FC<ModuleProps> = ({ addToast }) => {
  const { items: cycles, addItem, updateItem, deleteItem } = usePersistentList('peopleos_performance_cycles', performanceCycles);
  const averageScore = cycles.length ? Math.round(cycles.reduce((sum, cycle) => sum + cycle.score, 0) / cycles.length) : 0;

  const addCycle = () => {
    const employee = window.prompt('Employee name');
    if (!employee) return;
    addItem({ employee, manager: 'Arjun Mehta', score: 75, status: 'In review', goalProgress: 70 });
    addToast('Performance cycle added successfully.', 'success');
  };

  const editCycle = (cycle: typeof performanceCycles[number]) => {
    const score = Number(window.prompt('Score', String(cycle.score)));
    const goalProgress = Number(window.prompt('Goal progress', String(cycle.goalProgress)));
    updateItem(cycle.id, {
      employee: window.prompt('Employee', cycle.employee) || cycle.employee,
      manager: window.prompt('Manager', cycle.manager) || cycle.manager,
      score: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : cycle.score,
      goalProgress: Number.isFinite(goalProgress) ? Math.min(100, Math.max(0, goalProgress)) : cycle.goalProgress,
      status: window.prompt('Status', cycle.status) || cycle.status
    });
    addToast('Performance cycle updated successfully.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Performance</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Review cycles, goal progress, and calibration status.
          </p>
        </div>
        <Button onClick={addCycle} style={{ gap: '8px' }}>
          <Plus size={16} /> Add Review
        </Button>
        <Button variant="outline" onClick={() => addToast('Performance review reminders sent.', 'success')} style={{ gap: '8px' }}>
          <Send size={16} /> Send Reminders
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {metricCard('Average Score', `${averageScore}%`, 'var(--color-primary)')}
        {metricCard('Completed', cycles.filter((cycle) => cycle.status === 'Completed').length, 'var(--color-success)')}
        {metricCard('In Progress', cycles.filter((cycle) => cycle.status !== 'Completed').length, 'var(--color-warning)')}
      </div>
      <Card title="Review Cycle Tracker">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Manager</th>
                <th>Score</th>
                <th>Goals</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((cycle) => (
                <tr key={cycle.employee}>
                  <td>{cycle.employee}</td>
                  <td>{cycle.manager}</td>
                  <td><strong>{cycle.score}%</strong></td>
                  <td>{cycle.goalProgress}%</td>
                  <td><Badge variant={cycle.status === 'Completed' ? 'success' : 'warning'}>{cycle.status}</Badge></td>
                  <td>
                    <Button variant="text" size="sm" onClick={() => editCycle(cycle)}>Edit</Button>
                    <Button variant="text" size="sm" onClick={() => {
                      deleteItem(cycle.id);
                      addToast('Performance cycle deleted successfully.', 'success');
                    }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export const RecruitmentPage: React.FC<ModuleProps> = ({ addToast }) => {
  const { items: jobs, addItem, updateItem, deleteItem } = usePersistentList('peopleos_recruitment_pipeline', recruitmentPipeline);

  const addJob = () => {
    const role = window.prompt('Role name');
    if (!role) return;
    addItem({ role, department: 'Engineering', candidates: 0, stage: 'Screening', owner: 'Priya Nair' });
    addToast('Requisition added successfully.', 'success');
  };

  const editJob = (job: typeof recruitmentPipeline[number]) => {
    const candidates = Number(window.prompt('Candidates', String(job.candidates)));
    updateItem(job.id, {
      role: window.prompt('Role', job.role) || job.role,
      department: window.prompt('Department', job.department) || job.department,
      candidates: Number.isFinite(candidates) ? Math.max(0, candidates) : job.candidates,
      stage: window.prompt('Stage', job.stage) || job.stage,
      owner: window.prompt('Owner', job.owner) || job.owner
    });
    addToast('Requisition updated successfully.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Recruitment</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Hiring pipeline, candidate stages, and owners.
          </p>
        </div>
        <Button onClick={addJob} style={{ gap: '8px' }}>
          <Plus size={16} /> New Requisition
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {metricCard('Open Roles', jobs.length)}
        {metricCard('Candidates', jobs.reduce((sum, item) => sum + item.candidates, 0), 'var(--color-primary)')}
        {metricCard('Offer Stage', jobs.filter((item) => item.stage.includes('Offer')).length, 'var(--color-success)')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        {jobs.map((job) => (
          <Card key={job.id} title={job.role} subtitle={job.department}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Candidates</span>
                <strong>{job.candidates}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Owner</span>
                <strong>{job.owner}</strong>
              </div>
              <Badge variant={job.stage.includes('Offer') ? 'success' : 'info'}>{job.stage}</Badge>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button variant="outline" size="sm" onClick={() => editJob(job)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => {
                  deleteItem(job.id);
                  addToast('Requisition deleted successfully.', 'success');
                }}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const PayrollPage: React.FC<ModuleProps> = ({ addToast }) => {
  const { items: runs, addItem, updateItem, deleteItem } = usePersistentList('peopleos_payroll_runs', payrollRuns);
  const currentRun = runs[0] || payrollRuns[0];

  const downloadPayrollReport = (run: typeof payrollRuns[number]) => {
    const report = [
      'PeopleOS Payroll Report',
      `Month: ${run.month}`,
      `Employees: ${run.employees}`,
      `Gross Pay: ${run.grossPay}`,
      `Due Date: ${formatDate(run.dueDate)}`,
      `Status: ${run.status}`
    ].join('\n');

    downloadTextFile(`peopleos-${run.month.toLowerCase().replace(/\s+/g, '-')}-payroll-report.txt`, report);
    addToast(`${run.month} payroll report downloaded.`, 'success');
  };

  const addRun = () => {
    const month = window.prompt('Payroll month', 'September 2026');
    if (!month) return;
    addItem({ month, employees: 500, grossPay: 'INR 4.90 Cr', status: 'Draft', dueDate: '2026-09-28' });
    addToast('Payroll run added successfully.', 'success');
  };

  const editRun = (run: typeof payrollRuns[number]) => {
    const employees = Number(window.prompt('Employees', String(run.employees)));
    updateItem(run.id, {
      month: window.prompt('Month', run.month) || run.month,
      employees: Number.isFinite(employees) ? Math.max(0, employees) : run.employees,
      grossPay: window.prompt('Gross pay', run.grossPay) || run.grossPay,
      status: window.prompt('Status', run.status) || run.status,
      dueDate: window.prompt('Due date YYYY-MM-DD', run.dueDate) || run.dueDate
    });
    addToast('Payroll run updated successfully.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Payroll</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Payroll runs, monthly status, and downloadable reports.
          </p>
        </div>
        <Button onClick={addRun} style={{ gap: '8px' }}>
          <CreditCard size={16} /> Add Payroll Run
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {metricCard('Current Run', currentRun.month)}
        {metricCard('Employees', currentRun.employees, 'var(--color-primary)')}
        {metricCard('Gross Pay', currentRun.grossPay, 'var(--color-success)')}
      </div>
      <Card title="Payroll Runs">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Employees</th>
                <th>Gross Pay</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <td>{run.month}</td>
                  <td>{run.employees}</td>
                  <td>{run.grossPay}</td>
                  <td>{formatDate(run.dueDate)}</td>
                  <td><Badge variant={run.status === 'Paid' ? 'success' : 'warning'}>{run.status}</Badge></td>
                  <td>
                    <Button variant="text" size="sm" onClick={() => editRun(run)}>Edit</Button>
                    <Button variant="text" size="sm" onClick={() => downloadPayrollReport(run)}>
                      Download
                    </Button>
                    <Button variant="text" size="sm" onClick={() => {
                      deleteItem(run.id);
                      addToast('Payroll run deleted successfully.', 'success');
                    }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export const moduleIcons = {
  employees: Users,
  teams: Building2,
  organization: Network,
  performance: TrendingUp,
  recruitment: Briefcase,
  payroll: Award
};
