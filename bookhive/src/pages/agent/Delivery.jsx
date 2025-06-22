import { useState } from 'react'
import { MapPin, Phone, MessageCircle, Navigation, Clock } from 'lucide-react'

export default function Delivery() {
  const [activeDelivery, setActiveDelivery] = useState({
    id: 'DEL-001',
    customer: 'Jane Smith',
    address: '123 Main Street, Apt 4B',
    phone: '+1 (555) 123-4567',
    status: 'in-transit',
    estimatedTime: '15 min',
    packageType: 'Electronics'
  })

  const [messages, setMessages] = useState([
    { id: 1, sender: 'customer', text: 'Hi, are you close to my location?', time: '2:30 PM' },
    { id: 2, sender: 'agent', text: 'Yes, I\'m about 10 minutes away!', time: '2:32 PM' },
    { id: 3, sender: 'customer', text: 'Great! I\'ll be waiting at the front door.', time: '2:33 PM' },
  ])

  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'agent',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')
    }
  }

  const updateDeliveryStatus = (status) => {
    setActiveDelivery({ ...activeDelivery, status })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Active Delivery
        </h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            activeDelivery.status === 'in-transit' ? 'bg-[#3B82F6]' :
            activeDelivery.status === 'delivered' ? 'bg-[#22C55E]' : 'bg-[#FBBF24]'
          }`}></div>
          <span className="text-sm text-[#0F172A] capitalize">{activeDelivery.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Delivery Details
            </h2>
            <span className="text-sm bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-1 rounded-md">
              {activeDelivery.id}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="text-[#3B82F6]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{activeDelivery.customer}</p>
                <p className="text-xs text-[#0F172A]/60">{activeDelivery.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="text-[#3B82F6]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{activeDelivery.phone}</p>
                <p className="text-xs text-[#0F172A]/60">Customer phone</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="text-[#3B82F6]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">ETA: {activeDelivery.estimatedTime}</p>
                <p className="text-xs text-[#0F172A]/60">Estimated arrival</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button 
              onClick={() => updateDeliveryStatus('delivered')}
              className="flex-1 bg-[#22C55E] text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark Delivered
            </button>
            <button className="flex items-center justify-center bg-[#3B82F6] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Navigation size={18} />
            </button>
          </div>
        </div>

        {/* Customer Chat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Customer Chat
          </h2>

          <div className="h-64 overflow-y-auto bg-[#F8FAFC] rounded-lg p-4 mb-4">
            <div className="space-y-3">
              {messages.map((message) => (
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
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-[#3B82F6] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Package Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          Package Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#F8FAFC] rounded-lg">
            <p className="text-sm text-[#0F172A]/60">Package Type</p>
            <p className="text-lg font-medium text-[#0F172A]">{activeDelivery.packageType}</p>
          </div>
          <div className="text-center p-4 bg-[#F8FAFC] rounded-lg">
            <p className="text-sm text-[#0F172A]/60">Weight</p>
            <p className="text-lg font-medium text-[#0F172A]">2.5 lbs</p>
          </div>
          <div className="text-center p-4 bg-[#F8FAFC] rounded-lg">
            <p className="text-sm text-[#0F172A]/60">Priority</p>
            <p className="text-lg font-medium text-[#0F172A]">Standard</p>
          </div>
        </div>
      </div>
    </div>
  )
}