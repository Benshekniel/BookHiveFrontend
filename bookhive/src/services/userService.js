// userService.js - API service layer for user profile management

import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:9090/api/user';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const UserService = {
  // ==================== PROFILE OPERATIONS ====================

  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} API response
   */
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(`/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== PASSWORD OPERATIONS ====================

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {Object} passwordData - Password change data {oldPassword, newPassword, confirmPassword}
   * @returns {Promise} API response
   */
  updatePassword: async (userId, passwordData) => {
    try {
      const response = await apiClient.put(`/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== AVATAR OPERATIONS ====================

  /**
   * Upload user avatar
   * @param {number} userId - User ID
   * @param {File} file - Image file
   * @returns {Promise} API response
   */
  uploadAvatar: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(`/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== EMAIL VALIDATION ====================

  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @param {number} userId - Current user ID (to exclude from check)
   * @returns {Promise} API response
   */
  checkEmailAvailability: async (email, userId = null) => {
    try {
      const params = { email };
      if (userId) {
        params.userId = userId;
      }
      const response = await apiClient.get('/check-email', { params });
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
          return data.message || 'User not found.';
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
  },

  /**
   * Validate file for avatar upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result {valid: boolean, error: string}
   */
  validateAvatarFile: (file) => {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 2MB' };
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPG, PNG, or GIF files are allowed' };
    }

    return { valid: true, error: null };
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result {valid: boolean, strength: number, message: string}
   */
  validatePassword: (password) => {
    if (!password) {
      return { valid: false, strength: 0, message: 'Password is required' };
    }

    if (password.length < 8) {
      return { valid: false, strength: 0, message: 'Password must be at least 8 characters long' };
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthText = strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong';
    
    return { 
      valid: true, 
      strength, 
      message: `Password strength: ${strengthText}` 
    };
  }
};

export default UserService;