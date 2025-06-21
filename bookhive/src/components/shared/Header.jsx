import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

const Header = ({ activeSection, sidebarCollapsed, setSidebarCollapsed }) => {
  const getSectionTitle = () => {
    const titles = {
      home: 'Dashboard Overview',
      charity: 'Charity Management',
      bookcircle: 'Book Circle Moderation',
      competitions: 'Competition Management',
      support: 'Support Center',
      compliance: 'Compliance Monitoring',
      hub: 'Hub Management',
      users: 'User Management'
    };
    return titles[activeSection] || 'Dashboard';
  };

  return (
    <header 
      className="shadow-sm border-b px-6 py-4"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <Menu 
              className="w-5 h-5"
              style={{ color: '#0F172A' }}
            />
          </button>
          <div>
            <h1 
              className="text-2xl font-bold"
              style={{ 
                color: '#0F172A',
                fontFamily: 'Poppins, system-ui, sans-serif'
              }}
            >
              {getSectionTitle()}
            </h1>
            <p 
              className="text-sm"
              style={{ color: '#6B7280' }}
            >
              Welcome back, Moderator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: '#9CA3AF' }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#0F172A'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'transparent';
                e.target.style.boxShadow = '0 0 0 2px #3B82F6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg transition-colors"
            style={{ 
              color: '#6B7280',
              backgroundColor: 'transparent'
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

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#1E3A8A' }}
            >
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p 
                className="text-sm font-medium"
                style={{ 
                  color: '#0F172A',
                  fontFamily: 'Open Sans, system-ui, sans-serif'
                }}
              >
                Alex Johnson
              </p>
              <p 
                className="text-xs"
                style={{ color: '#6B7280' }}
              >
                Moderator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;