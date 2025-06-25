import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  User, 
  MapPin, 
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Schedules = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // day, week, month

  const schedules = [
    {
      id: 1,
      time: '09:00',
      duration: 60,
      rider: 'John Doe',
      route: 'Zone A - Downtown',
      deliveries: 8,
      status: 'scheduled',
      priority: 'normal'
    },
    {
      id: 2,
      time: '10:30',
      duration: 90,
      rider: 'Jane Smith',
      route: 'Zone B - Suburbs',
      deliveries: 12,
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 3,
      time: '14:00',
      duration: 75,
      rider: 'Mike Johnson',
      route: 'Zone C - Industrial',
      deliveries: 6,
      status: 'scheduled',
      priority: 'normal'
    },
    {
      id: 4,
      time: '16:30',
      duration: 45,
      rider: 'Sarah Wilson',
      route: 'Zone D - University',
      deliveries: 10,
      status: 'delayed',
      priority: 'urgent'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-600';
      case 'in-progress': return 'bg-yellow-100 text-yellow-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'delayed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-yellow-400';
      case 'normal': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Schedules</h1>
        <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">{formatDate(currentDate)}</h2>
          </div>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">Day View</option>
            <option value="week">Week View</option>
            <option value="month">Month View</option>
          </select>
        </div>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Total Schedules</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{schedules.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Total Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {schedules.reduce((sum, schedule) => sum + schedule.deliveries, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Active Riders</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {new Set(schedules.map(s => s.rider)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Delayed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {schedules.filter(s => s.status === 'delayed').length}
          </p>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Today's Schedule</h2>
        
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`border-l-4 ${getPriorityColor(schedule.priority)} bg-gray-50 p-4 rounded-r-lg`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-slate-900">{schedule.time}</span>
                      <span className="text-sm text-gray-600">({schedule.duration} min)</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                      {schedule.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-slate-900">{schedule.rider}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-slate-900">{schedule.route}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-slate-900">{schedule.deliveries} deliveries</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-600 p-2 rounded-lg hover:bg-white transition-colors">
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button className="text-yellow-500 hover:text-yellow-600 p-2 rounded-lg hover:bg-white transition-colors">
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Assignment */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Quick Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Select Rider</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Mike Johnson</option>
            <option>Sarah Wilson</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Select Route</option>
            <option>Zone A - Downtown</option>
            <option>Zone B - Suburbs</option>
            <option>Zone C - Industrial</option>
            <option>Zone D - University</option>
          </select>
          <input
            type="time"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Deliveries"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedules;