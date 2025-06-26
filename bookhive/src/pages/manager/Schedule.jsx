import { useState } from 'react';
import { Calendar, Clock, MapPin, Filter, RefreshCw, DollarSign, Fuel, Settings, Router as Route, Truck } from 'lucide-react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showVariables, setShowVariables] = useState(false);

  const [variables, setVariables] = useState({
    fuelRate: 3.45,
    baseCost: 15.00,
    peakHourMultiplier: 1.5,
    distanceRate: 2.50,
    deliveryTimeBuffer: 15
  });

  const schedules = [
    {
      id: 'S001',
      pickup: '123 Main St',
      dropoff: '456 Oak Ave',
      time: '09:00 AM',
      priority: 'High',
      cost: 25.50,
      distance: '5.2 km',
      estimatedTime: '35 mins',
      assignedAgent: null,
      status: 'Available',
      productType: 'Electronics'
    },
    {
      id: 'S002',
      pickup: '789 Pine Rd',
      dropoff: '321 Elm St',
      time: '10:30 AM',
      priority: 'Medium',
      cost: 18.75,
      distance: '3.8 km',
      estimatedTime: '25 mins',
      assignedAgent: 'John Smith',
      status: 'Assigned',
      productType: 'Documents'
    },
    {
      id: 'S003',
      pickup: '654 Cedar Ln',
      dropoff: '987 Birch Dr',
      time: '11:15 AM',
      priority: 'Low',
      cost: 32.00,
      distance: '7.1 km',
      estimatedTime: '45 mins',
      assignedAgent: null,
      status: 'Available',
      productType: 'Food'
    },
    {
      id: 'S004',
      pickup: '147 Maple St',
      dropoff: '258 Willow Ave',
      time: '02:00 PM',
      priority: 'High',
      cost: 28.25,
      distance: '6.3 km',
      estimatedTime: '40 mins',
      assignedAgent: 'Sarah Johnson',
      status: 'In Progress',
      productType: 'Medical'
    },
  ];

  const mainRoutes = [
    { name: 'Route A', path: 'Downtown → North Hub', vehicles: 3, status: 'Active' },
    { name: 'Route B', path: 'South Hub → West Hub', vehicles: 2, status: 'Active' },
    { name: 'Route C', path: 'East Hub → Downtown', vehicles: 4, status: 'Optimizing' },
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

  const calculateCost = (distance, priority, time, productType) => {
    let cost = variables.baseCost;
    const distanceNum = parseFloat(distance);
    cost += distanceNum * variables.distanceRate;
    
    // Peak hour multiplier (9-11 AM)
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 9 && hour <= 11) {
      cost *= variables.peakHourMultiplier;
    }
    
    // Priority multiplier
    if (priority === 'High') cost *= 1.3;
    if (priority === 'Medium') cost *= 1.1;
    
    return cost.toFixed(2);
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
          <p className="text-gray-600">Manage delivery schedules and optimize routes</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowVariables(!showVariables)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Settings size={20} />
            <span>Variables</span>
          </button>
          <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center space-x-2">
            <RefreshCw size={20} />
            <span>Auto-Pick</span>
          </button>
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
            <Route size={20} />
            <span>Optimize Routes</span>
          </button>
        </div>
      </div>

      {/* Variables Panel */}
      {showVariables && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Delivery Variables & Cost Factors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Rate (per liter)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={variables.fuelRate}
                  onChange={(e) => setVariables({...variables, fuelRate: parseFloat(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Delivery Cost
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={variables.baseCost}
                  onChange={(e) => setVariables({...variables, baseCost: parseFloat(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance Rate (per km)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={variables.distanceRate}
                  onChange={(e) => setVariables({...variables, distanceRate: parseFloat(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peak Hour Multiplier
              </label>
              <input
                type="number"
                value={variables.peakHourMultiplier}
                onChange={(e) => setVariables({...variables, peakHourMultiplier: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Buffer (minutes)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={variables.deliveryTimeBuffer}
                  onChange={(e) => setVariables({...variables, deliveryTimeBuffer: parseInt(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Routes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
          Main Vehicle Routes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mainRoutes.map((route, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{route.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  route.status === 'Active' ? 'bg-green-600 text-white' : 'bg-yellow-400 text-white'
                }`}>
                  {route.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{route.path}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Truck size={14} className="text-gray-400" />
                  <span className="text-sm">{route.vehicles} vehicles</span>
                </div>
                <button className="text-blue-600 text-sm hover:underline">
                  Adjust Path
                </button>
              </div>
            </div>
          ))}
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
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {schedule.productType}
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
                      <span className="text-sm text-gray-600">({schedule.estimatedTime})</span>
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
                      Auto-Assign
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