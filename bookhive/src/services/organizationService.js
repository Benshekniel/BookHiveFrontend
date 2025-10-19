// src/services/organizationService.js
const API_BASE_URL = 'http://localhost:9090/api';

// Simple cache for performance
const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

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
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

// =============================================================================
// ORGANIZATION PROFILE SERVICE (This was missing!)
// =============================================================================
export const organizationService = {
  // Get organization profile
  async getProfile(orgId) {
    const cacheKey = `org-profile-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organizations/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch organization profile:', error);
      throw error;
    }
  },

  // Update organization profile
  async updateProfile(orgId, profileData) {
    try {
      const data = await apiClient.put(`/organizations/${orgId}`, profileData);
      cache.delete(`org-profile-${orgId}`);
      return data;
    } catch (error) {
      console.error('Failed to update organization profile:', error);
      throw error;
    }
  },

  // Get organization statistics
  async getStatistics(orgId) {
    const cacheKey = `org-statistics-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organizations/${orgId}/statistics`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch organization statistics:', error);
      throw error;
    }
  },

  // Upload organization logo/image
  async uploadImage(orgId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      cache.delete(`org-profile-${orgId}`);
      return data;
    } catch (error) {
      console.error('Failed to upload organization image:', error);
      throw error;
    }
  },

  // Change organization password
  async changePassword(orgId, passwordData) {
    try {
      const data = await apiClient.put(`/organizations/${orgId}/change-password`, passwordData);
      return data;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  },

  // Enable/disable two-factor authentication
  async toggleTwoFactorAuth(orgId, enable = true) {
    try {
      const data = await apiClient.post(`/organizations/${orgId}/two-factor-auth`, { enable });
      return data;
    } catch (error) {
      console.error('Failed to toggle two-factor authentication:', error);
      throw error;
    }
  }
};

// =============================================================================
// DASHBOARD SERVICE
// =============================================================================
export const dashboardService = {
  async getStats(orgId) {
    const cacheKey = `dashboard-stats-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-dashboard/stats/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  async getRecentRequests(orgId) {
    const cacheKey = `dashboard-recent-requests-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-dashboard/recent-requests/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch recent requests:', error);
      throw error;
    }
  },

  async getUpcomingEvents(orgId) {
    const cacheKey = `dashboard-upcoming-events-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-dashboard/upcoming-events/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
      throw error;
    }
  }
};

// =============================================================================
// BOOK REQUEST SERVICE
// =============================================================================
export const bookRequestService = {
  async create(requestData) {
    try {
      const data = await apiClient.post('/book-requests', requestData);
      // Clear related cache
      cache.delete(`book-requests-org-${requestData.organizationId}`);
      cache.delete(`dashboard-stats-${requestData.organizationId}`);
      cache.delete(`dashboard-recent-requests-${requestData.organizationId}`);
      return data;
    } catch (error) {
      console.error('Failed to create book request:', error);
      throw error;
    }
  },

  async getByOrganization(orgId) {
    const cacheKey = `book-requests-org-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/book-requests/organization/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch book requests:', error);
      throw error;
    }
  },

  async getById(requestId) {
    const cacheKey = `book-request-${requestId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/book-requests/${requestId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch book request:', error);
      throw error;
    }
  },

  async update(requestId, updateData) {
    try {
      const data = await apiClient.put(`/book-requests/${requestId}`, updateData);
      // Clear related cache
      cache.delete(`book-request-${requestId}`);
      if (updateData.organizationId) {
        cache.delete(`book-requests-org-${updateData.organizationId}`);
      }
      return data;
    } catch (error) {
      console.error('Failed to update book request:', error);
      throw error;
    }
  },

  async cancel(requestId) {
    try {
      const data = await apiClient.delete(`/book-requests/${requestId}`);
      cache.delete(`book-request-${requestId}`);
      return data;
    } catch (error) {
      console.error('Failed to cancel book request:', error);
      throw error;
    }
  }
};

// =============================================================================
// DONATION SERVICE
// =============================================================================
export const donationService = {
  async getDonationsByOrganization(orgId) {
    const cacheKey = `donations-org-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-donations/organization/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      throw error;
    }
  },

  async markAsReceived(donationId, confirmationData) {
    try {
      const data = await apiClient.post(`/organization-donations/${donationId}/mark-received`, confirmationData);
      // Clear related cache
      if (confirmationData.organizationId) {
        cache.delete(`donations-org-${confirmationData.organizationId}`);
        cache.delete(`dashboard-stats-${confirmationData.organizationId}`);
      }
      return data;
    } catch (error) {
      console.error('Failed to mark donation as received:', error);
      throw error;
    }
  }
};

// =============================================================================
// FEEDBACK SERVICE
// =============================================================================
export const feedbackService = {
  async create(feedbackData) {
    try {
      const data = await apiClient.post('/organization-feedback', feedbackData);
      // Clear related cache
      if (feedbackData.organizationId) {
        cache.delete(`feedback-org-${feedbackData.organizationId}`);
      }
      return data;
    } catch (error) {
      console.error('Failed to create feedback:', error);
      throw error;
    }
  },

  async getByOrganization(orgId) {
    const cacheKey = `feedback-org-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-feedback/organization/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      throw error;
    }
  },

  async getPendingDonations(orgId) {
    const cacheKey = `pending-donations-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-donations/pending-feedback/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch pending donations:', error);
      return [];
    }
  }
};

// =============================================================================
// NOTIFICATION SERVICE
// =============================================================================
export const notificationService = {
  async getByOrganization(orgId) {
    const cacheKey = `notifications-org-${orgId}`;
    
    if (isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const data = await apiClient.get(`/organization-notifications/organization/${orgId}`);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const data = await apiClient.put(`/organization-notifications/${notificationId}/read`);
      // Clear cache for all organization notifications since we don't know the orgId here
      cache.forEach((_, key) => {
        if (key.startsWith('notifications-org-')) {
          cache.delete(key);
        }
      });
      return data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead(orgId) {
    try {
      const data = await apiClient.put(`/organization-notifications/organization/${orgId}/read-all`);
      cache.delete(`notifications-org-${orgId}`);
      return data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  async delete(notificationId) {
    try {
      const data = await apiClient.delete(`/organization-notifications/${notificationId}`);
      // Clear cache for all organization notifications
      cache.forEach((_, key) => {
        if (key.startsWith('notifications-org-')) {
          cache.delete(key);
        }
      });
      return data;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
export const organizationUtils = {
  // Clear all cache for an organization
  clearOrganizationCache(orgId) {
    const keysToDelete = [];
    cache.forEach((_, key) => {
      if (key.includes(`-${orgId}`) || key.includes(`-org-${orgId}`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cache.delete(key));
  },

  // Clear all cache
  clearAllCache() {
    cache.clear();
  },

  // Get cache statistics
  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
      ttl: CACHE_TTL
    };
  }
};

// Default export with all services
export default {
  organization: organizationService,
  dashboard: dashboardService,
  bookRequest: bookRequestService,
  donation: donationService,
  feedback: feedbackService,
  notification: notificationService,
  utils: organizationUtils
};