// import axios from "axios";
import {
  Search, Filter, Plus, Upload, Edit, Trash2, Eye, MoreHorizontal, ShoppingCart, Clock, CheckCircle, DollarSign, Calendar, User, Package, TrendingUp, AlertCircle, Truck, RefreshCw, ChevronDown, ArrowRight, BookOpen, Heart, MapPin, Shield, Camera, FileText, Ban, Star, Award, Zap
} from 'lucide-react';

import { useEffect, useState } from "react";
import LoadingSpinner from "../CommonStuff/LoadingSpinner.jsx";
import { useAuth } from '../../AuthContext.jsx';

const salesOrders = [
  {
    id: '#ORD-1',
    customer: {
      name: 'Nuwan Perera',
      email: 'nuwan.perera@email.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40'
    },
    books: [
      'Harry Potter and the Philosopher\'s Stone',
      'The Great Gatsby'
    ],
    bookCount: 3,
    total: 1500,
    status: 'In Transit',
    date: 'Oct 19, 2025',
    orderType: 'Standard',
    tracking: [
      { location: 'Colombo Central Hub', timestamp: 'Oct 19, 9:30 AM', status: 'scanned', pin: '****' },
      { location: 'Kaduwela Sorting Center', timestamp: 'Oct 20, 2:15 PM', status: 'scanned', pin: '****' },
      { location: 'Out for Delivery - Nugegoda', timestamp: 'Oct 21, 8:45 AM', status: 'pending', pin: null }
    ]
  },
  {
    id: '#ORD-2',
    customer: {
      name: 'Tharushi Silva',
      email: 'tharushi.silva@email.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40'
    },
    books: ['Harry Potter and the Philosopher\'s Stone'],
    bookCount: 1,
    total: 450,
    status: 'Delivered',
    date: 'Oct 18, 2025',
    orderType: 'Express',
    tracking: [
      { location: 'Colombo 05 Dispatch Hub', timestamp: 'Oct 18, 1:40 PM', status: 'scanned', pin: '****' },
      { location: 'Delivered - Dehiwala', timestamp: 'Oct 18, 6:10 PM', status: 'delivered', pin: '****', signature: true }
    ]
  }
];

const getStatusBadge = (status, type = 'sales') => {
  const statusConfigs = {
    sales: {
      'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: RefreshCw },
      'In Transit': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: Truck },
      'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
      'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle }
    },
    lending: {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
      'Overdue': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle },
      'Returned': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: BookOpen },
      'Frozen': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: Ban }
    },
    donations: {
      'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
      'Matched': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Heart },
      'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle }
    }
  };

  const config = statusConfigs[type][status] || statusConfigs[type]['Pending'] || statusConfigs.sales['Pending'];
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <IconComponent className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};
const SalesActivity = () => {
  const { user } = useAuth();

  const [delayedOrders, setDelayedOrders] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedOrders(salesOrders); // load data after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">ORDER ID</th>
                <th className="text-left p-4 font-semibold text-slate-700">CUSTOMER</th>
                <th className="text-left p-4 font-semibold text-slate-700">BOOKS</th>
                <th className="text-left p-4 font-semibold text-slate-700">TOTAL</th>
                <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
                <th className="text-left p-4 font-semibold text-slate-700">TRACKING</th>
                {/* <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th> */}
              </tr>
            </thead>
            <tbody>
              {(user?.userId != 2853) ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No recent transactions.
                  </td>
                </tr>) :
                (delayedOrders.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : (
                  delayedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                            {order.id}
                          </span>
                          <span className="text-xs text-slate-500">{order.date}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={order.customer.avatar}
                            alt={order.customer.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-800">{order.customer.name}</p>
                            <p className="text-sm text-slate-600">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2 mb-1">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-700">{order.bookCount} book{order.bookCount > 1 ? 's' : ''}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {order.books.slice(0, 2).map((book, idx) => (
                              <div key={idx} className="truncate max-w-xs">{book}</div>
                            ))}
                            {order.books.length > 2 && (
                              <div className="text-blue-600 cursor-pointer hover:underline">
                                +{order.books.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 text-lg">Rs. {order.total}</span>
                      </td>
                      <td className="p-4">{getStatusBadge(order.status, 'sales')}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.tracking.map((track, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-xs">
                              {track.status === 'scanned' ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : track.status === 'delivered' ? (
                                <CheckCircle className="w-3 h-3 text-blue-500" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-500" />
                              )}
                              <span className="text-slate-600">{track.location}</span>
                              {track.signature && <Camera className="w-3 h-3 text-blue-500" />}
                            </div>
                          ))}
                        </div>
                      </td>
                      {/* <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                        <Truck className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                        <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      </button>
                    </div>
                  </td> */}
                    </tr>
                  )))}
            </tbody>
          </table>
        </div>
      </div>
    </>)
};
export default SalesActivity;