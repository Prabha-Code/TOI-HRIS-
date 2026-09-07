import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function HRDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setDashboard(res.data.dashboard))
      .catch((err) => {
        console.error('Failed to fetch HR dashboard:', err);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const filteredEmployees = useMemo(() => {
    if (!dashboard?.employees) {
      return [];
    }

    const search = query.toLowerCase();
    return dashboard.employees.filter((employee) => {
      return [employee.name, employee.email, employee.role, employee.department]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
    });
  }, [dashboard, query]);

  if (loading) {
    return <div className="loading">Loading HR workspace...</div>;
  }

  if (!dashboard) {
    return <div className="loading">Failed to load HR dashboard</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pending = dashboard.leaveStats?.pending || 0;
  const approved = dashboard.leaveStats?.approved || 0;
  const rejected = dashboard.leaveStats?.rejected || 0;
  const totalLeaves = dashboard.leaveStats?.total || 0;
  const departments = Object.entries(dashboard.departmentBreakdown || {});
  const roleBreakdown = Object.entries(dashboard.roleBreakdown || {});
  const maxDepartmentSize = Math.max(1, ...departments.map(([, value]) => value));
  const leaveTypeBreakdown = Object.entries(dashboard.leaveTypeBreakdown || {});
  const maxLeaveTypeDays = Math.max(1, ...leaveTypeBreakdown.map(([, value]) => value));

  return (
    <div className="app-shell">
      <div className="header">
        <div className="header-content">
          <div>
            <span className="eyebrow">People Operations</span>
            <h1>HR Command Center</h1>
            <p>Welcome, {user?.name}. Monitor workforce health, approvals, and coverage from one workspace.</p>
          </div>
          <div className="header-nav">
            <Link to="/leave/pending">Approvals</Link>
            <Link to="/leave/my-leaves">My Leaves</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <main className="container">
        <section className="grid metric-grid">
          <div className="stat-box">
            <h3>Total Employees</h3>
            <div className="value">{dashboard.totalEmployees || 0}</div>
            <p>Active people records</p>
          </div>
          <div className="stat-box warning">
            <h3>Pending Approvals</h3>
            <div className="value">{pending}</div>
            <p>Needs HR or manager review</p>
          </div>
          <div className="stat-box success">
            <h3>Approved Requests</h3>
            <div className="value">{approved}</div>
            <p>Leave requests accepted</p>
          </div>
          <div className="stat-box danger">
            <h3>Rejected Requests</h3>
            <div className="value">{rejected}</div>
            <p>Leave requests declined</p>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card analytics-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">Leave Analytics</span>
                <h2>Request Pipeline</h2>
              </div>
              <span className="pill">{totalLeaves} total</span>
            </div>
            <div className="status-row">
              <div>
                <span className="status-dot approved" />
                Approved
              </div>
              <strong>{approved}</strong>
            </div>
            <div className="status-row">
              <div>
                <span className="status-dot pending" />
                Pending
              </div>
              <strong>{pending}</strong>
            </div>
            <div className="status-row">
              <div>
                <span className="status-dot rejected" />
                Rejected
              </div>
              <strong>{rejected}</strong>
            </div>

            <div className="divider" />

            <div className="stack-list">
              {leaveTypeBreakdown.map(([type, days]) => (
                <div key={type} className="bar-row">
                  <div className="bar-label">
                    <span>{type}</span>
                    <strong>{days} days</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(days / maxLeaveTypeDays) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card analytics-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">Organization</span>
                <h2>Department Mix</h2>
              </div>
            </div>
            <div className="stack-list">
              {departments.map(([department, count]) => (
                <div key={department} className="bar-row">
                  <div className="bar-label">
                    <span>{department}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill teal" style={{ width: `${(count / maxDepartmentSize) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="role-strip">
              {roleBreakdown.map(([role, count]) => (
                <div key={role} className="role-chip">
                  <span>{role}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <span className="eyebrow">People Directory</span>
                <h2>Employees</h2>
              </div>
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search people, roles, departments"
              />
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Casual</th>
                    <th>Medical</th>
                    <th>Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <strong>{employee.name}</strong>
                        <span className="muted-cell">{employee.email}</span>
                      </td>
                      <td><span className="pill">{employee.role}</span></td>
                      <td>{employee.department || 'Unassigned'}</td>
                      <td>{employee.leaveBalance?.casual ?? 0}</td>
                      <td>{employee.leaveBalance?.medical ?? 0}</td>
                      <td>{employee.leaveBalance?.earned ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="eyebrow">Recent Activity</span>
                <h2>Leave Requests</h2>
              </div>
              <Link to="/leave/pending" className="btn btn-small btn-primary">Review</Link>
            </div>
            <div className="activity-list">
              {dashboard.recentLeaves?.length ? dashboard.recentLeaves.map((leave) => (
                <div className="activity-item" key={leave._id}>
                  <div>
                    <strong>{leave.employeeId?.name || 'Employee'}</strong>
                    <span>{leave.leaveType} leave, {leave.numberOfDays} days</span>
                  </div>
                  <span className={`badge badge-${leave.status}`}>{leave.status}</span>
                </div>
              )) : <p className="empty-state">No leave requests yet.</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HRDashboard;
