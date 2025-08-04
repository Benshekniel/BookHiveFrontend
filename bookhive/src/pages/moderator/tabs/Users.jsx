import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, AlertTriangle, Eye, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserReview from '../subPages/UserReview'; // Import the new component

const Users = () => {
  const [activeTab, setActiveTab] = useState('registrations');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user

  const userManagement = [
    {
      id: 'USR-1001',
      username: 'bookworm_alice',
      email: 'alice.smith@email.com',
      joinDate: '2023-08-15',
      trustScore: 87,
      badges: ['Trusted Reader', 'Community Helper'],
      totalExchanges: 45,
      successRate: 96,
      status: 'active',
      lastActivity: '2 hours ago',
      violations: 0
    },
    {
      id: 'USR-1002',
      username: 'classic_reader',
      email: 'john.doe@email.com',
      joinDate: '2023-06-22',
      trustScore: 92,
      badges: ['Literature Expert', 'Mentor'],
      totalExchanges: 78,
      successRate: 98,
      status: 'active',
      lastActivity: '1 day ago',
      violations: 0
    },
    {
      id: 'USR-1003',
      username: 'problem_user',
      email: 'problem@email.com',
      joinDate: '2023-12-01',
      trustScore: 34,
      badges: [],
      totalExchanges: 12,
      successRate: 67,
      status: 'flagged',
      lastActivity: '3 days ago',
      violations: 3
    }
  ];

  const userAppeals = [
    {
      id: 'APP-1001',
      username: 'suspended_user',
      appealDate: '2024-01-14',
      originalPenalty: 'Account Suspension',
      reason: 'Multiple late returns',
      appealReason: 'Medical emergency prevented timely returns',
      evidence: 'Medical certificate provided',
      status: 'under_review',
      priority: 'medium'
    },
    {
      id: 'APP-1002',
      username: 'disputed_score',
      appealDate: '2024-01-13',
      originalPenalty: 'TrustScore Reduction',
      reason: 'Negative feedback from exchange',
      appealReason: 'False accusation, have proof of book condition',
      evidence: 'Photos and messages provided',
      status: 'pending',
      priority: 'low'
    }
  ];

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/moderator/getPendingRegistrations', {
          headers: { 'Content-Type': 'application/json' },
        });
        setPendingRegistrations(
          response.data.map((registration, index) => ({
            id: `REG-${1001 + index}`, // Fallback since user_id is not provided
            username: registration.email ? registration.email.split('@')[0] : `user${index}`,
            email: registration.email || '',
            name: registration.name || '', // Pass name for UserReview
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
            status: 'pending', // Hardcoded since status is not returned
            referredBy: null, // Not available in the response
            role: registration.role || '', // Pass role for UserReview
            fname: registration.fname || '', // Pass additional fields for UserReview
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
      case 'suspended': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNicPhotoColor = (clarity) => {
    switch (clarity) {
      case 'clear': return 'text-green-600';
      case 'partial': return 'text-yellow-600';
      case 'missing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const handleReview = (user) => {
    setSelectedUser(user); // Set the selected user to show in UserReview
  };

  const handleCloseReview = () => {
    setSelectedUser(null); // Clear selected user to close UserReview
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
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
              <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Flagged Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
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

      {/* Tabs */}
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
              User Management
            </button>
            <button
              onClick={() => setActiveTab('appeals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appeals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Appeals
            </button>
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
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center">
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'management' && (
            <div className="space-y-4">
              {userManagement.map((user) => (
                <div key={user.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">@{user.username}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        {user.violations > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {user.violations} violations
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        TrustScore: <span className={`font-bold text-lg ${getTrustScoreColor(user.trustScore)}`}>{user.trustScore}</span> • 
                        Exchanges: {user.totalExchanges} • 
                        Success Rate: {user.successRate}% • 
                        Member Since: {user.joinDate}
                      </p>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-gray-500 text-sm">Badges:</span>
                          {user.badges.length > 0 ? (
                            user.badges.map((badge, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {badge}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No badges</span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500">
                        Last activity: {user.lastActivity}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        View Profile
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Adjust Score
                      </button>
                      {user.status === 'flagged' && (
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appeals' && (
            <div className="space-y-4">
              {userAppeals.map((appeal) => (
                <div 
                  key={appeal.id}
                  className={`p-6 rounded-lg border-l-4 ${getPriorityColor(appeal.priority)} bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Appeal from @{appeal.username}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appeal.status)}`}>
                          {appeal.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appeal.priority === 'high' ? 'bg-red-100 text-red-700' :
                          appeal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {appeal.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        Original Penalty: {appeal.originalPenalty} - {appeal.reason} • 
                        Appeal Reason: {appeal.appealReason} • 
                        Evidence: {appeal.evidence}
                      </p>

                      <p className="text-sm text-gray-500">
                        Appeal Date: {appeal.appealDate}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Review Evidence
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                        Accept Appeal
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                        Reject Appeal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render UserReview modal if a user is selected */}
      {selectedUser && (
        <UserReview user={selectedUser} onClose={handleCloseReview} />
      )}
    </div>
  );
};

export default Users;

// import React, { useState, useEffect } from 'react';
// import { UserCheck, Star, Shield, AlertTriangle, Eye, CheckCircle, X } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Users = () => {
//   const [activeTab, setActiveTab] = useState('registrations');
//   const [pendingRegistrations, setPendingRegistrations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const userManagement = [
//     {
//       id: 'USR-1001',
//       username: 'bookworm_alice',
//       email: 'alice.smith@email.com',
//       joinDate: '2023-08-15',
//       trustScore: 87,
//       badges: ['Trusted Reader', 'Community Helper'],
//       totalExchanges: 45,
//       successRate: 96,
//       status: 'active',
//       lastActivity: '2 hours ago',
//       violations: 0
//     },
//     {
//       id: 'USR-1002',
//       username: 'classic_reader',
//       email: 'john.doe@email.com',
//       joinDate: '2023-06-22',
//       trustScore: 92,
//       badges: ['Literature Expert', 'Mentor'],
//       totalExchanges: 78,
//       successRate: 98,
//       status: 'active',
//       lastActivity: '1 day ago',
//       violations: 0
//     },
//     {
//       id: 'USR-1003',
//       username: 'problem_user',
//       email: 'problem@email.com',
//       joinDate: '2023-12-01',
//       trustScore: 34,
//       badges: [],
//       totalExchanges: 12,
//       successRate: 67,
//       status: 'flagged',
//       lastActivity: '3 days ago',
//       violations: 3
//     }
//   ];

//   const userAppeals = [
//     {
//       id: 'APP-1001',
//       username: 'suspended_user',
//       appealDate: '2024-01-14',
//       originalPenalty: 'Account Suspension',
//       reason: 'Multiple late returns',
//       appealReason: 'Medical emergency prevented timely returns',
//       evidence: 'Medical certificate provided',
//       status: 'under_review',
//       priority: 'medium'
//     },
//     {
//       id: 'APP-1002',
//       username: 'disputed_score',
//       appealDate: '2024-01-13',
//       originalPenalty: 'TrustScore Reduction',
//       reason: 'Negative feedback from exchange',
//       appealReason: 'False accusation, have proof of book condition',
//       evidence: 'Photos and messages provided',
//       status: 'pending',
//       priority: 'low'
//     }
//   ];

//   useEffect(() => {
//     const fetchPendingRegistrations = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:9090/api/moderator/getPendingRegistrations', {
//           headers: { 'Content-Type': 'application/json' },
//         });
//         setPendingRegistrations(
//           response.data.map((registration, index) => ({
//             id: `REG-${1001 + index}`, // Fallback since user_id is not provided
//             username: registration.email ? registration.email.split('@')[0] : `user${index}`,
//             email: registration.email || '',
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
//             status: 'pending', // Hardcoded since status is not returned
//             referredBy: null // Not available in the response
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
//       case 'suspended': return 'bg-gray-100 text-gray-800';
//       case 'under_review': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getTrustScoreColor = (score) => {
//     if (score >= 80) return 'text-green-600';
//     if (score >= 60) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const getNicPhotoColor = (clarity) => {
//     switch (clarity) {
//       case 'clear': return 'text-green-600';
//       case 'partial': return 'text-yellow-600';
//       case 'missing': return 'text-red-600';
//       default: return 'text-gray-600';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'border-l-red-500';
//       case 'medium': return 'border-l-yellow-500';
//       case 'low': return 'border-l-green-500';
//       default: return 'border-l-gray-300';
//     }
//   };

//   return (
//     <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
//       {/* Stats Cards */}
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

//       {/* Tabs */}
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
//               User Management
//             </button>
//             <button
//               onClick={() => setActiveTab('appeals')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'appeals'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               User Appeals
//             </button>
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
//                         <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
//                           <Eye className="w-3 h-3 mr-1" />
//                           Review
//                         </button>
//                         <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center">
//                           <CheckCircle className="w-3 h-3 mr-1" />
//                           Approve
//                         </button>
//                         <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center">
//                           <X className="w-3 h-3 mr-1" />
//                           Reject
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}

//           {activeTab === 'management' && (
//             <div className="space-y-4">
//               {userManagement.map((user) => (
//                 <div key={user.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="text-lg font-semibold text-gray-900">@{user.username}</h3>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
//                           {user.status}
//                         </span>
//                         {user.violations > 0 && (
//                           <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
//                             {user.violations} violations
//                           </span>
//                         )}
//                       </div>
                      
//                       <p className="text-sm text-gray-600 mb-3">
//                         TrustScore: <span className={`font-bold text-lg ${getTrustScoreColor(user.trustScore)}`}>{user.trustScore}</span> • 
//                         Exchanges: {user.totalExchanges} • 
//                         Success Rate: {user.successRate}% • 
//                         Member Since: {user.joinDate}
//                       </p>

//                       <div className="mb-3">
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           <span className="text-gray-500 text-sm">Badges:</span>
//                           {user.badges.length > 0 ? (
//                             user.badges.map((badge, index) => (
//                               <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
//                                 {badge}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-gray-400 text-xs">No badges</span>
//                           )}
//                         </div>
//                       </div>

//                       <p className="text-sm text-gray-500">
//                         Last activity: {user.lastActivity}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-2 ml-4">
//                       <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                         View Profile
//                       </button>
//                       <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                         Adjust Score
//                       </button>
//                       {user.status === 'flagged' && (
//                         <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
//                           Take Action
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === 'appeals' && (
//             <div className="space-y-4">
//               {userAppeals.map((appeal) => (
//                 <div 
//                   key={appeal.id}
//                   className={`p-6 rounded-lg border-l-4 ${getPriorityColor(appeal.priority)} bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="text-lg font-semibold text-gray-900">Appeal from @{appeal.username}</h3>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appeal.status)}`}>
//                           {appeal.status.replace('_', ' ')}
//                         </span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           appeal.priority === 'high' ? 'bg-red-100 text-red-700' :
//                           appeal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                           'bg-green-100 text-green-700'
//                         }`}>
//                           {appeal.priority} priority
//                         </span>
//                       </div>
                      
//                       <p className="text-sm text-gray-600 mb-3">
//                         Original Penalty: {appeal.originalPenalty} - {appeal.reason} • 
//                         Appeal Reason: {appeal.appealReason} • 
//                         Evidence: {appeal.evidence}
//                       </p>

//                       <p className="text-sm text-gray-500">
//                         Appeal Date: {appeal.appealDate}
//                       </p>
//                     </div>
                    
//                     <div className="flex space-x-2 ml-4">
//                       <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
//                         Review Evidence
//                       </button>
//                       <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
//                         Accept Appeal
//                       </button>
//                       <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
//                         Reject Appeal
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;

