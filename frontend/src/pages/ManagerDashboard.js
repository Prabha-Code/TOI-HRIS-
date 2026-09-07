import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ManagerDashboard() {
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
            <h1>Manager Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
          </div>
          <div className="header-nav">
            <Link to="/leave/pending">Pending Approvals</Link>
            <Link to="/leave/my-leaves">My Leaves</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Team Metrics */}
        <div className="grid grid-2">
          <div className="stat-box success">
            <h3>Team Members</h3>
            <div className="value">{dashboard.teamMetrics?.totalEmployees || 0}</div>
          </div>
          <div className="stat-box warning">
            <h3>On Leave Today</h3>
            <div className="value">{dashboard.teamMetrics?.onLeave || 0}</div>
          </div>
          <div className="stat-box danger">
            <h3>Pending Approvals</h3>
            <div className="value">{dashboard.teamMetrics?.pendingApprovals || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">Quick Actions</div>
          <div className="grid">
            <Link to="/leave/pending" className="btn btn-primary">Review Pending Leaves</Link>
            <Link to="/leave/my-leaves" className="btn btn-secondary">View My Leaves</Link>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="card">
          <div className="card-header">Pending Leave Requests ({dashboard.pendingLeaves?.length || 0})</div>
          {dashboard.pendingLeaves && dashboard.pendingLeaves.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Date Range</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.pendingLeaves.map(leave => (
                  <tr key={leave._id}>
                    <td>{leave.employeeId?.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <Link to={`/leave/pending`} className="btn btn-small btn-primary">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending leave requests</p>
          )}
        </div>

        {/* Information */}
        <div className="card">
          <div className="card-header">Manager Responsibilities</div>
          <ol>
            <li><strong>Review Requests:</strong> Check pending leave applications from your team</li>
            <li><strong>Approve/Reject:</strong> Make decisions based on team capacity and policies</li>
            <li><strong>Track Coverage:</strong> Monitor team availability and plan accordingly</li>
            <li><strong>Document Decisions:</strong> Add notes to your approvals/rejections for record</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
