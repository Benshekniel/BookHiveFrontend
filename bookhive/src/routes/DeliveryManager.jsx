import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/manager/Dashboard';
import Delivery from '../pages/manager/Delivery';
import Agents from '../pages/manager/Agents'
import Hubs from '../pages/manager/Hubs';
import Support from '../pages/manager/Support';
import Messages from '../pages/manager/Messages';
import Schedule from '../pages/manager/Schedule';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="delivery" element={<Delivery />} />
      <Route path="agents" element={<Agents />} />
      <Route path="hubs" element={<Hubs />} />
      <Route path="support" element={<Support />} />
      <Route path="messages" element={<Messages />} />
      <Route path="Schedule" element={<Schedule />} />
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;