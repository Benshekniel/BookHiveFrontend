import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, Gift, Calendar, TrendingUp, Users, Clock, AlertCircle, RefreshCw, Bell, X } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:9090/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Check if user is authenticated
  if (!user) {
    return <p>Please log in.</p>;
  }

  const orgId = user.userId;

  const [stats, setStats] = useState([
    { icon: BookOpen, label: 'Pending Requests', value: '-', color: 'text-accent' },
    { icon: Gift, label: 'Books Received', value: '-', color: 'text-success' },
    { icon: Calendar, label: 'Upcoming Events', value: '-', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Total Donations', value: '-', color: 'text-primary' },
  ]);

  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Get upcoming events
  const getUpcomingEvents = async (orgId) => {
    try {
      const data = await apiCall(`/organization-dashboard/upcoming-events/${orgId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
      throw error;
    }
  };

  // Get notifications
  const getNotifications = async (orgId) => {
    try {
      const data = await apiCall(`/organization-dashboard/notifications/${orgId}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Return mock notifications if API fails
      return [];
    }
  };

  // Generate notifications from recent data
  const generateNotifications = (requests, events) => {
    const notifs = [];
    
    // Add notifications for recent requests
    requests.slice(0, 3).forEach((request) => {
      notifs.push({
        id: `request-${request.id}`,
        type: 'request',
        title: 'Book Request Update',
        message: `Your request for "${request.title || 'books'}" is ${request.status || 'pending'}`,
        timestamp: request.dateRequested || request.date,
        read: false,
        action: () => navigate('/organization/request'),
      });
    });

    // Add notifications for upcoming events
    events.slice(0, 2).forEach((event) => {
      notifs.push({
        id: `event-${event.id}`,
        type: 'event',
        title: 'Upcoming Event',
        message: `${event.title || event.name} is scheduled for ${formatDate(event.date || event.eventDate)}`,
        timestamp: event.date || event.eventDate,
        read: false,
        action: () => navigate('/organization/events'),
      });
    });

    return notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const loadDashboardData = async () => {
    try {
      setError(null);

      // Make all API calls in parallel
      const [statsData, requestsData, eventsData] = await Promise.all([
        getDashboardStats(orgId),
        getRecentRequests(orgId),
        getUpcomingEvents(orgId),
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
          icon: Calendar,
          label: 'Upcoming Events',
          value: statsData.upcomingEvents ?? 0,
          color: 'text-secondary',
          change: statsData.upcomingEventsChange ?? null,
        },
        {
          icon: TrendingUp,
          label: 'Total Donations',
          value: statsData.totalDonations ?? 0,
          color: 'text-primary',
          change: statsData.totalDonationsChange ?? null,
        },
      ]);

      const requests = Array.isArray(requestsData) ? requestsData : [];
      const events = Array.isArray(eventsData) ? eventsData : [];

      setRecentRequests(requests);
      setUpcomingEvents(events);

      // Load notifications
      try {
        const notifData = await getNotifications(orgId);
        const generatedNotifs = Array.isArray(notifData) && notifData.length > 0 
          ? notifData 
          : generateNotifications(requests, events);
        
        setNotifications(generatedNotifs);
        setUnreadCount(generatedNotifs.filter(n => !n.read).length);
      } catch {
        const generatedNotifs = generateNotifications(requests, events);
        setNotifications(generatedNotifs);
        setUnreadCount(generatedNotifs.filter(n => !n.read).length);
      }
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

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = async () => {
    if (!orgId) {
      setError('Organization ID is required');
      return;
    }

    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      notification.action();
    }
    setShowNotifications(false);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setShowNotifications(false);
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

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(timestamp);
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    
    switch (action) {
      case 'request-books':
        navigate('/organization/request');
        break;
      case 'create-event':
        navigate('/organization/events');
        break;
      case 'view-donors':
        navigate('/organization/received');
        break;
      case 'view-all-requests':
        navigate('/organization/request');
        break;
      case 'view-all-events':
        navigate('/organization/events');
        break;
      default:
        console.warn(`Unknown action: ${action}`);
        break;
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
        
        <div className="flex items-center space-x-3">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="relative p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h3 className="font-semibold text-textPrimary">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'request' ? 'bg-accent/10' : 'bg-secondary/10'
                            }`}>
                              {notification.type === 'request' ? (
                                <BookOpen className="h-4 w-4 text-accent" />
                              ) : (
                                <Calendar className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-sm text-textPrimary">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {getTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={clearAllNotifications}
                      className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
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

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-textPrimary">Upcoming Events</h2>
            <button
              className="text-accent hover:text-accent/80 text-sm font-medium"
              onClick={() => handleQuickAction('view-all-events')}
            >
              View All
            </button>
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
          <button
            className="flex items-center justify-center space-x-2 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
            onClick={() => handleQuickAction('request-books')}
          >
            <BookOpen className="h-5 w-5" />
            <span>Request Books</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 p-4 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm hover:shadow-md"
            onClick={() => handleQuickAction('create-event')}
          >
            <Calendar className="h-5 w-5" />
            <span>Create Event</span>
          </button>
          <button
            className="flex items-center justify-center space-x-2 p-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md"
            onClick={() => handleQuickAction('view-donors')}
          >
            <Users className="h-5 w-5" />
            <span>View Donations</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;