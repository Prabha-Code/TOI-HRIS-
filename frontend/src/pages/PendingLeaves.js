import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function PendingLeaves() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalAction, setApprovalAction] = useState(null);
  const [approverNotes, setApproverNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_URL}/leaves/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setLeaves(res.data.leaves);
      })
      .catch(err => {
        console.error('Failed to fetch pending leaves:', err);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleApprove = async (leaveId) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await axios.post(
        `${API_URL}/leaves/approve`,
        { leaveId, approverNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaves(leaves.filter(l => l._id !== leaveId));
      setSelectedLeave(null);
      setApprovalAction(null);
      setApproverNotes('');
      alert('Leave approved successfully!');
    } catch (err) {
      alert('Failed to approve leave: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (leaveId) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await axios.post(
        `${API_URL}/leaves/reject`,
        { leaveId, approverNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaves(leaves.filter(l => l._id !== leaveId));
      setSelectedLeave(null);
      setApprovalAction(null);
      setApproverNotes('');
      alert('Leave rejected!');
    } catch (err) {
      alert('Failed to reject leave: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
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
            <h1>Pending Leave Approvals</h1>
            <p>Manager: {user?.name}</p>
          </div>
          <div className="header-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/leave/my-leaves">My Leaves</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          {/* Leave List */}
          <div>
            <div className="card">
              <div className="card-header">
                Pending Requests ({leaves.length})
              </div>

              {leaves.length > 0 ? (
                <div>
                  {leaves.map(leave => (
                    <div
                      key={leave._id}
                      style={{
                        padding: '15px',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        backgroundColor: selectedLeave?._id === leave._id ? '#f9f9f9' : 'white'
                      }}
                      onClick={() => {
                        setSelectedLeave(leave);
                        setApprovalAction(null);
                        setApproverNotes('');
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong>{leave.employeeId?.name}</strong>
                        <span style={{ textTransform: 'capitalize', color: '#666' }}>
                          {leave.leaveType}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#999' }}>
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} 
                        ({leave.numberOfDays} days)
                      </div>
                      <div style={{ fontSize: '13px', marginTop: '5px' }}>
                        <strong>Reason:</strong> {leave.reason}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No pending leave requests</p>
              )}
            </div>
          </div>

          {/* Details Panel */}
          {selectedLeave && (
            <div className="card">
              <div className="card-header">Leave Details</div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label><strong>Employee:</strong></label>
                  <p>{selectedLeave.employeeId?.name} ({selectedLeave.employeeId?.email})</p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label><strong>Leave Type:</strong></label>
                  <p style={{ textTransform: 'capitalize' }}>{selectedLeave.leaveType}</p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label><strong>Duration:</strong></label>
                  <p>
                    {new Date(selectedLeave.startDate).toLocaleDateString()} to{' '}
                    {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label><strong>Number of Days:</strong></label>
                  <p>{selectedLeave.numberOfDays} working days</p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label><strong>Reason:</strong></label>
                  <p>{selectedLeave.reason}</p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label><strong>Requested on:</strong></label>
                  <p>{new Date(selectedLeave.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {!approvalAction ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => setApprovalAction('approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setApprovalAction('reject')}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label>
                      {approvalAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason'}
                    </label>
                    <textarea
                      value={approverNotes}
                      onChange={(e) => setApproverNotes(e.target.value)}
                      placeholder={
                        approvalAction === 'approve'
                          ? 'Add any notes for the employee...'
                          : 'Please provide a reason for rejection...'
                      }
                      required={approvalAction === 'reject'}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {approvalAction === 'approve' ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(selectedLeave._id)}
                        disabled={submitting}
                      >
                        {submitting ? 'Approving...' : 'Confirm Approval'}
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(selectedLeave._id)}
                        disabled={submitting}
                      >
                        {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                      </button>
                    )}
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setApprovalAction(null);
                        setApproverNotes('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingLeaves;
