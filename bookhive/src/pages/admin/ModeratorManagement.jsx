import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Shield, User, Search, X, AlertCircle, CheckCircle } from 'lucide-react';
import AdminModeratorService from '../../services/adminService'; // Import the service

const ModeratorManagement = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Moderators state - now fetched from backend
  const [moderators, setModerators] = useState([]);

  // State for add modal
  const [newModerator, setNewModerator] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    experience: ''
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Load moderators on component mount
  useEffect(() => {
    loadModerators();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  /**
   * Load all moderators from the backend
   */
  const loadModerators = async () => {
    try {
      setLoading(true);
      const response = await AdminModeratorService.getAllModerators();
      console.log('API Response:', response); // Keep this for now

      if (response.success === true) {
        setModerators(response.data || []);
      } else {
        setError('Failed to load moderators');
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search moderators
   */
  const handleSearch = async (searchValue) => {
    if (!searchValue.trim()) {
      loadModerators();
      return;
    }

    try {
      setLoading(true);
      const response = await AdminModeratorService.searchModerators(searchValue);
      if (response.success === true) {
        setModerators(response.data || []);
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter moderators based on search term
   */
  const filteredModerators = moderators.filter(moderator => {
    const matchesSearch = !searchTerm ||
      moderator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moderator.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  /**
   * Validate form fields
   */
  const validateForm = (moderator) => {
    const errors = {};

    if (!moderator.name?.trim()) errors.name = 'Name is required';
    if (!moderator.email?.trim()) errors.email = 'Email is required';
    if (!moderator.password?.trim()) errors.password = 'Password is required';
    if (!moderator.phone?.trim()) errors.phone = 'Phone is required';
    if (!moderator.dob?.trim()) errors.dob = 'Date of birth is required';
    if (!moderator.city?.trim()) errors.city = 'City is required';
    if (!moderator.address?.trim()) errors.address = 'Address is required';
    if (!moderator.experience || moderator.experience < 0) errors.experience = 'Valid experience is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (moderator.email && !emailRegex.test(moderator.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (moderator.phone && !/^\d+$/.test(moderator.phone)) {
      errors.phone = 'Phone should contain only numbers';
    }

    return errors;
  };

  /**
   * Handle moderator add
   */
  const handleModeratorAdd = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm(newModerator);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const moderatorData = {
        name: newModerator.name.trim(),
        email: newModerator.email.trim(),
        password: newModerator.password.trim(),
        phone: parseInt(newModerator.phone, 10),
        dob: newModerator.dob,
        city: newModerator.city.trim(),
        experience: parseInt(newModerator.experience, 10),
        address: newModerator.address.trim()
      };

      const result = await AdminModeratorService.registerModerator(moderatorData);

      if (result.message === "success") {
        setSuccess('Moderator added successfully!');
        setShowAddModal(false);
        setNewModerator({
          name: '',
          email: '',
          password: '',
          phone: '',
          dob: '',
          address: '',
          city: '',
          experience: ''
        });
        setValidationErrors({});
        loadModerators(); // Reload the list
      } else {
        setError(result.message || 'Failed to add moderator');
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle view moderator
   */
  const handleViewModerator = async (moderator) => {
    try {
      setLoading(true);
      const response = await AdminModeratorService.getModeratorById(moderator.id);
      if (response.success === true) {
        setSelectedModerator(response.data);
        setShowViewModal(true);
      } else {
        setError('Failed to load moderator details');
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit moderator
   */
  const handleEditModerator = async (moderator) => {
    try {
      setLoading(true);
      const response = await AdminModeratorService.getModeratorById(moderator.id);
      if (response.success === true) {
        setSelectedModerator(response.data);
        setShowEditModal(true);
      } else {
        setError('Failed to load moderator details');
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle update moderator
   */
  const handleUpdateModerator = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      // Prepare the update data with proper formatting
      const updateData = {
        name: selectedModerator.name?.trim(),
        email: selectedModerator.email?.trim(),
        phone: selectedModerator.phone ? parseInt(selectedModerator.phone, 10) : null,
        dob: selectedModerator.dob,
        city: selectedModerator.city?.trim(),
        experience: selectedModerator.experience ? parseInt(selectedModerator.experience, 10) : null,
        address: selectedModerator.address?.trim()
      };

      // Remove any null/undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === null || updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      const response = await AdminModeratorService.updateModerator(selectedModerator.id, updateData);

      if (response.success === true) {
        setSuccess('Moderator updated successfully!');
        setShowEditModal(false);
        loadModerators(); // Reload the list
      } else {
        setError(response.message || 'Failed to update moderator');
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete moderator
   */
  const handleDeleteModerator = async (id) => {
    if (!window.confirm('Are you sure you want to delete this moderator?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await AdminModeratorService.deleteModerator(id);

      if (response.success === true) {
        setSuccess('Moderator deleted successfully!');
        loadModerators(); // Reload the list
      } else {
        setError(response.message || 'Failed to delete moderator');
      }
    } catch (error) {
      setError(AdminModeratorService.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input changes for new moderator form
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModerator({ ...newModerator, [name]: value });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  /**
   * Handle input changes for edit moderator form
   */
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedModerator({ ...selectedModerator, [name]: value });
  };

  /**
   * Handle search input change with debouncing
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  /**
   * Get status color (for future use when status is available)
   */
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500 text-white',
      inactive: 'bg-slate-200 text-slate-800',
      suspended: 'bg-red-500 text-white'
    };
    return colors[status] || colors.active;
  };

  /**
   * Calculate age from date of birth
   */
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white p-6 min-h-screen">
      {/* Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-slate-900">Moderator Management</h1>
          <p className="mt-2 text-sm text-slate-700">
            Manage moderator accounts, permissions, and monitor their activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Moderator
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white shadow rounded-lg mb-6 border border-slate-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Search Moderators</label>
              <div className="relative group">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      loadModerators();
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moderators Table */}
      <div className="bg-white shadow rounded-lg mb-8 border border-slate-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">Current Moderators</h3>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600">Loading...</span>
            </div>
          )}

          {!loading && (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Moderator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredModerators.map((moderator) => (
                    <tr key={moderator.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{moderator.name}</div>
                            <div className="text-sm text-slate-500">{moderator.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {moderator.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {moderator.city || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {moderator.experience ? `${moderator.experience} years` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {calculateAge(moderator.dob)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewModerator(moderator)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            disabled={loading}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditModerator(moderator)}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteModerator(moderator.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredModerators.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-slate-500">
                        {searchTerm ? 'No moderators found matching your search.' : 'No moderators found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Moderator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowAddModal(false)}></div>

          <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full p-8 z-50 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
              Add New Moderator
            </h3>

            <form onSubmit={handleModeratorAdd}>
              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newModerator.name}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter name"
                    disabled={loading}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newModerator.email}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter email"
                    disabled={loading}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={newModerator.password}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newModerator.phone}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter phone number"
                    disabled={loading}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={newModerator.dob}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.dob ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    disabled={loading}
                  />
                  {validationErrors.dob && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.dob}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={newModerator.address}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.address ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter address"
                    disabled={loading}
                  />
                  {validationErrors.address && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={newModerator.city}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.city ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter city"
                    disabled={loading}
                  />
                  {validationErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.city}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Experience (years) *</label>
                  <input
                    type="number"
                    name="experience"
                    value={newModerator.experience}
                    onChange={handleInputChange}
                    min="0"
                    className={`mt-1 w-full rounded-md border shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm p-2 ${validationErrors.experience ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    placeholder="Enter years of experience"
                    disabled={loading}
                  />
                  {validationErrors.experience && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.experience}</p>
                  )}
                </div>
              </div>

              {/* Form buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  disabled={loading}
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  Add Moderator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Moderator Modal */}
      {showViewModal && selectedModerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/30" onClick={() => setShowViewModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Moderator Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Name</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.dob || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Age</label>
                  <p className="mt-1 text-sm text-slate-900">{calculateAge(selectedModerator.dob)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Address</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">City</label>
                  <p className="mt-1 text-sm text-slate-900">{selectedModerator.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Experience</label>
                  <p className="mt-1 text-sm text-slate-900">
                    {selectedModerator.experience ? `${selectedModerator.experience} years` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Moderator Modal */}
      {showEditModal && selectedModerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/30" onClick={() => setShowEditModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Edit Moderator</h3>
              <form onSubmit={handleUpdateModerator}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedModerator.name || ''}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedModerator.email || ''}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={selectedModerator.phone || ''}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={selectedModerator.dob || ''}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={selectedModerator.address || ''}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={selectedModerator.city || ''}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={selectedModerator.experience || ''}
                      onChange={handleEditInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    disabled={loading}
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorManagement;