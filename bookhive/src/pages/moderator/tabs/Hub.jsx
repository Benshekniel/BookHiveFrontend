import React, { useState } from 'react';
import { MapPin, Truck, Package, Clock, Users, TrendingUp, Filter, Map } from 'lucide-react';

const Hub = () => {
  const [activeTab, setActiveTab] = useState('hubs');
  const [hubFilter, setHubFilter] = useState('all');

  const deliveryHubs = [
    {
      id: 'HUB-001',
      name: 'Central City Hub',
      address: '123 Main Street, Downtown',
      manager: 'David Wilson',
      agents: 12,
      activeDeliveries: 45,
      completedToday: 23,
      status: 'operational',
      capacity: '80%',
      averageDeliveryTime: '2.5 hours',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'HUB-002',
      name: 'North District Hub',
      address: '456 Oak Avenue, North Side',
      manager: 'Sarah Johnson',
      agents: 8,
      activeDeliveries: 32,
      completedToday: 18,
      status: 'operational',
      capacity: '65%',
      averageDeliveryTime: '3.1 hours',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 'HUB-003',
      name: 'South Valley Hub',
      address: '789 Pine Road, South Valley',
      manager: 'Mike Rodriguez',
      agents: 15,
      activeDeliveries: 67,
      completedToday: 34,
      status: 'busy',
      capacity: '95%',
      averageDeliveryTime: '2.8 hours',
      coordinates: { lat: 40.6892, lng: -74.0445 }
    },
    {
      id: 'HUB-004',
      name: 'East End Point',
      address: '321 Elm Street, East District',
      manager: 'Emily Chen',
      agents: 6,
      activeDeliveries: 12,
      completedToday: 8,
      status: 'maintenance',
      capacity: '30%',
      averageDeliveryTime: '4.2 hours',
      coordinates: { lat: 40.7282, lng: -73.7949 }
    },
    {
      id: 'HUB-005',
      name: 'West Side Station',
      address: '654 Maple Drive, West Side',
      manager: 'Robert Kim',
      agents: 10,
      activeDeliveries: 38,
      completedToday: 25,
      status: 'operational',
      capacity: '72%',
      averageDeliveryTime: '2.9 hours',
      coordinates: { lat: 40.7505, lng: -74.0134 }
    },
    {
      id: 'HUB-006',
      name: 'Suburban Center',
      address: '987 Cedar Lane, Suburbs',
      manager: 'Lisa Park',
      agents: 7,
      activeDeliveries: 28,
      completedToday: 16,
      status: 'operational',
      capacity: '58%',
      averageDeliveryTime: '3.5 hours',
      coordinates: { lat: 40.6782, lng: -73.9442 }
    }
  ];

  const deliverySchedules = [
    {
      id: 'DEL-1001',
      bookTitle: 'The Hobbit',
      fromUser: 'bookworm_alice',
      toUser: 'fantasy_reader',
      pickupHub: 'Central City Hub',
      deliveryHub: 'North District Hub',
      agent: 'Agent Smith',
      scheduledTime: '2024-01-15 14:30',
      status: 'in_transit',
      estimatedDelivery: '2024-01-15 17:00'
    },
    {
      id: 'DEL-1002',
      bookTitle: '1984',
      fromUser: 'classic_lover',
      toUser: 'dystopia_fan',
      pickupHub: 'South Valley Hub',
      deliveryHub: 'Central City Hub',
      agent: 'Agent Johnson',
      scheduledTime: '2024-01-15 15:45',
      status: 'picked_up',
      estimatedDelivery: '2024-01-15 18:30'
    },
    {
      id: 'DEL-1003',
      bookTitle: 'To Kill a Mockingbird',
      fromUser: 'literature_student',
      toUser: 'book_collector',
      pickupHub: 'North District Hub',
      deliveryHub: 'South Valley Hub',
      agent: 'Agent Williams',
      scheduledTime: '2024-01-15 16:15',
      status: 'scheduled',
      estimatedDelivery: '2024-01-15 19:45'
    }
  ];

  const hubPerformance = [
    {
      hubId: 'HUB-001',
      hubName: 'Central City Hub',
      deliveriesThisWeek: 156,
      onTimeRate: 94,
      customerSatisfaction: 4.7,
      avgDeliveryTime: 2.5,
      efficiency: 'excellent'
    },
    {
      hubId: 'HUB-002',
      hubName: 'North District Hub',
      deliveriesThisWeek: 98,
      onTimeRate: 89,
      customerSatisfaction: 4.4,
      avgDeliveryTime: 3.1,
      efficiency: 'good'
    },
    {
      hubId: 'HUB-003',
      hubName: 'South Valley Hub',
      deliveriesThisWeek: 187,
      onTimeRate: 91,
      customerSatisfaction: 4.6,
      avgDeliveryTime: 2.8,
      efficiency: 'excellent'
    },
    {
      hubId: 'HUB-004',
      hubName: 'East End Point',
      deliveriesThisWeek: 45,
      onTimeRate: 78,
      customerSatisfaction: 4.1,
      avgDeliveryTime: 4.2,
      efficiency: 'needs_improvement'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency) => {
    switch (efficiency) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs_improvement': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCapacityColor = (capacity) => {
    const numericCapacity = parseInt(capacity);
    if (numericCapacity >= 90) return 'text-red-600';
    if (numericCapacity >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredHubs = hubFilter === 'all' 
    ? deliveryHubs 
    : deliveryHubs.filter(hub => hub.status === hubFilter);

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Hubs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">6</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">222</p>
            </div>
            <Truck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">58</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">124</p>
            </div>
            <Package className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('hubs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hubs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Delivery Hubs
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedules'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Delivery Schedules
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Performance Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'hubs' && (
            <div>
              {/* Filter */}
              <div className="flex items-center space-x-4 mb-6">
                <Filter className="w-5 h-5 text-gray-500" />
                <select 
                  value={hubFilter}
                  onChange={(e) => setHubFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Hubs</option>
                  <option value="operational">Operational</option>
                  <option value="busy">Busy</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredHubs.map((hub) => (
                  <div key={hub.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{hub.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{hub.address}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hub.status)}`}>
                        {hub.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Manager:</span>
                        <span className="font-medium">{hub.manager}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Capacity:</span>
                        <span className={`font-medium ${getCapacityColor(hub.capacity)}`}>{hub.capacity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Avg Delivery Time:</span>
                        <span className="font-medium">{hub.averageDeliveryTime}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{hub.agents}</p>
                        <p className="text-gray-600 text-sm">Agents</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-blue-600">{hub.activeDeliveries}</p>
                        <p className="text-gray-600 text-sm">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-600">{hub.completedToday}</p>
                        <p className="text-gray-600 text-sm">Today</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Contact Manager
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-4">
              {deliverySchedules.map((delivery) => (
                <div key={delivery.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{delivery.bookTitle}</h3>
                        <span className="text-gray-600 text-sm">#{delivery.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        From: {delivery.fromUser} • To: {delivery.toUser} • Agent: {delivery.agent} • Route: {delivery.pickupHub} → {delivery.deliveryHub}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Scheduled: {delivery.scheduledTime}</span>
                        </div>
                        <span>•</span>
                        <span>ETA: {delivery.estimatedDelivery}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Track
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Contact Agent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hub</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hubPerformance.map((hub) => (
                      <tr key={hub.hubId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{hub.hubName}</div>
                          <div className="text-sm text-gray-500">{hub.hubId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hub.deliveriesThisWeek}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hub.onTimeRate}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{hub.customerSatisfaction}</span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hub.avgDeliveryTime}h</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getEfficiencyColor(hub.efficiency)}`}>
                            {hub.efficiency.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2 justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Map className="w-4 h-4" />
          <span>View Map</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <TrendingUp className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
};

export default Hub;