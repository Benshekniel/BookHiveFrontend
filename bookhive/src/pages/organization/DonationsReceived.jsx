import React, { useState, useEffect } from 'react';
import { Gift, Truck, CheckCircle, Clock, User, MapPin, Package } from 'lucide-react';
import { donationService } from '../../services/donationService';

const ORG_ID = 1; // TODO: Replace with real orgId from context or props

const DonationsReceived = () => {
  const [filter, setFilter] = useState('all');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    donationService.getByOrganization(ORG_ID)
      .then(data => {
        setDonations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load donations');
        setLoading(false);
      });
  }, []);

  const filteredDonations = donations.filter(donation => 
    filter === 'all' || donation.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'in_transit': return 'bg-accent/10 text-accent';
      case 'approved': return 'bg-secondary/10 text-primary';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in_transit': return Truck;
      case 'approved': return Package;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'text-success';
      case 'very_good': return 'text-accent';
      case 'good': return 'text-secondary';
      case 'fair': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const markAsReceived = async (donationId) => {
    setLoading(true);
    setError(null);
    try {
      await donationService.markAsReceived(donationId);
      // Refresh donations
      const data = await donationService.getByOrganization(ORG_ID);
      setDonations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to mark as received');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-textPrimary">Donations Received</h1>
        <p className="text-gray-600 mt-2">Track your incoming donations and manage deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-xl font-heading font-bold text-textPrimary">48</p>
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
              <p className="text-xl font-heading font-bold text-textPrimary">12</p>
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
              <p className="text-xl font-heading font-bold text-textPrimary">8</p>
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
              <p className="text-xl font-heading font-bold text-textPrimary">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-textPrimary">Filter by status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          >
            <option value="all">All Donations</option>
            <option value="delivered">Delivered</option>
            <option value="in_transit">In Transit</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.map((donation) => {
          const StatusIcon = getStatusIcon(donation.status);
          
          return (
            <div key={donation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-heading font-semibold text-textPrimary">
                          {donation.bookTitle}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          <StatusIcon className="inline h-3 w-3 mr-1" />
                          {donation.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>Donor: {donation.donorName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{donation.donorLocation}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Package className="h-4 w-4" />
                            <span>Quantity: {donation.quantity} books</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Condition: </span>
                            <span className={`font-medium ${getConditionColor(donation.condition)}`}>
                              {donation.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          {donation.trackingNumber && (
                            <div className="text-sm text-gray-600">
                              <span>Tracking: </span>
                              <span className="font-mono text-accent">{donation.trackingNumber}</span>
                            </div>
                          )}
                          {donation.dateReceived && (
                            <div className="text-sm text-gray-600">
                              Received: {donation.dateReceived}
                            </div>
                          )}
                          {donation.dateShipped && (
                            <div className="text-sm text-gray-600">
                              Shipped: {donation.dateShipped}
                            </div>
                          )}
                          {donation.estimatedDelivery && (
                            <div className="text-sm text-gray-600">
                              Est. Delivery: {donation.estimatedDelivery}
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
                
                <div className="flex flex-col space-y-2">
                  {donation.status === 'in_transit' && (
                    <button
                      onClick={() => markAsReceived(donation.id)}
                      className="bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors"
                    >
                      Mark as Received
                    </button>
                  )}
                  {donation.status === 'delivered' && (
                    <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                      Give Feedback
                    </button>
                  )}
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
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
    </div>
  );
};

export default DonationsReceived;