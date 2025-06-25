import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  BarChart3, 
  Edit, 
  Trash2, 
  Eye
} from 'lucide-react';

const Routes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const routes = [
    {
      id: 1,
      name: 'Zone A - Downtown',
      description: 'Central business district and shopping areas',
      assignedRiders: 5,
      totalRiders: 6,
      avgDeliveryTime: '25 min',
      efficiency: 92,
      status: 'active',
      coverage: '15.2 km²',
      dailyDeliveries: 45
    },
    {
      id: 2,
      name: 'Zone B - Suburbs',
      description: 'Residential areas and local shopping centers',
      assignedRiders: 4,
      totalRiders: 5,
      avgDeliveryTime: '35 min',
      efficiency: 88,
      status: 'active',
      coverage: '28.7 km²',
      dailyDeliveries: 32
    },
    {
      id: 3,
      name: 'Zone C - Industrial',
      description: 'Industrial parks and business complexes',
      assignedRiders: 3,
      totalRiders: 4,
      avgDeliveryTime: '40 min',
      efficiency: 85,
      status: 'active',
      coverage: '22.1 km²',
      dailyDeliveries: 28
    },
    {
      id: 4,
      name: 'Zone D - University',
      description: 'University campus and student housing',
      assignedRiders: 2,
      totalRiders: 3,
      avgDeliveryTime: '20 min',
      efficiency: 95,
      status: 'active',
      coverage: '8.5 km²',
      dailyDeliveries: 38
    }
  ];

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Routes</h1>
        <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Route</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search routes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>{route.name}</h3>
                <p className="text-gray-600 mt-1">{route.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                route.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Riders</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {route.assignedRiders}/{route.totalRiders}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Efficiency</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.efficiency}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Coverage</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.coverage}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-600">Avg. Time</span>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.avgDeliveryTime}</p>
              </div>
            </div>

            {/* Daily Deliveries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Daily Deliveries</span>
                <span className="text-sm font-medium text-slate-900">{route.dailyDeliveries}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(route.dailyDeliveries / 50) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button className="bg-gray-50 text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="bg-gray-50 text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Route Assignment Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Quick Route Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Select Route</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Select Rider</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Mike Johnson</option>
          </select>
          <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
            Assign Rider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Routes;