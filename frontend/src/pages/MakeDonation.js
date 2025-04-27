import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MakeDonation() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    displayName: '',
    isAnonymous: true,
    pickupLocationId: '',
    scheduledTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestResponse, locationsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/requests/${requestId}`),
          axios.get('http://localhost:5000/api/donations/pickup-locations')
        ]);
        setRequest(requestResponse.data);
        setLocations(locationsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load necessary data');
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

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
      navigate('/verify');
      return;
    }

    try {
      const donationData = {
        requestId,
        donor: {
          userId,
          displayName: formData.isAnonymous ? 'Anonymous Donor' : formData.displayName,
          isAnonymous: formData.isAnonymous
        },
        pickupLocationId: formData.pickupLocationId,
        scheduledTime: formData.scheduledTime
      };

      await axios.post('http://localhost:5000/api/donations', donationData);
      navigate('/my-donations');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!request) return <div className="text-center">Request not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Make a Donation</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Request Details</h2>
        <p className="text-gray-600">{request.item}</p>
        <p className="text-gray-500 mt-2">{request.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-gray-700" htmlFor="isAnonymous">
            Stay Anonymous
          </label>
        </div>

        {!formData.isAnonymous && (
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="displayName">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How would you like to be known?"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="pickupLocationId">
            Pickup Location
          </label>
          <select
            id="pickupLocationId"
            name="pickupLocationId"
            value={formData.pickupLocationId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a pickup location</option>
            {locations.map(location => (
              <option key={location._id} value={location._id}>
                {location.name} - {location.address}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="scheduledTime">
            Scheduled Drop-off Time
          </label>
          <input
            type="datetime-local"
            id="scheduledTime"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : 'Confirm Donation'}
        </button>
      </form>
    </div>
  );
}

export default MakeDonation; 