import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, FileText, Image, AlertCircle } from 'lucide-react';

const UserReview = ({ user, onClose }) => {
  if (!user) return null;

  // Base URL for the backend (adjust if different in production)
  const baseUrl = 'http://localhost:9090';

  // State for enlarged image
  const [enlargedImage, setEnlargedImage] = useState(null);

  // State to track missing files
  const [imageStatus, setImageStatus] = useState({
    idFront: user.idFront ? 'loading' : 'missing',
    idBack: user.idBack ? 'loading' : 'missing',
    billImage: user.billImage ? 'loading' : 'missing',
  });

  // Handle image error (file exists in DB but not in folder)
  const handleImageError = (imageType) => (e) => {
    setImageStatus((prev) => ({ ...prev, [imageType]: 'not_found' }));
    e.target.src = null; // Clear the src to prevent repeated failed requests
  };

  // Handle image load success
  const handleImageLoad = (imageType) => () => {
    setImageStatus((prev) => ({ ...prev, [imageType]: 'loaded' }));
  };

  // Handle image click to enlarge
  const handleImageClick = (src) => {
    setEnlargedImage(src);
  };

  // Close enlarged image modal
  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Review</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* User Card */}
        <div className="space-y-6">
          {/* Personal Details */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-900 font-medium">{user.fullName || user.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-gray-900 font-medium">@{user.username || 'N/A'}</p>
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

          {/* Contact Information */}
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

          {/* Identification */}
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
              <div>
                <p className="text-sm text-gray-500">Profile Completion</p>
                <p className="text-gray-900 font-medium">{user.profileComplete || 0}%</p>
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className="pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              Verification Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID Front</p>
                {user.idFront ? (
                  imageStatus.idFront === 'not_found' ? (
                    <div className="mt-2 w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                      <AlertCircle className="w-6 h-6 mb-2" />
                      <p>File is missing</p>
                    </div>
                  ) : (
                    <img
                      src={`${baseUrl}/Users/idFront/${user.idFront}`}
                      alt="ID Front"
                      className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                      onClick={() => handleImageClick(`${baseUrl}/Users/idFront/${user.idFront}`)}
                      onError={handleImageError('idFront')}
                      onLoad={handleImageLoad('idFront')}
                    />
                  )
                ) : (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    No ID Front Uploaded
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Back</p>
                {user.idBack ? (
                  imageStatus.idBack === 'not_found' ? (
                    <div className="mt-2 w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                      <AlertCircle className="w-6 h-6 mb-2" />
                      <p>File is missing</p>
                    </div>
                  ) : (
                    <img
                      src={`${baseUrl}/Users/idBack/${user.idBack}`}
                      alt="ID Back"
                      className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                      onClick={() => handleImageClick(`${baseUrl}/Users/idBack/${user.idBack}`)}
                      onError={handleImageError('idBack')}
                      onLoad={handleImageLoad('idBack')}
                    />
                  )
                ) : (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    No ID Back Uploaded
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Bill Image</p>
                {user.billImage ? (
                  imageStatus.billImage === 'not_found' ? (
                    <div className="mt-2 w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-red-600">
                      <AlertCircle className="w-6 h-6 mb-2" />
                      <p>File is missing</p>
                    </div>
                  ) : (
                    <img
                      src={`${baseUrl}/Users/billImage/${user.billImage}`}
                      alt="Bill Image"
                      className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200 cursor-pointer"
                      onClick={() => handleImageClick(`${baseUrl}/Users/billImage/${user.billImage}`)}
                      onError={handleImageError('billImage')}
                      onLoad={handleImageLoad('billImage')}
                    />
                  )
                ) : (
                  <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
                    No Bill Image Uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Registration Date */}
          <div>
            <p className="text-sm text-gray-500">Registration Date</p>
            <p className="text-gray-900 font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
              {user.registrationDate ? new Date(user.registrationDate).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Enlarged Image Modal */}
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
    </div>
  );
};

export default UserReview;

// import React from 'react';
// import { X, User, Mail, Phone, Calendar, MapPin, FileText, Image } from 'lucide-react';

// const UserReview = ({ user, onClose }) => {
//   if (!user) return null;

//   // Base URL for the backend (adjust if different in production)
//   const baseUrl = 'http://localhost:9090';

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 m-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">User Review</h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <X className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>

//         {/* User Card */}
//         <div className="space-y-6">
//           {/* Personal Details */}
//           <div className="border-b border-gray-200 pb-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//               <User className="w-5 h-5 mr-2 text-blue-600" />
//               Personal Details
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Full Name</p>
//                 <p className="text-gray-900 font-medium">{user.fullName || user.name || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Username</p>
//                 <p className="text-gray-900 font-medium">@{user.username || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="text-gray-900 font-medium flex items-center">
//                   <Mail className="w-4 h-4 mr-1 text-gray-500" />
//                   {user.email || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Role</p>
//                 <p className="text-gray-900 font-medium">{user.role || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Date of Birth</p>
//                 <p className="text-gray-900 font-medium flex items-center">
//                   <Calendar className="w-4 h-4 mr-1 text-gray-500" />
//                   {user.dob || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Gender</p>
//                 <p className="text-gray-900 font-medium">{user.gender || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="border-b border-gray-200 pb-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//               <Phone className="w-5 h-5 mr-2 text-blue-600" />
//               Contact Information
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Phone</p>
//                 <p className="text-gray-900 font-medium flex items-center">
//                   <Phone className="w-4 h-4 mr-1 text-gray-500" />
//                   {user.phone || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Address</p>
//                 <p className="text-gray-900 font-medium flex items-center">
//                   <MapPin className="w-4 h-4 mr-1 text-gray-500" />
//                   {user.address || 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">City</p>
//                 <p className="text-gray-900 font-medium">{user.city || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">State</p>
//                 <p className="text-gray-900 font-medium">{user.state || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">ZIP Code</p>
//                 <p className="text-gray-900 font-medium">{user.zip || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Identification */}
//           <div className="border-b border-gray-200 pb-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//               <FileText className="w-5 h-5 mr-2 text-blue-600" />
//               Identification
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">ID Type</p>
//                 <p className="text-gray-900 font-medium">{user.idType || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Profile Completion</p>
//                 <p className="text-gray-900 font-medium">{user.profileComplete || 0}%</p>
//               </div>
//             </div>
//           </div>

//           {/* Verification Documents */}
//           <div className="pb-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//               <Image className="w-5 h-5 mr-2 text-blue-600" />
//               Verification Documents
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">ID Front</p>
//                 {user.idFront ? (
//                   <img
//                     src={`${baseUrl}/users/idFront/${user.idFront}`}
//                     alt="ID Front"
//                     className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200"
//                     onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=ID+Front+Not+Available')}
//                   />
//                 ) : (
//                   <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
//                     No ID Front Uploaded
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">ID Back</p>
//                 {user.idBack ? (
//                   <img
//                     src={`${baseUrl}/users/idBack/${user.idBack}`}
//                     alt="ID Back"
//                     className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200"
//                     onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=ID+Back+Not+Available')}
//                   />
//                 ) : (
//                   <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
//                     No ID Back Uploaded
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Bill Image</p>
//                 {user.billImage ? (
//                   <img
//                     src={`${baseUrl}/users/billImage/${user.billImage}`}
//                     alt="Bill Image"
//                     className="mt-2 w-full h-40 object-cover rounded-md border border-gray-200"
//                     onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Bill+Image+Not+Available')}
//                   />
//                 ) : (
//                   <div className="mt-2 w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-500">
//                     No Bill Image Uploaded
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Registration Date */}
//           <div>
//             <p className="text-sm text-gray-500">Registration Date</p>
//             <p className="text-gray-900 font-medium flex items-center">
//               <Calendar className="w-4 h-4 mr-1 text-gray-500" />
//               {user.registrationDate ? new Date(user.registrationDate).toLocaleString() : 'N/A'}
//             </p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserReview;
