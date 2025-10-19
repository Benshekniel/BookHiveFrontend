// AdminModeratorService.js - API service layer for moderator management and dashboard

import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:9090/api/admin';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth tokens if needed
// apiClient.interceptors.request.use(
//   (config) => {
//     // Add auth token if available
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for handling common errors
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle common errors
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem('authToken');
//       // Redirect to login if needed
//     }
//     return Promise.reject(error);
//   }
// );

const AdminModeratorService = {
  // ==================== DASHBOARD OPERATIONS ====================

  /**
   * Get complete dashboard data including metrics, recent activities, and quick action counts
   * @returns {Promise} API response
   */
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get only dashboard metrics
   * @returns {Promise} API response
   */
  getDashboardMetrics: async () => {
    try {
      const response = await apiClient.get('/dashboard/metrics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get only recent activities
   * @returns {Promise} API response
   */
  getRecentActivities: async () => {
    try {
      const response = await apiClient.get('/dashboard/activities');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get only quick action counts
   * @returns {Promise} API response
   */
  getQuickActionCounts: async () => {
    try {
      const response = await apiClient.get('/dashboard/quick-actions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Health check endpoint for dashboard service
   * @returns {Promise} API response
   */
  getDashboardHealth: async () => {
    try {
      const response = await apiClient.get('/dashboard/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== CREATE OPERATIONS ====================

  /**
   * Register a new moderator
   * @param {Object} moderatorData - Moderator registration data
   * @returns {Promise} API response
   */
  registerModerator: async (moderatorData) => {
    try {
      // const response = await apiClient.post('/registerModerator', moderatorData);
      const response = await axios.post('http://localhost:9090/api/registerModerator', moderatorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== READ OPERATIONS ====================

  /**
   * Get moderator by ID
   * @param {number} id - Moderator ID
   * @returns {Promise} API response
   */
  getModeratorById: async (id) => {
    try {
      const response = await apiClient.get(`/moderators/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all moderators
   * @returns {Promise} API response
   */
  getAllModerators: async () => {
    try {
      const response = await apiClient.get('/moderators');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get moderator by email
   * @param {string} email - Moderator email
   * @returns {Promise} API response
   */
  getModeratorByEmail: async (email) => {
    try {
      const response = await apiClient.get(`/moderators/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search moderators by name or email
   * @param {string} searchTerm - Search term
   * @returns {Promise} API response
   */
  searchModerators: async (searchTerm) => {
    try {
      const params = searchTerm ? { searchTerm } : {};
      const response = await apiClient.get('/moderators/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get moderators by city
   * @param {string} city - City name
   * @returns {Promise} API response
   */
  getModeratorsByCity: async (city) => {
    try {
      const response = await apiClient.get(`/moderators/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get moderators by minimum experience
   * @param {number} minExperience - Minimum experience in years
   * @returns {Promise} API response
   */
  getModeratorsByExperience: async (minExperience) => {
    try {
      const response = await apiClient.get(`/moderators/experience/${minExperience}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get moderators by age range
   * @param {number} minAge - Minimum age
   * @param {number} maxAge - Maximum age
   * @returns {Promise} API response
   */
  getModeratorsByAgeRange: async (minAge, maxAge) => {
    try {
      const response = await apiClient.get('/moderators/age', {
        params: { minAge, maxAge }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get total moderators count
   * @returns {Promise} API response
   */
  getModeratorCount: async () => {
    try {
      const response = await apiClient.get('/moderators/count');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get moderator's age by ID
   * @param {number} id - Moderator ID
   * @returns {Promise} API response
   */
  getModeratorAge: async (id) => {
    try {
      const response = await apiClient.get(`/moderators/${id}/age`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise} API response
   */
  checkEmailExists: async (email) => {
    try {
      const response = await apiClient.get('/moderators/check-email', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if moderator exists by ID
   * @param {number} id - Moderator ID
   * @returns {Promise} API response
   */
  checkModeratorExists: async (id) => {
    try {
      const response = await apiClient.get(`/moderators/exists/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== UPDATE OPERATIONS ====================

  /**
   * Update moderator details
   * @param {number} id - Moderator ID
   * @param {Object} moderatorData - Updated moderator data
   * @returns {Promise} API response
   */
  updateModerator: async (id, moderatorData) => {
    try {
      const response = await apiClient.put(`/moderators/${id}`, moderatorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== DELETE OPERATIONS ====================

  /**
   * Delete moderator by ID
   * @param {number} id - Moderator ID
   * @returns {Promise} API response
   */
  deleteModerator: async (id) => {
    try {
      const response = await apiClient.delete(`/moderators/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete moderator by email
   * @param {string} email - Moderator email
   * @returns {Promise} API response
   */
  deleteModeratorByEmail: async (email) => {
    try {
      const response = await apiClient.delete(`/moderators/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete multiple moderators by IDs
   * @param {Array<number>} ids - Array of moderator IDs
   * @returns {Promise} API response
   */
  deleteModerators: async (ids) => {
    try {
      const response = await apiClient.delete('/moderators/batch', { data: ids });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete all moderators by city
   * @param {string} city - City name
   * @returns {Promise} API response
   */
  deleteModeratorsByCity: async (city) => {
    try {
      const response = await apiClient.delete(`/moderators/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Soft delete moderator
   * @param {number} id - Moderator ID
   * @returns {Promise} API response
   */
  softDeleteModerator: async (id) => {
    try {
      const response = await apiClient.patch(`/moderators/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

// Add these analytics methods to your existing AdminModeratorService object in adminService.js

// ==================== ANALYTICS OPERATIONS ====================

/**
 * Get complete analytics dashboard data
 * @returns {Promise} API response
 */
getDashboardAnalytics: async () => {
  try {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  } catch (error) {
    throw error;
  }
},

/**
 * Get analytics stats
 * @returns {Promise} API response
 */
getAnalyticsStats: async () => {
  try {
    const response = await apiClient.get('/analytics/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
},

/**
 * Get popular genres
 * @returns {Promise} API response
 */
getPopularGenres: async () => {
  try {
    const response = await apiClient.get('/analytics/popular-genres');
    return response.data;
  } catch (error) {
    throw error;
  }
},

/**
 * Get top users
 * @param {number} limit - Number of top users to fetch (default: 10)
 * @returns {Promise} API response
 */
getTopUsers: async (limit = 10) => {
  try {
    const response = await apiClient.get('/analytics/top-users', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},

/**
 * Get monthly revenue for a specific year
 * @param {number} year - Year for which to fetch monthly revenue
 * @returns {Promise} API response
 */
getMonthlyRevenue: async (year) => {
  try {
    const response = await apiClient.get(`/analytics/monthly-revenue/${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
},

/**
 * Get yearly user growth data
 * @returns {Promise} API response
 */
getYearlyUsers: async () => {
  try {
    const response = await apiClient.get('/analytics/yearly-users');
    return response.data;
  } catch (error) {
    throw error;
  }
},

// ==================== PAYMENT ANALYTICS OPERATIONS ====================

  /**
   * Get filtered transactions
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  getFilteredTransactions: async (params) => {
    try {
      const response = await apiClient.get('/payment-analytics/transactions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment stats
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  getPaymentStats: async (params) => {
    try {
      const response = await apiClient.get('/payment-analytics/stats', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export transactions as CSV
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  exportTransactions: async (params) => {
    try {
      const response = await apiClient.get('/payment-analytics/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction types
   * @returns {Promise} API response
   */
  getTransactionTypes: async () => {
    try {
      const response = await apiClient.get('/payment-analytics/transaction-types');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction statuses
   * @returns {Promise} API response
   */
  getTransactionStatuses: async () => {
    try {
      const response = await apiClient.get('/payment-analytics/transaction-statuses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment statuses
   * @returns {Promise} API response
   */
  getPaymentStatuses: async () => {
    try {
      const response = await apiClient.get('/payment-analytics/payment-statuses');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction by ID
   * @param {number} id - Transaction ID
   * @returns {Promise} API response
   */
  getTransactionById: async (id) => {
    try {
      const response = await apiClient.get(`/payment-analytics/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== UTILITY METHODS ====================

  /**
   * Handle API errors and return user-friendly messages
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return data.message || 'Invalid request. Please check your input.';
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'Forbidden. You don\'t have permission to perform this action.';
        case 404:
          return data.message || 'Resource not found.';
        case 409:
          return data.message || 'Conflict. This email might already exist.';
        case 500:
          return data.message || 'Internal server error. Please try again later.';
        default:
          return data.message || `Error: ${status}`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your connection and try again.';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred.';
    }
  }
};

export default AdminModeratorService;