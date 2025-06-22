import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart, 
  Shield, 
  UserCheck, 
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Moderation', icon: BookOpen },
    { id: 'events', label: 'Events & Charity', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'moderators', label: 'Moderators', icon: UserCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen p-4 flex flex-col shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-yellow-500" />
          BookHive Admin
        </h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-300' : ''}`} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;