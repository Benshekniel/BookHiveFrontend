import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, CheckCircle, Clock, MapPin, User, Phone, Calendar, Truck } from 'lucide-react'

export default function Tasks() {
  const navigate = useNavigate()

  // Today's tasks for the agent's assigned hub - only books
  const todaysTasks = [
    {
      id: 'DEL-001',
      customer: 'Jane Smith',
      address: '456 Oak Avenue, Apt 2B',
      phone: '+1 (555) 123-4567',
      packageType: 'Books',
      weight: '2.5 lbs',
      priority: 'high',
      estimatedTime: '15 min',
      coordinates: [40.7589, -73.9851],
      collected: false
    },
    {
      id: 'DEL-002',
      customer: 'Mike Johnson',
      address: '321 Pine Street, Suite 100',
      phone: '+1 (555) 987-6543',
      packageType: 'Books',
      weight: '1.8 lbs',
      priority: 'medium',
      estimatedTime: '20 min',
      coordinates: [40.7505, -73.9934],
      collected: false
    },
    {
      id: 'DEL-003',
      customer: 'Sarah Davis',
      address: '987 Elm Drive, House #12',
      phone: '+1 (555) 456-7890',
      packageType: 'Books',
      weight: '3.2 lbs',
      priority: 'low',
      estimatedTime: '12 min',
      coordinates: [40.7614, -73.9776],
      collected: false
    },
    {
      id: 'DEL-004',
      customer: 'Tom Wilson',
      address: '159 Maple Lane, Apt 5A',
      phone: '+1 (555) 321-0987',
      packageType: 'Books',
      weight: '2.1 lbs',
      priority: 'high',
      estimatedTime: '18 min',
      coordinates: [40.7549, -73.9840],
      collected: false
    },
    {
      id: 'DEL-005',
      customer: 'Lisa Brown',
      address: '753 Cedar Court, Unit B',
      phone: '+1 (555) 654-3210',
      packageType: 'Books',
      weight: '4.0 lbs',
      priority: 'medium',
      estimatedTime: '25 min',
      coordinates: [40.7580, -73.9855],
      collected: false
    }
  ]

  const [tasks, setTasks] = useState(todaysTasks)

  const handlePackageCollection = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, collected: !task.collected }
          : task
      )
    )
  }

  const allPackagesCollected = tasks.every(task => task.collected)
  const collectedCount = tasks.filter(task => task.collected).length
  const totalWeight = tasks.reduce((sum, task) => sum + parseFloat(task.weight), 0)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-[#EF4444] bg-red-50 border-red-200'
      case 'medium':
        return 'text-[#FBBF24] bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-[#22C55E] bg-green-50 border-green-200'
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const startDelivery = () => {
    // Pass the collected tasks to the delivery page
    navigate('/agent/delivery', { state: { tasks: tasks.filter(task => task.collected) } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Today's Book Deliveries
        </h1>
        <div className="flex items-center space-x-2">
          <Calendar className="text-[#3B82F6]" size={20} />
          <span className="text-sm text-[#0F172A]">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Hub Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">Downtown Hub</h2>
              <p className="text-sm text-[#0F172A]/60">123 Main Street, Downtown</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
            <span className="text-sm text-[#0F172A]">Active</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Total Books</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{tasks.length}</p>
            </div>
            <Package className="text-[#3B82F6]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Collected</p>
              <p className="text-2xl font-semibold text-[#22C55E]">{collectedCount}</p>
            </div>
            <CheckCircle className="text-[#22C55E]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Total Weight</p>
              <p className="text-2xl font-semibold text-[#FBBF24]">{totalWeight.toFixed(1)} lbs</p>
            </div>
            <Package className="text-[#FBBF24]" size={24} />
          </div>
        </div>
      </div>

      {/* Collection Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Book Collection Progress
          </h2>
          <span className="text-sm text-[#0F172A]/60">
            {collectedCount} of {tasks.length} collected
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-[#22C55E] h-3 rounded-full transition-all duration-300" 
            style={{ width: `${(collectedCount / tasks.length) * 100}%` }}
          ></div>
        </div>
        {allPackagesCollected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-[#22C55E]" size={20} />
              <p className="text-[#22C55E] font-medium">
                All books collected! Ready to start delivery.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Book Collection List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Book Collection Checklist
          </h2>
          <p className="text-sm text-[#0F172A]/60 mt-1">
            Check off each book package as you collect it from the hub
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className={`p-6 transition-colors ${task.collected ? 'bg-green-50' : 'hover:bg-[#F8FAFC]'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-[#0F172A]">{task.id}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      {task.collected && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-[#22C55E] border border-green-200">
                          <CheckCircle size={12} className="mr-1" />
                          COLLECTED
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="text-[#3B82F6]" size={18} />
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{task.customer}</p>
                          <p className="text-xs text-[#0F172A]/60">Customer</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="text-[#3B82F6]" size={18} />
                        <div>
                          <p className="text-sm text-[#0F172A]">{task.phone}</p>
                          <p className="text-xs text-[#0F172A]/60">Phone number</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="text-[#EF4444]" size={18} />
                        <div>
                          <p className="text-sm text-[#0F172A]">{task.address}</p>
                          <p className="text-xs text-[#0F172A]/60">Delivery address</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="text-[#FBBF24]" size={18} />
                        <div>
                          <p className="text-sm text-[#0F172A]">Books ({task.weight})</p>
                          <p className="text-xs text-[#0F172A]/60">Package details</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-sm text-[#0F172A]/60">
                    <Clock className="mr-2" size={16} />
                    <span>Estimated delivery time: {task.estimatedTime}</span>
                  </div>
                </div>

                {/* Checkbox moved to the right */}
                <div className="flex items-center ml-6">
                  <input
                    type="checkbox"
                    checked={task.collected}
                    onChange={() => handlePackageCollection(task.id)}
                    className="w-6 h-6 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E] focus:ring-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Delivery Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          {!allPackagesCollected ? (
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Collect All Books First
              </h3>
              <p className="text-[#0F172A]/60 mb-4">
                Please collect all {tasks.length} book packages from the hub before starting your delivery route.
              </p>
              <p className="text-sm text-[#0F172A]/60">
                {tasks.length - collectedCount} book packages remaining to collect
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Ready to Start Book Delivery!
              </h3>
              <p className="text-[#0F172A]/60 mb-6">
                All book packages collected. You can now start your delivery route with {tasks.length} deliveries.
              </p>
              <button
                onClick={startDelivery}
                className="bg-[#22C55E] text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center space-x-2 mx-auto"
              >
                <Truck size={20} />
                <span>Start Book Delivery Route</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}