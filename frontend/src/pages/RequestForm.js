import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RequestForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item: '',
    description: '',
    requesterName: '',
    isAnonymous: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for authentication on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/verify');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please verify your mobile number first');
      setLoading(false);
      navigate('/verify');
      return;
    }

    try {
      // Include the requester information in the request
      const requestData = {
        ...formData,
        requester: {
          userId: userId,
          name: formData.requesterName,
          isAnonymous: formData.isAnonymous
        }
      };

      await axios.post('http://localhost:5000/api/requests', requestData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a Donation Request</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="item">
            Item Needed
          </label>
          <input
            type="text"
            id="item"
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Size 10 boots, blanket, etc."
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Please provide more details about what you need..."
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="requesterName">
            Your Name
          </label>
          <input
            type="text"
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="First name or nickname"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-gray-700" htmlFor="isAnonymous">
            Keep my name anonymous
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Request...' : 'Create Request'}
        </button>
      </form>
    </div>
  );
}

export default RequestForm;
