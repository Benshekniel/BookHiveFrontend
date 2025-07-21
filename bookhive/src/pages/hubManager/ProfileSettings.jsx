import React, { useState, useEffect } from 'react';
import { User, Building, Mail, Phone, MapPin, FileText, Camera, Save, Edit, RefreshCw } from 'lucide-react';
import { hubApi } from '../../services/HubmanagerService';

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId] = useState(1); // This should come from auth context
  const [hubId] = useState(1); // This should come from auth context or user data

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
    city: '',
    zipCode: '',
    // Profile settings
    profileVisibility: {
      publicProfile: true,
      contactPermissions: true,
      activityVisibility: true
    }
  });

  // Fetch profile data from backend
  useEffect(() => {
    fetchProfileData();
  }, [hubId, userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hub data as organization profile
      const hubData = await hubApi.getHubById(hubId);
      
      // Transform backend data to match frontend structure
      setFormData(prevData => ({
        ...prevData,
        organizationName: hubData.name || 'Hub Organization',
        registrationNumber: hubData.registrationNumber || `HUB${hubId}${new Date().getFullYear()}`,
        email: hubData.email || '',
        phone: hubData.phoneNumber || '',
        address: hubData.address || '',
        city: hubData.city || '',
        zipCode: hubData.zipCode || '',
        description: hubData.description || `${hubData.name || 'Our hub'} is a delivery hub serving the local community with efficient and reliable delivery services. We are committed to providing excellent service and fostering strong relationships with our customers and delivery partners.`,
        website: hubData.website || 'https://hubmanager.com',
        established: hubData.establishedYear || '2020',
        studentCount: hubData.maxCapacity?.toString() || '250',
        contactPerson: hubData.managerName || 'Hub Manager',
        contactTitle: hubData.managerTitle || 'Operations Manager',
        profileVisibility: {
          publicProfile: hubData.isPublic !== false,
          contactPermissions: hubData.allowDirectContact !== false,
          activityVisibility: hubData.showActivity !== false
        }
      }));

    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success message when user makes changes
    if (success) setSuccess(false);
  };

  const handleVisibilityChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      profileVisibility: {
        ...prev.profileVisibility,
        [setting]: value
      }
    }));
    
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Prepare data for backend
      const updateData = {
        name: formData.organizationName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        description: formData.description,
        website: formData.website,
        establishedYear: formData.established,
        maxCapacity: parseInt(formData.studentCount) || 250,
        managerName: formData.contactPerson,
        managerTitle: formData.contactTitle,
        registrationNumber: formData.registrationNumber,
        isPublic: formData.profileVisibility.publicProfile,
        allowDirectContact: formData.profileVisibility.contactPermissions,
        showActivity: formData.profileVisibility.activityVisibility
      };

      await hubApi.updateHub(hubId, updateData);
      
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    // Refresh data to reset any unsaved changes
    fetchProfileData();
  };

  const refreshData = async () => {
    await fetchProfileData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your organization's profile and contact information</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={refreshData}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
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

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">Profile updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-heading font-bold">
                {formData.organizationName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() || 'HM'}
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-secondary text-primary p-2 rounded-full hover:bg-secondary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-textPrimary">
                {formData.organizationName || 'Hub Organization'}
              </h2>
              <p className="text-gray-600">Delivery Hub</p>
              <p className="text-sm text-gray-500 mt-1">
                Est. {formData.established} • Capacity: {formData.studentCount}
              </p>
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
                Organization Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                  placeholder="Enter organization name"
                />
              </div>
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
                Established Year
              </label>
              <input
                type="text"
                name="established"
                value={formData.established}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                placeholder="Enter established year"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Hub Capacity
              </label>
              <input
                type="number"
                name="studentCount"
                value={formData.studentCount}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                placeholder="Enter hub capacity"
              />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
              placeholder="Enter organization description"
            />
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                  placeholder="Enter phone number"
                />
              </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                placeholder="Enter website URL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Contact Person
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                  placeholder="Enter contact person name"
                />
              </div>
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
                placeholder="Enter contact person title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                placeholder="Enter city"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
                placeholder="Enter full address"
              />
            </div>
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
                <p className="text-sm text-gray-600">Make your organization profile visible to partners</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.profileVisibility.publicProfile}
                  onChange={(e) => handleVisibilityChange('publicProfile', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Contact Permissions</h4>
                <p className="text-sm text-gray-600">Allow partners to contact you directly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.profileVisibility.contactPermissions}
                  onChange={(e) => handleVisibilityChange('contactPermissions', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Activity Visibility</h4>
                <p className="text-sm text-gray-600">Show your delivery activities and performance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.profileVisibility.activityVisibility}
                  onChange={(e) => handleVisibilityChange('activityVisibility', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Account Security
          </h3>
          
          <div className="space-y-4">
            <div>
              <button
                type="button"
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Change Password
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Last changed 3 months ago
              </p>
            </div>
            
            <div>
              <button
                type="button"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Enable Two-Factor Authentication
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;