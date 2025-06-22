import React, { useState } from 'react';
import { Plus, Calendar, Users, MapPin, Edit, Trash2, Eye, Filter, Search } from 'lucide-react';

const EventsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    {
      id: 1,
      name: 'Books for Schools Charity Drive',
      type: 'charity',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      participants: 156,
      location: 'Colombo District',
      description: 'Collecting books for underprivileged schools',
      booksCollected: 450,
      targetBooks: 1000
    },
    {
      id: 2,
      name: 'Creative Writing Competition 2024',
      type: 'competition',
      status: 'upcoming',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      participants: 23,
      location: 'Online',
      description: 'Annual writing competition for all ages',
      submissions: 0,
      maxSubmissions: 500
    },
    {
      id: 3,
      name: 'Book Circle Reading Marathon',
      type: 'community',
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      participants: 89,
      location: 'Multiple Locations',
      description: 'Month-long reading challenge',
      booksRead: 234,
      targetBooks: 200
    }
  ];

  const [newEvent, setNewEvent] = useState({
    name: '',
    type: 'charity',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    target: ''
  });

  const filteredEvents = events.filter(event => {
    const matchesFilter = filterType === 'all' || event.type === filterType;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    console.log('Creating event:', newEvent);
    setShowCreateModal(false);
    setNewEvent({
      name: '',
      type: 'charity',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      target: ''
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.active;
  };

  const getTypeBadge = (type) => {
    const badges = {
      charity: 'bg-yellow-100 text-yellow-800',
      competition: 'bg-blue-100 text-blue-800',
      community: 'bg-purple-100 text-purple-800'
    };
    return badges[type] || badges.charity;
  };

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-blue-900">Events & Charity Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage platform events, charity drives, and writing competitions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-lg rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Search Events</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="charity">Charity Drives</option>
                <option value="competition">Competitions</option>
                <option value="community">Community Events</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{event.name}</h3>
                  <div className="flex space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {event.startDate} - {event.endDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      {event.participants} participants
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {event.type === 'charity' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span className="font-medium">Books Collected</span>
                        <span className="font-semibold">{event.booksCollected}/{event.targetBooks}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-blue-500 h-3 rounded-full" 
                          style={{ width: `${(event.booksCollected / event.targetBooks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {event.type === 'competition' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span className="font-medium">Submissions</span>
                        <span className="font-semibold">{event.submissions}/{event.maxSubmissions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-yellow-500 h-3 rounded-full" 
                          style={{ width: `${(event.submissions / event.maxSubmissions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-yellow-50 transition-colors duration-200">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 transition-colors duration-200">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center p-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleCreateEvent}>
                <div>
                  <h3 className="text-lg leading-6 font-bold text-blue-900 mb-4">Create New Event</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900">Event Name</label>
                      <input
                        type="text"
                        required
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900">Event Type</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="charity">Charity Drive</option>
                        <option value="competition">Writing Competition</option>
                        <option value="community">Community Event</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-900">Start Date</label>
                        <input
                          type="date"
                          required
                          value={newEvent.startDate}
                          onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900">End Date</label>
                        <input
                          type="date"
                          required
                          value={newEvent.endDate}
                          onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900">Location</label>
                      <input
                        type="text"
                        required
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900">
                        Target ({newEvent.type === 'charity' ? 'Books to Collect' : 'Max Participants'})
                      </label>
                      <input
                        type="number"
                        required
                        value={newEvent.target}
                        onChange={(e) => setNewEvent({...newEvent, target: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm transition-colors duration-200"
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors duration-200"
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

export default EventsManagement;