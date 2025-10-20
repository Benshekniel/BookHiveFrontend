// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

import { useState, useEffect } from "react";

import {
  DollarSign, ShoppingCart, Eye, TrendingUp, TrendingDown, AlertTriangle,
  BookOpen, ExternalLink, Package, Truck, CheckCircle, Clock, Plus, Settings
} from 'lucide-react';

import { useAuth } from "../../AuthContext";
import LoadingSpinner from "../CommonStuff/LoadingSpinner";

const orders = [
  {
    id: 'BH-1',
    customer: 'Nuwan Perera',
    books: '2 items',
    total: 'Rs. 1500',
    status: 'in transit',
    date: 'Oct 19, 2025'
  },
  {
    id: 'BH-2',
    customer: 'Tharushi Silva',
    books: '1 item',
    total: 'Rs. 450',
    status: 'delivered',
    date: 'Oct 18, 2025'
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
  const { user } = useAuth();
  // console.log("User details: ", user);

  // const getRecentOrders = async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   const response = await api.get("???");
  //   console.log(response.data);
  //   return response.data;
  // }

  const [delayedOrders, setDelayedOrders] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedOrders(orders); // load data after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <>
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
                  )))}
            </tbody>
          </table>
        </div>
      </div>
    </>);
};
export default RecentOrders;