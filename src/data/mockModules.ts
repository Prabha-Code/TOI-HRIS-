import { Employee } from '../types/leave';

export const teamMetrics = [
  { id: 'team-engineering', name: 'Engineering', lead: 'Arjun Mehta', members: 24, capacity: 88, health: 'Healthy' },
  { id: 'team-design', name: 'Product Design', lead: 'Ananya Sharma', members: 9, capacity: 76, health: 'Watch' },
  { id: 'team-hr', name: 'Human Resources', lead: 'Priya Nair', members: 12, capacity: 91, health: 'Healthy' },
  { id: 'team-qa', name: 'Quality Assurance', lead: 'Amit Patel', members: 11, capacity: 82, health: 'Healthy' }
];

export const orgNodes = [
  { level: 'Executive', people: ['Priya Nair'], note: 'People strategy and compliance ownership' },
  { level: 'Managers', people: ['Arjun Mehta', 'Meera Krishnan'], note: 'Department execution and approvals' },
  { level: 'Individual Contributors', people: ['Ananya Sharma', 'Rahul Menon', 'Amit Patel'], note: 'Product, engineering, and QA delivery' }
];

export const performanceCycles = [
  { id: 'perf-ananya', employee: 'Ananya Sharma', manager: 'Arjun Mehta', score: 82, status: 'In review', goalProgress: 85 },
  { id: 'perf-rahul', employee: 'Rahul Menon', manager: 'Arjun Mehta', score: 91, status: 'Completed', goalProgress: 94 },
  { id: 'perf-amit', employee: 'Amit Patel', manager: 'Arjun Mehta', score: 78, status: 'Calibration', goalProgress: 72 },
  { id: 'perf-meera', employee: 'Meera Krishnan', manager: 'Priya Nair', score: 88, status: 'Completed', goalProgress: 89 }
];

export const recruitmentPipeline = [
  { id: 'job-frontend', role: 'Frontend Engineer', department: 'Engineering', candidates: 12, stage: 'Technical interviews', owner: 'Arjun Mehta' },
  { id: 'job-designer', role: 'Product Designer', department: 'Product Design', candidates: 8, stage: 'Portfolio review', owner: 'Ananya Sharma' },
  { id: 'job-hr-ops', role: 'HR Operations Associate', department: 'Human Resources', candidates: 6, stage: 'Offer approval', owner: 'Priya Nair' },
  { id: 'job-qa', role: 'QA Automation Engineer', department: 'Quality Assurance', candidates: 11, stage: 'Screening', owner: 'Amit Patel' }
];

export const payrollRuns = [
  { id: 'payroll-aug-2026', month: 'August 2026', employees: 500, grossPay: 'INR 4.82 Cr', status: 'Draft', dueDate: '2026-08-28' },
  { id: 'payroll-jul-2026', month: 'July 2026', employees: 498, grossPay: 'INR 4.74 Cr', status: 'Paid', dueDate: '2026-07-30' },
  { id: 'payroll-jun-2026', month: 'June 2026', employees: 491, grossPay: 'INR 4.69 Cr', status: 'Paid', dueDate: '2026-06-28' }
];

export const getDepartmentCount = (employees: Employee[], department: string) =>
  employees.filter((employee) => employee.department === department).length;
