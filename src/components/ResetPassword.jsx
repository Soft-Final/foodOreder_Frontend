import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Get token from URL
    const token = searchParams.get('token');
    
    // Handle password reset submission here
    console.log('Password reset with token:', token);
    console.log('New password:', passwords.newPassword);
    
    // After successful reset, redirect to login
    navigate('/login');
  };

  return (
    <div className="form-container">
      <h1>Reset Your Password</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn">
          Reset Password
        </button>
      </form>

      <div className="form-footer">
        <button 
          className="link-btn"
          onClick={() => navigate('/login')}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default ResetPassword; 