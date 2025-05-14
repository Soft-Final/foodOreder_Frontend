import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login submission here
    console.log('Login submitted:', formData);
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <div className="form-footer">
        <button 
          className="link-btn"
          onClick={() => navigate('/register')}
        >
          Create an account
        </button>
        <button 
          className="link-btn"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}

export default Login;
