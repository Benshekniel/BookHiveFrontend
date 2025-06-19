import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import SignupPage from './pages/common/SignupPage';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ModeratorRoutes from './routes/ModeratorRoutes';
import BookstoreRoutes from './routes/BookstoreRoutes';
import DeliveryHubRoutes from './routes/DeliveryHubRoutes';
import DeliveryAgentRoutes from './routes/DeliveryAgentRoutes';
import OrganizationRoutes from './routes/OrganizationRoutes';
import './index.css'; // Import your global styles
// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const App = () => {
  // Simulated user state (replace with your auth logic)
  const [user, setUser] = useState(null); // e.g., { role: 'admin' } after login

  // Function to simulate login (call this in LoginPage after successful login)
  const login = (userData) => setUser(userData);

  // Function to simulate logout
  const logout = () => setUser(null);

  // Determine dashboard route based on role
  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'moderator':
        return '/moderator';
      case 'bookstore':
        return '/bookstore';
      case 'delivery-hub':
        return '/delivery-hub';
      case 'delivery-agent':
        return '/delivery-agent';
      case 'organization':
        return '/organization';
      case 'user':
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/" element={user ? <Navigate to={getDashboardRoute()} replace /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/moderator/*" element={<ModeratorRoutes />} />
        <Route path="/bookstore/*" element={<BookstoreRoutes />} />
        <Route path="/delivery-hub/*" element={<DeliveryHubRoutes />} />
        <Route path="/delivery-agent/*" element={<DeliveryAgentRoutes />} />
        <Route path="/organization/*" element={<OrganizationRoutes />} />
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;