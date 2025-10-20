import React, { useState, useEffect } from 'react';
import { Gift, Truck, CheckCircle, Clock, User, MapPin, Package, AlertCircle, RefreshCw, Eye, MessageCircle, X, Calendar } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:9090/api';

const DonationsReceived = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  if (!user) {
    return <p>Please log in.</p>;
  }

  const orgId = user.userId; // Use user.userId as orgId

  const [filter, setFilter] = useState('all');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [confirmationData, setConfirmationData] = useState({
    receivedDate: '',
    condition: '',
    notes: '',
  });

  // NEW: Details Modal State
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [donationDetails, setDonationDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    delivered: 0,
    inTransit: 0,
    approved: 0,
    totalBooks: 0,
  });

  // Direct API call function
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`API Response: ${endpoint} - Success`);
        return data;
      }

      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // Get donations by organization
  const getDonationsByOrganization = async (orgId) => {
    try {
      const data = await apiCall(`/organization-donations/organization/${orgId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      throw error;
    }
  };

  // Mark donation as received
  const markDonationAsReceived = async (donationId, confirmationData) => {
    try {
      const data = await apiCall(`/organization-donations/${donationId}/mark-received`, {
        method: 'POST',
        body: confirmationData,
      });
      return data;
    } catch (error) {
      console.error('Failed to mark donation as received:', error);
      throw error;
    }
  };

  // Get donation details by ID
  const getDonationById = async (donationId) => {
    try {
      const data = await apiCall(`/organization-donations/${donationId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch donation details:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadDonations();
  }, [orgId]);

  const loadDonations = async () => {
    if (!orgId) {
      setError('Organization ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getDonationsByOrganization(orgId);
      const donationList = Array.isArray(data) ? data : [];
      setDonations(donationList);

      // Calculate stats
      const newStats = donationList.reduce(
        (acc, donation) => {
          switch (donation.status?.toLowerCase()) {
            case 'delivered':
            case 'received':
              acc.delivered += 1;
              break;
            case 'in_transit':
            case 'shipped':
              acc.inTransit += 1;
              break;
            case 'approved':
              acc.approved += 1;
              break;
          }
          acc.totalBooks += donation.quantity || 0;
          return acc;
        },
        {
          delivered: 0,
          inTransit: 0,
          approved: 0,
          totalBooks: 0,
        }
      );

      setStats(newStats);
    } catch (err) {
      console.error('Error loading donations:', err);
      setError('Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((donation) => {
    if (filter === 'all') return true;
    const status = donation.status?.toLowerCase();

    switch (filter) {
      case 'delivered':
        return status === 'delivered' || status === 'received';
      case 'in_transit':
        return status === 'in_transit' || status === 'shipped';
      case 'approved':
        return status === 'approved';
      case 'pending':
        return status === 'pending';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'received':
        return 'bg-success/10 text-success';
      case 'in_transit':
      case 'shipped':
        return 'bg-accent/10 text-accent';
      case 'approved':
        return 'bg-secondary/10 text-primary';
      case 'pending':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'received':
        return CheckCircle;
      case 'in_transit':
      case 'shipped':
        return Truck;
      case 'approved':
        return Package;
      case 'pending':
        return Clock;
      default:
        return Clock;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'text-success';
      case 'very_good':
      case 'very good':
        return 'text-accent';
      case 'good':
        return 'text-secondary';
      case 'fair':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatCondition = (condition) => {
    if (!condition) return 'Not specified';
    return condition.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get progress percentage and status steps
  const getProgressData = (status) => {
    const normalizedStatus = status?.toLowerCase();
    
    const steps = [
      { label: 'Pending', value: 'pending', percentage: 0 },
      { label: 'Approved', value: 'approved', percentage: 25 },
      { label: 'Shipped', value: 'shipped', percentage: 50 },
      { label: 'In Transit', value: 'in_transit', percentage: 75 },
      { label: 'Received', value: 'received', percentage: 100 },
    ];

    let currentPercentage = 0;
    let currentStepIndex = 0;

    switch (normalizedStatus) {
      case 'pending':
        currentPercentage = 0;
        currentStepIndex = 0;
        break;
      case 'approved':
        currentPercentage = 25;
        currentStepIndex = 1;
        break;
      case 'shipped':
        currentPercentage = 50;
        currentStepIndex = 2;
        break;
      case 'in_transit':
        currentPercentage = 75;
        currentStepIndex = 3;
        break;
      case 'delivered':
      case 'received':
        currentPercentage = 100;
        currentStepIndex = 4;
        break;
      case 'rejected':
        currentPercentage = 0;
        currentStepIndex = -1; // Special case for rejected
        break;
      default:
        currentPercentage = 0;
        currentStepIndex = 0;
    }

    return { percentage: currentPercentage, steps, currentStepIndex };
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-success';
    if (percentage >= 75) return 'bg-accent';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-secondary';
    return 'bg-gray-400';
  };

  const handleMarkAsReceived = (donation) => {
    setSelectedDonation(donation);
    setConfirmationData({
      receivedDate: new Date().toISOString().split('T')[0],
      condition: donation.condition || 'good',
      notes: '',
    });
    setShowConfirmModal(true);
  };

  const confirmMarkAsReceived = async () => {
    if (!selectedDonation) return;

    const donationId = selectedDonation.id;
    setActionLoading((prev) => ({ ...prev, [donationId]: true }));
    setError(null);

    try {
      await markDonationAsReceived(donationId, {
        organizationId: orgId,
        receivedDate: confirmationData.receivedDate,
        condition: confirmationData.condition,
        notes: confirmationData.notes.trim(),
      });

      setSuccess('Donation marked as received successfully!');
      await loadDonations();
      setShowConfirmModal(false);
      setSelectedDonation(null);
      setConfirmationData({ receivedDate: '', condition: '', notes: '' });
    } catch (err) {
      console.error('Error marking donation as received:', err);
      setError('Failed to mark donation as received. Please try again.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [donationId]: false }));
    }
  };

  const handleRefresh = async () => {
    await loadDonations();
  };

  // FIXED: View Details Function
  const handleViewDetails = async (donationId) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    setError(null);

    try {
      const details = await getDonationById(donationId);
      setDonationDetails(details);
    } catch (err) {
      setError('Failed to load donation details');
      console.error('View details error:', err);
      setShowDetailsModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDonationDetails(null);
  };

  // FIXED: Navigate to feedback page with donation data
  const handleGiveFeedback = (donation) => {
    console.log('Give feedback for donation:', donation.id);
    navigate('/organization/feedback', {
      state: {
        donationId: donation.id,
        donationTitle: donation.bookTitle || donation.title,
        donorName: donation.donorName,
      },
    });
  };

  // Auto-hide success and error messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Donations Received</h1>
          <p className="text-gray-600 mt-2">Track your incoming donations and manage deliveries</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-700">
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-xl font-heading font-bold text-textPrimary">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Truck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-xl font-heading font-bold text-textPrimary">{stats.inTransit}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-heading font-bold text-textPrimary">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Gift className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-xl font-heading font-bold text-textPrimary">{stats.totalBooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-textPrimary">Filter by status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            >
              <option value="all">All Donations ({donations.length})</option>
              <option value="delivered">Delivered ({stats.delivered})</option>
              <option value="in_transit">In Transit ({stats.inTransit})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="pending">Pending ({donations.filter((d) => d.status?.toLowerCase() === 'pending').length})</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.map((donation) => {
          const StatusIcon = getStatusIcon(donation.status);
          const isActionLoading = actionLoading[donation.id];
          const progressData = getProgressData(donation.status);

          return (
            <div key={donation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 rounded-lg flex-shrink-0">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-heading font-semibold text-textPrimary truncate">
                          {donation.bookTitle || donation.title || 'Book Donation'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(donation.status)}`}>
                          <StatusIcon className="inline h-3 w-3 mr-1" />
                          {formatStatus(donation.status)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Delivery Progress</span>
                          <span className="text-xs font-semibold text-primary">{progressData.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(progressData.percentage)} transition-all duration-500 ease-out rounded-full`}
                            style={{ width: `${progressData.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {progressData.steps.map((step, index) => {
                            const isCompleted = index <= progressData.currentStepIndex;
                            const isCurrent = index === progressData.currentStepIndex;
                            return (
                              <div key={step.value} className="flex flex-col items-center flex-1">
                                <div className={`w-2 h-2 rounded-full mb-1 ${
                                  isCompleted 
                                    ? isCurrent 
                                      ? getProgressColor(progressData.percentage)
                                      : 'bg-gray-400'
                                    : 'bg-gray-300'
                                }`}></div>
                                <span className={`text-xs ${
                                  isCompleted 
                                    ? 'text-gray-700 font-medium' 
                                    : 'text-gray-400'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">Donor: {donation.donorName || 'Anonymous'}</span>
                          </div>
                          {donation.donorLocation && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{donation.donorLocation}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Package className="h-4 w-4 flex-shrink-0" />
                            <span>Quantity: {donation.quantity || 0} books</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {donation.condition && (
                            <div className="text-sm">
                              <span className="text-gray-600">Condition: </span>
                              <span className={`font-medium ${getConditionColor(donation.condition)}`}>
                                {formatCondition(donation.condition)}
                              </span>
                            </div>
                          )}
                          {donation.trackingNumber && (
                            <div className="text-sm text-gray-600">
                              <span>Tracking: </span>
                              <span className="font-mono text-accent">{donation.trackingNumber}</span>
                            </div>
                          )}
                          {donation.dateReceived && (
                            <div className="text-sm text-gray-600">
                              Received: {formatDate(donation.dateReceived)}
                            </div>
                          )}
                          {donation.dateShipped && (
                            <div className="text-sm text-gray-600">
                              Shipped: {formatDate(donation.dateShipped)}
                            </div>
                          )}
                          {donation.estimatedDelivery && (
                            <div className="text-sm text-gray-600">
                              Est. Delivery: {formatDate(donation.estimatedDelivery)}
                            </div>
                          )}
                          {donation.donationDate && (
                            <div className="text-sm text-gray-600">
                              Donated: {formatDate(donation.donationDate)}
                            </div>
                          )}
                        </div>
                      </div>

                      {donation.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">{donation.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {(donation.status?.toLowerCase() === 'in_transit' || donation.status?.toLowerCase() === 'shipped') && (
                    <button
                      onClick={() => handleMarkAsReceived(donation)}
                      disabled={isActionLoading}
                      className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isActionLoading ? 'Processing...' : 'Mark as Received'}
                    </button>
                  )}
                  {(donation.status?.toLowerCase() === 'delivered' || donation.status?.toLowerCase() === 'received') && (
                    <button
                      onClick={() => handleGiveFeedback(donation)}
                      className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="inline h-4 w-4 mr-1" />
                      Give Feedback
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(donation.id)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    <Eye className="inline h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? "You haven't received any donations yet." : `No ${filter.replace('_', ' ')} donations found.`}
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-heading font-semibold text-textPrimary mb-4">Confirm Receipt of Donation</h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-textPrimary">{selectedDonation.bookTitle || 'Book Donation'}</h4>
              <p className="text-sm text-gray-600">From: {selectedDonation.donorName || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">Quantity: {selectedDonation.quantity || 0} books</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Date Received *</label>
                <input
                  type="date"
                  value={confirmationData.receivedDate}
                  onChange={(e) => setConfirmationData((prev) => ({ ...prev, receivedDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Condition *</label>
                <select
                  value={confirmationData.condition}
                  onChange={(e) => setConfirmationData((prev) => ({ ...prev, condition: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                >
                  <option value="excellent">Excellent</option>
                  <option value="very_good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Additional Notes (Optional)</label>
                <textarea
                  rows="3"
                  value={confirmationData.notes}
                  onChange={(e) => setConfirmationData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="Any additional comments about the condition or donation..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{confirmationData.notes.length}/500 characters</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={confirmMarkAsReceived}
                disabled={!confirmationData.receivedDate || !confirmationData.condition || actionLoading[selectedDonation.id]}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading[selectedDonation.id] ? 'Processing...' : 'Confirm Receipt'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedDonation(null);
                  setConfirmationData({ receivedDate: '', condition: '', notes: '' });
                }}
                disabled={actionLoading[selectedDonation.id]}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-heading font-semibold text-textPrimary">Donation Details</h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Loading details...</p>
              </div>
            ) : donationDetails ? (
              <div className="space-y-6">
                {/* Main Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <Gift className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-textPrimary mb-2">
                        {donationDetails.bookTitle || donationDetails.title || 'Book Donation'}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donationDetails.status)}`}>
                          {formatStatus(donationDetails.status)}
                        </span>
                        {donationDetails.condition && (
                          <span className={`text-sm font-medium ${getConditionColor(donationDetails.condition)}`}>
                            Condition: {formatCondition(donationDetails.condition)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donor Information */}
                <div>
                  <h5 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Donor Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-textPrimary">{donationDetails.donorName || 'Anonymous'}</p>
                    </div>
                    {donationDetails.donorEmail && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-textPrimary">{donationDetails.donorEmail}</p>
                      </div>
                    )}
                    {donationDetails.donorPhone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-textPrimary">{donationDetails.donorPhone}</p>
                      </div>
                    )}
                    {donationDetails.donorLocation && (
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-textPrimary">{donationDetails.donorLocation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Donation Details */}
                <div>
                  <h5 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Donation Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium text-textPrimary">{donationDetails.quantity || 0} books</p>
                    </div>
                    {donationDetails.bookCategory && (
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium text-textPrimary">{donationDetails.bookCategory}</p>
                      </div>
                    )}
                    {donationDetails.isbn && (
                      <div>
                        <p className="text-sm text-gray-600">ISBN</p>
                        <p className="font-medium text-textPrimary font-mono">{donationDetails.isbn}</p>
                      </div>
                    )}
                    {donationDetails.author && (
                      <div>
                        <p className="text-sm text-gray-600">Author</p>
                        <p className="font-medium text-textPrimary">{donationDetails.author}</p>
                      </div>
                    )}
                    {donationDetails.publisher && (
                      <div>
                        <p className="text-sm text-gray-600">Publisher</p>
                        <p className="font-medium text-textPrimary">{donationDetails.publisher}</p>
                      </div>
                    )}
                    {donationDetails.publicationYear && (
                      <div>
                        <p className="text-sm text-gray-600">Publication Year</p>
                        <p className="font-medium text-textPrimary">{donationDetails.publicationYear}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div>
                  <h5 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    {donationDetails.trackingNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-medium text-accent font-mono">{donationDetails.trackingNumber}</p>
                      </div>
                    )}
                    {donationDetails.shippingMethod && (
                      <div>
                        <p className="text-sm text-gray-600">Shipping Method</p>
                        <p className="font-medium text-textPrimary">{donationDetails.shippingMethod}</p>
                      </div>
                    )}
                    {donationDetails.dateShipped && (
                      <div>
                        <p className="text-sm text-gray-600">Date Shipped</p>
                        <p className="font-medium text-textPrimary">{formatDate(donationDetails.dateShipped)}</p>
                      </div>
                    )}
                    {donationDetails.estimatedDelivery && (
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="font-medium text-textPrimary">{formatDate(donationDetails.estimatedDelivery)}</p>
                      </div>
                    )}
                    {donationDetails.dateReceived && (
                      <div>
                        <p className="text-sm text-gray-600">Date Received</p>
                        <p className="font-medium text-success">{formatDate(donationDetails.dateReceived)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Timeline
                  </h5>
                  <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                    {donationDetails.donationDate && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-textPrimary">Donation Created</p>
                          <p className="text-xs text-gray-600">{formatDateTime(donationDetails.donationDate)}</p>
                        </div>
                      </div>
                    )}
                    {donationDetails.approvedDate && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-textPrimary">Approved</p>
                          <p className="text-xs text-gray-600">{formatDateTime(donationDetails.approvedDate)}</p>
                        </div>
                      </div>
                    )}
                    {donationDetails.dateShipped && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-textPrimary">Shipped</p>
                          <p className="text-xs text-gray-600">{formatDateTime(donationDetails.dateShipped)}</p>
                        </div>
                      </div>
                    )}
                    {donationDetails.dateReceived && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-textPrimary">Received</p>
                          <p className="text-xs text-gray-600">{formatDateTime(donationDetails.dateReceived)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {(donationDetails.notes || donationDetails.description || donationDetails.donorMessage) && (
                  <div>
                    <h5 className="text-lg font-semibold text-textPrimary mb-3">Notes & Messages</h5>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {donationDetails.donorMessage && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Message from Donor:</p>
                          <p className="text-sm text-gray-700 italic">"{donationDetails.donorMessage}"</p>
                        </div>
                      )}
                      {donationDetails.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Description:</p>
                          <p className="text-sm text-gray-700">{donationDetails.description}</p>
                        </div>
                      )}
                      {donationDetails.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Internal Notes:</p>
                          <p className="text-sm text-gray-700">{donationDetails.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  {(donationDetails.status?.toLowerCase() === 'delivered' || donationDetails.status?.toLowerCase() === 'received') && (
                    <button
                      onClick={() => {
                        closeDetailsModal();
                        handleGiveFeedback(donationDetails);
                      }}
                      className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <MessageCircle className="inline h-4 w-4 mr-2" />
                      Give Feedback
                    </button>
                  )}
                  <button
                    onClick={closeDetailsModal}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Failed to load donation details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsReceived;