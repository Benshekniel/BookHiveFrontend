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
  getAllBooks: () => apiClient.get('/getBooks'),

  // GET /api/books/{bookId} (not implemented in backend yet, assuming by ID)
  getBookById: (bookId) => apiClient.get(`/books/${bookId}`),

  // POST /api/books
  createBook: (bookData) => apiClient.post('/books', bookData),

  // PUT /api/books/{id}
  updateBook: (bookId, bookData) => apiClient.put(`/books/${bookId}`, bookData),

  // DELETE /api/books/{id}
  deleteBook: (bookId) => apiClient.delete(`/books/${bookId}`),
};

// Exchange API Service
export const exchangeApi = {
  // POST /api/createExchange
  createExchange: (exchangeData) => apiClient.post('/createExchange', exchangeData),

  // GET /api/exchangeGetBooks/{email}
  getBooksByEmail: (email) => apiClient.get(`/exchangeGetBooks/${email}`),

  // GET /api/exchangeCheck/{userId}/{bookId}
  checkExchangeExists: (userId, bookId) => apiClient.get(`/exchangeCheck/${userId}/${bookId}`),

  // GET /api/outgoingExchange/{userId}
  getOutgoingExchanges: (userId) => apiClient.get(`/outgoingExchange/${userId}`),

  // GET /api/incomingExchange/{userId}
  getIncomingExchanges: (userId) => apiClient.get(`/incomingExchange/${userId}`),

  // GET /api/getBookExchangeById/{bookId}
  getBookById: (bookId) => apiClient.get(`/getBookExchangeById/${bookId}`),

  // PUT /api/approveExchange/{exchangeId}
  approveExchange: (exchangeId, deliveryFee, handlingFee) =>
    apiClient.put(`/approveExchange/${exchangeId}?deliveryFee=${deliveryFee}&handlingFee=${handlingFee}`),

  // PUT /api/rejectExchange/{exchangeId}
  rejectExchange: (exchangeId, reason) =>
    apiClient.put(`/rejectExchange/${exchangeId}?reason=${encodeURIComponent(reason)}`),
};

export default apiClient;