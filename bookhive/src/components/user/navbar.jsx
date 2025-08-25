import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  MessageSquare, 
  User,
  BookOpen,
  Trophy,
  CircleDashed,
  Truck,
  Home,
  LogOut
} from 'lucide-react';
import Logo from './logo.png';
// import Button from './Button';

const UserNavbar = ({ user, onLogout, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // User-specific navigation items
  const userNavItems = [
    { label: 'Dashboard', icon: Home, path: '/user', color: '#407aff' },
    { label: 'Browse Books', icon: BookOpen, path: '/user/browse-books', color: '#10b981' },
    { label: 'Book Circles', icon: CircleDashed, path: '/user/book-circles', color: '#8b5cf6' },
    { label: 'Competitions', icon: Trophy, path: '/user/competitions', color: '#f59e0b' },
    { label: 'Orders', icon: Truck, path: '/user/orders', color: '#ef4444' },
  ];

  const { userDetails } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      navigate('/login');
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 max-w-[1400px]">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/user" className="flex-shrink-0">
              <img src={Logo} alt="BookHive Logo" className="h-10 w-auto" />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-grow max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search books, authors, genres..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-7">
              {/* Main Navigation Items */}
              {userNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-yellow-100 text-yellow-800 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} color={isActive ? '#92400e' : item.color} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Notifications */}
              <Link to="/user/notifications" className="relative">
                <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell size={20} className="text-gray-600 hover:text-blue-600 transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
              </Link>

              {/* Messages */}
              <Link to="/user/messages" className="relative">
                <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageSquare size={20} className="text-gray-600 hover:text-blue-600 transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </div>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user?.profileImage || "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden xl:block">
                    {userDetails?.name || user?.name || 'Nive'}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/user/profile-settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} className="inline mr-2" />
                      Profile Settings
                    </Link>
                    {/* <Link
                      to="/user/seller-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Home size={16} className="inline mr-2" />
                      Seller Dashboard
                    </Link> */}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-3 lg:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <div className="space-y-2">
                {/* User Profile Info */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-4">
                  <img
                    src={user?.profileImage || "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user?.username || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>

                {/* Navigation Items */}
                {userNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-yellow-100 text-yellow-800 font-medium' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={20} color={isActive ? '#92400e' : item.color} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Mobile Notifications & Messages */}
                <Link
                  to="/user/notifications"
                  className="flex items-center justify-between px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Bell size={20} />
                    <span>Notifications</span>
                  </div>
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Link>

                <Link
                  to="/user/messages"
                  className="flex items-center justify-between px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare size={20} />
                    <span>Messages</span>
                  </div>
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Link>

                <Link
                  to="/user/profile-settings"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profile Settings</span>
                </Link>

                {/* <Link
                  to="/user/seller-dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={20} />
                  <span>Seller Dashboard</span>
                </Link> */}

                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close profile menu */}
        {isProfileMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsProfileMenuOpen(false)}
          />
        )}
      </nav>
      {/* Render routed children below the navbar */}
      <div>
        {children}
      </div>
    </>
  );
};

export default UserNavbar;