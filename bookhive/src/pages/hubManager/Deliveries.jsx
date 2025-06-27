import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Package, 
  Eye, 
  MessageSquare,
  RefreshCw
} from 'lucide-react';

const Deliveries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const deliveries = [
    {
      id: 'DEL001',
      customer: 'Alice Johnson',
      pickup: '123 Main St, Downtown',
      dropoff: '456 Oak Ave, Suburbs',
      rider: 'John Doe',
      status: 'in-transit',
      estimatedTime: '15 min',
      orderTime: '2:30 PM',
      priority: 'normal',
      value: '$45.99'
    },
    {
      id: 'DEL002',
      customer: 'Bob Smith',
      pickup: '789 Pine St, Mall',
      dropoff: '321 Elm St, Downtown',
      rider: 'Jane Smith',
      status: 'delivered',
      estimatedTime: 'Completed',
      orderTime: '1:45 PM',
      priority: 'high',
      value: '$78.50'
    },
    {
      id: 'DEL003',
      customer: 'Carol Davis',
      pickup: '555 Broadway, Theater District',
      dropoff: '888 Park Ave, Uptown',
      rider: 'Mike Johnson',
      status: 'picked-up',
      estimatedTime: '25 min',
      orderTime: '2:15 PM',
      priority: 'normal',
      value: '$32.75'
    },
    {
      id: 'DEL004',
      customer: 'David Wilson',
      pickup: '999 Industrial Blvd',
      dropoff: '111 Residential St',
      rider: 'Sarah Wilson',
      status: 'delayed',
      estimatedTime: 'Overdue',
      orderTime: '12:30 PM',
      priority: 'urgent',
      value: '$95.25'
    },
    {
      id: 'DEL005',
      customer: 'Emma Brown',
      pickup: '777 University Ave',
      dropoff: '222 Student Housing',
      rider: 'Alex Brown',
      status: 'pending',
      estimatedTime: 'Waiting',
      orderTime: '3:00 PM',
      priority: 'normal',
      value: '$28.99'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'in-transit': return 'bg-blue-100 text-blue-600';
      case 'picked-up': return 'bg-yellow-100 text-yellow-600';
      case 'delayed': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-yellow-400 text-blue-900';
      case 'normal': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.rider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Total Today</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">In Transit</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">15</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Delayed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="picked-up">Picked Up</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      {/* Deliveries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">{delivery.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                        {delivery.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-slate-900">{delivery.customer}</p>
                      <p className="text-sm text-gray-600">{delivery.value}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{delivery.pickup}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span className="text-sm text-gray-600">{delivery.dropoff}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-slate-900">{delivery.rider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{delivery.estimatedTime}</p>
                      <p className="text-xs text-gray-500">Ordered: {delivery.orderTime}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-600">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deliveries;