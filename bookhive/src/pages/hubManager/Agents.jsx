import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import { agentApi } from '../../services/apiService';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents from backend
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await agentApi.getAllAgents();
        
        console.log('Backend response:', response); // Debug log
        
        // Transform backend data to match frontend structure
        const transformedAgents = response.map(agent => {
          console.log('Processing agent:', agent); // Debug log
          
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
            if (agent.trustScore !== undefined && agent.trustScore !== null) return agent.trustScore / 20.0;
            return 0;
          };

          // Handle deliveries count with fallbacks
          const getDeliveries = () => {
            if (agent.totalDeliveries !== undefined && agent.totalDeliveries !== null) return agent.totalDeliveries;
            if (agent.numberOfDelivery !== undefined && agent.numberOfDelivery !== null) return agent.numberOfDelivery;
            if (agent.deliveries !== undefined && agent.deliveries !== null) return agent.deliveries;
            return 0;
          };

          const transformedAgent = {
            id: agent.agentId || agent.id,
            agentId: agent.agentId || `A${String(agent.id || agent.agentId).padStart(3, '0')}`,
            name: getName(),
            email: getEmail(),
            phone: getPhone(),
            vehicle: getVehicleType(),
            vehicleNumber: agent.vehicleNumber || 'N/A',
            status: getStatus(),
            rating: getRating(),
            deliveries: getDeliveries(),
            trustScore: agent.trustScore || 0,
            hubName: agent.hubName || 'Unknown Hub'
          };

          console.log('Transformed agent:', transformedAgent); // Debug log
          return transformedAgent;
        });
        
        setRiders(transformedAgents);
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
      setRiders(prevRiders => 
        prevRiders.map(rider => 
          rider.id === agentId 
            ? { ...rider, status: newStatus.toLowerCase() }
            : rider
        )
      );
    } catch (err) {
      console.error('Error updating agent status:', err);
      alert('Failed to update agent status');
    }
  };

  // Fixed filtering logic with proper null checks
  const filteredRiders = riders.filter(rider => {
    // Safe string operations with null checks
    const safeToLower = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str.toLowerCase();
    };

    const name = safeToLower(rider.name);
    const email = safeToLower(rider.email);
    const phone = safeToLower(rider.phone);
    const agentId = safeToLower(rider.agentId);
    const searchLower = safeToLower(searchTerm);

    console.log('Filtering rider:', { name, email, phone, agentId, searchLower }); // Debug log

    const matchesSearch = searchTerm === '' || 
                         name.includes(searchLower) ||
                         email.includes(searchLower) ||
                         phone.includes(searchLower) ||
                         agentId.includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || 
                         rider.status === statusFilter;
    
    const result = matchesSearch && matchesStatus;
    console.log('Filter result:', { matchesSearch, matchesStatus, result }); // Debug log
    
    return result;
  });

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
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Agents Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">AGENT</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">CONTACT</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">VEHICLE</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">STATUS</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">RATING</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">DELIVERIES</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredRiders.map((rider) => (
              <tr
                key={rider.id}
                className="border-b border-gray-100 transition-colors hover:bg-slate-50"
              >
                <td className="px-3 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-semibold text-slate-900 flex-shrink-0">
                      {rider.name && rider.name.split(' ').length > 0 
                        ? rider.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        : 'A'
                      }
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-slate-900 text-sm m-0">{rider.name}</p>
                      {/* <p className="text-xs text-gray-500 m-0">ID: {rider.agentId}</p> */}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] text-gray-500 m-0">{rider.phone}</p>
                    <p className="text-[13px] text-gray-500 m-0">{rider.email}</p>
                  </div>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-medium text-slate-900 m-0 capitalize">{rider.vehicle}</p>
                    <p className="text-xs text-gray-500 m-0">{rider.vehicleNumber}</p>
                  </div>
                </td>
                <td className="px-3 py-4 align-middle">
                  <button
                    onClick={() => updateAgentStatus(rider.id, rider.status === 'available' ? 'unavailable' : 'available')}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                      rider.status === 'available' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {rider.status}
                  </button>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-900">{rider.rating.toFixed(1)}</span>
                    <span className="text-yellow-400 text-sm">★</span>
                  </div>
                </td>
                <td className="px-3 py-4 align-middle">
                  <span className="font-semibold text-slate-900 text-base">{rider.deliveries}</span>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      title="Message"
                      onClick={() => console.log('Message agent:', rider.id)}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRiders.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No agents found matching your search criteria.</p>
          {searchTerm && (
            <p className="text-gray-400 text-sm mt-2">
              Try searching for: name, email, phone, or agent ID
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Agents;