import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Package, Filter, Search, Eye, Navigation, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

export default function Tasks() {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState(null)

  const tasks = [
    {
      id: 'DEL-001',
      date: '2024-01-25',
      time: '09:30 AM',
      pickupLocation: 'Downtown Hub - 123 Main St',
      dropoffLocation: '456 Oak Avenue, Apt 2B',
      customer: 'Jane Smith',
      phone: '+1 (555) 123-4567',
      status: 'in-progress',
      priority: 'high',
      packageType: 'Electronics',
      weight: '2.5 lbs',
      estimatedTime: '15 min',
      earnings: 25.50,
      notes: 'Customer prefers front door delivery',
      issues: []
    },
    {
      id: 'DEL-002',
      date: '2024-01-25',
      time: '11:00 AM',
      pickupLocation: 'Westside Warehouse - 789 Industrial Blvd',
      dropoffLocation: '321 Pine Street, Suite 100',
      customer: 'Mike Johnson',
      phone: '+1 (555) 987-6543',
      status: 'upcoming',
      priority: 'medium',
      packageType: 'Documents',
      weight: '0.5 lbs',
      estimatedTime: '20 min',
      earnings: 18.75,
      notes: 'Business delivery - ask for reception',
      issues: []
    },
    {
      id: 'DEL-003',
      date: '2024-01-25',
      time: '08:15 AM',
      pickupLocation: 'Central Hub - 555 Commerce Ave',
      dropoffLocation: '987 Elm Drive, House #12',
      customer: 'Sarah Davis',
      phone: '+1 (555) 456-7890',
      status: 'completed',
      priority: 'low',
      packageType: 'Clothing',
      weight: '1.2 lbs',
      estimatedTime: '12 min',
      actualTime: '10 min',
      earnings: 22.00,
      notes: 'Left at front door as requested',
      issues: [],
      completedAt: '08:25 AM',
      customerRating: 5
    },
    {
      id: 'DEL-004',
      date: '2024-01-24',
      time: '03:45 PM',
      pickupLocation: 'Northside Hub - 246 Market St',
      dropoffLocation: '159 Maple Lane, Apt 5A',
      customer: 'Tom Wilson',
      phone: '+1 (555) 321-0987',
      status: 'completed',
      priority: 'high',
      packageType: 'Food',
      weight: '3.1 lbs',
      estimatedTime: '18 min',
      actualTime: '22 min',
      earnings: 28.25,
      notes: 'Customer was not available initially',
      issues: ['Customer unavailable on first attempt'],
      completedAt: '04:07 PM',
      customerRating: 4
    },
    {
      id: 'DEL-005',
      date: '2024-01-24',
      time: '01:20 PM',
      pickupLocation: 'Downtown Hub - 123 Main St',
      dropoffLocation: '753 Cedar Court, Unit B',
      customer: 'Lisa Brown',
      phone: '+1 (555) 654-3210',
      status: 'completed',
      priority: 'medium',
      packageType: 'Books',
      weight: '4.0 lbs',
      estimatedTime: '25 min',
      actualTime: '23 min',
      earnings: 30.00,
      notes: 'Heavy package - used cart',
      issues: [],
      completedAt: '01:43 PM',
      customerRating: 5
    }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter
    const matchesSearch = task.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-[#22C55E] bg-green-50 border-[#22C55E]'
      case 'in-progress':
        return 'text-[#3B82F6] bg-blue-50 border-[#3B82F6]'
      case 'upcoming':
        return 'text-[#FBBF24] bg-yellow-50 border-[#FBBF24]'
      default:
        return 'text-gray-500 bg-gray-50 border-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-[#EF4444] bg-red-50'
      case 'medium':
        return 'text-[#FBBF24] bg-yellow-50'
      case 'low':
        return 'text-[#22C55E] bg-green-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />
      case 'in-progress':
        return <Navigation size={16} />
      case 'upcoming':
        return <Clock size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const handleViewDetails = (task) => {
    setSelectedTask(task)
  }

  const handleNavigateToDelivery = (taskId) => {
    navigate('/delivery')
  }

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    upcoming: tasks.filter(t => t.status === 'upcoming').length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Task Management
        </h1>
        <div className="flex items-center space-x-2">
          <Calendar className="text-[#3B82F6]" size={20} />
          <span className="text-sm text-[#0F172A]">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Total Tasks</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{taskCounts.all}</p>
            </div>
            <Package className="text-[#3B82F6]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Completed</p>
              <p className="text-2xl font-semibold text-[#22C55E]">{taskCounts.completed}</p>
            </div>
            <CheckCircle className="text-[#22C55E]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">In Progress</p>
              <p className="text-2xl font-semibold text-[#3B82F6]">{taskCounts['in-progress']}</p>
            </div>
            <Navigation className="text-[#3B82F6]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Upcoming</p>
              <p className="text-2xl font-semibold text-[#FBBF24]">{taskCounts.upcoming}</p>
            </div>
            <Clock className="text-[#FBBF24]" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-[#3B82F6]" size={20} />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm"
              >
                <option value="all">All Tasks ({taskCounts.all})</option>
                <option value="completed">Completed ({taskCounts.completed})</option>
                <option value="in-progress">In Progress ({taskCounts['in-progress']})</option>
                <option value="upcoming">Upcoming ({taskCounts.upcoming})</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="text-[#3B82F6]" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Tasks ({filteredTasks.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-6 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-[#0F172A]">{task.id}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-[#22C55E]" size={16} />
                        <div>
                          <p className="text-xs text-[#0F172A]/60">Pickup</p>
                          <p className="text-sm text-[#0F172A]">{task.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-[#EF4444]" size={16} />
                        <div>
                          <p className="text-xs text-[#0F172A]/60">Drop-off</p>
                          <p className="text-sm text-[#0F172A]">{task.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="text-[#3B82F6]" size={16} />
                        <div>
                          <p className="text-xs text-[#0F172A]/60">Scheduled</p>
                          <p className="text-sm text-[#0F172A]">{task.date} at {task.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="text-[#FBBF24]" size={16} />
                        <div>
                          <p className="text-xs text-[#0F172A]/60">Package</p>
                          <p className="text-sm text-[#0F172A]">{task.packageType} ({task.weight})</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-[#0F172A]/60">
                      <span>Customer: {task.customer}</span>
                      <span>Earnings: ${task.earnings}</span>
                      {task.status === 'completed' && task.customerRating && (
                        <span className="flex items-center space-x-1">
                          <span>Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < task.customerRating ? 'text-[#FBBF24]' : 'text-gray-300'}>★</span>
                            ))}
                          </div>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(task)}
                    className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => handleNavigateToDelivery(task.id)}
                      className="px-3 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Track Delivery
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  Task Details - {selectedTask.id}
                </h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-[#0F172A]/60 hover:text-[#0F172A] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[#0F172A]/60">Date:</span> {selectedTask.date}</p>
                    <p><span className="text-[#0F172A]/60">Time:</span> {selectedTask.time}</p>
                    <p><span className="text-[#0F172A]/60">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </p>
                    <p><span className="text-[#0F172A]/60">Priority:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[#0F172A]/60">Name:</span> {selectedTask.customer}</p>
                    <p><span className="text-[#0F172A]/60">Phone:</span> {selectedTask.phone}</p>
                    <p><span className="text-[#0F172A]/60">Package:</span> {selectedTask.packageType}</p>
                    <p><span className="text-[#0F172A]/60">Weight:</span> {selectedTask.weight}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-[#0F172A] mb-2">Locations</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-[#0F172A]/60">Pickup:</span> {selectedTask.pickupLocation}</p>
                  <p><span className="text-[#0F172A]/60">Drop-off:</span> {selectedTask.dropoffLocation}</p>
                </div>
              </div>

              {selectedTask.notes && (
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">Notes</h4>
                  <p className="text-sm text-[#0F172A]/80 bg-[#F8FAFC] p-3 rounded-lg">
                    {selectedTask.notes}
                  </p>
                </div>
              )}

              {selectedTask.issues && selectedTask.issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">Issues Reported</h4>
                  <div className="space-y-2">
                    {selectedTask.issues.map((issue, index) => (
                      <p key={index} className="text-sm text-[#EF4444] bg-red-50 p-3 rounded-lg">
                        {issue}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.status === 'completed' && (
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">Completion Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[#0F172A]/60">Completed at:</span> {selectedTask.completedAt}</p>
                    <p><span className="text-[#0F172A]/60">Actual time:</span> {selectedTask.actualTime}</p>
                    <p><span className="text-[#0F172A]/60">Earnings:</span> ${selectedTask.earnings}</p>
                    {selectedTask.customerRating && (
                      <p className="flex items-center space-x-2">
                        <span className="text-[#0F172A]/60">Customer rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < selectedTask.customerRating ? 'text-[#FBBF24]' : 'text-gray-300'}>★</span>
                          ))}
                        </div>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-gray-300 text-[#0F172A] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedTask.status === 'in-progress' && (
                <button
                  onClick={() => {
                    setSelectedTask(null)
                    handleNavigateToDelivery(selectedTask.id)
                  }}
                  className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Track Delivery
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}