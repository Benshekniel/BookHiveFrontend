// import axios from "axios";
// import {
//   Search, Filter, Plus, Upload, Edit, Trash2, Eye, MoreHorizontal, ShoppingCart, Clock, CheckCircle, DollarSign, Calendar, User, Package, TrendingUp, AlertCircle, Truck, RefreshCw, ChevronDown, ArrowRight, BookOpen, Heart, MapPin, Shield, Camera, FileText, Ban, Star, Award, Zap
// } from 'lucide-react';

// const lendingActivity = [
//   {
//     id: '#LOAN-2025-001',
//     borrower: {
//       name: 'Alex Thompson',
//       email: 'alex.t@email.com',
//       avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40',
//       trustScore: 4.7
//     },
//     book: 'Digital Marketing 2025',
//     author: 'Alex Johnson',
//     duration: '14 days',
//     dueDate: 'Jan 25, 2025',
//     status: 'Active',
//     lastSeen: 'Chittagong',
//     loanDate: 'Jan 11, 2025',
//     lateFee: '$2.00/day',
//     isOverdue: false
//   },
//   {
//     id: '#LOAN-2025-002',
//     borrower: {
//       name: 'Emma Davis',
//       email: 'emma.d@email.com',
//       avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40',
//       trustScore: 3.2
//     },
//     book: 'History of Art',
//     author: 'Maria Garcia',
//     duration: '21 days',
//     dueDate: 'Jan 20, 2025',
//     status: 'Overdue',
//     lastSeen: 'Sylhet',
//     loanDate: 'Dec 30, 2024',
//     lateFee: '$1.50/day',
//     isOverdue: true,
//     overdueBy: 5
//   }
// ];

// const getStatusBadge = (status, type = 'sales') => {
//   const statusConfigs = {
//     sales: {
//       'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: RefreshCw },
//       'In Transit': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: Truck },
//       'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
//       'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
//       'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle }
//     },
//     lending: {
//       'Active': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
//       'Overdue': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle },
//       'Returned': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: BookOpen },
//       'Frozen': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: Ban }
//     },
//     donations: {
//       'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
//       'Matched': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Heart },
//       'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle }
//     }
//   };

//   const config = statusConfigs[type][status] || statusConfigs[type]['Pending'] || statusConfigs.sales['Pending'];
//   const IconComponent = config.icon;

//   return (
//     <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
//       <IconComponent className="w-3 h-3" />
//       <span>{status}</span>
//     </span>
//   );
// };

const LendingActivity = () => {

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">LOAN ID</th>
                <th className="text-left p-4 font-semibold text-slate-700">BORROWER</th>
                <th className="text-left p-4 font-semibold text-slate-700">BOOK</th>
                <th className="text-left p-4 font-semibold text-slate-700">DUE DATE</th>
                <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
                <th className="text-left p-4 font-semibold text-slate-700">LOCATION</th>
                <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No recent transactions.
                </td>
              </tr>
              {/* {lendingActivity.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                        {loan.id}
                      </span>
                      <span className="text-xs text-slate-500">{loan.loanDate}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={loan.borrower.avatar}
                        alt={loan.borrower.name}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{loan.borrower.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-500" />
                          <span className="text-sm text-slate-600">{loan.borrower.trustScore}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-slate-800">{loan.book}</p>
                      <p className="text-sm text-slate-600">by {loan.author}</p>
                      <span className="text-xs text-slate-500">{loan.duration}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`font-medium ${loan.isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                        {loan.dueDate}
                      </span>
                      {loan.isOverdue && (
                        <span className="text-xs text-red-600">
                          {loan.overdueBy} days overdue
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(loan.status, 'lending')}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Last seen: {loan.lastSeen}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </button>
                      {loan.isOverdue && (
                        <>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group">
                            <Zap className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                            <Ban className="w-4 h-4 text-slate-400 group-hover:text-gray-600" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                        <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </>)
};
export default LendingActivity;