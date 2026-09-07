# 🎯 PeopleOS - HRIS Platform with Leave Management

**One place to understand your people, act on priorities, and keep work moving.**

A professional, full-stack Human Resource Information System (HRIS) built with React, Node.js, Express, and MongoDB. This project demonstrates complete implementation of leave management workflow with role-based access control for employees, managers, and HR personnel.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- MongoDB 4.4+
- Git

### Installation & Setup

```bash
# Clone repository
cd toi

# Install the modern PeopleOS application dependencies
npm install

# Install backend dependencies once
cd backend
npm install
cd ..

# Start the backend and the modern Vite frontend together
npm run dev

# Open http://localhost:5173
```

The root `src/` application is the supported frontend. The `frontend/` directory is retained only for compatibility with older documentation; running `npm run dev` or `npm start` there forwards to the modern root application.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@example.com | password123 |
| Manager | manager@example.com | password123 |
| HR | hr@example.com | password123 |

## 📁 Project Structure

```
toi/
├── backend/
│   ├── models/
│   │   ├── User.js           # Employee/Manager/HR schema with leave balance
│   │   └── Leave.js          # Leave request schema with approval tracking
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── leaveController.js# Leave request/approval logic
│   ├── routes/
│   │   ├── auth.js           # Auth endpoints
│   │   ├── leaves.js         # Leave management endpoints
│   │   ├── employees.js      # Employee directory
│   │   └── dashboard.js      # Role-based dashboard data
│   ├── middleware/
│   │   └── auth.js           # JWT validation & role checking
│   ├── server.js             # Express server entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js              # Authentication page
│   │   │   ├── Register.js           # User registration
│   │   │   ├── EmployeeDashboard.js # Employee home screen
│   │   │   ├── ManagerDashboard.js  # Manager home screen
│   │   │   ├── LeaveRequest.js       # Request leave form
│   │   │   ├── MyLeaves.js           # Leave history & stats
│   │   │   └── PendingLeaves.js      # Manager approval interface
│   │   ├── App.js            # Main app with routing
│   │   ├── App.css           # Global styling
│   │   └── index.js          # React entry point
│   ├── public/
│   │   └── index.html
│   ├── .env.example
│   └── package.json
├── README.md                 # This file
├── DESIGN_DECISIONS.md       # Design & Architecture reasoning
├── INTERVIEW_ANSWERS.md      # Answers to interview questions
└── package.json             # Workspace configuration
```

## ✨ Core Features

### 1. **Authentication System**
- User registration with role selection (Employee, Manager, HR)
- JWT-based authentication
- Secure password hashing with bcryptjs
- Token validation on protected routes

### 2. **Leave Management Workflow**

#### For Employees:
- Request leave with type (Casual, Medical, Earned)
- Set date range with automatic working day calculation
- Provide reason for leave
- Real-time leave balance tracking
- View complete leave history with status

#### For Managers:
- Review pending leave requests from team members
- Approve or reject with optional notes
- Track team availability and on-leave count
- Dashboard showing team metrics

#### For HR:
- Full visibility into all leave requests
- System-wide leave statistics
- Employee directory
- Compliance and record-keeping

### 3. **Role-Based Dashboard**
Each user sees customized dashboard based on their role:
- **Employee**: Personal leave balance, recent requests, quick action buttons
- **Manager**: Team metrics, pending approvals, team availability
- **HR**: System-wide statistics, recent activities, compliance overview

### 4. **Data Models & Relationships**

