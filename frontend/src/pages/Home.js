// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Available Requests</h1>
        {token && userType === 'receiver' && (
          <Link
            to="/receiver/dashboard"
            className="inline-flex items-center px-6 py-2.5 text-lg font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create New Request
          </Link>
        )}
        {!token && (
          <Link
            to="/receiver/auth"
            className="inline-flex items-center px-6 py-2.5 text-lg font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login to create new request
          </Link>
        )}
      </div>
      
      <div className="grid gap-5">
        {requests.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">No requests yet... Looks like everyone's feeling generous today! 🎁</p>
            <p className="text-base text-gray-500 mt-3">Check back later for requests that need your help!</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{request.item}</h2>
                  <p className="text-gray-600 mt-2.5 text-base">{request.description}</p>
                  <p className="text-base text-gray-500 mt-2.5">
                    Requested by: {request.requester?.isAnonymous ? 'Anonymous' : request.requester?.name}
                  </p>
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {token && userType === 'donor' && request.status === 'pending' && (
                    <Link
                      to={`/donate/${request._id}`}
                      className="inline-flex items-center px-6 py-2.5 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      I Can Help
                    </Link>
                  )}
                  {!token && request.status === 'pending' && (
                    <Link
                      to="/donor/login"
                      className="inline-flex items-center px-6 py-2.5 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Login to Help
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
