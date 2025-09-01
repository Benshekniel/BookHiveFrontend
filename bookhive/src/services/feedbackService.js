const API_BASE_URL = 'http://localhost:9090/api';

class ApiClient {
  constructor(baseURL = API_BASE_URL) { this.baseURL = baseURL; }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options };
    if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) return await response.json();
    return response;
  }
  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: data }); }
}

const apiClient = new ApiClient();

export const feedbackService = {
  create: (data) => apiClient.post('/organization-feedback', data),
  getByOrganization: (orgId) => apiClient.get(`/organization-feedback/organization/${orgId}`),
};
