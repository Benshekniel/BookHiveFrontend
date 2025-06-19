import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
const OrganizationDashboard = () => <div><h1>Organization Dashboard</h1></div>;

const OrganizationRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="" element={<OrganizationDashboard />} />
    </Routes>
  </DashboardLayout>
);

export default OrganizationRoutes;