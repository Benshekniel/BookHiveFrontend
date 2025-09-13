import React, { useEffect, useState } from 'react';
import { BookOpen, Gift, Calendar, TrendingUp, Users, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { dashboardService } from '../../services/organizationService';

const Dashboard = ({ organizationId }) => {
  const [stats, setStats] = useState([
    { icon: BookOpen, label: 'Pending Requests', value: '-', color: 'text-accent' },
    { icon: Gift, label: 'Books Received', value: '-', color: 'text-success' },
    { icon: Calendar, label: 'Upcoming Events', value: '-', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Total Donations', value: '-', color: 'text-primary' }
  ]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [statsData, requestsData, eventsData] = await Promise.all([
        dashboardService.getStats(organizationId),
        dashboardService.getRecentRequests(organizationId),
        dashboardService.getUpcomingEvents(organizationId)
      ]);

      // Update stats with real data
      setStats([
        { 
          icon: BookOpen, 
          label: 'Pending Requests', 
          value: statsData.pendingRequests ?? 0, 
          color: 'text-accent',
          change: statsData.pendingRequestsChange ?? null
        },
        { 
          icon: Gift, 
          label: 'Books Received', 
          value: statsData.booksReceived ?? 0, 
          color: 'text-success',
          change: statsData.booksReceivedChange ?? null
        },
        { 
          icon: Calendar, 
          label: 'Upcoming Events', 
          value: statsData.upcomingEvents ?? 0, 
          color: 'text-secondary',
          change: statsData.upcomingEventsChange ?? null
        },
        { 
          icon: TrendingUp, 
          label: 'Total Donations', 
          value: statsData.totalDonations ?? 0, 
          color: 'text-primary',
          change: statsData.totalDonationsChange ?? null
        }
      ]);

      setRecentRequests(Array.isArray(requestsData) ? requestsData : []);
      setUpcomingEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setError('Failed to load dashboard data. Please try again.');
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await loadDashboardData();
      setLoading(false);
    };

    initializeDashboard();
  }, [organizationId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-success/10 text-success';
      case 'pending': return 'bg-secondary/10 text-primary';
      case 'delivered': return 'bg-accent/10 text-accent';
      case 'rejected': return 'bg-error/10 text-error';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
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
        hour12: true
      });
    } catch {
      return timeString;
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
                  {stat.change && (
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
            <button className="text-accent hover:text-accent/80 text-sm font-medium">View All</button>
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

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-textPrimary">Upcoming Events</h2>
            <button className="text-accent hover:text-accent/80 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No upcoming events.</p>
              </div>
            ) : (
              upcomingEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-textPrimary truncate">{event.title || event.name || 'Untitled Event'}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(event.date || event.eventDate)}
                        {event.time && ` at ${formatTime(event.time)}`}
                      </span>
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-500 truncate">{event.location}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <BookOpen className="h-5 w-5" />
            <span>Request Books</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors">
            <Calendar className="h-5 w-5" />
            <span>Create Event</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            <Users className="h-5 w-5" />
            <span>View Donors</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;