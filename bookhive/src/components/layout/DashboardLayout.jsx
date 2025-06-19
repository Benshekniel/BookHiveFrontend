import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow p-4 bg-gray-50">{children}</main>
    <Footer />
  </div>
);

export default DashboardLayout;