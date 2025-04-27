import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReceiverAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState('ENTER_MOBILE'); // ENTER_MOBILE or VERIFY_OTP
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/receiver/send-otp', {
        mobileNumber
      });
      setStep('VERIFY_OTP');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/receiver/verify-otp', {
        mobileNumber,
        otp
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userType', 'receiver');
      navigate('/receiver/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'ENTER_MOBILE' ? 'Enter Your Mobile Number' : 'Enter OTP'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'ENTER_MOBILE' 
              ? 'We\'ll send you a one-time password'
              : 'Enter the OTP sent to your mobile number'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {step === 'ENTER_MOBILE' ? (
          <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
            <div>
              <label htmlFor="mobileNumber" className="sr-only">Mobile Number</label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Send OTP
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
            <div>
              <label htmlFor="otp" className="sr-only">OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength="6"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setStep('ENTER_MOBILE')}
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Change mobile number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReceiverAuth; 