import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'student', label: '🎓 Student', desc: 'Report campus issues' },
  { value: 'faculty', label: '👨‍🏫 Faculty', desc: 'Faculty member' },
  { value: 'staff', label: '🔧 Staff / Technician', desc: 'Handle maintenance' },
  { value: 'admin', label: '⚙️ Administrator', desc: 'Full system access' },
];

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.username, form.password);
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-card glass-panel">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🏛️</div>
          <div>
            <h1 className="login-title gradient-text">CampusFix</h1>
            <p className="login-subtitle">College Infrastructure Portal</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="login-toggle">
          <button
            className={`login-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`login-toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Register-only fields */}
          {mode === 'register' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    name="first_name"
                    placeholder="First name"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    name="last_name"
                    placeholder="Last name"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  placeholder="your@college.edu"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <div className="role-picker">
                  {ROLES.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                    >
                      <span className="role-label">{r.label}</span>
                      <span className="role-desc">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              mode === 'login' ? '🔑 Sign In to Portal' : '🚀 Create Account'
            )}
          </button>
        </form>

        <p className="login-hint">
          {mode === 'login'
            ? <>New to CampusFix? <button className="login-link" onClick={() => setMode('register')}>Create account</button></>
            : <>Already have an account? <button className="login-link" onClick={() => setMode('login')}>Sign in</button></>
          }
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
