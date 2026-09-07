import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function MyLeaves() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      axios.get(`${API_URL}/leaves/my-leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API_URL}/leaves/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(([leavesRes, statsRes]) => {
        setLeaves(leavesRes.data.leaves);
        setStats(statsRes.data.stats);
      })
      .catch(err => {
        console.error('Failed to fetch leaves:', err);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredLeaves = filter === 'all' 
    ? leaves 
    : leaves.filter(leave => leave.status === filter);

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <div>
            <h1>My Leave History</h1>
            <p>{user?.name}</p>
          </div>
          <div className="header-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/leave/request">Request Leave</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Leave Balance */}
        {stats && (
          <div className="grid grid-2">
            <div className="stat-box success">
              <h3>Casual Balance</h3>
              <div className="value">{stats.balance.casual}</div>
            </div>
            <div className="stat-box success">
              <h3>Medical Balance</h3>
              <div className="value">{stats.balance.medical}</div>
            </div>
            <div className="stat-box success">
              <h3>Earned Balance</h3>
              <div className="value">{stats.balance.earned}</div>
            </div>
            <div className="stat-box warning">
              <h3>Total Used</h3>
              <div className="value">
                {stats.total.casual + stats.total.medical + stats.total.earned}
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {stats && (
          <div className="card">
            <div className="card-header">Leave Summary</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Total Used</th>
                  <th>Approved</th>
                  <th>Pending</th>
                  <th>Rejected</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Casual</strong></td>
                  <td>{stats.total.casual}</td>
                  <td>{stats.approved.casual}</td>
                  <td>{stats.pending.casual}</td>
                  <td>{stats.rejected.casual}</td>
                </tr>
                <tr>
                  <td><strong>Medical</strong></td>
                  <td>{stats.total.medical}</td>
                  <td>{stats.approved.medical}</td>
                  <td>{stats.pending.medical}</td>
                  <td>{stats.rejected.medical}</td>
                </tr>
                <tr>
                  <td><strong>Earned</strong></td>
                  <td>{stats.total.earned}</td>
                  <td>{stats.approved.earned}</td>
                  <td>{stats.pending.earned}</td>
                  <td>{stats.rejected.earned}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Filter and List */}
        <div className="card">
          <div className="card-header">
            Leave Requests ({filteredLeaves.length})
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-small ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`btn btn-small ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`btn btn-small ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('approved')}
              >
                Approved
              </button>
              <button
                className={`btn btn-small ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>

          {filteredLeaves.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map(leave => (
                  <tr key={leave._id}>
                    <td style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                      {leave.leaveType}
                    </td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.numberOfDays}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{leave.approverId?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leave requests found</p>
          )}
        </div>

        <Link to="/leave/request" className="btn btn-primary" style={{ marginBottom: '20px' }}>
          + New Leave Request
        </Link>
      </div>
    </div>
  );
}

export default MyLeaves;
