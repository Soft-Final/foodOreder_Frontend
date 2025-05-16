import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://165.22.74.5:8000/auth/users/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setMessage('Password reset email sent successfully.');
      } else {
        const data = await response.json();
        setMessage(data?.error || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
      setMessage('An error occurred during the request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {message}
          </div>
        )}
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;