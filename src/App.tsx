import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import AdminLayout from './layouts/AdminLayout';
import TouristLayout from './layouts/TouristLayout';
import GuideLayout from './layouts/GuideLayout';
import AdminDashboard from './pages/admin/Dashboard';
import TouristDashboard from './pages/tourist/Dashboard';
import GuideDashboard from './pages/guide/Dashboard';
import Profile from './pages/admin/Profile';
import ChangePassword from './pages/admin/ChangePassword';
import Users from './pages/admin/Users';
import GuideVerification from './pages/admin/guide-verification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './pages/auth/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import ManageMessages from './pages/admin/manage-messages';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<div>Bookings Management</div>} />
          <Route path="guide-approvals" element={<div>Guide Approvals</div>} />
          <Route path="reports" element={<div>Reports</div>} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="guide-verification" element={<GuideVerification />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
        
        {/* Tourist routes */}
        <Route path="/tourist" element={<PrivateRoute allowedRoles={['tourist']}><TouristLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TouristDashboard />} />
          <Route path="guides" element={<div>Available Guides</div>} />
          <Route path="bookings" element={<div>My Bookings</div>} />
          <Route path="messages" element={<div>Messages</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="change-password" element={<div>Change Password</div>} />
        </Route>
        
        {/* Guide routes */}
        <Route path="/guide" element={<PrivateRoute allowedRoles={['guide']}><GuideLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GuideDashboard />} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="bookings" element={<div>My Bookings</div>} />
          <Route path="messages" element={<div>Messages</div>} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;