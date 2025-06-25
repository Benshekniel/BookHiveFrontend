import React from 'react';
import { 
  DollarSign, ShoppingCart, Eye, TrendingUp, TrendingDown, AlertTriangle, 
  BookOpen, ExternalLink, Package, Truck, CheckCircle, Clock, Plus, Settings
} from 'lucide-react';

// MetricCard component inline
const MetricCard = ({
  title,
  value,
  change,
  isPositive,
  icon: IconComponent,
  lastUpdated
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        <div className="p-2 bg-blue-50 rounded-lg">
          <IconComponent className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="mb-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">{lastUpdated}</span>
        )}
      </div>
    </div>
  );
};

// RecentOrders component inline
const orders = [
  {
    id: 'BH-3842',
    customer: 'Emma Thompson',
    books: '3 items',
    total: '$78.50',
    status: 'delivered',
    date: 'Jun 22, 2025'
  },
  {
    id: 'BH-3841',
    customer: 'Michael Chen',
    books: '1 item',
    total: '$24.99',
    status: 'shipped',
    date: 'Jun 21, 2025'
  },
  {
    id: 'BH-3840',
    customer: 'Sarah Johnson',
    books: '2 items',
    total: '$42.75',
    status: 'processing',
    date: 'Jun 20, 2025'
  }
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'shipped':
      return <Truck className="w-4 h-4 text-blue-500" />;
    case 'processing':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    default:
      return <Package className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'shipped':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'processing':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const RecentOrders = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <span>View all orders</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Order ID
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Customer
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Books
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-blue-600">#{order.id}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-900">{order.customer}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{order.books}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-gray-900">{order.total}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{order.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// QuickActions component inline
const ActionButton = ({ icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md ${color}`}
  >
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="text-left">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs opacity-70">{description}</p>
      </div>
    </div>
  </button>
);

const QuickActions = () => {
  const actions = [
    {
      icon: <Plus className="w-5 h-5" />,
      title: 'Add New Book',
      description: 'List a new book for sale',
      color: 'border-blue-300 text-blue-600 hover:bg-blue-50',
      onClick: () => console.log('Add book')
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Manage Inventory',
      description: 'Update stock levels',
      color: 'border-green-300 text-green-600 hover:bg-green-50',
      onClick: () => console.log('Manage inventory')
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'View Analytics',
      description: 'Detailed sales reports',
      color: 'border-purple-300 text-purple-600 hover:bg-purple-50',
      onClick: () => console.log('View analytics')
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Store Settings',
      description: 'Configure your store',
      color: 'border-gray-300 text-gray-600 hover:bg-gray-50',
      onClick: () => console.log('Store settings')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <ActionButton key={index} {...action} />
      ))}
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  return (
    <div className="flex-1 bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your bookstore today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">6/24/2025, 7:51:01 PM</p>
          </div>
        </div>
      </div>

      {/* Summer Reading Event Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Summer Reading Event: June 15 - July 30, 2025</h3>
              <p className="text-sm opacity-90">Boost your sales by participating in our Summer Reading Event. Register your store to be featured in our promotional campaign.</p>
            </div>
          </div>
          <button className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Register Now
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value="$4,278"
            change="+12% vs last month"
            isPositive={true}
            icon={DollarSign}
            lastUpdated="Updated 2 hours ago"
          />
          <MetricCard
            title="Orders"
            value="87"
            change="+8% vs last month"
            isPositive={true}
            icon={ShoppingCart}
            lastUpdated="Updated 2 hours ago"
          />
          <MetricCard
            title="Store Visits"
            value="1,245"
            change="+15% vs last month"
            isPositive={true}
            icon={Eye}
            lastUpdated="Updated 30 minutes ago"
          />
          <MetricCard
            title="Avg. Order Value"
            value="$49.17"
            change="+1% vs last month"
            isPositive={true}
            icon={TrendingUp}
            lastUpdated="Updated 2 hours ago"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Inventory Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventory Summary</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Manage Inventory
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Total Books</span>
                </div>
                <span className="text-sm font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">In Stock</span>
                </div>
                <span className="text-sm font-semibold text-green-600">1,156</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Low Stock</span>
                </div>
                <span className="text-sm font-semibold text-yellow-600">67</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Out of Stock</span>
                </div>
                <span className="text-sm font-semibold text-red-600">24</span>
              </div>
            </div>
          </div>

          {/* Top Selling Books */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Books</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'The Silent Patient', sales: 24, trend: '+5' },
                { title: 'Educated', sales: 18, trend: '+3' },
                { title: 'Atomic Habits', sales: 15, trend: '+2' }
              ].map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.sales} sold this month</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {book.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;