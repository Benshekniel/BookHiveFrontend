// src/services/userService.js - Complete user service with transaction APIs
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
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
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

// User Transaction API Service
export const userTransactionApi = {
    // Get user transactions with filters
    getUserTransactions: async (userId, filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.type) params.append('type', filters.type);
            if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
            if (filters.fromDate) params.append('fromDate', filters.fromDate);
            if (filters.toDate) params.append('toDate', filters.toDate);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
            if (filters.page !== undefined) params.append('page', filters.page);
            if (filters.size !== undefined) params.append('size', filters.size);

            const url = `/user-transactions/user/${userId}?${params.toString()}`;
            return await apiClient.get(url);
        } catch (error) {
            console.error('Failed to fetch user transactions:', error);
            throw error;
        }
    },

    // Get transaction by ID
    getTransactionById: async (transactionId) => {
        try {
            return await apiClient.get(`/user-transactions/${transactionId}`);
        } catch (error) {
            console.error(`Failed to fetch transaction ${transactionId}:`, error);
            throw error;
        }
    },

    // Get transaction by tracking number
    getTransactionByTrackingNumber: async (trackingNumber) => {
        try {
            return await apiClient.get(`/user-transactions/tracking/${trackingNumber}`);
        } catch (error) {
            console.error(`Failed to fetch transaction with tracking ${trackingNumber}:`, error);
            throw error;
        }
    },

    // Get user transaction stats
    getUserTransactionStats: async (userId) => {
        const cacheKey = `user_stats_${userId}`;

        if (isValidCache(cacheKey)) {
            return getCache(cacheKey);
        }

        try {
            const stats = await apiClient.get(`/user-transactions/user/${userId}/stats`);
            setCache(cacheKey, stats);
            return stats;
        } catch (error) {
            console.error(`Failed to fetch user stats for ${userId}:`, error);
            // Return default stats if API fails
            return {
                totalOrders: 0,
                activeOrders: 0,
                completedOrders: 0,
                overdueOrders: 0,
                cancelledOrders: 0,
                borrowedBooks: 0,
                purchasedBooks: 0,
                exchangedBooks: 0,
                wonAuctions: 0,
                totalSpent: 0,
                totalEarned: 0
            };
        }
    },

    // Create transaction
    createTransaction: async (transactionData) => {
        try {
            const result = await apiClient.post('/user-transactions', transactionData);
            cache.clear(); // Clear cache after mutations
            return result;
        } catch (error) {
            console.error('Failed to create transaction:', error);
            throw error;
        }
    },

    // Update transaction status
    updateTransactionStatus: async (transactionId, statusData) => {
        try {
            const result = await apiClient.put(`/user-transactions/${transactionId}/status`, statusData);
            cache.clear();
            return result;
        } catch (error) {
            console.error(`Failed to update transaction ${transactionId} status:`, error);
            throw error;
        }
    },

    // Cancel transaction
    cancelTransaction: async (transactionId, userId, cancelData) => {
        try {
            const result = await apiClient.put(
                `/user-transactions/${transactionId}/cancel?userId=${userId}`,
                cancelData
            );
            cache.clear();
            return result;
        } catch (error) {
            console.error(`Failed to cancel transaction ${transactionId}:`, error);
            throw error;
        }
    },

    // Get transactions by status
    getTransactionsByStatus: async (userId, status, page = 0, size = 20) => {
        try {
            return await apiClient.get(
                `/user-transactions/user/${userId}/status/${status}?page=${page}&size=${size}`
            );
        } catch (error) {
            console.error(`Failed to fetch ${status} transactions for user ${userId}:`, error);
            throw error;
        }
    },

    // Get transactions by type
    getTransactionsByType: async (userId, type, page = 0, size = 20) => {
        try {
            return await apiClient.get(
                `/user-transactions/user/${userId}/type/${type}?page=${page}&size=${size}`
            );
        } catch (error) {
            console.error(`Failed to fetch ${type} transactions for user ${userId}:`, error);
            throw error;
        }
    },

    // Get overdue transactions
    getOverdueTransactions: async () => {
        try {
            return await apiClient.get('/user-transactions/overdue');
        } catch (error) {
            console.error('Failed to fetch overdue transactions:', error);
            throw error;
        }
    },

    // Update overdue transactions
    updateOverdueTransactions: async () => {
        try {
            return await apiClient.post('/user-transactions/update-overdue');
        } catch (error) {
            console.error('Failed to update overdue transactions:', error);
            throw error;
        }
    }
};

