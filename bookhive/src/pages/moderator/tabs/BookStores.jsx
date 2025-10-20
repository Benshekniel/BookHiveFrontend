import React, { useState, useEffect } from 'react';
import { Store, CheckCircle, XCircle, Eye, Ban } from 'lucide-react';
import { bookStoreApi } from '../../../services/moderatorService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookStoreReview from '../subPages/BookStoreReview';

const BookStores = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingBookStores, setPendingBookStores] = useState([]);
  const [approvedBookStores, setApprovedBookStores] = useState([]);
  const [rejectedBookStores, setRejectedBookStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookStore, setSelectedBookStore] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all counts on initial load
  useEffect(() => {
    fetchAllCounts();
  }, []);

  // Fetch bookstores based on active tab
  useEffect(() => {
    fetchBookStores();
  }, [activeTab]);

  const fetchAllCounts = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        bookStoreApi.getPendingBookStores(false),
        bookStoreApi.getApprovedBookStores(false),
        bookStoreApi.getRejectedBookStores(false)
      ]);

      setPendingBookStores(pending || []);
      setApprovedBookStores(approved || []);
      setRejectedBookStores(rejected || []);
    } catch (error) {
      console.error('Failed to fetch bookstore counts:', error);
    }
  };

  const fetchBookStores = async () => {
    try {
      setLoading(true);

      if (activeTab === 'pending') {
        const data = await bookStoreApi.getPendingBookStores(false);
        setPendingBookStores(data || []);
      } else if (activeTab === 'approved') {
        const data = await bookStoreApi.getApprovedBookStores(false);
        setApprovedBookStores(data || []);
      } else if (activeTab === 'rejected') {
        const data = await bookStoreApi.getRejectedBookStores(false);
        setRejectedBookStores(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookstores:', error);
      toast.error(`Failed to load bookstores: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookstore) => {
    try {
      setActionLoading(bookstore.user_id);
      const response = await bookStoreApi.approveBookStore(bookstore.user_id);

      if (response.message === 'success') {
        toast.success(`${bookstore.storeName} has been approved successfully!`);
        fetchAllCounts(); // Refresh all counts
      } else {
        toast.error(response.message || 'Failed to approve bookstore');
      }
    } catch (error) {
      console.error('Error approving bookstore:', error);
      toast.error(`Failed to approve bookstore: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookstore) => {
    try {
      setActionLoading(bookstore.user_id);
      const response = await bookStoreApi.rejectBookStore(bookstore.user_id);

      if (response.message === 'success') {
        toast.success(`${bookstore.storeName} has been rejected.`);
        fetchAllCounts(); // Refresh all counts
      } else {
        toast.error(response.message || 'Failed to reject bookstore');
      }
    } catch (error) {
      console.error('Error rejecting bookstore:', error);
      toast.error(`Failed to reject bookstore: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (bookstore) => {
    if (!window.confirm(`Are you sure you want to ban ${bookstore.storeName}? This action can be serious.`)) {
      return;
    }

    try {
      setActionLoading(bookstore.user_id);
      const response = await bookStoreApi.banBookStore(bookstore.user_id);

      if (response.message === 'success') {
        toast.success(`${bookstore.storeName} has been banned.`);
        fetchAllCounts(); // Refresh all counts
      } else {
        toast.error(response.message || 'Failed to ban bookstore');
      }
    } catch (error) {
      console.error('Error banning bookstore:', error);
      toast.error(`Failed to ban bookstore: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (bookstore) => {
    setSelectedBookStore(bookstore);
  };

  const handleCloseReview = () => {
    setSelectedBookStore(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'BANNED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBookStoreCard = (bookstore, showApprove = false, showReject = false, showBan = false) => {
    const isActionLoading = actionLoading === bookstore.user_id;

    return (
      <div key={bookstore.storeId} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Store className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{bookstore.storeName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bookstore.isApproved)}`}>
                {bookstore.isApproved || 'PENDING'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Owner: {bookstore.fname} {bookstore.lname} • Email: {bookstore.email} • Phone: {bookstore.phoneNumber}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Location: {bookstore.city}, {bookstore.district} • Reg No: {bookstore.businessRegistrationNumber}
            </p>
            <p className="text-sm text-gray-500">
              Registered: {formatDate(bookstore.createdAt)} • Established: {bookstore.esblishedYears}
            </p>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={() => handleViewDetails(bookstore)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
              disabled={isActionLoading}
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </button>

            {showApprove && (
              <button
                onClick={() => handleApprove(bookstore)}
                disabled={isActionLoading}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </>
                )}
              </button>
            )}

            {showReject && (
              <button
                onClick={() => handleReject(bookstore)}
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
                onClick={() => handleBan(bookstore)}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending BookStores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingBookStores.length}</p>
            </div>
            <Store className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved BookStores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{approvedBookStores.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected BookStores</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{rejectedBookStores.length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
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
              Pending BookStores
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved BookStores
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rejected BookStores
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
              {pendingBookStores.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No pending bookstores found.</p>
                  <p className="text-gray-400 text-sm">All bookstore registrations have been processed.</p>
                </div>
              ) : (
                pendingBookStores.map((bookstore) =>
                  renderBookStoreCard(bookstore, true, true, false)
                )
              )}
            </div>
          )}

          {!loading && activeTab === 'approved' && (
            <div className="space-y-4">
              {approvedBookStores.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No approved bookstores found.</p>
                  <p className="text-gray-400 text-sm">Approved bookstores will appear here.</p>
                </div>
              ) : (
                approvedBookStores.map((bookstore) =>
                  renderBookStoreCard(bookstore, false, false, true)
                )
              )}
            </div>
          )}

          {!loading && activeTab === 'rejected' && (
            <div className="space-y-4">
              {rejectedBookStores.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No rejected bookstores found.</p>
                  <p className="text-gray-400 text-sm">Rejected bookstores will appear here.</p>
                </div>
              ) : (
                rejectedBookStores.map((bookstore) =>
                  renderBookStoreCard(bookstore, false, false, false)
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedBookStore && (
        <BookStoreReview
          bookstore={selectedBookStore}
          onClose={handleCloseReview}
        />
      )}
    </div>
  );
};

export default BookStores;
