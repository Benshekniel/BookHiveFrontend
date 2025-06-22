import React, { useState } from 'react';
import { Plus, Send, Edit, Trash2, Eye, Bell, Users, Calendar, Mail, Filter, Search } from 'lucide-react';

const NotificationManagement = () => {
  const [selectedTab, setSelectedTab] = useState('templates');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    category: 'general'
  });

  const [newNotification, setNewNotification] = useState({
    templateId: '',
    recipients: 'all',
    customRecipients: '',
    scheduledTime: '',
    variables: {}
  });

  const templates = [
    {
      id: 1,
      name: 'Book Due Reminder',
      type: 'email',
      category: 'reminders',
      subject: 'Your borrowed book is due soon',
      content: 'Dear {{userName}}, your borrowed book "{{bookTitle}}" is due on {{dueDate}}. Please return it on time.',
      lastModified: '2024-01-10',
      usageCount: 156
    },
    {
      id: 2,
      name: 'Event Announcement',
      type: 'push',
      category: 'events',
      subject: 'New Event: {{eventTitle}}',
      content: 'Join us for {{eventTitle}} starting {{eventDate}}. Don\'t miss out!',
      lastModified: '2024-01-08',
      usageCount: 89
    },
    {
      id: 3,
      name: 'Welcome New User',
      type: 'email',
      category: 'welcome',
      subject: 'Welcome to BookHive!',
      content: 'Welcome {{userName}}! Your account has been approved. Start exploring our vast collection of books.',
      lastModified: '2024-01-05',
      usageCount: 234
    },
    {
      id: 4,
      name: 'Trust Score Update',
      type: 'in-app',
      category: 'achievements',
      subject: 'Trust Score Updated',
      content: 'Congratulations {{userName}}! Your Trust Score has increased to {{trustScore}}.',
      lastModified: '2024-01-03',
      usageCount: 67
    }
  ];

  const sentNotifications = [
    {
      id: 1,
      templateName: 'Book Due Reminder',
      subject: 'Your borrowed book is due soon',
      recipients: 45,
      sentAt: '2024-01-15 09:30:00',
      status: 'delivered',
      openRate: '78%',
      clickRate: '12%'
    },
    {
      id: 2,
      templateName: 'Event Announcement',
      subject: 'New Event: Writing Competition 2024',
      recipients: 1200,
      sentAt: '2024-01-14 14:15:00',
      status: 'delivered',
      openRate: '65%',
      clickRate: '23%'
    },
    {
      id: 3,
      templateName: 'Welcome New User',
      subject: 'Welcome to BookHive!',
      recipients: 15,
      sentAt: '2024-01-13 10:45:00',
      status: 'delivered',
      openRate: '92%',
      clickRate: '45%'
    },
    {
      id: 4,
      templateName: 'System Maintenance',
      subject: 'Scheduled Maintenance Notice',
      recipients: 2847,
      sentAt: '2024-01-12 16:00:00',
      status: 'failed',
      openRate: '0%',
      clickRate: '0%'
    }
  ];

  const categories = [
    { id: 'general', name: 'General', color: 'bg-gray-100 text-gray-800' },
    { id: 'reminders', name: 'Reminders', color: 'bg-blue-100 text-blue-800' },
    { id: 'events', name: 'Events', color: 'bg-purple-100 text-purple-800' },
    { id: 'welcome', name: 'Welcome', color: 'bg-green-100 text-green-800' },
    { id: 'achievements', name: 'Achievements', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'security', name: 'Security', color: 'bg-red-100 text-red-800' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || template.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.pending;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      case 'in-app':
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.color : 'bg-gray-100 text-gray-800';
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    console.log('Creating template:', newTemplate);
    setShowCreateModal(false);
    setNewTemplate({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      category: 'general'
    });
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    console.log('Sending notification:', newNotification);
    setShowSendModal(false);
    setNewNotification({
      templateId: '',
      recipients: 'all',
      customRecipients: '',
      scheduledTime: '',
      variables: {}
    });
  };

  const tabs = [
    { id: 'templates', name: 'Templates', icon: Edit },
    { id: 'sent', name: 'Sent Notifications', icon: Send },
    { id: 'scheduled', name: 'Scheduled', icon: Calendar }
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Notification Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage notification templates, send messages to users, and track delivery metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          <button
            onClick={() => setShowSendModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Edit className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Templates</dt>
                  <dd className="text-lg font-medium text-gray-900">{templates.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Send className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sent This Month</dt>
                  <dd className="text-lg font-medium text-gray-900">1,247</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">74%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Scheduled</dt>
                  <dd className="text-lg font-medium text-gray-900">5</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <div>
          {/* Search and Filter */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Templates</label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                        <div className="flex items-center">
                          {getTypeIcon(template.type)}
                        </div>
                      </div>
                      <div className="flex space-x-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          {categories.find(cat => cat.id === template.category)?.name}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {template.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-2">{template.subject}</p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.content}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Used {template.usageCount} times</span>
                        <span>Modified {template.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center p-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent Notifications Tab */}
      {selectedTab === 'sent' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Notifications</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Template & Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sentNotifications.map((notification) => (
                    <tr key={notification.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{notification.templateName}</div>
                        <div className="text-sm text-gray-500">{notification.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{notification.recipients}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                          {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Open: {notification.openRate}</div>
                        <div className="text-sm text-gray-500">Click: {notification.clickRate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notification.sentAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <form onSubmit={handleCreateTemplate}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create Notification Template</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Template Name</label>
                        <input
                          type="text"
                          required
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={newTemplate.category}
                          onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notification Type</label>
                      <select
                        value={newTemplate.type}
                        onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="email">Email</option>
                        <option value="push">Push Notification</option>
                        <option value="in-app">In-App Notification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        required
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                        placeholder="Use {{variableName}} for dynamic content"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        rows={6}
                        required
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                        placeholder="Use {{variableName}} for dynamic content like {{userName}}, {{bookTitle}}, etc."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  >
                    Create Template
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

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSendNotification}>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Send Notification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Select Template</label>
                      <select
                        required
                        value={newNotification.templateId}
                        onChange={(e) => setNewNotification({...newNotification, templateId: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Choose a template...</option>
                        {templates.map(template => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Recipients</label>
                      <select
                        value={newNotification.recipients}
                        onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="all">All Users</option>
                        <option value="readers">Readers Only</option>
                        <option value="lenders">Lenders Only</option>
                        <option value="sellers">Sellers Only</option>
                        <option value="custom">Custom List</option>
                      </select>
                    </div>
                    {newNotification.recipients === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Addresses</label>
                        <textarea
                          rows={3}
                          value={newNotification.customRecipients}
                          onChange={(e) => setNewNotification({...newNotification, customRecipients: e.target.value})}
                          placeholder="Enter email addresses separated by commas"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Schedule (Optional)</label>
                      <input
                        type="datetime-local"
                        value={newNotification.scheduledTime}
                        onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                  >
                    {newNotification.scheduledTime ? 'Schedule' : 'Send'} Notification
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSendModal(false)}
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

export default NotificationManagement;