import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setError('Please log in to view your donations');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/donations/my-donations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDonations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch donations');
      setLoading(false);
    }
  };

  const handleConfirmDropOff = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to confirm drop-off');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/donations/${donationId}/drop-off`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const updatedDonations = donations.map(donation => 
        donation._id === donationId 
          ? { 
              ...donation, 
              status: 'dropped_off',
              dropOffDetails: { 
                ...donation.dropOffDetails,
                confirmationCode: response.data.confirmationCode 
              }
            }
          : donation
      );
      setDonations(updatedDonations);
    } catch (err) {
      setError('Failed to confirm drop-off');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'dropped_off': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
      </div>
      
      <div className="grid gap-5">
        {donations.map((donation) => (
          <div key={donation._id} className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {donation.requestId?.item || 'Item'}
                </h2>
                <p className="text-gray-600 mt-2.5 text-base">
                  {donation.requestId?.description || 'Description'}
                </p>
                
                <div className="mt-3 space-y-2.5">
                  <p className="text-base">
                    <span className="font-medium">Pickup Location:</span>{' '}
                    {donation.pickupLocation.name}
                  </p>
                  <p className="text-base">
                    <span className="font-medium">Drop-off Time:</span>{' '}
                    {new Date(donation.dropOffTime).toLocaleString()}
                  </p>
                  
                  {donation.status === 'dropped_off' && donation.confirmationCode && (
                    <div className="mt-5 p-5 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-base font-medium text-blue-800">Confirmation Code</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">
                        {donation.confirmationCode}
                      </p>
                      <p className="text-sm text-blue-700 mt-2">
                        Share this code with the recipient for verification
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(donation.status)}`}>
                  {donation.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>

                {donation.status === 'in_transit' && (
                  <button
                    onClick={() => handleConfirmDropOff(donation._id)}
                    className="inline-flex items-center px-6 py-2.5 text-lg font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Confirm Drop-off
                  </button>
                )}
              </div>
            </div>

            {donation.messages && donation.messages.length > 0 && (
              <div className="mt-6 border-t pt-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Messages</h3>
                <div className="space-y-3">
                  {donation.messages.map((message, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.isSystemMessage 
                          ? 'bg-gray-50 text-gray-600' 
                          : message.isFromDonor 
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700'
                      }`}
                    >
                      <p className="text-base">{message.content}</p>
                      <p className="text-sm mt-1.5 text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDonations; 