import React, { useState, useEffect } from 'react';
import { Gift, Truck, CheckCircle, Clock, User, MapPin, Package, AlertCircle, RefreshCw, Eye, MessageCircle } from 'lucide-react';
import { donationService } from '../../services/organizationService';

const ORG_ID = 1; // TODO: Replace with real orgId from context or props

const DonationsReceived = () => {
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
    notes: ''
  });

  // Stats state
  const [stats, setStats] = useState({
    delivered: 0,
    inTransit: 0,
    approved: 0,
    totalBooks: 0
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await donationService.getDonationsByOrganization(ORG_ID);
      const donationList = Array.isArray(data) ? data : [];
      setDonations(donationList);
      
      // Calculate stats
      const newStats = donationList.reduce((acc, donation) => {
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
      }, {
        delivered: 0,
        inTransit: 0,
        approved: 0,
        totalBooks: 0
      });
      
      setStats(newStats);
    } catch (err) {
      console.error('Error loading donations:', err);
      setError('Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(donation => {
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
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCondition = (condition) => {
    if (!condition) return 'Not specified';
    return condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleMarkAsReceived = (donation) => {
    setSelectedDonation(donation);
    setConfirmationData({
      receivedDate: new Date().toISOString().split('T')[0],
      condition: donation.condition || 'good',
      notes: ''
    });
    setShowConfirmModal(true);
  };

  const confirmMarkAsReceived = async () => {
    if (!selectedDonation) return;
    
    const donationId = selectedDonation.id;
    setActionLoading(prev => ({ ...prev, [donationId]: true }));
    setError(null);
    
    try {
      await donationService.markAsReceived(donationId, {
        organizationId: ORG_ID,
        receivedDate: confirmationData.receivedDate,
        condition: confirmationData.condition,
        notes: confirmationData.notes.trim()
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
      setActionLoading(prev => ({ ...prev, [donationId]: false }));
    }
  };

  const handleRefresh = async () => {
    await loadDonations();
  };

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
              <option value="pending">Pending ({donations.filter(d => d.status?.toLowerCase() === 'pending').length})</option>
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
                    <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors whitespace-nowrap">
                      <MessageCircle className="inline h-4 w-4 mr-1" />
                      Give Feedback
                    </button>
                  )}
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
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
            {filter === 'all' 
              ? "You haven't received any donations yet." 
              : `No ${filter.replace('_', ' ')} donations found.`
            }
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-heading font-semibold text-textPrimary mb-4">
              Confirm Receipt of Donation
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-textPrimary">{selectedDonation.bookTitle || 'Book Donation'}</h4>
              <p className="text-sm text-gray-600">From: {selectedDonation.donorName || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">Quantity: {selectedDonation.quantity || 0} books</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Date Received *
                </label>
                <input
                  type="date"
                  value={confirmationData.receivedDate}
                  onChange={(e) => setConfirmationData(prev => ({ ...prev, receivedDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Condition *
                </label>
                <select
                  value={confirmationData.condition}
                  onChange={(e) => setConfirmationData(prev => ({ ...prev, condition: e.target.value }))}
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
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  value={confirmationData.notes}
                  onChange={(e) => setConfirmationData(prev => ({ ...prev, notes: e.target.value }))}
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
    </div>
  );
};

export default DonationsReceived;