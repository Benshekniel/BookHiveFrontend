// src/services/apiService.js
const API_BASE_URL = 'http://localhost:9090/api';

// Generic API client
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
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
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

// Create API client instance
const apiClient = new ApiClient();

// Agent API Service
export const agentApi = {
  // GET /api/agents
  getAllAgents: () => apiClient.get('/agents'),
  
  // GET /api/agents/{agentId}
  getAgentById: (agentId) => apiClient.get(`/agents/${agentId}`),
  
  // GET /api/agents/user/{userId}
  getAgentByUserId: (userId) => apiClient.get(`/agents/user/${userId}`),
  
  // GET /api/agents/hub/{hubId}
  getAgentsByHub: (hubId) => apiClient.get(`/agents/hub/${hubId}`),
  
  // GET /api/agents/available
  getAvailableAgents: () => apiClient.get('/agents/available'),
  
  // GET /api/agents/available/hub/{hubId}
  getAvailableAgentsByHub: (hubId) => apiClient.get(`/agents/available/hub/${hubId}`),
  
  // GET /api/agents/performance/hub/{hubId}
  getAgentPerformanceByHub: (hubId) => apiClient.get(`/agents/performance/hub/${hubId}`),
  
  // POST /api/agents
  createAgent: (agentData) => apiClient.post('/agents', agentData),
  
  // PUT /api/agents/{agentId}/status
  updateAgentStatus: (agentId, status) => 
    apiClient.put(`/agents/${agentId}/status`, { status }),
};

// Delivery API Service
export const deliveryApi = {
  // GET /api/deliveries
  getAllDeliveries: () => apiClient.get('/deliveries'),
  
  // GET /api/deliveries/{deliveryId}
  getDeliveryById: (deliveryId) => apiClient.get(`/deliveries/${deliveryId}`),
  
  // GET /api/deliveries/tracking/{trackingNumber}
  getDeliveryByTrackingNumber: (trackingNumber) => 
    apiClient.get(`/deliveries/tracking/${trackingNumber}`),
  
  // GET /api/deliveries/hub/{hubId}
  getDeliveriesByHub: (hubId) => apiClient.get(`/deliveries/hub/${hubId}`),
  
  // GET /api/deliveries/agent/{agentId}
  getDeliveriesByAgent: (agentId) => apiClient.get(`/deliveries/agent/${agentId}`),
  
  // GET /api/deliveries/status/{status}
  getDeliveriesByStatus: (status) => apiClient.get(`/deliveries/status/${status}`),
  
  // GET /api/deliveries/today
  getTodaysDeliveries: () => apiClient.get('/deliveries/today'),
  
  // GET /api/deliveries/stats
  getDeliveryStats: () => apiClient.get('/deliveries/stats'),
  
  // POST /api/deliveries
  createDelivery: (deliveryData) => apiClient.post('/deliveries', deliveryData),
  
  // PUT /api/deliveries/{deliveryId}/status
  updateDeliveryStatus: (deliveryId, status) => 
    apiClient.put(`/deliveries/${deliveryId}/status`, { status }),
  
  // PUT /api/deliveries/{deliveryId}/assign-agent
  assignAgent: (deliveryId, agentId) => 
    apiClient.put(`/deliveries/${deliveryId}/assign-agent`, { agentId }),
  
  // DELETE /api/deliveries/{deliveryId}
  deleteDelivery: (deliveryId) => apiClient.delete(`/deliveries/${deliveryId}`),
};

// Hub API Service
export const hubApi = {
  // GET /api/hubs
  getAllHubs: () => apiClient.get('/hubs'),
  
  // GET /api/hubs/{hubId}
  getHubById: (hubId) => apiClient.get(`/hubs/${hubId}`),
  
  // GET /api/hubs/city/{city}
  getHubsByCity: (city) => apiClient.get(`/hubs/city/${city}`),
  
  // GET /api/hubs/stats
  getHubStats: () => apiClient.get('/hubs/stats'),
  
  // GET /api/hubs/{hubId}/performance
  getHubPerformance: (hubId) => apiClient.get(`/hubs/${hubId}/performance`),
  
  // GET /api/hubs/{hubId}/agents
  getHubAgents: (hubId) => apiClient.get(`/hubs/${hubId}/agents`),
  
  // GET /api/hubs/{hubId}/deliveries
  getHubDeliveries: (hubId) => apiClient.get(`/hubs/${hubId}/deliveries`),
  
  // POST /api/hubs
  createHub: (hubData) => apiClient.post('/hubs', hubData),
  
  // PUT /api/hubs/{hubId}
  updateHub: (hubId, hubData) => apiClient.put(`/hubs/${hubId}`, hubData),
  
  // POST /api/hubs/{hubId}/assign-manager
  assignManager: (hubId, userId) => 
    apiClient.post(`/hubs/${hubId}/assign-manager`, { userId }),
  
  // DELETE /api/hubs/{hubId}
  deleteHub: (hubId) => apiClient.delete(`/hubs/${hubId}`),
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
      boundaryCoordinates: JSON.stringify(routeData.boundaryCoordinates || [])
    };
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
      boundaryCoordinates: JSON.stringify(routeData.boundaryCoordinates || [])
    };
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
      boundaryCoordinates: JSON.stringify(boundaryCoordinates) 
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

// Helper functions for route management
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
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  },
  
  // Check if a point is within a route's boundary
  isPointInRoute: (point, routeBoundaries) => {
    // This is a simplified point-in-polygon check
    // In a real implementation, you'd use a more robust algorithm
    if (!routeBoundaries || routeBoundaries.length < 3) return false;
    
    let inside = false;
    for (let i = 0, j = routeBoundaries.length - 1; i < routeBoundaries.length; j = i++) {
      if (((routeBoundaries[i].lat > point.lat) !== (routeBoundaries[j].lat > point.lat)) &&
          (point.lng < (routeBoundaries[j].lng - routeBoundaries[i].lng) * 
           (point.lat - routeBoundaries[i].lat) / (routeBoundaries[j].lat - routeBoundaries[i].lat) + routeBoundaries[i].lng)) {
        inside = !inside;
      }
    }
    return inside;
  }
};

// Export default API client
export default apiClient;