// User Management API
export const userApi = {
    // Get current user
    getCurrentUser: async (userId) => {
        const cacheKey = `current_user_${userId}`;

        if (isValidCache(cacheKey)) {
            return getCache(cacheKey);
        }

        try {
            const user = await apiClient.get(`/users/${userId}`);
            setCache(cacheKey, user);
            return user;
        } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
            // Return mock user if API fails
            return {
                userId: userId,
                name: `User ${userId}`,
                email: `user${userId}@example.com`,
                phone: `+94 77 123 ${String(userId).padStart(4, '0')}`,
                location: 'Colombo'
            };
        }
    },

    // Get user profile
    getUserProfile: async (userId) => {
        try {
            return await apiClient.get(`/users/${userId}/profile`);
        } catch (error) {
            console.error(`Failed to fetch user profile ${userId}:`, error);
            throw error;
        }
    },

    // Update user profile
    updateUserProfile: async (userId, profileData) => {
        try {
            const result = await apiClient.put(`/users/${userId}/profile`, profileData);
            cache.clear();
            return result;
        } catch (error) {
            console.error(`Failed to update user profile ${userId}:`, error);
            throw error;
        }
    }
};

// Enhanced Book API to integrate with existing book system
export const enhancedBookApi = {
    // Get book details from your existing book system
    getBookDetails: async (bookId) => {
        try {
            // FIX: Remove duplicate /api in URL
            const response = await apiClient.get(`/getBooks`);
            const book = response.find(b => b.bookId === bookId);

            if (book) {
                return {
                    bookId: book.bookId,
                    title: book.title,
                    author: book.authors ? book.authors.join(', ') : 'Unknown Author',
                    cover: book.bookImage ?
                        `${API_BASE_URL}/getFileAsBase64?fileName=${book.bookImage}&folderName=userBooks` :
                        null,
                    bookImage: book.bookImage
                };
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch book details for ${bookId}:`, error);
            return null;
        }
    }
};


// Book API Service
export const bookApi = {
    // Get book by ID
    getBookById: async (bookId) => {
        const cacheKey = `book_${bookId}`;

        if (isValidCache(cacheKey)) {
            return getCache(cacheKey);
        }

        try {
            const book = await apiClient.get(`/books/${bookId}`);
            setCache(cacheKey, book);
            return book;
        } catch (error) {
            console.error(`Failed to fetch book ${bookId}:`, error);
            // Return mock book if API fails
            return {
                bookId: bookId,
                title: `Book Title ${bookId}`,
                author: 'Unknown Author',
                cover: `https://via.placeholder.com/400x600/4F46E5/FFFFFF?text=Book+${bookId}`
            };
        }
    },

    // Get multiple books
    getBooksByIds: async (bookIds) => {
        try {
            const books = await Promise.all(
                bookIds.map(id => bookApi.getBookById(id))
            );
            return books;
        } catch (error) {
            console.error('Failed to fetch books:', error);
            throw error;
        }
    }
};

// Review API Service
export const reviewApi = {
    // Submit review
    submitReview: async (reviewData) => {
        try {
            const result = await apiClient.post('/reviews', reviewData);
            cache.clear();
            return result;
        } catch (error) {
            console.error('Failed to submit review:', error);
            throw error;
        }
    },

    // Get reviews for transaction
    getTransactionReviews: async (transactionId) => {
        try {
            return await apiClient.get(`/reviews/transaction/${transactionId}`);
        } catch (error) {
            console.error(`Failed to fetch reviews for transaction ${transactionId}:`, error);
            throw error;
        }
    }
};

