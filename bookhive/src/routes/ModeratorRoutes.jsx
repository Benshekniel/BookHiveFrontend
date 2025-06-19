import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
const ModeratorDashboard = () => <div><h1>Moderator Dashboard</h1></div>;

const ModeratorRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="" element={<ModeratorDashboard />} />
    </Routes>
  </DashboardLayout>
);

export default ModeratorRoutes;