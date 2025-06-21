import React from 'react';
import { 
  Home, 
  Heart, 
  Users, 
  Trophy, 
  HeadphonesIcon, 
  ShieldCheck, 
  MapPin, 
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'charity', label: 'Charity', icon: Heart },
    { id: 'bookcircle', label: 'Book Circle', icon: BookOpen },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'hub', label: 'Hub', icon: MapPin },
    { id: 'users', label: 'Users', icon: UserCheck },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div 
      className={`bg-blue-900 text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}
      style={{ backgroundColor: '#1E3A8A' }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
      >
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <BookOpen 
                className="w-8 h-8"
                style={{ color: '#FBBF24' }}
              />
              <h1 className="text-xl font-bold">BookHive</h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded transition-colors hover:bg-amber-200 hover:text-gray-800"
            style={{ backgroundColor: 'transparent' }}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        {!collapsed && (
          <p 
            className="text-sm mt-1"
            style={{ color: '#BFDBFE' }}
          >
            Moderator Dashboard
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-amber-400 text-gray-800' 
                      : 'text-white hover:bg-amber-200 hover:text-gray-800'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div 
        className="p-2 border-t"
        style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-red-600 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;