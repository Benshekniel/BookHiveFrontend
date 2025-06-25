import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserManagement from '../pages/admin/UserManagement';
import Dashboard from '../pages/admin/Dashboard';
import Analytics from '../pages/admin/Analytics';
import ContentModeration from '../pages/admin/ContentModeration';
import Users from '../pages/admin/Users';
import EventsManagement from '../pages/admin/EventsManagement';
import ModeratorManagement from '../pages/admin/ModeratorManagement';
import NotificationManagement from '../pages/admin/NotificationManagement';
import SecurityCompliance from '../pages/admin/SecurityCompliance';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      
      <Route path="user-management" element={<UserManagement />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="content" element={<ContentModeration />} />
      <Route path="users" element={<Users />} />
      <Route path="events" element={<EventsManagement />} />
      <Route path="moderator" element={<ModeratorManagement />} />
      <Route path="notification" element={<NotificationManagement />} />
      <Route path="security" element={<SecurityCompliance />} />
      
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;