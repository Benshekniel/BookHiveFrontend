import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
const DeliveryHubDashboard = () => <div><h1>Delivery Hub Dashboard</h1></div>;

const DeliveryHubRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="" element={<DeliveryHubDashboard />} />
    </Routes>
  </DashboardLayout>
);

export default DeliveryHubRoutes;