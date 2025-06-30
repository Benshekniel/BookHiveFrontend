import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Feedback from '../pages/organization/Feedback';
import Dashboard from '../pages/organization/Dashboard';
import BookRequest from '../pages/organization/BookRequest';
import DonationsReceived from '../pages/organization/DonationsReceived';
import Messages from '../pages/organization/Messages';
import Notifications from '../pages/organization/Notifications';
import ProfileSettings from '../pages/organization/ProfileSettings';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      
      <Route path="feedback" element={<Feedback />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="request" element={<BookRequest />} />
      <Route path="received" element={<DonationsReceived />} />
      <Route path="messages" element={<Messages />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<ProfileSettings />} />
      
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;