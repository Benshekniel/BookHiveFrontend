import React, { useState } from 'react';
import {
  Search, Filter, Plus, Upload, Edit, Trash2, Eye, MoreHorizontal, Package, DollarSign, BookOpen, Heart, Clock, Users, Star, AlertCircle, CheckCircle, Calendar, FileText, Camera, Download, Settings, Shield, Award
} from 'lucide-react';

import AddBookForm from '../../components/bookStore/AddBookForm.tsx';

import DonationInventory from '../../components/bookStore/inventory/DonationInventory.jsx';
import RegularInventory from '../../components/bookStore/inventory/RegularInventory.tsx';

import RegularStats from '../../components/bookStore/inventory/RegularStats.jsx';
import DonationStats from '../../components/bookStore/inventory/DonationStats.jsx';

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('regular');

  const tabs = [
    { id: 'regular', label: 'Regular', icon: DollarSign, count: 156 },
    { id: 'donations', label: 'Donations', icon: Heart, count: 23 }
    // { id: 'lending', label: 'Lending', icon: BookOpen, count: 89 },
  ];

  // const lendingStats = [
  //   { label: 'AVAILABLE', value: '89', bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: BookOpen },
  //   { label: 'ON LOAN', value: '34', bgColor: 'bg-amber-50', textColor: 'text-amber-600', icon: Users },
  //   { label: 'OVERDUE', value: '3', bgColor: 'bg-red-50', textColor: 'text-red-600', icon: AlertCircle },
  //   { label: 'AVG DURATION', value: '14 days', bgColor: 'bg-green-50', textColor: 'text-green-600', icon: Calendar }
  // ];

  // const lendingBooks = [
  //   {
  //     id: 1,
  //     title: 'Digital Marketing 2025',
  //     author: 'Alex Johnson',
  //     isbn: '978-0-456789-01-2',
  //     category: 'Non-Fiction',
  //     condition: 'New',
  //     duration: '14 days',
  //     lateFee: '$2.00/day',
  //     trustScoreReq: '4.5+',
  //     firstTimeFeeWaiver: true,
  //     status: 'Available',
  //     dateAdded: 'Jan 18, 2025',
  //     image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
  //   },
  //   {
  //     id: 2,
  //     title: 'History of Art',
  //     author: 'Maria Garcia',
  //     isbn: '978-0-345678-90-1',
  //     category: 'Academic',
  //     condition: 'Used',
  //     duration: '21 days',
  //     lateFee: '$1.50/day',
  //     trustScoreReq: '4.0+',
  //     firstTimeFeeWaiver: false,
  //     status: 'On Loan',
  //     borrower: 'John Doe',
  //     dueDate: 'Jan 25, 2025',
  //     dateAdded: 'Jan 10, 2025',
  //     image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
  //   }
  // ];

  // const getCurrentStats = () => {
  //   switch (activeTab) {
  //     case 'lending': return lendingStats;
  //     case 'donations': return donationStats;
  //     default: return salesStats;
  //   }
  // };
  // const getCurrentBooks = () => {
  //   switch (activeTab) {
  //     case 'lending': return lendingBooks;
  //     case 'donations': return donationBooks;
  //     default: return salesBooks;
  //   }
  // };

  const getStatusBadge = (status, type = 'regular') => {
    const statusConfigs = {
      regular: {
        'Active': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
        'Draft': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
        'Sold': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
      },
      lending: {
        'Available': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
        'On Loan': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
        'Overdue': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
      },
      donations: {
        'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
        'Matched': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
        'Delivered': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
      }
    };

    const config = statusConfigs[type][status] || statusConfigs[type]['Active'] || statusConfigs.regular['Active'];

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };


  // const renderLendingContent = () => (
  //   <div className="space-y-6">
  //     {/* Lending Settings */}
  //     <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
  //       <h3 className="text-lg font-semibold text-slate-800 mb-4">Lending Terms & Settings</h3>
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //         <div>
  //           <label className="block text-sm font-medium text-slate-700 mb-2">Default Duration</label>
  //           <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option>7 days</option>
  //             <option>14 days</option>
  //             <option>21 days</option>
  //             <option>30 days</option>
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-slate-700 mb-2">Late Fee (per day)</label>
  //           <input
  //             type="number"
  //             placeholder="2.00"
  //             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-slate-700 mb-2">Min TrustScore</label>
  //           <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option>3.0+</option>
  //             <option>3.5+</option>
  //             <option>4.0+</option>
  //             <option>4.5+</option>
  //             <option>5.0</option>
  //           </select>
  //         </div>
  //       </div>
  //       <div className="flex items-center space-x-4 mt-4">
  //         <label className="flex items-center space-x-2">
  //           <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
  //           <span className="text-sm text-slate-700">First-time loan fee waiver (requires admin approval)</span>
  //         </label>
  //       </div>
  //     </div>

  //     {/* Books Table */}
  //     <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  //       <div className="overflow-x-auto">
  //         <table className="w-full">
  //           <thead className="bg-slate-50 border-b border-gray-200">
  //             <tr>
  //               <th className="text-left p-4 font-semibold text-slate-700">BOOK DETAILS</th>
  //               <th className="text-left p-4 font-semibold text-slate-700">TERMS</th>
  //               <th className="text-left p-4 font-semibold text-slate-700">REQUIREMENTS</th>
  //               <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
  //               <th className="text-left p-4 font-semibold text-slate-700">BORROWER</th>
  //               <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {lendingBooks.map((book) => (
  //               <tr key={book.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
  //                 <td className="p-4">
  //                   <div className="flex items-center space-x-4">
  //                     <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded-lg border border-gray-200" />
  //                     <div>
  //                       <h3 className="font-semibold text-slate-800">{book.title}</h3>
  //                       <p className="text-sm text-slate-600">by {book.author}</p>
  //                       <span className="text-xs text-slate-500">{book.category}</span>
  //                     </div>
  //                   </div>
  //                 </td>
  //                 <td className="p-4">
  //                   <div className="text-sm">
  //                     <p className="font-medium text-slate-700">{book.duration}</p>
  //                     <p className="text-slate-600">{book.lateFee}</p>
  //                   </div>
  //                 </td>
  //                 <td className="p-4">
  //                   <div className="flex items-center space-x-2">
  //                     <Star className="w-4 h-4 text-amber-500" />
  //                     <span className="text-sm font-medium text-slate-700">{book.trustScoreReq}</span>
  //                     {book.firstTimeFeeWaiver && (
  //                       <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Fee Waiver</span>
  //                     )}
  //                   </div>
  //                 </td>
  //                 <td className="p-4">{getStatusBadge(book.status, 'lending')}</td>
  //                 <td className="p-4">
  //                   {book.borrower ? (
  //                     <div className="text-sm">
  //                       <p className="font-medium text-slate-700">{book.borrower}</p>
  //                       <p className="text-slate-600">Due: {book.dueDate}</p>
  //                     </div>
  //                   ) : (
  //                     <span className="text-slate-400">-</span>
  //                   )}
  //                 </td>
  //                 <td className="p-4">
  //                   <div className="flex items-center space-x-2">
  //                     <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
  //                       <Eye className="w-4 h-4 text-slate-400" />
  //                     </button>
  //                     <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200">
  //                       <Settings className="w-4 h-4 text-slate-400" />
  //                     </button>
  //                     {book.status === 'On Loan' && (
  //                       <button className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200">
  //                         <AlertCircle className="w-4 h-4 text-slate-400" />
  //                       </button>
  //                     )}
  //                   </div>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
                <p className="text-slate-600 mt-1">Manage your books across regular and donations inventory.</p>
                <p className="text-slate-600 font-bold mt-1">Books in the regular inventory will not be visible to customers. Add them to <i>Listings</i> to be visible.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <AddBookForm />
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
                      }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'regular' && <RegularStats />}
        {activeTab === 'donations' && <DonationStats />}


        {/* Search and Filters */}
        {/* <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books, ISBN, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Conditions</option>
                <option>New</option>
                <option>Used</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Categories</option>
                <option>Fiction</option>
                <option>Non-Fiction</option>
                <option>Academic</option>
                <option>Children's</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Tab Content */}
        {activeTab === 'regular' && <RegularInventory />}
        {activeTab === 'donations' && <DonationInventory />}
        {/* {activeTab === 'lending' && renderLendingContent()} */}
      </div>
    </div>
  );
};

export default InventoryPage;