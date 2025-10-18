import { ApiClient } from './ApiClient';

export const dashboardService = {
  async getStats(organizationId) {
    const response = await ApiClient.get(`/organization-dashboard/stats/${organizationId}`);
    return response.data;
  },
  async getRecentRequests(organizationId) {
    const response = await ApiClient.get(`/organization-dashboard/recent-requests/${organizationId}`);
    return response.data;
  },
  async getUpcomingEvents(organizationId) {
    const response = await ApiClient.get(`/organization-dashboard/upcoming-events/${organizationId}`);
    return response.data;
  }
};
