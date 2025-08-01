import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AgentDashboard from '../pages/agent/AgentDashboard';
import Delivery from '../pages/agent/Delivery';
import Tasks from '../pages/agent/Tasks';
import Performance from '../pages/agent/Performance';
import Notification from '../pages/agent/Notification';
import Messages from '../pages/agent/Messages';
import Support from '../pages/agent/Support';

const AdminRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<AgentDashboard />} />
      <Route path="delivery" element={<Delivery />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="performance" element={<Performance />} />
      <Route path="notification" element={<Notification />} />  
      <Route path="message" element={<Messages />} />  
      <Route path="support" element={<Support />} />
    </Routes>
  </DashboardLayout>
);

export default AdminRoutes;