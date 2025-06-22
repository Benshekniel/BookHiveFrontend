import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Shield, Clock, User } from 'lucide-react'

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggingOut(true)
    // Simulate logout process
    setTimeout(() => {
      // In a real app, this would clear authentication tokens
      localStorage.removeItem('authToken')
      alert('Successfully logged out!')
      setIsLoggingOut(false)
      // In a real app, this would redirect to login page
      navigate('/')
    }, 2000)
  }

  const sessionInfo = {
    loginTime: '8:30 AM',
    duration: '6h 32m',
    deliveries: 8,
    lastActivity: '2 minutes ago'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Logout
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#22C55E] rounded-full"></div>
          <span className="text-sm text-[#0F172A]">Session Active</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Session Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Current Session
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="text-[#3B82F6]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Login Time</p>
                <p className="text-xs text-[#0F172A]/60">{sessionInfo.loginTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="text-[#3B82F6]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Session Duration</p>
                <p className="text-xs text-[#0F172A]/60">{sessionInfo.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="text-[#22C55E]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Deliveries Today</p>
                <p className="text-xs text-[#0F172A]/60">{sessionInfo.deliveries} completed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="text-[#FBBF24]" size={20} />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Last Activity</p>
                <p className="text-xs text-[#0F172A]/60">{sessionInfo.lastActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Confirmation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <LogOut className="text-[#EF4444]" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-2">
              Confirm Logout
            </h2>
            <p className="text-[#0F172A]/60 mb-6">
              Are you sure you want to log out? This will end your current session and you'll need to log in again to access your account.
            </p>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="text-[#3B82F6] mt-1" size={20} />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-[#0F172A]">Security Notice</h3>
                  <p className="text-xs text-[#0F172A]/80 mt-1">
                    For your security, always log out when using shared devices. Your session data will be cleared and all active connections will be terminated.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 text-[#0F172A] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
            Before You Go
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <span className="text-sm text-[#0F172A]">Save current delivery progress</span>
              <button className="text-[#3B82F6] hover:text-[#1E3A8A] transition-colors text-sm font-medium">
                Save
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <span className="text-sm text-[#0F172A]">Download today's delivery report</span>
              <button className="text-[#3B82F6] hover:text-[#1E3A8A] transition-colors text-sm font-medium">
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <span className="text-sm text-[#0F172A]">Check for pending notifications</span>
              <button className="text-[#3B82F6] hover:text-[#1E3A8A] transition-colors text-sm font-medium">
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}