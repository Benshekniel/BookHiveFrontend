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

// Book API Service
export const bookApi = {
  // GET /api/books
  getAllBooks: () => apiClient.get('/books'),

  // GET /api/books/{bookId} (not implemented in backend yet, assuming by ID)
  getBookById: (bookId) => apiClient.get(`/books/${bookId}`),

  // POST /api/books
  createBook: (bookData) => apiClient.post('/books', bookData),

  // PUT /api/books/{id}
  updateBook: (bookId, bookData) => apiClient.put(`/books/${bookId}`, bookData),

  // DELETE /api/books/{id}
  deleteBook: (bookId) => apiClient.delete(`/books/${bookId}`),
};

export default apiClient;