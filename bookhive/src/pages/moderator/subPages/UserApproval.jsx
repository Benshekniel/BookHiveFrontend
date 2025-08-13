import React, { useState } from 'react';
import { CheckCircle, X, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserApproval = ({ user, onUpdate }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState(null); // null, 'success', 'error'
  const baseUrl = 'http://localhost:9090/api/moderator';

  // Predefined rejection reasons
  const predefinedReasons = [
    'Incomplete profile information',
    'Invalid or unclear ID photos',
    'Suspicious email or account details',
    'Duplicate account detected',
    'Location verification failed',
    'Billing information mismatch'
  ];

  const handleApprove = async () => {
    setIsLoading(true);
    setActionStatus(null);
    try {
      const response = await axios.get(`${baseUrl}/approveUser`, {
        params: {
          email: user.email,
          name: user.fullName
        },
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.message === 'Approved') {
        setActionStatus('success');
        toast.success(
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            User {user.fullName} approved successfully!
          </div>,
          { autoClose: 3000 }
        );
        onUpdate({ ...user, status: 'approved' });
      } else {
        setActionStatus('error');
        toast.error(
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            Failed to approve user: {response.data.message}
          </div>
        );
      }
    } catch (error) {
      setActionStatus('error');
      toast.error(
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          Error approving user: {error.response?.data?.message || error.message}
        </div>
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setActionStatus(null);
      }, 1000); // Reset status after 1s for animation
    }
  };

  const handleReject = async () => {
    if (!rejectReason && !customReason) {
      toast.error(
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          Please select or enter a rejection reason
        </div>
      );
      return;
    }

    const prefix = 'Sorry, your account creation request has been rejected due to: ';
    const finalReason = prefix + (customReason || rejectReason);

    setIsLoading(true);
    setActionStatus(null);
    try {
      const response = await axios.get(`${baseUrl}/rejectUser`, {
        params: {
          email: user.email,
          name: user.fullName,
          reason: finalReason
        },
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.message === 'Rejected') {
        setActionStatus('success');
        toast.success(
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            User {user.fullName} rejected successfully!
          </div>,
          { autoClose: 3000 }
        );
        setShowRejectModal(false);
        setRejectReason('');
        setCustomReason('');
        onUpdate({ ...user, status: 'rejected' });
      } else {
        setActionStatus('error');
        toast.error(
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            Failed to reject user: {response.data.message}
          </div>
        );
      }
    } catch (error) {
      setActionStatus('error');
      toast.error(
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          Error rejecting user: {error.response?.data?.message || error.message}
        </div>
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setActionStatus(null);
      }, 1000); // Reset status after 1s for animation
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className={`px-3 py-1 bg-green-600 text-white rounded text-sm flex items-center transition-all duration-300
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}
          ${actionStatus === 'success' ? 'bg-green-500 animate-pulse' : actionStatus === 'error' ? 'bg-red-500' : ''}`}
        title="Approve User"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        ) : actionStatus === 'success' ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : actionStatus === 'error' ? (
          <AlertCircle className="w-3 h-3 mr-1" />
        ) : (
          <CheckCircle className="w-3 h-3 mr-1" />
        )}
        Approve
      </button>
      <button
        onClick={() => setShowRejectModal(true)}
        disabled={isLoading}
        className={`px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center transition-all duration-300
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}
          ${actionStatus === 'success' ? 'bg-green-500 animate-pulse' : actionStatus === 'error' ? 'bg-red-500' : ''}`}
        title="Reject User"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        ) : actionStatus === 'success' ? (
          <CheckCircle className="w-3 h-3 mr-1" />
        ) : actionStatus === 'error' ? (
          <AlertCircle className="w-3 h-3 mr-1" />
        ) : (
          <X className="w-3 h-3 mr-1" />
        )}
        Reject
      </button>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md mx-2 shadow-2xl transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject User: {user.fullName}</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setCustomReason('');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-2 bg-red-50 p-3 rounded-lg animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-600">
                  Please select a reason for rejection or provide a custom reason.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    setCustomReason('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Select a reason</option>
                  {predefinedReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                  <option value="custom">Custom Reason</option>
                </select>
              </div>
              {rejectReason === 'custom' && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    rows="4"
                    placeholder="Enter your custom reason for rejection"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setCustomReason('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className={`flex-1 bg-red-600 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Confirm Rejection'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserApproval;