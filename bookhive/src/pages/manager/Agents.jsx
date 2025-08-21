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
  CreditCard
} from 'lucide-react';
import { agentApi } from '../../services/deliveryService';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Fetch agents from backend
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await agentApi.getAllAgents();
        
        // Transform backend data to match frontend structure
        const transformedAgents = response.map(agent => {
          // Handle name field with multiple fallbacks
          const getName = () => {
            if (agent.name) return agent.name;
            if (agent.userName) return agent.userName;
            if (agent.firstName && agent.lastName) return `${agent.firstName} ${agent.lastName}`;
            if (agent.firstName) return agent.firstName;
            if (agent.lastName) return agent.lastName;
            return 'Unknown Agent';
          };

          // Handle email field with fallbacks
          const getEmail = () => {
            if (agent.email) return agent.email;
            if (agent.userEmail) return agent.userEmail;
            return 'No email';
          };

          // Handle phone field with fallbacks
          const getPhone = () => {
            if (agent.phoneNumber) return agent.phoneNumber;
            if (agent.userPhone) return agent.userPhone;
            if (agent.phone) return agent.phone;
            return 'No phone';
          };

          // Handle vehicle type with fallbacks
          const getVehicleType = () => {
            if (agent.vehicleType) {
              // Handle enum values
              if (typeof agent.vehicleType === 'string') {
                return agent.vehicleType.toLowerCase().replace('_', ' ');
              }
              return agent.vehicleType.toString().toLowerCase().replace('_', ' ');
            }
            return 'Not specified';
          };

          // Handle availability status with fallbacks
          const getStatus = () => {
            if (agent.availabilityStatus) {
              if (typeof agent.availabilityStatus === 'string') {
                return agent.availabilityStatus.toLowerCase();
              }
              return agent.availabilityStatus.toString().toLowerCase();
            }
            return 'unavailable';
          };

          // Handle rating with fallbacks
          const getRating = () => {
            if (agent.trustScore !== undefined && agent.trustScore !== null) return agent.trustScore;
            if (agent.rating !== undefined && agent.rating !== null) return agent.rating / 20.0;
            return 0;
          };

          // Handle deliveries count with fallbacks
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
        });

        // Separate regular agents and super agents based on vehicle type or other criteria
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

        // Enhanced pending applications with detailed information
        setPendingApplications([
          {
            id: 'PA001',
            firstName: 'Lahiru',
            lastName: 'Jayasinghe',
            email: 'lahiru.jayasinghe@email.com',
            phone: '+94 75 123 4567',
            address: '123 Main Street, Colombo 07',
            city: 'Colombo',
            state: 'Western Province',
            zipCode: '00700',
            age: 28,
            gender: 'Male',
            idType: 'NIC',
            idFront: 'lahiru_nic_front.jpg',
            idBack: 'lahiru_nic_back.jpg',
            hub: 'Colombo Central Hub',
            vehicleType: 'Car',
            vehicleId: 'WP-MN-0123',
            vehicleRC: 'lahiru_vehicle_rc.pdf',
            appliedDate: '2025-01-18',
            documents: 'Complete',
            status: 'pending',
            profileImage: null
          },
          {
            id: 'PA002',
            firstName: 'Sachini',
            lastName: 'Rathnayake',
            email: 'sachini.rathnayake@email.com',
            phone: '+94 78 234 5678',
            address: '456 Galle Road, Colombo 03',
            city: 'Colombo',
            state: 'Western Province',
            zipCode: '00300',
            age: 25,
            gender: 'Female',
            idType: 'Passport',
            idFront: 'sachini_passport_front.jpg',
            idBack: 'sachini_passport_back.jpg',
            hub: 'Colombo Central Hub',
            vehicleType: 'Motorcycle',
            vehicleId: 'CP-OP-4567',
            vehicleRC: 'sachini_vehicle_rc.pdf',
            appliedDate: '2025-01-17',
            documents: 'Pending',
            status: 'pending',
            profileImage: null
          },
          {
            id: 'PA003',
            firstName: 'Darshana',
            lastName: 'Kumara',
            email: 'darshana.kumara@email.com',
            phone: '+94 76 345 6789',
            address: '789 Kandy Road, Kelaniya',
            city: 'Kelaniya',
            state: 'Western Province',
            zipCode: '11600',
            age: 32,
            gender: 'Male',
            idType: 'NIC',
            idFront: 'darshana_nic_front.jpg',
            idBack: 'darshana_nic_back.jpg',
            hub: 'Colombo Central Hub',
            vehicleType: 'Bicycle',
            vehicleId: 'BIC-789',
            vehicleRC: 'darshana_vehicle_rc.pdf',
            appliedDate: '2025-01-16',
            documents: 'Complete',
            status: 'pending',
            profileImage: null
          }
        ]);
        
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Update agent status
  const updateAgentStatus = async (agentId, newStatus) => {
    try {
      const statusEnum = newStatus.toUpperCase(); // Convert to enum format
      await agentApi.updateAgentStatus(agentId, statusEnum);
      
      // Update local state with the new status
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: newStatus.toLowerCase() }
            : agent
        )
      );
    } catch (err) {
      console.error('Error updating agent status:', err);
      alert('Failed to update agent status');
    }
  };

  const handleVerificationAction = async (applicationId, action) => {
    try {
      // Here you would call your backend API to approve/reject the application
      // await agentApi.updateApplicationStatus(applicationId, action);
      
      // Update local state to remove the processed application
      setPendingApplications(prev => 
        prev.filter(app => app.id !== applicationId)
      );
      
      setShowVerificationModal(false);
      setSelectedApplication(null);
      
      alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing application:`, err);
      alert(`Failed to ${action} application`);
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

  const filteredAgents = agents.filter(agent => {
    // Safe string operations with null checks
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
    // Safe string operations with null checks
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

  // Filter pending applications - MOVED TO CORRECT LOCATION
  const filteredPendingApplications = pendingApplications.filter(application => {
    const safeToLower = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.toLowerCase();
    };

    // Document status filter
    const matchesDocumentStatus = selectedFilter === 'all' || 
      (selectedFilter === 'complete' && application.documents === 'Complete') ||
      (selectedFilter === 'pending' && application.documents === 'Pending');

    // Vehicle type filter
    const matchesVehicleType = vehicleFilter === 'all' || 
      safeToLower(application.vehicleType) === safeToLower(vehicleFilter);

    // Hub filter
    const matchesHub = hubFilter === 'all' || 
      safeToLower(application.hub).includes(safeToLower(hubFilter));

    return matchesDocumentStatus && matchesVehicleType && matchesHub;
  });

  // Pagination logic for agents
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgents = filteredAgents.slice(startIndex, endIndex);

  // Pagination logic for super agents
  const totalSuperPages = Math.ceil(filteredSuperAgents.length / itemsPerPage);
  const startSuperIndex = (currentPage - 1) * itemsPerPage;
  const endSuperIndex = startSuperIndex + itemsPerPage;
  const currentSuperAgents = filteredSuperAgents.slice(startSuperIndex, endSuperIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
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
      title: 'Pending Verification',
      value: pendingApplications.length,
      change: '7 awaiting review',
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Online Now',
      value: [...agents, ...superAgents].filter(a => a.status === 'available').length,
      change: 'Updated 2 mins ago',
      icon: UserCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ];

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
              className={`px-3 py-1 rounded transition-colors ${
                currentPage === number 
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

  // Verification Details Modal
  const VerificationModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Agent Application Details</h2>
                <p className="text-sm text-gray-600 mt-1">Application ID: {application.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
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
                        {application.phone}
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
                          <p className="text-sm text-gray-600">{application.idFront}</p>
                          <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mx-auto">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Back</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">{application.idBack}</p>
                          <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mx-auto">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
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
                        {application.hub}
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
                        {application.vehicleId}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Registration Certificate (RC)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">{application.vehicleRC}</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mx-auto">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.documents === 'Complete' 
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

            {/* Terms and Conditions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>I agree to the Terms and Conditions</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    By creating an account, applicant agreed to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleVerificationAction(application.id, 'reject')}
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
            </div>
          </div>
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
              Verify Applications ({pendingApplications.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'agents' && (
            <>
              {/* Filters and Search */}
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
                              {/* <p className="text-sm text-gray-600">{agent.id}</p> */}
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
              {/* Filters and Search */}
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
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent">
                    <option value="all">All Vehicles</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="car">Car</option>
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
                      <th className="pb-3 text-sm font-medium text-gray-600">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSuperAgents.map((superAgent) => (
                      <tr key={superAgent.id} className="border-b hover:bg-gray-50 bg-white rounded-lg border-gray-200">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {superAgent.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{superAgent.name}</p>
                              {/* <p className="text-sm text-gray-600">{superAgent.id}</p> */}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{superAgent.phone}</p>
                            <p className="text-sm text-gray-600">{superAgent.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getVehicleIcon(superAgent.vehicle)}
                            <div>
                              <p className="text-sm font-medium text-slate-900 capitalize">{superAgent.vehicle}</p>
                              <p className="text-sm text-gray-600">{superAgent.vehicleId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium text-slate-900">{superAgent.hub}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(superAgent.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(superAgent.status)}`}>
                              {superAgent.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="text-sm font-medium">{superAgent.rating}</span>
                          </div>
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
                  <select
                    value={hubFilter}
                    onChange={(e) => setHubFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="all">All Hubs</option>
                    <option value="colombo">Colombo Central Hub</option>
                    <option value="kandy">Kandy Hub</option>
                    <option value="galle">Galle Hub</option>
                    <option value="negombo">Negombo Hub</option>
                    <option value="matara">Matara Hub</option>
                  </select>
                </div>
              </div>
              
              {filteredPendingApplications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-500">
                    {pendingApplications.length === 0 
                      ? "All agent applications have been processed." 
                      : "No applications match the selected filters. Try adjusting your filter criteria."}
                  </p>
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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  application.documents === 'Complete' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {application.documents}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{application.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">{application.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getVehicleIcon(application.vehicleType)}
                              <span className="text-gray-600">Vehicle:</span>
                              <span className="font-medium">{application.vehicleType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium">{application.city}</span>
                            </div>
                          </div> */}
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
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedApplication && (
        <VerificationModal
          application={selectedApplication}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default Agents;