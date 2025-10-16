// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import from new file
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
import HubManagerRouters from './routes/HubManagerRoutes';
import Header from './components/shared/Header';
import UserNavbar from './components/user/navbar';
import './index.css';
import UplaodPage from './pages/common/UploadForm';
import { Toaster } from 'react-hot-toast';


import { TrustScoreProvider } from './components/TrustScoreContext';


// Child component to use useAuth
const AppContent = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Now safe to use within AuthProvider

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

  const renderLayout = (children, CustomHeader = Header) => (
    <CustomHeader
      isMobileOpen={isMobileOpen}
      setIsMobileOpen={setIsMobileOpen}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      onLogout={() => {
        logout();
        setIsMobileOpen(false);
        navigate('/');
      }}
      user={user}
    >
      {children}
    </CustomHeader>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to={getDashboardRoute()} replace /> : <HomePage />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/user/*" element={renderLayout(<UserRoutes />, UserNavbar)} />
      <Route path="/admin/*" element={renderLayout(<AdminRoutes />)} />
      <Route path="/moderator/*" element={renderLayout(<ModeratorRoutes />)} />
      <Route path="/hubmanager/*" element={renderLayout(<HubManagerRouters />)} />
      <Route path="/bookstore/*" element={renderLayout(<BookstoreRoutes />)} />
      <Route path="/manager/*" element={renderLayout(<DeliveryManagerRoutes />)} />
      <Route path="/agent/*" element={renderLayout(<DeliveryAgentRoutes />)} />
      <Route path="/organization/*" element={renderLayout(<OrganizationRoutes />)} />
      <Route path="/upload" element={<UplaodPage />} />
      <Route path="*" element={renderLayout(<div>404: Page Not Found</div>)} />
    </Routes>
  );
};

const App = () => {
  return (
<AuthProvider>
      <TrustScoreProvider>
        <AppContent />
      <Toaster toastOptions={{
        className: '',
        style: {
          background: '#1E3A8A',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '0.5rem',
          border: '4px solid #FBBF24',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        },
      }} />
      </TrustScoreProvider>
    </AuthProvider>
  );
};

export default App;



// // src/App.jsx
// import React, { useState } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './components/AuthContext'; // Import from new file
// import HomePage from './pages/common/HomePage';
// import LoginPage from './pages/common/LoginPage';
// import SignupPage from './pages/common/SignupPage';
// import UserRoutes from './routes/UserRoutes';
// import AdminRoutes from './routes/AdminRoutes';
// import ModeratorRoutes from './routes/ModeratorRoutes';
// import BookstoreRoutes from './routes/BookstoreRoutes';
// import DeliveryManagerRoutes from './routes/DeliveryManager';
// import DeliveryAgentRoutes from './routes/DeliveryAgentRoutes';
// import OrganizationRoutes from './routes/OrganizationRoutes';
// import HubManagerRouters from './routes/HubManagerRoutes';
// import Header from './components/shared/Header';
// import UserNavbar from './components/user/navbar';
// import './index.css';
// import UplaodPage from './pages/common/UploadForm';

// // Child component to use useAuth
// const AppContent = () => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const { user, logout } = useAuth(); // Now safe to use within AuthProvider

//   const getDashboardRoute = () => {
//     switch (user?.role) {
//       case 'admin':
//         return '/admin';
//       case 'moderator':
//         return '/moderator';
//       case 'bookstore':
//         return '/bookstore';
//       case 'delivery-hub':
//         return '/delivery-hub';
//       case 'delivery-agent':
//         return '/agent';
//       case 'organization':
//         return '/organization';
//       case 'user':
//         return '/dashboard';
//       default:
//         return '/';
//     }
//   };

//   const renderLayout = (children, CustomHeader = Header) => (
//     <CustomHeader
//       isMobileOpen={isMobileOpen}
//       setIsMobileOpen={setIsMobileOpen}
//       collapsed={collapsed}
//       setCollapsed={setCollapsed}
//       onLogout={() => {
//         logout();
//         setIsMobileOpen(false);
//         navigate('/');
//       }}
//       user={user}
//     >
//       {children}
//     </CustomHeader>
//   );

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={user ? <Navigate to={getDashboardRoute()} replace /> : <HomePage />}
//       />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/signup" element={<SignupPage />} />
//       <Route path="/user/*" element={renderLayout(<UserRoutes />, UserNavbar)} />
//       <Route path="/admin/*" element={renderLayout(<AdminRoutes />)} />
//       <Route path="/moderator/*" element={renderLayout(<ModeratorRoutes />)} />
//       <Route path="/hubmanager/*" element={renderLayout(<HubManagerRouters />)} />
//       <Route path="/bookstore/*" element={renderLayout(<BookstoreRoutes />)} />
//       <Route path="/manager/*" element={renderLayout(<DeliveryManagerRoutes />)} />
//       <Route path="/agent/*" element={renderLayout(<DeliveryAgentRoutes />)} />
//       <Route path="/organization/*" element={renderLayout(<OrganizationRoutes />)} />
//       <Route path="/upload" element={<UplaodPage />} />
//       <Route path="*" element={renderLayout(<div>404: Page Not Found</div>)} />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// };

// export default App;