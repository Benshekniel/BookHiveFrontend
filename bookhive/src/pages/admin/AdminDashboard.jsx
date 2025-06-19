import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, BookOpen, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <Users size={20} />, color: '#ffd639' },
    { title: 'Total Books', value: '5,678', icon: <BookOpen size={20} />, color: '#ffd639' },
    { title: 'Active Sessions', value: '456', icon: <BarChart2 size={20} />, color: '#ffd639' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', status: 'Active' },
    { id: 3, name: 'Alex Brown', email: 'alex@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Maria Garcia', email: 'maria@example.com', role: 'Admin', status: 'Active' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <header className="bg-white shadow-md p-4 flex justify-between items-center" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#407aff' }}>
          Admin Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span style={{ color: '#6B7280' }}>Admin</span>
          <Link to="/" className="flex items-center" style={{ color: '#407aff' }}
            onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
            onMouseOut={(e) => (e.target.style.color = '#407aff')}
          >
            <LogOut size={20} className="mr-1" />
            <span>Logout</span>
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md p-4" style={{ borderRight: '1px solid #E5E7EB' }}>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="block p-2 rounded" style={{ color: '#407aff', backgroundColor: '#F9FAFB' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#F9FAFB')}
            >
              Dashboard
            </Link>
            <Link to="/admin/users" className="block p-2 rounded" style={{ color: '#407aff' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Users
            </Link>
            <Link to="/admin/books" className="block p-2 rounded" style={{ color: '#407aff' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Books
            </Link>
            <Link to="/admin/reports" className="block p-2 rounded" style={{ color: '#407aff' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Reports
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: '#6B7280' }}>{stat.title}</h3>
                    <p className="text-2xl font-bold" style={{ color: '#374151' }}>{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-full" style={{ backgroundColor: 'rgba(255, 214, 57, 0.2)', color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#407aff' }}>
              Recent Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    <th className="p-2 text-left" style={{ color: '#6B7280' }}>Name</th>
                    <th className="p-2 text-left" style={{ color: '#6B7280' }}>Email</th>
                    <th className="p-2 text-left" style={{ color: '#6B7280' }}>Role</th>
                    <th className="p-2 text-left" style={{ color: '#6B7280' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-t" style={{ borderColor: '#E5E7EB' }}>
                      <td className="p-2" style={{ color: '#374151' }}>{user.name}</td>
                      <td className="p-2" style={{ color: '#374151' }}>{user.email}</td>
                      <td className="p-2" style={{ color: '#374151' }}>{user.role}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-sm" style={{ 
                          backgroundColor: user.status === 'Active' ? 'rgba(64, 122, 255, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: user.status === 'Active' ? '#407aff' : '#EF4444'
                        }}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;