import { Package, Users, Clock, AlertTriangle, MapPin, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Active Deliveries', value: '24', icon: Package, color: 'text-blue-500' },
    { title: 'Available Riders', value: '12', icon: Users, color: 'text-green-500' },
    { title: 'Pending Tasks', value: '8', icon: Clock, color: 'text-yellow-400' },
    { title: 'Urgent Alerts', value: '3', icon: AlertTriangle, color: 'text-red-500' },
  ];

  const recentDeliveries = [
    { id: 'DEL001', customer: 'John Doe', rider: 'Mike Johnson', status: 'In Transit', time: '2:30 PM' },
    { id: 'DEL002', customer: 'Sarah Smith', rider: 'Alex Brown', status: 'Delivered', time: '2:15 PM' },
    { id: 'DEL003', customer: 'Robert Wilson', rider: 'Emma Davis', status: 'Picked Up', time: '2:00 PM' },
  ];

  const alerts = [
    { type: 'warning', message: 'Delivery DEL004 is running 30 minutes late', time: '5 min ago' },
    { type: 'error', message: 'Rider Tom Wilson is unavailable', time: '10 min ago' },
    { type: 'info', message: 'New rider registration pending approval', time: '15 min ago' },
  ];

  const deliveryLocations = [
    { area: 'Downtown', deliveries: 45, lat: 40.7589, lng: -73.9851 },
    { area: 'Northside', deliveries: 32, lat: 40.7831, lng: -73.9712 },
    { area: 'Westside', deliveries: 28, lat: 40.7505, lng: -74.0087 },
    { area: 'Eastside', deliveries: 38, lat: 40.7614, lng: -73.9776 },
    { area: 'Southside', deliveries: 22, lat: 40.7282, lng: -73.9942 },
    { area: 'Industrial', deliveries: 18, lat: 40.7505, lng: -74.0134 },
    { area: 'Suburbs', deliveries: 35, lat: 40.7831, lng: -73.9554 },
    { area: 'Harbor', deliveries: 15, lat: 40.7061, lng: -74.0087 }
  ];

  const routes = [
    { 
      id: 'A', 
      name: 'Route A - Downtown', 
      color: 'bg-blue-500', 
      points: [
        { lat: 40.7589, lng: -73.9851 },
        { lat: 40.7614, lng: -73.9776 },
        { lat: 40.7505, lng: -73.9712 },
        { lat: 40.7831, lng: -73.9554 }
      ],
      efficiency: 92
    },
    { 
      id: 'B', 
      name: 'Route B - Residential', 
      color: 'bg-green-500', 
      points: [
        { lat: 40.7831, lng: -73.9712 },
        { lat: 40.7505, lng: -74.0087 },
        { lat: 40.7282, lng: -73.9942 },
        { lat: 40.7061, lng: -74.0087 }
      ],
      efficiency: 88
    },
    { 
      id: 'C', 
      name: 'Route C - Industrial', 
      color: 'bg-yellow-400', 
      points: [
        { lat: 40.7505, lng: -74.0134 },
        { lat: 40.7282, lng: -73.9942 },
        { lat: 40.7061, lng: -74.0087 },
        { lat: 40.7589, lng: -73.9851 }
      ],
      efficiency: 85
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500 m-0">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 m-0">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Deliveries */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-poppins font-semibold text-slate-900 mb-4 m-0">Recent Deliveries</h2>
            <div>
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex flex-col">
                    <p className="font-medium text-slate-900 m-0">{delivery.id}</p>
                    <p className="text-sm text-gray-500 m-0">{delivery.customer} • {delivery.rider}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={
                      `px-2 py-1 rounded-full text-xs font-medium
                      ${delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`
                    }>
                      {delivery.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1 m-0">{delivery.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-poppins font-semibold text-slate-900 mb-4 m-0">Alerts & Notifications</h2>
            <div>
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-lg border-l-4 mb-4
                    ${alert.type === 'error' ? 'bg-red-50 border-red-400' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'}
                  `}
                >
                  <p className="text-sm text-slate-900 m-0">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1 m-0">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Maps Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mt-1">
        {/* Delivery Locations Map */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-poppins font-semibold text-slate-900 m-0">Delivery Locations Map</h2>
            </div>
            <div className="relative w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus"
                width="100%"
                height="100%"
                className="border-0 w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Delivery Locations Map"
              />
              {/* Overlay with delivery markers */}
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow text-xs">
                <div className="font-semibold mb-2">Delivery Areas</div>
                {deliveryLocations.slice(0, 4).map((location, index) => (
                  <div key={index} className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{location.area}: {location.deliveries}</span>
                  </div>
                ))}
                <div className="text-[10px] text-gray-500 mt-2">
                  Total: {deliveryLocations.reduce((sum, loc) => sum + loc.deliveries, 0)} deliveries
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Routes Overview */}
        <Card>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-poppins font-semibold text-slate-900 m-0">Routes Overview</h2>
            </div>
            <div className="relative w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96797.57915830869!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus"
                width="100%"
                height="100%"
                className="border-0 w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Routes Overview Map"
              />
              {/* Routes Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow text-xs">
                <div className="font-semibold mb-2">Active Routes</div>
                {routes.map((route, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-[3px] ${route.color} rounded`}></div>
                    <div className="flex flex-col">
                      <span className="font-medium">{route.id}</span>
                      <span className={
                        `px-2 py-[2px] rounded-full text-[10px] font-medium
                        ${route.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                          route.efficiency >= 85 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-50 text-red-600'}`
                      }>
                        {route.efficiency}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
