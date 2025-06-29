import { useState } from "react"
import { Link } from 'react-router-dom';
import {
  Heart,
  Clock,
  ShoppingCart,
  Trophy,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Star,
  Info,
  Shield,
} from "lucide-react"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("requests")

  const statsData = [
    {
      title: "Wishlisted",
      value: "3",
      icon: Heart,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Borrowed",
      value: "2",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Purchased",
      value: "12",
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Competitions",
      value: "2",
      icon: Trophy,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  const badges = [
    {
      name: "Trusted Seller",
      icon: Star,
      earned: true,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      name: "Verified",
      icon: Shield,
      earned: true,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      name: "Quick Responder",
      icon: Clock,
      earned: true,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      name: "Power User",
      icon: Award,
      earned: false,
      color: "text-gray-400",
      bgColor: "bg-gray-50",
    },
  ]

  const recentRequests = [
    {
      id: 1,
      title: "Atomic Habits",
      type: "Borrow",
      status: "Completed",
      date: "2024-01-15",
      author: "James Clear",
    },
  ]

  const featuredCompetitions = [
    {
      id: 1,
      title: "Sri Lankan Heritage Stories",
      category: "Short Story",
      prize: "Rs. 25,000",
      type: "Publication",
      deadline: "2024-02-28",
      participants: 156,
    },
    {
      id: 2,
      title: "Poetry of Emotions",
      category: "Poetry",
      prize: "Rs. 10,000",
      type: "Poetry Collection Publication",
      deadline: "2024-03-15",
      participants: 89,
    },
  ]

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Circular progress component for TrustScore
  const CircularProgress = ({ value, max = 1000 }) => {
    const percentage = (value / max) * 100
    const strokeDasharray = 2 * Math.PI * 45 // radius = 45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-green-500 transition-all duration-300 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Welcome back, Nive!</h1>
              <p className="text-blue-100 text-lg">Discover new books and connect with readers across Sri Lanka</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to ="/user/browse-books">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>Browse Books</span>
              </button>
              </Link>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Become a Seller</span>
              </button>
            </div>
          </div>
        </div>

        {/* TrustScore and Badges Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TrustScore */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">TrustScore</h2>
              <Info className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-6">
              <CircularProgress value={850} />
              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-lg font-semibold text-gray-900">Excellent</span>
                </div>
                <div className="mb-1">
                  <span className="text-green-600 font-medium">+25 this month</span>
                </div>
                <div className="text-sm text-gray-500">Based on 47 completed transactions</div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Badges</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${badge.bgColor} ${badge.earned ? "" : "opacity-50"}`}
                  >
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <p className={`text-sm font-medium ${badge.earned ? "text-gray-900" : "text-gray-400"}`}>
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
              </div>
            </div>
            <div className="p-6">
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{request.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{request.type}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{request.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Featured Competitions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Featured Competitions</h2>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {featuredCompetitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{competition.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{competition.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="text-yellow-600 font-medium">
                            {competition.prize} • {competition.type}
                          </span>
                        </div>
                      </div>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        View
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Deadline: {competition.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{competition.participants} participants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  View All Competitions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard