import React, { useState, useEffect } from 'react';
import { Shield, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserReview from './UserReview'; // Adjust path if necessary

const UserManagement = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [violationUser, setViolationUser] = useState(null);
  const [violationReason, setViolationReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [violationStatus, setViolationStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedReasons = [
    'Inappropriate Behavior',
    'Policy Violation',
    'Fraudulent Activity',
    'Other'
  ];

  const statusOptions = ['Banned', 'Disabled'];

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/moderator/getActiveUsers', {
          headers: { 'Content-Type': 'application/json' },
        });
        setActiveUsers(
          response.data.map((user, index) => ({
            id: `USR-${1001 + index}`,
            username: user.email ? user.email.split('@')[0] : `user${index}`,
            fullName: `${user.fname || ''} ${user.lname || ''}`.trim() || user.name || 'Unknown',
            email: user.email || '',
            joinDate: user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString(),
            status: user.status || 'unknown',
            location: [user.city, user.state, user.zip].filter(Boolean).join(', ') || 'Unknown',
            phone: user.phone || 'N/A',
            dob: user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A',
            gender: user.gender || 'N/A',
            address: user.address || 'N/A',
            city: user.city || 'N/A',
            state: user.state || 'N/A',
            zip: user.zip || 'N/A',
            idType: user.idType || 'N/A',
            idFront: user.idFront || 'N/A',
            idBack: user.idBack || 'N/A',
            billImage: user.billImage || 'N/A',
            role: user.role || 'N/A',
            name: user.name || 'N/A',
            fname: user.fname || 'N/A',
            lname: user.lname || 'N/A'
          }))
        );
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch active users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveUsers();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleOpenViolationModal = (user) => {
    setViolationUser(user);
    setViolationReason('');
    setCustomReason('');
    setViolationStatus('');
    setIsViolationModalOpen(true);
  };

  const handleCloseViolationModal = () => {
    setIsViolationModalOpen(false);
    setViolationUser(null);
    setViolationReason('');
    setCustomReason('');
    setViolationStatus('');
  };

  const handleApplyViolation = async (e) => {
    e.preventDefault();
    if (!violationUser || !violationReason || !violationStatus) {
      toast.error('Please select a reason and status.');
      return;
    }
    if (violationReason === 'Other' && !customReason.trim()) {
      toast.error('Please enter a custom reason.');
      return;
    }

    const reason = violationReason === 'Other' ? customReason : violationReason;
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:9090/api/moderator/applyViolation', null, {
        params: {
          email: violationUser.email,
          reason,
          status: violationStatus.toLowerCase()
        },
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          {response.data}
        </div>,
        { autoClose: 3000 }
      );
      handleCloseViolationModal();
    } catch (err) {
      toast.error(`Error applying violation: ${err.response?.data || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <p className="text-gray-600 flex items-center justify-center"><span className="animate-spin mr-2">⏳</span>Loading active users...</p>}
      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">Error: {error}</p>}
      {!loading && !error && activeUsers.length === 0 && (
        <p className="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">No active users found.</p>
      )}
      {!loading &&
        activeUsers.map((user) => (
          <div key={user.id} className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
                  <span className="text-gray-600 text-sm">@{user.username}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Email: {user.email} • Location: {user.location} • Member Since: {user.joinDate}
                </p>
              </div>
              <div className="flex space-x-3 ml-6">
                <button 
                  onClick={() => handleViewDetails(user)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                  Adjust Trust Score
                </button>
                <button 
                  onClick={() => handleOpenViolationModal(user)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors flex items-center shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Apply Violation
                </button>
              </div>
            </div>
          </div>
        ))}
      {selectedUser && (
        <UserReview user={selectedUser} onClose={handleCloseDetails} />
      )}
      {isViolationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Violation for {violationUser?.fullName}</h3>
            <form onSubmit={handleApplyViolation}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Reason</label>
                <select
                  value={violationReason}
                  onChange={(e) => setViolationReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a reason</option>
                  {predefinedReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              {violationReason === 'Other' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Reason</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Status</label>
                <select
                  value={violationStatus}
                  onChange={(e) => setViolationStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseViolationModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Apply Violation
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;