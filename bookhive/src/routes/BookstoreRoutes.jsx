import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

import BookstoreDashboard from "../pages/bookstore/Dashboard";
import Inventory from "../pages/bookstore/Inventory";
import Listings from "../pages/bookstore/Listings";
import Transactions from "../pages/bookstore/Transactions";
import Finances from "../pages/bookstore/Finances";
import Support from "../pages/bookstore/Support";

const BookstoreRoutes = () => (
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<BookstoreDashboard />} />
      <Route path="dashboard" element={<BookstoreDashboard />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="listings" element={<Listings />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="finances" element={<Finances />} />
      <Route path="support" element={<Support />} />
    </Routes>
  </DashboardLayout>
);

export default BookstoreRoutes;