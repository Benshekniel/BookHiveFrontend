const API_BASE_URL = 'http://localhost:9090/api';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return response;
  }
  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: data }); }
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: data }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

const apiClient = new ApiClient();

export const bookRequestService = {
  create: (data) => apiClient.post('/book-requests', data),
  getByOrganization: (orgId) => apiClient.get(`/book-requests/organization/${orgId}`),
  updateStatus: (requestId, data) => apiClient.put(`/book-requests/${requestId}`, data),
  delete: (requestId) => apiClient.delete(`/book-requests/${requestId}`),
};
