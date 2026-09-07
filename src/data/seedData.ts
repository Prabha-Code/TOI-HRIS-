import { Employee, LeaveRequest } from '../types/leave';

export const SEED_EMPLOYEES: Employee[] = [
  {
    id: 'emp-ananya',
    name: 'Ananya Sharma',
    role: 'employee',
    title: 'Senior Product Designer',
    department: 'Product Design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    balances: {
      annual: { total: 30, used: 18, remaining: 12 },
      sick: { total: 10, used: 3, remaining: 7 },
      personal: { total: 5, used: 2, remaining: 3 }
    }
  },
  {
    id: 'emp-arjun',
    name: 'Arjun Mehta',
    role: 'manager',
    title: 'Engineering Manager',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    balances: {
      annual: { total: 30, used: 15, remaining: 15 },
      sick: { total: 10, used: 2, remaining: 8 },
      personal: { total: 5, used: 1, remaining: 4 }
    }
  },
  {
    id: 'emp-priya',
    name: 'Priya Nair',
    role: 'hr',
    title: 'HR Director',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    balances: {
      annual: { total: 30, used: 10, remaining: 20 },
      sick: { total: 10, used: 1, remaining: 9 },
      personal: { total: 5, used: 0, remaining: 5 }
    }
  },
  {
    id: 'emp-rahul',
    name: 'Rahul Menon',
    role: 'employee',
    title: 'Software Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    balances: {
      annual: { total: 30, used: 12, remaining: 18 },
      sick: { total: 10, used: 4, remaining: 6 },
      personal: { total: 5, used: 2, remaining: 3 }
    }
  },
  {
    id: 'emp-amit',
    name: 'Amit Patel',
    role: 'employee',
    title: 'QA Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    balances: {
      annual: { total: 30, used: 20, remaining: 10 },
      sick: { total: 10, used: 5, remaining: 5 },
      personal: { total: 5, used: 1, remaining: 4 }
    }
  },
  {
    id: 'emp-meera',
    name: 'Meera Krishnan',
    role: 'employee',
    title: 'HR Business Partner',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
    balances: {
      annual: { total: 30, used: 14, remaining: 16 },
      sick: { total: 10, used: 2, remaining: 8 },
      personal: { total: 5, used: 1, remaining: 4 }
    }
  }
];

export const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'req-1',
    employeeId: 'emp-rahul',
    employeeName: 'Rahul Menon',
    employeeRole: 'Software Engineer',
    leaveType: 'annual',
    startDate: '2026-08-18',
    endDate: '2026-08-20',
    duration: 3,
    reason: 'Family function in Kerala',
    status: 'pending',
    createdDate: '2026-08-12'
  },
  {
    id: 'req-2',
    employeeId: 'emp-amit',
    employeeName: 'Amit Patel',
    employeeRole: 'QA Engineer',
    leaveType: 'sick',
    startDate: '2026-08-14',
    endDate: '2026-08-14',
    duration: 1,
    reason: 'Medical checkup',
    status: 'pending',
    createdDate: '2026-08-13'
  },
  {
    id: 'req-3',
    employeeId: 'emp-meera',
    employeeName: 'Meera Krishnan',
    employeeRole: 'HR Business Partner',
    leaveType: 'personal',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    duration: 2,
    reason: 'Personal administration work',
    status: 'pending',
    createdDate: '2026-08-11'
  },
  {
    id: 'req-4',
    employeeId: 'emp-ananya',
    employeeName: 'Ananya Sharma',
    employeeRole: 'Senior Product Designer',
    leaveType: 'annual',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    duration: 3,
    reason: 'Short vacation with family',
    status: 'approved',
    createdDate: '2026-07-01'
  },
  {
    id: 'req-5',
    employeeId: 'emp-rahul',
    employeeName: 'Rahul Menon',
    employeeRole: 'Software Engineer',
    leaveType: 'personal',
    startDate: '2026-06-15',
    endDate: '2026-06-15',
    duration: 1,
    reason: 'Urgent bank work',
    status: 'approved',
    createdDate: '2026-06-12'
  },
  {
    id: 'req-6',
    employeeId: 'emp-ananya',
    employeeName: 'Ananya Sharma',
    employeeRole: 'Senior Product Designer',
    leaveType: 'sick',
    startDate: '2026-05-04',
    endDate: '2026-05-05',
    duration: 2,
    reason: 'Recovering from viral fever',
    status: 'approved',
    createdDate: '2026-05-04'
  },
  {
    id: 'req-7',
    employeeId: 'emp-ananya',
    employeeName: 'Ananya Sharma',
    employeeRole: 'Senior Product Designer',
    leaveType: 'annual',
    startDate: '2026-08-01',
    endDate: '2026-08-03',
    duration: 3,
    reason: 'Attending friend\'s wedding',
    status: 'rejected',
    createdDate: '2026-07-25',
    rejectionReason: 'Project release scheduled during these dates. Please plan for later.'
  }
];

export const HR_METRICS = {
  totalEmployees: 500,
  onLeaveToday: 18,
  openPositions: 12,
  pendingActions: 24,
  departments: {
    engineering: 180,
    sales: 120,
    operations: 95,
    marketing: 55,
    hr: 30
  },
  recruitment: {
    openPositions: 12,
    candidates: 37,
    interviews: 8,
    offers: 3
  }
};

export const MANAGER_METRICS = {
  teamMembersCount: 24,
  workingToday: 21,
  onLeave: 3,
  pendingRequests: 3,
  performance: {
    exceeds: 8,
    meets: 13,
    needsImprovement: 3,
    averageScore: 84
  },
  upcomingReviews: [
    { name: 'Rahul Menon', role: 'Software Engineer', date: 'Aug 21, 2026' },
    { name: 'Amit Patel', role: 'QA Engineer', date: 'Aug 28, 2026' },
    { name: 'Ananya Sharma', role: 'Senior Product Designer', date: 'Sep 05, 2026' }
  ],
  teamAvailability: [
    { day: 'Mon', working: 22, leave: 2, names: 'Rahul M., Sneha R.' },
    { day: 'Tue', working: 21, leave: 3, names: 'Rahul M., Sneha R., Amit P.' },
    { day: 'Wed', working: 21, leave: 3, names: 'Rahul M., Sneha R., Amit P.' },
    { day: 'Thu', working: 22, leave: 2, names: 'Rahul M., Amit P.' },
    { day: 'Fri', working: 23, leave: 1, names: 'Amit P.' }
  ]
};
