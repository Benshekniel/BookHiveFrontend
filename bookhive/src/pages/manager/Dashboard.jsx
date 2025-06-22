import { 
  Users, 
  Truck, 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

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

  const hubPerformance = [
    { name: 'Downtown Hub', deliveries: 45, efficiency: '94%' },
    { name: 'North Hub', deliveries: 38, efficiency: '91%' },
    { name: 'South Hub', deliveries: 42, efficiency: '96%' },
    { name: 'West Hub', deliveries: 31, efficiency: '88%' },
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
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
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
        <div className="bg-white rounded-xl p-6 shadow-sm border">
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

        {/* Hub Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Hub Performance
          </h3>
          <div className="space-y-4">
            {hubPerformance.map((hub, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{hub.name}</p>
                  <p className="text-sm text-gray-600">{hub.deliveries} deliveries today</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">{hub.efficiency}</p>
                  <p className="text-xs text-gray-500">Efficiency</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Users className="mb-2" size={20} />
            <p className="font-medium">Manage Agents</p>
          </button>
          <button className="p-4 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors">
            <Calendar className="mb-2" size={20} />
            <p className="font-medium">View Schedule</p>
          </button>
          <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Truck className="mb-2" size={20} />
            <p className="font-medium">Track Deliveries</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;