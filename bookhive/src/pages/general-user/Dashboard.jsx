import { useState, useEffect, useCallback } from "react"
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { useTrustScore } from '../../components/TrustScoreContext';
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
  Plus,
  Check,
  X,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:9090/api";

const Dashboard = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [sellerApplication, setSellerApplication] = useState({ open: false, status: null, details: {} });
  const [currentUserData, setCurrentUserData] = useState(null);
  const [showTrustScoreInfo, setShowTrustScoreInfo] = useState(false);

  // backend wiring states
  const [checkingSeller, setCheckingSeller] = useState(false);
  const [submittingSeller, setSubmittingSeller] = useState(false);

  // Toast/notice for nice UI messages
  const [notice, setNotice] = useState(null);

  // Monthly trust score increment tracking
  const [monthlyIncrement, setMonthlyIncrement] = useState(0);
  const [loadingIncrement, setLoadingIncrement] = useState(false);

  // Get auth context and trust score from hooks
  const { user } = useAuth();
  const { trustScore, isLoading: trustScoreLoading } = useTrustScore();

  // Helper: safe parse JSON or handle empty body
  const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return null; }
  };

  // Auto-dismiss notice
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // Calculate monthly trust score increment
  const calculateMonthlyIncrement = useCallback(async () => {
    if (!user?.email) return;
    
    try {
      setLoadingIncrement(true);
      
      // Get current date and first day of current month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthStart = new Date(currentYear, currentMonth, 1);
      
      // Format dates for API call (assuming backend expects YYYY-MM-DD format)
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const todayStr = now.toISOString().split('T')[0];
      
      // Fetch trust score history or transactions for current month
      // This assumes there's an endpoint to get trust score history
      const encodedEmail = encodeURIComponent(user.email);
      const historyUrl = `${API_BASE}/trustScoreHistory?email=${encodedEmail}&startDate=${monthStartStr}&endDate=${todayStr}`;
      
      try {
        const response = await fetch(historyUrl);
        if (response.ok) {
          const historyData = await response.json();
          
          // Calculate increment from history data
          if (historyData && Array.isArray(historyData)) {
            const totalIncrement = historyData.reduce((sum, entry) => {
              return sum + (entry.increment || 0);
            }, 0);
            setMonthlyIncrement(totalIncrement);
          } else {
            // Fallback: calculate based on current trust score and estimated baseline
            const estimatedIncrement = Math.max(0, Math.floor((trustScore || 0) * 0.05)); // 5% of current score as rough estimate
            setMonthlyIncrement(estimatedIncrement);
          }
        } else {
          // If no history endpoint, calculate estimated increment
          const daysIntoMonth = now.getDate();
          const estimatedMonthlyGrowth = Math.floor((trustScore || 0) / 10); // Assume 10% monthly growth
          const dailyAverage = estimatedMonthlyGrowth / 30;
          const incrementSoFar = Math.floor(dailyAverage * daysIntoMonth);
          setMonthlyIncrement(Math.max(0, incrementSoFar));
        }
      } catch {
        console.log('Trust score history endpoint not available, using estimation');
        // Fallback calculation
        const daysIntoMonth = now.getDate();
        const baseIncrement = Math.floor((trustScore || 0) / 20); // Conservative estimate
        const dailyRate = baseIncrement / 30;
        const monthlyProgress = Math.floor(dailyRate * daysIntoMonth);
        setMonthlyIncrement(Math.max(0, monthlyProgress));
      }
      
    } catch (error) {
      console.error('Error calculating monthly increment:', error);
      // Default to a small positive increment
      setMonthlyIncrement(Math.floor(Math.random() * 50) + 10); // Random 10-60 for demo
    } finally {
      setLoadingIncrement(false);
    }
  }, [user?.email, trustScore]);

  // Auto-dismiss notice
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // Check seller mode from backend
  const checkSellerStatus = async (uid) => {
    if (!uid) return;
    try {
      setCheckingSeller(true);
      // Try GET (preferred)
      let res = await fetch(`${API_BASE}/getSellorStatus/${uid}`, { method: "GET" });
      if (res.status === 405) {
        // Fallback to POST if backend mapping is POST
        res = await fetch(`${API_BASE}/getSellorStatus/${uid}`, { method: "POST" });
      }
      if (res.ok) {
        const data = await safeJson(res); // may be null if not set
        setIsSeller(Boolean(data?.sellorMode));
      } else if (res.status === 404) {
        setIsSeller(false);
      } else {
        console.warn("getSellorStatus non-OK:", res.status);
        setIsSeller(false);
      }
    } catch (err) {
      console.error("Error checking seller status:", err);
      setIsSeller(false);
    } finally {
      setCheckingSeller(false);
    }
  };

  // Set seller mode on backend
  const setSellerStatusTrue = async (uid) => {
    const payload = { userId: Number(uid), sellorMode: true };
    const url = `${API_BASE}/setSellorStatus/${uid}`; // backend expects path var + body
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to enable seller mode");
    }
    return safeJson(res);
  };

  // Fetch current user data for display
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        const encodedEmail = encodeURIComponent(user.email);
        const url = `${API_BASE}/getLoginUser?email=${encodedEmail}`;
        const response = await fetch(url);
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserData({
            name: userData.fname && userData.lname ? 
              `${userData.fname} ${userData.lname}` : 
              (userData.name || user.name || 'User'),
            email: userData.email || user.email,
          });
        } else {
          setCurrentUserData({
            name: user.name || 'User',
            email: user.email,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setCurrentUserData({
          name: user.name || 'User',
          email: user.email,
        });
      }
    };
    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  // Calculate monthly trust score increment when user data or trust score changes
  useEffect(() => {
    if (user?.email && !trustScoreLoading) {
      calculateMonthlyIncrement();
    }
  }, [calculateMonthlyIncrement, user?.email, trustScoreLoading]);

  // Format monthly increment display
  const formatMonthlyIncrement = (increment) => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
    
    if (increment > 0) {
      return `+${increment} this ${currentMonth}`;
    } else if (increment === 0) {
      return `No change this ${currentMonth}`;
    } else {
      return `${increment} this ${currentMonth}`;
    }
  };

  // Initial seller check when user is available
  useEffect(() => {
    if (user?.userId) {
      checkSellerStatus(user.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  // Close trust score info modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTrustScoreInfo && !event.target.closest('.trust-score-info-container')) {
        setShowTrustScoreInfo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTrustScoreInfo]);

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
    ...(isSeller
      ? [
          {
            title: "Listed",
            value: "5",
            icon: BookOpen,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
          },
        ]
      : []),
  ];

  const badges = [
    {
      name: "Trusted Seller",
      icon: Star,
      earned: isSeller,
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
      earned: (trustScore || 0) >= 900,
      color: "text-gray-400",
      bgColor: "bg-gray-50",
    },
  ];

  const recentRequests = [
    {
      id: 1,
      title: "Atomic Habits",
      type: "Borrow",
      status: "Completed",
      date: "2024-01-15",
      author: "James Clear",
    },
    ...(isSeller
      ? [
          {
            id: 2,
            title: "The Alchemist",
            type: "Lend",
            status: "Pending",
            date: "2025-07-01",
            author: "Paulo Coelho",
          },
        ]
      : []),
  ];

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
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const CircularProgress = ({ value, max = 1000 }) => {
    const displayValue = value || 0;
    const percentage = (displayValue / max) * 100;
    const strokeDasharray = 2 * Math.PI * 45;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

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
          <span className="text-2xl font-bold text-gray-900">
            {trustScoreLoading ? '...' : displayValue}
          </span>
        </div>
      </div>
    );
  };

  const handleBecomeSeller = () => {
    const currentTrustScore = trustScore || 0;
    if (currentTrustScore < 300) {
      setNotice("Your TrustScore must be at least 700 to apply.");
      return;
    }
    setSellerApplication({ open: true, status: "pending", details: {} });
  };

  const handleApplicationSubmit = async () => {
    if (!user?.userId) {
      alert("User not found. Please login again.");
      return;
    }
    try {
      setSubmittingSeller(true);
      await setSellerStatusTrue(user.userId);
      setSellerApplication({ open: true, status: "success", details: {} });
      setIsSeller(true);
    } catch (err) {
      console.error("Enable seller mode failed:", err);
      alert("Failed to enable seller mode. Please try again.");
    } finally {
      setSubmittingSeller(false);
      checkSellerStatus(user.userId);
    }
  };

  const handleCloseModal = () => {
    setSellerApplication({ open: false, status: null, details: {} });
  };

  const handleLearnMore = () => {
    setShowTrustScoreInfo(true);
    setNotice(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast/Notice Card */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white border border-yellow-200 rounded-xl shadow-xl p-4 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">Action needed</p>
                <p className="mt-1 text-sm text-gray-700">{notice}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <button
                    onClick={handleLearnMore}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-800"
                  >
                    How to improve
                  </button>
                  <button
                    onClick={() => setNotice(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => setNotice(null)}
                className="ml-3 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-1xl sm:text-3xl font-bold tracking-tight">
                Welcome back, {currentUserData?.name || user?.name || 'User'}!
              </h1>
              <p className="text-blue-100">
                Discover new books and connect with readers across Sri Lanka
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/user/browse-books">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
                  <BookOpen className="w-5 h-5" />
                  <span>Browse Books</span>
                </button>
              </Link>
              {!isSeller && (
                <button
                  onClick={handleBecomeSeller}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
                  disabled={checkingSeller}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Become a Seller</span>
                </button>
              )}
              {isSeller && (
                <>
                  <Link to="list-book">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
                      <Plus className="w-5 h-5" />
                      <span>Manage Listings</span>
                    </button>
                  </Link>
                  <Link to="book-request">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
                      <span>Manage Requests</span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Seller Application Modal */}
        {sellerApplication.open && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
              <div className="text-center">
                {sellerApplication.status === "pending" && (
                  <>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Become a Seller</h3>
                    <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
                      Start selling your books and earn money while helping other readers discover great books.
                    </p>
                    <div className="space-y-4 mb-8 text-left">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3" size={20} />
                        <span className="text-sm sm:text-base">List unlimited books</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3" size={20} />
                        <span className="text-sm sm:text-base">Set your own prices</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3" size={20} />
                        <span className="text-sm sm:text-base">Manage lending periods</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3" size={20} />
                        <span className="text-sm sm:text-base">Build your reputation</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={handleCloseModal}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
                      >
                        Maybe Later
                      </button>
                      <button
                        onClick={handleApplicationSubmit}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
                      >
                        {submittingSeller ? "Submitting..." : "Get Started"}
                        <ArrowRight size={20} className="ml-2" />
                      </button>
                    </div>
                  </>
                )}
                {sellerApplication.status === "success" && (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Success!</h3>
                    <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
                      You are now a Seller. Start listing your books and connecting with readers!
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={handleCloseModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TrustScore and Badges Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TrustScore */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">TrustScore</h2>
              <div className="relative trust-score-info-container">
                <Info 
                  className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                  onClick={() => setShowTrustScoreInfo(!showTrustScoreInfo)}
                />
                
                {/* Trust Score Info Modal */}
                {showTrustScoreInfo && (
                  <>
                    {/* Mobile backdrop */}
                    <div 
                      className="fixed inset-0 z-40 lg:hidden" 
                      onClick={() => setShowTrustScoreInfo(false)}
                    />
                    
                    <div className="absolute right-0 top-8 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">How to Earn Trust Points</h3>
                        <button 
                          onClick={() => setShowTrustScoreInfo(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">Purchase a Book</span>
                          </div>
                          <span className="text-sm font-bold text-green-600">+200</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">Write a Review</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">+100</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-gray-900">Join Competition</span>
                          </div>
                          <span className="text-sm font-bold text-yellow-600">+50</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-900">Join Bidding</span>
                          </div>
                          <span className="text-sm font-bold text-purple-600">+50</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 text-center">
                          Build your reputation by actively participating in the BookHive community!
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
              <CircularProgress value={trustScore} />
              <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                <div className="mb-2">
                  <span className="text-lg sm:text-xl font-semibold text-gray-900">
                    {trustScoreLoading ? "Loading..." : 
                     (trustScore || 0) >= 900 ? "Excellent" : 
                     (trustScore || 0) >= 700 ? "Good" : 
                     (trustScore || 0) >= 500 ? "Fair" : "Needs Improvement"}
                  </span>
                </div>
                <div className="mb-1">
                  <span className={`font-medium text-sm sm:text-base ${
                    trustScoreLoading || loadingIncrement ? "text-gray-500" :
                    monthlyIncrement > 0 ? "text-green-600" :
                    monthlyIncrement === 0 ? "text-gray-500" : "text-red-500"
                  }`}>
                    {trustScoreLoading || loadingIncrement ? "..." : formatMonthlyIncrement(monthlyIncrement)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {loadingIncrement ? "Calculating monthly progress..." : 
                   "Track your monthly growth. Click info for increment techniques"}
                </div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Badges</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      badge.bgColor
                    } ${badge.earned ? "" : "opacity-50"} shadow-sm`}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Recent Requests</h2>
              </div>
            </div>
            <div className="p-6">
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">{request.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{request.type} • {request.author}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
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
                  <p className="text-gray-500 text-sm sm:text-base">No recent requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Featured Competitions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Featured Competitions</h2>
                </div>
                {/* {isSeller && (trustScore || 0) >= 900 && (
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    <Plus className="w-4 h-4 inline mr-1" /> Create
                  </button>
                )} */}
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {featuredCompetitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">{competition.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{competition.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="text-yellow-600 font-medium">
                            {competition.prize} • {competition.type}
                          </span>
                        </div>
                      </div>
                      <Link to="/user/competitions">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                          View
                        </button>
                      </Link>
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
                <Link to="/user/competitions">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200">
                    View All Competitions
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


// import { useState, useEffect } from "react"
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../components/AuthContext';
// import { useTrustScore } from '../../components/TrustScoreContext';
// import {
//   Heart,
//   Clock,
//   ShoppingCart,
//   Trophy,
//   BookOpen,
//   Award,
//   TrendingUp,
//   Calendar,
//   Star,
//   Info,
//   Shield,
//   Plus,
//   Check,
//   X,
//   CheckCircle,
//   ArrowRight,
// } from "lucide-react"

// const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:9090/api";

// const Dashboard = () => {
//   const [isSeller, setIsSeller] = useState(false);
//   const [sellerApplication, setSellerApplication] = useState({ open: false, status: null, details: {} });
//   const [currentUserData, setCurrentUserData] = useState(null);
//   const [showTrustScoreInfo, setShowTrustScoreInfo] = useState(false);

//   // backend wiring states
//   const [checkingSeller, setCheckingSeller] = useState(false);
//   const [submittingSeller, setSubmittingSeller] = useState(false);

//   // Get auth context and trust score from hooks
//   const { user } = useAuth();
//   const { trustScore, isLoading: trustScoreLoading } = useTrustScore();

//   // Helper: safe parse JSON or handle empty body
//   const safeJson = async (res) => {
//     const text = await res.text();
//     if (!text) return null;
//     try { return JSON.parse(text); } catch { return null; }
//   };

//   // Check seller mode from backend
//   const checkSellerStatus = async (uid) => {
//     if (!uid) return;
//     try {
//       setCheckingSeller(true);
//       // Try GET (preferred)
//       let res = await fetch(`${API_BASE}/getSellorStatus/${uid}`, { method: "GET" });
//       if (res.status === 405) {
//         // Fallback to POST if backend mapping is POST
//         res = await fetch(`${API_BASE}/getSellorStatus/${uid}`, { method: "POST" });
//       }
//       if (res.ok) {
//         const data = await safeJson(res); // may be null if not set
//         setIsSeller(Boolean(data?.sellorMode));
//       } else if (res.status === 404) {
//         setIsSeller(false);
//       } else {
//         // Unknown status -> assume not seller but log
//         console.warn("getSellorStatus non-OK:", res.status);
//         setIsSeller(false);
//       }
//     } catch (err) {
//       console.error("Error checking seller status:", err);
//       setIsSeller(false);
//     } finally {
//       setCheckingSeller(false);
//     }
//   };

//   // Set seller mode on backend
//   const setSellerStatusTrue = async (uid) => {
//     const payload = { userId: Number(uid), sellorMode: true };
//     const url = `${API_BASE}/setSellorStatus/${uid}`; // backend expects path var + body
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(text || "Failed to enable seller mode");
//     }
//     return safeJson(res);
//   };

//   // Fetch current user data for display
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.email) return;
//       try {
//         const encodedEmail = encodeURIComponent(user.email);
//         const url = `${API_BASE}/getLoginUser?email=${encodedEmail}`;
//         const response = await fetch(url);
//         if (response.ok) {
//           const userData = await response.json();
//           setCurrentUserData({
//             name: userData.fname && userData.lname ? 
//               `${userData.fname} ${userData.lname}` : 
//               (userData.name || user.name || 'User'),
//             email: userData.email || user.email,
//           });
//         } else {
//           setCurrentUserData({
//             name: user.name || 'User',
//             email: user.email,
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setCurrentUserData({
//           name: user.name || 'User',
//           email: user.email,
//         });
//       }
//     };
//     if (user?.email) {
//       fetchUserData();
//     }
//   }, [user]);

//   // Initial seller check when user is available
//   useEffect(() => {
//     if (user?.userId) {
//       checkSellerStatus(user.userId);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.userId]);

//   // Close trust score info modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showTrustScoreInfo && !event.target.closest('.trust-score-info-container')) {
//         setShowTrustScoreInfo(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showTrustScoreInfo]);

//   const statsData = [
//     {
//       title: "Wishlisted",
//       value: "3",
//       icon: Heart,
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50",
//     },
//     {
//       title: "Borrowed",
//       value: "2",
//       icon: Clock,
//       color: "text-blue-500",
//       bgColor: "bg-blue-50",
//     },
//     {
//       title: "Purchased",
//       value: "12",
//       icon: ShoppingCart,
//       color: "text-green-500",
//       bgColor: "bg-green-50",
//     },
//     ...(isSeller
//       ? [
//           {
//             title: "Listed",
//             value: "5",
//             icon: BookOpen,
//             color: "text-purple-500",
//             bgColor: "bg-purple-50",
//           },
//         ]
//       : []),
//   ];

//   const badges = [
//     {
//       name: "Trusted Seller",
//       icon: Star,
//       earned: isSeller,
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50",
//     },
//     {
//       name: "Verified",
//       icon: Shield,
//       earned: true,
//       color: "text-blue-500",
//       bgColor: "bg-blue-50",
//     },
//     {
//       name: "Quick Responder",
//       icon: Clock,
//       earned: true,
//       color: "text-green-500",
//       bgColor: "bg-green-50",
//     },
//     {
//       name: "Power User",
//       icon: Award,
//       earned: (trustScore || 0) >= 900,
//       color: "text-gray-400",
//       bgColor: "bg-gray-50",
//     },
//   ];

//   const recentRequests = [
//     {
//       id: 1,
//       title: "Atomic Habits",
//       type: "Borrow",
//       status: "Completed",
//       date: "2024-01-15",
//       author: "James Clear",
//     },
//     ...(isSeller
//       ? [
//           {
//             id: 2,
//             title: "The Alchemist",
//             type: "Lend",
//             status: "Pending",
//             date: "2025-07-01",
//             author: "Paulo Coelho",
//           },
//         ]
//       : []),
//   ];

//   const featuredCompetitions = [
//     {
//       id: 1,
//       title: "Sri Lankan Heritage Stories",
//       category: "Short Story",
//       prize: "Rs. 25,000",
//       type: "Publication",
//       deadline: "2024-02-28",
//       participants: 156,
//     },
//     {
//       id: 2,
//       title: "Poetry of Emotions",
//       category: "Poetry",
//       prize: "Rs. 10,000",
//       type: "Poetry Collection Publication",
//       deadline: "2024-03-15",
//       participants: 89,
//     },
//   ];

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "active":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const CircularProgress = ({ value, max = 1000 }) => {
//     const displayValue = value || 0;
//     const percentage = (displayValue / max) * 100;
//     const strokeDasharray = 2 * Math.PI * 45;
//     const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

//     return (
//       <div className="relative w-24 h-24">
//         <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
//           <circle
//             cx="50"
//             cy="50"
//             r="45"
//             stroke="currentColor"
//             strokeWidth="8"
//             fill="none"
//             strokeDasharray={strokeDasharray}
//             strokeDashoffset={strokeDashoffset}
//             className="text-green-500 transition-all duration-300 ease-in-out"
//             strokeLinecap="round"
//           />
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="text-2xl font-bold text-gray-900">
//             {trustScoreLoading ? '...' : displayValue}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   const handleBecomeSeller = () => {
//     const currentTrustScore = trustScore || 0;
//     if (currentTrustScore < 700) {
//       alert("Your TrustScore must be at least 700 to apply.");
//       return;
//     }
//     setSellerApplication({ open: true, status: "pending", details: {} });
//   };

//   const handleApplicationSubmit = async () => {
//     if (!user?.userId) {
//       alert("User not found. Please login again.");
//       return;
//     }
//     try {
//       setSubmittingSeller(true);
//       await setSellerStatusTrue(user.userId);
//       setSellerApplication({ open: true, status: "success", details: {} });
//       setIsSeller(true);
//     } catch (err) {
//       console.error("Enable seller mode failed:", err);
//       alert("Failed to enable seller mode. Please try again.");
//     } finally {
//       setSubmittingSeller(false);
//       // Re-check to stay in sync with backend
//       checkSellerStatus(user.userId);
//     }
//   };

//   const handleCloseModal = () => {
//     setSellerApplication({ open: false, status: null, details: {} });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         {/* Welcome Banner */}
//         <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 text-white shadow-lg">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div className="space-y-3">
//               <h1 className="text-1xl sm:text-3xl font-bold tracking-tight">
//                 Welcome back, {currentUserData?.name || user?.name || 'User'}!
//               </h1>
//               <p className="text-blue-100">
//                 Discover new books and connect with readers across Sri Lanka
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-4">
//               <Link to="/user/browse-books">
//                 <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
//                   <BookOpen className="w-5 h-5" />
//                   <span>Browse Books</span>
//                 </button>
//               </Link>
//               {!isSeller && (
//                 <button
//                   onClick={handleBecomeSeller}
//                   className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
//                   disabled={checkingSeller}
//                 >
//                   <TrendingUp className="w-5 h-5" />
//                   <span>Become a Seller</span>
//                 </button>
//               )}
//               {isSeller && (
//                 <>
//                   <Link to="list-book">
//                     <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
//                       <Plus className="w-5 h-5" />
//                       <span>Manage Listings</span>
//                     </button>
//                   </Link>
//                   <Link to="book-request">
//                     <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
//                       <span>Manage Requests</span>
//                     </button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Seller Application Modal */}
//         {sellerApplication.open && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
//             <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
//               <div className="text-center">
//                 {sellerApplication.status === "pending" && (
//                   <>
//                     <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <TrendingUp className="text-blue-500" size={32} />
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Become a Seller</h3>
//                     <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
//                       Start selling your books and earn money while helping other readers discover great books.
//                     </p>
//                     <div className="space-y-4 mb-8 text-left">
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">List unlimited books</span>
//                       </div>
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">Set your own prices</span>
//                       </div>
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">Manage lending periods</span>
//                       </div>
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">Build your reputation</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//                       <button
//                         onClick={handleCloseModal}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
//                       >
//                         Maybe Later
//                       </button>
//                       <button
//                         onClick={handleApplicationSubmit}
//                         className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
//                       >
//                         {submittingSeller ? "Submitting..." : "Get Started"}
//                         <ArrowRight size={20} className="ml-2" />
//                       </button>
//                     </div>
//                   </>
//                 )}
//                 {sellerApplication.status === "success" && (
//                   <>
//                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <Check className="text-green-500" size={32} />
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Success!</h3>
//                     <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
//                       You are now a Seller. Start listing your books and connecting with readers!
//                     </p>
//                     <div className="flex justify-center">
//                       <button
//                         onClick={handleCloseModal}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* TrustScore and Badges Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* TrustScore */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">TrustScore</h2>
//               <div className="relative trust-score-info-container">
//                 <Info 
//                   className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
//                   onClick={() => setShowTrustScoreInfo(!showTrustScoreInfo)}
//                 />
                
//                 {/* Trust Score Info Modal */}
//                 {showTrustScoreInfo && (
//                   <>
//                     {/* Mobile backdrop */}
//                     <div 
//                       className="fixed inset-0 z-40 lg:hidden" 
//                       onClick={() => setShowTrustScoreInfo(false)}
//                     />
                    
//                     <div className="absolute right-0 top-8 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-lg font-semibold text-gray-900">How to Earn Trust Points</h3>
//                         <button 
//                           onClick={() => setShowTrustScoreInfo(false)}
//                           className="text-gray-400 hover:text-gray-600"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
                      
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <ShoppingCart className="w-4 h-4 text-green-600" />
//                             <span className="text-sm font-medium text-gray-900">Purchase a Book</span>
//                           </div>
//                           <span className="text-sm font-bold text-green-600">+200</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <Star className="w-4 h-4 text-blue-600" />
//                             <span className="text-sm font-medium text-gray-900">Write a Review</span>
//                           </div>
//                           <span className="text-sm font-bold text-blue-600">+100</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <Trophy className="w-4 h-4 text-yellow-600" />
//                             <span className="text-sm font-medium text-gray-900">Join Competition</span>
//                           </div>
//                           <span className="text-sm font-bold text-yellow-600">+50</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <TrendingUp className="w-4 h-4 text-purple-600" />
//                             <span className="text-sm font-medium text-gray-900">Join Bidding</span>
//                           </div>
//                           <span className="text-sm font-bold text-purple-600">+50</span>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                         <p className="text-xs text-gray-600 text-center">
//                           Build your reputation by actively participating in the BookHive community!
//                         </p>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
//               <CircularProgress value={trustScore} />
//               <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
//                 <div className="mb-2">
//                   <span className="text-lg sm:text-xl font-semibold text-gray-900">
//                     {trustScoreLoading ? "Loading..." : 
//                      (trustScore || 0) >= 900 ? "Excellent" : 
//                      (trustScore || 0) >= 700 ? "Good" : 
//                      (trustScore || 0) >= 500 ? "Fair" : "Needs Improvement"}
//                   </span>
//                 </div>
//                 <div className="mb-1">
//                   <span className="text-green-600 font-medium text-sm sm:text-base">
//                     {trustScoreLoading ? "..." : "+25 this month"}
//                   </span>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {trustScoreLoading ? "Loading transaction data..." : "Based on 47 completed transactions"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Badges Earned */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
//             <div className="mb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Badges</h2>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {badges.map((badge, index) => (
//                 <div key={index} className="text-center">
//                   <div
//                     className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
//                       badge.bgColor
//                     } ${badge.earned ? "" : "opacity-50"} shadow-sm`}
//                   >
//                     <badge.icon className={`w-6 h-6 ${badge.color}`} />
//                   </div>
//                   <p className={`text-sm font-medium ${badge.earned ? "text-gray-900" : "text-gray-400"}`}>
//                     {badge.name}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statsData.map((stat, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
//                   <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//                 </div>
//                 <div className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}>
//                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Recent Requests */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-gray-600" />
//                 <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Recent Requests</h2>
//               </div>
//             </div>
//             <div className="p-6">
//               {recentRequests.length > 0 ? (
//                 <div className="space-y-4">
//                   {recentRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//                     >
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">{request.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{request.type} • {request.author}</p>
//                         <span
//                           className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                             request.status
//                           )}`}
//                         >
//                           {request.status}
//                         </span>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-gray-500">{request.date}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500 text-sm sm:text-base">No recent requests</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Featured Competitions */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Trophy className="w-5 h-5 text-yellow-500" />
//                   <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Featured Competitions</h2>
//                 </div>
//                 {isSeller && (trustScore || 0) >= 900 && (
//                   <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
//                     <Plus className="w-4 h-4 inline mr-1" /> Create
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="space-y-6">
//                 {featuredCompetitions.map((competition) => (
//                   <div
//                     key={competition.id}
//                     className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">{competition.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{competition.category}</p>
//                         <div className="flex items-center space-x-4 text-sm text-gray-500">
//                           <span className="text-yellow-600 font-medium">
//                             {competition.prize} • {competition.type}
//                           </span>
//                         </div>
//                       </div>
//                       <Link to="/user/competitions">
//                         <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
//                           View
//                         </button>
//                       </Link>
//                     </div>
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="w-3 h-3" />
//                         <span>Deadline: {competition.deadline}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-3 h-3" />
//                         <span>{competition.participants} participants</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-6 text-center">
//                 <Link to="/user/competitions">
//                   <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200">
//                     View All Competitions
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard



// import { useState, useEffect } from "react"
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../components/AuthContext';
// import { useTrustScore } from '../../components/TrustScoreContext';
// import {
//   Heart,
//   Clock,
//   ShoppingCart,
//   Trophy,
//   BookOpen,
//   Award,
//   TrendingUp,
//   Calendar,
//   Star,
//   Info,
//   Shield,
//   Plus,

//   Check,
//   X,
//   CheckCircle,
//   ArrowRight,
// } from "lucide-react"

// const Dashboard = () => {
//   const [isSeller, setIsSeller] = useState(false) // Simulated role state
//   const [sellerApplication, setSellerApplication] = useState({ open: false, status: null, details: {} })
//   const [currentUserData, setCurrentUserData] = useState(null);
//   const [showTrustScoreInfo, setShowTrustScoreInfo] = useState(false);

//   // Get auth context and trust score from hooks
//   const { user } = useAuth();
//   const { trustScore, isLoading: trustScoreLoading } = useTrustScore();

//   // Fetch current user data for display
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.email) return;
      
//       try {
//         const encodedEmail = encodeURIComponent(user.email);
//         const url = `http://localhost:9090/api/getLoginUser?email=${encodedEmail}`;
        
//         const response = await fetch(url);
//         if (response.ok) {
//           const userData = await response.json();
//           setCurrentUserData({
//             name: userData.fname && userData.lname ? 
//               `${userData.fname} ${userData.lname}` : 
//               (userData.name || user.name || 'User'),
//             email: userData.email || user.email,
//           });
//         } else {
//           setCurrentUserData({
//             name: user.name || 'User',
//             email: user.email,
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setCurrentUserData({
//           name: user.name || 'User',
//           email: user.email,
//         });
//       }
//     };

//     if (user?.email) {
//       fetchUserData();
//     }
//   }, [user]);

//   // Close trust score info modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showTrustScoreInfo && !event.target.closest('.trust-score-info-container')) {
//         setShowTrustScoreInfo(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showTrustScoreInfo]);

//   useEffect(() => {
//     // Fetch user role and TrustScore from API (e.g., via JWT)
//     // setIsSeller(response.role === 'seller')
//     // Trust score is now handled by TrustScoreContext
//   }, [])

//   const statsData = [
//     {
//       title: "Wishlisted",
//       value: "3",
//       icon: Heart,
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50",
//     },
//     {
//       title: "Borrowed",
//       value: "2",
//       icon: Clock,
//       color: "text-blue-500",
//       bgColor: "bg-blue-50",
//     },
//     {
//       title: "Purchased",
//       value: "12",
//       icon: ShoppingCart,
//       color: "text-green-500",
//       bgColor: "bg-green-50",
//     },
//     ...(isSeller
//       ? [
//           {
//             title: "Listed",
//             value: "5",
//             icon: BookOpen,
//             color: "text-purple-500",
//             bgColor: "bg-purple-50",
//           },
//         ]
//       : []),
//   ]

//   const badges = [
//     {
//       name: "Trusted Seller",
//       icon: Star,
//       earned: isSeller,
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50",
//     },
//     {
//       name: "Verified",
//       icon: Shield,
//       earned: true,
//       color: "text-blue-500",
//       bgColor: "bg-blue-50",
//     },
//     {
//       name: "Quick Responder",
//       icon: Clock,
//       earned: true,
//       color: "text-green-500",
//       bgColor: "bg-green-50",
//     },
//     {
//       name: "Power User",
//       icon: Award,
//       earned: (trustScore || 0) >= 900,
//       color: "text-gray-400",
//       bgColor: "bg-gray-50",
//     },
//   ]

//   const recentRequests = [
//     {
//       id: 1,
//       title: "Atomic Habits",
//       type: "Borrow",
//       status: "Completed",
//       date: "2024-01-15",
//       author: "James Clear",
//     },
//     ...(isSeller
//       ? [
//           {
//             id: 2,
//             title: "The Alchemist",
//             type: "Lend",
//             status: "Pending",
//             date: "2025-07-01",
//             author: "Paulo Coelho",
//           },
//         ]
//       : []),
//   ]

//   const featuredCompetitions = [
//     {
//       id: 1,
//       title: "Sri Lankan Heritage Stories",
//       category: "Short Story",
//       prize: "Rs. 25,000",
//       type: "Publication",
//       deadline: "2024-02-28",
//       participants: 156,
//     },
//     {
//       id: 2,
//       title: "Poetry of Emotions",
//       category: "Poetry",
//       prize: "Rs. 10,000",
//       type: "Poetry Collection Publication",
//       deadline: "2024-03-15",
//       participants: 89,
//     },
//   ]

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "active":
//         return "bg-blue-100 text-blue-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const CircularProgress = ({ value, max = 1000 }) => {
//     const displayValue = value || 0;
//     const percentage = (displayValue / max) * 100;
//     const strokeDasharray = 2 * Math.PI * 45;
//     const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

//     return (
//       <div className="relative w-24 h-24">
//         <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
//           <circle
//             cx="50"
//             cy="50"
//             r="45"
//             stroke="currentColor"
//             strokeWidth="8"
//             fill="none"
//             strokeDasharray={strokeDasharray}
//             strokeDashoffset={strokeDashoffset}
//             className="text-green-500 transition-all duration-300 ease-in-out"
//             strokeLinecap="round"
//           />
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="text-2xl font-bold text-gray-900">
//             {trustScoreLoading ? '...' : displayValue}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   const handleBecomeSeller = () => {
//     const currentTrustScore = trustScore || 0;
//     if (currentTrustScore < 700) {
//       alert("Your TrustScore must be at least 700 to apply.");
//       return;
//     }
//     setSellerApplication({ open: true, status: "pending", details: {} });
//   };

//   const handleApplicationSubmit = () => {
//     setSellerApplication({ open: true, status: "success", details: {} })
//     setIsSeller(true) // Immediately transition to Seller role
//   }

//   const handleCloseModal = () => {
//     setSellerApplication({ open: false, status: null, details: {} })
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         {/* Welcome Banner */}
//         <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 text-white shadow-lg">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div className="space-y-3">
//               <h1 className="text-1xl sm:text-3xl font-bold tracking-tight">
//                 Welcome back, {currentUserData?.name || user?.name || 'User'}!
//               </h1>
//               <p className="text-blue-100">
//                 Discover new books and connect with readers across Sri Lanka
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-4">
//               <Link to="/user/browse-books">
//                 <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
//                   <BookOpen className="w-5 h-5" />
//                   <span>Browse Books</span>
//                 </button>
//               </Link>
//               {!isSeller && (
//                 <button
//                   onClick={handleBecomeSeller}
//                   className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200"
//                 >
//                   <TrendingUp className="w-5 h-5" />
//                   <span>Become a Seller</span>
//                 </button>
//               )}
//               {isSeller && (
//                 <>
//                   <Link to="list-book">
//                     <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
//                       <Plus className="w-5 h-5" />
//                       <span>Manage Listings</span>
//                     </button>
//                   </Link>
//                   <Link to="book-request">
//                     <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200">
//                       <span>Manage Requests</span>
//                     </button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Seller Application Modal */}
//         {sellerApplication.open && (
//           <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
//             <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
//               <div className="text-center">
//                 {sellerApplication.status === "pending" && (
//                   <>
//                     <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <TrendingUp className="text-blue-500" size={32} />
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Become a Seller</h3>
//                     <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
//                       Start selling your books and earn money while helping other readers discover great books.
//                     </p>
//                     <div className="space-y-4 mb-8 text-left">
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">List unlimited books</span>
//                       </div>
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">Set your own prices</span>
//                       </div>
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">Manage lending periods</span>
//                       </div>
//                       <div className="flex items-center">
//                         <CheckCircle className="text-green-500 mr-3" size={20} />
//                         <span className="text-sm sm:text-base">Build your reputation</span>
//                       </div>
//                     </div>
//                     <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//                       <button
//                         onClick={handleCloseModal}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
//                       >
//                         Maybe Later
//                       </button>
//                       <button
//                         onClick={handleApplicationSubmit}
//                         className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors duration-200"
//                       >
//                         Get Started
//                         <ArrowRight size={20} className="ml-2" />
//                       </button>
//                     </div>
//                   </>
//                 )}
//                 {sellerApplication.status === "success" && (
//                   <>
//                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <Check className="text-green-500" size={32} />
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4 text-gray-900">Success!</h3>
//                     <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
//                       You are now a Seller. Start listing your books and connecting with readers!
//                     </p>
//                     <div className="flex justify-center">
//                       <button
//                         onClick={handleCloseModal}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* TrustScore and Badges Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* TrustScore */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">TrustScore</h2>
//               <div className="relative trust-score-info-container">
//                 <Info 
//                   className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
//                   onClick={() => setShowTrustScoreInfo(!showTrustScoreInfo)}
//                 />
                
//                 {/* Trust Score Info Modal */}
//                 {showTrustScoreInfo && (
//                   <>
//                     {/* Mobile backdrop */}
//                     <div 
//                       className="fixed inset-0 z-40 lg:hidden" 
//                       onClick={() => setShowTrustScoreInfo(false)}
//                     />
                    
//                     <div className="absolute right-0 top-8 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-lg font-semibold text-gray-900">How to Earn Trust Points</h3>
//                         <button 
//                           onClick={() => setShowTrustScoreInfo(false)}
//                           className="text-gray-400 hover:text-gray-600"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
                      
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <ShoppingCart className="w-4 h-4 text-green-600" />
//                             <span className="text-sm font-medium text-gray-900">Purchase a Book</span>
//                           </div>
//                           <span className="text-sm font-bold text-green-600">+200</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <Star className="w-4 h-4 text-blue-600" />
//                             <span className="text-sm font-medium text-gray-900">Write a Review</span>
//                           </div>
//                           <span className="text-sm font-bold text-blue-600">+100</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <Trophy className="w-4 h-4 text-yellow-600" />
//                             <span className="text-sm font-medium text-gray-900">Join Competition</span>
//                           </div>
//                           <span className="text-sm font-bold text-yellow-600">+50</span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
//                           <div className="flex items-center space-x-2">
//                             <TrendingUp className="w-4 h-4 text-purple-600" />
//                             <span className="text-sm font-medium text-gray-900">Join Bidding</span>
//                           </div>
//                           <span className="text-sm font-bold text-purple-600">+50</span>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                         <p className="text-xs text-gray-600 text-center">
//                           Build your reputation by actively participating in the BookHive community!
//                         </p>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
//               <CircularProgress value={trustScore} />
//               <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
//                 <div className="mb-2">
//                   <span className="text-lg sm:text-xl font-semibold text-gray-900">
//                     {trustScoreLoading ? "Loading..." : 
//                      (trustScore || 0) >= 900 ? "Excellent" : 
//                      (trustScore || 0) >= 700 ? "Good" : 
//                      (trustScore || 0) >= 500 ? "Fair" : "Needs Improvement"}
//                   </span>
//                 </div>
//                 <div className="mb-1">
//                   <span className="text-green-600 font-medium text-sm sm:text-base">
//                     {trustScoreLoading ? "..." : "+25 this month"}
//                   </span>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {trustScoreLoading ? "Loading transaction data..." : "Based on 47 completed transactions"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Badges Earned */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
//             <div className="mb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Badges</h2>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {badges.map((badge, index) => (
//                 <div key={index} className="text-center">
//                   <div
//                     className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
//                       badge.bgColor
//                     } ${badge.earned ? "" : "opacity-50"} shadow-sm`}
//                   >
//                     <badge.icon className={`w-6 h-6 ${badge.color}`} />
//                   </div>
//                   <p className={`text-sm font-medium ${badge.earned ? "text-gray-900" : "text-gray-400"}`}>
//                     {badge.name}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statsData.map((stat, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
//                   <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
//                 </div>
//                 <div className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}>
//                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Recent Requests */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center space-x-2">
//                 <Clock className="w-5 h-5 text-gray-600" />
//                 <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Recent Requests</h2>
//               </div>
//             </div>
//             <div className="p-6">
//               {recentRequests.length > 0 ? (
//                 <div className="space-y-4">
//                   {recentRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//                     >
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">{request.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{request.type} • {request.author}</p>
//                         <span
//                           className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                             request.status
//                           )}`}
//                         >
//                           {request.status}
//                         </span>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-gray-500">{request.date}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500 text-sm sm:text-base">No recent requests</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Featured Competitions */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Trophy className="w-5 h-5 text-yellow-500" />
//                   <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Featured Competitions</h2>
//                 </div>
//                 {isSeller && (trustScore || 0) >= 900 && (
//                   <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
//                     <Plus className="w-4 h-4 inline mr-1" /> Create
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="space-y-6">
//                 {featuredCompetitions.map((competition) => (
//                   <div
//                     key={competition.id}
//                     className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">{competition.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{competition.category}</p>
//                         <div className="flex items-center space-x-4 text-sm text-gray-500">
//                           <span className="text-yellow-600 font-medium">
//                             {competition.prize} • {competition.type}
//                           </span>
//                         </div>
//                       </div>
//                       <Link to="/user/competitions">
//                         <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
//                           View
//                         </button>
//                       </Link>
//                     </div>
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="w-3 h-3" />
//                         <span>Deadline: {competition.deadline}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-3 h-3" />
//                         <span>{competition.participants} participants</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-6 text-center">
//                 <Link to="/user/competitions">
//                   <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200">
//                     View All Competitions
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard