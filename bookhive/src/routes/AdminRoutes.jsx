import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/admin/Dashboard';
import Analytics from '../pages/admin/Analytics';
import ModeratorManagement from '../pages/admin/ModeratorManagement';
import Messages from '../pages/admin/Messages';


const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
  
      <Route path="/" element={<Dashboard />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="moderator" element={<ModeratorManagement />} />
      <Route path="messages" element={<Messages />} />
      
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;