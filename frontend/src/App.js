import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserTypeSelection from './pages/UserTypeSelection';
import DonorLogin from './pages/DonorLogin';
import DonorRegister from './pages/DonorRegister';
import ReceiverAuth from './pages/ReceiverAuth';
import Home from './pages/Home';
import DonationFlow from './pages/DonationFlow';
import MyDonations from './pages/MyDonations';
import ReceiverDashboard from './pages/ReceiverDashboard';
import Navbar from './components/Navbar';

function ProtectedRoute({ children, allowedUserType }) {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<UserTypeSelection />} />
            <Route path="/donor/login" element={<DonorLogin />} />
            <Route path="/donor/register" element={<DonorRegister />} />
            <Route path="/receiver/auth" element={<ReceiverAuth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/donate/:requestId" element={
              <ProtectedRoute allowedUserType="donor">
                <DonationFlow />
              </ProtectedRoute>
            } />
            <Route path="/my-donations" element={
              <ProtectedRoute allowedUserType="donor">
                <MyDonations />
              </ProtectedRoute>
            } />
            <Route path="/receiver/dashboard" element={
              <ProtectedRoute allowedUserType="receiver">
                <ReceiverDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
