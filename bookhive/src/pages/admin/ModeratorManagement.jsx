import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Shield, User, Mail, Calendar, Search, Filter } from 'lucide-react';

const ModeratorManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newModerator, setNewModerator] = useState({
    name: '',
    email: '',
    permissions: []
  });

  const moderators = [
    {
      id: 1,
      name: 'Alice Smith',
      email: 'alice.smith@bookhive.com',
      status: 'active',
      lastActivity: '2024-01-15 10:30:00',
      createdAt: '2023-12-01',
      permissions: ['content_moderation', 'user_management'],
      actionsCount: 145,
      warningsIssued: 12
    },
    {
      id: 2,
      name: 'Bob Johnson',
      email: 'bob.johnson@bookhive.com',
      status: 'active',
      lastActivity: '2024-01-14 16:45:00',
      createdAt: '2023-11-15',
      permissions: ['content_moderation', 'event_management'],
      actionsCount: 89,
      warningsIssued: 8
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@bookhive.com',
      status: 'suspended',
      lastActivity: '2024-01-10 09:15:00',
      createdAt: '2023-10-20',
      permissions: ['user_management'],
      actionsCount: 234,
      warningsIssued: 25
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@bookhive.com',
      status: 'inactive',
      lastActivity: '2023-12-28 14:20:00',
      createdAt: '2023-09-10',
      permissions: ['content_moderation', 'dispute_resolution'],
      actionsCount: 67,
      warningsIssued: 5
    }
  ];

  const permissions = [
    { id: 'content_moderation', name: 'Content Moderation', description: 'Review and moderate book listings and user content' },
    { id: 'user_management', name: 'User Management', description: 'Manage user accounts and registrations' },
    { id: 'event_management', name: 'Event Management', description: 'Create and manage platform events' },
    { id: 'dispute_resolution', name: 'Dispute Resolution', description: 'Handle user disputes and complaints' },
    { id: 'notification_management', name: 'Notification Management', description: 'Send and manage platform notifications' }
  ];

  const activityLog = [
    {
      id: 1,
      moderatorId: 1,
      moderatorName: 'Alice Smith',
      action: 'Approved book listing',
      details: 'Approved "The Great Gatsby" by John Doe',
      timestamp: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      moderatorId: 2,
      moderatorName: 'Bob Johnson',
      action: 'Removed inappropriate content',
      details: 'Removed forum post with inappropriate language',
      timestamp: '2024-01-14 16:45:00'
    },
    {
      id: 3,
      moderatorId: 1,
      moderatorName: 'Alice Smith',
      action: 'Suspended user account',
      details: 'Suspended user "baduser123" for policy violations',
      timestamp: '2024-01-14 14:20:00'
    }
  ];

  const filteredModerators = moderators.filter(moderator => {
    const matchesSearch = moderator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         moderator.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || moderator.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.active;
  };

  const handleCreateModerator = (e) => {
    e.preventDefault();
    console.log('Creating moderator:', newModerator);
    setShowCreateModal(false);
    setNewModerator({ name: '', email: '', permissions: [] });
  };

  const handleEditModerator = (moderator) => {
    setSelectedModerator(moderator);
    setShowEditModal(true);
  };

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setNewModerator({
        ...newModerator,
        permissions: [...newModerator.permissions, permissionId]
      });
    } else {
      setNewModerator({
        ...newModerator,
        permissions: newModerator.permissions.filter(p => p !== permissionId)
      });
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Moderator Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage moderator accounts, permissions, and monitor their activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Moderator
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Moderators</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Moderators Table */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Current Moderators</h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Moderator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredModerators.map((moderator) => (
                  <tr key={moderator.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{moderator.name}</div>
                          <div className="text-sm text-gray-500">{moderator.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(moderator.status)}`}>
                        {moderator.status.charAt(0).toUpperCase() + moderator.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{moderator.permissions.length} permissions</div>
                      <div className="text-sm text-gray-500">
                        {moderator.permissions.slice(0, 2).map(p => 
                          permissions.find(perm => perm.id === p)?.name
                        ).join(', ')}
                        {moderator.permissions.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{moderator.actionsCount} actions</div>
                      <div className="text-sm text-gray-500">{moderator.warningsIssued} warnings</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moderator.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => console.log('View details:', moderator.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditModerator(moderator)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => console.log('Delete moderator:', moderator.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Moderator Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {activityLog.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activityLog.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <Shield className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{activity.moderatorName}</span> {activity.action.toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-400">{activity.details}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Create Moderator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleCreateModerator}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Moderator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newModerator.name}
                        onChange={(e) => setNewModerator({...newModerator, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newModerator.email}
                        onChange={(e) => setNewModerator({...newModerator, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={newModerator.permissions.includes(permission.id)}
                                onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label className="font-medium text-gray-700">{permission.name}</label>
                              <p className="text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    Add Moderator
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorManagement;