import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MessageCircle,
  Star,
  Car,
  Bike,
  Truck,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Delete,
  Trash,
  Eye,
  X,
  Download,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { agentApi, documentApi, documentHelpers } from '../../services/deliveryService';

const API_BASE_URL = 'http://localhost:9090/api';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [hubFilter, setHubFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('agents');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [agents, setAgents] = useState([]);
  const [superAgents, setSuperAgents] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedApplicationForRejection, setSelectedApplicationForRejection] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [downloadingDocuments, setDownloadingDocuments] = useState({});

  // Common rejection reasons
  const commonRejectionReasons = [
    'Incomplete or unclear documents',
    'Invalid identification documents',
    'Vehicle registration expired or invalid',
    'Age requirement not met (must be 18-65)',
    'Failed background verification',
    'Vehicle type not suitable for our services',
    'Application information inconsistent',
    'Previous employment issues',
    'Other (please specify)'
  ];

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch agents
        const agentsResponse = await agentApi.getAllAgents();
        const transformedAgents = agentsResponse.map(agent => transformAgentData(agent));

        const regularAgents = transformedAgents.filter(agent =>
          !['truck', 'van'].includes(agent.vehicle.toLowerCase())
        );

        const superAgentsList = transformedAgents.filter(agent =>
          ['truck', 'van'].includes(agent.vehicle.toLowerCase())
        ).map(agent => ({
          ...agent,
          hub: agent.hubName || 'Colombo Central Hub'
        }));

        setAgents(regularAgents);
        setSuperAgents(superAgentsList);

        // Fetch applications
        await Promise.all([
          fetchPendingApplications(),
          fetchRejectedApplications(),
          fetchApprovedApplications(),
          fetchApplicationStats()
        ]);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const transformAgentData = (agent) => {
    const getName = () => {
      if (agent.name) return agent.name;
      if (agent.userName) return agent.userName;
      if (agent.firstName && agent.lastName) return `${agent.firstName} ${agent.lastName}`;
      if (agent.firstName) return agent.firstName;
      if (agent.lastName) return agent.lastName;
      return 'Unknown Agent';
    };

    const getEmail = () => {
      if (agent.email) return agent.email;
      if (agent.userEmail) return agent.userEmail;
      return 'No email';
    };

    const getPhone = () => {
      if (agent.phoneNumber) return agent.phoneNumber;
      if (agent.userPhone) return agent.userPhone;
      if (agent.phone) return agent.phone;
      return 'No phone';
    };

    const getVehicleType = () => {
      if (agent.vehicleType) {
        if (typeof agent.vehicleType === 'string') {
          return agent.vehicleType.toLowerCase().replace('_', ' ');
        }
        return agent.vehicleType.toString().toLowerCase().replace('_', ' ');
      }
      return 'Not specified';
    };

    const getStatus = () => {
      if (agent.availabilityStatus) {
        if (typeof agent.availabilityStatus === 'string') {
          return agent.availabilityStatus.toLowerCase();
        }
        return agent.availabilityStatus.toString().toLowerCase();
      }
      return 'unavailable';
    };

    const getRating = () => {
      if (agent.trustScore !== undefined && agent.trustScore !== null) return agent.trustScore;
      if (agent.rating !== undefined && agent.rating !== null) return agent.rating / 20.0;
      return 0;
    };

    const getDeliveries = () => {
      if (agent.totalDeliveries !== undefined && agent.totalDeliveries !== null) return agent.totalDeliveries;
      if (agent.numberOfDelivery !== undefined && agent.numberOfDelivery !== null) return agent.numberOfDelivery;
      if (agent.deliveries !== undefined && agent.deliveries !== null) return agent.deliveries;
      return 0;
    };

    return {
      id: agent.agentId || `A${String(agent.id || agent.agentId).padStart(3, '0')}`,
      name: getName(),
      phone: getPhone(),
      email: getEmail(),
      vehicle: getVehicleType(),
      vehicleId: agent.vehicleNumber || 'N/A',
      status: getStatus(),
      rating: getRating(),
      completedDeliveries: getDeliveries(),
      avatar: getName().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    };
  };

  const fetchPendingApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-applications/pending`);
      const data = await response.json();
      setPendingApplications(data.map(app => ({
        ...app,
        id: app.applicationId,
        appliedDate: new Date(app.appliedDate).toLocaleDateString(),
        documents: app.documentsStatus === 'COMPLETE' ? 'Complete' : 'Pending'
      })));
    } catch (error) {
      console.error('Error fetching pending applications:', error);
    }
  };

  const fetchRejectedApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-applications/rejected`);
      const data = await response.json();
      setRejectedApplications(data.map(app => ({
        ...app,
        id: app.applicationId,
        appliedDate: new Date(app.appliedDate).toLocaleDateString(),
        processedDate: new Date(app.processedDate).toLocaleDateString(),
        documents: app.documentsStatus === 'COMPLETE' ? 'Complete' : 'Pending'
      })));
    } catch (error) {
      console.error('Error fetching rejected applications:', error);
    }
  };

  const fetchApprovedApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-applications/approved`);
      const data = await response.json();
      setApprovedApplications(data.map(app => ({
        ...app,
        id: app.applicationId,
        appliedDate: new Date(app.appliedDate).toLocaleDateString(),
        processedDate: new Date(app.processedDate).toLocaleDateString(),
        documents: app.documentsStatus === 'COMPLETE' ? 'Complete' : 'Pending'
      })));
    } catch (error) {
      console.error('Error fetching approved applications:', error);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent-applications/stats`);
      const stats = await response.json();
      setApplicationStats(stats);
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  const handleVerificationAction = async (applicationId, action, customRejectionReason = '') => {
    try {
      if (action === 'reject') {
        const reason = customRejectionReason || rejectionReason;
        if (!reason) {
          alert('Please provide a rejection reason');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/agent-applications/${applicationId}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            rejectionReason: reason,
            rejectedBy: 1
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reject application');
        }
      } else if (action === 'approve') {
        const response = await fetch(`${API_BASE_URL}/agent-applications/${applicationId}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            approvedBy: 1
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to approve application');
        }
      }

      // Refresh data
      await Promise.all([
        fetchPendingApplications(),
        fetchRejectedApplications(),
        fetchApprovedApplications(),
        fetchApplicationStats()
      ]);

      setShowVerificationModal(false);
      setShowRejectionModal(false);
      setSelectedApplication(null);
      setSelectedApplicationForRejection(null);
      setRejectionReason('');

      alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully! Email notification sent to applicant.`);
    } catch (err) {
      console.error(`Error ${action}ing application:`, err);
      alert(`Failed to ${action} application: ${err.message}`);
    }
  };

  // Document download functions
  const handleDocumentDownload = async (application, documentType, documentUrl) => {
    const downloadKey = `${application.id}_${documentType}`;

    try {
      setDownloadingDocuments(prev => ({
        ...prev,
        [downloadKey]: true
      }));

      // First validate the URL
      console.log(`Attempting to download ${documentType} from:`, documentUrl);

      if (!documentUrl || documentUrl.trim() === '') {
        throw new Error('Document URL is not available');
      }

      // Try the API endpoint first
      try {
        await documentApi.downloadApplicationDocument(application.id, documentType);
        console.log(`Downloaded ${documentHelpers.getDocumentTypeDisplayName(documentType)} successfully via API`);
      } catch (apiError) {
        console.log('API download failed, trying direct URL...', apiError);

        // Fallback to direct URL download
        if (documentUrl) {
          const filename = documentHelpers.generateFilename(
            application.id,
            documentType,
            'jpg'
          );
          await documentApi.downloadDocument(documentUrl, filename);
          console.log(`Downloaded ${documentHelpers.getDocumentTypeDisplayName(documentType)} successfully via direct URL`);
        } else {
          throw new Error('Both API and direct URL download failed');
        }
      }

    } catch (error) {
      console.error('Download failed:', error);

      // More specific error messages
      let errorMessage = 'Download failed';
      if (error.message.includes('404')) {
        errorMessage = 'Document not found. The file may have been moved or deleted.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied. You may not have permission to access this document.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = error.message;
      }

      alert(`Failed to download ${documentHelpers.getDocumentTypeDisplayName(documentType)}: ${errorMessage}`);
    } finally {
      setDownloadingDocuments(prev => ({
        ...prev,
        [downloadKey]: false
      }));
    }
  };

  const handleDownloadAllDocuments = async (application) => {
    const downloadKey = `${application.id}_all`;

    try {
      setDownloadingDocuments(prev => ({
        ...prev,
        [downloadKey]: true
      }));

      await documentApi.downloadAllDocuments(application.id);
      console.log('Downloaded all documents successfully');
    } catch (error) {
      console.error('Download all failed:', error);
      alert(`Failed to download all documents: ${error.message}`);
    } finally {
      setDownloadingDocuments(prev => ({
        ...prev,
        [downloadKey]: false
      }));
    }
  };

  const getVehicleIcon = (vehicle) => {
    switch (vehicle.toLowerCase()) {
      case 'motorcycle':
      case 'bike':
      case 'bicycle':
        return <Bike size={16} />;
      case 'truck':
        return <Truck size={16} />;
      default:
        return <Car size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-600 text-white';
      case 'pending':
        return 'bg-yellow-400 text-white';
      case 'unavailable':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'unavailable':
        return <XCircle size={16} className="text-gray-400" />;
      default:
        return <XCircle size={16} className="text-gray-400" />;
    }
  };

  // Filter functions
  const filteredAgents = agents.filter(agent => {
    const safeToLower = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.toLowerCase();
    };

    const name = safeToLower(agent.name);
    const id = safeToLower(agent.id);
    const email = safeToLower(agent.email);
    const phone = safeToLower(agent.phone);
    const searchLower = safeToLower(searchTerm);

    const matchesSearch = searchTerm === '' ||
      name.includes(searchLower) ||
      id.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower);

    const matchesFilter = selectedFilter === 'all' ||
      safeToLower(agent.status) === safeToLower(selectedFilter);

    return matchesSearch && matchesFilter;
  });

  const filteredSuperAgents = superAgents.filter(agent => {
    const safeToLower = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.toLowerCase();
    };

    const name = safeToLower(agent.name);
    const id = safeToLower(agent.id);
    const email = safeToLower(agent.email);
    const phone = safeToLower(agent.phone);
    const searchLower = safeToLower(searchTerm);

    const matchesSearch = searchTerm === '' ||
      name.includes(searchLower) ||
      id.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower);

    const matchesFilter = selectedFilter === 'all' ||
      safeToLower(agent.status) === safeToLower(selectedFilter);

    return matchesSearch && matchesFilter;
  });

  const filteredPendingApplications = pendingApplications.filter(application => {
    const safeToLower = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.toLowerCase();
    };

    const matchesDocumentStatus = selectedFilter === 'all' ||
      (selectedFilter === 'complete' && application.documents === 'Complete') ||
      (selectedFilter === 'pending' && application.documents === 'Pending');

    const matchesVehicleType = vehicleFilter === 'all' ||
      safeToLower(application.vehicleType) === safeToLower(vehicleFilter);

    const matchesHub = hubFilter === 'all' ||
      safeToLower(application.hub).includes(safeToLower(hubFilter));

    return matchesDocumentStatus && matchesVehicleType && matchesHub;
  });

  const filteredRejectedApplications = rejectedApplications.filter(application => {
    const safeToLower = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.toLowerCase();
    };

    const searchLower = safeToLower(searchTerm);
    const name = safeToLower(application.firstName + ' ' + application.lastName);
    const email = safeToLower(application.email);

    const matchesSearch = searchTerm === '' ||
      name.includes(searchLower) ||
      email.includes(searchLower);

    const matchesVehicleType = vehicleFilter === 'all' ||
      safeToLower(application.vehicleType) === safeToLower(vehicleFilter);

    return matchesSearch && matchesVehicleType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgents = filteredAgents.slice(startIndex, endIndex);

  const totalSuperPages = Math.ceil(filteredSuperAgents.length / itemsPerPage);
  const startSuperIndex = (currentPage - 1) * itemsPerPage;
  const endSuperIndex = startSuperIndex + itemsPerPage;
  const currentSuperAgents = filteredSuperAgents.slice(startSuperIndex, endSuperIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const stats = [
    {
      title: 'Total Agents',
      value: agents.length + superAgents.length,
      change: '+12 this week',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Agents',
      value: [...agents, ...superAgents].filter(a => a.status === 'available').length,
      change: '+8 from yesterday',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Pending Applications',
      value: applicationStats.pending || 0,
      change: `${applicationStats.rejected || 0} rejected`,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Total Applications',
      value: applicationStats.total || 0,
      change: `${applicationStats.approved || 0} approved`,
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  // Rejection Modal Component
  const RejectionModal = ({ application, onClose, onReject }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      const finalReason = selectedReason === 'Other (please specify)' ? customReason : selectedReason;

      if (!finalReason.trim()) {
        alert('Please select or enter a rejection reason');
        return;
      }

      setIsSubmitting(true);
      try {
        await onReject(application.id, finalReason);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!application) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Reject Application</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Rejecting application for: <strong>{application.firstName} {application.lastName}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please select a reason for rejection. An email will be sent to the applicant.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Rejection Reason *
              </label>
              {commonRejectionReasons.map((reason, index) => (
                <label key={index} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rejectionReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other (please specify)' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Reason *
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify the reason for rejection..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {customReason.length}/500 characters
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    <span>Reject Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Verification Details Modal
  const VerificationModal = ({ application, onClose, showActions = false }) => {
    if (!application) return null;

    const DocumentDownloadButton = ({ documentType, documentUrl, label }) => {
      const downloadKey = `${application.id}_${documentType}`;
      const isDownloading = downloadingDocuments[downloadKey];
      const hasDocument = Boolean(documentUrl);

      return (
        <button
          onClick={() => handleDocumentDownload(application, documentType, documentUrl)}
          disabled={!hasDocument || isDownloading}
          className={`mt-2 text-sm flex items-center gap-1 mx-auto transition-colors bg-transparent border-none p-0 ${hasDocument
              ? 'text-blue-600 hover:text-blue-800 cursor-pointer disabled:text-blue-400'
              : 'text-gray-400 cursor-not-allowed'
            }`}
          title={hasDocument ? `Download ${label}` : 'Document not available'}
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{hasDocument ? 'Download' : 'Not Available'}</span>
            </>
          )}
        </button>
      );
    };
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Agent Application Details</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* Download All Documents Button */}
                <button
                  onClick={() => handleDownloadAllDocuments(application)}
                  disabled={downloadingDocuments[`${application.id}_all`]}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-blue-400"
                  title="Download all documents as ZIP"
                >
                  {downloadingDocuments[`${application.id}_all`] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <div className="p-2 bg-white rounded border">
                          {application.firstName}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <div className="p-2 bg-white rounded border">
                          {application.lastName}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="p-2 bg-white rounded border flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {application.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="p-2 bg-white rounded border flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {application.phoneNumber}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <div className="p-2 bg-white rounded border">
                          {application.age}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <div className="p-2 bg-white rounded border">
                          {application.gender}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                        <div className="p-2 bg-white rounded border">
                          {application.idType}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="p-2 bg-white rounded border flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <div>{application.address}</div>
                          <div className="text-sm text-gray-600">
                            {application.city}, {application.state} {application.zipCode}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Identity Documents
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Front</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {application.idFrontUrl ? 'Document uploaded' : 'No document'}
                          </p>
                          <DocumentDownloadButton
                            documentType="idFront"
                            documentUrl={application.idFrontUrl}
                            label="ID Front"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Back</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {application.idBackUrl ? 'Document uploaded' : 'No document'}
                          </p>
                          <DocumentDownloadButton
                            documentType="idBack"
                            documentUrl={application.idBackUrl}
                            label="ID Back"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    {getVehicleIcon(application.vehicleType)}
                    Vehicle Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hub</label>
                      <div className="p-2 bg-white rounded border">
                        {application.hubId ? `Hub ${application.hubId}` : 'Not assigned'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <div className="p-2 bg-white rounded border flex items-center gap-2">
                        {getVehicleIcon(application.vehicleType)}
                        {application.vehicleType}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration Number</label>
                      <div className="p-2 bg-white rounded border flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        {application.vehicleRegistration}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Registration Certificate (RC)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {application.vehicleRcUrl ? 'Document uploaded' : 'No document'}
                        </p>
                        <DocumentDownloadButton
                          documentType="vehicleRc"
                          documentUrl={application.vehicleRcUrl}
                          label="Vehicle RC"
                        />
                      </div>
                    </div>

                    {/* Profile Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {application.profileImageUrl ? 'Image uploaded' : 'No image'}
                        </p>
                        <DocumentDownloadButton
                          documentType="profileImage"
                          documentUrl={application.profileImageUrl}
                          label="Profile Image"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Application Status
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                        <div className="p-2 bg-white rounded border">
                          {application.appliedDate}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Documents Status</label>
                        <div className="p-2 bg-white rounded border">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.documents === 'Complete'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {application.documents}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show for pending applications */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {showActions && (
                <>
                  <button
                    onClick={() => {
                      setSelectedApplicationForRejection(application);
                      setShowRejectionModal(true);
                      setShowVerificationModal(false);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle size={16} />
                    <span>Reject Application</span>
                  </button>
                  <button
                    onClick={() => handleVerificationAction(application.id, 'approve')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Approve Application</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, activeTab === 'agents' ? filteredAgents.length : filteredSuperAgents.length)} of {activeTab === 'agents' ? filteredAgents.length : filteredSuperAgents.length} {activeTab === 'agents' ? 'agents' : 'super agents'}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`px-3 py-1 rounded transition-colors ${currentPage === number
                  ? 'bg-blue-900 text-white'
                  : 'border hover:bg-gray-50'
                }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 font-heading">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b bg-white border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('agents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'agents'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Delivery Agents
            </button>
            <button
              onClick={() => handleTabChange('superagents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'superagents'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Super Agents
            </button>
            <button
              onClick={() => handleTabChange('verification')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'verification'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Pending Applications ({pendingApplications.length})
            </button>
            <button
              onClick={() => handleTabChange('rejected')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rejected'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Rejected Applications ({rejectedApplications.length})
            </button>
            <button
              onClick={() => handleTabChange('approved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'approved'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Approved Applications ({approvedApplications.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'agents' && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search agents by name, ID, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="pending">Pending</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent">
                    <option value="all">All Vehicles</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </div>
              </div>

              {/* Agents Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left bg-white rounded-lg border-gray-200">
                      <th className="pb-3 text-sm font-medium text-gray-600">AGENT</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">CONTACT</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">VEHICLE</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">STATUS</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">RATING</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">DELIVERIES</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAgents.map((agent) => (
                      <tr key={agent.id} className="border-b hover:bg-gray-50 bg-white rounded-lg border-gray-200">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {agent.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{agent.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{agent.phone}</p>
                            <p className="text-sm text-gray-600">{agent.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getVehicleIcon(agent.vehicle)}
                            <div>
                              <p className="text-sm font-medium text-slate-900 capitalize">{agent.vehicle}</p>
                              <p className="text-sm text-gray-600">{agent.vehicleId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(agent.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="text-sm font-medium">{agent.rating}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium">{agent.completedDeliveries}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MessageCircle size={16} className="text-blue-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Trash size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {activeTab === 'superagents' && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search super agents by name, ID, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Super Agents Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left bg-white rounded-lg border-gray-200">
                      <th className="pb-3 text-sm font-medium text-gray-600">AGENT</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">CONTACT</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">VEHICLE</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">HUB</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">STATUS</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">RATING</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">DELIVERIES</th>
                      <th className="pb-3 text-sm font-medium text-gray-600">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSuperAgents.map((agent) => (
                      <tr key={agent.id} className="border-b hover:bg-gray-50 bg-white rounded-lg border-gray-200">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {agent.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{agent.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{agent.phone}</p>
                            <p className="text-sm text-gray-600">{agent.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getVehicleIcon(agent.vehicle)}
                            <div>
                              <p className="text-sm font-medium text-slate-900 capitalize">{agent.vehicle}</p>
                              <p className="text-sm text-gray-600">{agent.vehicleId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-600">{agent.hub}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(agent.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="text-sm font-medium">{agent.rating}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium">{agent.completedDeliveries}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MessageCircle size={16} className="text-blue-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Trash size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalSuperPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Pending Agent Applications</h3>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="all">All Applications</option>
                    <option value="complete">Complete Documents</option>
                    <option value="pending">Pending Documents</option>
                  </select>
                  <select
                    value={vehicleFilter}
                    onChange={(e) => setVehicleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="all">All Vehicle Types</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </div>

              {filteredPendingApplications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
                  <p className="text-gray-500">All applications have been processed.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredPendingApplications.length} of {pendingApplications.length} applications
                  </div>
                  {filteredPendingApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-6 hover:bg-gray-50 bg-white border-gray-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold">
                              {application.firstName[0]}{application.lastName[0]}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-lg">
                                {application.firstName} {application.lastName}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Applied: {application.appliedDate}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.documents === 'Complete'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {application.documents}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-6">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowVerificationModal(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'rejected' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Rejected Applications</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                    />
                  </div>
                  <select
                    value={vehicleFilter}
                    onChange={(e) => setVehicleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="all">All Vehicle Types</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </div>

              {filteredRejectedApplications.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Rejected Applications</h3>
                  <p className="text-gray-500">
                    {rejectedApplications.length === 0
                      ? "No applications have been rejected yet."
                      : "No rejected applications match the selected filters."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredRejectedApplications.length} of {rejectedApplications.length} rejected applications
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left bg-gray-50 border-gray-200">
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">APPLICANT</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">CONTACT</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">VEHICLE</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">APPLIED DATE</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">REJECTED DATE</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">REJECTION REASON</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRejectedApplications.map((application) => (
                          <tr key={application.id} className="border-b hover:bg-gray-50 bg-white border-gray-200">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                  {application.firstName[0]}{application.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {application.firstName} {application.lastName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-sm font-medium text-slate-900">{application.phoneNumber}</p>
                                <p className="text-sm text-gray-600">{application.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {getVehicleIcon(application.vehicleType)}
                                <div>
                                  <p className="text-sm font-medium text-slate-900 capitalize">{application.vehicleType}</p>
                                  <p className="text-sm text-gray-600">{application.vehicleRegistration}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-600">{application.appliedDate}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-600">{application.processedDate}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="max-w-[12rem]">
                                <p className="text-sm text-gray-700 truncate" title={application.rejectionReason}>
                                  {application.rejectionReason}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowVerificationModal(true);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded text-blue-600"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  className="p-1 hover:bg-gray-100 rounded text-gray-400"
                                  title="Delete (Not implemented)"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'approved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Approved Applications</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                    />
                  </div>
                  <select
                    value={vehicleFilter}
                    onChange={(e) => setVehicleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="all">All Vehicle Types</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </div>

              {approvedApplications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Approved Applications</h3>
                  <p className="text-gray-500">No applications have been approved yet.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {approvedApplications.length} approved applications
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left bg-gray-50 border-gray-200">
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">APPLICANT</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">CONTACT</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">VEHICLE</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">APPLIED DATE</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">APPROVED DATE</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">STATUS</th>
                          <th className="pb-3 pt-3 px-4 text-sm font-medium text-gray-600">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedApplications.map((application) => (
                          <tr key={application.id} className="border-b hover:bg-gray-50 bg-white border-gray-200">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                  {application.firstName[0]}{application.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {application.firstName} {application.lastName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-sm font-medium text-slate-900">{application.phoneNumber}</p>
                                <p className="text-sm text-gray-600">{application.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {getVehicleIcon(application.vehicleType)}
                                <div>
                                  <p className="text-sm font-medium text-slate-900 capitalize">{application.vehicleType}</p>
                                  <p className="text-sm text-gray-600">{application.vehicleRegistration}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-600">{application.appliedDate}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-600">{application.processedDate}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Approved
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowVerificationModal(true);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded text-blue-600"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showVerificationModal && selectedApplication && (
        <VerificationModal
          application={selectedApplication}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedApplication(null);
          }}
          showActions={activeTab === 'verification'}
        />
      )}

      {showRejectionModal && selectedApplicationForRejection && (
        <RejectionModal
          application={selectedApplicationForRejection}
          onClose={() => {
            setShowRejectionModal(false);
            setSelectedApplicationForRejection(null);
            setRejectionReason('');
          }}
          onReject={(applicationId, reason) => handleVerificationAction(applicationId, 'reject', reason)}
        />
      )}
    </div>
  );
};

export default Agents;