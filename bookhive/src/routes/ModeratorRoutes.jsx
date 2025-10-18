import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

import ModeratorDashboard from '../pages/moderator/Home';
import Charity from '../pages/moderator/tabs/Charity';
import BookCircle from '../pages/moderator/tabs/BookCircle';
import Competitions from '../pages/moderator/tabs/Competitions';
import Users from '../pages/moderator/tabs/Users';
import Hub from '../pages/moderator/tabs/Hub';
import Compliance from '../pages/moderator/tabs/Compliance';
import Settings from '../pages/moderator/tabs/Settings';
import Messages from '../pages/moderator/Messages';
import Support from '../pages/moderator/tabs/Support';
import Testing from '../pages/moderator/tabs/Testing';



const ModeratorRoutes = () => (
  <DashboardLayout>
    <Routes>
          <Route path="/" element={<ModeratorDashboard />} />
          <Route path="home" element={<ModeratorDashboard />} />
          <Route path="charity" element={<Charity />} />
          <Route path="bookcircle" element={<BookCircle />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="users" element={<Users />} />
          <Route path="hub" element={<Hub />} />
          <Route path="compliance" element={<Compliance />} />  
          <Route path="settings" element={<Settings />} />  
          <Route path="message" element={<Messages />} />  
          <Route path="support" element={<Support />} />
          <Route path="test" element={<Testing />} />

    </Routes>
  </DashboardLayout>
);

export default ModeratorRoutes;