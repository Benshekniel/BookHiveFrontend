import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Shield, User, Search } from 'lucide-react';

const ModeratorManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newModerator, setNewModerator] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    }
    // Add more moderators if needed
  ];

  const permissions = [
    { id: 'content_moderation', name: 'Content Moderation', description: 'Review and moderate book listings and user content' },
    { id: 'user_management', name: 'User Management', description: 'Manage user accounts and registrations' },
    { id: 'event_management', name: 'Event Management', description: 'Create and manage platform events' },
    { id: 'dispute_resolution', name: 'Dispute Resolution', description: 'Handle user disputes and complaints' },
    { id: 'notification_management', name: 'Notification Management', description: 'Send and manage platform notifications' }
  ];

  const filteredModerators = moderators.filter(moderator => {
    const matchesSearch = moderator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         moderator.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || moderator.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500 text-white',
      inactive: 'bg-slate-200 text-slate-800',
      suspended: 'bg-red-500 text-white'
    };
    return colors[status] || colors.active;
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

  const handleCreateModerator = (e) => {
    e.preventDefault();

    if (newModerator.password !== newModerator.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const moderatorData = {
      name: newModerator.name,
      phone: newModerator.phone,
      email: newModerator.email,
      password: newModerator.password,
      permissions: newModerator.permissions
    };

    console.log('Creating moderator:', moderatorData);

    // TODO: Send to API
    setShowCreateModal(false);
    setNewModerator({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      permissions: []
    });
  };

  const handleEditModerator = (moderator) => {
    setSelectedModerator(moderator);
    setShowEditModal(true);
  };

  return (
    <div className="bg-slate-50 p-6 min-h-screen">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-slate-900">Moderator Management</h1>
          <p className="mt-2 text-sm text-slate-700">
            Manage moderator accounts, permissions, and monitor their activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 focus:outline-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Moderator
          </button>
        </div>
      </div>

      {/* Create Moderator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleCreateModerator}>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Add New Moderator</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newModerator.name}
                      onChange={(e) => setNewModerator({ ...newModerator, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newModerator.phone}
                      onChange={(e) => setNewModerator({ ...newModerator, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newModerator.email}
                      onChange={(e) => setNewModerator({ ...newModerator, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      value={newModerator.password}
                      onChange={(e) => setNewModerator({ ...newModerator, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={newModerator.confirmPassword}
                      onChange={(e) => setNewModerator({ ...newModerator, confirmPassword: e.target.value })}
                      className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
                    <div className="space-y-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={newModerator.permissions.includes(permission.id)}
                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                            className="h-4 w-4 rounded text-blue-900 focus:ring-blue-500 border-slate-200"
                          />
                          <div className="ml-3 text-sm">
                            <label className="font-medium text-slate-700">{permission.name}</label>
                            <p className="text-slate-500">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:flex sm:justify-end space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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