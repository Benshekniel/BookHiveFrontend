// src/services/moderatorService.js - Complete moderator service with all Hub, Agent, and Delivery APIs
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

const clearCache = (pattern = null) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}: ${errorText}`);
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

// Hub API Service
export const hubApi = {
  // Get all hubs
  getAllHubs: async (useCache = true) => {
    const cacheKey = 'all_hubs';
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const hubs = await apiClient.get('/hubs');
      setCache(cacheKey, hubs);
      return hubs;
    } catch (error) {
      console.error('Failed to fetch hubs:', error);
      return [];
    }
  },

  // Get hub by ID
  getHubById: async (hubId, useCache = true) => {
    const cacheKey = `hub_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const hub = await apiClient.get(`/hubs/${hubId}`);
      setCache(cacheKey, hub);
      return hub;
    } catch (error) {
      console.error(`Failed to fetch hub ${hubId}:`, error);
      throw error;
    }
  },

  // Get hubs by city
  getHubsByCity: async (city, useCache = true) => {
    const cacheKey = `hubs_city_${city}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const hubs = await apiClient.get(`/hubs/city/${city}`);
      setCache(cacheKey, hubs);
      return hubs;
    } catch (error) {
      console.error(`Failed to fetch hubs for city ${city}:`, error);
      return [];
    }
  },

  // Get hub statistics
  getHubStats: async (useCache = true) => {
    const cacheKey = 'hub_stats';
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const stats = await apiClient.get('/hubs/stats');
      setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch hub stats:', error);
      return [];
    }
  },

  // Get hub performance
  getHubPerformance: async (hubId, useCache = true) => {
    const cacheKey = `hub_performance_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const performance = await apiClient.get(`/hubs/${hubId}/performance`);
      setCache(cacheKey, performance);
      return performance;
    } catch (error) {
      console.error(`Failed to fetch hub performance for ${hubId}:`, error);
      throw error;
    }
  },

  // Get hub agents
  getHubAgents: async (hubId, useCache = true) => {
    const cacheKey = `hub_agents_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agents = await apiClient.get(`/hubs/${hubId}/agents`);
      setCache(cacheKey, agents);
      return agents;
    } catch (error) {
      console.error(`Failed to fetch agents for hub ${hubId}:`, error);
      return [];
    }
  },

  // Get hub deliveries
  getHubDeliveries: async (hubId, useCache = true) => {
    const cacheKey = `hub_deliveries_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const deliveries = await apiClient.get(`/hubs/${hubId}/deliveries`);
      setCache(cacheKey, deliveries);
      return deliveries;
    } catch (error) {
      console.error(`Failed to fetch deliveries for hub ${hubId}:`, error);
      return [];
    }
  },

  // Create hub
  createHub: async (hubData) => {
    try {
      const newHub = await apiClient.post('/hubs', hubData);
      clearCache('hub'); // Clear hub-related cache
      return newHub;
    } catch (error) {
      console.error('Failed to create hub:', error);
      throw error;
    }
  },

  // Update hub
  updateHub: async (hubId, updateData) => {
    try {
      const updatedHub = await apiClient.put(`/hubs/${hubId}`, updateData);
      clearCache('hub'); // Clear hub-related cache
      return updatedHub;
    } catch (error) {
      console.error(`Failed to update hub ${hubId}:`, error);
      throw error;
    }
  },

  // Assign manager to hub
  assignManager: async (hubId, userId) => {
    try {
      const hubManager = await apiClient.post(`/hubs/${hubId}/assign-manager`, { userId });
      clearCache(`hub_${hubId}`); // Clear specific hub cache
      return hubManager;
    } catch (error) {
      console.error(`Failed to assign manager to hub ${hubId}:`, error);
      throw error;
    }
  },

  // Delete hub
  deleteHub: async (hubId) => {
    try {
      await apiClient.delete(`/hubs/${hubId}`);
      clearCache('hub'); // Clear hub-related cache
      return true;
    } catch (error) {
      console.error(`Failed to delete hub ${hubId}:`, error);
      throw error;
    }
  }
};

