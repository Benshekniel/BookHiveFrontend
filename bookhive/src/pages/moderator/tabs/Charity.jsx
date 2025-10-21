import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Heart, Plus, Eye, CheckCircle, Clock, BookOpen, TrendingUp, BarChart3, ThumbsUp, XCircle, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import CharityCreate from "../subPages/charityCreate";
import { donationApi } from '../../../services/moderatorService';

const Charity = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [donationRequests, setDonationRequests] = useState([]);
  const [approvedDonations, setApprovedDonations] = useState([]);
  const [rejectedDonations, setRejectedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDonation, setViewDonation] = useState(null);
  const [viewType, setViewType] = useState(null); // 'pending', 'approved', 'rejected'

  const REJECTION_TEMPLATES = [
    'Insufficient information provided',
    'Duplicate donation request',
    'Does not meet quality standards',
    'Books not suitable for current needs',
    'Incomplete donation details',
    'Unable to verify authenticity',
    'Other (specify below)'
  ];

  useEffect(() => {
    fetchAllDonations();
  }, []);

  const fetchAllDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all donation types in parallel
      const [pending, approved, rejected] = await Promise.all([
        donationApi.getPendingDonations(),
        donationApi.getApprovedDonations(),
        donationApi.getRejectedDonations()
      ]);

      setDonationRequests(pending || []);
      setApprovedDonations(approved || []);
      setRejectedDonations(rejected || []);
    } catch (err) {
      setError('Failed to load donations. Please try again.');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDonation = async (donationId) => {
    try {
      setApproving(donationId);
      await donationApi.approveDonation(donationId);

      // Show success message
      setSuccessMessage({ type: 'success', text: 'Donation approved successfully!' });

      // Auto-refresh data
      await fetchAllDonations();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSuccessMessage({ type: 'error', text: 'Failed to approve donation. Please try again.' });
      console.error('Error approving donation:', err);
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setApproving(null);
    }
  };

  const openRejectModal = (donation) => {
    setSelectedDonation(donation);
    setRejectReason('');
    setCustomReason('');
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedDonation(null);
    setRejectReason('');
    setCustomReason('');
  };

  const openViewModal = (donation, type) => {
    setViewDonation(donation);
    setViewType(type);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewDonation(null);
    setViewType(null);
  };

  const handleRejectDonation = async () => {
    if (!selectedDonation) return;

    const finalReason = rejectReason === 'Other (specify below)'
      ? customReason.trim()
      : rejectReason;

    if (!finalReason) {
      alert('Please select a reason or provide a custom reason.');
      return;
    }

    try {
      setRejecting(selectedDonation.id);
      await donationApi.rejectDonation(selectedDonation.id, finalReason);

      // Show success message
      setSuccessMessage({ type: 'success', text: 'Donation rejected successfully!' });

      // Close modal
      closeRejectModal();

      // Auto-refresh data
      await fetchAllDonations();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSuccessMessage({ type: 'error', text: 'Failed to reject donation. Please try again.' });
      console.error('Error rejecting donation:', err);
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setRejecting(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Process approved donations data by month (using quantityCurrent)
  const getMonthlyApprovedData = () => {
    const monthMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize all months with 0
    monthNames.forEach(month => {
      monthMap[month] = 0;
    });

    // Aggregate approved donations by month using createdAt date
    approvedDonations.forEach(donation => {
      if (donation.createdAt) {
        const date = new Date(donation.createdAt);
        const monthName = monthNames[date.getMonth()];
        monthMap[monthName] += (donation.quantityCurrent || 0);
      }
    });

    // Convert to array format for chart
    return monthNames.map(month => ({
      month,
      books: monthMap[month]
    }));
  };

  // Process all requests data by month (using quantity)
  const getMonthlyRequestedData = () => {
    const monthMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize all months with 0
    monthNames.forEach(month => {
      monthMap[month] = 0;
    });

    // Aggregate all requests (pending + approved + rejected) by month
    const allRequests = [...donationRequests, ...approvedDonations, ...rejectedDonations];
    allRequests.forEach(request => {
      if (request.createdAt) {
        const date = new Date(request.createdAt);
        const monthName = monthNames[date.getMonth()];
        monthMap[monthName] += (request.quantity || 0);
      }
    });

    // Convert to array format for chart
    return monthNames.map(month => ({
      month,
      requested: monthMap[month]
    }));
  };

  const monthlyDonations = getMonthlyApprovedData();
  const monthlyRequested = getMonthlyRequestedData();

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch (priorityLower) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch (priorityLower) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Custom Tooltip Component for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-blue-600">
            <span className="font-medium">Books Donated:</span> {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip Component for Line Chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-green-600">
            <span className="font-medium">Books Requested:</span> {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Success/Error Message Banner */}
      {successMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border flex items-center space-x-3 animate-fade-in ${
          successMessage.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {successMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{successMessage.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : donationRequests.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : approvedDonations.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : rejectedDonations.length}
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Books</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : [...donationRequests, ...approvedDonations, ...rejectedDonations]
                  .reduce((sum, d) => sum + (d.quantity || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Donated Chart - Bar Chart with Real Data */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Book Donations</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDonations} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="square"
                />
                <Bar
                  dataKey="books"
                  fill="#3b82f6"
                  name="Books Donated (Current Qty)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Books Requested Chart - Line Chart with Real Data */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Book Requests</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRequested} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="requested"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Books Requested by Organizations"
                  dot={{ fill: '#22c55e', r: 5 }}
                  activeDot={{ r: 7, fill: '#16a34a' }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex justify-between items-center px-6">
              {/* Left side buttons */}
              <div className="flex space-x-8 -mb-px">
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'requests'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending Requests
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'approved'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Approved Donations
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rejected'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rejected Donations
                </button>
              </div>

              {/* Right side button */}
              {/* <div className="py-4">
                <button 
                onClick={() => setShowCreateEvent(true)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div> */}
            </nav>
          </div>
        {showCreateEvent && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4">
            <div
              className="bg-white rounded-lg shadow-lg p-6 relative"
              style={{ width: '500px', height: '400px' }}
            >
              {/* Close Button inside modal */}
              <button
                onClick={() => setShowCreateEvent(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>

              <CharityCreate setShowCreateEvent={setShowCreateEvent}/>
            </div>
          </div>
        )}
        
        </div>



        <div className="p-6">
          {activeTab === 'requests' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={fetchAllDonations}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : donationRequests.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No donation requests found</h3>
                  <p className="text-gray-500">There are no pending donation requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donationRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-6 rounded-lg border-l-4 ${getPriorityColor(request.priority)} bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{request.bookTitle}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            {request.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(request.priority)}`}>
                                {request.priority} priority
                              </span>
                            )}
                          </div>

                          {request.notes && (
                            <p className="text-gray-600 mb-3">{request.notes}</p>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Organization:</span> {request.orgName || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {request.category || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {request.quantity || 'N/A'} books
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {formatDate(request.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => openViewModal(request, 'pending')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {request.status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveDonation(request.id)}
                                disabled={approving === request.id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Approve Donation"
                              >
                                {approving === request.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                ) : (
                                  <ThumbsUp className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => openRejectModal(request)}
                                disabled={rejecting === request.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject Donation"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'approved' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={fetchAllDonations}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : approvedDonations.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No approved donations found</h3>
                  <p className="text-gray-500">There are no approved donations at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-6 rounded-lg border-l-4 border-l-green-500 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{donation.bookTitle || 'Untitled Donation'}</h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {donation.status}
                            </span>
                            {donation.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(donation.priority)}`}>
                                {donation.priority} priority
                              </span>
                            )}
                          </div>

                          {donation.notes && (
                            <p className="text-gray-600 mb-3">{donation.notes}</p>
                          )}

                          {/* Progress Tracking */}
                          {donation.quantity && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-medium">Delivery Progress</span>
                                <span className="font-semibold text-gray-900">
                                  {donation.quantityCurrent || 0}/{donation.quantity} books
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-green-500 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                                  style={{
                                    width: `${Math.min(((donation.quantityCurrent || 0) / donation.quantity) * 100, 100)}%`
                                  }}
                                >
                                  {((donation.quantityCurrent || 0) / donation.quantity) * 100 >= 10 && (
                                    <span className="text-xs text-white font-bold">
                                      {Math.round(((donation.quantityCurrent || 0) / donation.quantity) * 100)}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Organization:</span> {donation.orgName || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {donation.category || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {donation.quantity || 'N/A'} books
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {formatDate(donation.createdAt)}
                            </div>
                            {donation.dateShipped && (
                              <div>
                                <span className="font-medium">Shipped:</span> {formatDate(donation.dateShipped)}
                              </div>
                            )}
                            {donation.estimatedDelivery && (
                              <div>
                                <span className="font-medium">Est. Delivery:</span> {formatDate(donation.estimatedDelivery)}
                              </div>
                            )}
                            {donation.trackingNumber && (
                              <div className="col-span-2">
                                <span className="font-medium">Tracking:</span> <span className="font-mono text-blue-600">{donation.trackingNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => openViewModal(donation, 'approved')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'rejected' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={fetchAllDonations}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : rejectedDonations.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected donations found</h3>
                  <p className="text-gray-500">There are no rejected donations at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rejectedDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-6 rounded-lg border-l-4 border-l-red-500 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{donation.bookTitle || 'Untitled Donation'}</h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {donation.status}
                            </span>
                            {donation.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(donation.priority)}`}>
                                {donation.priority} priority
                              </span>
                            )}
                          </div>

                          {donation.notes && (
                            <p className="text-gray-600 mb-3">{donation.notes}</p>
                          )}

                          {donation.feedback && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-red-800">{donation.feedback}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Organization:</span> {donation.orgName || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Category:</span> {donation.category || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {donation.quantity || 'N/A'} books
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {formatDate(donation.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => openViewModal(donation, 'rejected')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showViewModal && viewDonation && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeViewModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h2>

            <div className="space-y-6">
              {/* Organization & Book Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium mb-1">Organization</p>
                  <p className="text-lg font-bold text-gray-900">{viewDonation.orgName || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-1">Book Title</p>
                  <p className="text-base font-semibold text-gray-900">{viewDonation.bookTitle || 'Untitled'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-1">Category</p>
                  <p className="text-base font-semibold text-gray-900">{viewDonation.category || 'N/A'}</p>
                </div>
              </div>

              {/* Quantity Display - Different for each type */}
              {viewType === 'pending' && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 font-medium mb-2">Requested Quantity</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-yellow-900">{viewDonation.quantity || 0}</p>
                    <p className="text-sm text-yellow-600">books</p>
                  </div>
                </div>
              )}

              {viewType === 'approved' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-green-700 font-medium">Delivery Progress</p>
                    <p className="text-lg font-bold text-green-900">
                      {viewDonation.quantityCurrent || 0} / {viewDonation.quantity || 0} books
                    </p>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all duration-300 flex items-center justify-center"
                      style={{
                        width: `${Math.min(((viewDonation.quantityCurrent || 0) / (viewDonation.quantity || 1)) * 100, 100)}%`
                      }}
                    >
                      {((viewDonation.quantityCurrent || 0) / (viewDonation.quantity || 1)) * 100 >= 15 && (
                        <span className="text-xs text-white font-bold">
                          {Math.round(((viewDonation.quantityCurrent || 0) / (viewDonation.quantity || 1)) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {viewType === 'rejected' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-2">Requested Quantity</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-red-900">{viewDonation.quantity || 0}</p>
                    <p className="text-sm text-red-600">books</p>
                  </div>
                </div>
              )}

              {/* Priority & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(viewDonation.priority)}`}>
                    {viewDonation.priority || 'N/A'} Priority
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Created At</p>
                  <p className="text-base font-semibold text-gray-900">{formatDate(viewDonation.createdAt)}</p>
                </div>
              </div>

              {/* Notes */}
              {viewDonation.notes && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium mb-2">Notes</p>
                  <p className="text-sm text-gray-700">{viewDonation.notes}</p>
                </div>
              )}

              {/* Rejection Reason - Only for rejected */}
              {viewType === 'rejected' && viewDonation.rejectedReason && (
                <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
                  <p className="text-sm text-red-900 font-bold mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejection Reason
                  </p>
                  <p className="text-base text-red-800 font-medium">{viewDonation.rejectedReason}</p>
                </div>
              )}

              {/* Additional Info for Approved */}
              {viewType === 'approved' && (
                <div className="grid grid-cols-2 gap-4">
                  {viewDonation.trackingNumber && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">Tracking Number</p>
                      <p className="text-base font-mono font-semibold text-blue-600">{viewDonation.trackingNumber}</p>
                    </div>
                  )}
                  {viewDonation.dateShipped && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">Shipped Date</p>
                      <p className="text-base font-semibold text-gray-900">{formatDate(viewDonation.dateShipped)}</p>
                    </div>
                  )}
                  {viewDonation.estimatedDelivery && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium mb-2">Estimated Delivery</p>
                      <p className="text-base font-semibold text-gray-900">{formatDate(viewDonation.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={closeViewModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeRejectModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Donation</h2>

            {selectedDonation && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Donation: <span className="font-semibold text-gray-900">{selectedDonation.bookTitle}</span></p>
                <p className="text-sm text-gray-600">Quantity: <span className="font-semibold text-gray-900">{selectedDonation.quantity} books</span></p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rejection Reason
                </label>
                <div className="space-y-2">
                  {REJECTION_TEMPLATES.map((template) => (
                    <label
                      key={template}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        rejectReason === template
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rejectReason"
                        value={template}
                        checked={rejectReason === template}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="mr-3 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{template}</span>
                    </label>
                  ))}
                </div>
              </div>

              {rejectReason === 'Other (specify below)' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Reason
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    rows="3"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={closeRejectModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectDonation}
                  disabled={rejecting === selectedDonation?.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejecting === selectedDonation?.id ? 'Rejecting...' : 'Reject Donation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default Charity;