import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { MapPin, Phone, MessageCircle, Navigation, Clock, Package, User, CheckCircle, ArrowLeft, Home } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function Delivery() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [deliveredTasks, setDeliveredTasks] = useState(new Set())
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [userLocation] = useState([40.7614, -73.9776]) // Agent's current location

  // Get tasks from navigation state or use default
  const deliveryTasks = location.state?.tasks || []

  useEffect(() => {
    if (deliveryTasks.length > 0 && !selectedDelivery) {
      setSelectedDelivery(deliveryTasks[0])
    }
  }, [deliveryTasks, selectedDelivery])

  // Initialize messages for each task
  useEffect(() => {
    const initialMessages = {}
    deliveryTasks.forEach(task => {
      initialMessages[task.id] = [
        { id: 1, sender: 'customer', text: 'Hi, are you on your way?', time: '2:30 PM' },
        { id: 2, sender: 'agent', text: 'Yes, I\'ll be there in about 15 minutes!', time: '2:32 PM' },
      ]
    })
    setMessages(initialMessages)
  }, [deliveryTasks])

  const sendMessage = (taskId) => {
    if (newMessage.trim()) {
      setMessages(prev => ({
        ...prev,
        [taskId]: [
          ...(prev[taskId] || []),
          {
            id: (prev[taskId]?.length || 0) + 1,
            sender: 'agent',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }))
      setNewMessage('')
    }
  }

  const markAsDelivered = (taskId) => {
    setDeliveredTasks(prev => new Set([...prev, taskId]))
  }

  const selectDeliveryLocation = (task) => {
    setSelectedDelivery(task)
  }

  const getMarkerColor = (task) => {
    if (deliveredTasks.has(task.id)) return 'green'
    if (selectedDelivery?.id === task.id) return 'red'
    return 'blue'
  }

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    })
  }

  const getRouteToSelected = () => {
    if (!selectedDelivery) return []
    return [userLocation, selectedDelivery.coordinates]
  }

  const completedCount = deliveredTasks.size
  const totalEarnings = deliveryTasks
    .filter(task => deliveredTasks.has(task.id))
    .reduce((sum, task) => sum + task.earnings, 0)

  if (deliveryTasks.length === 0) {
    return (
      <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-[#0F172A] mb-2">No Delivery Tasks</h2>
          <p className="text-[#0F172A]/60 mb-6">
            You don't have any delivery tasks assigned. Please collect packages from the Tasks page first.
          </p>
          <button
            onClick={() => navigate('/agent/tasks')}
            className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Tasks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">Delivery Route</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
            <span className="text-sm text-[#0F172A]">
              {completedCount} of {deliveryTasks.length} delivered
            </span>
          </div>
          <button
            onClick={() => navigate('/agent/tasks')}
            className="flex items-center space-x-2 text-[#3B82F6] hover:text-[#1E3A8A] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Tasks</span>
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Completed</p>
              <p className="text-2xl font-semibold text-[#22C55E]">{completedCount}</p>
            </div>
            <CheckCircle className="text-[#22C55E]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Remaining</p>
              <p className="text-2xl font-semibold text-[#3B82F6]">{deliveryTasks.length - completedCount}</p>
            </div>
            <Package className="text-[#3B82F6]" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Earnings</p>
              <p className="text-2xl font-semibold text-[#22C55E]">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="text-[#22C55E] text-xl font-bold">$</div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Delivery Map</h2>
        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Agent's current location */}
            <Marker position={userLocation} icon={createCustomIcon('#3B82F6')}>
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                  <br />
                  <span className="text-sm text-gray-600">Current Position</span>
                </div>
              </Popup>
            </Marker>

            {/* Delivery locations */}
            {deliveryTasks.map((task) => (
              <Marker
                key={task.id}
                position={task.coordinates}
                icon={createCustomIcon(
                  deliveredTasks.has(task.id) ? '#22C55E' : 
                  selectedDelivery?.id === task.id ? '#EF4444' : '#FBBF24'
                )}
                eventHandlers={{
                  click: () => selectDeliveryLocation(task)
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <strong>{task.customer}</strong>
                      {deliveredTasks.has(task.id) && (
                        <CheckCircle className="text-[#22C55E]" size={16} />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.address}</p>
                    <p className="text-sm">
                      <strong>Package:</strong> {task.packageType}
                    </p>
                    <p className="text-sm">
                      <strong>Weight:</strong> {task.weight}
                    </p>
                    {!deliveredTasks.has(task.id) && (
                      <button
                        onClick={() => selectDeliveryLocation(task)}
                        className="mt-2 w-full bg-[#3B82F6] text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Select for Delivery
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Route line to selected delivery */}
            {selectedDelivery && !deliveredTasks.has(selectedDelivery.id) && (
              <Polyline
                positions={getRouteToSelected()}
                color="#3B82F6"
                weight={3}
                opacity={0.7}
                dashArray="10, 10"
              />
            )}
          </MapContainer>
        </div>
        
        {/* Map Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#3B82F6] rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#EF4444] rounded-full"></div>
            <span>Selected Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#FBBF24] rounded-full"></div>
            <span>Pending Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#22C55E] rounded-full"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Selected Delivery Details */}
      {selectedDelivery && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Current Delivery
              </h2>
              <span className="text-sm bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-1 rounded-md">
                {selectedDelivery.id}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-[#3B82F6]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{selectedDelivery.customer}</p>
                  <p className="text-xs text-[#0F172A]/60">Customer name</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="text-[#EF4444]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{selectedDelivery.address}</p>
                  <p className="text-xs text-[#0F172A]/60">Delivery address</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="text-[#3B82F6]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{selectedDelivery.phone}</p>
                  <p className="text-xs text-[#0F172A]/60">Customer phone</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Package className="text-[#FBBF24]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {selectedDelivery.packageType} ({selectedDelivery.weight})
                  </p>
                  <p className="text-xs text-[#0F172A]/60">Package details</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="text-[#3B82F6]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">ETA: {selectedDelivery.estimatedTime}</p>
                  <p className="text-xs text-[#0F172A]/60">Estimated arrival</p>
                </div>
              </div>
            </div>

            {selectedDelivery.notes && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-[#3B82F6] mb-1">Delivery Notes</p>
                <p className="text-sm text-[#0F172A]/80">{selectedDelivery.notes}</p>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              {!deliveredTasks.has(selectedDelivery.id) ? (
                <button 
                  onClick={() => markAsDelivered(selectedDelivery.id)}
                  className="flex-1 bg-[#22C55E] text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark as Delivered
                </button>
              ) : (
                <div className="flex-1 bg-green-50 border border-green-200 text-[#22C55E] py-2 px-4 rounded-lg flex items-center justify-center">
                  <CheckCircle size={18} className="mr-2" />
                  Delivered
                </div>
              )}
              <button className="flex items-center justify-center bg-[#3B82F6] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Navigation size={18} />
              </button>
            </div>
          </div>

          {/* Customer Chat */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
              Customer Chat - {selectedDelivery.customer}
            </h2>

            <div className="h-64 overflow-y-auto bg-[#F8FAFC] rounded-lg p-4 mb-4">
              <div className="space-y-3">
                {(messages[selectedDelivery.id] || []).map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'agent' 
                        ? 'bg-[#3B82F6] text-white' 
                        : 'bg-white border border-gray-200 text-[#0F172A]'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'agent' ? 'text-blue-100' : 'text-[#0F172A]/60'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedDelivery.id)}
              />
              <button
                onClick={() => sendMessage(selectedDelivery.id)}
                className="bg-[#3B82F6] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Deliveries Complete */}
      {completedCount === deliveryTasks.length && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">
            All Deliveries Complete!
          </h2>
          <p className="text-[#0F172A]/60 mb-6">
            Congratulations! You've successfully completed all {deliveryTasks.length} deliveries.
            Total earnings: ${totalEarnings.toFixed(2)}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Home size={20} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      )}
    </div>
  )
}