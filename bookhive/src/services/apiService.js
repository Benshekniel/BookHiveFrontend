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

export default apiClient;