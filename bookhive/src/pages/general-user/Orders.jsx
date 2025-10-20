import React, { useState, useEffect } from "react";
import {
  Package, Clock, CheckCircle, Truck, MapPin, Calendar, Star, MessageSquare,
  RefreshCw, AlertCircle, Eye, BookOpen, DollarSign, User, Phone, Mail,
  ArrowRight, Download, FileText, Camera, ThumbsUp, ThumbsDown, Gavel,
  Trophy, X, XCircle, CreditCard, Loader
} from "lucide-react";
import {
  userTransactionApi,
  userApi,
  bookApi,
  userServiceHelpers,
  enhancedBookApi,
  debugImageIssue,
  imageService,
  reviewApi  // ✅ Add this import
} from "../../services/userService";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [imageStatus, setImageStatus] = useState({});

  // State for orders and pagination
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Current user ID (replace with actual auth context)
  const currentUserId = 2001;

  const [cancelForm, setCancelForm] = useState({
    reason: "",
    otherReason: "",
    refundMethod: "original",
  });

  // UPDATED: New review form structure
  const [reviewForm, setReviewForm] = useState({
    sellerRating: 5,
    bookConditionRating: 5,
    overallRating: 5,
    comment: "",
  });

  // Generate safe fallback image
  const generateSafeFallbackImage = (bookId) => {
    return imageService.generateFallbackImage(`Book ${bookId}`);
  };

  // ✅ Updated: Only show review for truly delivered orders
  const canWriteReview = (order) => {
    const status = order.status?.toLowerCase();
    return status === "delivered";
  };

  // ✅ Helper function to check if order can be tracked
  const canTrackOrder = (order) => {
    const status = order.status?.toLowerCase();
    return !["cancelled", "failed"].includes(status);
  };

  // Fetch orders from API
  const fetchOrders = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters = {
        page: currentPage,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        ...filters
      };

      // Map frontend tabs to API filters - UPDATED
      if (activeTab !== "all") {
        switch (activeTab) {
          case "borrowed":
            apiFilters.type = "borrow";
            break;
          case "purchased":
            apiFilters.type = "purchase";
            break;
          case "exchanged":
            apiFilters.type = "exchange";
            break;
          case "bidding":
            apiFilters.type = "bidding";
            break;
          case "active":
            apiFilters.status = "pending"; // Map active to pending
            break;
          case "completed":
            apiFilters.status = "completed"; // This will be handled by backend to check delivery status
            break;
        }
      }

      const response = await userTransactionApi.getUserTransactions(currentUserId, apiFilters);

      // Transform API response to frontend format (synchronously)
      const transformedOrders = response.content.map(transaction => {
        const transformed = userServiceHelpers.transformTransactionResponse(transaction);

        // Ensure book object always exists with safe defaults
        if (!transformed.book) {
          transformed.book = {
            id: transaction.bookId || 0,
            title: `Book ${transaction.bookId || 'Unknown'}`,
            author: 'Unknown Author',
            cover: null,
            bookImage: null
          };
        }

        return transformed;
      });

      setOrders(transformedOrders);
      setTotalOrders(response.totalElements);
      setTotalPages(response.totalPages);

      // ✅ Debug: Log order statuses
      console.log('Order statuses:', transformedOrders.map(o => ({ id: o.id, status: o.status })));

      // Load real book data in background (non-blocking)
      loadBookDataInBackground(transformedOrders);

    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load book data and images in background
  const loadBookDataInBackground = async (orders) => {
    try {
      // Get unique book IDs
      const bookIds = [...new Set(orders.map(order => order.book.id).filter(id => id))];

      // Load book details for each book
      for (const bookId of bookIds) {
        try {
          const bookData = await enhancedBookApi.getBookDetails(bookId);
          if (bookData) {
            // Update orders with real book data
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.book.id === bookId
                  ? {
                    ...order,
                    book: {
                      ...order.book,
                      title: bookData.title,
                      author: bookData.author,
                      cover: bookData.bookImage, // This contains the filename
                      bookImage: bookData.bookImage
                    }
                  }
                  : order
              )
            );
          }
        } catch (error) {
          console.error(`Failed to load book ${bookId}:`, error);
        }
      }

      // Load images using the image service
      setTimeout(() => {
        setOrders(currentOrders => {
          // Load images for all books that have bookImage
          const booksWithImages = currentOrders
            .filter(order => order.book.bookImage)
            .map(order => ({
              id: order.book.id,
              bookId: order.book.id,
              bookImage: order.book.bookImage
            }));

          imageService.loadBookImages(booksWithImages, (key, imageData) => {
            setImageStatus(prev => ({
              ...prev,
              [key]: imageData
            }));
          });

          return currentOrders;
        });
      }, 100);

    } catch (error) {
      console.error('Error loading book data in background:', error);
    }
  };

  // Fetch user statistics
  const fetchStats = async () => {
    try {
      const userStats = await userTransactionApi.getUserTransactionStats(currentUserId);
      setStats(userStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats if API fails
      setStats({
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        overdueOrders: 0,
        cancelledOrders: 0,
        borrowedBooks: 0,
        purchasedBooks: 0,
        exchangedBooks: 0,
        wonAuctions: 0
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [activeTab, currentPage]);

  // Real-time updates (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if we're not on the first page to avoid disrupting user
      if (currentPage === 0) {
        fetchOrders();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentPage, activeTab]);

  useEffect(() => {
    // Debug image loading for the first book that has an image
    if (orders.length > 0) {
      const orderWithImage = orders.find(order => order.book.bookImage);
      if (orderWithImage) {
        console.log('Debugging image for:', orderWithImage.book.bookImage);
        debugImageIssue(orderWithImage.book.bookImage, 'userBooks');
      }
    }
  }, [orders]);

  const getStatusColor = (status) => userServiceHelpers.getStatusColor(status);

  // Updated status icon function to handle delivery status
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} />;
      case "order placed":
        return <Package size={16} />;
      case "picked up":
        return <Truck size={16} />;
      case "in transit":
        return <Clock size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      case "failed":
        return <AlertCircle size={16} />;
      case "delayed":
        return <AlertCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const filteredOrders = orders; // Already filtered by API

  // ✅ FIXED: Review submission using reviewApi
  const handleReviewSubmit = async () => {
    try {
      // Debug logging
      console.log('Selected Order:', selectedOrder);
      console.log('Transaction ID:', selectedOrder.transactionId);

      // Validate form
      if (!reviewForm.comment.trim()) {
        alert("Please write a comment for your review.");
        return;
      }

      if (reviewForm.sellerRating < 1 || reviewForm.sellerRating > 5) {
        alert("Please provide a valid seller rating (1-5 stars).");
        return;
      }

      if (reviewForm.bookConditionRating < 1 || reviewForm.bookConditionRating > 5) {
        alert("Please provide a valid book condition rating (1-5 stars).");
        return;
      }

      if (!selectedOrder.transactionId) {
        alert("Transaction ID is missing. Cannot submit review.");
        return;
      }

      // ✅ Get the user being reviewed based on transaction type
      let reviewedUserId = null;
      if (selectedOrder.type === "purchase" && selectedOrder.seller) {
        reviewedUserId = selectedOrder.seller.userId || selectedOrder.seller.id;
      } else if (selectedOrder.type === "borrow" && selectedOrder.lender) {
        reviewedUserId = selectedOrder.lender.userId || selectedOrder.lender.id;
      } else if (selectedOrder.type === "exchange" && selectedOrder.exchanger) {
        reviewedUserId = selectedOrder.exchanger.userId || selectedOrder.exchanger.id;
      }

      console.log('Reviewed User ID:', reviewedUserId);

      const reviewData = {
        transactionId: selectedOrder.transactionId,
        reviewerUserId: currentUserId,
        bookId: selectedOrder.book.id,
        reviewedUserId: reviewedUserId, // Can be null
        sellerRating: reviewForm.sellerRating,
        bookConditionRating: reviewForm.bookConditionRating,
        overallRating: reviewForm.overallRating,
        comment: reviewForm.comment.trim() // Frontend sends "comment"
      };

      console.log('Submitting review data:', reviewData);

      await reviewApi.submitReview(reviewData);

      alert("Thank you for your review!");
      setShowReviewModal(false);
      setReviewForm({ sellerRating: 5, bookConditionRating: 5, overallRating: 5, comment: "" });

    } catch (error) {
      console.error('Error submitting review:', error);

      if (error.message.includes('already submitted a review') || error.message.includes('Review already exists')) {
        alert("You have already submitted a review for this order.");
      } else if (error.message.includes('400')) {
        alert("Invalid review data. Please check all fields and try again.");
      } else if (error.message.includes('500')) {
        alert("Server error. Please try again later.");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    }
  };
  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelForm.reason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    if (cancelForm.reason === "Other" && !cancelForm.otherReason.trim()) {
      alert("Please provide details for 'Other' reason.");
      return;
    }

    try {
      const cancelData = {
        reason: cancelForm.reason === "Other" ? cancelForm.otherReason : cancelForm.reason,
        refundMethod: cancelForm.refundMethod,
        additionalNotes: cancelForm.reason === "Other" ? cancelForm.otherReason : ""
      };

      const response = await userTransactionApi.cancelTransaction(
        selectedOrder.transactionId,
        currentUserId,
        cancelData
      );

      // Update the order in local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id
            ? userServiceHelpers.transformTransactionResponse(response)
            : order
        )
      );

      const { refundAmount } = userServiceHelpers.calculateRefund(selectedOrder);
      alert(`Order cancelled successfully! Refund of Rs. ${refundAmount} will be processed within 3-5 business days.`);

      setShowCancelModal(false);
      setCancelForm({ reason: "", otherReason: "", refundMethod: "original" });

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const canCancelOrder = (order) => userServiceHelpers.canCancelOrder(order);

  const renderOrderCard = (order) => {
    const imageKey = `book_${order.book.id}`;
    const imageData = imageStatus[imageKey];

    // Determine image source
    let imageSrc;
    if (imageData?.status === 'loaded' && imageData.url) {
      // ✅ Handle direct base64 response like UserReview
      if (imageData.url.startsWith('data:')) {
        imageSrc = imageData.url;
      } else {
        imageSrc = `data:image/jpeg;base64,${imageData.url}`;
      }
    } else {
      imageSrc = generateSafeFallbackImage(order.book?.id || 0);
    }

    // ✅ Debug: Log order status for troubleshooting
    console.log(`Order ${order.id} status: "${order.status}" - Can write review: ${canWriteReview(order)}`);

    return (
      <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={imageSrc}
              alt={order.book?.title || 'Book cover'}
              className="w-16 h-20 object-cover rounded"
              onError={(e) => {
                e.target.src = generateSafeFallbackImage(order.book?.id || 0);
              }}
            />
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-900 mb-1">{order.book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{order.book.author}</p>
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {userServiceHelpers.getTransactionTypeDisplayName(order.type)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {userServiceHelpers.formatCurrency(order.totalAmount)}
            </p>
            <p className="text-sm text-gray-500">
              {userServiceHelpers.formatDate(order.orderDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {order.deliveryMethod === "pickup" ? (
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>Pickup</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Truck size={14} className="mr-1" />
                <span>Delivery</span>
              </div>
            )}
            {order.estimatedDelivery && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>Est: {userServiceHelpers.formatDate(order.estimatedDelivery)}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {/* ✅ Show track button for trackable orders */}
            {canTrackOrder(order) && (
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowTrackingModal(true);
                }}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <Eye size={14} />
                <span>Track</span>
              </button>
            )}

            {/* ✅ FIXED: Show review button for completed/delivered orders */}
            {canWriteReview(order) && (
              <button
                onClick={() => {
                  console.log('Review button clicked for order:', order.id, 'status:', order.status);
                  setSelectedOrder(order);
                  setShowReviewModal(true);
                }}
                className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <Star size={14} />
                <span>Review</span>
              </button>
            )}

            {/* ✅ Show cancel button for cancellable orders */}
            {canCancelOrder(order) && (
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowCancelModal(true);
                }}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-blue-100 text-lg">Track your borrowed, purchased, and exchanged books</p>
            </div>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => fetchOrders()}
                className="ml-auto text-red-600 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  <Package className="w-6 h-6 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Borrowed Books</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.borrowedBooks || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Purchased Books</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.purchasedBooks || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Exchanged Books</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.exchangedBooks || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <RefreshCw className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completedOrders || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Won Auctions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.wonAuctions || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap border-b">
            {[
              { key: "all", label: "All Orders", count: stats?.totalOrders || 0 },
              { key: "borrowed", label: "Borrowed Books", count: stats?.borrowedBooks || 0 },
              { key: "purchased", label: "Purchased Books", count: stats?.purchasedBooks || 0 },
              { key: "exchanged", label: "Exchanged Books", count: stats?.exchangedBooks || 0 },
              { key: "bidding", label: "Won Auctions", count: stats?.wonAuctions || 0 },
              { key: "completed", label: "Completed", count: stats?.completedOrders || 0 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(0);
                }}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                  ? "border-yellow-500 text-yellow-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <>
              {filteredOrders.map(renderOrderCard)}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 bg-white rounded-xl p-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage + 1} of {totalPages} ({totalOrders} total orders)
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${activeTab} orders found.`}
              </p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>Browse Books</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Tracking Modal - UPDATED with current status highlighting */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Order Tracking</h3>
                  <p className="text-gray-600">Order #{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={(() => {
                      const imageKey = `book_${selectedOrder.book.id}`;
                      const imageData = imageStatus[imageKey];
                      if (imageData?.status === 'loaded' && imageData.url) {
                        return imageData.url.startsWith('data:')
                          ? imageData.url
                          : `data:image/jpeg;base64,${imageData.url}`;
                      }
                      return generateSafeFallbackImage(selectedOrder.book?.id || 0);
                    })()}
                    alt={selectedOrder.book?.title || 'Book cover'}
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = generateSafeFallbackImage(selectedOrder.book?.id || 0);
                    }}
                  />

                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900">{selectedOrder.book.title}</h4>
                    <p className="text-gray-600">{selectedOrder.book.author}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status.replace("_", " ")}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <span className="text-xs text-gray-500">
                          Tracking: {selectedOrder.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-gray-900">
                    <User className="mr-2 text-gray-600" size={16} />
                    {selectedOrder.type === "purchase" ? "Seller" :
                      selectedOrder.type === "borrow" ? "Lender" : "Exchanger"} Details
                  </h4>
                  <p className="text-sm">
                    {(selectedOrder.seller || selectedOrder.lender || selectedOrder.exchanger)?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(selectedOrder.seller || selectedOrder.lender || selectedOrder.exchanger)?.location || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-gray-900">
                    <MapPin className="mr-2 text-gray-600" size={16} />
                    Delivery Information
                  </h4>
                  <p className="text-sm">
                    {selectedOrder.deliveryMethod === "pickup" ? "Pickup" : "Home Delivery"}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress || 'N/A'}</p>
                  {selectedOrder.estimatedDelivery && (
                    <p className="text-sm text-gray-600 mt-1">
                      Expected: {userServiceHelpers.formatDate(selectedOrder.estimatedDelivery)}
                    </p>
                  )}
                </div>
              </div>

              {/* Tracking Timeline - UPDATED with current status highlighting */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center text-gray-900">
                  <Truck className="mr-2 text-gray-600" size={16} />
                  Tracking History
                </h4>
                <div className="space-y-4">
                  {selectedOrder.tracking && selectedOrder.tracking.length > 0 ? (
                    selectedOrder.tracking.map((track, index) => {
                      // Check if this is the current status
                      const isCurrentStatus = index === 0 ||
                        track.status.toLowerCase().includes(selectedOrder.status.toLowerCase());

                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-1 ${isCurrentStatus ? "bg-yellow-500" : "bg-gray-300"
                            }`}></div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={`font-medium ${isCurrentStatus ? "text-yellow-600" : "text-gray-900"}`}>
                                  {track.status}
                                </p>
                                <p className="text-sm text-gray-600">{track.description}</p>
                                {isCurrentStatus && (
                                  <p className="text-xs text-yellow-500 font-medium mt-1">Current Status</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{track.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No tracking information available</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                {/* ✅ FIXED: Use helper function for review button */}
                {canWriteReview(selectedOrder) && (
                  <button
                    onClick={() => {
                      setShowTrackingModal(false);
                      setShowReviewModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Cancel Order</h3>
                <p className="text-gray-600">{selectedOrder.book.title} - Order #{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelForm({ reason: "", otherReason: "", refundMethod: "original" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Refund Calculation Display */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold mb-3 text-gray-900 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Refund Calculation
              </h4>
              {(() => {
                const { refundAmount, deductionReasons } = userServiceHelpers.calculateRefund(selectedOrder);
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Original Amount:</span>
                      <span className="font-medium">
                        {userServiceHelpers.formatCurrency(selectedOrder.totalAmount || 0)}
                      </span>
                    </div>
                    {deductionReasons.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Deductions:</p>
                        {deductionReasons.map((reason, index) => (
                          <div key={index} className="flex justify-between text-sm text-red-600">
                            <span>- {reason.split(': ')[0]}:</span>
                            <span>{reason.split(': ')[1]?.replace('Rs. ', '') || '0'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Refund Amount:</span>
                      <span className="text-green-600">{userServiceHelpers.formatCurrency(refundAmount)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * Refund will be processed within 3-5 business days
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Cancellation Reason Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reason for Cancellation <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {userServiceHelpers.getCancellationReasons(selectedOrder.type).map((reason, index) => (
                  <label key={index} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelForm.reason === reason}
                      onChange={(e) => setCancelForm(prev => ({ ...prev, reason: e.target.value }))}
                      className="mr-3 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              {cancelForm.reason === "Other" && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify:
                  </label>
                  <textarea
                    rows={3}
                    value={cancelForm.otherReason}
                    onChange={(e) => setCancelForm(prev => ({ ...prev, otherReason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    placeholder="Please provide details for cancellation..."
                  />
                </div>
              )}
            </div>

            {/* Refund Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Refund Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="original"
                    checked={cancelForm.refundMethod === "original"}
                    onChange={(e) => setCancelForm(prev => ({ ...prev, refundMethod: e.target.value }))}
                    className="mr-3 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Refund to original payment method</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="wallet"
                    checked={cancelForm.refundMethod === "wallet"}
                    onChange={(e) => setCancelForm(prev => ({ ...prev, refundMethod: e.target.value }))}
                    className="mr-3 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Add to BookHive wallet</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelForm({ reason: "", otherReason: "", refundMethod: "original" });
                }}
                className="flex-1 bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={!cancelForm.reason || (cancelForm.reason === "Other" && !cancelForm.otherReason.trim())}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATED Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Write a Review</h3>
              <p className="text-gray-600">{selectedOrder.book.title}</p>
            </div>

            <div className="space-y-4">
              {/* UPDATED: Seller Rating - Moved to top */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedOrder.type === "purchase" ? "Seller" :
                    selectedOrder.type === "borrow" ? "Lender" :
                      selectedOrder.type === "exchange" ? "Exchanger" : "Seller"} Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm((prev) => ({ ...prev, sellerRating: star }))}
                      className={`text-xl ${star <= reviewForm.sellerRating ? "text-blue-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* UPDATED: Book Condition Rating - Under delivery rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Condition Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm((prev) => ({ ...prev, bookConditionRating: star }))}
                      className={`text-xl ${star <= reviewForm.bookConditionRating ? "text-green-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  placeholder="Share your experience with this book and the owner..."
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewForm({ sellerRating: 5, bookConditionRating: 5, overallRating: 5, comment: "" });
                }}
                className="bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewForm.comment.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:cursor-not-allowed"
              >
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;