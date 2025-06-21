import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AgentDashboard from '../pages/agent/AgentDashboard';
import OrderTracking from '../pages/agent/OrderTracking';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<AgentDashboard />} />
      <Route path="tracking" element={<OrderTracking />} />
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;