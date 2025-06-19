import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
const DeliveryAgentDashboard = () => <div><h1>Delivery Agent Dashboard</h1></div>;

const DeliveryAgentRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="" element={<DeliveryAgentDashboard />} />
    </Routes>
  </DashboardLayout>
);

export default DeliveryAgentRoutes;