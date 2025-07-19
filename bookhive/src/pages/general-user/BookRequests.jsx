import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Check, AlertCircle, Eye, MessageSquare, Star, BookOpen } from 'lucide-react';

const BookRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All Requests');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedExchangeBook, setSelectedExchangeBook] = useState(null);

  // Mock data with Exchange request type
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
      message: "I’d like to exchange this book with one of yours. Please check my available books!",
    },
  ];

  useEffect(() => {
    console.log('Loading mock requests:', mockRequests);
    try {
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error setting requests:', error);
    }
  }, []);

  const filteredRequests = requests.filter((request) =>
    selectedFilter === 'All Requests' ? true : request.status === selectedFilter
  );

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
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Requests</h1>
              <p className="text-gray-500 mt-1">Manage incoming requests for your books</p>
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 text-sm"
            >
              <option>All Requests</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
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
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">No {selectedFilter.toLowerCase()} found.</p>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default BookRequestsPage;