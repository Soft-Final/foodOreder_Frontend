import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset submission here
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="form-container">
      <h1>Reset Password</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Send Reset Link
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

export default ForgotPassword; 