import { useState } from 'react';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Edit, Trash2, Eye, MessageSquare } from 'lucide-react';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  const riders = [
    {
      id: 1,
      agentId: 'A001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 234-567-8901',
      vehicle: 'Motorcycle',
      vehicleNumber: 'ABC-123',
      status: 'active',
      rating: 4.8,
      deliveries: 247
    },
    {
      id: 2,
      agentId: 'A002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 234-567-8902',
      vehicle: 'Bicycle',
      vehicleNumber: 'BIC-456',
      status: 'active',
      rating: 4.9,
      deliveries: 189
    },
    {
      id: 3,
      agentId: 'A003',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 234-567-8903',
      vehicle: 'Scooter',
      vehicleNumber: 'SCT-789',
      status: 'inactive',
      rating: 4.6,
      deliveries: 156
    },
    {
      id: 4,
      agentId: 'A004',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 234-567-8904',
      vehicle: 'Motorcycle',
      vehicleNumber: 'MOT-321',
      status: 'active',
      rating: 4.7,
      deliveries: 203
    },
    {
      id: 5,
      agentId: 'A005',
      name: 'Alex Brown',
      email: 'alex.brown@email.com',
      phone: '+1 234-567-8905',
      vehicle: 'Van',
      vehicleNumber: 'VAN-654',
      status: 'active',
      rating: 4.5,
      deliveries: 134
    }
  ];

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.agentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search riders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm outline-none focus:outline-blue-500"
        />
      </div>

      {/* Riders Table */}
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
                      {rider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-slate-900 text-sm m-0">{rider.name}</p>
                      <p className="text-xs text-gray-500 m-0">{rider.agentId}</p>
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
                    <p className="text-[14px] font-medium text-slate-900 m-0">{rider.vehicle}</p>
                    <p className="text-xs text-gray-500 m-0">{rider.vehicleNumber}</p>
                  </div>
                </td>
                <td className="px-3 py-4 align-middle">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${rider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {rider.status}
                  </span>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-900">{rider.rating}</span>
                    <span className="text-yellow-400 text-sm">★</span>
                  </div>
                </td>
                <td className="px-3 py-4 align-middle">
                  <span className="font-semibold text-slate-900 text-base">{rider.deliveries}</span>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-md bg-blue-100 text-blue-900 hover:bg-blue-200 transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      title="Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      title="More Options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents;
