import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, Clock, MapPin, Star, Award, DollarSign, Target
} from 'lucide-react'

export default function Performance() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const performanceMetrics = {
    totalHours: 156.5,
    totalKilometers: 2847,
    trustScore: 4.8,
    totalEarnings: 487500.75, // LKR
    deliveriesCompleted: 142,
    onTimeRate: 96.5,
    customerRating: 4.9,
    fuelEfficiency: 12.3
  }

  const weeklyTrends = [
    { day: 'Mon', hours: 8, earnings: 27000, deliveries: 12 },
    { day: 'Tue', hours: 7.5, earnings: 24750, deliveries: 11 },
    { day: 'Wed', hours: 9, earnings: 31500, deliveries: 15 },
    { day: 'Thu', hours: 8.5, earnings: 29250, deliveries: 13 },
    { day: 'Fri', hours: 7, earnings: 23250, deliveries: 10 },
    { day: 'Sat', hours: 6, earnings: 21000, deliveries: 9 },
    { day: 'Sun', hours: 8, earnings: 27750, deliveries: 12 }
  ]

  const achievements = [
    { id: 1, name: 'Colombo Champion', description: '100+ deliveries in Colombo district', icon: '🏆', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Customer Favorite', description: 'Maintain 4.8+ rating for 30 days', icon: '⭐', earned: true, date: '2024-01-20' },
    { id: 3, name: 'Island Explorer', description: 'Deliver to all 9 provinces', icon: '🗺️', earned: true, date: '2024-01-10' },
    { id: 4, name: 'Monsoon Master', description: '100% on-time deliveries during rainy season', icon: '🌧️', earned: false, progress: 85 },
    { id: 5, name: 'Poya Day Hero', description: 'Complete 50 deliveries on Poya days', icon: '🌕', earned: false, progress: 62 },
    { id: 6, name: 'Tea Country Specialist', description: 'Complete 25 deliveries in hill country', icon: '🍃', earned: false, progress: 40 }
  ]

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Hours" value={performanceMetrics.totalHours} sub="+12% from last month" icon={<Clock />} color="blue" />
        <MetricCard title="Distance (km)" value={performanceMetrics.totalKilometers.toLocaleString()} sub="+8% from last month" icon={<MapPin />} color="blue" />
        <MetricCard title="TrustScore" value={`${performanceMetrics.trustScore}/5.0`} sub="+0.2 from last month" icon={<Star />} color="yellow" />
        <MetricCard title="Total Earnings" value={`Rs. ${performanceMetrics.totalEarnings.toLocaleString()}`} sub="+15% from last month" icon={<DollarSign />} color="green" />
      </div>

      {/* Chart and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Weekly Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value, name) => {
                if (name === 'Earnings') return [`Rs. ${value.toLocaleString()}`, name]
                return [value, name]
              }} />
              <Legend />
              <Bar dataKey="hours" fill="#3B82F6" name="Hours" />
              <Bar dataKey="earnings" fill="#22C55E" name="Earnings (LKR)" />
              <Bar dataKey="deliveries" fill="#FBBF24" name="Deliveries" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Additional Metrics</h2>
          <div className="space-y-4">
            <MetricRow icon={<Target className="text-[#3B82F6]" />} title="On-Time Rate" value={`${performanceMetrics.onTimeRate}%`} rating="Excellent" />
            <MetricRow icon={<Star className="text-[#FBBF24]" />} title="Customer Rating" value={`${performanceMetrics.customerRating}/5.0`} rating="Outstanding" />
            <MetricRow icon={<TrendingUp className="text-[#22C55E]" />} title="Deliveries Completed" value={`${performanceMetrics.deliveriesCompleted} total`} rating="+8 this week" />
            <MetricRow icon={<MapPin className="text-[#3B82F6]" />} title="Fuel Efficiency" value={`${performanceMetrics.fuelEfficiency} km/L`} rating="Above Average" />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Achievements & Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
              achievement.earned ? 'border-[#22C55E] bg-green-50' : 'border-gray-200 bg-[#F8FAFC]'
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

// Reusable components

function MetricCard({ title, value, sub, icon, color }) {
  const iconColors = {
    blue: 'text-[#3B82F6]',
    green: 'text-[#22C55E]',
    yellow: 'text-[#FBBF24]'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F172A]/60">{title}</p>
          <p className="text-2xl font-semibold text-[#0F172A]">{value}</p>
          <p className="text-xs text-[#22C55E] mt-1">{sub}</p>
        </div>
        <div className={iconColors[color]}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function MetricRow({ icon, title, value, rating }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-[#0F172A]">{title}</p>
          <p className="text-xs text-[#0F172A]/60">{value}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-[#22C55E]">{rating}</p>
      </div>
    </div>
  )
}