import { ApiClient } from './ApiClient';

export const dashboardService = {
  async getStats(organizationId) {
    const response = await ApiClient.get(`/organization/${organizationId}/dashboard/stats`);
    return response.data;
  },
  async getRecentRequests(organizationId) {
    const response = await ApiClient.get(`/organization/${organizationId}/dashboard/recent-requests`);
    return response.data;
  },
  async getUpcomingEvents(organizationId) {
    const response = await ApiClient.get(`/organization/${organizationId}/dashboard/upcoming-events`);
    return response.data;
  }
};
