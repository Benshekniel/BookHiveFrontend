import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/general-user/Dashboard';
import BookListing from '../pages/general-user/BookListing';
import TransactionHistory from '../pages/general-user/TransactionHistory';

function UserRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="list-book" element={<BookListing />} />
        <Route path="transactions" element={<TransactionHistory />} />
      </Routes>
    </DashboardLayout>
  );
}

export default UserRoutes;
