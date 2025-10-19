import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, FileText, Image, AlertCircle } from 'lucide-react';
import axios from 'axios';

const UserReview = ({ user, onClose }) => {
  if (!user) return null;

  const baseUrl = 'http://localhost:9090';
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [imageStatus, setImageStatus] = useState({
    idFront: user.idFront ? { status: 'loading', url: null, error: null } : { status: 'missing', url: null, error: null },
    idBack: user.idBack ? { status: 'loading', url: null, error: null } : { status: 'missing', url: null, error: null },
    billImage: user.billImage ? { status: 'loading', url: null, error: null } : { status: 'missing', url: null, error: null },
  });

  useEffect(() => {
    const fetchFileBase64 = async () => {
      const files = [
        { key: 'idFront', fileName: user.idFront, folderName: 'idFront' },
        { key: 'idBack', fileName: user.idBack, folderName: 'idBack' },
        { key: 'billImage', fileName: user.billImage, folderName: 'billImage' },
      ];

      for (const { key, fileName, folderName } of files) {
        if (fileName) {
          console.log(`Fetching base64 for ${key}: fileName=${fileName}, folderName=${folderName}`);
          try {
            const response = await axios.get(`${baseUrl}/getFileAsBase64`, {
              params: { fileName, folderName },
            });
            console.log(`Response for ${key}:`, response.data.substring(0, 50) + '...'); // Log partial base64 for brevity
            setImageStatus((prev) => ({
              ...prev,
              [key]: { status: 'loaded', url: response.data, error: null },
            }));
          } catch (error) {
            console.error(`Error fetching base64 for ${key}:`, error.response?.data || error.message);
            setImageStatus((prev) => ({
              ...prev,
              [key]: { status: 'not_found', url: null, error: error.response?.data || error.message },
            }));
          }
        } else {
          console.log(`No fileName for ${key}, marking as missing`);
        }
      }
    };

    fetchFileBase64();
  }, [user.idFront, user.idBack, user.billImage, baseUrl]);

  const handleImageError = (imageType) => () => {
    console.error(`Image failed to load for ${imageType}:`, imageStatus[imageType].url?.substring(0, 50) + '...');
    setImageStatus((prev) => ({
      ...prev,
      [imageType]: { ...prev[imageType], status: 'not_found', error: 'Image failed to load' },
    }));
  };

  const handleImageLoad = (imageType) => () => {
    console.log(`Image loaded successfully for ${imageType}:`, imageStatus[imageType].url?.substring(0, 50) + '...');
    setImageStatus((prev) => ({
      ...prev,
      [imageType]: { ...prev[imageType], status: 'loaded', error: null },
    }));
  };

  const handleImageClick = (src) => {
    console.log(`Opening enlarged image: ${src.substring(0, 50)}...`);
    setEnlargedImage(src);
  };

  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Review</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-900 font-medium">{user.fname ? `${user.fname} ${user.lname || ''}` : user.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-gray-500" />
                  {user.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-gray-900 font-medium">{user.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-900 font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                  {user.dob || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-900 font-medium">{user.gender || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-gray-500" />
                  {user.phone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900 font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                  {user.address || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="text-gray-900 font-medium">{user.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="text-gray-900 font-medium">{user.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ZIP Code</p>
                <p className="text-gray-900 font-medium">{user.zip || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID Type</p>
                <p className="text-gray-900 font-medium">{user.idType || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              Verification Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID Front</p>
                {imageStatus.idFront.status === 'missing' ? (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    No ID Front Uploaded
                  </div>
                ) : imageStatus.idFront.status === 'loading' ? (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : imageStatus.idFront.status === 'not_found' ? (
                  <div className="mt-2 w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p>File is missing: {imageStatus.idFront.error || 'Unknown error'}</p>
                  </div>
                ) : (
                  <img
                    src={imageStatus.idFront.url}
                    alt="ID Front"
                    className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                    onClick={() => handleImageClick(imageStatus.idFront.url)}
                    onError={handleImageError('idFront')}
                    onLoad={handleImageLoad('idFront')}
                  />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Back</p>
                {imageStatus.idBack.status === 'missing' ? (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    No ID Back Uploaded
                  </div>
                ) : imageStatus.idBack.status === 'loading' ? (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : imageStatus.idBack.status === 'not_found' ? (
                  <div className="mt-2 w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p>File is missing: {imageStatus.idBack.error || 'Unknown error'}</p>
                  </div>
                ) : (
                  <img
                    src={imageStatus.idBack.url}
                    alt="ID Back"
                    className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                    onClick={() => handleImageClick(imageStatus.idBack.url)}
                    onError={handleImageError('idBack')}
                    onLoad={handleImageLoad('idBack')}
                  />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Bill Image</p>
                {imageStatus.billImage.status === 'missing' ? (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    No Bill Image Uploaded
                  </div>
                ) : imageStatus.billImage.status === 'loading' ? (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : imageStatus.billImage.status === 'not_found' ? (
                  <div className="mt-2 w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p>File is missing: {imageStatus.billImage.error || 'Unknown error'}</p>
                  </div>
                ) : imageStatus.billImage.url.includes('application/pdf') ? (
                  <a
                    href={imageStatus.billImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-blue-600 hover:text-blue-500"
                  >
                    View Bill Image (PDF)
                  </a>
                ) : (
                  <img
                    src={imageStatus.billImage.url}
                    alt="Bill Image"
                    className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                    onClick={() => handleImageClick(imageStatus.billImage.url)}
                    onError={handleImageError('billImage')}
                    onLoad={handleImageLoad('billImage')}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Registration Date</p>
            <p className="text-gray-900 font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="relative max-w-4xl w-full m-4">
            <button
              onClick={handleCloseEnlarged}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged Image"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UserReview;

