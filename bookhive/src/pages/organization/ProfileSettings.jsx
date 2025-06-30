import React, { useState } from 'react';
import { User, Building, Mail, Phone, MapPin, FileText, Camera, Save, Edit } from 'lucide-react';

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: 'Green Valley School',
    registrationNumber: 'REG123456789',
    email: 'admin@greenvalley.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Education Street, Learning City, LC 12345',
    description: 'Green Valley School is a public elementary school serving students from grades K-6 in the Learning City area. We are committed to providing quality education and fostering a love of reading among our students.',
    website: 'https://greenvalley.edu',
    established: '1985',
    studentCount: '250',
    contactPerson: 'Jane Smith',
    contactTitle: 'Principal'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your organization's profile and contact information</p>
        </div>
        
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-heading font-bold">
                GV
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
                {formData.organizationName}
              </h2>
              <p className="text-gray-600">Educational Institution</p>
              <p className="text-sm text-gray-500 mt-1">
                Est. {formData.established} • {formData.studentCount} Students
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Number of Students
              </label>
              <input
                type="text"
                name="studentCount"
                value={formData.studentCount}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors disabled:bg-gray-50"
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
                />
              </div>
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
                <p className="text-sm text-gray-600">Make your organization profile visible to donors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Contact Permissions</h4>
                <p className="text-sm text-gray-600">Allow donors to contact you directly</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-disabled:opacity-50"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-textPrimary">Activity Visibility</h4>
                <p className="text-sm text-gray-600">Show your book requests and received donations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled={!isEditing} />
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
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
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