// Agent API Service
export const agentApi = {
  // Get all agents
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

  // Get agent by ID
  getAgentById: async (agentId, useCache = true) => {
    const cacheKey = `agent_${agentId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agent = await apiClient.get(`/agents/${agentId}`);
      setCache(cacheKey, agent);
      return agent;
    } catch (error) {
      console.error(`Failed to fetch agent ${agentId}:`, error);
      throw error;
    }
  },

  // Get agent by user ID
  getAgentByUserId: async (userId, useCache = true) => {
    const cacheKey = `agent_user_${userId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agent = await apiClient.get(`/agents/user/${userId}`);
      setCache(cacheKey, agent);
      return agent;
    } catch (error) {
      console.error(`Failed to fetch agent by user ID ${userId}:`, error);
      throw error;
    }
  },

  // Get agents by hub
  getAgentsByHub: async (hubId, useCache = true) => {
    const cacheKey = `agents_hub_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agents = await apiClient.get(`/agents/hub/${hubId}`);
      setCache(cacheKey, agents);
      return agents;
    } catch (error) {
      console.error(`Failed to fetch agents for hub ${hubId}:`, error);
      return [];
    }
  },

  // Get available agents
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

  // Get available agents by hub
  getAvailableAgentsByHub: async (hubId, useCache = true) => {
    const cacheKey = `available_agents_hub_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const agents = await apiClient.get(`/agents/available/hub/${hubId}`);
      setCache(cacheKey, agents);
      return agents;
    } catch (error) {
      console.error(`Failed to fetch available agents for hub ${hubId}:`, error);
      return [];
    }
  },

  // Get agent performance by hub
  getAgentPerformanceByHub: async (hubId, useCache = true) => {
    const cacheKey = `agent_performance_hub_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const performance = await apiClient.get(`/agents/performance/hub/${hubId}`);
      setCache(cacheKey, performance);
      return performance;
    } catch (error) {
      console.error(`Failed to fetch agent performance for hub ${hubId}:`, error);
      return [];
    }
  },

  // Create agent
  createAgent: async (agentData) => {
    try {
      const newAgent = await apiClient.post('/agents', agentData);
      clearCache('agent'); // Clear agent-related cache
      return newAgent;
    } catch (error) {
      console.error('Failed to create agent:', error);
      throw error;
    }
  },

  // Update agent status
  updateAgentStatus: async (agentId, status) => {
    try {
      const updatedAgent = await apiClient.put(`/agents/${agentId}/status`, { status });
      clearCache('agent'); // Clear agent-related cache
      return updatedAgent;
    } catch (error) {
      console.error(`Failed to update agent ${agentId} status:`, error);
      throw error;
    }
  }
};

// Delivery API Service
export const deliveryApi = {
  // Get all deliveries
  getAllDeliveries: async (useCache = true) => {
    const cacheKey = 'all_deliveries';
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const deliveries = await apiClient.get('/deliveries');
      setCache(cacheKey, deliveries);
      return deliveries;
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      return [];
    }
  },

  // Get delivery by ID
  getDeliveryById: async (deliveryId, useCache = true) => {
    const cacheKey = `delivery_${deliveryId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const delivery = await apiClient.get(`/deliveries/${deliveryId}`);
      setCache(cacheKey, delivery);
      return delivery;
    } catch (error) {
      console.error(`Failed to fetch delivery ${deliveryId}:`, error);
      throw error;
    }
  },

  // Get delivery by tracking number
  getDeliveryByTrackingNumber: async (trackingNumber, useCache = true) => {
    const cacheKey = `delivery_tracking_${trackingNumber}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const delivery = await apiClient.get(`/deliveries/tracking/${trackingNumber}`);
      setCache(cacheKey, delivery);
      return delivery;
    } catch (error) {
      console.error(`Failed to fetch delivery by tracking ${trackingNumber}:`, error);
      throw error;
    }
  },

  // Get deliveries by hub
  getDeliveriesByHub: async (hubId, useCache = true) => {
    const cacheKey = `deliveries_hub_${hubId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const deliveries = await apiClient.get(`/deliveries/hub/${hubId}`);
      setCache(cacheKey, deliveries);
      return deliveries;
    } catch (error) {
      console.error(`Failed to fetch deliveries for hub ${hubId}:`, error);
      return [];
    }
  },

  // Get deliveries by agent
  getDeliveriesByAgent: async (agentId, useCache = true) => {
    const cacheKey = `deliveries_agent_${agentId}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const deliveries = await apiClient.get(`/deliveries/agent/${agentId}`);
      setCache(cacheKey, deliveries);
      return deliveries;
    } catch (error) {
      console.error(`Failed to fetch deliveries for agent ${agentId}:`, error);
      return [];
    }
  },

  // Get deliveries by status
  getDeliveriesByStatus: async (status, useCache = true) => {
    const cacheKey = `deliveries_status_${status}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const deliveries = await apiClient.get(`/deliveries/status/${status}`);
      setCache(cacheKey, deliveries);
      return deliveries;
    } catch (error) {
      console.error(`Failed to fetch deliveries by status ${status}:`, error);
      return [];
    }
  },

  // Get today's deliveries
  getTodaysDeliveries: async (useCache = true) => {
    const cacheKey = 'todays_deliveries';
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const deliveries = await apiClient.get('/deliveries/today');
      setCache(cacheKey, deliveries);
      return deliveries;
    } catch (error) {
      console.error('Failed to fetch today\'s deliveries:', error);
      return [];
    }
  },

  // Get delivery statistics
  getDeliveryStats: async (useCache = true) => {
    const cacheKey = 'delivery_stats';
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const stats = await apiClient.get('/deliveries/stats');
      setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch delivery stats:', error);
      return [];
    }
  },

  // Get delivery summary
  getDeliverySummary: async (useCache = true) => {
    const cacheKey = 'delivery_summary';
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const summary = await apiClient.get('/deliveries/summary');
      setCache(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Failed to fetch delivery summary:', error);
      return {};
    }
  },

  // Get batch delivery data by hubs
  getBatchDeliveryDataByHubs: async (hubIds, useCache = true) => {
    const cacheKey = `batch_deliveries_${hubIds.join('_')}`;
    
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }

    try {
      const batchData = await apiClient.get('/deliveries/batch-by-hubs', { hubIds });
      setCache(cacheKey, batchData);
      return batchData;
    } catch (error) {
      console.error('Failed to fetch batch delivery data:', error);
      return {};
    }
  },

  // Create delivery
  createDelivery: async (deliveryData) => {
    try {
      const newDelivery = await apiClient.post('/deliveries', deliveryData);
      clearCache('delivery'); // Clear delivery-related cache
      return newDelivery;
    } catch (error) {
      console.error('Failed to create delivery:', error);
      throw error;
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (deliveryId, status) => {
    try {
      const updatedDelivery = await apiClient.put(`/deliveries/${deliveryId}/status`, { status });
      clearCache('delivery'); // Clear delivery-related cache
      return updatedDelivery;
    } catch (error) {
      console.error(`Failed to update delivery ${deliveryId} status:`, error);
      throw error;
    }
  },

  // Assign agent to delivery
  assignAgent: async (deliveryId, agentId) => {
    try {
      const updatedDelivery = await apiClient.put(`/deliveries/${deliveryId}/assign-agent`, { agentId });
      clearCache('delivery'); // Clear delivery-related cache
      clearCache('agent'); // Clear agent-related cache
      return updatedDelivery;
    } catch (error) {
      console.error(`Failed to assign agent to delivery ${deliveryId}:`, error);
      throw error;
    }
  },

  // Delete delivery
  deleteDelivery: async (deliveryId) => {
    try {
      await apiClient.delete(`/deliveries/${deliveryId}`);
      clearCache('delivery'); // Clear delivery-related cache
      return true;
    } catch (error) {
      console.error(`Failed to delete delivery ${deliveryId}:`, error);
      throw error;
    }
  }
};

// Moderator API Service - All endpoints from ModeratorController
export const moderatorApi = {
  // User Statistics
  countActiveUsers: async (useCache = true) => {
    const cacheKey = 'active_user_count';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/countActiveUsers');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to count active users:', error);
      throw error;
    }
  },

  countFlaggedUsers: async (useCache = true) => {
    const cacheKey = 'flagged_user_count';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/countFlaggedUsers');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to count flagged users:', error);
      throw error;
    }
  },

  // User Management
  getPendingRegistrations: async (useCache = false) => {
    const cacheKey = 'pending_registrations';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getPendingRegistrations');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch pending registrations:', error);
      return [];
    }
  },

  getFlaggedUsers: async (useCache = false) => {
    const cacheKey = 'flagged_users';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getFlaggedUsers');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch flagged users:', error);
      return [];
    }
  },

  getActiveUsers: async (useCache = false) => {
    const cacheKey = 'active_users';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getActiveUsers');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch active users:', error);
      return [];
    }
  },

  // Violation Management
  applyViolation: async (email, reason, status) => {
    try {
      const response = await apiClient.post('/moderator/applyViolation', null, {
        params: { email, reason, status }
      });
      clearCache('user');
      return response;
    } catch (error) {
      console.error('Failed to apply violation:', error);
      throw error;
    }
  },

  getViolationReason: async (email) => {
    try {
      const data = await apiClient.get('/moderator/getViolationReason', { email });
      return data;
    } catch (error) {
      console.error('Failed to get violation reason:', error);
      throw error;
    }
  },

  removeViolation: async (email) => {
    try {
      const response = await apiClient.delete(`/moderator/removeViolation?email=${email}`);
      clearCache('user');
      return response;
    } catch (error) {
      console.error('Failed to remove violation:', error);
      throw error;
    }
  },

  // User Approval/Rejection
  approveUser: async (email, name) => {
    try {
      const data = await apiClient.get('/moderator/approveUser', { email, name });
      clearCache('pending');
      clearCache('user');
      return data;
    } catch (error) {
      console.error('Failed to approve user:', error);
      throw error;
    }
  },

  rejectUser: async (email, name, reason) => {
    try {
      const data = await apiClient.get('/moderator/rejectUser', { email, name, reason });
      clearCache('pending');
      return data;
    } catch (error) {
      console.error('Failed to reject user:', error);
      throw error;
    }
  },

  // Competition Management
  createCompetition: async (competitionData, email, bannerImageFile) => {
    try {
      const formData = new FormData();
      formData.append('competitionData', new Blob([JSON.stringify(competitionData)], { type: 'application/json' }));
      formData.append('email', email);
      formData.append('bannerImage', bannerImageFile);

      const response = await fetch(`${API_BASE_URL}/moderator/createCompetition`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      clearCache('competition');
      return data;
    } catch (error) {
      console.error('Failed to create competition:', error);
      throw error;
    }
  },

  getAllCompetitions: async (useCache = false) => {
    const cacheKey = 'all_competitions';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getAllCompetitions');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch competitions:', error);
      return [];
    }
  },

  goLiveCompetition: async (competitionId, email) => {
    try {
      const data = await apiClient.get('/moderator/goLiveCompetition', { competitionId, email });
      clearCache('competition');
      return data;
    } catch (error) {
      console.error('Failed to make competition live:', error);
      throw error;
    }
  },

  reLiveCompetition: async (competitionId, email) => {
    try {
      const data = await apiClient.get('/moderator/reLiveCompetition', { competitionId, email });
      clearCache('competition');
      return data;
    } catch (error) {
      console.error('Failed to re-live competition:', error);
      throw error;
    }
  },

  stopLiveCompetition: async (competitionId, email) => {
    try {
      const data = await apiClient.get('/moderator/stopLiveCompetition', { competitionId, email });
      clearCache('competition');
      return data;
    } catch (error) {
      console.error('Failed to stop competition:', error);
      throw error;
    }
  },

  pauseCompetition: async (competitionId, email) => {
    try {
      const data = await apiClient.get('/moderator/pauseCompetition', { competitionId, email });
      clearCache('competition');
      return data;
    } catch (error) {
      console.error('Failed to pause competition:', error);
      throw error;
    }
  },

  resumeCompetition: async (competitionId, email) => {
    try {
      const data = await apiClient.get('/moderator/resumeCompetition', { competitionId, email });
      clearCache('competition');
      return data;
    } catch (error) {
      console.error('Failed to resume competition:', error);
      throw error;
    }
  },

  // Donation Management
  getPendingDonations: async (useCache = false) => {
    const cacheKey = 'pending_donations';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getPendingDonations');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch pending donations:', error);
      return [];
    }
  },

  approveDonation: async (donationId) => {
    try {
      const response = await apiClient.put(`/moderator/approveDonation/${donationId}`);
      clearCache('donation');
      return response;
    } catch (error) {
      console.error(`Failed to approve donation ${donationId}:`, error);
      throw error;
    }
  },

  rejectDonation: async (donationId, reason) => {
    try {
      const response = await apiClient.put(`/moderator/rejectDonation/${donationId}?reason=${encodeURIComponent(reason)}`);
      clearCache('donation');
      return response;
    } catch (error) {
      console.error(`Failed to reject donation ${donationId}:`, error);
      throw error;
    }
  },

  getApprovedDonations: async (useCache = false) => {
    const cacheKey = 'approved_donations';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getApprovedDonations');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch approved donations:', error);
      return [];
    }
  },

  getRejectedDonations: async (useCache = false) => {
    const cacheKey = 'rejected_donations';
    if (useCache && isValidCache(cacheKey)) {
      return getCache(cacheKey);
    }
    try {
      const data = await apiClient.get('/moderator/getRejectedDonations');
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch rejected donations:', error);
      return [];
    }
  }
};

