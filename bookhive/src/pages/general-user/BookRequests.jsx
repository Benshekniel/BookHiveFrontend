import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Check, AlertCircle, Eye, MessageSquare, Star, BookOpen, CreditCard } from 'lucide-react';

const BookRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedExchangeBook, setSelectedExchangeBook] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  
  // Payment form states
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phoneNumber: '',
    email: 'user@gmail.com',
    deliveryAddress: '',
    specialInstructions: ''
  });

  // Mock data with Exchange request type and Exchange Payment requests
  const mockRequests = [
    {
      id: "1",
      book: {
        id: "1",
        title: "The Silent Patient",
        author: "Alex Michaelides",
        cover: "https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg",
      },
      requestor: {
        id: "2",
        name: "Nimal Fernando",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        trustScore: 4.5,
        availableBooks: [
          { id: "b1", title: "Dune", author: "Frank Herbert", cover: "https://images.pexels.com/photos/190599/pexels-photo-190599.jpeg" },
          { id: "b2", title: "1984", author: "George Orwell", cover: "https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg" },
        ],
      },
      status: "Pending",
      type: "Borrow",
      createdAt: "2025-07-04",
      message: "I've been wanting to read this for a while. Would love to borrow it for two weeks.",
      startDate: "2025-07-09",
      endDate: "2025-07-23",
    },
    {
      id: "2",
      book: {
        id: "3",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        cover: "https://images.pexels.com/photos/3646105/pexels-photo-3646105.jpeg",
      },
      requestor: {
        id: "4",
        name: "Ashan Mendis",
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        trustScore: 4.2,
        availableBooks: [
          { id: "b3", title: "The Alchemist", author: "Paulo Coelho", cover: "https://images.pexels.com/photos/159532/pexels-photo-159532.jpeg" },
        ],
      },
      status: "Approved",
      type: "Buy",
      createdAt: "2025-07-01",
      message: "Interested in buying this book. Is the price negotiable?",
    },
    {
      id: "3",
      book: {
        id: "5",
        title: "Educated",
        author: "Tara Westover",
        cover: "https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg",
      },
      requestor: {
        id: "3",
        name: "Kumari Silva",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
        trustScore: 4.9,
        availableBooks: [
          { id: "b4", title: "The Hobbit", author: "J.R.R. Tolkien", cover: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg" },
          { id: "b5", title: "Pride and Prejudice", author: "Jane Austen", cover: "https://images.pexels.com/photos/264294/pexels-photo-264294.jpeg" },
        ],
      },
      status: "Pending",
      type: "Exchange",
      createdAt: "2025-07-03",
      message: "I'd like to exchange this book with one of yours. Please check my available books!",
    },
    // Exchange Payment Request - using Educated book
    {
      id: "4",
      book: {
        id: "7",
        title: "Educated",
        author: "Tara Westover",
        cover: "https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg",
      },
      requestor: {
        id: "6",
        name: "John Smith", 
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        trustScore: 4.6,
      },
      status: "Approved",
      type: "Exchange Request",
      createdAt: "1/20/2025",
      message: "Exchange approved! Please complete delivery payment.",
      deliveryFee: 500,
    },
  ];

  useEffect(() => {
    console.log('Loading mock requests:', mockRequests);
    try {
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error setting requests:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = (requestId) => {
    setRequests(requests.map((req) =>
      req.id === requestId ? { ...req, status: 'Approved' } : req
    ));
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const submitRejection = () => {
    if (rejectReason.trim()) {
      setRequests(requests.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, status: 'Rejected', rejectReason }
          : req
      ));
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedRequest(null);
    }
  };

  const handleExchange = (request) => {
    setSelectedRequest(request);
    setSelectedExchangeBook(null);
    setShowExchangeModal(true);
  };

  const submitExchange = () => {
    if (selectedExchangeBook) {
      setRequests(requests.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, status: 'Approved', selectedExchangeBook }
          : req
      ));
      setShowExchangeModal(false);
      setSelectedRequest(null);
      setSelectedExchangeBook(null);
      alert(`Exchange approved: Your "${selectedRequest.book.title}" for "${selectedExchangeBook.title}"`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700';
      case 'Approved': return 'bg-green-50 text-green-700';
      case 'Rejected': return 'bg-red-50 text-red-700';
      case 'Completed': return 'bg-blue-50 text-blue-700';
      case 'Exchange Payment': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  // Handle payment for exchange (similar to BrowseBooks)
  const handleExchangePayment = (request) => {
    setSelectedRequest(request);
    setShowPaymentModal(true);
  };

  // Process exchange payment
  const processPayment = () => {
    if (selectedRequest) {
      setRequests(requests.map((req) =>
        req.id === selectedRequest.id
          ? { ...req, status: 'Completed' }
          : req
      ));
      setShowPaymentModal(false);
      setSelectedRequest(null);
      alert('Payment successful! Your exchange will be processed soon.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Requests</h1>
              <p className="text-gray-500 mt-1">Manage incoming requests and payments</p>
            </div>
          </div>
          
          {/* Tab Navigation - like BrowseBooks */}
          <div className="mt-6">
            <div className="flex bg-gray-100 rounded-full p-1 w-fit">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeTab === "requests"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Requests
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeTab === "payments"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("payments")}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Exchange Payments
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {requests.filter(r => r.type !== 'Exchange Request').length > 0 ? (
              requests.filter(r => r.type !== 'Exchange Request').map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={request?.book?.cover || 'https://via.placeholder.com/150'}
                      alt={request?.book?.title || 'Book'}
                      className="w-32 h-44 object-cover rounded-lg shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{request?.book?.title || 'Unknown Title'}</h3>
                          <p className="text-gray-600 text-lg">{request?.book?.author || 'Unknown Author'}</p>
                          <div className="mt-3 flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <span className="text-gray-500 bg-gray-50 px-3 py-1 rounded-full text-sm">
                              {request.type} Request
                            </span>
                            <span className="text-gray-500 text-sm">{request.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                          <img
                            src={request?.requestor?.avatar || 'https://via.placeholder.com/50'}
                            alt={request?.requestor?.name || 'User'}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{request?.requestor?.name || 'Unknown User'}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{request?.requestor?.trustScore || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 italic">"{request.message}"</p>
                        </div>
                      )}
                      {request.type === 'Borrow' && request.startDate && (
                        <div className="mb-4 flex items-center gap-8 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>Start Date: <strong className="text-gray-900">{request.startDate}</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>End Date: <strong className="text-gray-900">{request.endDate}</strong></span>
                          </div>
                        </div>
                      )}
                      {request.status === 'Rejected' && request.rejectReason && (
                        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-800">Rejection Reason:</p>
                              <p className="text-red-700">{request.rejectReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {request.status === 'Approved' && request.selectedExchangeBook && (
                        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start gap-2">
                            <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-green-800">Exchanged Book:</p>
                              <p className="text-green-700">{request.selectedExchangeBook.title} by {request.selectedExchangeBook.author}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {request.status === 'Pending' && (
                        <div className="flex items-center gap-3">
                          {request.type === 'Exchange' ? (
                            <>
                              <button
                                onClick={() => handleExchange(request)}
                                className="px-5 py-2.5 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
                              >
                                <BookOpen className="w-4 h-4" />
                                View Exchange Books
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                            </>
                          )}
                          <button className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </button>
                          <button className="px-5 py-2.5 text-blue-500 font-medium hover:bg-blue-50 rounded-full transition-colors duration-200 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      )}
                      {/* Exchange Payment Action - simple like image */}
                      {request.type === 'Exchange Request' && request.status === 'Approved' && request.deliveryFee && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleExchangePayment(request)}
                            className="px-4 py-2 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-600 transition-colors duration-200"
                          >
                            Make Payment (Rs. {request.deliveryFee})
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">No requests found.</p>
            </div>
          )}
          </div>
        )}

        {/* Exchange Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            {requests.filter(r => r.type === 'Exchange Request' && r.status === 'Approved').length > 0 ? (
              requests.filter(r => r.type === 'Exchange Request' && r.status === 'Approved').map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Book Image - Small like BrowseBooks */}
                      <img
                        src={request?.book?.cover || 'https://via.placeholder.com/80x120'}
                        alt={request?.book?.title || 'Book'}
                        className="w-16 h-24 object-cover rounded-lg shadow-sm flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{request?.book?.title || 'Unknown Title'}</h3>
                            <p className="text-gray-600">{request?.book?.author || 'Unknown Author'}</p>
                            <p className="text-sm text-gray-500 mt-1">{request.type}</p>
                            <p className="text-sm text-gray-500">Requested: {request.createdAt}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                              ✅ {request.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <button
                            onClick={() => handleExchangePayment(request)}
                            className="px-4 py-2 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-600 transition-colors duration-200"
                          >
                            Make Payment (Rs. {request.deliveryFee})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No exchange payments found.</p>
                <p className="text-gray-400 text-sm mt-1">Exchange payments will appear here once approved.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Decline Request</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for declining this request. This will help the requestor understand your decision.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter your reason here..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-sm"
              rows="4"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitRejection}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Decline Request
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Select Book for Exchange</h3>
              <button
                onClick={() => {
                  setShowExchangeModal(false);
                  setSelectedExchangeBook(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Select a book from {selectedRequest?.requestor?.name || 'the requestor'}'s collection to exchange for "{selectedRequest?.book?.title || 'the requested book'}".
            </p>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {selectedRequest?.requestor?.availableBooks?.length > 0 ? (
                selectedRequest.requestor.availableBooks.map((book) => (
                  <div
                    key={book.id}
                    className={`flex items-center gap-4 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      selectedExchangeBook?.id === book.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedExchangeBook(book)}
                  >
                    <img
                      src={book.cover || 'https://via.placeholder.com/100'}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No books available for exchange.</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitExchange}
                disabled={!selectedExchangeBook}
                className="flex-1 px-4 py-2.5 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Exchange
              </button>
              <button
                onClick={() => {
                  setShowExchangeModal(false);
                  setSelectedExchangeBook(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal - with delivery info and payment methods */}
      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto my-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Exchange Payment</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                  setPaymentMethod('card');
                  setDeliveryInfo({
                    fullName: '',
                    phoneNumber: '',
                    email: 'user@gmail.com',
                    deliveryAddress: '',
                    specialInstructions: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold mb-1 text-gray-900">{selectedRequest.book.title}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Exchange Type:</span>
                    <span>{selectedRequest.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>Rs. {selectedRequest.deliveryFee}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>Rs. {selectedRequest.deliveryFee}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  📦 Delivery Information
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={deliveryInfo.fullName}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, fullName: e.target.value})}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        placeholder="+94 712 345 678"
                        value={deliveryInfo.phoneNumber}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, phoneNumber: e.target.value})}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={deliveryInfo.email}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      placeholder="Enter your complete delivery address"
                      value={deliveryInfo.deliveryAddress}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryAddress: e.target.value})}
                      rows="2"
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      placeholder="Any special delivery instructions..."
                      value={deliveryInfo.specialInstructions}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                      rows="2"
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Payment Method</h4>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">💳 Card Payment</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">💵 Cash on Delivery</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card Details - Only show if card payment selected */}
              {paymentMethod === 'card' && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Card Details</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Payment Info */}
              {paymentMethod === 'cash' && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-0.5">💵</div>
                    <div>
                      <h5 className="font-semibold text-blue-800 text-sm">Cash on Delivery</h5>
                      <p className="text-blue-700 text-xs mt-1">
                        You will pay Rs. {selectedRequest.deliveryFee} in cash when delivered.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                  setPaymentMethod('card');
                  setDeliveryInfo({
                    fullName: '',
                    phoneNumber: '',
                    email: 'user@gmail.com',
                    deliveryAddress: '',
                    specialInstructions: ''
                  });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                disabled={!deliveryInfo.fullName || !deliveryInfo.phoneNumber || !deliveryInfo.deliveryAddress}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {paymentMethod === 'card' ? 'Pay Now' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRequestsPage;