// services/messageService.js
const API_BASE_URL = 'http://localhost:9090/api';

// Simple cache for performance
const cache = new Map();
const CACHE_TTL = 1 * 60 * 1000; // Reduced to 1 minute for real-time messaging

const isValidCache = (key) => {
  const cached = cache.get(key);
  return cached && (Date.now() - cached.timestamp) < CACHE_TTL;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const getCache = (key) => {
  const cached = cache.get(key);
  return cached ? cached.data : null;
};

// Enhanced API Client
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

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
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient();

export const messageService = {
  // Basic message operations
  sendMessage: async (messageData) => {
    try {
      console.log('Sending message:', messageData);
      const response = await apiClient.post('/messages/send', {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        content: messageData.content
      });
      
      // Clear cache immediately for real-time updates
      messageService.clearRealtimeCache(messageData.senderId, messageData.receiverId);
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getConversation: async (user1Id, user2Id) => {
    try {
      const cacheKey = `conversation_${user1Id}_${user2Id}`;
      
      // For real-time messaging, reduce cache dependency
      // if (isValidCache(cacheKey)) {
      //   console.log('Returning cached conversation data');
      //   return getCache(cacheKey);
      // }

      console.log(`Getting conversation between ${user1Id} and ${user2Id}`);
      const response = await apiClient.get(`/messages/conversation/${user1Id}/${user2Id}`);
      
      // Cache the response
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  },

  getUserMessages: async (userId) => {
    try {
      const cacheKey = `user_messages_${userId}`;
      
      // Reduced cache for real-time updates
      // if (isValidCache(cacheKey)) {
      //   console.log('Returning cached user messages');
      //   return getCache(cacheKey);
      // }

      const response = await apiClient.get(`/messages/user/${userId}`);
      
      // Cache the response
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting user messages:', error);
      throw error;
    }
  },

  markAsRead: async (messageId) => {
    try {
      await apiClient.put(`/messages/mark-read/${messageId}`);
      
      // Clear related cache
      cache.clear();
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // FIXED: markConversationAsRead function
  markConversationAsRead: async (userId, partnerId) => {
    try {
      console.log(`Marking conversation as read: user=${userId}, partner=${partnerId}`);
      
      // Fix the endpoint to match backend expectations
      await apiClient.put(`/messages/mark-conversation-read/${userId}/${partnerId}`);
      
      // Clear all related cache immediately
      cache.clear();
      
      console.log('Conversation marked as read successfully');
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  },

  getUnreadMessageCount: async (userId) => {
    try {
      const cacheKey = `unread_count_${userId}`;
      
      // Don't cache unread count for real-time updates
      // if (isValidCache(cacheKey)) {
      //   console.log('Returning cached unread count');
      //   return getCache(cacheKey).unreadCount;
      // }

      console.log(`Getting unread count for user: ${userId}`);
      const response = await apiClient.get(`/messages/unread-count/${userId}`);
      
      console.log(`Unread count response:`, response);
      
      // Cache the response
      setCache(cacheKey, response);
      return response.unreadCount;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Utility method to clear cache for real-time updates
  clearRealtimeCache: (userId1, userId2) => {
    const keysToRemove = Array.from(cache.keys()).filter(key => 
      key.includes(`user_messages_${userId1}`) || 
      key.includes(`user_messages_${userId2}`) ||
      key.includes(`conversation_${userId1}`) ||
      key.includes(`conversation_${userId2}`) ||
      key.includes(`unread_count_${userId1}`) ||
      key.includes(`unread_count_${userId2}`)
    );
    
    keysToRemove.forEach(key => cache.delete(key));
    console.log('Cleared real-time cache for users:', userId1, userId2);
  },

  deleteMessage: async (messageId) => {
    try {
      await apiClient.delete(`/messages/${messageId}`);
      
      // Clear related cache
      cache.clear();
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Hub-specific operations
  getHubConversations: async (hubManagerId) => {
    try {
      const cacheKey = `hub_conversations_${hubManagerId}`;
      
      if (isValidCache(cacheKey)) {
        console.log('Returning cached hub conversations');
        return getCache(cacheKey);
      }

      const response = await apiClient.get(`/messages/hub/${hubManagerId}/conversations`);
      
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting hub conversations:', error);
      throw error;
    }
  },

  getConversationSummary: async (hubManagerId) => {
    try {
      const cacheKey = `conversation_summary_${hubManagerId}`;
      
      if (isValidCache(cacheKey)) {
        console.log('Returning cached conversation summary');
        return getCache(cacheKey);
      }

      const response = await apiClient.get(`/messages/hub/${hubManagerId}/summary`);
      
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting conversation summary:', error);
      throw error;
    }
  },

  broadcastMessage: async (hubId, messageData) => {
    try {
      console.log(`Broadcasting message to hub ${hubId}:`, messageData);
      const response = await apiClient.post(`/messages/hub/${hubId}/broadcast`, messageData);
      
      // Clear cache after broadcast
      cache.clear();
      return response;
    } catch (error) {
      console.error('Error broadcasting message:', error);
      throw error;
    }
  },

  getRecentMessages: async (userId, limit = 10) => {
    try {
      const cacheKey = `recent_messages_${userId}_${limit}`;
      
      if (isValidCache(cacheKey)) {
        console.log('Returning cached recent messages');
        return getCache(cacheKey);
      }

      const response = await apiClient.get(`/messages/recent/${userId}`, { limit });
      
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting recent messages:', error);
      throw error;
    }
  },

  // Role-based user fetching
  getAvailableContactsByRole: async (userRole, userId) => {
    try {
      const cacheKey = `contacts_${userRole}_${userId}`;
      
      if (isValidCache(cacheKey)) {
        console.log('Returning cached available contacts');
        return getCache(cacheKey);
      }

      const response = await apiClient.get(`/users/contacts/${userRole}/${userId}`);
      
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting available contacts:', error);
      throw error;
    }
  },

  // Utility methods
  clearCache: () => {
    cache.clear();
    console.log('Message service cache cleared');
  },

  getCacheStats: () => {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  },

  // Additional message operations
  searchMessages: async (userId, searchTerm) => {
    try {
      const response = await apiClient.get(`/messages/search/${userId}`, { 
        searchTerm: encodeURIComponent(searchTerm) 
      });
      return response;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  },

  getMessageById: async (messageId) => {
    try {
      const cacheKey = `message_${messageId}`;
      
      if (isValidCache(cacheKey)) {
        return getCache(cacheKey);
      }

      const response = await apiClient.get(`/messages/${messageId}`);
      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error getting message by ID:', error);
      throw error;
    }
  },

  updateMessage: async (messageId, updateData) => {
    try {
      const response = await apiClient.put(`/messages/${messageId}`, updateData);
      
      // Clear related cache
      cache.clear();
      return response;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }
};

export default messageService;

// Export additional utilities
export { ApiClient, API_BASE_URL };