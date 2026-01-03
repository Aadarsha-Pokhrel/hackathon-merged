import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './LoginScreen.css';

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'member' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }

    // Call parent onLogin with navigate
    onLogin(form, navigate);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign In as {form.role}</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <button
              type="button"
              className={form.role === 'admin' ? 'role-btn active' : 'role-btn'}
              onClick={() => setForm({ ...form, role: 'admin' })}
            >
              Admin
            </button>
            <button
              type="button"
              className={form.role === 'member' ? 'role-btn active' : 'role-btn'}
              onClick={() => setForm({ ...form, role: 'member' })}
            >
              Member
            </button>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder={form.role === 'admin' ? 'Admin Username' : 'Username / Phone'}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <p className="switch-text">
          New member?{' '}
          <button className="switch-btn" onClick={onSwitchToRegister}>
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
