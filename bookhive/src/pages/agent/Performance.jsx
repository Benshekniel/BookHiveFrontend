import { useState } from 'react'
import { TrendingUp, Clock, MapPin, Star, Award, Calendar, DollarSign, Target } from 'lucide-react'

export default function Performance() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const performanceMetrics = {
    totalHours: 156.5,
    totalKilometers: 2847,
    trustScore: 4.8,
    totalEarnings: 3250.75,
    deliveriesCompleted: 142,
    onTimeRate: 96.5,
    customerRating: 4.9,
    fuelEfficiency: 12.3
  }

  const historicalData = {
    week: {
      hours: [8, 7.5, 9, 8.5, 7, 6, 8],
      earnings: [180, 165, 210, 195, 155, 140, 185],
      deliveries: [12, 11, 15, 13, 10, 9, 12]
    },
    month: {
      hours: [32, 35, 38, 31],
      earnings: [720, 780, 850, 695],
      deliveries: [48, 52, 58, 44]
    }
  }

  const achievements = [
    { id: 1, name: 'Speed Demon', description: '100+ deliveries completed', icon: '🚀', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Customer Favorite', description: 'Maintain 4.8+ rating for 30 days', icon: '⭐', earned: true, date: '2024-01-20' },
    { id: 3, name: 'Distance Master', description: 'Travel 1000+ km in a month', icon: '🗺️', earned: true, date: '2024-01-10' },
    { id: 4, name: 'Perfect Week', description: '100% on-time deliveries for a week', icon: '🎯', earned: false, progress: 85 },
    { id: 5, name: 'Early Bird', description: 'Complete 50 morning deliveries', icon: '🌅', earned: false, progress: 62 },
    { id: 6, name: 'Night Owl', description: 'Complete 25 evening deliveries', icon: '🌙', earned: false, progress: 40 }
  ]

  const weeklyTrends = [
    { day: 'Mon', hours: 8, earnings: 180, deliveries: 12 },
    { day: 'Tue', hours: 7.5, earnings: 165, deliveries: 11 },
    { day: 'Wed', hours: 9, earnings: 210, deliveries: 15 },
    { day: 'Thu', hours: 8.5, earnings: 195, deliveries: 13 },
    { day: 'Fri', hours: 7, earnings: 155, deliveries: 10 },
    { day: 'Sat', hours: 6, earnings: 140, deliveries: 9 },
    { day: 'Sun', hours: 8, earnings: 185, deliveries: 12 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Performance Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Total Hours</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{performanceMetrics.totalHours}</p>
              <p className="text-xs text-[#22C55E] mt-1">+12% from last month</p>
            </div>
            <Clock className="text-[#3B82F6]" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Distance (km)</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{performanceMetrics.totalKilometers.toLocaleString()}</p>
              <p className="text-xs text-[#22C55E] mt-1">+8% from last month</p>
            </div>
            <MapPin className="text-[#3B82F6]" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">TrustScore</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{performanceMetrics.trustScore}/5.0</p>
              <p className="text-xs text-[#22C55E] mt-1">+0.2 from last month</p>
            </div>
            <Star className="text-[#FBBF24]" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0F172A]/60">Total Earnings</p>
              <p className="text-2xl font-semibold text-[#0F172A]">${performanceMetrics.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-[#22C55E] mt-1">+15% from last month</p>
            </div>
            <DollarSign className="text-[#22C55E]" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Weekly Performance Trends
          </h2>
          <div className="space-y-4">
            {weeklyTrends.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm font-medium text-[#0F172A]">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 text-xs text-[#0F172A]/60">
                      <span>{day.hours}h</span>
                      <span>${day.earnings}</span>
                      <span>{day.deliveries} deliveries</span>
                    </div>
                  </div>
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#3B82F6] h-2 rounded-full" 
                    style={{ width: `${(day.hours / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Additional Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="text-[#3B82F6]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">On-Time Rate</p>
                  <p className="text-xs text-[#0F172A]/60">{performanceMetrics.onTimeRate}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#22C55E]">Excellent</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="text-[#FBBF24]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Customer Rating</p>
                  <p className="text-xs text-[#0F172A]/60">{performanceMetrics.customerRating}/5.0</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#22C55E]">Outstanding</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-[#22C55E]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Deliveries Completed</p>
                  <p className="text-xs text-[#0F172A]/60">{performanceMetrics.deliveriesCompleted} total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3B82F6]">+8 this week</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="text-[#3B82F6]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Fuel Efficiency</p>
                  <p className="text-xs text-[#0F172A]/60">{performanceMetrics.fuelEfficiency} km/L</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#22C55E]">Above Average</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements and Badges */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          Achievements & Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
              achievement.earned 
                ? 'border-[#22C55E] bg-green-50' 
                : 'border-gray-200 bg-[#F8FAFC]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">{achievement.name}</h3>
                    {achievement.earned && (
                      <p className="text-xs text-[#22C55E]">Earned {achievement.date}</p>
                    )}
                  </div>
                </div>
                {achievement.earned && (
                  <Award className="text-[#22C55E]" size={20} />
                )}
              </div>
              <p className="text-xs text-[#0F172A]/60 mb-2">{achievement.description}</p>
              {!achievement.earned && achievement.progress && (
                <div>
                  <div className="flex justify-between text-xs text-[#0F172A]/60 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3B82F6] h-2 rounded-full" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}