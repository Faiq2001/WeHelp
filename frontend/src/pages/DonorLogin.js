import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function DonorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/donor/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userType', 'donor');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in as a Donor
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Or{' '}
            <Link to="/donor/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              register as a new donor
            </Link>
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg text-base">
            {error}
          </div>
        )}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-6 py-2.5 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center space-y-4">
          <Link to="/" className="text-base font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
            Back to user type selection
          </Link>
          <Link 
            to="/receiver/auth" 
            className="block w-full text-center px-6 py-2.5 text-lg font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login to add a request
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DonorLogin; 