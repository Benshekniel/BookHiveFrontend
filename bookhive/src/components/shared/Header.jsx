import React, { useState } from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useAuth } from '../../App';
import Sidebar from './Sidebar';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ children, isMobileOpen, setIsMobileOpen, collapsed, setCollapsed, onLogout }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  console.log('Header rendered - collapsed:', collapsed, 'isMobileOpen:', isMobileOpen, 'window.innerHeight:', window.innerHeight, 'children:', !!children);

  const pathLabels = {
    '/admin': 'Dashboard',
    '/admin/moderator': 'Moderators',
    '/admin/content': 'Contents',
    '/admin/analytics': 'Analytics',
    '/admin/notification': 'Notification',
    '/admin/security': 'Security',
    '/admin/settings': 'Settings',
    '/moderator': 'Dashboard',
    '/moderator/charity': 'Charity',
    '/moderator/bookcircle': 'BookCircle',
    '/moderator/competitions': 'Competitions',
    '/moderator/users': 'Users',
    '/moderator/hub': 'Hub',
    '/moderator/compliance': 'Compliance',
    '/moderator/support': 'Support',
    '/moderator/test': 'Testing',
    '/moderator/settings': 'Settings',
    '/bookstore': 'Dashboard',
    '/bookstore/inventory': 'Inventory',
    '/bookstore/listings': 'Listings',
    '/bookstore/transactions': 'Transactions',
    '/bookstore/finances': 'Finances',
    '/bookstore/support': 'Support',
    '/manager': 'Dashboard',
    '/manager/agents': 'Delivery Agents',
    '/manager/delivery': 'Delivery',
    '/manager/hubs': 'Hubs',
    '/manager/messages': 'Messages',
    '/manager/support': 'Support',
    '/manager/schedule': 'Settings',
    '/agent': 'Dashboard',
    '/agent/tasks': 'Tasks',
    '/agent/delivery': 'Active Delivery',
    '/agent/notification': 'Notification',
    '/agent/performance': 'Performance',
    '/agent/support': 'Support',
    '/hubmanager': 'Dashboard',
    '/hubmanager/deliveries': 'Delivery',
    '/hubmanager/agents': 'Agents',
    '/hubmanager/messages': 'Messages',
    '/hubmanager/routes': 'Routes',
    '/hubmanager/performance': 'Performance',
    '/hubmanager/support': 'Support',
    '/hubmanager/settings': 'Hub Settings',
    '/organization': 'Dashboard',
    '/organization/reports': 'Reports',
    '/dashboard': 'Dashboard',
    '/user': 'Dashboard',
    '/user/browse-books': 'Browse Books',
    '/user/orders': 'Orders',
    '/user/competitions': 'Competitions',
    '/user/messages': 'Messages',
    '/user/profile-settings': 'Profile Settings',
  };

  // Sri Lankan dummy data based on route
  const getDummyUserData = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.startsWith('/admin')) {
      return {
        name: 'Kasun',
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
      };
    } else if (path.startsWith('/moderator')) {
      return {
        name: 'Nimali',
        image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg'
      };
    } else if (path.startsWith('/bookstore')) {
      return {
        name: 'Rohan',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
      };
    } else if (path.startsWith('/manager')) {
      return {
        name: 'Priya',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
      };
    } else if (path.startsWith('/agent')) {
      return {
        name: 'Chaminda',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
      };
    } else if (path.startsWith('/hubmanager')) {
      return {
        name: 'Sanduni',
        image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
      };
    } else if (path.startsWith('/organization')) {
      return {
        name: 'Mahesh',
        image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'
      };
    } else if (path.startsWith('/user')) {
      return {
        name: 'Tharushi',
        image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg'
      };
    } else {
      return {
        name: 'Amal',
        image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
      };
    }
  };

  const normalize = (str) => str.replace(/\/+$/, '').toLowerCase();
  const pathToCheck = normalize(location.pathname);

  let label = pathLabels[pathToCheck];
  if (!label) {
    const found = Object.entries(pathLabels).find(([key]) =>
      pathToCheck.startsWith(normalize(key))
    );
    label = found ? found[1] : 'Dashboard';
  }

  const dummyData = getDummyUserData();
  const displayName = user?.name || user?.username || dummyData.name;
  const profileImage = user?.profileImage || dummyData.image;

  return (
    <>
      <div className="min-h-screen h-screen bg-background relative">
        {/* Sidebar: fixed on desktop */}
        <Sidebar
          key="main-sidebar"
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={onLogout}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        {/* Main content: only add left margin on desktop */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300
            lg:ml-0
            ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}
          `}
        >
          <header
            className="shadow-sm border-b px-6 py-4"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  className="lg:hidden p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{
                      color: '#0F172A',
                      fontFamily: 'Poppins, system-ui, sans-serif',
                    }}
                  >
                    {label}
                  </h1>
                  <p className="text-sm" style={{ color: '#6B7280' }}></p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="relative p-2 rounded-lg transition-colors"
                  style={{
                    color: '#6B7280',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#0F172A';
                    e.target.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6B7280';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <Bell className="w-5 h-5" />
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#EF4444' }}
                  ></span>
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-yellow-400"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg';
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 hidden xl:block">
                      {displayName}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {location.pathname.split('/')[1] || 'User'}
                        </p>
                      </div>
                      <Link
                        to="profile-settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} className="inline mr-2" />
                        Profile Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <User size={16} className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4">
            {children || <div className="text-gray-500">No content available</div>}
          </main>
        </div>
      </div>
      
      {/* Click outside to close profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;