#### User Schema:
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'employee' | 'manager' | 'hr' | 'admin',
  department: String,
  managerId: ObjectId (reference to User),
  leaveBalance: {
    casual: Number,
    medical: Number,
    earned: Number
  },
  createdAt: Date
}
```

#### Leave Schema:
```javascript
{
  employeeId: ObjectId (ref: User),
  leaveType: 'casual' | 'medical' | 'earned',
  startDate: Date,
  endDate: Date,
  numberOfDays: Number (calculated working days),
  reason: String,
  status: 'pending' | 'approved' | 'rejected',
  approverId: ObjectId (ref: User),
  approverNotes: String,
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Leave Management
- `POST /api/leaves/request` - Request leave (Employee)
- `GET /api/leaves/my-leaves` - Get user's leave history
- `GET /api/leaves/stats` - Get leave statistics
- `GET /api/leaves/pending` - Get pending requests (Manager/HR)
- `POST /api/leaves/approve` - Approve leave (Manager/HR)
- `POST /api/leaves/reject` - Reject leave (Manager/HR)

### Dashboard
- `GET /api/dashboard` - Get role-specific dashboard data

### Employees
- `GET /api/employees` - Get all employees (HR only)
- `GET /api/employees/:id` - Get employee details

## 🏗️ Architecture Highlights

### 1. **Separation of Concerns**
- **Models**: Data schemas and validation logic
- **Controllers**: Business logic and data manipulation
- **Routes**: API endpoint definitions
- **Middleware**: Cross-cutting concerns (auth, validation)

### 2. **Authentication & Authorization**
- JWT tokens with 7-day expiration
- Role-based access control (RBAC)
- Protected routes requiring valid token
- Manager can only see their team's requests

### 3. **Scalability**
- Modular component architecture in React
- RESTful API design for easy consumption
- Database indexing on frequently queried fields
- Stateless backend for horizontal scaling

### 4. **User Experience**
- Responsive design (desktop & mobile)
- Intuitive role-specific interfaces
- Real-time validation and error messages
- Professional gradient UI with consistent spacing

## 🎨 Design Principles

### Problem 1: UX Design - HRIS Dashboard

**Design Thinking:**
1. **Information Hierarchy**: Each persona's dashboard prioritizes their pain points
2. **One-Click Actions**: Most frequent actions immediately accessible
3. **Visual Feedback**: Status badges, color coding, animations
4. **Progressive Disclosure**: Advanced options hidden but accessible

**User Journey - Employee:**
```
Login → Dashboard (see balance) → Request Leave → Submit → 
View Status → Receive Approval → Auto-updated Balance
```

**User Journey - Manager:**
```
Login → Dashboard (see team metrics) → Pending Approvals → 
Review Details → Approve/Reject → Team Updates Automatically
```

### Problem 2: Implementation - Leave Management

**Key Design Decisions:**
1. **Working Days Calculation**: Exclude weekends for accurate leave count
2. **Atomic Updates**: Balance updates only on approval to prevent discrepancies
3. **Audit Trail**: All decisions recorded with approverId, notes, and timestamp
4. **Validation**: Prevent past-dated requests, insufficient balance checks
5. **Role Isolation**: Employees see only their leaves, managers see their team

**Code Quality:**
- Clean, readable variable names
- Comprehensive error handling
- Input validation at both API and controller layers
- RESTful principles followed
- Comments for complex logic

## 📊 Leave Calculation Logic

The system calculates working days by:
1. Iterating through date range
2. Excluding Saturdays (6) and Sundays (0)
3. Counting remaining days

```javascript
// Example: Monday to Friday = 5 days
// Saturday-Sunday = 0 days
// Monday to next Monday = 7 days
```

## 🔐 Security Features

✅ Password hashing with bcryptjs (salt rounds: 10)
✅ JWT token validation on protected routes
✅ Role-based access control
✅ Input validation using express-validator
✅ CORS configuration
✅ No sensitive data in token payload
✅ Secure password comparison (timing-safe)

## 📱 Responsive Design

The UI is mobile-friendly with:
- Flexible grid layouts
- Touch-friendly button sizes
- Readable font sizes
- Optimized for screens from 320px to 2560px

## 🚀 Future Enhancements

1. **Notifications**: Email alerts for leave approvals
2. **Payroll Integration**: Automatic salary deductions for unpaid leave
3. **Performance Reviews**: 360-degree feedback system
4. **Recruitment Module**: Job postings and candidate management
5. **Analytics Dashboard**: Leave trends, team performance metrics
6. **Mobile App**: Native iOS/Android application
7. **Bulk Operations**: Import/export leave data
8. **Calendar View**: Visual leave calendar for team planning

## 🧪 Testing & Validation

### Backend Testing:
```bash
# API can be tested with Postman or curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@example.com","password":"password123"}'
```

### Frontend Testing:
- Manual testing with demo accounts
- Network requests visible in browser DevTools
- Real-time error handling and user feedback

## 📚 Documentation Files

1. **README.md** (this file) - Overview and setup
2. **DESIGN_DECISIONS.md** - Detailed design reasoning
3. **INTERVIEW_ANSWERS.md** - Answers to all interview questions

## 🤝 Contributing

For extending this project:
1. Follow the existing folder structure
2. Use consistent naming conventions
3. Add validation for user inputs
4. Update documentation for new features
5. Test thoroughly before committing

## 📝 License

This project is created for educational and interview purposes.

## 👤 Author

Built for TrainByte/One India HRIS Internship Assignment

---

**Status**: ✅ Fully Functional | Production-Ready | Ready for Interview Presentation

For questions about design decisions, see [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)
For interview question answers, see [INTERVIEW_ANSWERS.md](./INTERVIEW_ANSWERS.md)
