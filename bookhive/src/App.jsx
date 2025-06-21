import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import './index.css';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const App = () => {
  // Simulated user state (replace with your auth logic)
  const [user, setUser] = useState(null); // e.g., { role: 'admin' } after login
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

  // Map roles to sidebar sections for navigation
  const getActiveSection = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/moderator')) return 'moderator';
    if (path.startsWith('/bookstore')) return 'bookstore';
    if (path.startsWith('/delivery-hub')) return 'delivery-hub';
    if (path.startsWith('/agent')) return 'delivery-agent';
    if (path.startsWith('/organization')) return 'organization';
    if (path.startsWith('/dashboard')) return 'dashboard';
    return 'home';
  };

  // Handle sidebar navigation
  const handleSectionChange = (section) => {
    const routes = {
      home: '/',
      dashboard: '/dashboard',
      admin: '/admin',
      moderator: '/moderator',
      bookstore: '/bookstore',
      'delivery-hub': '/delivery-hub',
      'delivery-agent': '/agent',
      organization: '/organization',
    };
    navigate(routes[section] || '/');
  };

  // Render layout only for authenticated users
  const renderLayout = (children) => (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={getActiveSection()}
        setActiveSection={handleSectionChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeSection={getActiveSection()}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/" element={user ? <Navigate to={getDashboardRoute()} replace /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={renderLayout(<UserRoutes />)} />
        <Route path="/admin/*" element={renderLayout(<AdminRoutes />)} />
        <Route path="/moderator/*" element={renderLayout(<ModeratorRoutes />)} />
        <Route path="/bookstore/*" element={renderLayout(<BookstoreRoutes />)} />
        <Route path="/delivery-hub/*" element={renderLayout(<DeliveryHubRoutes />)} />
        <Route path="/agent/*" element={renderLayout(<DeliveryAgentRoutes />)} />
        <Route path="/organization/*" element={renderLayout(<OrganizationRoutes />)} />
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;