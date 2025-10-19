import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter, Eye, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';


const API_BASE_URL = 'http://localhost:9090/api';

const BookRequest = () => {
  const { user } = useAuth();

  // Check if user is authenticated
  if (!user) {
    return <p>Please log in.</p>;
  }

  const orgId = user.userId; // Use user.userId as orgId

  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    quantity: '',
    urgency: 'medium',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Subject options
  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'History',
    'Geography',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'Arts',
    'Other',
  ];

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

  // Create book request
  const createBookRequest = async (requestData) => {
    try {
      const data = await apiCall('/book-requests', {
        method: 'POST',
        body: requestData,
      });
      return data;
    } catch (error) {
      console.error('Failed to create book request:', error);
      throw error;
    }
  };

  // Get book requests by organization
  const getBookRequestsByOrganization = async (orgId) => {
    try {
      const data = await apiCall(`/book-requests/organization/${orgId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch book requests:', error);
      throw error;
    }
  };

  // Update book request
  const updateBookRequest = async (requestId, updateData) => {
    try {
      const data = await apiCall(`/book-requests/${requestId}`, {
        method: 'PUT',
        body: updateData,
      });
      return data;
    } catch (error) {
      console.error('Failed to update book request:', error);
      throw error;
    }
  };

  // Cancel book request
  const cancelBookRequest = async (requestId) => {
    try {
      const data = await apiCall(`/book-requests/${requestId}`, {
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      console.error('Failed to cancel book request:', error);
      throw error;
    }
  };

  // Get book request by ID
  const getBookRequestById = async (requestId) => {
    try {
      const data = await apiCall(`/book-requests/${requestId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch book request:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadRequests();
  }, [orgId]); // Added orgId to dependency array

  const loadRequests = async () => {
    if (!orgId) {
      setError('Organization ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getBookRequestsByOrganization(orgId); // Use orgId
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load book requests');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      subject: '',
      quantity: '',
      urgency: 'medium',
      description: '',
    });
    setEditingRequest(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        organizationId: orgId, // Use orgId
        quantity: Number(form.quantity),
        urgency: form.urgency,
      };

      if (editingRequest) {
        await updateBookRequest(editingRequest.id, payload);
        setSuccess('Request updated successfully!');
      } else {
        await createBookRequest(payload);
        setSuccess('Request submitted successfully!');
      }

      await loadRequests();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(editingRequest ? 'Failed to update request' : 'Failed to submit request');
      console.error('Form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (request) => {
    setForm({
      title: request.title || '',
      subject: request.subject || '',
      quantity: request.quantity?.toString() || '',
      urgency: request.urgency || 'medium',
      description: request.description || '',
    });
    setEditingRequest(request);
    setShowForm(true);
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;

    setLoading(true);
    try {
      await cancelBookRequest(requestId);
      setSuccess('Request cancelled successfully!');
      await loadRequests();
    } catch (err) {
      setError('Failed to cancel request');
      console.error('Cancel error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (requestId) => {
    try {
      const requestDetails = await getBookRequestById(requestId);
      console.log('Request details:', requestDetails);
      // You can implement a modal or navigation to show details
      // For now, just logging to console
    } catch (err) {
      setError('Failed to load request details');
      console.error('View details error:', err);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesFilter = filter === 'all' || request.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-secondary/10 text-primary';
      case 'delivered':
        return 'bg-accent/10 text-accent';
      case 'rejected':
        return 'bg-error/10 text-error';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-error/10 text-error';
      case 'medium':
        return 'bg-secondary/10 text-primary';
      case 'low':
        return 'bg-success/10 text-success';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading && !submitting) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading book requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Book Requests</h1>
          <p className="text-gray-600 mt-2">Manage your book requests and track their status</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Request</span>
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
        <div className="bg-red-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            {editingRequest ? 'Edit Book Request' : 'Create New Book Request'}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Book Title/Subject *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="Mathematics Grade 10 Textbooks"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Subject Category *</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                  disabled={submitting}
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Quantity Needed *</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="25"
                  required
                  min="1"
                  max="1000"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Urgency Level *</label>
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  required
                  disabled={submitting}
                >
                  <option value="high">High - Urgent</option>
                  <option value="medium">Medium - Moderate</option>
                  <option value="low">Low - Can Wait</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Description of Need *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                placeholder="Please describe why you need these books, who will benefit, and any specific requirements..."
                required
                disabled={submitting}
              ></textarea>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : editingRequest ? 'Update Request' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              >
                <option value="all">All Requests ({requests.length})</option>
                <option value="pending">Pending ({requests.filter((r) => r.status?.toLowerCase() === 'pending').length})</option>
                <option value="approved">Approved ({requests.filter((r) => r.status?.toLowerCase() === 'approved').length})</option>
                <option value="delivered">Delivered ({requests.filter((r) => r.status?.toLowerCase() === 'delivered').length})</option>
                <option value="rejected">Rejected ({requests.filter((r) => r.status?.toLowerCase() === 'rejected').length})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-secondary/10 rounded-lg flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-heading font-semibold text-textPrimary">{request.title || 'Untitled Request'}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Unknown'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency?.charAt(0).toUpperCase() + request.urgency?.slice(1) || 'Medium'} Priority
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{request.description || 'No description provided'}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>Subject: {request.subject || 'Not specified'}</span>
                          <span>Quantity: {request.quantity || 0} books</span>
                          <span>Requested: {formatDate(request.dateRequested || request.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {(request.status?.toLowerCase() === 'pending' || request.status?.toLowerCase() === 'draft') && (
                  <button
                    onClick={() => handleEdit(request)}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                    title="Edit request"
                    disabled={submitting}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(request.id)}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                  title="View details"
                  disabled={submitting}
                >
                  <Eye className="h-5 w-5" />
                </button>
                {(request.status?.toLowerCase() === 'pending' || request.status?.toLowerCase() === 'draft') && (
                  <button
                    onClick={() => handleCancel(request.id)}
                    className="p-2 text-gray-600 hover:text-error transition-colors"
                    title="Cancel request"
                    disabled={submitting}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? `No requests match "${searchTerm}"`
              : filter === 'all'
              ? "You haven't made any book requests yet."
              : `No ${filter} requests found.`}
          </p>
          {!searchTerm && filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create your first request
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookRequest;