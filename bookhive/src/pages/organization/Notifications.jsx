import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, Gift, Calendar, MessageCircle, Settings, CheckCircle, X } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const ORG_ID = 1; // TODO: Replace with real orgId from context or props

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    notificationService.getByOrganization(ORG_ID)
      .then(data => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load notifications');
        setLoading(false);
      });
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation': return Gift;
      case 'request': return BookOpen;
      case 'event': return Calendar;
      case 'message': return MessageCircle;
      case 'delivery': return CheckCircle;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'donation': return 'text-success bg-success/10';
      case 'request': return 'text-accent bg-accent/10';
      case 'event': return 'text-secondary bg-secondary/10';
      case 'message': return 'text-primary bg-primary/10';
      case 'delivery': return 'text-success bg-success/10';
      case 'system': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.markAsRead(id);
      // Refresh notifications
      const data = await notificationService.getByOrganization(ORG_ID);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to mark as read');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.markAllAsRead(ORG_ID);
      const data = await notificationService.getByOrganization(ORG_ID);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to mark all as read');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.delete(id);
      const data = await notificationService.getByOrganization(ORG_ID);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to delete notification');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your book requests, donations, and events
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'donation', label: 'Donations', count: notifications.filter(n => n.type === 'donation').length },
            { key: 'request', label: 'Requests', count: notifications.filter(n => n.type === 'request').length },
            { key: 'event', label: 'Events', count: notifications.filter(n => n.type === 'event').length },
            { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => {
          const IconComponent = getNotificationIcon(notification.type);
          const colorClasses = getNotificationColor(notification.type);
          
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${colorClasses}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${!notification.read ? 'text-textPrimary' : 'text-gray-700'}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block"></span>
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">{notification.timestamp}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-error transition-colors"
                        title="Delete notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {notification.actionUrl && (
                    <button className="mt-3 text-accent hover:text-accent/80 text-sm font-medium transition-colors">
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You're all caught up! No notifications to show." 
              : `No ${filter} notifications found.`
            }
          </p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">
          Notification Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-textPrimary">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-textPrimary">Book Request Updates</h3>
              <p className="text-sm text-gray-600">Get notified about request status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-textPrimary">Event Reminders</h3>
              <p className="text-sm text-gray-600">Reminders for upcoming events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-textPrimary">New Message Alerts</h3>
              <p className="text-sm text-gray-600">Notifications for new messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;