import { Bell, Package, MapPin, Clock } from 'lucide-react'

export default function Home() {
  const stats = [
    { name: 'Pending Deliveries', value: '12', icon: Package, color: 'text-[#3B82F6]' },
    { name: 'Active Notifications', value: '3', icon: Bell, color: 'text-[#EF4444]' },
    { name: 'Hub Activities', value: '8', icon: MapPin, color: 'text-[#22C55E]' },
    { name: 'Hours Today', value: '6.5', icon: Clock, color: 'text-[#FBBF24]' },
  ]

  const recentActivities = [
    { id: 1, type: 'delivery', message: 'Package delivered to 123 Main St', time: '10 min ago' },
    { id: 2, type: 'notification', message: 'New delivery assigned', time: '25 min ago' },
    { id: 3, type: 'hub', message: 'Hub maintenance scheduled', time: '1 hour ago' },
    { id: 4, type: 'delivery', message: 'Customer message received', time: '2 hours ago' },
  ]

  const pendingTasks = [
    { id: 1, address: '456 Oak Avenue', priority: 'high', time: '11:30 AM' },
    { id: 2, address: '789 Pine Street', priority: 'medium', time: '2:15 PM' },
    { id: 3, address: '321 Elm Drive', priority: 'low', time: '4:00 PM' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Welcome back, John!
        </h1>
        <div className="text-sm text-[#0F172A]/60">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#0F172A]/60">{stat.name}</p>
                <p className="text-2xl font-semibold text-[#0F172A]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-[#0F172A]">{activity.message}</p>
                  <p className="text-xs text-[#0F172A]/60 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Pending Deliveries
          </h2>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-[#EF4444]' :
                    task.priority === 'medium' ? 'bg-[#FBBF24]' : 'bg-[#22C55E]'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{task.address}</p>
                    <p className="text-xs text-[#0F172A]/60">Scheduled: {task.time}</p>
                  </div>
                </div>
                <button className="text-[#3B82F6] hover:text-[#1E3A8A] transition-colors">
                  <MapPin size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}