// Utility functions
export const userServiceHelpers = {
    // Transform API response to frontend format
    transformTransactionResponse: (apiTransaction) => {
        // Create default book object to prevent undefined errors
        const defaultBook = {
            id: apiTransaction.bookId || 0,
            title: apiTransaction.bookTitle || `Book ${apiTransaction.bookId || 'Unknown'}`,
            author: apiTransaction.bookAuthor || 'Unknown Author',
            cover: generateFallbackBookImage(apiTransaction.bookId || 0),
            bookImage: null
        };

        return {
            id: apiTransaction.orderId || `ORD${apiTransaction.transactionId}`,
            transactionId: apiTransaction.transactionId,
            type: apiTransaction.type,
            book: defaultBook, // Always provide a book object
            seller: apiTransaction.seller,
            lender: apiTransaction.lender,
            exchanger: apiTransaction.exchanger,
            borrower: apiTransaction.borrower,
            orderDate: apiTransaction.orderDate || apiTransaction.createdAt,
            status: apiTransaction.status,
            totalAmount: apiTransaction.totalAmount || apiTransaction.paymentAmount,
            deliveryMethod: apiTransaction.deliveryMethod?.toLowerCase() || 'delivery',
            deliveryAddress: apiTransaction.deliveryAddress,
            estimatedDelivery: apiTransaction.estimatedDelivery,
            actualDelivery: apiTransaction.actualDelivery,
            trackingNumber: apiTransaction.trackingNumber,
            paymentMethod: apiTransaction.paymentMethod,
            paymentStatus: apiTransaction.paymentStatus,
            borrowPeriod: apiTransaction.borrowPeriod,
            startDate: apiTransaction.startDate,
            returnDate: apiTransaction.endDate,
            securityDeposit: apiTransaction.securityDeposit,
            overdueBy: apiTransaction.overdueDays,
            exchangePeriod: apiTransaction.exchangePeriod,
            winningBid: apiTransaction.winningBid,
            deliveryAmount: apiTransaction.deliveryAmount,
            auctionEndDate: apiTransaction.auctionEndDate,
            cancelReason: apiTransaction.cancelReason,
            cancelDate: apiTransaction.cancelDate,
            refundAmount: apiTransaction.refundAmount,
            deductionAmount: apiTransaction.deductionAmount,
            tracking: apiTransaction.tracking || []
        };

        function generateFallbackBookImage(bookId) {
            const title = `Book ${bookId}`;
            return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="150" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="200" fill="#4F46E5"/>
            <text x="75" y="100" text-anchor="middle" fill="#FFFFFF" font-size="12">${title}</text>
            </svg>
        `)}`;
        }
    },



    // Get status color for UI
    getStatusColor: (status) => {
        switch (status) {
            case "delivered":
            case "completed":
                return "text-green-800 bg-green-100";
            case "active":
                return "text-blue-800 bg-blue-100";
            case "in_transit":
            case "pending":
                return "text-yellow-800 bg-yellow-100";
            case "overdue":
                return "text-red-800 bg-red-100";
            case "cancelled":
                return "text-gray-500 bg-gray-200";
            default:
                return "text-gray-500 bg-gray-200";
        }
    },

    // Format currency
    formatCurrency: (amount) => {
        if (!amount && amount !== 0) return 'Rs. 0';
        return `Rs. ${parseFloat(amount).toLocaleString()}`;
    },

    // Format date
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Calculate refund with deductions
    calculateRefund: (transaction) => {
        if (!transaction.totalAmount) return { refundAmount: 0, deductionAmount: 0, deductionReasons: [] };

        let baseAmount = transaction.totalAmount;
        let deductionAmount = 0;
        let deductionReasons = [];

        // Time-based deductions
        const orderDate = new Date(transaction.orderDate);
        const currentDate = new Date();
        const hoursDiff = Math.abs(currentDate - orderDate) / 36e5;

        if (hoursDiff > 24) {
            const processingFee = Math.round(baseAmount * 0.1);
            deductionAmount += processingFee;
            deductionReasons.push(`Processing fee (10%): Rs. ${processingFee}`);
        }

        // Status-based deductions
        if (transaction.status === "active" || transaction.status === "in_transit") {
            const shippingFee = 150;
            deductionAmount += shippingFee;
            deductionReasons.push(`Shipping charges: Rs. ${shippingFee}`);
        }

        // Type-specific deductions
        if (transaction.type === "bidding") {
            const auctionFee = Math.round(baseAmount * 0.05);
            deductionAmount += auctionFee;
            deductionReasons.push(`Auction processing fee (5%): Rs. ${auctionFee}`);
        }

        const refundAmount = Math.max(0, baseAmount - deductionAmount);

        return { refundAmount, deductionAmount, deductionReasons };
    },

    // Check if order can be cancelled
    canCancelOrder: (transaction) => {
        const cancellableStatuses = ["pending", "active", "in_transit"];
        return cancellableStatuses.includes(transaction.status);
    },

    // Get cancellation reasons based on order type
    getCancellationReasons: (orderType) => {
        const commonReasons = [
            "Changed my mind",
            "Found a better deal",
            "No longer needed",
            "Delivery taking too long",
            "Payment issues",
            "Other"
        ];

        const specificReasons = {
            purchase: [...commonReasons, "Book condition concerns", "Seller unavailable"],
            borrow: [...commonReasons, "Shorter borrowing period needed", "Changed reading plans"],
            exchange: [...commonReasons, "Changed my book preference", "Exchange terms not suitable"],
            bidding: [...commonReasons, "Bid amount too high", "Found alternative book"]
        };

        return specificReasons[orderType] || commonReasons;
    }
};

// Cache utilities
export const cacheUtils = {
    clearAll: () => {
        cache.clear();
        console.log('All cache cleared');
    },

    clearPattern: (pattern) => {
        for (const key of cache.keys()) {
            if (key.includes(pattern)) {
                cache.delete(key);
            }
        }
    },

    getCacheStats: () => {
        return {
            size: cache.size,
            keys: Array.from(cache.keys())
        };
    }
};

export default {
    userTransactionApi,
    userApi,
    bookApi,
    reviewApi,
    userServiceHelpers,
    cacheUtils
};