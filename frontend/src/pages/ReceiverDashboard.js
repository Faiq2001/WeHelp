import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReceiverDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    description: '',
    isAnonymous: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/receiver/auth');
      return;
    }
    fetchMyRequests();
  }, [navigate]);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/requests/my-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ item: '', description: '', isAnonymous: false });
      setShowForm(false);
      fetchMyRequests();
    } catch (err) {
      setError('Failed to create request');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Requests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-8 py-3 text-xl font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {showForm ? 'Cancel' : 'Create New Request'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-6">Create New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Needed</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows="4"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">Stay Anonymous</label>
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-8 py-3 text-xl font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Request
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {requests.map((request) => (
          <div key={request._id} className="bg-white p-6 rounded-lg shadow-md">
            <div>
              <h2 className="text-2xl font-semibold">{request.item}</h2>
              <p className="text-gray-600 mt-3 text-lg">{request.description}</p>
              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReceiverDashboard; 