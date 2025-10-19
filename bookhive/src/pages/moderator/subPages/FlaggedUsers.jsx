import React, { useState, useEffect } from 'react';
import { Shield, Eye, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserReview from './UserReview'; // Adjust path if necessary

const FlaggedUsers = () => {
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeUser, setRevokeUser] = useState(null);
  const [violationReason, setViolationReason] = useState('');
  const [isFetchingReason, setIsFetchingReason] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    const fetchFlaggedUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/moderator/getFlaggedUsers', {
          headers: { 'Content-Type': 'application/json' },
        });
        setFlaggedUsers(
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
        toast.error(`Failed to fetch flagged users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchFlaggedUsers();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'banned': return 'bg-red-600 text-white';
      case 'disabled': return 'bg-orange-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleOpenRevokeModal = async (user) => {
    setRevokeUser(user);
    setIsRevokeModalOpen(true);
    setIsFetchingReason(true);
    try {
      const response = await axios.get('http://localhost:9090/api/moderator/getViolationReason', {
        params: { email: user.email },
        headers: { 'Content-Type': 'application/json' },
      });
      setViolationReason(response.data.reason || response.data.message || 'No reason provided');
    } catch (err) {
      setViolationReason('Error fetching violation reason');
      toast.error(`Error fetching violation reason: ${err.response?.data?.details || err.message}`);
    } finally {
      setIsFetchingReason(false);
    }
  };

  const handleCloseRevokeModal = () => {
    setIsRevokeModalOpen(false);
    setRevokeUser(null);
    setViolationReason('');
  };

  const handleRevokeViolation = async () => {
    if (!revokeUser) {
      toast.error('No user selected for revocation.');
      return;
    }

    setIsRevoking(true);
    try {
      const response = await axios.delete('http://localhost:9090/api/moderator/removeViolation', {
        params: { email: revokeUser.email },
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          {response.data}
        </div>,
        { autoClose: 3000 }
      );
      // Remove user from flaggedUsers list since status is now active
      setFlaggedUsers((prev) => prev.filter((user) => user.email !== revokeUser.email));
      handleCloseRevokeModal();
    } catch (err) {
      toast.error(`Error revoking violation: ${err.response?.data || err.message}`);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <p className="text-gray-600 flex items-center justify-center"><span className="animate-spin mr-2">⏳</span>Loading flagged users...</p>}
      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">Error: {error}</p>}
      {!loading && !error && flaggedUsers.length === 0 && (
        <p className="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">No flagged users found.</p>
      )}
      {!loading &&
        flaggedUsers.map((user) => (
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
                {/* <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                  Adjust Trust Score
                </button> */}
                <button 
                  onClick={() => handleOpenRevokeModal(user)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors flex items-center shadow-sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Revoke Violation
                </button>
              </div>
            </div>
          </div>
        ))}
      {selectedUser && (
        <UserReview user={selectedUser} onClose={handleCloseDetails} />
      )}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revoke Violation for {revokeUser?.fullName}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Violation Reason</label>
              {isFetchingReason ? (
                <p className="text-gray-600 flex items-center">
                  <span className="animate-spin mr-2">⏳</span> Fetching reason...
                </p>
              ) : (
                <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded-md">{violationReason}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseRevokeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeViolation}
                disabled={isRevoking}
                className={`px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors flex items-center ${isRevoking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRevoking ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span> Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Confirm Revoke
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedUsers;
