import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sidebarMenuConfig } from '../../config/menuconfig';
import { LogOut } from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine role based on URL path
  const getRoleFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/moderator')) return 'moderator';
    if (path.startsWith('/bookstore')) return 'bookstore';
    if (path.startsWith('/manager')) return 'delivery-manager';
    if (path.startsWith('/agent')) return 'delivery-agent';
    if (path.startsWith('/organization')) return 'organization';
    if (path.startsWith('/dashboard')) return 'user';
    if (path.startsWith('/hubmanager')) return 'hub-manager';
    return 'guest'; // Fallback for public routes (e.g., '/', '/login')
  };

  const role = getRoleFromPath();
  const menuItems = sidebarMenuConfig[role] || sidebarMenuConfig.guest;

  // Capitalize role for display
  const displayRole = role === 'guest' ? 'Home' : role.charAt(0).toUpperCase() + role.slice(1);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) onLogout();
    else navigate('/');
  };

  return (
    <div
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`bg-blue-900 text-white transition-all flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}
      style={{
        transitionDuration: collapsed ? '500ms' : '300ms',
        backgroundColor: '#1E3A8A',
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center"
        style={{ 
          borderColor: 'rgba(59, 130, 246, 0.3)',
          minHeight: '65px', // Fixed height to prevent vertical shift
        }}
      >
        <div className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="BookHive Logo"
            className="w-9 h-9 object-contain"
          />
          {!collapsed && (
            <h1 className="text-xl font-bold">
              Book<span style={{ color: '#FBBF24' }}>Hive</span>
            </h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center rounded-lg transition-colors px-3 py-3 min-h-[48px] ${
                    isActive
                      ? 'bg-amber-400 text-gray-800'
                      : 'text-white hover:bg-amber-200 hover:text-gray-800'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-lg transition-colors px-3 py-3 min-h-[48px] hover:bg-red-600`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;