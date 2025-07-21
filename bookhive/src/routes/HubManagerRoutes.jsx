import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Agent from '../pages/hubManager/Agents';
import Dashboard from '../pages/hubManager/Dashboard';
import Deliveries from '../pages/hubManager/Deliveries';
import Messages from '../pages/hubManager/Messages';
import HubRoutes from '../pages/hubManager/Routes';
import Support from '../pages/hubManager/Support';
import ProfileSettings from '../pages/hubManager/ProfileSettings';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="agents" element={<Agent />} />
      <Route path="deliveries" element={<Deliveries />} />
      <Route path="messages" element={<Messages />} />
      <Route path="routes" element={<HubRoutes />} />
      <Route path="support" element={<Support />} />      
      <Route path="profile-settings" element={<ProfileSettings />} />      
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;