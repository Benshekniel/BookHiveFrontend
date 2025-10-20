import React, { useState } from 'react';
import {
  Search, Filter, Plus, Upload, Edit, Trash2, Eye, MoreHorizontal, ShoppingCart, Clock, CheckCircle, DollarSign, Calendar, User, Package, TrendingUp, AlertCircle, Truck, RefreshCw, ChevronDown, ArrowRight, BookOpen, Heart, MapPin, Shield, Camera, FileText, Ban, Star, Award, Zap
} from 'lucide-react';

import SalesActivity from '../../components/bookStore/transactions/SalesActivity';
import LendingActivity from '../../components/bookStore/transactions/LendingActivity';
import DonationActivity from '../../components/bookStore/transactions/DonationActivity';

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  // const [searchTerm, setSearchTerm] = useState('');
  // const [selectedStatus, setSelectedStatus] = useState('All Status');
  // const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days');

  const tabs = [
    { id: 'sales', label: 'Sales Orders', icon: ShoppingCart, count: 2891 },
    { id: 'lending', label: 'Lending Activity', icon: BookOpen, count: 456 },
    { id: 'donations', label: 'Donations', icon: Heart, count: 89 }
  ];

  // const salesStats = [
  //   {
  //     label: 'TOTAL ORDERS',
  //     value: '2,891',
  //     change: '+12% from last month',
  //     bgColor: 'bg-blue-50',
  //     borderColor: 'border-blue-200',
  //     textColor: 'text-blue-600',
  //     iconBg: 'bg-blue-100',
  //     icon: ShoppingCart,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'PENDING ORDERS',
  //     value: '47',
  //     change: '-3% from yesterday',
  //     bgColor: 'bg-amber-50',
  //     borderColor: 'border-amber-200',
  //     textColor: 'text-amber-600',
  //     iconBg: 'bg-amber-100',
  //     icon: Clock,
  //     changeColor: 'text-red-600'
  //   },
  //   {
  //     label: 'COMPLETED',
  //     value: '2,789',
  //     change: '+8% from last week',
  //     bgColor: 'bg-green-50',
  //     borderColor: 'border-green-200',
  //     textColor: 'text-green-600',
  //     iconBg: 'bg-green-100',
  //     icon: CheckCircle,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'REVENUE',
  //     value: '$24,591',
  //     change: '+18% from last month',
  //     bgColor: 'bg-purple-50',
  //     borderColor: 'border-purple-200',
  //     textColor: 'text-purple-600',
  //     iconBg: 'bg-purple-100',
  //     icon: DollarSign,
  //     changeColor: 'text-green-600'
  //   }
  // ];

  // const lendingStats = [
  //   {
  //     label: 'ACTIVE LOANS',
  //     value: '456',
  //     change: '+5% from last week',
  //     bgColor: 'bg-blue-50',
  //     borderColor: 'border-blue-200',
  //     textColor: 'text-blue-600',
  //     iconBg: 'bg-blue-100',
  //     icon: BookOpen,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'OVERDUE',
  //     value: '23',
  //     change: '+2 from yesterday',
  //     bgColor: 'bg-red-50',
  //     borderColor: 'border-red-200',
  //     textColor: 'text-red-600',
  //     iconBg: 'bg-red-100',
  //     icon: AlertCircle,
  //     changeColor: 'text-red-600'
  //   },
  //   {
  //     label: 'RETURNED',
  //     value: '1,234',
  //     change: '+15% from last month',
  //     bgColor: 'bg-green-50',
  //     borderColor: 'border-green-200',
  //     textColor: 'text-green-600',
  //     iconBg: 'bg-green-100',
  //     icon: CheckCircle,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'LATE FEES',
  //     value: '$1,245',
  //     change: '-8% from last month',
  //     bgColor: 'bg-amber-50',
  //     borderColor: 'border-amber-200',
  //     textColor: 'text-amber-600',
  //     iconBg: 'bg-amber-100',
  //     icon: DollarSign,
  //     changeColor: 'text-green-600'
  //   }
  // ];

  // const donationStats = [
  //   {
  //     label: 'TOTAL DONATED',
  //     value: '89',
  //     change: '+12 this month',
  //     bgColor: 'bg-pink-50',
  //     borderColor: 'border-pink-200',
  //     textColor: 'text-pink-600',
  //     iconBg: 'bg-pink-100',
  //     icon: Heart,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'MATCHED',
  //     value: '76',
  //     change: '+8 this week',
  //     bgColor: 'bg-green-50',
  //     borderColor: 'border-green-200',
  //     textColor: 'text-green-600',
  //     iconBg: 'bg-green-100',
  //     icon: CheckCircle,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'DELIVERED',
  //     value: '68',
  //     change: '+5 this week',
  //     bgColor: 'bg-blue-50',
  //     borderColor: 'border-blue-200',
  //     textColor: 'text-blue-600',
  //     iconBg: 'bg-blue-100',
  //     icon: Truck,
  //     changeColor: 'text-green-600'
  //   },
  //   {
  //     label: 'IMPACT SCORE',
  //     value: '4.9',
  //     change: '+0.1 this month',
  //     bgColor: 'bg-purple-50',
  //     borderColor: 'border-purple-200',
  //     textColor: 'text-purple-600',
  //     iconBg: 'bg-purple-100',
  //     icon: Award,
  //     changeColor: 'text-green-600'
  //   }
  // ];

  // const getCurrentStats = () => {
  //   switch (activeTab) {
  //     case 'lending': return lendingStats;
  //     case 'donations': return donationStats;
  //     default: return salesStats;
  //   }
  // };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
                <p className="text-slate-600 mt-1">
                  Track and manage all your book transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                      }`} >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getCurrentStats().map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${stat.changeColor}`}>{stat.change}</p>
              </div>
            );
          })}
        </div> */}

        {/* <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4"> */}

            {/* <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div> */}

            {/* <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option>All Status</option>
                  <option>Processing</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                  <option>Active</option>
                  <option>Overdue</option>
                  <option>Matched</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 3 months</option>
                  <option>This year</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
            </div> */}

          {/* </div>
        </div> */}

        {/* Tab Content */}
        {activeTab === 'sales' && <SalesActivity />}
        {activeTab === 'lending' && <LendingActivity />}
        {activeTab === 'donations' && <DonationActivity />}

      </div>
    </div>
  );
};

export default TransactionsPage;