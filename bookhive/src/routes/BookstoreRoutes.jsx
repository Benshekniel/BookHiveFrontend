import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
const BookstoreDashboard = () => <div><h1>Bookstore Dashboard</h1></div>;

const BookstoreRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="" element={<BookstoreDashboard />} />
    </Routes>
  </DashboardLayout>
);

export default BookstoreRoutes;