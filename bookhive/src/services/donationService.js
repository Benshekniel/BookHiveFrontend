import { ApiClient } from './ApiClient';

export const donationService = {
  async getByOrganization(organizationId) {
    const response = await ApiClient.get(`/organization/${organizationId}/donations`);
    return response.data;
  },
  async markAsReceived(donationId) {
    const response = await ApiClient.post(`/donations/${donationId}/mark-received`);
    return response.data;
  }
  // Add more methods as needed
};
