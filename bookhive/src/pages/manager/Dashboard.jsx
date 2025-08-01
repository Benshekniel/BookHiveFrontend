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
      value: '89',
      change: '+5 from yesterday',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Deliveries',
      value: '234',
      change: '+18 from yesterday',
      icon: Truck,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Total Hubs',
      value: '12',
      change: 'All operational',
      icon: Building2,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Pending Issues',
      value: '7',
      change: 'Needs attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  const recentDeliveries = [
    { id: 'D001', agent: 'Nuwan Perera', status: 'In Transit', time: '3 mins ago' },
    { id: 'D002', agent: 'Sanduni Fernando', status: 'Delivered', time: '7 mins ago' },
    { id: 'D003', agent: 'Kasun Silva', status: 'Pickup', time: '12 mins ago' },
    { id: 'D004', agent: 'Dilani Rajapaksa', status: 'In Transit', time: '15 mins ago' },
    { id: 'D005', agent: 'Chamara Wickramasinghe', status: 'Delivered', time: '18 mins ago' },
  ];

  const agentCountData = [
    { name: 'Colombo Hub', agents: 28 },
    { name: 'Kandy Hub', agents: 18 },
    { name: 'Galle Hub', agents: 15 },
    { name: 'Negombo Hub', agents: 12 },
    { name: 'Matara Hub', agents: 16 },
    { name: 'Kandy Hub', agents: 18 },
    { name: 'Galle Hub', agents: 15 },
    { name: 'Negombo Hub', agents: 12 },
    { name: 'Matara Hub', agents: 16 },
    { name: 'Kandy Hub', agents: 18 },
    { name: 'Galle Hub', agents: 15 },
    { name: 'Negombo Hub', agents: 12 },
    { name: 'Matara Hub', agents: 16 },
  ];

  const revenueData = [
    { name: 'Colombo Hub', revenue: 450000 },
    { name: 'Kandy Hub', revenue: 280000 },
    { name: 'Galle Hub', revenue: 320000 },
    { name: 'Negombo Hub', revenue: 195000 },
    { name: 'Matara Hub', revenue: 240000 },
    { name: 'Colombo Hub', revenue: 450000 },
    { name: 'Kandy Hub', revenue: 280000 },
    { name: 'Galle Hub', revenue: 320000 },
    { name: 'Negombo Hub', revenue: 195000 },
    { name: 'Matara Hub', revenue: 240000 },
  ];

  const deliveryCountData = [
    { name: 'Colombo Hub', deliveries: 567 },
    { name: 'Kandy Hub', deliveries: 345 },
    { name: 'Galle Hub', deliveries: 398 },
    { name: 'Negombo Hub', deliveries: 234 },
    { name: 'Matara Hub', deliveries: 289 },
    { name: 'Colombo Hub', deliveries: 567 },
    { name: 'Kandy Hub', deliveries: 345 },
    { name: 'Galle Hub', deliveries: 398 },
    { name: 'Negombo Hub', deliveries: 234 },
    { name: 'Matara Hub', deliveries: 289 },
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
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
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

        {/* Delivery Agents by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Delivery Agents by Hub
          </h3>
          <div className='mt-15'>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={agentCountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Agents']} />
              <Bar dataKey="agents" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Revenue by Hub (LKR)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `Rs.${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`Rs.${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deliveries by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Deliveries by Hub
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliveryCountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Deliveries']} />
              <Bar dataKey="deliveries" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;