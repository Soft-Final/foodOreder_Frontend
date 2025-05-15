import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset submission here
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Reset Your Password
        </h1>
      
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your registered email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Send Reset Link
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;