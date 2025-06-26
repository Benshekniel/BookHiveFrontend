import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, AlertTriangle, Star } from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Kasun Perera',
      email: 'kasun.perera@email.com',
      regNumber: 'REG001',
      role: 'Reader',
      trustScore: 4.8,
      status: 'approved',
      lastActivity: '2 hours ago',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Nimali Silva',
      email: 'nimali.silva@email.com',
      regNumber: 'REG002',
      role: 'Lender',
      trustScore: 4.9,
      status: 'approved',
      lastActivity: '1 day ago',
      joinDate: '2024-01-10'
    },
    {
      id: 3,
      name: 'Rajesh Fernando',
      email: 'rajesh.fernando@email.com',
      regNumber: 'REG003',
      role: 'Seller',
      trustScore: 4.6,
      status: 'pending',
      lastActivity: 'Never',
      joinDate: '2024-01-20'
    },
    {
      id: 4,
      name: 'Priya Wickramasinghe',
      email: 'priya.wickrama@email.com',
      regNumber: 'REG004',
      role: 'Reader',
      trustScore: 3.2,
      status: 'suspended',
      lastActivity: '1 week ago',
      joinDate: '2023-12-05'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-400 text-white';
      case 'suspended': return 'bg-red-500 text-white';
      case 'rejected': return 'bg-slate-200 text-slate-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const getTrustScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-500';
    if (score >= 3.5) return 'text-yellow-400';
    return 'text-red-500';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.regNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-2 text-lg">Manage user accounts, approvals, and permissions</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
            23 Pending Approvals
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-lg">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or registration number..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors duration-200 flex items-center gap-2 shadow-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trust Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-100 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                      <div className="text-xs text-slate-400">{user.regNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${getTrustScoreColor(user.trustScore)} fill-current`} />
                      <span className={`text-sm font-semibold ${getTrustScoreColor(user.trustScore)}`}>
                        {user.trustScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'pending' && (
                        <>
                          <button className="text-green-500 hover:text-green-700 p-2 hover:bg-green-100 rounded-lg transition-colors duration-200">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors duration-200">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user.status === 'approved' && (
                        <button className="text-yellow-400 hover:text-yellow-600 p-2 hover:bg-yellow-100 rounded-lg transition-colors duration-200">
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;