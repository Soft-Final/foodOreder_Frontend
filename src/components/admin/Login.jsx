import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { loginUser } from "../api/loginApi";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(formData.email, formData.password);

      // Save token and optionally user info to localStorage
      localStorage.setItem("access_token", result.auth_token);
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("email", result.email);

      console.log("Login success:", result);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Continue
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 text-sm">
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800 transition-colors text-center"
            >
              Create new account
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-gray-600 hover:text-gray-800 transition-colors text-center"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
