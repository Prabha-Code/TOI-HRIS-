import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EmployeeDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setDashboard(res.data.dashboard);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard:', err);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) {
    return <div className="loading">Loading Dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="loading">Failed to load dashboard</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Employee Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
          </div>
          <div className="header-nav">
            <Link to="/leave/request">Request Leave</Link>
            <Link to="/leave/my-leaves">My Leaves</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Quick Stats */}
        <div className="grid grid-2">
          <div className="stat-box success">
            <h3>Available Casual</h3>
            <div className="value">{dashboard.leaveBalance?.casual || 0}</div>
          </div>
          <div className="stat-box success">
            <h3>Available Medical</h3>
            <div className="value">{dashboard.leaveBalance?.medical || 0}</div>
          </div>
          <div className="stat-box success">
            <h3>Available Earned</h3>
            <div className="value">{dashboard.leaveBalance?.earned || 0}</div>
          </div>
          <div className="stat-box warning">
            <h3>Leave Pending</h3>
            <div className="value">{dashboard.pendingRequests || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">Quick Actions</div>
          <div className="grid">
            <Link to="/leave/request" className="btn btn-primary">+ Request New Leave</Link>
            <Link to="/leave/my-leaves" className="btn btn-secondary">View My Leaves</Link>
          </div>
        </div>

        {/* Recent Leaves */}
        <div className="card">
          <div className="card-header">Recent Leave Requests</div>
          {dashboard.recentLeaves && dashboard.recentLeaves.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date Range</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentLeaves.map(leave => (
                  <tr key={leave._id}>
                    <td style={{ textTransform: 'capitalize' }}>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>
                      <span className={`badge badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leave requests yet</p>
          )}
        </div>

        {/* Information */}
        <div className="card">
          <div className="card-header">About PeopleOS</div>
          <p>
            <strong>PeopleOS</strong> is your complete HR Information System designed to streamline leave management, 
            performance reviews, payroll, recruitment, and employee engagement. 
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Leave Management Workflow:</strong>
          </p>
          <ol>
            <li>Request leave by specifying type, dates, and reason</li>
            <li>Manager reviews and approves/rejects your request</li>
            <li>Your leave balance updates automatically upon approval</li>
            <li>Track all your leave history in one place</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
