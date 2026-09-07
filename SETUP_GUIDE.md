# 🚀 PeopleOS Setup Guide - Complete Instructions

## Step-by-Step Installation

### Prerequisites Check

Before starting, verify you have:
```bash
# Check Node.js (need v14+)
node --version
# Output should be v14.0.0 or higher

# Check npm
npm --version
# Output should be v6.0.0 or higher

# Check MongoDB (if local)
mongod --version
# OR plan to use MongoDB Atlas (cloud)
```

---

## Option A: Local MongoDB Setup (Recommended for Learning)

### Install MongoDB Community Edition

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer and follow prompts
3. MongoDB installs as Windows Service
4. Verify: `mongod --version`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Verify MongoDB Running
```bash
mongo --version
# OR mongosh --version (newer version)
```

---

## Option B: MongoDB Atlas (Cloud - Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (free tier)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/peopleos`
5. Update `.env` file with this string

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Environment File
```bash
# Copy example to actual
cp .env.example .env

# Edit .env
# MONGODB_URI=mongodb://localhost:27017/peopleos
# JWT_SECRET=your-super-secret-key-here-change-in-production
# PORT=5000
```

### 3. Install Dependencies
```bash
npm install

# You should see ~20 packages installed
# Including: express, mongoose, bcryptjs, jsonwebtoken, cors
```

### 4. Test Backend Server
```bash
# Development mode with auto-reload
npm run dev

# You should see:
# ✓ MongoDB connected
# ✓ PeopleOS Backend running on port 5000
```

### 5. Verify Backend Works
Open new terminal and test:
```bash
# Health check
curl http://localhost:5000/health

# Response:
# {"status":"PeopleOS Backend is running"}
```

✅ **Backend is ready!** Keep it running.

---

## Frontend Setup

### 1. Return to the project root
```bash
cd ..
```

### 2. Start the modern frontend and backend
```bash
npm install
npm run dev

# Open http://localhost:5173
```

### 3. See the App
Browser opens automatically with:
- PeopleOS role selection
- Employee, manager, and HR dashboards
- Leave, people, payroll, recruitment, and performance modules

✅ **Frontend is running!**

---

## Complete Flow - First Time Testing

### Test Account 1: Employee
1. URL: http://localhost:3000
2. Login page shows
3. Email: `employee@example.com`
4. Password: `password123`
5. Click Login
6. **See**: Employee Dashboard with leave balance
7. **Click**: "Request Leave"
8. **Try**: Fill form and submit

### Test Account 2: Manager
1. Logout from employee
2. Login with:
   - Email: `manager@example.com`
   - Password: `password123`
3. **See**: Manager Dashboard with pending approvals
4. **Click**: "Pending Approvals"
5. **Action**: Approve or reject employee's request

### Watch the Magic:
- Return to employee account (refresh)
- Their leave status changed!
- Balance updated!

---

## Troubleshooting

### Issue: "MongoDB connection error"
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
- Ensure mongod is running
- Windows: Check Services > MongoDB Server
- Mac/Linux: brew services list
- OR switch to MongoDB Atlas
```

### Issue: "Port 5000 already in use"
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
# Kill process on port 5000
Windows: netstat -ano | findstr :5000
         taskkill /PID <PID> /F

Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### Issue: "Port 3000 already in use"
```
Solution: Same as above
OR change PORT in .env file
REACT_APP_PORT=3001
```

### Issue: "npm: command not found"
```
Solution:
- Install Node.js from https://nodejs.org
- Restart terminal after installation
- Verify: node --version && npm --version
```

### Issue: "Module not found" errors
```
Solution:
npm install

# If still fails:
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend shows "Cannot GET /"
```
Solution:
- Backend must be running (npm run dev in backend)
- Check http://localhost:5000/health
- If fails: backend issue

- Frontend must have correct REACT_APP_API_URL
- Check .env file in frontend
```

### Issue: Login fails with "Network Error"
```
Solution:
1. Check backend is running
2. Check frontend .env has correct URL
3. Check browser DevTools > Network tab
4. See actual error from API
5. Check backend logs for details
```

---

## Database Verification

### Check MongoDB Collections

```bash
# Connect to MongoDB
mongosh  # or mongo (older version)

# List databases
show databases

# Use peopleos database
use peopleos

# Check collections
show collections

# View users
db.users.find().pretty()

# View leaves
db.leaves.find().pretty()

# Count records
db.leaves.countDocuments()

# Find specific leave
db.leaves.findOne({ status: "pending" })
```

