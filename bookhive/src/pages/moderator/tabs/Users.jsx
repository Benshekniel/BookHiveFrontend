import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, AlertTriangle, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserReview from '../subPages/UserReview';
import UserApproval from '../subPages/UserApproval';
import FlaggedUsers from '../subPages/FlaggedUsers';
import Appeals from '../subPages/Appeals';
import UserManagement from '../subPages/UserManagement';

const Users = () => {
  const [activeTab, setActiveTab] = useState('registrations');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [flaggedUsersCount, setFlaggedUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch counts initially and every 10 seconds
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [activeRes, flaggedRes] = await Promise.all([
          axios.get('http://localhost:9090/api/moderator/countActiveUsers'),
          axios.get('http://localhost:9090/api/moderator/countFlaggedUsers')
        ]);
        setActiveUsersCount(activeRes.data.activeUsers);
        setFlaggedUsersCount(flaggedRes.data.flaggedUsers);
      } catch (err) {
        toast.error(`Failed to fetch counts: ${err.message}`);
        console.error('Error fetching counts:', err);
      }
    };

    // Initial fetch
    fetchCounts();

    // Set up interval to fetch every 10 seconds
    const intervalId = setInterval(fetchCounts, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/moderator/getPendingRegistrations', {
          headers: { 'Content-Type': 'application/json' },
        });
        setPendingRegistrations(
          response.data.map((registration, index) => ({
            id: `REG-${1001 + index}`,
            username: registration.email ? registration.email.split('@')[0] : `user${index}`,
            email: registration.email || '',
            name: registration.name || '',
            fullName: registration.fname && registration.lname
              ? `${registration.fname} ${registration.lname}`
              : registration.name || '',
            registrationDate: registration.createdAt
              ? new Date(registration.createdAt).toISOString()
              : new Date().toISOString(),
            nicPhoto: registration.idFront && registration.idBack
              ? 'clear'
              : registration.idFront || registration.idBack
              ? 'partial'
              : 'missing',
            profileComplete: calculateProfileComplete(registration),
            location: [registration.city, registration.state, registration.zip]
              .filter(Boolean)
              .join(', ') || '',
            status: 'pending',
            referredBy: null,
            role: registration.role || '',
            fname: registration.fname || '',
            lname: registration.lname || '',
            phone: registration.phone || '',
            dob: registration.dob || '',
            idType: registration.idType || '',
            idFront: registration.idFront || '',
            idBack: registration.idBack || '',
            gender: registration.gender || '',
            address: registration.address || '',
            city: registration.city || '',
            state: registration.state || '',
            zip: registration.zip || '',
            billImage: registration.billImage || '',
            createdAt: registration.createdAt || ''
          }))
        );
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch pending registrations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === 'registrations') {
      fetchPendingRegistrations();
    }
  }, [activeTab]);

  const calculateProfileComplete = (registration) => {
    const fields = [
      registration.name,
      registration.email,
      registration.fname,
      registration.lname,
      registration.phone,
      registration.dob,
      registration.idType,
      registration.idFront,
      registration.idBack,
      registration.gender,
      registration.address,
      registration.city,
      registration.state,
      registration.zip,
      registration.billImage
    ];
    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      case 'banned': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNicPhotoColor = (clarity) => {
    switch (clarity) {
      case 'clear': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'missing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleReview = (user) => {
    setSelectedUser(user);
  };

  const handleCloseReview = () => {
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setPendingRegistrations(prev =>
      prev.map(reg => reg.id === updatedUser.id ? updatedUser : reg)
    );
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Registrations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingRegistrations.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeUsersCount}</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Flagged Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{flaggedUsersCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Appeals Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registrations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Registrations
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'management'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users Management
            </button>
            <button
              onClick={() => setActiveTab('flaggedUsers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'flaggedUsers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Flagged Users
            </button>
            {/* <button
              onClick={() => setActiveTab('appealsPending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appealsPending'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appeals Pending
            </button>
            <button
              onClick={() => setActiveTab('appealsSolved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appealsSolved'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appeals Solved
            </button> */}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'registrations' && (
            <div className="space-y-4">
              {loading && <p className="text-gray-600">Loading...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              {!loading && !error && pendingRegistrations.length === 0 && (
                <p className="text-gray-600">No pending registrations found.</p>
              )}
              {!loading &&
                pendingRegistrations.map((registration) => (
                  <div key={registration.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{registration.fullName}</h3>
                          <span className="text-gray-600 text-sm">@{registration.username}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                            {registration.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Email: {registration.email} • Location: {registration.location} • NIC Photo: <span className={getNicPhotoColor(registration.nicPhoto)}>{registration.nicPhoto}</span> • Profile Complete: {registration.profileComplete}%
                        </p>
                        <p className="text-sm text-gray-500">
                          Registered: {registration.registrationDate}
                          {registration.referredBy && ` • Referred by: ${registration.referredBy}`}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleReview(registration)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </button>
                        <UserApproval user={registration} onUpdate={handleUserUpdate} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'management' && (
            <UserManagement />
          )}

          {activeTab === 'flaggedUsers' && (
            <FlaggedUsers />
          )}

          {activeTab === 'appealsPending' && (
            <Appeals statusFilter={['pending', 'under_review']} />
          )}

          {activeTab === 'appealsSolved' && (
            <Appeals statusFilter={['accepted', 'rejected']} />
          )}
        </div>
      </div>

      {selectedUser && (
        <UserReview user={selectedUser} onClose={handleCloseReview} />
      )}
    </div>
  );
};

export default Users;



// import React, { useState, useEffect } from 'react';
// import { UserCheck, Shield, AlertTriangle, Eye } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import UserReview from '../subPages/UserReview';
// import UserApproval from '../subPages/UserApproval';
// import FlaggedUsers from '../subPages/FlaggedUsers';
// import Appeals from '../subPages/Appeals';
// import UserManagement from '../subPages/UserManagement';

// const Users = () => {
//   const [activeTab, setActiveTab] = useState('registrations');
//   const [pendingRegistrations, setPendingRegistrations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     const fetchPendingRegistrations = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:9090/api/moderator/getPendingRegistrations', {
//           headers: { 'Content-Type': 'application/json' },
//         });
//         setPendingRegistrations(
//           response.data.map((registration, index) => ({
//             id: `REG-${1001 + index}`,
//             username: registration.email ? registration.email.split('@')[0] : `user${index}`,
//             email: registration.email || '',
//             name: registration.name || '',
//             fullName: registration.fname && registration.lname
//               ? `${registration.fname} ${registration.lname}`
//               : registration.name || '',
//             registrationDate: registration.createdAt
//               ? new Date(registration.createdAt).toISOString()
//               : new Date().toISOString(),
//             nicPhoto: registration.idFront && registration.idBack
//               ? 'clear'
//               : registration.idFront || registration.idBack
//               ? 'partial'
//               : 'missing',
//             profileComplete: calculateProfileComplete(registration),
//             location: [registration.city, registration.state, registration.zip]
//               .filter(Boolean)
//               .join(', ') || '',
//             status: 'pending',
//             referredBy: null,
//             role: registration.role || '',
//             fname: registration.fname || '',
//             lname: registration.lname || '',
//             phone: registration.phone || '',
//             dob: registration.dob || '',
//             idType: registration.idType || '',
//             idFront: registration.idFront || '',
//             idBack: registration.idBack || '',
//             gender: registration.gender || '',
//             address: registration.address || '',
//             city: registration.city || '',
//             state: registration.state || '',
//             zip: registration.zip || '',
//             billImage: registration.billImage || '',
//             createdAt: registration.createdAt || ''
//           }))
//         );
//       } catch (err) {
//         setError(err.message);
//         toast.error(`Failed to fetch pending registrations: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (activeTab === 'registrations') {
//       fetchPendingRegistrations();
//     }
//   }, [activeTab]);

//   const calculateProfileComplete = (registration) => {
//     const fields = [
//       registration.name,
//       registration.email,
//       registration.fname,
//       registration.lname,
//       registration.phone,
//       registration.dob,
//       registration.idType,
//       registration.idFront,
//       registration.idBack,
//       registration.gender,
//       registration.address,
//       registration.city,
//       registration.state,
//       registration.zip,
//       registration.billImage
//     ];
//     const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
//     return Math.round((filledFields / fields.length) * 100);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'flagged': return 'bg-red-100 text-red-800';
//       case 'disabled': return 'bg-gray-100 text-gray-800';
//       case 'banned': return 'bg-gray-100 text-gray-800';
//       case 'under_review': return 'bg-blue-100 text-blue-800';
//       case 'accepted': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getNicPhotoColor = (clarity) => {
//     switch (clarity) {
//       case 'clear': return 'text-green-600';
//       case 'partial': return 'text-yellow-600';
//       case 'missing': return 'text-red-600';
//       default: return 'text-gray-600';
//     }
//   };

//   const handleReview = (user) => {
//     setSelectedUser(user);
//   };

//   const handleCloseReview = () => {
//     setSelectedUser(null);
//   };

//   const handleUserUpdate = (updatedUser) => {
//     setPendingRegistrations(prev =>
//       prev.map(reg => reg.id === updatedUser.id ? updatedUser : reg)
//     );
//   };

//   return (
//     <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Pending Registrations</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">{pendingRegistrations.length}</p>
//             </div>
//             <UserCheck className="w-8 h-8 text-blue-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Active Users</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
//             </div>
//             <Shield className="w-8 h-8 text-green-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Flagged Users</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
//             </div>
//             <AlertTriangle className="w-8 h-8 text-red-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Appeals Pending</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
//             </div>
//             <Eye className="w-8 h-8 text-purple-500" />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8 px-6">
//             <button
//               onClick={() => setActiveTab('registrations')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'registrations'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Pending Registrations
//             </button>
//             <button
//               onClick={() => setActiveTab('management')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'management'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Users Management
//             </button>
//             <button
//               onClick={() => setActiveTab('flaggedUsers')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'flaggedUsers'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Flagged Users
//             </button>
//             {/* <button
//               onClick={() => setActiveTab('appealsPending')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'appealsPending'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Appeals Pending
//             </button>
//             <button
//               onClick={() => setActiveTab('appealsSolved')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'appealsSolved'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Appeals Solved
//             </button> */}
//           </nav>
//         </div>

//         <div className="p-6">
//           {activeTab === 'registrations' && (
//             <div className="space-y-4">
//               {loading && <p className="text-gray-600">Loading...</p>}
//               {error && <p className="text-red-600">Error: {error}</p>}
//               {!loading && !error && pendingRegistrations.length === 0 && (
//                 <p className="text-gray-600">No pending registrations found.</p>
//               )}
//               {!loading &&
//                 pendingRegistrations.map((registration) => (
//                   <div key={registration.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h3 className="text-lg font-semibold text-gray-900">{registration.fullName}</h3>
//                           <span className="text-gray-600 text-sm">@{registration.username}</span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
//                             {registration.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600 mb-3">
//                           Email: {registration.email} • Location: {registration.location} • NIC Photo: <span className={getNicPhotoColor(registration.nicPhoto)}>{registration.nicPhoto}</span> • Profile Complete: {registration.profileComplete}%
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Registered: {registration.registrationDate}
//                           {registration.referredBy && ` • Referred by: ${registration.referredBy}`}
//                         </p>
//                       </div>
//                       <div className="flex space-x-2 ml-4">
//                         <button
//                           onClick={() => handleReview(registration)}
//                           className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
//                         >
//                           <Eye className="w-3 h-3 mr-1" />
//                           Review
//                         </button>
//                         <UserApproval user={registration} onUpdate={handleUserUpdate} />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}

//           {activeTab === 'management' && (
//             <UserManagement />
//           )}

//           {activeTab === 'flaggedUsers' && (
//             <FlaggedUsers />
//           )}

//           {activeTab === 'appealsPending' && (
//             <Appeals statusFilter={['pending', 'under_review']} />
//           )}

//           {activeTab === 'appealsSolved' && (
//             <Appeals statusFilter={['accepted', 'rejected']} />
//           )}
//         </div>
//       </div>

//       {selectedUser && (
//         <UserReview user={selectedUser} onClose={handleCloseReview} />
//       )}
//     </div>
//   );
// };

// export default Users;

