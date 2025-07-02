import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/general-user/Dashboard';
import BookListing from '../pages/general-user/BookListing';
import TransactionHistory from '../pages/general-user/TransactionHistory';
import Competitions from '../pages/general-user/Competitions';
import ProfileSettings from '../pages/general-user/ProfileSettings';
import Messages from '../pages/general-user/Messages';
import BooksPage from '../pages/general-user/BrowseBooks';
import OrdersPage from '../pages/general-user/Orders';
import BookCircle from '../pages/general-user/BookCircles';
import BookDetailsPage from '../pages/general-user/BookDetails';
import SellerDashboardPage from '../pages/general-user/SellerDashboard';


function UserRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="seller-dashboard" element={<SellerDashboardPage />} />
        <Route path="list-book" element={<BookListing />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="competitions" element={<Competitions />} />
        <Route path="profile-settings" element={<ProfileSettings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="browse-books" element={<BooksPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="book-circles" element={<BookCircle />} />
        <Route path="browse-books/book-details/:id" element={<BookDetailsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default UserRoutes;
