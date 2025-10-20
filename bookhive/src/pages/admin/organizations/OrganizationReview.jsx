import React from 'react';
import { X, Building2, MapPin, Calendar, FileText, Phone, Mail, Hash } from 'lucide-react';

const OrganizationReview = ({ organization, onClose }) => {
  if (!organization) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'banned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      'nonprofit': 'Non-Profit',
      'government': 'Government',
      'educational': 'Educational Institution',
      'library': 'Library',
      'other': 'Other'
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Organization Name and Type */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {organization.fname} {organization.lname}
                </h3>
                <p className="text-gray-600 flex items-center mb-2">
                  <Hash className="w-4 h-4 mr-2" />
                  Organization ID: {organization.orgId}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Type: {getTypeLabel(organization.type)}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize`}>
                {organization.status || 'N/A'}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">{organization.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-base font-medium text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-green-600" />
                  {organization.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Registration Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="text-base font-medium text-gray-900">{organization.regNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Running Years</p>
                <p className="text-base font-medium text-gray-900">{organization.years} years</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-2">Registration Document</p>
                {organization.imageFileName ? (
                  <a
                    href={`http://localhost:9090/uploads/${organization.imageFileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Registration Copy
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">No document uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-base font-medium text-gray-900">{organization.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-base font-medium text-gray-900">{organization.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="text-base font-medium text-gray-900">{organization.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Postal Code</p>
                <p className="text-base font-medium text-gray-900">{organization.zip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationReview;