// Donation API - Separate export for convenience
export const donationApi = {
  getPendingDonations: moderatorApi.getPendingDonations,
  approveDonation: moderatorApi.approveDonation,
  rejectDonation: moderatorApi.rejectDonation,
  getApprovedDonations: moderatorApi.getApprovedDonations,
  getRejectedDonations: moderatorApi.getRejectedDonations
};

// Combined service for easy import
export const moderatorService = {
  hubs: hubApi,
  agents: agentApi,
  deliveries: deliveryApi,
  moderator: moderatorApi,
  donations: donationApi,
  
  // Utility functions
  clearAllCache: () => clearCache(),
  clearCacheByPattern: (pattern) => clearCache(pattern),
  
  // Combined operations
  getDashboardData: async () => {
    try {
      const [hubs, agents, deliveries, hubStats, deliveryStats] = await Promise.all([
        hubApi.getAllHubs(),
        agentApi.getAllAgents(),
        deliveryApi.getAllDeliveries(),
        hubApi.getHubStats(),
        deliveryApi.getDeliveryStats()
      ]);

      return {
        hubs,
        agents,
        deliveries,
        hubStats,
        deliveryStats
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  },

  getHubOverview: async (hubId) => {
    try {
      const [hub, agents, deliveries, performance] = await Promise.all([
        hubApi.getHubById(hubId),
        hubApi.getHubAgents(hubId),
        hubApi.getHubDeliveries(hubId),
        hubApi.getHubPerformance(hubId)
      ]);

      return {
        hub,
        agents,
        deliveries,
        performance
      };
    } catch (error) {
      console.error(`Failed to fetch hub overview for ${hubId}:`, error);
      throw error;
    }
  }
};

export default moderatorService;