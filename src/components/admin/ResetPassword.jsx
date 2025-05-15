import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';

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

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const token = searchParams.get('token');
    console.log('Password reset with token:', token);
    console.log('New password:', passwords.newPassword);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create New Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Update Password
            <LockClosedIcon className="w-5 h-5 ml-2" />
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

export default ResetPassword;