import { 
  Users, 
  Truck, 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const stats = [
    {
      title: 'Active Agents',
      value: '24',
      change: '+2 from yesterday',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Deliveries',
      value: '156',
      change: '+12 from yesterday',
      icon: Truck,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Total Hubs',
      value: '8',
      change: 'All operational',
      icon: Building2,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Pending Issues',
      value: '3',
      change: 'Needs attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  const recentDeliveries = [
    { id: 'D001', agent: 'John Smith', status: 'In Transit', time: '2 mins ago' },
    { id: 'D002', agent: 'Sarah Johnson', status: 'Delivered', time: '5 mins ago' },
    { id: 'D003', agent: 'Mike Wilson', status: 'Pickup', time: '8 mins ago' },
    { id: 'D004', agent: 'Lisa Brown', status: 'In Transit', time: '12 mins ago' },
  ];

  const hubPerformanceData = [
    { name: 'Downtown Hub', efficiency: 94, deliveries: 45, target: 90 },
    { name: 'North Hub', efficiency: 91, deliveries: 38, target: 90 },
    { name: 'South Hub', efficiency: 96, deliveries: 42, target: 90 },
    { name: 'West Hub', efficiency: 88, deliveries: 31, target: 90 },
    { name: 'East Hub', efficiency: 92, deliveries: 39, target: 90 },
  ];

  const revenueData = [
    { name: 'Downtown Hub', revenue: 12500 },
    { name: 'North Hub', revenue: 9800 },
    { name: 'South Hub', revenue: 11200 },
    { name: 'West Hub', revenue: 7600 },
    { name: 'East Hub', revenue: 10300 },
  ];

  const deliveryCountData = [
    { name: 'Downtown Hub', deliveries: 245 },
    { name: 'North Hub', deliveries: 189 },
    { name: 'South Hub', deliveries: 223 },
    { name: 'West Hub', deliveries: 156 },
    { name: 'East Hub', deliveries: 201 },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'In Transit':
        return <Clock className="text-yellow-600" size={16} />;
      case 'Pickup':
        return <TrendingUp className="text-blue-600" size={16} />;
      default:
        return <XCircle className="text-red-600" size={16} />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 font-heading">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deliveries */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Recent Delivery Updates
          </h3>
          <div className="space-y-4">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <p className="font-medium text-slate-900">{delivery.id}</p>
                    <p className="text-sm text-gray-600">{delivery.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{delivery.status}</p>
                  <p className="text-xs text-gray-500">{delivery.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hub Performance Graph */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Hub Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hubPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#3B82F6" name="Efficiency %" />
              <Bar dataKey="target" fill="#E5E7EB" name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Revenue by Hub
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deliveries by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Deliveries by Hub
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={deliveryCountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="deliveries" stroke="#FBBF24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;