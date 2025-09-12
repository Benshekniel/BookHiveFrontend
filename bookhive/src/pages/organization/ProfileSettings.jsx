import React, { useState, useEffect } from 'react';
import { organizationService } from '../../services/organizationService';
import { 
  User, Building, Mail, Phone, MapPin, FileText, Camera, Save, Edit, 
  AlertCircle, CheckCircle, RefreshCw, Eye, EyeOff, Shield, Lock 
} from 'lucide-react';

const ORG_ID = 1; // TODO: Replace with real orgId from context or props

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    website: '',
    established: '',
    studentCount: '',
    contactPerson: '',
    contactTitle: '',
    organizationType: 'school',
    publicProfile: true,
    contactPermissions: true,
    activityVisibility: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await organizationService.getProfile(ORG_ID);
      const profileData = {
        organizationName: data.organizationName || '',
        registrationNumber: data.registrationNumber || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        description: data.description || '',
        website: data.website || '',
        established: data.established || '',
        studentCount: data.studentCount || '',
        contactPerson: data.contactPerson || '',
        contactTitle: data.contactTitle || '',
        organizationType: data.organizationType || 'school',
        publicProfile: data.publicProfile !== false,
        contactPermissions: data.contactPermissions !== false,
        activityVisibility: data.activityVisibility !== false
      };
      setFormData(profileData);
      setOriginalData(profileData);
      if (data.profileImage) {
        setImagePreview(data.profileImage);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.organizationName.trim()) {
      errors.organizationName = 'Organization name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Website must start with http:// or https://';
    }

    if (formData.studentCount && isNaN(Number(formData.studentCount))) {
      errors.studentCount = 'Student count must be a number';
    }

    if (formData.established && (isNaN(Number(formData.established)) || Number(formData.established) < 1800 || Number(formData.established) > new Date().getFullYear())) {
      errors.established = 'Please enter a valid year';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = { ...formData };
      
      // Handle image upload if there's a new image
      if (profileImage) {
        // In a real app, you'd upload the image to a file storage service
        // For now, we'll just include it in the form data
        submitData.profileImage = imagePreview;
      }

      await organizationService.updateProfile(ORG_ID, submitData);
      setOriginalData(formData);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setValidationErrors({});
    setProfileImage(null);
    setImagePreview(originalData.profileImage || null);
    setIsEditing(false);
    setError(null);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your organization's profile and contact information</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadProfile}
            disabled={loading || saving}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Organization"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-heading font-bold">
                  {getInitials(formData.organizationName || 'Organization')}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-secondary text-primary p-2 rounded-full hover:bg-secondary/90 transition-colors cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-textPrimary">
                {formData.organizationName || 'Organization Name'}
              </h2>
              <p className="text-gray-600 capitalize">{formData.organizationType.replace('_', ' ')}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                {formData.established && <span>Est. {formData.established}</span>}
                {formData.studentCount && <span>• {formData.studentCount} Students</span>}
                {formData.registrationNumber && <span>• Reg: {formData.registrationNumber}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Organization Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Organization Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Organization Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                    validationErrors.organizationName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
              </div>
              {validationErrors.organizationName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.organizationName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Registration Number
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                  placeholder="Enter registration number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Organization Type
              </label>
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
              >
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="library">Library</option>
                <option value="nonprofit">Non-Profit Organization</option>
                <option value="community_center">Community Center</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Established Year
              </label>
              <input
                type="number"
                name="established"
                value={formData.established}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="1800"
                max={new Date().getFullYear()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                  validationErrors.established ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 1985"
              />
              {validationErrors.established && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.established}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Number of Students
              </label>
              <input
                type="number"
                name="studentCount"
                value={formData.studentCount}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                  validationErrors.studentCount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 500"
              />
              {validationErrors.studentCount && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.studentCount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                  validationErrors.website ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://www.example.com"
              />
              {validationErrors.website && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.website}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Organization Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="4"
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
              placeholder="Describe your organization, its mission, and the community it serves..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="organization@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                    validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Contact Person *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                    validationErrors.contactPerson ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors.contactPerson && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.contactPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Contact Title
              </label>
              <input
                type="text"
                name="contactTitle"
                value={formData.contactTitle}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                placeholder="Principal, Director, etc."
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50 ${
                  validationErrors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter complete address including city, state, and postal code"
              />
            </div>
            {validationErrors.address && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Privacy Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Public Profile</h4>
                <p className="text-sm text-gray-600">Make your organization profile visible to donors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="publicProfile"
                  checked={formData.publicProfile}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Contact Permissions</h4>
                <p className="text-sm text-gray-600">Allow donors to contact you directly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="contactPermissions"
                  checked={formData.contactPermissions}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Activity Visibility</h4>
                <p className="text-sm text-gray-600">Show your book requests and received donations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="activityVisibility"
                  checked={formData.activityVisibility}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                  disabled={!isEditing} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-heading font-semibold text-textPrimary mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Account Security</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-textPrimary">Password</h4>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                </div>
              </div>
              <button
                type="button"
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Change Password
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-textPrimary">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
              </div>
              <button
                type="button"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600">
              * Required fields must be filled out
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || Object.keys(validationErrors).length > 0}
                className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;