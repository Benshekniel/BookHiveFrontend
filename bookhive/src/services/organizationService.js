// Organization Service for API calls
const API_BASE_URL = 'http://localhost:9090/api';

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
}

const apiClient = new ApiClient();

export const organizationService = {
	// Fetch organization profile by ID
	getProfile: (orgId) => apiClient.get(`/organization/${orgId}`),

	// Update organization profile
	updateProfile: (orgId, profileData) => apiClient.put(`/organization/${orgId}`, profileData),

	// (Optional) Create new organization
	createOrganization: (profileData) => apiClient.post('/organization', profileData),
};
