import { Users, Package, AlertCircle, CheckCircle } from 'lucide-react'

export default function Hub() {
  const hubStats = [
    { name: 'Total Packages', value: '156', icon: Package, change: '+12%' },
    { name: 'Active Agents', value: '8', icon: Users, change: '+2' },
    { name: 'Pending Requests', value: '4', icon: AlertCircle, change: '-3' },
    { name: 'Completed Today', value: '24', icon: CheckCircle, change: '+8' },
  ]

  const hubActivities = [
    { id: 1, agent: 'Mike Johnson', action: 'Package sorted', time: '5 min ago', status: 'completed' },
    { id: 2, agent: 'Sarah Davis', action: 'Joined hub shift', time: '15 min ago', status: 'active' },
    { id: 3, agent: 'Tom Wilson', action: 'Request to join hub', time: '30 min ago', status: 'pending' },
    { id: 4, agent: 'Lisa Brown', action: 'Completed delivery route', time: '1 hour ago', status: 'completed' },
  ]

  const joinRequests = [
    { id: 1, name: 'Alex Rodriguez', experience: '2 years', rating: 4.8 },
    { id: 2, name: 'Emma Thompson', experience: '1.5 years', rating: 4.9 },
    { id: 3, name: 'David Chen', experience: '3 years', rating: 4.7 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Downtown Hub
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
          <span className="text-sm text-[#0F172A]">Active</span>
        </div>
      </div>

      {/* Hub Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {hubStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0F172A]/60">{stat.name}</p>
                <p className="text-2xl font-semibold text-[#0F172A]">{stat.value}</p>
              </div>
              <div className="text-[#3B82F6]">
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-[#22C55E] font-medium">{stat.change}</span>
              <span className="text-xs text-[#0F172A]/60 ml-1">from yesterday</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hub Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Hub Activities
          </h2>
          <div className="space-y-4">
            {hubActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-[#22C55E]' :
                    activity.status === 'active' ? 'bg-[#3B82F6]' : 'bg-[#FBBF24]'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{activity.agent}</p>
                    <p className="text-xs text-[#0F172A]/60">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-[#0F172A]/60">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Join Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Join Requests
          </h2>
          <div className="space-y-4">
            {joinRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {request.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{request.name}</p>
                    <p className="text-xs text-[#0F172A]/60">{request.experience} experience</p>
                    <p className="text-xs text-[#0F172A]/60">Rating: {request.rating}/5</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-[#22C55E] text-white text-xs rounded-md hover:bg-green-600 transition-colors">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-[#EF4444] text-white text-xs rounded-md hover:bg-red-600 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}