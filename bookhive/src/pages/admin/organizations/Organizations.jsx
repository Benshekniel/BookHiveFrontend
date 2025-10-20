import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle, XCircle, Eye, Ban, Clock } from 'lucide-react';
import AdminModeratorService from '../../../services/adminService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrganizationReview from './OrganizationReview';

const Organizations = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [activeOrgs, setActiveOrgs] = useState([]);
  const [rejectedOrgs, setRejectedOrgs] = useState([]);
  const [bannedOrgs, setBannedOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all counts on initial load
  useEffect(() => {
    fetchAllCounts();
  }, []);

  // Fetch organizations based on active tab
  useEffect(() => {
    fetchOrganizations();
  }, [activeTab]);

  const fetchAllCounts = async () => {
    try {
      const [pending, active, rejected, banned] = await Promise.all([
        AdminModeratorService.getPendingOrganizations(),
        AdminModeratorService.getActiveOrganizations(),
        AdminModeratorService.getRejectedOrganizations(),
        AdminModeratorService.getBannedOrganizations()
      ]);

      setPendingOrgs(pending || []);
      setActiveOrgs(active || []);
      setRejectedOrgs(rejected || []);
      setBannedOrgs(banned || []);
    } catch (error) {
      console.error('Failed to fetch organization counts:', error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      if (activeTab === 'pending') {
        const data = await AdminModeratorService.getPendingOrganizations();
        setPendingOrgs(data || []);
      } else if (activeTab === 'active') {
        const data = await AdminModeratorService.getActiveOrganizations();
        setActiveOrgs(data || []);
      } else if (activeTab === 'rejected') {
        const data = await AdminModeratorService.getRejectedOrganizations();
        setRejectedOrgs(data || []);
      } else if (activeTab === 'banned') {
        const data = await AdminModeratorService.getBannedOrganizations();
        setBannedOrgs(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast.error(`Failed to load organizations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (organization) => {
    try {
      setActionLoading(organization.orgId);
      const response = await AdminModeratorService.activateOrganization(organization.orgId);

      if (response && typeof response === 'string' && response.includes('success')) {
        toast.success(`${organization.fname} ${organization.lname} has been activated successfully!`);
        fetchAllCounts(); // Refresh all counts
      } else {
        toast.error(response || 'Failed to activate organization');
      }
    } catch (error) {
      console.error('Error activating organization:', error);
      toast.error(`Failed to activate organization: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (organization) => {
    try {
      setActionLoading(organization.orgId);
      const response = await AdminModeratorService.rejectOrganization(organization.orgId);

      if (response && typeof response === 'string' && response.includes('success')) {
        toast.success(`${organization.fname} ${organization.lname} has been rejected.`);
        fetchAllCounts(); // Refresh all counts
      } else {
        toast.error(response || 'Failed to reject organization');
      }
    } catch (error) {
      console.error('Error rejecting organization:', error);
      toast.error(`Failed to reject organization: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (organization) => {
    if (!window.confirm(`Are you sure you want to ban ${organization.fname} ${organization.lname}? This action is serious.`)) {
      return;
    }

    try {
      setActionLoading(organization.orgId);
      const response = await AdminModeratorService.banOrganization(organization.orgId);

      if (response && typeof response === 'string' && response.includes('success')) {
        toast.success(`${organization.fname} ${organization.lname} has been banned.`);
        fetchAllCounts(); // Refresh all counts
      } else {
        toast.error(response || 'Failed to ban organization');
      }
    } catch (error) {
      console.error('Error banning organization:', error);
      toast.error(`Failed to ban organization: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (organization) => {
    setSelectedOrganization(organization);
  };

  const handleCloseReview = () => {
    setSelectedOrganization(null);
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      'nonprofit': 'Non-Profit',
      'government': 'Government',
      'educational': 'Educational',
      'library': 'Library',
      'other': 'Other'
    };
    return typeLabels[type] || type;
  };

  const renderOrganizationCard = (organization, showActivate = false, showReject = false, showBan = false) => {
    const isActionLoading = actionLoading === organization.orgId;

    return (
      <div key={organization.orgId} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {organization.fname} {organization.lname}
              </h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getTypeLabel(organization.type)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Email: {organization.email} • Phone: {organization.phone}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Location: {organization.city}, {organization.state} • Reg No: {organization.regNo}
            </p>
            <p className="text-sm text-gray-500">
              Running Years: {organization.years} • ID: {organization.orgId}
            </p>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={() => handleViewDetails(organization)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
              disabled={isActionLoading}
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </button>

            {showActivate && (
              <button
                onClick={() => handleActivate(organization)}
                disabled={isActionLoading}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Activate
                  </>
                )}
              </button>
            )}

            {showReject && (
              <button
                onClick={() => handleReject(organization)}
                disabled={isActionLoading}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </>
                )}
              </button>
            )}

            {showBan && (
              <button
                onClick={() => handleBan(organization)}
                disabled={isActionLoading}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Ban className="w-3 h-3 mr-1" />
                    Ban
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Organizations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingOrgs.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Organizations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeOrgs.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected Organizations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{rejectedOrgs.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Banned Organizations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{bannedOrgs.length}</p>
            </div>
            <Ban className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Organizations
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Organizations
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected Organizations
            </button>
            <button
              onClick={() => setActiveTab('banned')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'banned'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Banned Organizations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingOrgs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No pending organizations found.</p>
                  <p className="text-gray-400 text-sm">All organization requests have been processed.</p>
                </div>
              ) : (
                pendingOrgs.map((org) => renderOrganizationCard(org, true, true, false))
              )}
            </div>
          )}

          {!loading && activeTab === 'active' && (
            <div className="space-y-4">
              {activeOrgs.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No active organizations found.</p>
                  <p className="text-gray-400 text-sm">Active organizations will appear here.</p>
                </div>
              ) : (
                activeOrgs.map((org) => renderOrganizationCard(org, false, false, true))
              )}
            </div>
          )}

          {!loading && activeTab === 'rejected' && (
            <div className="space-y-4">
              {rejectedOrgs.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No rejected organizations found.</p>
                  <p className="text-gray-400 text-sm">Rejected organizations will appear here.</p>
                </div>
              ) : (
                rejectedOrgs.map((org) => renderOrganizationCard(org, false, false, false))
              )}
            </div>
          )}

          {!loading && activeTab === 'banned' && (
            <div className="space-y-4">
              {bannedOrgs.length === 0 ? (
                <div className="text-center py-12">
                  <Ban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No banned organizations found.</p>
                  <p className="text-gray-400 text-sm">Banned organizations will appear here.</p>
                </div>
              ) : (
                bannedOrgs.map((org) => renderOrganizationCard(org, false, false, false))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedOrganization && (
        <OrganizationReview
          organization={selectedOrganization}
          onClose={handleCloseReview}
        />
      )}
    </div>
  );
};

export default Organizations;
