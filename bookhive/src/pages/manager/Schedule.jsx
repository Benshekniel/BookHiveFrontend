import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter,
  RefreshCw,
  DollarSign,
  Fuel
} from 'lucide-react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const schedules = [
    {
      id: 'S001',
      pickup: '123 Main St',
      dropoff: '456 Oak Ave',
      time: '09:00 AM',
      priority: 'High',
      cost: 25.50,
      distance: '5.2 km',
      assignedAgent: null,
      status: 'Available'
    },
    {
      id: 'S002',
      pickup: '789 Pine Rd',
      dropoff: '321 Elm St',
      time: '10:30 AM',
      priority: 'Medium',
      cost: 18.75,
      distance: '3.8 km',
      assignedAgent: 'John Smith',
      status: 'Assigned'
    },
    {
      id: 'S003',
      pickup: '654 Cedar Ln',
      dropoff: '987 Birch Dr',
      time: '11:15 AM',
      priority: 'Low',
      cost: 32.00,
      distance: '7.1 km',
      assignedAgent: null,
      status: 'Available'
    },
    {
      id: 'S004',
      pickup: '147 Maple St',
      dropoff: '258 Willow Ave',
      time: '02:00 PM',
      priority: 'High',
      cost: 28.25,
      distance: '6.3 km',
      assignedAgent: 'Sarah Johnson',
      status: 'In Progress'
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-600 text-white';
      case 'Medium':
        return 'bg-yellow-400 text-white';
      case 'Low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-blue-600 text-white';
      case 'Assigned':
        return 'bg-yellow-400 text-white';
      case 'In Progress':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (selectedFilter === 'all') return true;
    return schedule.status.toLowerCase() === selectedFilter.toLowerCase().replace(' ', '');
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Schedule Management</h2>
          <p className="text-gray-600">Manage delivery schedules and assignments</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center space-x-2">
            <RefreshCw size={20} />
            <span>Auto-Pick</span>
          </button>
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
            <Fuel size={20} />
            <span>Optimize Routes</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="in progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Cost Factors Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
          Cost Factors & Optimization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Fuel className="text-yellow-400" size={20} />
              <span className="font-medium">Fuel Price</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">$3.45/L</p>
            <p className="text-sm text-gray-600">Updated 2 hours ago</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-blue-600" size={20} />
              <span className="font-medium">Peak Hours</span>
            </div>
            <p className="text-lg font-bold text-slate-900">9AM - 11AM</p>
            <p className="text-sm text-gray-600">Higher rates apply</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="text-green-600" size={20} />
              <span className="font-medium">Main Routes</span>
            </div>
            <p className="text-lg font-bold text-slate-900">5 Active</p>
            <p className="text-sm text-gray-600">Optimized paths</p>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {filteredSchedules.map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="font-semibold text-slate-900">{schedule.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="text-green-600 mt-1" size={16} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Pickup</p>
                        <p className="text-sm text-gray-600">{schedule.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="text-red-600 mt-1" size={16} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Drop-off</p>
                        <p className="text-sm text-gray-600">{schedule.dropoff}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-gray-400" size={16} />
                      <span className="text-sm font-medium">{schedule.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="text-gray-400" size={16} />
                      <span className="text-sm font-medium">${schedule.cost}</span>
                      <span className="text-sm text-gray-600">({schedule.distance})</span>
                    </div>
                    {schedule.assignedAgent && (
                      <div className="text-sm">
                        <span className="text-gray-600">Assigned to: </span>
                        <span className="font-medium text-slate-900">{schedule.assignedAgent}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                {schedule.status === 'Available' ? (
                  <>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                      Assign Agent
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit
                    </button>
                  </>
                ) : (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No schedules found for the selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;