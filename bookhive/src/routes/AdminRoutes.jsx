import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="user-management" element={<UserManagement />} />
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;