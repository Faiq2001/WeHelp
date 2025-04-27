import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function DonationFlow() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [request, setRequest] = useState(null);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropOffTime: '',
  });

  const fetchRequestDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${requestId}`);
      setRequest(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch request details');
      setLoading(false);
    }
  }, [requestId]);

  const fetchPickupLocations = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donations/pickup-locations');
      setPickupLocations(response.data);
    } catch (err) {
      setError('Failed to fetch pickup locations');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { redirectTo: location.pathname } });
      return;
    }
    
    fetchRequestDetails();
    fetchPickupLocations();
  }, [fetchRequestDetails, fetchPickupLocations, navigate, location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitDonation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/donations', 
        {
          requestId,
          pickupLocation: formData.pickupLocation,
          dropOffTime: formData.dropOffTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      navigate('/my-donations');
    } catch (err) {
      setError('Failed to submit donation');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Make a Donation</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <select
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a location</option>
                {pickupLocations.map(location => (
                  <option key={location._id} value={location._id}>
                    {location.name} - {location.address}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drop-off Time</label>
              <input
                type="datetime-local"
                name="dropOffTime"
                value={formData.dropOffTime}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSubmitDonation}
              disabled={!formData.pickupLocation || !formData.dropOffTime}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm Donation
            </button>
          </div>
        </div>
      </div>

      {request && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Request Details</h3>
          <div className="mt-4">
            <p><span className="font-medium">Item:</span> {request.item}</p>
            <p className="mt-2"><span className="font-medium">Description:</span> {request.description}</p>
            <p className="mt-2"><span className="font-medium">Requested by:</span> {request.requester?.isAnonymous ? 'Anonymous' : request.requester?.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonationFlow; 