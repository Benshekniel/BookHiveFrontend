import React, { useEffect, useState } from 'react';
import { BookOpen, Gift, Calendar, TrendingUp, Users, Clock, AlertCircle, RefreshCw, Award, Trophy, Target, Medal } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_BASE_URL = 'http://localhost:9090/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  // Check if user is authenticated
  if (!user) {
    return <p>Please log in.</p>;
  }

  const orgId = user.userId; // Use user.userId as orgId

  const [stats, setStats] = useState([
    { icon: BookOpen, label: 'Pending Requests', value: '-', color: 'text-accent' },
    { icon: Gift, label: 'Books Received', value: '-', color: 'text-success' },
    { icon: Calendar, label: 'Upcoming Events', value: '-', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Total Donations', value: '-', color: 'text-primary' },
  ]);

  const [recentRequests, setRecentRequests] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);

  // Direct API call function
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`API Response: ${endpoint} - Success`);
        return data;
      }

      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // Get dashboard stats
  const getDashboardStats = async (orgId) => {
    try {
      const data = await apiCall(`/organization-dashboard/stats/${orgId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  };

  // Get recent requests
  const getRecentRequests = async (orgId) => {
    try {
      const data = await apiCall(`/organization-dashboard/recent-requests/${orgId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch recent requests:', error);
      throw error;
    }
  };

  // Get top donors
  const getTopDonors = async (orgId) => {
    try {
      const data = await apiCall(`/organization-dashboard/top-donors/${orgId}`, {
        method: 'GET',
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch top donors:', error);
      return [];
    }
  };

  // Get active competitions
  const getActiveCompetitions = async () => {
    try {
      const data = await apiCall(`/organization-dashboard/active-competitions`, {
        method: 'GET',
      });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch active competitions:', error);
      return [];
    }
  };

  const loadDashboardData = async () => {
    try {
      setError(null);

      // Make all API calls in parallel
      const [statsData, requestsData, donorsData, competitionsData] = await Promise.all([
        getDashboardStats(orgId),
        getRecentRequests(orgId),
        getTopDonors(orgId),
        getActiveCompetitions(),
      ]);

      // Update stats with real data
      setStats([
        {
          icon: BookOpen,
          label: 'Pending Requests',
          value: statsData.pendingRequests ?? 0,
          color: 'text-accent',
          change: statsData.pendingRequestsChange ?? null,
        },
        {
          icon: Gift,
          label: 'Books Received',
          value: statsData.booksReceived ?? 0,
          color: 'text-success',
          change: statsData.booksReceivedChange ?? null,
        },
        {
          icon: Users,
          label: 'Active Donors',
          value: statsData.activeDonors ?? donorsData.length ?? 0,
          color: 'text-secondary',
          change: statsData.activeDonorsChange ?? null,
        },
        {
          icon: TrendingUp,
          label: 'Total Donations',
          value: statsData.totalDonations ?? 0,
          color: 'text-primary',
          change: statsData.totalDonationsChange ?? null,
        },
      ]);

      setRecentRequests(Array.isArray(requestsData) ? requestsData : []);
      setTopDonors(Array.isArray(donorsData) ? donorsData : []);
      setActiveCompetitions(Array.isArray(competitionsData) ? competitionsData : []);
    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setError('Failed to load dashboard data. Please try again.');
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!orgId) {
        setError('Organization ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      await loadDashboardData();
      setLoading(false);
    };

    initializeDashboard();
  }, [orgId]);

  const handleRefresh = async () => {
    if (!orgId) {
      setError('Organization ID is required');
      return;
    }

    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-secondary/10 text-primary';
      case 'delivered':
        return 'bg-accent/10 text-accent';
      case 'rejected':
        return 'bg-error/10 text-error';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const handleQuickAction = (action) => {
    // Implement navigation for quick actions
    switch (action) {
      case 'request-books':
        navigate('/organization/request');
        break;
      case 'create-event':
        navigate('/create-event');
        break;
      case 'view-donors':
        navigate('/organization/received');
        break;
      case 'view-all-requests':
        navigate('/organization/received'); // Adjust route as needed
        break;
      
      default:
        console.log(`Quick action: ${action}`);
        break;
        
    }
  };

  const handleViewCompetitionDetails = (competition) => {
    setSelectedCompetition(competition);
    setShowCompetitionModal(true);
  };

  const closeCompetitionModal = () => {
    setShowCompetitionModal(false);
    setSelectedCompetition(null);
  };

  const calculateDaysRemaining = (endDateTime) => {
    if (!endDateTime) return null;
    const days = Math.ceil((new Date(endDateTime) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'TBA';
    try {
      return new Date(dateTimeString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your organization.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-red-600 hover:text-red-700 text-sm font-medium mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-heading font-bold text-textPrimary">{stat.value}</p>
                  {stat.change !== null && (
                    <p className={`text-xs ${stat.change >= 0 ? 'text-success' : 'text-error'}`}>
                      {stat.change >= 0 ? '+' : ''}{stat.change}% from last month
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Book Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-textPrimary">Recent Book Requests</h2>
            <button
              className="text-accent hover:text-accent/80 text-sm font-medium"
              onClick={() => handleQuickAction('view-all-requests')}
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No recent requests.</p>
              </div>
            ) : (
              recentRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-textPrimary">{request.title || 'Untitled Request'}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {request.quantity || 0} books
                      {request.subject && ` • ${request.subject}`}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(request.dateRequested || request.date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status || 'Unknown'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Donors Leaderboard */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-textPrimary flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-secondary" />
              Top Donors
            </h2>
            <button
              className="text-accent hover:text-accent/80 text-sm font-medium"
              onClick={() => handleQuickAction('view-donors')}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {topDonors.length === 0 ? (
              <div className="text-center py-8">
                <Award className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No donor data available.</p>
              </div>
            ) : (
              topDonors.slice(0, 5).map((donor, index) => (
                <div 
                  key={donor.id || index} 
                  className="flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md"
                  style={{
                    background: index === 0 ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' :
                               index === 1 ? 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)' :
                               index === 2 ? 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)' :
                               '#F9FAFB'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank Badge */}
                    <div 
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-md ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-primary'
                      }`}
                    >
                      {index < 3 ? (
                        <Trophy className="h-5 w-5" />
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Donor Info */}
                    <div>
                      <h3 className="font-semibold text-textPrimary">
                        {donor.donorName || donor.name || 'Anonymous Donor'}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Gift className="h-3 w-3 mr-1" />
                          {donor.donationCount || 0} donations
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(donor.lastDonationDate || donor.lastDonation)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Books Count */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {donor.totalBooks || donor.quantity || 0}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">books</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Donor Recognition Note */}
          {topDonors.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 flex items-center">
                <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Thank you to all our amazing donors for making a difference in education!</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Active Competitions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-textPrimary flex items-center">
            <Target className="h-6 w-6 mr-2 text-accent" />
            Active Competitions
          </h2>
          {activeCompetitions.length > 3 && (
            <button
              className="text-accent hover:text-accent/80 text-sm font-medium"
              onClick={() => navigate('/competitions')}
            >
              View All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCompetitions.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Medal className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No active competitions at the moment.</p>
            </div>
          ) : (
            activeCompetitions.slice(0, 3).map((competition, index) => (
              <div 
                key={competition.competitionId || index}
                className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                {/* Compact Banner */}
                <div 
                  className="h-20 bg-gradient-to-r from-primary to-accent flex items-center justify-center relative"
                  style={{
                    backgroundImage: competition.bannerImage ? `url(${competition.bannerImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!competition.bannerImage && (
                    <Trophy className="h-8 w-8 text-white opacity-60" />
                  )}
                  {/* Prize Badge - Top Right */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white/95 px-2 py-1 rounded-full shadow-sm">
                    <Medal className="h-3 w-3 text-secondary" />
                    <span className="text-xs font-bold text-secondary">{competition.prizeTrustScore || 0}</span>
                  </div>
                </div>
                
                {/* Compact Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-textPrimary text-sm line-clamp-1 mb-1">
                    {competition.title}
                  </h3>
                  {competition.theme && (
                    <p className="text-xs text-accent font-medium mb-2 line-clamp-1">
                      {competition.theme}
                    </p>
                  )}
                  
                  {/* Inline Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{competition.currentParticipants || 0}/{competition.maxParticipants || '∞'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {competition.endDateTime ? 
                          Math.ceil((new Date(competition.endDateTime) - new Date()) / (1000 * 60 * 60 * 24)) + 'd left'
                          : 'TBA'}
                      </span>
                    </div>
                  </div>
                  
                  {/* View Button */}
                  <button
                    onClick={() => handleViewCompetitionDetails(competition)}
                    className="w-full bg-gray-50 text-primary text-sm py-1.5 rounded hover:bg-primary hover:text-white transition-all font-medium group-hover:bg-primary group-hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4 text-center">Quick Actions</h2>
        <div className="flex justify-center gap-4">
          <button
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => handleQuickAction('request-books')}
          >
            <BookOpen className="h-5 w-5" />
            <span>Request Books</span>
          </button>
         
          <button
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            onClick={() => handleQuickAction('view-donors')}
          >
            <Users className="h-5 w-5" />
            <span>View Donors</span>
          </button>
        </div>
      </div>

      {/* Competition Details Modal */}
      {showCompetitionModal && selectedCompetition && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-primary/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto m-8">
            {/* Modal Header with Banner */}
            <div className="relative">
              <div 
                className="h-40 bg-gradient-to-r from-primary to-accent flex items-center justify-center"
                style={{
                  backgroundImage: selectedCompetition.bannerImage ? `url(${selectedCompetition.bannerImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!selectedCompetition.bannerImage && (
                  <Trophy className="h-16 w-16 text-white opacity-60" />
                )}
                {/* Close Button */}
                <button
                  onClick={closeCompetitionModal}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Prize Badge */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                  <Medal className="h-6 w-6" />
                  <span className="font-bold text-lg">{selectedCompetition.prizeTrustScore || 0} Trust Points</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 pt-12">
              {/* Title and Theme */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-heading font-bold text-textPrimary mb-2">
                  {selectedCompetition.title}
                </h2>
                {selectedCompetition.theme && (
                  <p className="text-lg text-accent font-semibold">
                    Theme: {selectedCompetition.theme}
                  </p>
                )}
                {/* Status Badge */}
                <div className="flex items-center justify-center space-x-2 mt-3">
                  {selectedCompetition.activeStatus && (
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                      Active Now
                    </span>
                  )}
                  {selectedCompetition.pauseStatus && (
                    <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium">
                      Paused
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedCompetition.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-textPrimary mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedCompetition.description}</p>
                </div>
              )}

              {/* Competition Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-600 mb-1">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">Participants</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    {selectedCompetition.currentParticipants || 0}
                    <span className="text-lg text-blue-600">
                      {selectedCompetition.maxParticipants ? ` / ${selectedCompetition.maxParticipants}` : ''}
                    </span>
                  </p>
                  {selectedCompetition.maxParticipants && (
                    <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full transition-all"
                        style={{
                          width: `${Math.min((selectedCompetition.currentParticipants / selectedCompetition.maxParticipants) * 100, 100)}%`
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-orange-600 mb-1">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">Time Remaining</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-800">
                    {calculateDaysRemaining(selectedCompetition.endDateTime) !== null
                      ? `${calculateDaysRemaining(selectedCompetition.endDateTime)} Days`
                      : 'TBA'}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {selectedCompetition.endDateTime && calculateDaysRemaining(selectedCompetition.endDateTime) > 0
                      ? 'Until competition ends'
                      : 'Competition ended'}
                  </p>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-textPrimary mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Competition Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Competition Period</p>
                      <p className="text-xs text-gray-500">Submit your entries during this time</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {formatDate(selectedCompetition.startDateTime)}
                      </p>
                      <p className="text-xs text-gray-500">to</p>
                      <p className="text-sm font-semibold text-primary">
                        {formatDate(selectedCompetition.endDateTime)}
                      </p>
                    </div>
                  </div>
                  
                  {selectedCompetition.votingStartDateTime && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Voting Period</p>
                          <p className="text-xs text-gray-500">Community votes for winners</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-accent">
                            {formatDate(selectedCompetition.votingStartDateTime)}
                          </p>
                          <p className="text-xs text-gray-500">to</p>
                          <p className="text-sm font-semibold text-accent">
                            {formatDate(selectedCompetition.votingEndDateTime)}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
               
                <button
                  onClick={closeCompetitionModal}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;