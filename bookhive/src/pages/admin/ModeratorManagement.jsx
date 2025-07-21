import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Shield, User, Search, X } from 'lucide-react';
import axios from "axios";

const ModeratorManagement = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Moderators state for dynamic addition, edit, delete
  const [moderators, setModerators] = useState([
    {
      id: 1,
      name: 'Alice Smith',
      email: 'alice.smith@bookhive.com',
      phone: '+1 234 5678',
      employeeId: 'EMP001',
      dateOfBirth: '1990-05-15',
      address: '123 Main St',
      city: 'New York',
      emergencyContact: 'John Smith',
      emergencyPhone: '+1 876 5432',
      qualifications: 'Bachelor in Literature',
      experience: '5 years in content moderation',
      notes: 'Excellent team player',
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
      phone: '+1 345 6789',
      employeeId: 'EMP002',
      dateOfBirth: '1985-08-20',
      address: '456 Elm St',
      city: 'Los Angeles',
      emergencyContact: 'Jane Johnson',
      emergencyPhone: '+1 987 6543',
      qualifications: 'Master in Communications',
      experience: '7 years in event management',
      notes: 'Strong leadership skills',
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
      phone: '+1 456 7890',
      employeeId: 'EMP003',
      dateOfBirth: '1992-03-10',
      address: '789 Oak St',
      city: 'Chicago',
      emergencyContact: 'Mike Davis',
      emergencyPhone: '+1 765 4321',
      qualifications: 'Bachelor in Psychology',
      experience: '4 years in user management',
      notes: 'Detail-oriented',
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
      phone: '+1 567 8901',
      employeeId: 'EMP004',
      dateOfBirth: '1988-11-25',
      address: '101 Pine St',
      city: 'San Francisco',
      emergencyContact: 'Sarah Wilson',
      emergencyPhone: '+1 654 3210',
      qualifications: 'Master in Law',
      experience: '6 years in dispute resolution',
      notes: 'Highly analytical',
      status: 'inactive',
      lastActivity: '2023-12-28 14:20:00',
      createdAt: '2023-09-10',
      permissions: ['content_moderation', 'dispute_resolution'],
      actionsCount: 67,
      warningsIssued: 5
    }
  ]);

  // State for add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModerator, setNewModerator] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    dateOfBirth: '',
    address: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',
    qualifications: '',
    experience: '',
    notes: '',
    status: 'active'
  });

  const permissionsList = [
    { id: 'content_moderation', name: 'Content Moderation', description: 'Review and moderate book listings, forum posts, and user-generated content' },
    { id: 'user_management', name: 'User Management', description: 'Manage user accounts, registrations, and profile verification' },
    { id: 'event_management', name: 'Event Management', description: 'Create, manage, and promote platform events and book drives' },
    { id: 'dispute_resolution', name: 'Dispute Resolution', description: 'Handle user disputes, complaints, and conflict mediation' }
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
      active: 'bg-green-500 text-white',
      inactive: 'bg-slate-200 text-slate-800',
      suspended: 'bg-red-500 text-white'
    };
    return colors[status] || colors.active;
  };

const handleModeratorAdd = async (e) => {
  e.preventDefault(); 
  try {
    const moderatorData = {
      name: newModerator.name,
      email: newModerator.email,
      password: newModerator.password,
      phone: parseInt(newModerator.phone, 10),  // parse phone to int if needed
      dob: newModerator.dateOfBirth,            // assuming string like 'YYYY-MM-DD'
      city: newModerator.city,
      experience: parseInt(newModerator.experience, 10),
      address: newModerator.address
    };

    // POST JSON data to your backend API
    const response = await axios.post('http://localhost:9090/api/registerModerator', moderatorData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.message === 'success') {
      alert('Moderator added successfully!');
      setShowAddModal(false);
      // Optionally clear your form state or refresh list here
    } else {
      alert('Error: ' + (response.data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error adding moderator:', error);
    alert('Failed to add moderator: ' + (error.response?.data?.message || error.message));
  }
};

  const handleViewModerator = (moderator) => {
    setSelectedModerator(moderator);
    setShowViewModal(true);
  };

  const handleEditModerator = (moderator) => {
    setSelectedModerator(moderator);
    setShowEditModal(true);
  };

  const handleDeleteModerator = (id) => {
    if (window.confirm('Are you sure you want to delete this moderator?')) {
      setModerators(moderators.filter(mod => mod.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModerator({ ...newModerator, [name]: value });
  };

  const handleUpdateModerator = (e) => {
    e.preventDefault();
    setModerators(moderators.map(mod => 
      mod.id === selectedModerator.id ? { ...selectedModerator } : mod
    ));
    setShowEditModal(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedModerator({ ...selectedModerator, [name]: value });
  };

  return (
    <div className="bg-white p-6 min-h-screen">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-slate-900">Moderator Management</h1>
          <p className="mt-2 text-sm text-slate-700">
            Manage moderator accounts, permissions, and monitor their activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Moderator
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-6 border border-slate-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Search Moderators</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

      <div className="bg-white shadow rounded-lg mb-8 border border-slate-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">Current Moderators</h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Moderator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredModerators.map((moderator) => (
                  <tr key={moderator.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="h-5 w-5 text-white"><User /></div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{moderator.name}</div>
                          <div className="text-sm text-slate-500">{moderator.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(moderator.status)}`}>
                        {moderator.status.charAt(0).toUpperCase() + moderator.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{moderator.permissions.length} permissions</div>
                      <div className="text-sm text-slate-500">
                        {moderator.permissions.slice(0, 2).map(p => 
                          permissionsList.find(perm => perm.id === p)?.name
                        ).join(', ')}
                        {moderator.permissions.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{moderator.actionsCount} actions</div>
                      <div className="text-sm text-slate-500">{moderator.warningsIssued} warnings</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {moderator.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewModerator(moderator)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditModerator(moderator)}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteModerator(moderator.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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

      <div className="bg-white shadow rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">Recent Moderator Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {activityLog.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activityLog.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center ring-8 ring-white">
                          <Shield className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-slate-500">
                            <span className="font-medium text-slate-900">{activity.moderatorName}</span> {activity.action.toLowerCase()}
                          </p>
                          <p className="text-sm text-slate-400">{activity.details}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-slate-500">
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

      {/* Add Moderator Modal */}
      {/* {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/30" onClick={() => setShowAddModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Add New Moderator</h3>
              <form onSubmit={handleSimpleAdd}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newModerator.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newModerator.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newModerator.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newModerator.dateOfBirth}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={newModerator.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={newModerator.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Experience</label>
                    <input
                      type="number"
                      name="experience"
                      value={newModerator.experience}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter years of experience"
                      min="0"
                    />
                  </div>

                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}

{showAddModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="fixed inset-0 bg-black/30" onClick={() => setShowAddModal(false)}></div>

    <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full p-8 z-50">
      <button
        onClick={() => setShowAddModal(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
      >
        <X className="h-5 w-5" />
      </button>

      <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
        Add New Moderator
      </h3>

      <form onSubmit={handleModeratorAdd}>
        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              value={newModerator.name}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={newModerator.email}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter email"
            />
          </div>
          {/* Pass */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={newModerator.password}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter password"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={newModerator.phone}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter phone"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={newModerator.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Address</label>
            <input
              type="text"
              name="address"
              value={newModerator.address}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter address"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              name="city"
              value={newModerator.city}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter city"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={newModerator.experience}
              onChange={handleInputChange}
              min="0"
              className="mt-1 w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2"
              placeholder="Enter years of experience"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* View Moderator Modal (Read-only) */}
      {showViewModal && selectedModerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/30" onClick={() => setShowViewModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Moderator Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Name</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Employee ID</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.employeeId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.dateOfBirth}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Address</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">City</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Emergency Contact Name</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.emergencyContact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Emergency Contact Phone</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.emergencyPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Qualifications</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.qualifications}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Experience</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Notes</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.notes}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Last Activity</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.lastActivity}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Moderator Modal */}
      {showEditModal && selectedModerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/30" onClick={() => setShowEditModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Edit Moderator</h3>
              <form onSubmit={handleUpdateModerator}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedModerator.name}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedModerator.email}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={selectedModerator.phone}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={selectedModerator.employeeId}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={selectedModerator.dateOfBirth}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={selectedModerator.address}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={selectedModerator.city}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={selectedModerator.emergencyContact}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={selectedModerator.emergencyPhone}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Qualifications</label>
                    <textarea
                      name="qualifications"
                      value={selectedModerator.qualifications}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Experience</label>
                    <textarea
                      name="experience"
                      value={selectedModerator.experience}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Notes</label>
                    <textarea
                      name="notes"
                      value={selectedModerator.notes}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select
                      name="status"
                      value={selectedModerator.status}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Update
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
