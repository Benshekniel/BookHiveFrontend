import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react'

export default function Notification() {
  const notifications = [
    {
      id: 1,
      type: 'urgent',
      icon: AlertCircle,
      title: 'Route Change Alert',
      message: 'Your delivery route has been updated due to road construction on Main Street.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      icon: Info,
      title: 'Schedule Update',
      message: 'Your shift has been extended by 2 hours today. Please check your updated schedule.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle,
      title: 'Performance Bonus',
      message: 'Congratulations! You\'ve earned a performance bonus for excellent customer ratings.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      icon: Bell,
      title: 'Hub Meeting',
      message: 'Monthly hub meeting scheduled for tomorrow at 9:00 AM in Conference Room A.',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      type: 'urgent',
      icon: AlertCircle,
      title: 'Weather Alert',
      message: 'Heavy rain expected in your delivery area. Please take necessary precautions.',
      time: '2 days ago',
      read: true
    }
  ]

  const getNotificationStyle = (type, read) => {
    const baseStyle = `p-4 rounded-lg border-l-4 ${read ? 'opacity-60' : ''}`
    
    switch (type) {
      case 'urgent':
        return `${baseStyle} bg-red-50 border-l-[#EF4444]`
      case 'success':
        return `${baseStyle} bg-green-50 border-l-[#22C55E]`
      case 'info':
      default:
        return `${baseStyle} bg-blue-50 border-l-[#3B82F6]`
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'text-[#EF4444]'
      case 'success':
        return 'text-[#22C55E]'
      case 'info':
      default:
        return 'text-[#3B82F6]'
    }
  }

  const markAsRead = (id) => {
    // In a real app, this would update the backend
    console.log(`Marking notification ${id} as read`)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">


      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0F172A]/60">Unread</p>
              <p className="text-2xl font-semibold text-[#EF4444]">{unreadCount}</p>
            </div>
            <AlertCircle className="text-[#EF4444]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0F172A]/60">Today</p>
              <p className="text-2xl font-semibold text-[#3B82F6]">2</p>
            </div>
            <Bell className="text-[#3B82F6]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0F172A]/60">This Week</p>
              <p className="text-2xl font-semibold text-[#22C55E]">5</p>
            </div>
            <CheckCircle className="text-[#22C55E]" size={24} />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Recent Notifications
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6">
              <div className={getNotificationStyle(notification.type, notification.read)}>
                <div className="flex items-start space-x-4">
                  <div className={`${getIconColor(notification.type)} mt-1`}>
                    <notification.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-[#0F172A]">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-[#0F172A]/60">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-[#0F172A]/80 mt-1">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-[#3B82F6] hover:text-[#1E3A8A] transition-colors mt-2"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}