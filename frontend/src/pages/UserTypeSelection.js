import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Welcome to WeHelp
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Please select how you would like to use WeHelp
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <button
            onClick={() => navigate('/donor/login')}
            className="w-full inline-flex justify-center items-center px-6 py-2.5 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            I Want to Donate
          </button>
          <button
            onClick={() => navigate('/receiver/auth')}
            className="w-full inline-flex justify-center items-center px-6 py-2.5 text-lg font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            I Need Help
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTypeSelection; 