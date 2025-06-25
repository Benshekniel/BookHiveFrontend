// src/App.jsx
import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import SignupPage from './pages/common/SignupPage';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ModeratorRoutes from './routes/ModeratorRoutes';
import BookstoreRoutes from './routes/BookstoreRoutes';
import DeliveryManagerRoutes from './routes/DeliveryManager';
import DeliveryAgentRoutes from './routes/DeliveryAgentRoutes';
import OrganizationRoutes from './routes/OrganizationRoutes';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import './index.css';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const App = () => {
  // Simulated user state (replace with actual auth logic)
  const [user, setUser] = useState(null); // e.g., { name: 'Alex Johnson', role: 'admin' } after login
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Function to simulate login
  const login = (userData) => setUser(userData);

  // Function to simulate logout
  const logout = () => {
    setUser(null);
    navigate('/');
  };

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
        return '/agent';
      case 'organization':
        return '/organization';
      case 'user':
        return '/dashboard';
      default:
        return '/';
    }
  };

  // Handle logout for Sidebar
  const handleLogout = () => {
    setUser(null); // Clear user state (if still using AuthContext elsewhere)
    navigate('/');
  };

  // Render layout for authenticated routes
  const renderLayout = (children) => (
    <div className="flex h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={getDashboardRoute()} replace /> : <HomePage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={renderLayout(<UserRoutes />)} />
        <Route path="/admin/*" element={renderLayout(<AdminRoutes />)} />
        <Route path="/moderator/*" element={renderLayout(<ModeratorRoutes />)} />
        <Route path="/bookstore/*" element={renderLayout(<BookstoreRoutes />)} />
        <Route path="/manager/*" element={renderLayout(<DeliveryManagerRoutes />)} />
        <Route path="/agent/*" element={renderLayout(<DeliveryAgentRoutes />)} />
        <Route path="/organization/*" element={renderLayout(<OrganizationRoutes />)} />
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;