import { ApiClient } from './ApiClient';

export const notificationService = {
  async getByOrganization(organizationId) {
    const response = await ApiClient.get(`/organization/${organizationId}/notifications`);
    return response.data;
  },
  async markAsRead(notificationId) {
    const response = await ApiClient.post(`/notifications/${notificationId}/mark-read`);
    return response.data;
  },
  async delete(notificationId) {
    const response = await ApiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
  async markAllAsRead(organizationId) {
    const response = await ApiClient.post(`/organization/${organizationId}/notifications/mark-all-read`);
    return response.data;
  }
};
