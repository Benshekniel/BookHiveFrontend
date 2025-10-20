// src/services/userService.js - Updated to match working UserReview pattern
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';
const FILE_API_BASE_URL = 'http://localhost:9090'; // Matches working UserReview component

// Simple cache for performance
const cache = new Map();
const imageCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes
const IMAGE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes for images

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

const isValidImageCache = (key) => {
    const cached = imageCache.get(key);
    return cached && (Date.now() - cached.timestamp) < IMAGE_CACHE_TTL;
};

const setImageCache = (key, data) => {
    imageCache.set(key, {
        data,
        timestamp: Date.now()
    });
};

const getImageCache = (key) => {
    const cached = imageCache.get(key);
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

// Image Service - Updated to exactly match working UserReview pattern
export const imageService = {
    // Get single book image - Following UserReview pattern exactly
    getBookImage: async (fileName, folderName = 'userBooks') => {
        const cacheKey = `image_${fileName}_${folderName}`;

        // Check cache first
        if (isValidImageCache(cacheKey)) {
            console.log(`Image cache hit for: ${fileName}`);
            return getImageCache(cacheKey);
        }

        if (!fileName) {
            console.log('No fileName provided');
            return {
                status: 'missing',
                url: null,
                error: null
            };
        }

        try {
            console.log(`Fetching base64 for ${fileName}: fileName=${fileName}, folderName=${folderName}`);

            // Use exact same pattern as working UserReview component
            const response = await axios.get(`${FILE_API_BASE_URL}/getFileAsBase64`, {
                params: { fileName, folderName },
            });

            console.log(`Response for ${fileName}:`, response.data.substring(0, 50) + '...');

            const imageData = {
                status: 'loaded',
                url: response.data, // Use response.data directly like UserReview
                error: null
            };

            // Cache the result
            setImageCache(cacheKey, imageData);
            return imageData;

        } catch (error) {
            console.error(`Error fetching base64 for ${fileName}:`, error.response?.data || error.message);

            const errorData = {
                status: 'not_found',
                url: null,
                error: error.response?.data || error.message
            };

            // Cache the error too to avoid repeated requests
            setImageCache(cacheKey, errorData);
            return errorData;
        }
    },

    // Load multiple book images using the working pattern
    loadBookImages: async (books, onImageUpdate) => {
        console.log(`Loading images for ${books.length} books`);

        // Use the same pattern as UserReview useEffect
        const files = books
            .filter(book => book.bookImage)
            .map(book => ({
                key: `book_${book.bookId || book.id}`,
                fileName: book.bookImage,
                folderName: 'userBooks'
            }));

        // Process each file like UserReview does
        for (const { key, fileName, folderName } of files) {
            if (fileName) {
                console.log(`Fetching base64 for ${key}: fileName=${fileName}, folderName=${folderName}`);
                try {
                    const response = await axios.get(`${FILE_API_BASE_URL}/getFileAsBase64`, {
                        params: { fileName, folderName },
                    });
                    console.log(`Response for ${key}:`, response.data.substring(0, 50) + '...');

                    const imageData = {
                        status: 'loaded',
                        url: response.data, // Direct response like UserReview
                        error: null
                    };

                    if (onImageUpdate) {
                        onImageUpdate(key, imageData);
                    }
                } catch (error) {
                    console.error(`Error fetching base64 for ${key}:`, error.response?.data || error.message);

                    const errorData = {
                        status: 'not_found',
                        url: null,
                        error: error.response?.data || error.message
                    };

                    if (onImageUpdate) {
                        onImageUpdate(key, errorData);
                    }
                }
            } else {
                console.log(`No fileName for ${key}, marking as missing`);

                const missingData = {
                    status: 'missing',
                    url: null,
                    error: null
                };

                if (onImageUpdate) {
                    onImageUpdate(key, missingData);
                }
            }
        }
    },

    // Get file web view link
    getFileWebViewLink: async (fileName, folderName = 'userBooks') => {
        try {
            console.log(`Fetching web view link: fileName=${fileName}, folderName=${folderName}`);

            const response = await axios.get(`${FILE_API_BASE_URL}/getFileWebViewLinkByName`, {
                params: { fileName, folderName },
            });

            console.log(`Web view link response: ${response.data}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching web view link ${fileName}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Generate fallback image
    generateFallbackImage: (text, width = 150, height = 200) => {
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${width}" height="${height}" fill="#4F46E5"/>
                <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#FFFFFF" font-size="12" font-family="Arial, sans-serif">
                    ${text}
                </text>
            </svg>
        `)}`;
    },

    // Clear image cache
    clearImageCache: () => {
        imageCache.clear();
        console.log('Image cache cleared');
    }
};

// Debug function using working pattern
export const debugImageIssue = async (fileName, folderName = 'userBooks') => {
    console.log('=== DEBUG IMAGE ISSUE (Using Working Pattern) ===');
    console.log('fileName:', fileName);
    console.log('folderName:', folderName);
    console.log('FILE_API_BASE_URL:', FILE_API_BASE_URL);

    try {
        const fullUrl = `${FILE_API_BASE_URL}/getFileAsBase64?fileName=${fileName}&folderName=${folderName}`;
        console.log('Trying URL:', fullUrl);

        // Use exact same approach as working UserReview
        const response = await axios.get(`${FILE_API_BASE_URL}/getFileAsBase64`, {
            params: { fileName, folderName },
        });

        console.log('✅ Image fetch successful');
        console.log('Response type:', typeof response.data);
        console.log('Response length:', response.data.length);
        console.log('Response preview:', response.data.substring(0, 50) + '...');

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('❌ Image fetch failed:', error.response?.status, error.response?.data);
        console.error('Error message:', error.message);
        console.error('Full URL that failed:', `${FILE_API_BASE_URL}/getFileAsBase64?fileName=${fileName}&folderName=${folderName}`);

        return {
            success: false,
            error: error.response?.data || error.message
        };
    }

    console.log('=== END DEBUG ===');
};

// User Transaction API Service (unchanged)
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
        const cacheKey = `book_details_${bookId}`;

        if (isValidCache(cacheKey)) {
            return getCache(cacheKey);
        }

        try {
            // Use your existing endpoint
            const response = await apiClient.get(`/getBooks`);
            const book = response.find(b => b.bookId === bookId);

            if (book) {
                let cover = null;

                // Use the filename as stored cover initially (for proper book data structure)
                if (book.bookImage) {
                    cover = book.bookImage; // This will be the filename that images will be loaded for
                } else {
                    cover = null;
                }

                const bookDetails = {
                    bookId: book.bookId,
                    title: book.title,
                    author: book.authors ? book.authors.join(', ') : 'Unknown Author',
                    cover: cover, // This contains the filename for image loading
                    bookImage: book.bookImage,
                    isbn: book.isbn,
                    description: book.description,
                    price: book.price,
                    condition: book.condition,
                    genre: book.genre,
                    publishedYear: book.publishedYear
                };

                setCache(cacheKey, bookDetails);
                return bookDetails;
            }

            return null;
        } catch (error) {
            console.error(`Failed to fetch book details for ${bookId}:`, error);
            return null;
        }
    },

    // Get multiple books by IDs
    getBooksByIds: async (bookIds) => {
        try {
            const books = await Promise.all(
                bookIds.map(id => enhancedBookApi.getBookDetails(id))
            );
            return books.filter(book => book !== null);
        } catch (error) {
            console.error('Failed to fetch multiple books:', error);
            return [];
        }
    },

    // Search books
    searchBooks: async (query, filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (query) params.append('query', query);
            if (filters.genre) params.append('genre', filters.genre);
            if (filters.author) params.append('author', filters.author);
            if (filters.condition) params.append('condition', filters.condition);

            return await apiClient.get(`/books/search?${params.toString()}`);
        } catch (error) {
            console.error('Failed to search books:', error);
            throw error;
        }
    }
};

// Book API Service (Legacy compatibility)
export const bookApi = {
    // Get book by ID
    getBookById: async (bookId) => {
        return await enhancedBookApi.getBookDetails(bookId);
    },

    // Get multiple books
    getBooksByIds: async (bookIds) => {
        return await enhancedBookApi.getBooksByIds(bookIds);
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
    },

    // Get reviews for book
    getBookReviews: async (bookId) => {
        try {
            return await apiClient.get(`/reviews/book/${bookId}`);
        } catch (error) {
            console.error(`Failed to fetch reviews for book ${bookId}:`, error);
            throw error;
        }
    },

    // Get user reviews
    getUserReviews: async (userId) => {
        try {
            return await apiClient.get(`/reviews/user/${userId}`);
        } catch (error) {
            console.error(`Failed to fetch reviews for user ${userId}:`, error);
            throw error;
        }
    },

    // Get user average rating
    getUserAverageRating: async (userId) => {
        try {
            const response = await apiClient.get(`/reviews/user/${userId}/average-rating`);
            return response || 0.0;
        } catch (error) {
            console.error(`Failed to fetch average rating for user ${userId}:`, error);
            return 0.0;
        }
    },

    // Get book average rating
    getBookAverageRating: async (bookId) => {
        try {
            const response = await apiClient.get(`/reviews/book/${bookId}/average-rating`);
            return response || 0.0;
        } catch (error) {
            console.error(`Failed to fetch average rating for book ${bookId}:`, error);
            return 0.0;
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
            cover: null, // Will be populated by image service
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
    },

    // Get status color for UI
    getStatusColor: (status) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "text-green-800 bg-green-100";
            case "order placed":
                return "text-blue-800 bg-blue-100";
            case "picked up":
                return "text-yellow-800 bg-yellow-100";
            case "in transit":
                return "text-purple-800 bg-purple-100";
            case "cancelled":
                return "text-gray-500 bg-gray-200";
            case "failed":
                return "text-red-800 bg-red-100";
            case "delayed":
                return "text-orange-800 bg-orange-100";
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

    // Format date and time
    formatDateTime: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
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
        if (transaction.status === "active" || transaction.status === "in_transit" || transaction.status === "pending") {
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
    },

    // Get transaction type display name
    getTransactionTypeDisplayName: (type) => {
        const typeNames = {
            purchase: "Purchase",
            borrow: "Borrow",
            exchange: "Exchange",
            bidding: "Auction"
        };
        return typeNames[type] || type;
    },

    // Get status display name
    getStatusDisplayName: (status) => {
        const statusNames = {
            pending: "Pending",
            active: "Active",
            in_transit: "In Transit",
            delivered: "Delivered",
            completed: "Completed",
            overdue: "Overdue",
            cancelled: "Cancelled"
        };
        return statusNames[status] || status;
    },

    // Check if review can be submitted
    canSubmitReview: (transaction) => {
        return transaction.status === "delivered" || transaction.status === "completed";
    },

    // Get days until due date
    getDaysUntilDue: (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    // Check if transaction is overdue
    isOverdue: (transaction) => {
        if (transaction.returnDate && (transaction.type === "borrow" || transaction.type === "exchange")) {
            const today = new Date();
            const returnDate = new Date(transaction.returnDate);
            return today > returnDate && (transaction.status !== "completed" && transaction.status !== "delivered");
        }
        return false;
    },

    // Get priority level based on transaction
    getPriorityLevel: (transaction) => {
        if (userServiceHelpers.isOverdue(transaction)) return "high";

        const daysUntilDue = userServiceHelpers.getDaysUntilDue(transaction.returnDate);
        if (daysUntilDue !== null && daysUntilDue <= 3) return "medium";

        return "low";
    }
};

// Cache utilities
export const cacheUtils = {
    clearAll: () => {
        cache.clear();
        imageCache.clear();
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
            keys: Array.from(cache.keys()),
            imageSize: imageCache.size,
            imageKeys: Array.from(imageCache.keys())
        };
    },

    // Clear user-specific cache
    clearUserCache: (userId) => {
        cacheUtils.clearPattern(`user_${userId}`);
        cacheUtils.clearPattern(`current_user_${userId}`);
    },

    // Clear book-specific cache
    clearBookCache: (bookId) => {
        cacheUtils.clearPattern(`book_${bookId}`);
        cacheUtils.clearPattern(`book_details_${bookId}`);
    }
};

// Error handling utilities
export const errorUtils = {
    // Handle API errors gracefully
    handleApiError: (error, context = '') => {
        console.error(`API Error in ${context}:`, error);

        if (error.message.includes('404')) {
            return 'Resource not found';
        } else if (error.message.includes('401')) {
            return 'Unauthorized access';
        } else if (error.message.includes('403')) {
            return 'Access forbidden';
        } else if (error.message.includes('500')) {
            return 'Server error occurred';
        } else {
            return 'An unexpected error occurred';
        }
    },

    // Retry mechanism for failed requests
    retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }
};

// Export default object with all services
export default {
    userTransactionApi,
    userApi,
    bookApi,
    enhancedBookApi,
    reviewApi,
    userServiceHelpers,
    cacheUtils,
    errorUtils,
    imageService,
    debugImageIssue
};