---

## Project File Checklist

Verify you have all files:

```
toi/
├── backend/
│   ├── models/
│   │   ├── User.js          ✓
│   │   └── Leave.js         ✓
│   ├── controllers/
│   │   ├── authController.js ✓
│   │   └── leaveController.js ✓
│   ├── routes/
│   │   ├── auth.js          ✓
│   │   ├── leaves.js        ✓
│   │   ├── employees.js     ✓
│   │   └── dashboard.js     ✓
│   ├── middleware/
│   │   └── auth.js          ✓
│   ├── server.js            ✓
│   ├── package.json         ✓
│   ├── .env                 ✓
│   └── .env.example         ✓
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js     ✓
│   │   │   ├── Register.js  ✓
│   │   │   ├── EmployeeDashboard.js ✓
│   │   │   ├── ManagerDashboard.js  ✓
│   │   │   ├── LeaveRequest.js      ✓
│   │   │   ├── MyLeaves.js          ✓
│   │   │   └── PendingLeaves.js     ✓
│   │   ├── App.js           ✓
│   │   ├── App.css          ✓
│   │   └── index.js         ✓
│   ├── public/
│   │   └── index.html       ✓
│   ├── package.json         ✓
│   ├── .env                 ✓
│   └── .env.example         ✓
├── README.md                ✓
├── DESIGN_DECISIONS.md      ✓
├── INTERVIEW_ANSWERS.md     ✓
├── SETUP_GUIDE.md           ✓ (this file)
├── .gitignore               ✓
└── package.json             ✓
```

---

## Next Steps After Setup

### 1. Explore the Code
- Read `backend/server.js` - entry point
- Read `frontend/src/App.js` - main app structure
- Check `backend/controllers/leaveController.js` - business logic

### 2. Try Advanced Flows
```
Employee Journey:
1. Register new account
2. Request leave
3. Wait for manager approval
4. Check balance update

Manager Journey:
1. Login as manager
2. See pending leaves
3. Approve some, reject others
4. Add approval notes
```

### 3. Make Modifications
Try these to learn:
- Change default leave balance in User.js
- Modify validation rules in leaveController.js
- Add new fields to leave form
- Change styling in App.css

### 4. Add New Features
After understanding code:
- Add "Cancel Leave" feature
- Add email notifications
- Add leave calendar view
- Add reporting dashboard

---

## Deployment (When Ready)

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create peopleos-backend

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Development Best Practices

### Use These Commands Regularly

```bash
# Backend
npm run dev          # Start with auto-reload
npm run lint         # Check code quality
npm test            # Run tests (when added)

# Frontend
npm start           # Start dev server
npm run build       # Create production build
npm run lint        # Check code quality
```

### Save Code Changes
```bash
# Git workflow
git add .
git commit -m "feat: add feature name"
git push origin main
```

---

## Need Help?

### Check These Files First:
1. **README.md** - Overview and features
2. **DESIGN_DECISIONS.md** - Why things are designed this way
3. **INTERVIEW_ANSWERS.md** - Technical Q&A
4. **Backend console logs** - Error messages
5. **Frontend DevTools** - Network errors

### Common Quick Fixes:
1. Restart both servers
2. Clear browser cache (DevTools > Storage)
3. Clear `node_modules` and reinstall
4. Verify MongoDB is running
5. Check `.env` files are correct

---

## Success Checklist ✅

- [ ] Node.js and npm installed
- [ ] MongoDB running (local or Atlas)
- [ ] Backend `.env` created
- [ ] Backend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Frontend `.env` created
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can login with demo account
- [ ] Employee dashboard shows leave balance
- [ ] Can request leave
- [ ] Manager sees pending requests
- [ ] Can approve/reject leave
- [ ] Employee sees updated status

Once all checked ✅ → **You're ready for your interview!**

---

## Quick Start Command Cheat Sheet

```bash
# Terminal 1: Backend
cd backend
cp .env.example .env
npm install
npm run dev
# Waits here, server running

# Terminal 2: Frontend
cd frontend
cp .env.example .env
npm install
npm start
# Opens browser automatically

# Terminal 3: Database (if local MongoDB)
mongosh
# Database shell open

# Now:
# Backend: http://localhost:5000/health
# Frontend: http://localhost:3000
# DB: mongodb://localhost:27017/peopleos
```

---

**You're all set! 🎉 Let's build something amazing!**
