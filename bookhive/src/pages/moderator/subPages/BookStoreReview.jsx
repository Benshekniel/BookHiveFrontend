import React from 'react';
import { X, Store, MapPin, Calendar, FileText, Phone, Mail, Building2 } from 'lucide-react';

const BookStoreReview = ({ bookstore, onClose }) => {
  if (!bookstore) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <Store className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">BookStore Details</h2>
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
          {/* Store Name and Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{bookstore.storeName}</h3>
                <p className="text-gray-600 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Reg: {bookstore.businessRegistrationNumber}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(bookstore.isApproved)}`}>
                {bookstore.isApproved || 'PENDING'}
              </span>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Owner Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-900">{bookstore.fname} {bookstore.lname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">{bookstore.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-base font-medium text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-green-600" />
                  {bookstore.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-base font-medium text-gray-900">{bookstore.user_id}</p>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Store className="w-5 h-5 mr-2 text-blue-600" />
              Store Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Store ID</p>
                <p className="text-base font-medium text-gray-900">{bookstore.storeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Established Year</p>
                <p className="text-base font-medium text-gray-900">{bookstore.esblishedYears}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-base font-medium text-gray-900">
                  {bookstore.description || 'No description provided'}
                </p>
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
                <p className="text-base font-medium text-gray-900">{bookstore.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-base font-medium text-gray-900">{bookstore.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="text-base font-medium text-gray-900">{bookstore.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Postal Code</p>
                <p className="text-base font-medium text-gray-900">{bookstore.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Registration Documents */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Registration Documents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Business Registration Copy</p>
                {bookstore.registryImage ? (
                  <a
                    href={`http://localhost:9090/uploads/${bookstore.registryImage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Document
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">No document uploaded</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Store Image</p>
                {bookstore.storeImageName ? (
                  <a
                    href={`http://localhost:9090/uploads/${bookstore.storeImageName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Image
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">No image uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Registration Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Timeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="text-base font-medium text-gray-900">{formatDate(bookstore.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-medium text-gray-900">{formatDate(bookstore.updatedAt) || 'Never updated'}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(bookstore.businessHours || bookstore.booksType) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookstore.businessHours && (
                  <div>
                    <p className="text-sm text-gray-500">Business Hours</p>
                    <p className="text-base font-medium text-gray-900">{bookstore.businessHours}</p>
                  </div>
                )}
                {bookstore.booksType && (
                  <div>
                    <p className="text-sm text-gray-500">Books Type</p>
                    <p className="text-base font-medium text-gray-900">{bookstore.booksType}</p>
                  </div>
                )}
              </div>
            </div>
          )}
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

export default BookStoreReview;
