import { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Star, 
  Car, 
  Bike,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('agents');

  const agents = [
    {
      id: 'A001',
      name: 'John Smith',
      phone: '+1 234-567-8901',
      email: 'john.smith@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'ABC-123',
      status: 'Active',
      rating: 4.8,
      completedDeliveries: 247,
      avatar: 'JS'
    },
    {
      id: 'A002',
      name: 'Sarah Johnson',
      phone: '+1 234-567-8902',
      email: 'sarah.j@email.com',
      vehicle: 'Car',
      vehicleId: 'XYZ-456',
      status: 'Pending',
      rating: 4.6,
      completedDeliveries: 189,
      avatar: 'SJ'
    },
    {
      id: 'A003',
      name: 'Mike Wilson',
      phone: '+1 234-567-8903',
      email: 'mike.w@email.com',
      vehicle: 'Bicycle',
      vehicleId: 'BIC-789',
      status: 'Offline',
      rating: 4.9,
      completedDeliveries: 156,
      avatar: 'MW'
    },
    {
      id: 'A004',
      name: 'Lisa Brown',
      phone: '+1 234-567-8904',
      email: 'lisa.brown@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'MOT-321',
      status: 'Active',
      rating: 4.7,
      completedDeliveries: 278,
      avatar: 'LB'
    },
  ];

  const pendingApplications = [
    {
      id: 'PA001',
      name: 'David Chen',
      phone: '+1 234-567-8905',
      email: 'david.chen@email.com',
      vehicle: 'Car',
      vehicleId: 'NEW-001',
      appliedDate: '2024-01-15',
      documents: 'Complete'
    },
    {
      id: 'PA002',
      name: 'Emma Davis',
      phone: '+1 234-567-8906',
      email: 'emma.davis@email.com',
      vehicle: 'Motorcycle',
      vehicleId: 'NEW-002',
      appliedDate: '2024-01-14',
      documents: 'Pending'
    }
  ];

  const getVehicleIcon = (vehicle) => {
    switch (vehicle) {
      case 'Motorcycle':
      case 'Bike':
        return <Bike size={16} />;
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

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'Active').length;
  const pendingVerification = agents.filter(a => a.status === 'Pending').length + pendingApplications.length;
  const onlineNow = agents.filter(a => a.status === 'Active').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Agents Management</h2>
          <p className="text-gray-600">Manage delivery agents and their performance</p>
        </div>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="text-blue-600" size={20} />
            <span className="font-medium text-sm">Total Agents</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalAgents}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-medium text-sm">Active Agents</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeAgents}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="text-yellow-400" size={20} />
            <span className="font-medium text-sm">Pending Verification</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingVerification}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-2 mb-2">
            <UserCheck className="text-blue-600" size={20} />
            <span className="font-medium text-sm">Online Now</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{onlineNow}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'agents'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Delivery Agents
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'verification'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Verify Applications
            </button>
            <button
              onClick={() => setActiveTab('suspend')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'suspend'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Suspend Agent
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
                    <tr className="border-b text-left">
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
                    {filteredAgents.map((agent) => (
                      <tr key={agent.id} className="border-b hover:bg-gray-50">
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
                              <MoreHorizontal size={16} className="text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Showing 1 to {filteredAgents.length} of {totalAgents} agents</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
                  <button className="px-3 py-1 bg-blue-900 text-white rounded">1</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Agent Applications</h3>
              {pendingApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-slate-900">{application.name}</h4>
                        <span className="text-sm text-gray-600">{application.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.documents === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
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

          {activeTab === 'suspend' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Suspend Agent</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-yellow-400" size={20} />
                  <p className="text-sm text-yellow-800">
                    Suspending an agent will immediately disable their access and stop all active deliveries.
                  </p>
                </div>
              </div>
              {agents.filter(a => a.status === 'Active').map((agent) => (
                <div key={agent.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {agent.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{agent.name}</h4>
                        <p className="text-sm text-gray-600">{agent.id} • {agent.completedDeliveries} deliveries</p>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                      <UserX size={16} />
                      <span>Suspend</span>
                    </button>
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