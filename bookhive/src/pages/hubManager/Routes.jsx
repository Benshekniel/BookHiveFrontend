import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  BarChart3, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Package
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
      dailyDeliveries: 45,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      performance: { trend: 'up', change: '+5.2%' }
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
      dailyDeliveries: 32,
      coordinates: { lat: 40.7282, lng: -73.7949 },
      performance: { trend: 'up', change: '+2.1%' }
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
      dailyDeliveries: 28,
      coordinates: { lat: 40.6892, lng: -74.0445 },
      performance: { trend: 'down', change: '-1.3%' }
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
      dailyDeliveries: 38,
      coordinates: { lat: 40.8075, lng: -73.9626 },
      performance: { trend: 'up', change: '+8.7%' }
    }
  ];

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MapView = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Route Performance Map</h2>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-96 mb-4 overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50"></div>
        
        {/* Route Markers */}
        {routes.map((route) => (
          <div
            key={route.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + (route.id * 18)}%`,
              top: `${30 + (route.id * 15)}%`
            }}
          >
            {/* Route Marker */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg transition-all duration-300 group-hover:scale-110 ${
              route.efficiency >= 90 ? 'bg-green-500' :
              route.efficiency >= 85 ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {route.id}
            </div>
            
            {/* Route Info Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                <div className="font-semibold">{route.name}</div>
                <div className="text-xs">Efficiency: {route.efficiency}%</div>
                <div className="text-xs">Deliveries: {route.dailyDeliveries}/day</div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
            
            {/* Performance Indicator */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
              route.performance.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {route.performance.trend === 'up' ? (
                <TrendingUp className="w-2 h-2 text-white" />
              ) : (
                <TrendingDown className="w-2 h-2 text-white" />
              )}
            </div>
          </div>
        ))}
        
        {/* Map Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute bg-blue-300" style={{ left: `${i * 10}%`, width: '1px', height: '100%' }}></div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={`h-${i}`} className="absolute bg-blue-300" style={{ top: `${i * 12.5}%`, height: '1px', width: '100%' }}></div>
          ))}
        </div>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-2">Performance Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Good (85-89%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Needs Improvement (&lt;85%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
     
      {/* Map View */}
      <MapView />

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
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  route.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  route.performance.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {route.performance.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{route.performance.change}</span>
                </div>
              </div>
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