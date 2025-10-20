import React from 'react';
import { 
  DollarSign, ShoppingCart, Eye, TrendingUp, TrendingDown, AlertTriangle, 
  BookOpen, ExternalLink, Package, Truck, CheckCircle, Clock, Plus, Settings
} from 'lucide-react';

import RecentOrders from '../../components/bookStore/dashboard/RecentOrders';
import DashboardStats from '../../components/bookStore/dashboard/DashboardStats';


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
      description: 'Add new books to inventory',
      color: 'border-blue-300 text-blue-600 hover:bg-blue-50',
      onClick: () => window.location.href = './bookstore/inventory'
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Manage Inventory',
      description: 'Update stock levels',
      color: 'border-green-300 text-green-600 hover:bg-green-50',
      onClick: () => window.location.href = './bookstore/inventory'
    },
    // {
    //   icon: <TrendingUp className="w-5 h-5" />,
    //   title: 'View Analytics',
    //   description: 'Detailed sales reports',
    //   color: 'border-purple-300 text-purple-600 hover:bg-purple-50',
    //   onClick: () => console.log('View analytics')
    // },
    // {
    //   icon: <Settings className="w-5 h-5" />,
    //   title: 'Store Settings',
    //   description: 'Configure your store',
    //   color: 'border-gray-300 text-gray-600 hover:bg-gray-50',
    //   onClick: () => console.log('Store settings')
    // }
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
          {/* <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">6/24/2025, 7:51:01 PM</p>
          </div> */}
        </div>
      </div>

      {/* Summer Reading Event Banner */}
      {/* <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-8 text-white">
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
      </div> */}

      {/* Performance Overview */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Inventory Summary */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
          </div> */}

          {/* Top Selling Books */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Books</h3>
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
          </div> */}

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