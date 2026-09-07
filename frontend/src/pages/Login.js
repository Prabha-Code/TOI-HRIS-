import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Login() {
  const [email, setEmail] = useState('employee@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>PeopleOS Login</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-link">
          Need a new account? <Link to="/register">Register here</Link>
        </div>

        <div className="divider" />
        <div className="stack-list">
          <button type="button" className="btn btn-secondary" onClick={() => fillDemo('employee@example.com')}>
            Employee Demo
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => fillDemo('manager@example.com')}>
            Manager Demo
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => fillDemo('hr@example.com')}>
            HR Demo
          </button>
          <p className="empty-state">All demo accounts use password123.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
