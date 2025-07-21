import { useState } from 'react';
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
  Trash
} from 'lucide-react';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('agents');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const agents = [
    {
      id: 'A001',
      name: 'Nuwan Perera',
      phone: '+94 71 234 5678',
      email: 'nuwan.perera@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'CAB-1234',
      status: 'Active',
      rating: 4.8,
      completedDeliveries: 247,
      avatar: 'NP'
    },
    {
      id: 'A002',
      name: 'Sanduni Fernando',
      phone: '+94 77 345 6789',
      email: 'sanduni.f@email.com',
      vehicle: 'Car',
      vehicleId: 'WP-AB-1567',
      status: 'Pending',
      rating: 4.6,
      completedDeliveries: 189,
      avatar: 'SF'
    },
    {
      id: 'A003',
      name: 'Kasun Silva',
      phone: '+94 76 456 7890',
      email: 'kasun.s@email.com',
      vehicle: 'Bicycle',
      vehicleId: 'BIC-789',
      status: 'Offline',
      rating: 4.9,
      completedDeliveries: 156,
      avatar: 'KS'
    },
    {
      id: 'A004',
      name: 'Dilani Rajapaksa',
      phone: '+94 70 567 8901',
      email: 'dilani.rajapaksa@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'CBK-4567',
      status: 'Active',
      rating: 4.7,
      completedDeliveries: 278,
      avatar: 'DR'
    },
    {
      id: 'A005',
      name: 'Chamara Wickramasinghe',
      phone: '+94 75 678 9012',
      email: 'chamara.w@email.com',
      vehicle: 'Car',
      vehicleId: 'WP-CD-2890',
      status: 'Active',
      rating: 4.5,
      completedDeliveries: 205,
      avatar: 'CW'
    },
    {
      id: 'A006',
      name: 'Tharaka Bandara',
      phone: '+94 78 789 0123',
      email: 'tharaka.b@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'GAL-8901',
      status: 'Offline',
      rating: 4.6,
      completedDeliveries: 167,
      avatar: 'TB'
    }
  ];

  const superAgents = [
    {
      id: 'SA001',
      name: 'Pradeep Gunasekara',
      phone: '+94 71 234 5678',
      email: 'pradeep.gunasekara@email.com',
      vehicle: 'Truck',
      vehicleId: 'WP-EF-3456',
      hub: 'Colombo Central Hub',
      status: 'Active',
      avatar: 'PG'
    },
    {
      id: 'SA002',
      name: 'Malini Wijesinghe',
      phone: '+94 77 345 6789',
      email: 'malini.w@email.com',
      vehicle: 'Van',
      vehicleId: 'KE-GH-7890',
      hub: 'Kandy Hub',
      status: 'Pending',
      avatar: 'MW'
    },
    {
      id: 'SA003',
      name: 'Roshan Karunaratne',
      phone: '+94 76 456 7890',
      email: 'roshan.k@email.com',
      vehicle: 'Truck',
      vehicleId: 'GL-IJ-2345',
      hub: 'Galle Hub',
      status: 'Offline',
      avatar: 'RK'
    },
    {
      id: 'SA004',
      name: 'Nayomi Dissanayake',
      phone: '+94 70 567 8901',
      email: 'nayomi.dissanayake@email.com',
      vehicle: 'Van',
      vehicleId: 'MT-KL-6789',
      hub: 'Matara Hub',
      status: 'Active',
      avatar: 'ND'
    },
  ];

  const stats = [
    {
      title: 'Total Agents',
      value: '147',
      change: '+12 this week',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Agents',
      value: '125',
      change: '+8 from yesterday',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Pending Verification',
      value: '22',
      change: '7 awaiting review',
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Online Now',
      value: '89',
      change: 'Updated 2 mins ago',
      icon: UserCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ];

  const pendingApplications = [
    {
      id: 'PA001',
      name: 'Lahiru Jayasinghe',
      phone: '+94 75 123 4567',
      email: 'lahiru.jayasinghe@email.com',
      vehicle: 'Car',
      vehicleId: 'WP-MN-0123',
      appliedDate: '2025-01-18',
      documents: 'Complete'
    },
    {
      id: 'PA002',
      name: 'Sachini Rathnayake',
      phone: '+94 78 234 5678',
      email: 'sachini.rathnayake@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'CP-OP-4567',
      appliedDate: '2025-01-17',
      documents: 'Pending'
    },
    {
      id: 'PA003',
      name: 'Darshana Kumara',
      phone: '+94 76 345 6789',
      email: 'darshana.kumara@email.com',
      vehicle: 'Car',
      vehicleId: 'SG-QR-8901',
      appliedDate: '2025-01-16',
      documents: 'Complete'
    }
  ];

  const getVehicleIcon = (vehicle) => {
    switch (vehicle) {
      case 'Motorcycle':
      case 'Bike':
      case 'Bicycle':
        return <Bike size={16} />;
      case 'Truck':
        return <Truck size={16} />;
      default:
        return <Car size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600 text-white';
      case 'Pending':
        return 'bg-yellow-400 text-white';
      case 'Offline':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Pending':
        return <Clock size={16} className="text-yellow-400" />;
      case 'Offline':
        return <XCircle size={16} className="text-gray-400" />;
      default:
        return <XCircle size={16} className="text-gray-400" />;
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || agent.status.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredSuperAgents = superAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || agent.status.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
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

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'Active').length;
  const pendingVerification = agents.filter(a => a.status === 'Pending').length + pendingApplications.length;
  const onlineNow = agents.filter(a => a.status === 'Active').length;

  const totalsuperAgents = superAgents.length;
  const activeSuperAgents = superAgents.filter(a => a.status === 'Active').length;
  const pendingVerificationSuper = superAgents.filter(a => a.status === 'Pending').length + pendingApplications.length;
  const onlineNowSuper = superAgents.filter(a => a.status === 'Active').length;

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
              Verify Applications
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
                    <option value="active">Active</option>
                    <option value="offline">Offline</option>
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
                              <p className="text-sm text-gray-600">{agent.id}</p>
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
                              <p className="text-sm font-medium text-slate-900">{agent.vehicle}</p>
                              <p className="text-sm text-gray-600">{agent.vehicleId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(agent.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
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
                    <option value="active">Active</option>
                    <option value="offline">Offline</option>
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
                    {filteredSuperAgents.map((superAgent) => (
                      <tr key={superAgent.id} className="border-b hover:bg-gray-50 bg-white rounded-lg border-gray-200">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {superAgent.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{superAgent.name}</p>
                              <p className="text-sm text-gray-600">{superAgent.id}</p>
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
                              <p className="text-sm font-medium text-slate-900">{superAgent.vehicle}</p>
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(superAgent.status)}`}>
                              {superAgent.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="text-sm font-medium">4.7</span>
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
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Agent Applications</h3>
              {pendingApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 bg-white rounded-lg border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-slate-900">{application.name}</h4>
                        <span className="text-sm text-gray-600">{application.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.documents === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {application.documents}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Contact: </span>
                          <span className="font-medium">{application.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Vehicle: </span>
                          <span className="font-medium">{application.vehicle} ({application.vehicleId})</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Applied: </span>
                          <span className="font-medium">{application.appliedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                        <CheckCircle size={16} />
                        <span>Approve</span>
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                        <XCircle size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agents;