import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  MapPin, Tag, Heart, MessageSquare, Gavel, ArrowLeft, X, Star, 
  Eye, Share2, Flag, User, Calendar, BookOpen, Clock, Shield,
  Phone, Mail, Award, TrendingUp, Users, ChevronDown, ArrowRight,
  ShoppingCart, Repeat,
  Book
} from "lucide-react";
import Button from "../../components/shared/Button";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [borrowDuration, setBorrowDuration] = useState("14");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if book data is passed through location state
    if (location.state?.book) {
      const passedBook = location.state.book;
      // Enhance the book with additional data for demo purposes
      const enhancedBook = {
        ...passedBook,
        reviews: passedBook.reviews || [
          {
            id: 1,
            user: {
              name: "Mike Chen",
              avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40&h=40&fit=crop&crop=face"
            },
            rating: 5,
            comment: "Great condition book! Very responsive owner and smooth transaction. Highly recommend!",
            timeAgo: "2 days ago"
          },
          {
            id: 2,
            user: {
              name: "Emma Wilson",
              avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=40&h=40&fit=crop&crop=face"
            },
            rating: 4,
            comment: "Perfect copy of this book. Exactly as described and very accommodating with pickup times.",
            timeAgo: "1 week ago"
          }
        ],
        rating: passedBook.rating || 4.5,
        totalReviews: passedBook.totalReviews || 12,
        ratings: passedBook.ratings || {
          5: 8,
          4: 2,
          3: 1,
          2: 1,
          1: 0
        },
        views: passedBook.views || 1240,
        wishlistedCount: passedBook.wishlistedCount || 23,
        recentBids: passedBook.forSale && passedBook.price ? [
          { amount: passedBook.price - 50, bidder: "John D.", time: "2 hours ago" },
          { amount: passedBook.price - 100, bidder: "Alice M.", time: "5 hours ago" },
          { amount: passedBook.price - 150, bidder: "Mike R.", time: "1 day ago" }
        ] : []
      };
      setBook(enhancedBook);
      setLoading(false);
    } else {
      // If no book data is passed, redirect back to browse
      navigate("/user/browse-books");
    }
  }, [id, location.state, navigate]);

  // Navigation handlers for separate pages
  const handleBidClick = () => {
    navigate(`/user/browse-books/bidding/${book.id}`, { 
      state: { 
        book,
        bidHistory: book.recentBids || []
      } 
    });
  };

  const handleBuyClick = () => {
    navigate(`/user/browse-books/payment/${book.id}`, { 
      state: { 
        book, 
        type: 'purchase'
      } 
    });
  };

  const handleBorrowRequest = () => {
    setRequestType("borrow");
    setShowContactModal(true);
  };

  const handleExchangeRequest = () => {
    setRequestType("exchange");
    setShowContactModal(true);
  };

  const handleContactSubmit = () => {
    if (!requestType || !message) return;
    console.log(`Contact request: ${requestType} for ${book.title} - ${message}`);
    alert(`Your ${requestType} request has been sent to ${book.owner.name}`);
    setShowContactModal(false);
    setMessage("");
    setRequestType("");
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically make an API call to update the wishlist
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Book not found</p>
          <Button
            variant="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/user/browse-books")}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`} 
      />
    ));
  };

  const renderRatingBars = () => {
    if (!book.ratings) return null;
    
    const totalRatings = Object.values(book.ratings).reduce((sum, count) => sum + count, 0);
    
    return [5, 4, 3, 2, 1].map(rating => {
      const count = book.ratings[rating] || 0;
      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
      
      return (
        <div key={rating} className="flex items-center gap-2 text-sm">
          <span className="w-2">{rating}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="w-4 text-gray-600">{count}</span>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-8xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Book Details</h1>
              <p className="text-gray-600">Explore and interact with this book</p>
            </div>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
              onClick={() => navigate("/user/browse-books")}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Books
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Book Image */}
            <div className="w-full lg:w-1/3">
              <div className="relative h-64 md:h-80 overflow-hidden rounded-xl">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
                <button 
                  onClick={handleWishlistToggle}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors shadow-lg ${
                    isWishlisted 
                      ? "bg-red-100 text-red-500" 
                      : "bg-white/80 text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                
                {/* Availability Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {book.forSale && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      For Sale
                    </span>
                  )}
                  {book.forLend && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      For Lending
                    </span>
                  )}
                  {book.forExchange && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                      For Exchange
                    </span>
                  )}
                </div>
              </div>

              {/* Book Details Table */}
              <div className="mt-6 space-y-3 text-sm bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium text-green-600">
                    {book.availableFrom ? `Available from ${book.availableFrom}` : 'Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium">{book.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{book.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wishlisted</span>
                  <span className="font-medium">{book.wishlistedCount || 0} times</span>
                </div>
                {book.language && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium">{book.language}</span>
                  </div>
                )}
                {book.publishYear && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium">{book.publishYear}</span>
                  </div>
                )}
              </div>

              {/* Book Owner */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Book Owner</h3>
                <div className="flex items-center mb-4">
                  <img 
                    src={book.owner.avatar} 
                    alt={book.owner.name} 
                    className="h-10 w-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{book.owner.name}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {book.owner.trustScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {book.owner.responseTime || 'Usually responds within 2 hours'}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-600 hover:bg-gray-100 text-sm"
                  onClick={() => setShowContactModal(true)}
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  Contact Owner
                </Button>
              </div>
            </div>

            {/* Right Column - Book Information */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
              
              {/* Rating */}
              {book.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">
                    {renderStars(book.rating)}
                  </div>
                  <span className="text-lg font-medium text-gray-700">{book.rating}</span>
                  <span className="text-gray-500">({book.totalReviews || 0} reviews)</span>
                </div>
              )}
              
              <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

              {/* Genre Tags */}
              {book.genre && book.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genre.map((g, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      #{g}
                    </span>
                  ))}
                </div>
              )}

              {/* Location and Price */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{book.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{book.condition}</span>
                </div>
                {book.forSale && book.price && (
                  <div className="text-2xl font-bold text-green-600">Rs. {book.price}</div>
                )}
                {book.forLend && book.lendingPeriod && (
                  <div className="text-blue-600 font-semibold">
                    {book.lendingPeriod} days lending period
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {book.forSale && (
                  <>
                    <Button
                      variant="primary"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
                      onClick={handleBuyClick}
                      icon={<ShoppingCart className="w-4 h-4" />}
                    >
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg text-sm font-medium"
                      onClick={handleBidClick}
                      icon={<Gavel className="w-4 h-4" />}
                    >
                      Place Bid
                    </Button>
                  </>
                )}
                {book.forLend && (
                  <Button
                    variant="primary"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
                    onClick={handleBorrowRequest}
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Request to Borrow
                  </Button>
                )}
                {book.forExchange && (
                  <Button
                    variant="primary"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
                    onClick={handleExchangeRequest}
                    icon={<Repeat className="w-4 h-4" />}
                  >
                    Request Exchange
                  </Button>
                )}
              </div>

              {/* Additional Book Info */}
              {(book.isbn || book.publishYear) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
                  {book.isbn && (
                    <div>
                      <span className="text-gray-500 block text-sm">ISBN</span>
                      <span className="font-medium text-gray-900">{book.isbn}</span>
                    </div>
                  )}
                  {book.publishYear && (
                    <div>
                      <span className="text-gray-500 block text-sm">Published</span>
                      <span className="font-medium text-gray-900">{book.publishYear}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Bids */}
              {book.forSale && book.recentBids && book.recentBids.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Bids</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {book.recentBids.slice(0, 3).map((bid, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="font-semibold text-gray-900">Rs. {bid.amount}</p>
                            <p className="text-sm text-gray-600">by {bid.bidder}</p>
                          </div>
                          <span className="text-xs text-gray-500">{bid.time}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={handleBidClick}
                      icon={<Eye className="w-4 h-4" />}
                    >
                      View All Bids & Place Bid
                    </Button>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {book.reviews && book.reviews.length > 0 && (
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Reviews & Ratings</h3>
                    <Button
                      variant="primary"
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Write Review
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Rating Summary */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl font-bold text-gray-900">{book.rating}</span>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(book.rating)}
                          </div>
                          <p className="text-sm text-gray-600">{book.totalReviews} reviews</p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    {book.ratings && (
                      <div className="space-y-2">
                        {renderRatingBars()}
                      </div>
                    )}
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {book.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <img 
                            src={review.user.avatar} 
                            alt={review.user.name} 
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">{review.timeAgo}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Contact Owner</h3>
              <button 
                onClick={() => setShowContactModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Book: <span className="font-medium text-gray-900">{book.title}</span></p>
                <p className="text-sm text-gray-600">Owner: <span className="font-medium text-gray-900">{book.owner.name}</span></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select request type</option>
                  {book.forLend && <option value="borrow">Borrow the book</option>}
                  {book.forExchange && <option value="exchange">Exchange the book</option>}
                  <option value="question">Ask a question</option>
                </select>
              </div>

              {requestType === "borrow" && book.lendingPeriod && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Borrow Duration</label>
                  <select
                    value={borrowDuration}
                    onChange={(e) => setBorrowDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="7">1 week</option>
                    <option value="14">2 weeks</option>
                    <option value={book.lendingPeriod}>Owner's preferred duration ({book.lendingPeriod} days)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  rows="4"
                  placeholder="Write your message to the book owner..."
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-100"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                onClick={handleContactSubmit}
                disabled={!requestType || !message}
                icon={<Send className="w-4 h-4" />}
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;