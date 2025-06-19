import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Edit, Trash2, LogOut } from 'lucide-react';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joined: '2025-06-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', status: 'Active', joined: '2025-05-15' },
    { id: 3, name: 'Alex Brown', email: 'alex@example.com', role: 'User', status: 'Inactive', joined: '2025-04-20' },
    { id: 4, name: 'Maria Garcia', email: 'maria@example.com', role: 'Admin', status: 'Active', joined: '2025-03-10' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log(`Deleted user with ID: ${id}`);
      // TODO: Implement delete logic
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <header className="bg-white shadow-md p-4 flex justify-between items-center" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#407aff' }}>
          User Management
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
            <Link to="/admin/dashboard" className="block p-2 rounded" style={{ color: '#407aff' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Dashboard
            </Link>
            <Link to="/admin/users" className="block p-2 rounded" style={{ color: '#407aff', backgroundColor: '#F9FAFB' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#F9FAFB')}
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
          <div className="mb-6">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, or role..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none"
                style={{
                  borderColor: '#D1D5DB',
                  boxShadow: '0 0 0 2px rgba(255, 214, 57, 0.5)',
                }}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <Link to="/admin/users/add" className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#ffd639', color: '#407aff' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#FFC107')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#ffd639')}
            >
              Add New User
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>ID</th>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>Name</th>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>Email</th>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>Role</th>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>Status</th>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>Joined</th>
                  <th className="p-2 text-left" style={{ color: '#6B7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t" style={{ borderColor: '#E5E7EB' }}>
                    <td className="p-2" style={{ color: '#374151' }}>{user.id}</td>
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
                    <td className="p-2" style={{ color: '#374151' }}>{user.joined}</td>
                    <td className="p-2 flex space-x-2">
                      <Link to={`/admin/users/edit/${user.id}`} className="p-1 rounded" style={{ color: '#407aff' }}
                        onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
                        onMouseOut={(e) => (e.target.style.color = '#407aff')}
                      >
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(user.id)} className="p-1 rounded" style={{ color: '#EF4444' }}
                        onMouseOver={(e) => (e.target.style.color = '#DC2626')}
                        onMouseOut={(e) => (e.target.style.color = '#EF4444')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;