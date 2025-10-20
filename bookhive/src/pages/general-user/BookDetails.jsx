import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  MapPin, Tag, Heart, MessageSquare, Gavel, ArrowLeft, X, Star, 
  Eye, Share2, Flag, User, Calendar, BookOpen, Clock, Shield,
  Phone, Mail, Award, TrendingUp, Users, ChevronDown, ArrowRight,
  ShoppingCart, Repeat, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import Button from "../../components/shared/Button";
import LazyImage from "../../components/LazyImage";
import imageCache from "../../utils/imageCache";
import { useAuth } from '../../components/AuthContext';

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:9090/api";

// UserAvatar component for consistent user image handling
const UserAvatar = ({ user, size = "md", className = "" }) => {
  const baseUrl = 'http://localhost:9090';
  const sizes = { sm: "w-4 h-4", md: "w-10 h-10", lg: "w-12 h-12" };
  const getDefaultUserAvatar = (userName) => {
    const colors = [
      ['%237C3AED', '%234C1D95'], ['%2306B6D4', '%230891B2'],
      ['%2310B981', '%23059669'], ['%23F59E0B', '%23D97706'],
      ['%23EF4444', '%23DC2626'], ['%238B5CF6', '%237C3AED'],
    ];
    const hash = (userName || 'User').split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0); return a & a;
    }, 0);
    const [color1, color2] = colors[Math.abs(hash) % colors.length];
    return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cradialGradient id='bg' cx='50%25' cy='30%25'%3e%3cstop offset='0%25' stop-color='${color1}'/%3e%3cstop offset='100%25' stop-color='${color2}'/%3e%3c/radialGradient%3e%3c/defs%3e%3ccircle cx='50' cy='50' r='50' fill='url(%23bg)'/%3e%3ccircle cx='50' cy='37' r='18' fill='%23FFFFFF' opacity='0.9'/%3e%3cpath d='M50 60c-15 0-28 10-30 22 0 3 2 5 5 5h50c3 0 5-2 5-5-2-12-15-22-30-22z' fill='%23FFFFFF' opacity='0.9'/%3e%3c/svg%3e`;
  };
  const getUserImageSrc = () => {
    if (user?.profileImage) {
      return `${baseUrl}/getFileAsBase64?fileName=${user.profileImage}&folderName=userProfiles`;
    }
    if (user?.avatar && user.avatar !== "https://via.placeholder.com/50" && user.avatar !== null) {
      return user.avatar;
    }
    return getDefaultUserAvatar(user?.name);
  };
  return (
    <img
      src={getUserImageSrc()}
      alt={user?.name || "User"}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
      onError={(e) => { e.target.src = getDefaultUserAvatar(user?.name); }}
    />
  );
};

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = 'http://localhost:9090';

  const [book, setBook] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [borrowDuration, setBorrowDuration] = useState("14");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showExchangeBookModal, setShowExchangeBookModal] = useState(false);
  const [exchangeBook, setExchangeBook] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [disabledBooks, setDisabledBooks] = useState(new Set());
  const [myRequests, setMyRequests] = useState([]);
  const [toast, setToast] = useState(null);

  // NEW: borrow existence states
  const [checkingBorrow, setCheckingBorrow] = useState(false);
  const [hasActiveBorrow, setHasActiveBorrow] = useState(false);

  const { user } = useAuth();

  // Toast Component
  const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }, [onClose]);
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === "success" ? "bg-green-500 text-white"
        : type === "error" ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
      }`}>
        <div className="flex items-center space-x-2">
          {type === "success" && <CheckCircle className="w-5 h-5" />}
          {type === "error" && <XCircle className="w-5 h-5" />}
          {type === "info" && <AlertCircle className="w-5 h-5" />}
          <span>{message}</span>
          <button onClick={onClose} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  const disableBookTemporarily = (bookId) => {
    setDisabledBooks((prev) => new Set([...prev, bookId]));
    setTimeout(() => {
      setDisabledBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }, 300000);
  };

  // Load book from location.state
  useEffect(() => {
    if (location.state?.book) {
      const passedBook = location.state.book;
      const enhancedBook = {
        ...passedBook,
        reviews: passedBook.reviews || [
          {
            id: 1,
            user: { name: "Mike Chen", avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40&h=40&fit=crop&crop=face" },
            rating: 5,
            comment: "Great condition book! Very responsive owner and smooth transaction. Highly recommend!",
            timeAgo: "2 days ago"
          },
          {
            id: 2,
            user: { name: "Emma Wilson", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=40&h=40&fit=crop&crop=face" },
            rating: 4,
            comment: "Perfect copy of this book. Exactly as described and very accommodating with pickup times.",
            timeAgo: "1 week ago"
          }
        ],
        rating: passedBook.rating || 4.5,
        totalReviews: passedBook.totalReviews || 12,
        ratings: passedBook.ratings || { 5: 8, 4: 2, 3: 1, 2: 1, 1: 0 },
        views: passedBook.views || 1240,
        wishlistedCount: passedBook.wishlistedCount || 23,
        recentBids: (passedBook.forBidding || passedBook.forSale) && passedBook.price ? [
          { amount: passedBook.price - 50, bidder: "John D.", time: "2 hours ago" },
          { amount: passedBook.price - 100, bidder: "Alice M.", time: "5 hours ago" },
          { amount: passedBook.price - 150, bidder: "Mike R.", time: "1 day ago" }
        ] : []
      };
      setBook(enhancedBook);
      setLoading(false);
    } else {
      navigate("/user/browse-books");
    }
  }, [id, location.state, navigate]);

  // Preload image
  useEffect(() => {
    const preloadBookImage = async () => {
      if (book?.bookImage) {
        const cachedImage = imageCache.get(book.bookImage, 'userBooks');
        if (!cachedImage) {
          try {
            const response = await fetch(`${baseUrl}/getFileAsBase64?fileName=${book.bookImage}&folderName=userBooks`);
            if (response.ok) {
              const imageData = await response.text();
              imageCache.set(book.bookImage, 'userBooks', imageData);
            }
          } catch (error) {
            console.error(`Failed to preload image for ${book.title}:`, error);
          }
        }
      }
    };
    preloadBookImage();
  }, [book]);

  // NEW: Check if an active borrow request exists (hide actions if true)
  useEffect(() => {
    const run = async () => {
      if (!user?.userId || !book) return;
      const bookId = book.id || book.bookId;
      if (!bookId) return;
      try {
        setCheckingBorrow(true);
        const res = await fetch(`${API_BASE}/existsBorrowActive/${user.userId}/${bookId}`);
        if (!res.ok) throw new Error(`existsBorrowActive failed ${res.status}`);
        const exists = await res.json();
        setHasActiveBorrow(Boolean(exists));
      } catch (err) {
        console.warn("Borrow existence check failed:", err.message);
        setHasActiveBorrow(false);
      } finally {
        setCheckingBorrow(false);
      }
    };
    run();
  }, [user?.userId, book]);

  // Navigation handlers
  const handleBidClick = () => {
    navigate(`/user/browse-books/bidding/${book.id || book.bookId}`, { 
      state: { book, bidHistory: book.recentBids || [] } 
    });
  };

  const handleBuyClick = () => {
    disableBookTemporarily(book.id || book.bookId);
    navigate(`/user/browse-books/payment/${book.id || book.bookId}`, { state: { book, type: 'purchase' } });
  };

  const handleBorrowRequest = async () => {
    // Re-check to prevent race
    if (hasActiveBorrow) {
      showToast("You already have an active borrow request for this book.", "info");
      return;
    }
    setRequestType("borrow");
    setShowBorrowModal(true);
  };

  // NEW: Backend borrow creation
  const confirmBorrowRequest = async () => {
    const bookId = book.id || book.bookId;
    const ownerEmail = book.owner?.email || book.userEmail || book.ownerEmail;

    if (!user?.userId || !user?.name) {
      showToast("User not found. Please login again.", "error");
      return;
    }
    if (!bookId) {
      showToast("Book ID missing. Please try again.", "error");
      return;
    }
    if (!ownerEmail) {
      showToast("Owner email not available for this book.", "error");
      return;
    }

    // Fees based on distance
    const distanceKm = 50;
    const deliveryPrice = distanceKm * 7;
    const handlingPrice = distanceKm * 1;

    const dto = {
      userId: Number(user.userId),
      name: user.name,
      bookId: Number(bookId),
      ownerEmail: ownerEmail,
      deliveryPrice,
      handlingPrice
    };

    try {
      disableBookTemporarily(bookId);
      const res = await fetch(`${API_BASE}/createBorrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create borrow request");
      }
      const saved = await res.json();
      setShowBorrowModal(false);
      setHasActiveBorrow(true); // hide buttons now
      setMyRequests((prev) => [
        ...prev,
        {
          id: `req-${Date.now()}`,
          bookId: bookId,
          bookTitle: book.title,
          type: "borrow",
          status: "pending",
          requestedAt: new Date().toISOString(),
          book: book,
          server: saved
        }
      ]);
      showToast("Your borrow request has been sent. Wait for approval.", "success");
    } catch (err) {
      console.error("Create borrow error:", err);
      showToast("Failed to send borrow request. Try again.", "error");
    }
  };

  const handleExchangeRequest = () => {
    setRequestType("exchange");
    setShowExchangeModal(true);
  };

  const confirmExchangeRequest = () => {
    disableBookTemporarily(book.id || book.bookId);
    const newRequest = {
      id: `req-${Date.now()}`,
      bookId: book.id || book.bookId,
      bookTitle: book.title,
      type: "exchange",
      status: "pending",
      requestedAt: new Date().toISOString(),
      book: book,
    };
    setMyRequests((prev) => [...prev, newRequest]);
    setShowExchangeModal(false);
    showToast("Your exchange request has been sent. Wait for approval.", "success");
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    showToast(
      isWishlisted ? `"${book.title}" removed from wishlist!` : `"${book.title}" added to wishlist!`,
      "success"
    );
  };

  const handleBorrowPayment = () => {
    setPaymentType("borrow");
    setShowPaymentModal(true);
  };

  const handleExchangePayment = () => {
    setPaymentType("exchange");
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    const amount = paymentType === "borrow" ? Math.round(book.price * 0.2) + 200 : 200;
    setMyRequests((prev) =>
      prev.map((req) => (req.bookId === (book.id || book.bookId) ? { ...req, status: "completed" } : req))
    );
    setShowPaymentModal(false);
    showToast(
      `Payment of Rs. ${amount} successful! ${
        paymentType === "borrow" ? "Book will be delivered soon." : "Exchange completed successfully."
      }`,
      "success"
    );
  };

  const showExchangeBookSelection = () => {
    const mockExchangeBook = {
      id: "exchange-book-1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      condition: "Good",
      cover: placeholder,
      bookImage: null,
    };
    setExchangeBook(mockExchangeBook);
    setShowExchangeBookModal(true);
  };

  const acceptExchangeBook = () => {
    setShowExchangeBookModal(false);
    handleExchangePayment();
  };

  const rejectExchangeBook = () => {
    setMyRequests((prev) =>
      prev.map((req) => (req.bookId === (book.id || book.bookId) ? { ...req, status: "rejected" } : req))
    );
    setShowExchangeBookModal(false);
    showToast("Exchange rejected. Request has been cancelled.", "info");
  };

  const handleContactSubmit = () => {
    if (!requestType || !message) return;
    showToast(`Your ${requestType} request has been sent to ${book.owner.name}`, "success");
    setShowContactModal(false);
    setMessage("");
    setRequestType("");
  };

  const placeholder = "data:image/svg+xml,%3csvg width='150' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='200' fill='%236B7280'/%3e%3ctext x='75' y='100' text-anchor='middle' fill='%23FFFFFF' font-size='14'%3eNo Image%3c/text%3e%3c/svg%3e";

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

  const isDisabled = disabledBooks.has(book.id || book.bookId);
  const placeholderImg = placeholder;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
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
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <span className="w-4 text-gray-600">{count}</span>
        </div>
      );
    });
  };

  const actionsBlocked = hasActiveBorrow;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
        <div className={`bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 ${isDisabled ? "opacity-50" : ""}`}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Book Image */}
            <div className="w-full lg:w-1/3">
              <div className="relative h-64 md:h-80 overflow-hidden rounded-xl">
                {book.bookImage ? (
                  <LazyImage
                    src={book.cover || placeholderImg}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    fileName={book.bookImage}
                    folderName="userBooks"
                    baseUrl={baseUrl}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-2" />
                      <div className="text-sm">No Image</div>
                      <div className="text-xs">{book.title}</div>
                    </div>
                  </div>
                )}
                {isDisabled && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Clock className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs">Processing...</span>
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleWishlistToggle}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors shadow-lg ${
                    isWishlisted ? "bg-red-100 text-red-500" : "bg-white/80 text-gray-500 hover:text-red-500"
                  }`}
                  disabled={isDisabled}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {book.forSale && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">For Sale</span>}
                  {book.forBidding && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">For Bidding</span>}
                  {book.forLend && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">For Lending</span>}
                  {book.forExchange && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">For Exchange</span>}
                </div>
              </div>

              {/* Book Details Table */}
              <div className="mt-6 space-y-3 text-sm bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium text-green-600">{book.availableFrom ? `Available from ${book.availableFrom}` : 'Available'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium">{book.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{book.views || 0}</span>
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
                  <UserAvatar user={book.owner} size="md" className="mr-3" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{book.owner.name}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                        <Star className="w-3 h-3 mr-1" /> {book.owner.trustScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-lg text-gray-600 mb-4">by {book.author}</p>

              {book.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex">{renderStars(book.rating)}</div>
                  <span className="text-lg font-medium text-gray-700">{book.rating}</span>
                  <span className="text-gray-500">({book.totalReviews || 0} reviews)</span>
                </div>
              )}

              <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

              {book.genre && book.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genre.map((g, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">#{g}</span>
                  ))}
                </div>
              )}

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

              {/* Action Buttons or Info */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {actionsBlocked ? (
                  <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">Pending Borrow Request</p>
                        <p className="text-sm">
                          You already have an active borrow request for this book. Actions are disabled until it’s resolved.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {book.forSale && (
                      <Button
                        variant="primary"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
                        onClick={handleBuyClick}
                        icon={<ShoppingCart className="w-4 h-4" />}
                        disabled={isDisabled || checkingBorrow}
                      >
                        Buy Now
                      </Button>
                    )}
                    {book.forBidding && (
                      <Button
                        variant="primary"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
                        onClick={handleBidClick}
                        icon={<Gavel className="w-4 h-4" />}
                        disabled={isDisabled || checkingBorrow}
                      >
                        Place Bid
                      </Button>
                    )}
                    {book.forLend && (
                      <Button
                        variant="primary"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
                        onClick={handleBorrowRequest}
                        icon={<BookOpen className="w-4 h-4" />}
                        disabled={isDisabled || checkingBorrow}
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
                        disabled={isDisabled || checkingBorrow}
                      >
                        Request Exchange
                      </Button>
                    )}
                  </>
                )}
              </div>

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

              {book.forBidding && book.recentBids && book.recentBids.length > 0 && (
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
                      disabled={isDisabled || checkingBorrow}
                    >
                      View All Bids & Place Bid
                    </Button>
                  </div>
                </div>
              )}

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
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl font-bold text-gray-900">{book.rating}</span>
                        <div>
                          <div className="flex items-center gap-1 mb-1">{renderStars(book.rating)}</div>
                          <p className="text-sm text-gray-600">{book.totalReviews} reviews</p>
                        </div>
                      </div>
                    </div>
                    {book.ratings && <div className="space-y-2">{renderRatingBars()}</div>}
                  </div>

                  <div className="space-y-6">
                    {book.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <UserAvatar user={review.user} size="lg" className="flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                              <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
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

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact Owner</h3>
                <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
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
                    {book.forSale && <option value="purchase">Purchase the book</option>}
                    {book.forBidding && <option value="bid">Place a bid</option>}
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
                <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-100" onClick={() => setShowContactModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  onClick={handleContactSubmit}
                  disabled={!requestType || !message}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Send Request
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Borrow Confirmation Modal */}
        {showBorrowModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Confirm Borrow Request</h3>
                <button onClick={() => setShowBorrowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Are you sure you want to send a borrow request for:</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-600">Owner: {book.owner.name}</p>
                  <p className="text-sm text-gray-600">Borrowing Price: Rs. {Math.round((book?.price || 0) * 0.2)}</p>
                  <p className="text-sm text-gray-600">Delivery Price: Rs. 350</p>
                  <p className="text-sm text-gray-600">Handling Fee: Rs. 50</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowBorrowModal(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmBorrowRequest} className="bg-green-500 hover:bg-green-600 text-white">
                  Confirm Borrow Request
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Confirmation Modal */}
        {showExchangeModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Confirm Exchange Request</h3>
                <button onClick={() => setShowExchangeModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Are you sure you want to send an exchange request for:</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-600">Owner: {book.owner.name}</p>
                  <p className="text-sm text-gray-600">Delivery Price: Rs. 200</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowExchangeModal(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmExchangeRequest} className="bg-purple-500 hover:bg-purple-600 text-white">
                  Confirm Exchange Request
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Payment Details</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">{book.title}</h4>
                  <div className="space-y-2 text-sm">
                    {paymentType === "borrow" && (
                      <>
                        <div className="flex justify-between"><span>Book Price:</span><span>Rs. {book.price}</span></div>
                        <div className="flex justify-between"><span>Borrow Fee (20%):</span><span>Rs. {Math.round((book.price || 0) * 0.2)}</span></div>
                      </>
                    )}
                    <div className="flex justify-between"><span>Delivery Fee:</span><span>Rs. 200</span></div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>Rs. {paymentType === "borrow" ? Math.round((book.price || 0) * 0.2) + 200 : 200}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
                <Button variant="primary" onClick={processPayment} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Book Selection Modal */}
        {showExchangeBookModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Exchange Book Offer</h3>
                <button onClick={() => setShowExchangeBookModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">The owner has offered this book for exchange:</p>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                  {exchangeBook?.bookImage ? (
                    <LazyImage
                      src={exchangeBook?.cover || placeholderImg}
                      alt={exchangeBook?.title}
                      className="w-16 h-20 object-cover rounded"
                      fileName={exchangeBook.bookImage}
                      folderName="userBooks"
                      baseUrl={baseUrl}
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{exchangeBook?.title}</h4>
                    <p className="text-sm text-gray-600">{exchangeBook?.author}</p>
                    <p className="text-sm text-gray-600">Condition: {exchangeBook?.condition}</p>
                    <p className="text-sm text-gray-600">Delivery Price: Rs. 200</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">Do you want to proceed with this exchange?</p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowExchangeBookModal(false)} className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                  Reject Exchange
                </Button>
                <Button variant="primary" onClick={acceptExchangeBook} className="bg-green-500 hover:bg-green-600 text-white">
                  Accept & Pay Delivery (Rs. 200)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
// import { 
//   MapPin, Tag, Heart, MessageSquare, Gavel, ArrowLeft, X, Star, 
//   Eye, Share2, Flag, User, Calendar, BookOpen, Clock, Shield,
//   Phone, Mail, Award, TrendingUp, Users, ChevronDown, ArrowRight,
//   ShoppingCart, Repeat, CheckCircle, XCircle, AlertCircle
// } from "lucide-react";
// import Button from "../../components/shared/Button";
// import LazyImage from "../../components/LazyImage";
// import imageCache from "../../utils/imageCache";

// // UserAvatar component for consistent user image handling
// const UserAvatar = ({ user, size = "md", className = "" }) => {
//   const baseUrl = 'http://localhost:9090';
  
//   // Size configurations
//   const sizes = {
//     sm: "w-4 h-4",
//     md: "w-10 h-10", 
//     lg: "w-12 h-12"
//   };
  
//   // Generate colored avatar based on user name for visual distinction
//   const getDefaultUserAvatar = (userName) => {
//     const colors = [
//       ['%237C3AED', '%234C1D95'], // Purple
//       ['%2306B6D4', '%230891B2'], // Cyan
//       ['%2310B981', '%23059669'], // Emerald
//       ['%23F59E0B', '%23D97706'], // Amber
//       ['%23EF4444', '%23DC2626'], // Red
//       ['%238B5CF6', '%237C3AED'], // Violet
//     ];
    
//     // Simple hash function to get consistent color for user
//     const hash = (userName || 'User').split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0);
//       return a & a;
//     }, 0);
    
//     const colorIndex = Math.abs(hash) % colors.length;
//     const [color1, color2] = colors[colorIndex];
    
//     return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cradialGradient id='bg' cx='50%25' cy='30%25'%3e%3cstop offset='0%25' stop-color='${color1}'/%3e%3cstop offset='100%25' stop-color='${color2}'/%3e%3c/radialGradient%3e%3c/defs%3e%3ccircle cx='50' cy='50' r='50' fill='url(%23bg)'/%3e%3ccircle cx='50' cy='37' r='18' fill='%23FFFFFF' opacity='0.9'/%3e%3cpath d='M50 60c-15 0-28 10-30 22 0 3 2 5 5 5h50c3 0 5-2 5-5-2-12-15-22-30-22z' fill='%23FFFFFF' opacity='0.9'/%3e%3c/svg%3e`;
//   };

//   // If user has a profile image from backend, try to load it
//   const getUserImageSrc = () => {
//     if (user?.profileImage) {
//       // Try backend endpoint for user profile images
//       console.log(`👤 Loading user profile image: ${user.profileImage}`);
//       return `${baseUrl}/getFileAsBase64?fileName=${user.profileImage}&folderName=userProfiles`;
//     }
//     if (user?.avatar && user.avatar !== "https://via.placeholder.com/50" && user.avatar !== null) {
//       // Use provided avatar URL if it's not a placeholder
//       console.log(`👤 Using provided avatar URL for: ${user.name}`);
//       return user.avatar;
//     }
//     // Use default vector avatar
//     console.log(`👤 Using default avatar for: ${user?.name || 'Unknown'}`);
//     return getDefaultUserAvatar(user?.name);
//   };

//   return (
//     <img
//       src={getUserImageSrc()}
//       alt={user?.name || "User"}
//       className={`${sizes[size]} rounded-full object-cover ${className}`}
//       onError={(e) => {
//         // Fallback to default avatar if loading fails
//         e.target.src = getDefaultUserAvatar(user?.name);
//       }}
//     />
//   );
// };

// const BookDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const baseUrl = 'http://localhost:9090';
  
//   // Placeholder for images (same as other pages)
//   const placeholder = "data:image/svg+xml,%3csvg width='150' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='200' fill='%236B7280'/%3e%3ctext x='75' y='100' text-anchor='middle' fill='%23FFFFFF' font-size='14'%3eNo Image%3c/text%3e%3c/svg%3e";
  
//   const [book, setBook] = useState(null);
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [requestType, setRequestType] = useState("");
//   const [borrowDuration, setBorrowDuration] = useState("14");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showBorrowModal, setShowBorrowModal] = useState(false);
//   const [showExchangeModal, setShowExchangeModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showExchangeBookModal, setShowExchangeBookModal] = useState(false);
//   const [exchangeBook, setExchangeBook] = useState(null);
//   const [paymentType, setPaymentType] = useState("");
//   const [disabledBooks, setDisabledBooks] = useState(new Set());
//   const [myRequests, setMyRequests] = useState([]);
//   const [toast, setToast] = useState(null);

//   // Toast Component
//   const Toast = ({ message, type, onClose }) => {
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         onClose();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }, [onClose]);

//     return (
//       <div
//         className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
//           type === "success"
//             ? "bg-green-500 text-white"
//             : type === "error"
//             ? "bg-red-500 text-white"
//             : "bg-blue-500 text-white"
//         }`}
//       >
//         <div className="flex items-center space-x-2">
//           {type === "success" && <CheckCircle className="w-5 h-5" />}
//           {type === "error" && <XCircle className="w-5 h-5" />}
//           {type === "info" && <AlertCircle className="w-5 h-5" />}
//           <span>{message}</span>
//           <button onClick={onClose} className="ml-2">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Show toast function
//   const showToast = (message, type = "info") => {
//     setToast({ message, type });
//   };

//   // Disable book temporarily
//   const disableBookTemporarily = (bookId) => {
//     setDisabledBooks((prev) => new Set([...prev, bookId]));
//     setTimeout(() => {
//       setDisabledBooks((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(bookId);
//         return newSet;
//       });
//     }, 300000); // 5 minutes
//   };

//   useEffect(() => {
//     // Check if book data is passed through location state
//     if (location.state?.book) {
//       const passedBook = location.state.book;
//       // Enhance the book with additional data for demo purposes
//       const enhancedBook = {
//         ...passedBook,
//         reviews: passedBook.reviews || [
//           {
//             id: 1,
//             user: {
//               name: "Mike Chen",
//               avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40&h=40&fit=crop&crop=face"
//             },
//             rating: 5,
//             comment: "Great condition book! Very responsive owner and smooth transaction. Highly recommend!",
//             timeAgo: "2 days ago"
//           },
//           {
//             id: 2,
//             user: {
//               name: "Emma Wilson",
//               avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=40&h=40&fit=crop&crop=face"
//             },
//             rating: 4,
//             comment: "Perfect copy of this book. Exactly as described and very accommodating with pickup times.",
//             timeAgo: "1 week ago"
//           }
//         ],
//         rating: passedBook.rating || 4.5,
//         totalReviews: passedBook.totalReviews || 12,
//         ratings: passedBook.ratings || {
//           5: 8,
//           4: 2,
//           3: 1,
//           2: 1,
//           1: 0
//         },
//         views: passedBook.views || 1240,
//         wishlistedCount: passedBook.wishlistedCount || 23,
//         recentBids: (passedBook.forBidding || passedBook.forSale) && passedBook.price ? [
//           { amount: passedBook.price - 50, bidder: "John D.", time: "2 hours ago" },
//           { amount: passedBook.price - 100, bidder: "Alice M.", time: "5 hours ago" },
//           { amount: passedBook.price - 150, bidder: "Mike R.", time: "1 day ago" }
//         ] : []
//       };
//       setBook(enhancedBook);
//       setLoading(false);
      
//       // Debug: Log book data to verify image field
//       console.log("📚 BookDetails received book data:", {
//         title: enhancedBook.title,
//         bookImage: enhancedBook.bookImage,
//         hasImage: !!enhancedBook.bookImage
//       });
//     } else {
//       // If no book data is passed, redirect back to browse
//       navigate("/user/browse-books");
//     }
//   }, [id, location.state, navigate]);

//   // Preload book image when book data is available
//   useEffect(() => {
//     const preloadBookImage = async () => {
//       if (book?.bookImage) {
//         const cachedImage = imageCache.get(book.bookImage, 'userBooks');
//         if (!cachedImage) {
//           try {
//             const response = await fetch(`${baseUrl}/getFileAsBase64?fileName=${book.bookImage}&folderName=userBooks`);
//             if (response.ok) {
//               const imageData = await response.text();
//               imageCache.set(book.bookImage, 'userBooks', imageData);
//             }
//           } catch (error) {
//             console.error(`Failed to preload image for ${book.title}:`, error);
//           }
//         }
//       }
//     };

//     preloadBookImage();
//   }, [book]);

//   // Navigation handlers for separate pages
//   const handleBidClick = () => {
//     navigate(`/user/browse-books/bidding/${book.id}`, { 
//       state: { 
//         book,
//         bidHistory: book.recentBids || []
//       } 
//     });
//   };

//   const handleBuyClick = () => {
//     disableBookTemporarily(book.id);
//     navigate(`/user/browse-books/payment/${book.id}`, { 
//       state: { 
//         book, 
//         type: 'purchase'
//       } 
//     });
//   };

//   const handleBorrowRequest = () => {
//     setRequestType("borrow");
//     setShowBorrowModal(true);
//   };

//   const confirmBorrowRequest = () => {
//     disableBookTemporarily(book.id);
//     const newRequest = {
//       id: `req-${Date.now()}`,
//       bookId: book.id,
//       bookTitle: book.title,
//       type: "borrow",
//       status: "pending",
//       requestedAt: new Date().toISOString(),
//       book: book,
//     };
//     setMyRequests((prev) => [...prev, newRequest]);
//     setShowBorrowModal(false);
//     showToast(
//       "Your borrow request has been sent. Wait for approval.",
//       "success"
//     );
//   };

//   const handleExchangeRequest = () => {
//     setRequestType("exchange");
//     setShowExchangeModal(true);
//   };

//   const confirmExchangeRequest = () => {
//     disableBookTemporarily(book.id);
//     const newRequest = {
//       id: `req-${Date.now()}`,
//       bookId: book.id,
//       bookTitle: book.title,
//       type: "exchange",
//       status: "pending",
//       requestedAt: new Date().toISOString(),
//       book: book,
//     };
//     setMyRequests((prev) => [...prev, newRequest]);
//     setShowExchangeModal(false);
//     showToast(
//       "Your exchange request has been sent. Wait for approval.",
//       "success"
//     );
//   };

//   const handleWishlistToggle = () => {
//     setIsWishlisted(!isWishlisted);
//     showToast(
//       isWishlisted
//         ? `"${book.title}" removed from wishlist!`
//         : `"${book.title}" added to wishlist!`,
//       "success"
//     );
//   };

//   const handleBorrowPayment = () => {
//     setPaymentType("borrow");
//     setShowPaymentModal(true);
//   };

//   const handleExchangePayment = () => {
//     setPaymentType("exchange");
//     setShowPaymentModal(true);
//   };

//   const processPayment = () => {
//     const amount = paymentType === "borrow" ? Math.round(book.price * 0.2) + 200 : 200;

//     setMyRequests((prev) =>
//       prev.map((req) =>
//         req.bookId === book.id ? { ...req, status: "completed" } : req
//       )
//     );

//     setShowPaymentModal(false);
//     showToast(
//       `Payment of Rs. ${amount} successful! ${
//         paymentType === "borrow"
//           ? "Book will be delivered soon."
//           : "Exchange completed successfully."
//       }`,
//       "success"
//     );
//   };

//   const showExchangeBookSelection = () => {
//     // Mock exchange book
//     const mockExchangeBook = {
//       id: "exchange-book-1",
//       title: "The Great Gatsby",
//       author: "F. Scott Fitzgerald",
//       condition: "Good",
//       cover: placeholder,
//       bookImage: null, // No image for mock exchange book
//     };
//     setExchangeBook(mockExchangeBook);
//     setShowExchangeBookModal(true);
//   };

//   const acceptExchangeBook = () => {
//     setShowExchangeBookModal(false);
//     handleExchangePayment();
//   };

//   const rejectExchangeBook = () => {
//     setMyRequests((prev) =>
//       prev.map((req) =>
//         req.bookId === book.id ? { ...req, status: "rejected" } : req
//       )
//     );
//     setShowExchangeBookModal(false);
//     showToast("Exchange rejected. Request has been cancelled.", "info");
//   };

//   const handleContactSubmit = () => {
//     if (!requestType || !message) return;
//     console.log(`Contact request: ${requestType} for ${book.title} - ${message}`);
//     showToast(`Your ${requestType} request has been sent to ${book.owner.name}`, "success");
//     setShowContactModal(false);
//     setMessage("");
//     setRequestType("");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">Loading book details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600 mb-4">Book not found</p>
//           <Button
//             variant="primary"
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
//             onClick={() => navigate("/user/browse-books")}
//             icon={<ArrowLeft className="w-4 h-4" />}
//           >
//             Back to Books
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const isDisabled = disabledBooks.has(book.id);

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) => (
//       <Star 
//         key={i} 
//         className={`w-4 h-4 ${
//           i < Math.floor(rating) 
//             ? "text-yellow-400 fill-current" 
//             : "text-gray-300"
//         }`} 
//       />
//     ));
//   };

//   const renderRatingBars = () => {
//     if (!book.ratings) return null;
    
//     const totalRatings = Object.values(book.ratings).reduce((sum, count) => sum + count, 0);
    
//     return [5, 4, 3, 2, 1].map(rating => {
//       const count = book.ratings[rating] || 0;
//       const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
      
//       return (
//         <div key={rating} className="flex items-center gap-2 text-sm">
//           <span className="w-2">{rating}</span>
//           <div className="flex-1 bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-yellow-400 h-2 rounded-full" 
//               style={{ width: `${percentage}%` }}
//             ></div>
//           </div>
//           <span className="w-4 text-gray-600">{count}</span>
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
//         {/* Toast */}
//         {toast && (
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}

//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Book Details</h1>
//               <p className="text-gray-600">Explore and interact with this book</p>
//             </div>
//             <Button
//               variant="outline"
//               className="border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
//               onClick={() => navigate("/user/browse-books")}
//               icon={<ArrowLeft className="w-4 h-4" />}
//             >
//               Back to Books
//             </Button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className={`bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 ${isDisabled ? "opacity-50" : ""}`}>
//           <div className="flex flex-col lg:flex-row gap-6">
//             {/* Left Column - Book Image */}
//             <div className="w-full lg:w-1/3">
//               <div className="relative h-64 md:h-80 overflow-hidden rounded-xl">
//                 {book.bookImage ? (
//                   <LazyImage
//                     src={book.cover || placeholder}
//                     alt={book.title}
//                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                     fileName={book.bookImage}
//                     folderName="userBooks"
//                     baseUrl={baseUrl}
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                     <div className="text-center text-gray-500">
//                       <BookOpen className="w-12 h-12 mx-auto mb-2" />
//                       <div className="text-sm">No Image</div>
//                       <div className="text-xs">{book.title}</div>
//                     </div>
//                   </div>
//                 )}
//                 {isDisabled && (
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="text-white text-center">
//                       <Clock className="w-6 h-6 mx-auto mb-1" />
//                       <span className="text-xs">Processing...</span>
//                     </div>
//                   </div>
//                 )}
//                 <button 
//                   onClick={handleWishlistToggle}
//                   className={`absolute top-3 right-3 p-2 rounded-full transition-colors shadow-lg ${
//                     isWishlisted 
//                       ? "bg-red-100 text-red-500" 
//                       : "bg-white/80 text-gray-500 hover:text-red-500"
//                   }`}
//                   disabled={isDisabled}
//                 >
//                   <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
//                 </button>
                
//                 {/* Availability Badges */}
//                 <div className="absolute top-3 left-3 flex flex-col space-y-1">
//                   {book.forSale && (
//                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
//                       For Sale
//                     </span>
//                   )}
//                   {book.forBidding && (
//                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
//                       For Bidding
//                     </span>
//                   )}
//                   {book.forLend && (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
//                       For Lending
//                     </span>
//                   )}
//                   {book.forExchange && (
//                     <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
//                       For Exchange
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Book Details Table */}
//               <div className="mt-6 space-y-3 text-sm bg-gray-50 rounded-lg p-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Availability</span>
//                   <span className="font-medium text-green-600">
//                     {book.availableFrom ? `Available from ${book.availableFrom}` : 'Available'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Condition</span>
//                   <span className="font-medium">{book.condition}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Views</span>
//                   <span className="font-medium">{book.views || 0}</span>
//                 </div>
                
//                 {book.language && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Language</span>
//                     <span className="font-medium">{book.language}</span>
//                   </div>
//                 )}
//                 {book.publishYear && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Published</span>
//                     <span className="font-medium">{book.publishYear}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Book Owner */}
//               <div className="mt-6 bg-gray-50 rounded-lg p-4">
//                 <h3 className="font-semibold text-gray-900 mb-4">Book Owner</h3>
//                 <div className="flex items-center mb-4">
//                   <UserAvatar 
//                     user={book.owner} 
//                     size="md" 
//                     className="mr-3" 
//                   />
//                   <div>
//                     <div className="flex items-center space-x-2">
//                       <span className="font-medium text-gray-900">{book.owner.name}</span>
//                       <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center">
//                         <Star className="w-3 h-3 mr-1" />
//                         {book.owner.trustScore}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
                
//               </div>
//             </div>

//             {/* Right Column - Book Information */}
//             <div className="w-full lg:w-2/3">
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
//               <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
              
//               {/* Rating */}
//               {book.rating && (
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="flex">
//                     {renderStars(book.rating)}
//                   </div>
//                   <span className="text-lg font-medium text-gray-700">{book.rating}</span>
//                   <span className="text-gray-500">({book.totalReviews || 0} reviews)</span>
//                 </div>
//               )}
              
//               <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

//               {/* Genre Tags */}
//               {book.genre && book.genre.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {book.genre.map((g, idx) => (
//                     <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
//                       #{g}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               {/* Location and Price */}
//               <div className="flex flex-wrap items-center gap-4 mb-6">
//                 <div className="flex items-center text-gray-600">
//                   <MapPin className="w-4 h-4 mr-1" />
//                   <span>{book.location}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Tag className="w-4 h-4 mr-1" />
//                   <span>{book.condition}</span>
//                 </div>
//                 {book.forSale && book.price && (
//                   <div className="text-2xl font-bold text-green-600">Rs. {book.price}</div>
//                 )}
//                 {book.forLend && book.lendingPeriod && (
//                   <div className="text-blue-600 font-semibold">
//                     {book.lendingPeriod} days lending period
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 mb-8">
//                 {book.forSale && (
//                   <Button
//                     variant="primary"
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
//                     onClick={handleBuyClick}
//                     icon={<ShoppingCart className="w-4 h-4" />}
//                     disabled={isDisabled}
//                   >
//                     Buy Now
//                   </Button>
//                 )}
//                 {book.forBidding && (
//                   <Button
//                     variant="primary"
//                     className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
//                     onClick={handleBidClick}
//                     icon={<Gavel className="w-4 h-4" />}
//                     disabled={isDisabled}
//                   >
//                     Place Bid
//                   </Button>
//                 )}
//                 {book.forLend && (
//                   <Button
//                     variant="primary"
//                     className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
//                     onClick={handleBorrowRequest}
//                     icon={<BookOpen className="w-4 h-4" />}
//                     disabled={isDisabled}
//                   >
//                     Request to Borrow
//                   </Button>
//                 )}
//                 {book.forExchange && (
//                   <Button
//                     variant="primary"
//                     className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium"
//                     onClick={handleExchangeRequest}
//                     icon={<Repeat className="w-4 h-4" />}
//                     disabled={isDisabled}
//                   >
//                     Request Exchange
//                   </Button>
//                 )}
//               </div>

//               {/* Additional Book Info */}
//               {(book.isbn || book.publishYear) && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
//                   {book.isbn && (
//                     <div>
//                       <span className="text-gray-500 block text-sm">ISBN</span>
//                       <span className="font-medium text-gray-900">{book.isbn}</span>
//                     </div>
//                   )}
//                   {book.publishYear && (
//                     <div>
//                       <span className="text-gray-500 block text-sm">Published</span>
//                       <span className="font-medium text-gray-900">{book.publishYear}</span>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Recent Bids */}
//               {book.forBidding && book.recentBids && book.recentBids.length > 0 && (
//                 <div className="mb-8">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Bids</h3>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="space-y-3">
//                       {book.recentBids.slice(0, 3).map((bid, idx) => (
//                         <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
//                           <div>
//                             <p className="font-semibold text-gray-900">Rs. {bid.amount}</p>
//                             <p className="text-sm text-gray-600">by {bid.bidder}</p>
//                           </div>
//                           <span className="text-xs text-gray-500">{bid.time}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <Button
//                       variant="outline"
//                       className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
//                       onClick={handleBidClick}
//                       icon={<Eye className="w-4 h-4" />}
//                       disabled={isDisabled}
//                     >
//                       View All Bids & Place Bid
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* Reviews Section */}
//               {book.reviews && book.reviews.length > 0 && (
//                 <div className="border-t border-gray-200 pt-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-xl font-semibold text-gray-900">Reviews & Ratings</h3>
//                     <Button
//                       variant="primary"
//                       className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                     >
//                       Write Review
//                     </Button>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                     {/* Rating Summary */}
//                     <div>
//                       <div className="flex items-center gap-4 mb-4">
//                         <span className="text-4xl font-bold text-gray-900">{book.rating}</span>
//                         <div>
//                           <div className="flex items-center gap-1 mb-1">
//                             {renderStars(book.rating)}
//                           </div>
//                           <p className="text-sm text-gray-600">{book.totalReviews} reviews</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Rating Breakdown */}
//                     {book.ratings && (
//                       <div className="space-y-2">
//                         {renderRatingBars()}
//                       </div>
//                     )}
//                   </div>

//                   {/* Individual Reviews */}
//                   <div className="space-y-6">
//                     {book.reviews.map((review) => (
//                       <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
//                         <div className="flex items-start gap-4">
//                           <UserAvatar 
//                             user={review.user} 
//                             size="lg" 
//                             className="flex-shrink-0" 
//                           />
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                               <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
//                               <div className="flex items-center gap-1">
//                                 {renderStars(review.rating)}
//                               </div>
//                               <span className="text-sm text-gray-500">{review.timeAgo}</span>
//                             </div>
//                             <p className="text-gray-700 leading-relaxed">{review.comment}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Contact Modal */}
//         {showContactModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold text-gray-900">Contact Owner</h3>
//                 <button 
//                   onClick={() => setShowContactModal(false)} 
//                   className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <p className="text-sm text-gray-600">Book: <span className="font-medium text-gray-900">{book.title}</span></p>
//                   <p className="text-sm text-gray-600">Owner: <span className="font-medium text-gray-900">{book.owner.name}</span></p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
//                   <select
//                     value={requestType}
//                     onChange={(e) => setRequestType(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                   >
//                     <option value="">Select request type</option>
//                     {book.forSale && <option value="purchase">Purchase the book</option>}
//                     {book.forBidding && <option value="bid">Place a bid</option>}
//                     {book.forLend && <option value="borrow">Borrow the book</option>}
//                     {book.forExchange && <option value="exchange">Exchange the book</option>}
//                     <option value="question">Ask a question</option>
//                   </select>
//                 </div>

//                 {requestType === "borrow" && book.lendingPeriod && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Borrow Duration</label>
//                     <select
//                       value={borrowDuration}
//                       onChange={(e) => setBorrowDuration(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                     >
//                       <option value="7">1 week</option>
//                       <option value="14">2 weeks</option>
//                       <option value={book.lendingPeriod}>Owner's preferred duration ({book.lendingPeriod} days)</option>
//                     </select>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
//                   <textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                     rows="4"
//                     placeholder="Write your message to the book owner..."
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex space-x-3 mt-6">
//                 <Button
//                   variant="outline"
//                   className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-100"
//                   onClick={() => setShowContactModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
//                   onClick={handleContactSubmit}
//                   disabled={!requestType || !message}
//                   icon={<ArrowRight className="w-4 h-4" />}
//                 >
//                   Send Request
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Borrow Confirmation Modal */}
//         {showBorrowModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
//             <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h3
//                   className="text-xl font-bold"
//                   style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//                 >
//                   Confirm Borrow Request
//                 </h3>
//                 <button
//                   onClick={() => setShowBorrowModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="mb-6">
//                 <p className="text-gray-600 mb-2">
//                   Are you sure you want to send a borrow request for:
//                 </p>
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <h4 className="font-semibold">{book.title}</h4>
//                   <p className="text-sm text-gray-600">{book.author}</p>
//                   <p className="text-sm text-gray-600">Owner: {book.owner.name}</p>
//                   <p className="text-sm text-gray-600">Borrowing Price: Rs. {book?.price*0.2}</p>
//                   <p className="text-sm text-gray-600">Delivery Price: Rs. 200</p>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowBorrowModal(false)}
//                   className="border-gray-200 text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={confirmBorrowRequest}
//                   className="bg-green-500 hover:bg-green-600 text-white"
//                 >
//                   Confirm Borrow Request
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Exchange Confirmation Modal */}
//         {showExchangeModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
//             <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h3
//                   className="text-xl font-bold"
//                   style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//                 >
//                   Confirm Exchange Request
//                 </h3>
//                 <button
//                   onClick={() => setShowExchangeModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="mb-6">
//                 <p className="text-gray-600 mb-2">
//                   Are you sure you want to send an exchange request for:
//                 </p>
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <h4 className="font-semibold">{book.title}</h4>
//                   <p className="text-sm text-gray-600">{book.author}</p>
//                   <p className="text-sm text-gray-600">Owner: {book.owner.name}</p>
//                   <p className="text-sm text-gray-600">Delivery Price: Rs. 200</p>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowExchangeModal(false)}
//                   className="border-gray-200 text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={confirmExchangeRequest}
//                   className="bg-purple-500 hover:bg-purple-600 text-white"
//                 >
//                   Confirm Exchange Request
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Payment Modal */}
//         {showPaymentModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
//             <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h3
//                   className="text-xl font-bold"
//                   style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//                 >
//                   Payment Details
//                 </h3>
//                 <button
//                   onClick={() => setShowPaymentModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="mb-6">
//                 <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                   <h4 className="font-semibold mb-2">{book.title}</h4>
//                   <div className="space-y-2 text-sm">
//                     {paymentType === "borrow" && (
//                       <>
//                         <div className="flex justify-between">
//                           <span>Book Price:</span>
//                           <span>Rs. {book.price}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Borrow Fee (20%):</span>
//                           <span>Rs. {Math.round(book.price * 0.2)}</span>
//                         </div>
//                       </>
//                     )}
//                     <div className="flex justify-between">
//                       <span>Delivery Fee:</span>
//                       <span>Rs. 200</span>
//                     </div>
//                     <div className="border-t pt-2 flex justify-between font-semibold">
//                       <span>Total Amount:</span>
//                       <span>
//                         Rs. {paymentType === "borrow" ? Math.round(book.price * 0.2) + 200 : 200}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Card Number
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="1234 5678 9012 3456"
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Expiry Date
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         CVV
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="123"
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowPaymentModal(false)}
//                   className="border-gray-200 text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={processPayment}
//                   className="bg-blue-500 hover:bg-blue-600 text-white"
//                 >
//                   Pay Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Exchange Book Selection Modal */}
//         {showExchangeBookModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
//             <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h3
//                   className="text-xl font-bold"
//                   style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
//                 >
//                   Exchange Book Offer
//                 </h3>
//                 <button
//                   onClick={() => setShowExchangeBookModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//               <div className="mb-6">
//                 <p className="text-gray-600 mb-4">
//                   The owner has offered this book for exchange:
//                 </p>
//                 <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
//                   {exchangeBook?.bookImage ? (
//                     <LazyImage
//                       src={exchangeBook?.cover || placeholder}
//                       alt={exchangeBook?.title}
//                       className="w-16 h-20 object-cover rounded"
//                       fileName={exchangeBook.bookImage}
//                       folderName="userBooks"
//                       baseUrl={baseUrl}
//                     />
//                   ) : (
//                     <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded">
//                       <BookOpen className="w-4 h-4 text-gray-400" />
//                     </div>
//                   )}
//                   <div>
//                     <h4 className="font-semibold">{exchangeBook?.title}</h4>
//                     <p className="text-sm text-gray-600">{exchangeBook?.author}</p>
//                     <p className="text-sm text-gray-600">Condition: {exchangeBook?.condition}</p>
//                     <p className="text-sm text-gray-600">Delivery Price: Rs. 200</p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-3">
//                   Do you want to proceed with this exchange?
//                 </p>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <Button
//                   variant="outline"
//                   onClick={rejectExchangeBook}
//                   className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
//                 >
//                   Reject Exchange
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={acceptExchangeBook}
//                   className="bg-green-500 hover:bg-green-600 text-white"
//                 >
//                   Accept & Pay Delivery (Rs. 200)
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookDetailsPage;