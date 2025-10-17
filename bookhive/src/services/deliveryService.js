// src/services/deliveryService.js - Complete file with caching and all APIs
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

// Agent API Service
// Agent API Service
export const agentApi = {
  getAllAgents: async (useCache = true) => {
    const cacheKey = 'all_agents';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agents = await apiClient.get('/agents');
      setCache(cacheKey, agents);
      return agents;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return [];
    }
  },

  getAvailableAgents: async (useCache = true) => {
    const cacheKey = 'available_agents';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agents = await apiClient.get('/agents/available');
      setCache(cacheKey, agents);
      return agents;
    } catch (error) {
      console.error('Failed to fetch available agents:', error);
      return [];
    }
  },

  getAgentById: async (agentId) => {
    try {
      return await apiClient.get(`/agents/${agentId}`);
    } catch (error) {
      console.error(`Failed to fetch agent ${agentId}:`, error);
      return null;
    }
  },

  getAgentByUserId: async (userId) => {
    try {
      return await apiClient.get(`/agents/user/${userId}`);
    } catch (error) {
      console.error(`Failed to fetch agent by user ID ${userId}:`, error);
      return null;
    }
  },

  getAgentsByHub: async (hubId) => {
    try {
      return await apiClient.get(`/agents/hub/${hubId}`);
    } catch (error) {
      console.error(`Failed to fetch agents for hub ${hubId}:`, error);
      return [];
    }
  },

  getAvailableAgentsByHub: async (hubId) => {
    try {
      return await apiClient.get(`/agents/available/hub/${hubId}`);
    } catch (error) {
      console.error(`Failed to fetch available agents for hub ${hubId}:`, error);
      return [];
    }
  },

  getAgentPerformanceByHub: async (hubId) => {
    try {
      return await apiClient.get(`/agents/performance/hub/${hubId}`);
    } catch (error) {
      console.error(`Failed to fetch agent performance for hub ${hubId}:`, error);
      return [];
    }
  },

  createAgent: async (agentData) => {
    try {
      const result = await apiClient.post('/agents', agentData);
      cache.clear(); // Clear cache after mutations
      return result;
    } catch (error) {
      console.error('Failed to create agent:', error);
      throw error;
    }
  },

  updateAgentStatus: async (agentId, status) => {
    try {
      const result = await apiClient.put(`/agents/${agentId}/status`, { status });
      cache.clear();
      return result;
    } catch (error) {
      console.error(`Failed to update agent ${agentId} status:`, error);
      throw error;
    }
  }
};

// Delivery API Service
export const deliveryApi = {
  getAllDeliveries: async (useCache = true) => {
    const cacheKey = 'all_deliveries';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    const deliveries = await apiClient.get('/deliveries');
    setCache(cacheKey, deliveries);
    return deliveries;
  },

  getDeliveryStats: async (useCache = true) => {
    const cacheKey = 'delivery_stats';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    const stats = await apiClient.get('/deliveries/stats');
    setCache(cacheKey, stats);
    return stats;
  },

  getDeliverySummary: async (useCache = true) => {
    const cacheKey = 'delivery_summary';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    const summary = await apiClient.get('/deliveries/summary');
    setCache(cacheKey, summary);
    return summary;
  },

  getDeliveryById: (deliveryId) => apiClient.get(`/deliveries/${deliveryId}`),
  getDeliveryByTrackingNumber: (trackingNumber) => apiClient.get(`/deliveries/tracking/${trackingNumber}`),
  getDeliveriesByHub: (hubId) => apiClient.get(`/deliveries/hub/${hubId}`),
  getDeliveriesByAgent: (agentId) => apiClient.get(`/deliveries/agent/${agentId}`),
  getDeliveriesByStatus: (status) => apiClient.get(`/deliveries/status/${status}`),
  getTodaysDeliveries: () => apiClient.get('/deliveries/today'),

  createDelivery: async (deliveryData) => {
    const result = await apiClient.post('/deliveries', deliveryData);
    cache.clear();
    return result;
  },

  updateDeliveryStatus: async (deliveryId, status) => {
    const result = await apiClient.put(`/deliveries/${deliveryId}/status`, { status });
    cache.clear();
    return result;
  },

  assignAgent: async (deliveryId, agentId) => {
    const result = await apiClient.put(`/deliveries/${deliveryId}/assign-agent`, { agentId });
    cache.clear();
    return result;
  },

  deleteDelivery: async (deliveryId) => {
    const result = await apiClient.delete(`/deliveries/${deliveryId}`);
    cache.clear();
    return result;
  },
};

// Hub API Service
// Hub API Service
export const hubApi = {
  // 🔥 Updated to support limit parameter
  getAllHubs: async (useCache = true, limit = null) => {
    // 🔥 Modified cache key to include limit for proper caching
    const cacheKey = limit ? `all_hubs_limit_${limit}` : 'all_hubs';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    // 🔥 Add limit parameter to URL if provided
    const url = limit ? `/hubs?limit=${limit}` : '/hubs';
    const hubs = await apiClient.get(url);
    setCache(cacheKey, hubs);
    return hubs;
  },

  // 🔥 Updated to support limit parameter
  getHubStats: async (useCache = true, limit = null) => {
    // 🔥 Modified cache key to include limit for proper caching
    const cacheKey = limit ? `hub_stats_limit_${limit}` : 'hub_stats';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    // 🔥 Add limit parameter to URL if provided
    const url = limit ? `/hubs/stats?limit=${limit}` : '/hubs/stats';
    const stats = await apiClient.get(url);
    setCache(cacheKey, stats);
    return stats;
  },

  getHubById: (hubId) => apiClient.get(`/hubs/${hubId}`),
  getHubsByCity: (city) => apiClient.get(`/hubs/city/${city}`),
  getHubPerformance: (hubId) => apiClient.get(`/hubs/${hubId}/performance`),
  getHubAgents: (hubId) => apiClient.get(`/hubs/${hubId}/agents`),
  getHubDeliveries: (hubId) => apiClient.get(`/hubs/${hubId}/deliveries`),

  createHub: async (hubData) => {
    const result = await apiClient.post('/hubs', hubData);
    cache.clear();
    return result;
  },

  updateHub: async (hubId, hubData) => {
    const result = await apiClient.put(`/hubs/${hubId}`, hubData);
    cache.clear();
    return result;
  },

  assignManager: async (hubId, userId) => {
    const result = await apiClient.post(`/hubs/${hubId}/assign-manager`, { userId });
    cache.clear();
    return result;
  },

  deleteHub: async (hubId) => {
    const result = await apiClient.delete(`/hubs/${hubId}`);
    cache.clear();
    return result;
  },
};
// Message API Service
export const messageApi = {
  // POST /api/messages/send
  sendMessage: (messageData) => {
    console.log('Sending message via API:', messageData);
    return apiClient.post('/messages/send', {
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      content: messageData.content
    });
  },

  // GET /api/messages/conversation/{user1Id}/{user2Id}
  getConversation: (user1Id, user2Id) => {
    console.log(`Getting conversation between ${user1Id} and ${user2Id}`);
    return apiClient.get(`/messages/conversation/${user1Id}/${user2Id}`);
  },

  // GET /api/messages/user/{userId}
  getUserMessages: (userId) => apiClient.get(`/messages/user/${userId}`),

  // PUT /api/messages/mark-read/{messageId}
  markAsRead: (messageId) => apiClient.put(`/messages/mark-read/${messageId}`),

  // PUT /api/messages/mark-conversation-read/{receiverId}/{senderId}
  markConversationAsRead: (receiverId, senderId) =>
    apiClient.put(`/messages/mark-conversation-read/${receiverId}/${senderId}`),

  // GET /api/messages/unread-count/{userId}
  getUnreadMessageCount: (userId) => apiClient.get(`/messages/unread-count/${userId}`),

  // DELETE /api/messages/{messageId}
  deleteMessage: (messageId) => apiClient.delete(`/messages/${messageId}`),

  // Hub-specific endpoints
  // GET /api/messages/hub/{hubManagerId}/conversations
  getHubConversations: (hubManagerId) => {
    console.log(`Getting hub conversations for manager ${hubManagerId}`);
    return apiClient.get(`/messages/hub/${hubManagerId}/conversations`);
  },

  // GET /api/messages/hub/{hubManagerId}/summary
  getConversationSummary: (hubManagerId) =>
    apiClient.get(`/messages/hub/${hubManagerId}/summary`),

  // POST /api/messages/hub/{hubId}/broadcast
  broadcastMessage: (hubId, messageData) => {
    console.log(`Broadcasting message to hub ${hubId}:`, messageData);
    return apiClient.post(`/messages/hub/${hubId}/broadcast`, messageData);
  },

  // GET /api/messages/recent/{userId}
  getRecentMessages: (userId, limit = 10) =>
    apiClient.get(`/messages/recent/${userId}`, { limit }),
};

// Route API Service
export const routeApi = {
  // GET /api/routes
  getAllRoutes: () => apiClient.get('/routes'),

  // GET /api/routes/{routeId}
  getRouteById: (routeId) => apiClient.get(`/routes/${routeId}`),

  // GET /api/routes/hub/{hubId}
  getRoutesByHub: (hubId) => apiClient.get(`/routes/hub/${hubId}`),

  // GET /api/routes/status/{status}
  getRoutesByStatus: (status) => apiClient.get(`/routes/status/${status}`),

  // GET /api/routes/type/{routeType}
  getRoutesByType: (routeType) => apiClient.get(`/routes/type/${routeType}`),

  // GET /api/routes/{routeId}/agents
  getRouteAgents: (routeId) => apiClient.get(`/routes/${routeId}/agents`),

  // GET /api/routes/{routeId}/deliveries
  getRouteDeliveries: (routeId) => apiClient.get(`/routes/${routeId}/deliveries`),

  // GET /api/routes/{routeId}/performance
  getRoutePerformance: (routeId) => apiClient.get(`/routes/${routeId}/performance`),

  // GET /api/routes/postal-code/{postalCode}
  getRouteByPostalCode: (postalCode) => apiClient.get(`/routes/postal-code/${postalCode}`),

  // POST /api/routes
  createRoute: (routeData) => {
    const payload = {
      name: routeData.name,
      description: routeData.description,
      hubId: routeData.hubId,
      coverageArea: routeData.coverageArea,
      postalCodes: Array.isArray(routeData.postalCodes)
        ? routeData.postalCodes.join(', ')
        : routeData.postalCodes,
      centerLatitude: routeData.coordinates?.lat || routeData.centerLatitude,
      centerLongitude: routeData.coordinates?.lng || routeData.centerLongitude,
      estimatedDeliveryTime: routeData.estimatedDeliveryTime,
      maxDailyDeliveries: routeData.maxDailyDeliveries,
      priorityLevel: routeData.priorityLevel || 3,
      neighborhoods: JSON.stringify(routeData.neighborhoods || []),
      landmarks: JSON.stringify(routeData.landmarks || []),
      trafficPattern: routeData.trafficPattern || 'MODERATE',
      routeType: routeData.routeType || 'RESIDENTIAL',
      vehicleRestrictions: JSON.stringify(routeData.vehicleRestrictions || []),
      boundaryCoordinates: routeData.boundaryCoordinates
        ? (typeof routeData.boundaryCoordinates === 'string'
          ? routeData.boundaryCoordinates
          : JSON.stringify(routeData.boundaryCoordinates))
        : null
    };

    console.log('Creating route with boundary coordinates:', payload.boundaryCoordinates ? 'YES' : 'NO');
    return apiClient.post('/routes', payload);
  },

  // PUT /api/routes/{routeId}
  updateRoute: (routeId, routeData) => {
    const payload = {
      name: routeData.name,
      description: routeData.description,
      coverageArea: routeData.coverageArea,
      postalCodes: Array.isArray(routeData.postalCodes)
        ? routeData.postalCodes.join(', ')
        : routeData.postalCodes,
      centerLatitude: routeData.coordinates?.lat || routeData.centerLatitude,
      centerLongitude: routeData.coordinates?.lng || routeData.centerLongitude,
      estimatedDeliveryTime: routeData.estimatedDeliveryTime,
      maxDailyDeliveries: routeData.maxDailyDeliveries,
      priorityLevel: routeData.priorityLevel,
      neighborhoods: JSON.stringify(routeData.neighborhoods || []),
      landmarks: JSON.stringify(routeData.landmarks || []),
      trafficPattern: routeData.trafficPattern,
      routeType: routeData.routeType,
      vehicleRestrictions: JSON.stringify(routeData.vehicleRestrictions || []),
      boundaryCoordinates: routeData.boundaryCoordinates
        ? (typeof routeData.boundaryCoordinates === 'string'
          ? routeData.boundaryCoordinates
          : JSON.stringify(routeData.boundaryCoordinates))
        : null
    };

    console.log('Updating route with boundary coordinates:', payload.boundaryCoordinates ? 'YES' : 'NO');
    return apiClient.put(`/routes/${routeId}`, payload);
  },

  // PUT /api/routes/{routeId}/status
  updateRouteStatus: (routeId, status) =>
    apiClient.put(`/routes/${routeId}/status`, { status }),

  // POST /api/routes/{routeId}/assign-agent
  assignAgentToRoute: (routeId, agentId) =>
    apiClient.post(`/routes/${routeId}/assign-agent`, { agentId }),

  // DELETE /api/routes/{routeId}/remove-agent/{agentId}
  removeAgentFromRoute: (routeId, agentId) =>
    apiClient.delete(`/routes/${routeId}/remove-agent/${agentId}`),

  // POST /api/routes/{routeId}/assign-multiple-agents
  assignMultipleAgents: (routeId, agentIds) =>
    apiClient.post(`/routes/${routeId}/assign-multiple-agents`, { agentIds }),

  // GET /api/routes/{routeId}/boundaries
  getRouteBoundaries: (routeId) => apiClient.get(`/routes/${routeId}/boundaries`),

  // PUT /api/routes/{routeId}/boundaries
  updateRouteBoundaries: (routeId, boundaryCoordinates) =>
    apiClient.put(`/routes/${routeId}/boundaries`, {
      boundaryCoordinates: typeof boundaryCoordinates === 'string'
        ? boundaryCoordinates
        : JSON.stringify(boundaryCoordinates)
    }),

  // GET /api/routes/search
  searchRoutes: (searchParams) => {
    const queryParams = {
      name: searchParams.name,
      postalCode: searchParams.postalCode,
      neighborhood: searchParams.neighborhood,
      routeType: searchParams.routeType,
      status: searchParams.status,
      hubId: searchParams.hubId
    };
    return apiClient.get('/routes/search', queryParams);
  },

  // GET /api/routes/nearby
  getNearbyRoutes: (latitude, longitude, radiusKm = 5) =>
    apiClient.get('/routes/nearby', {
      latitude,
      longitude,
      radius: radiusKm
    }),

  // GET /api/routes/analytics/hub/{hubId}
  getRouteAnalytics: (hubId, dateFrom, dateTo) =>
    apiClient.get(`/routes/analytics/hub/${hubId}`, {
      dateFrom,
      dateTo
    }),

  // GET /api/routes/{routeId}/optimization-suggestions
  getOptimizationSuggestions: (routeId) =>
    apiClient.get(`/routes/${routeId}/optimization-suggestions`),

  // POST /api/routes/bulk-create
  bulkCreateRoutes: (routesData) =>
    apiClient.post('/routes/bulk-create', { routes: routesData }),

  // PUT /api/routes/bulk-update-status
  bulkUpdateStatus: (routeIds, status) =>
    apiClient.put('/routes/bulk-update-status', { routeIds, status }),

  // DELETE /api/routes/{routeId}
  deleteRoute: (routeId) => apiClient.delete(`/routes/${routeId}`),

  // POST /api/routes/validate-coverage
  validateRouteCoverage: (routeData) =>
    apiClient.post('/routes/validate-coverage', routeData),

  // GET /api/routes/postal-codes/available
  getAvailablePostalCodes: (hubId) =>
    apiClient.get('/routes/postal-codes/available', { hubId }),

  // GET /api/routes/export/csv
  exportRoutesToCSV: (hubId, filters = {}) =>
    apiClient.get('/routes/export/csv', { hubId, ...filters }),

  // POST /api/routes/import/csv
  importRoutesFromCSV: (file, hubId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('hubId', hubId);

    return apiClient.request('/routes/import/csv', {
      method: 'POST',
      body: formData,
      headers: {} // Remove content-type to let browser set it with boundary
    });
  }
};

// Route Assignment API Service
export const routeAssignmentApi = {
  // GET /api/route-assignments/route/{routeId}
  getAssignmentsByRoute: (routeId) => apiClient.get(`/route-assignments/route/${routeId}`),

  // GET /api/route-assignments/agent/{agentId}
  getAssignmentsByAgent: (agentId) => apiClient.get(`/route-assignments/agent/${agentId}`),

  // GET /api/route-assignments/hub/{hubId}
  getAssignmentsByHub: (hubId) => apiClient.get(`/route-assignments/hub/${hubId}`),

  // POST /api/route-assignments
  createAssignment: (assignmentData) => apiClient.post('/route-assignments', assignmentData),

  // PUT /api/route-assignments/{assignmentId}/status
  updateAssignmentStatus: (assignmentId, status) =>
    apiClient.put(`/route-assignments/${assignmentId}/status`, { status }),

  // DELETE /api/route-assignments/{assignmentId}
  deleteAssignment: (assignmentId) => apiClient.delete(`/route-assignments/${assignmentId}`),
};

// Transaction API Service
export const transactionApi = {
  getAllTransactions: async (useCache = true) => {
    const cacheKey = 'all_transactions';

    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    const transactions = await apiClient.get('/transactions');
    setCache(cacheKey, transactions);
    return transactions;
  },

  getTransactionById: (transactionId) => apiClient.get(`/transactions/${transactionId}`),
  getTransactionsByStatus: (status) => apiClient.get(`/transactions/status/${status}`),
  getTransactionsByType: (type) => apiClient.get(`/transactions/type/${type}`),
  getTransactionsByPaymentStatus: (paymentStatus) => apiClient.get(`/transactions/payment-status/${paymentStatus}`),
  getHubRevenue: (hubId) => apiClient.get(`/transactions/hub/${hubId}/revenue`),
  getRevenueSummary: () => apiClient.get('/transactions/revenue-summary'),

  createTransaction: async (transactionData) => {
    const result = await apiClient.post('/transactions', transactionData);
    cache.clear();
    return result;
  },

  updateTransactionStatus: async (transactionId, status) => {
    const result = await apiClient.put(`/transactions/${transactionId}/status`, { status });
    cache.clear();
    return result;
  },

  updatePaymentStatus: async (transactionId, paymentStatus) => {
    const result = await apiClient.put(`/transactions/${transactionId}/payment-status`, { paymentStatus });
    cache.clear();
    return result;
  },
};

// Dashboard API Service
// export const dashboardApi = {
//   getDashboardSummary: async (useCache = true) => {
//     const cacheKey = 'dashboard_summary';

//     if (useCache && isValidCache(cacheKey)) {
//       return getCache(cacheKey);
//     }

//     try {
//       const summary = await apiClient.get('/dashboard/summary');
//       setCache(cacheKey, summary);
//       return summary;
//     } catch (error) {
//       console.warn('Dashboard summary endpoint not available, using fallback');
//       // Fallback to individual calls
//       return await dashboardApi.getDashboardSummaryFallback();
//     }
//   },

//   getDashboardSummaryFallback: async () => {
//     try {
//       const [deliveryStats, agents, hubs, transactions] = await Promise.all([
//         deliveryApi.getDeliveryStats(),
//         agentApi.getAvailableAgents(),
//         hubApi.getAllHubs(),
//         transactionApi.getAllTransactions()
//       ]);

//       return {
//         deliveryStats,
//         agents,
//         hubs,
//         transactions,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('Error in dashboard summary fallback:', error);
//       throw error;
//     }
//   }
// };

// Enhanced helper functions for route management with boundary coordinate support
export const routeHelpers = {
  // Parse postal codes from comma-separated string
  parsePostalCodes: (postalCodesString) => {
    if (!postalCodesString) return [];
    return postalCodesString.split(',').map(code => code.trim()).filter(code => code);
  },

  // Format postal codes for display
  formatPostalCodes: (postalCodesArray) => {
    if (!Array.isArray(postalCodesArray)) return '';
    return postalCodesArray.join(', ');
  },

  // Parse JSON fields
  parseJsonField: (jsonString, defaultValue = []) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.warn('Failed to parse JSON field:', error);
      return defaultValue;
    }
  },

  // Enhanced boundary coordinates parsing
  parseBoundaryCoordinates: (boundaryCoordinatesString) => {
    try {
      if (!boundaryCoordinatesString || boundaryCoordinatesString.trim() === '') {
        return null;
      }

      const parsed = JSON.parse(boundaryCoordinatesString);

      // Validate that it's an array of coordinate objects
      if (Array.isArray(parsed) && parsed.length >= 3) {
        const validCoordinates = parsed.map(coord => ({
          lat: parseFloat(coord.lat),
          lng: parseFloat(coord.lng)
        })).filter(coord =>
          !isNaN(coord.lat) && !isNaN(coord.lng) &&
          coord.lat >= -90 && coord.lat <= 90 &&
          coord.lng >= -180 && coord.lng <= 180
        );

        if (validCoordinates.length >= 3) {
          console.log(`Parsed ${validCoordinates.length} valid boundary coordinates`);
          return validCoordinates;
        }
      }

      console.warn('Invalid boundary coordinates format or insufficient points');
      return null;
    } catch (error) {
      console.warn('Failed to parse boundary coordinates:', error);
      return null;
    }
  },

  // Format boundary coordinates for API
  formatBoundaryCoordinates: (coordinatesArray) => {
    if (!Array.isArray(coordinatesArray) || coordinatesArray.length < 3) {
      return null;
    }

    try {
      return JSON.stringify(coordinatesArray);
    } catch (error) {
      console.warn('Failed to format boundary coordinates:', error);
      return null;
    }
  },

  // Validate boundary coordinates
  validateBoundaryCoordinates: (boundaryCoordinates) => {
    const errors = [];

    if (!boundaryCoordinates) {
      return { isValid: true, errors: [] }; // Optional field
    }

    if (typeof boundaryCoordinates === 'string') {
      try {
        const parsed = JSON.parse(boundaryCoordinates);
        boundaryCoordinates = parsed;
      } catch (e) {
        errors.push('Boundary coordinates must be valid JSON');
        return { isValid: false, errors };
      }
    }

    if (!Array.isArray(boundaryCoordinates)) {
      errors.push('Boundary coordinates must be an array');
      return { isValid: false, errors };
    }

    if (boundaryCoordinates.length < 3) {
      errors.push('Boundary coordinates must contain at least 3 points');
      return { isValid: false, errors };
    }

    for (let i = 0; i < boundaryCoordinates.length; i++) {
      const coord = boundaryCoordinates[i];
      if (!coord.lat || !coord.lng) {
        errors.push(`Coordinate ${i + 1} must have lat and lng properties`);
      } else {
        const lat = parseFloat(coord.lat);
        const lng = parseFloat(coord.lng);

        if (isNaN(lat) || lat < -90 || lat > 90) {
          errors.push(`Coordinate ${i + 1} has invalid latitude: ${lat}`);
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
          errors.push(`Coordinate ${i + 1} has invalid longitude: ${lng}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Generate sample boundary coordinates for testing
  generateSampleBoundary: (center, radiusKm = 1) => {
    const { lat, lng } = center;
    const radius = radiusKm / 111; // Rough conversion to degrees
    const points = 8;
    const coordinates = [];

    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const pointLat = lat + (radius * Math.cos(angle));
      const pointLng = lng + (radius * Math.sin(angle));
      coordinates.push({
        lat: parseFloat(pointLat.toFixed(6)),
        lng: parseFloat(pointLng.toFixed(6))
      });
    }

    console.log(`Generated sample boundary with ${coordinates.length} points around ${lat}, ${lng}`);
    return coordinates;
  },

  // Check if point is inside polygon (for testing)
  isPointInPolygon: (point, polygon) => {
    if (!polygon || polygon.length < 3) return false;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].lat > point.lat) !== (polygon[j].lat > point.lat)) &&
        (point.lng < (polygon[j].lng - polygon[i].lng) *
          (point.lat - polygon[i].lat) / (polygon[j].lat - polygon[i].lat) + polygon[i].lng)) {
        inside = !inside;
      }
    }
    return inside;
  },

  // Calculate polygon area (in square kilometers)
  calculatePolygonArea: (polygon) => {
    if (!polygon || polygon.length < 3) return 0;

    let area = 0;
    const earthRadius = 6371; // Earth radius in kilometers

    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const lat1 = polygon[i].lat * Math.PI / 180;
      const lat2 = polygon[j].lat * Math.PI / 180;
      const lng1 = polygon[i].lng * Math.PI / 180;
      const lng2 = polygon[j].lng * Math.PI / 180;

      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = Math.abs(area) * earthRadius * earthRadius / 2;
    return parseFloat(area.toFixed(2));
  },

  // Calculate polygon perimeter
  calculatePolygonPerimeter: (coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;

    let perimeter = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const current = coordinates[i];
      const next = coordinates[(i + 1) % coordinates.length];

      // Use Haversine formula for distance
      const R = 6371; // Earth radius in kilometers
      const dLat = (next.lat - current.lat) * Math.PI / 180;
      const dLng = (next.lng - current.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(current.lat * Math.PI / 180) * Math.cos(next.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      perimeter += distance;
    }

    return parseFloat(perimeter.toFixed(2));
  },

  // Get polygon center (centroid)
  getPolygonCenter: (polygon) => {
    if (!polygon || polygon.length === 0) return null;

    let latSum = 0;
    let lngSum = 0;

    polygon.forEach(coord => {
      latSum += coord.lat;
      lngSum += coord.lng;
    });

    return {
      lat: latSum / polygon.length,
      lng: lngSum / polygon.length
    };
  },

  // Calculate route efficiency
  calculateRouteEfficiency: (deliveredCount, totalCount) => {
    if (totalCount === 0) return 0;
    return Math.round((deliveredCount / totalCount) * 100);
  },

  // Get route type color
  getRouteTypeColor: (routeType) => {
    const colors = {
      RESIDENTIAL: 'bg-blue-100 text-blue-800',
      COMMERCIAL: 'bg-green-100 text-green-800',
      INDUSTRIAL: 'bg-orange-100 text-orange-800',
      MIXED: 'bg-purple-100 text-purple-800',
      UNIVERSITY: 'bg-indigo-100 text-indigo-800',
      DOWNTOWN: 'bg-red-100 text-red-800'
    };
    return colors[routeType] || 'bg-gray-100 text-gray-800';
  },

  // Get traffic pattern color
  getTrafficPatternColor: (trafficPattern) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MODERATE: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800',
      VARIABLE: 'bg-purple-100 text-purple-800'
    };
    return colors[trafficPattern] || 'bg-gray-100 text-gray-800';
  },

  // Validate route data
  validateRouteData: (routeData) => {
    const errors = [];

    if (!routeData.name || routeData.name.trim().length < 3) {
      errors.push('Route name must be at least 3 characters long');
    }

    if (!routeData.hubId) {
      errors.push('Hub ID is required');
    }

    if (routeData.centerLatitude && (routeData.centerLatitude < -90 || routeData.centerLatitude > 90)) {
      errors.push('Latitude must be between -90 and 90');
    }

    if (routeData.centerLongitude && (routeData.centerLongitude < -180 || routeData.centerLongitude > 180)) {
      errors.push('Longitude must be between -180 and 180');
    }

    if (routeData.estimatedDeliveryTime && routeData.estimatedDeliveryTime < 1) {
      errors.push('Estimated delivery time must be greater than 0');
    }

    if (routeData.maxDailyDeliveries && routeData.maxDailyDeliveries < 1) {
      errors.push('Max daily deliveries must be greater than 0');
    }

    // Validate boundary coordinates if provided
    if (routeData.boundaryCoordinates) {
      const boundaryValidation = routeHelpers.validateBoundaryCoordinates(routeData.boundaryCoordinates);
      if (!boundaryValidation.isValid) {
        errors.push(...boundaryValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  },

  // Check if a point is within a route's boundary
  isPointInRoute: (point, routeBoundaries) => {
    return routeHelpers.isPointInPolygon(point, routeBoundaries);
  },

  // Convert boundary coordinates to Google Maps polygon paths
  boundaryToGoogleMapsPath: (boundaryCoordinates) => {
    if (!boundaryCoordinates || !Array.isArray(boundaryCoordinates)) {
      return null;
    }

    return boundaryCoordinates.map(coord => ({
      lat: parseFloat(coord.lat),
      lng: parseFloat(coord.lng)
    }));
  },

  // Create boundary coordinates from Google Maps polygon
  googleMapsPathToBoundary: (path) => {
    if (!path || !Array.isArray(path)) {
      return null;
    }

    return path.map(coord => ({
      lat: parseFloat(coord.lat),
      lng: parseFloat(coord.lng)
    }));
  },

  // Get boundary coordinate statistics
  getBoundaryStats: (boundaryCoordinates) => {
    if (!boundaryCoordinates || !Array.isArray(boundaryCoordinates) || boundaryCoordinates.length < 3) {
      return null;
    }

    const lats = boundaryCoordinates.map(coord => coord.lat);
    const lngs = boundaryCoordinates.map(coord => coord.lng);

    return {
      pointCount: boundaryCoordinates.length,
      center: routeHelpers.getPolygonCenter(boundaryCoordinates),
      area: routeHelpers.calculatePolygonArea(boundaryCoordinates),
      perimeter: routeHelpers.calculatePolygonPerimeter(boundaryCoordinates),
      bounds: {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs)
      }
    };
  },

  // Format boundary coordinates for display
  formatBoundaryDisplay: (boundaryCoordinates) => {
    if (!boundaryCoordinates) {
      return 'No boundary defined';
    }

    const stats = routeHelpers.getBoundaryStats(boundaryCoordinates);
    if (!stats) {
      return 'Invalid boundary data';
    }

    return `${stats.pointCount} points, ${stats.area} km²`;
  },

  // Debug helper to log boundary coordinates
  debugBoundaryCoordinates: (routeName, boundaryCoordinates) => {
    if (boundaryCoordinates) {
      const stats = routeHelpers.getBoundaryStats(boundaryCoordinates);
      console.log(`Route "${routeName}" boundary:`, stats);
    } else {
      console.log(`Route "${routeName}" has no boundary coordinates`);
    }
  }
};

// Cache utilities
export const cacheUtils = {
  clearAll: () => {
    cache.clear();
    console.log('All cache cleared');
  },

  clearPattern: (pattern) => {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  },

  getCacheStats: () => {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  }
};

// Add this new API service for document downloads
// Updated API service for document downloads
export const documentApi = {
  // Download document by URL
  downloadDocument: async (documentUrl, filename = 'document') => {
    try {
      if (!documentUrl) {
        throw new Error('Document URL is required');
      }

      const response = await fetch(documentUrl);
      if (!response.ok) {
        throw new Error(`Failed to download document: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // Download application document by application ID and document type
  downloadApplicationDocument: async (applicationId, documentType) => {
    try {
      const url = `${API_BASE_URL}/agent-applications/${applicationId}/documents/${documentType}/download`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream, image/*, application/pdf'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to download document: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();

      // Get filename from Content-Disposition header or use default
      let filename = `${applicationId}_${documentType}`;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      } else {
        // Determine extension from content type
        const contentType = response.headers.get('Content-Type');
        let extension = 'jpg';
        if (contentType) {
          if (contentType.includes('pdf')) extension = 'pdf';
          else if (contentType.includes('png')) extension = 'png';
          else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpg';
          else if (contentType.includes('gif')) extension = 'gif';
          else if (contentType.includes('webp')) extension = 'webp';
        }
        filename += `.${extension}`;
      }

      const url2 = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url2;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url2);

      return { success: true };
    } catch (error) {
      console.error(`Error downloading ${documentType} for application ${applicationId}:`, error);
      throw error;
    }
  },

  // Get document as base64 (alternative method)
  getDocumentBase64: async (applicationId, documentType) => {
    try {
      const url = `${API_BASE_URL}/agent-applications/${applicationId}/documents/${documentType}/base64`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get document base64: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error getting ${documentType} base64 for application ${applicationId}:`, error);
      throw error;
    }
  },

  // Download all documents for an application as a ZIP
  downloadAllDocuments: async (applicationId) => {
    try {
      const url = `${API_BASE_URL}/agent-applications/${applicationId}/documents/download-all`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/zip'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to download all documents: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();

      // Get filename from Content-Disposition header or use default
      let filename = `application_${applicationId}_documents.zip`;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const url2 = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url2;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url2);

      return { success: true };
    } catch (error) {
      console.error(`Error downloading all documents for application ${applicationId}:`, error);
      throw error;
    }
  },

  // Check if document exists and is accessible
  checkDocumentExists: async (applicationId, documentType) => {
    try {
      const url = `${API_BASE_URL}/agent-applications/${applicationId}/documents/${documentType}/exists`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to check document: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error checking ${documentType} for application ${applicationId}:`, error);
      throw error;
    }
  },

  // Get document information without downloading
  getDocumentInfo: async (applicationId, documentType) => {
    try {
      const url = `${API_BASE_URL}/agent-applications/${applicationId}/documents/${documentType}/info`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get document info: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error getting ${documentType} info for application ${applicationId}:`, error);
      throw error;
    }
  }
};

// Add this helper object as well
export const documentHelpers = {
  getDocumentTypeDisplayName: (documentType) => {
    const displayNames = {
      'idFront': 'ID Front',
      'idBack': 'ID Back',
      'vehicleRc': 'Vehicle RC',
      'profileImage': 'Profile Image'
    };
    return displayNames[documentType] || documentType;
  },

  generateFilename: (applicationId, documentType, extension = 'jpg') => {
    const typeMap = {
      'idFront': 'id_front',
      'idBack': 'id_back',
      'vehicleRc': 'vehicle_rc',
      'profileImage': 'profile_image'
    };
    const mappedType = typeMap[documentType] || documentType;
    return `app_${applicationId}_${mappedType}.${extension}`;
  },

  getFileExtension: (contentType) => {
    const typeMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/pdf': 'pdf'
    };
    return typeMap[contentType] || 'jpg';
  }
};

export default apiClient;