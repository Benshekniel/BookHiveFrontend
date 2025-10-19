"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  MapPin,
  BookOpen,
  Tag,
  ArrowDownUp,
  Heart,
  MessageSquare,
  Repeat,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../components/AuthContext";
import Button from "../../components/shared/Button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LazyImage from "../../components/LazyImage";
import imageCache from "../../utils/imageCache";

// Fix missing marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Placeholder for images
const placeholder = "data:image/svg+xml,%3csvg width='150' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='200' fill='%236B7280'/%3e%3ctext x='75' y='100' text-anchor='middle' fill='%23FFFFFF' font-size='14'%3eNo Image%3c/text%3e%3c/svg%3e";

const baseUrl = 'http://localhost:9090';

// Levenshtein distance function for fuzzy matching
function levenshteinDistance(a, b) {
  a = a.replace(/\s/g, "").toLowerCase();
  b = b.replace(/\s/g, "").toLowerCase();
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === "success"
          ? "bg-green-500 text-white"
          : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
      }`}
    >
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

// UserAvatar component for consistent user image handling
const UserAvatar = ({ user, size = "md", className = "" }) => {
  // Size configurations
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };
  
  // Generate colored avatar based on user name for visual distinction
  const getDefaultUserAvatar = (userName) => {
    const colors = [
      ['%237C3AED', '%234C1D95'], // Purple
      ['%2306B6D4', '%230891B2'], // Cyan
      ['%2310B981', '%23059669'], // Emerald
      ['%23F59E0B', '%23D97706'], // Amber
      ['%23EF4444', '%23DC2626'], // Red
      ['%238B5CF6', '%237C3AED'], // Violet
    ];
    
    // Simple hash function to get consistent color for user
    const hash = (userName || 'User').split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colorIndex = Math.abs(hash) % colors.length;
    const [color1, color2] = colors[colorIndex];
    
    return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cradialGradient id='bg' cx='50%25' cy='30%25'%3e%3cstop offset='0%25' stop-color='${color1}'/%3e%3cstop offset='100%25' stop-color='${color2}'/%3e%3c/radialGradient%3e%3c/defs%3e%3ccircle cx='50' cy='50' r='50' fill='url(%23bg)'/%3e%3ccircle cx='50' cy='37' r='18' fill='%23FFFFFF' opacity='0.9'/%3e%3cpath d='M50 60c-15 0-28 10-30 22 0 3 2 5 5 5h50c3 0 5-2 5-5-2-12-15-22-30-22z' fill='%23FFFFFF' opacity='0.9'/%3e%3c/svg%3e`;
  };

  // If user has a profile image from backend, try to load it
  const getUserImageSrc = () => {
    if (user?.profileImage) {
      // Try backend endpoint for user profile images
      return `${baseUrl}/getFileAsBase64?fileName=${user.profileImage}&folderName=userProfiles`;
    }
    if (user?.avatar && user.avatar !== "https://via.placeholder.com/50" && user.avatar !== null) {
      // Use provided avatar URL if it's not a placeholder
      return user.avatar;
    }
    // Use default vector avatar (will be used most of the time)
    return getDefaultUserAvatar(user?.name);
  };

  return (
    <img
      src={getUserImageSrc()}
      alt={user?.name || "User"}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
      onError={(e) => {
        // Fallback to default avatar if loading fails
        e.target.src = getDefaultUserAvatar(user?.name);
      }}
    />
  );
};

const BooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [wishlistedBooks, setWishlistedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [wishlistSearchQuery, setWishlistSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showWishlistAddModal, setShowWishlistAddModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [forLending, setForLending] = useState(null);
  const [forSale, setForSale] = useState(null);
  const [forExchange, setForExchange] = useState(null);
  const [forBidding, setForBidding] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [newWishlistBook, setNewWishlistBook] = useState({
    title: "",
    hashtags: "",
  });
  const [activeTab, setActiveTab] = useState("browse");
  const [aiRecommendations, setAIRecommendations] = useState([]);

  // New states for enhanced functionality
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [disabledBooks, setDisabledBooks] = useState(new Set());
  const [myRequests, setMyRequests] = useState([
    // Pre-approved borrow request (mock, map to real book if exists)
    {
      id: "req-approved-borrow-1",
      bookId: "1",
      bookTitle: "To Kill a Mockingbird",
      type: "borrow",
      status: "approved",
      requestedAt: "2025-01-20T10:00:00.000Z",
      book: {
        id: "1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 1500,
        cover: placeholder,
        owner: { name: "John Smith" },
      },
    },
    // Pre-approved exchange request
    {
      id: "req-approved-exchange-1",
      bookId: "2",
      bookTitle: "The Great Gatsby",
      type: "exchange",
      status: "approved",
      requestedAt: "2025-01-20T11:00:00.000Z",
      book: {
        id: "2",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 1200,
        cover: placeholder,
        owner: { name: "Jane Doe" },
      },
    },
  ]);
  const [toast, setToast] = useState(null);
  const [paymentType, setPaymentType] = useState(""); // 'borrow' or 'exchange'
  const [exchangeBook, setExchangeBook] = useState(null);
  const [showExchangeBookModal, setShowExchangeBookModal] = useState(false);

  const navigate = useNavigate();

  // Preload images for better performance (same as BookListing)
  const preloadImages = useCallback(async (books) => {
    const preloadPromises = books
      .filter(book => book.bookImage)
      .map(async (book) => {
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
      });
    
    await Promise.allSettled(preloadPromises);
  }, []);

  const allGenres = Array.from(
    new Set((books || []).flatMap((book) => book.genre))
  ).sort();
  const allConditions = Array.from(
    new Set((books || []).map((book) => book.condition))
  );

  // Mock coordinates for book locations based on filtered books
  const bookLocations = filteredBooks.map((book) => ({
    id: book.id,
    title: book.title,
    location: book.location,
    lat: 6.9271 + (Math.random() - 0.5) * 0.05,
    lng: 79.8612 + (Math.random() - 0.5) * 0.05,
  }));

  // User's location (mocked as Colombo)
  const userPosition = [6.9271, 79.8612];

  // Show toast function
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Disable book temporarily
  const disableBookTemporarily = (bookId) => {
    setDisabledBooks((prev) => new Set([...prev, bookId]));
    setTimeout(() => {
      setDisabledBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }, 300000); // 5 minutes
  };

  // Fetch books from backend
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/getBooks`, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Show all books (not filtered by user like in BookListing page)
      const mappedBooks = response.data.map((book, index) => ({
        id: book.bookId || Date.now() + index,
        bookId: book.bookId || Date.now() + index,
        title: book.title || '',
        author: book.authors ? book.authors.join(', ') : '',
        authors: book.authors || [],
        genre: book.genres || [],
        genres: book.genres || [],
        condition: book.condition || 'New',
        forSale: book.forSale || false,
        price: book.price || 0,
        forLend: book.forLend || false,
        lendingAmount: book.lendingAmount || 0,
        lendingPeriod: book.lendingPeriod || '',
        forExchange: book.forExchange || false,
        exchangePeriod: book.exchangePeriod || '',
        forBidding: book.forBidding || false,
        initialBidPrice: book.initialBidPrice || 0,
        biddingStartDate: book.biddingStartDate || '',
        biddingEndDate: book.biddingEndDate || '',
        description: book.description || '',
        location: book.location || '',
        publishYear: book.publishYear || '',
        isbn: book.isbn || '',
        language: book.language || 'English',
        hashtags: book.hashtags || [],
        createdAt: book.createdAt || new Date().toISOString(),
        updatedAt: book.updatedAt || new Date().toISOString(),
        wishlistedCount: book.wishlistedBy || 0,
        views: book.views || 0,
        owner: {
          name: book.userEmail?.split('@')[0] || 'Anonymous User',
          email: book.userEmail || '',
          avatar: book.userAvatar || null, // Backend might provide user avatar
          profileImage: book.userProfileImage || null, // Backend might provide user profile image filename
          trustScore: book.trustScore || 4.5,
        },
        cover: placeholder,
        bookImage: book.bookImage || null,
        reviews: book.reviews || 0,
        rating: book.rating || 0,
        status: book.status || 'active',
        userEmail: book.userEmail || '',
      }));

      // Filter out inactive books
      const activeBooks = mappedBooks.filter(book => book.status === 'active');
      
      setBooks(activeBooks);
      setFilteredBooks(activeBooks);
      console.log(`✅ Successfully fetched ${activeBooks.length} books`);
      
      // Preload images after a short delay (same as BookListing)
      setTimeout(() => {
        preloadImages(activeBooks);
      }, 1000);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      showToast("Failed to load books. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [preloadImages]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Clear cache when user logs out (same as BookListing)
  useEffect(() => {
    if (!user) {
      imageCache.clear();
    }
  }, [user]);

  const applyFilters = useCallback(() => {
    let result = [...(books || [])];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query) ||
          book.genre?.some((g) => g.toLowerCase().includes(query)) ||
          book.location?.toLowerCase().includes(query)
      );
    }
    if (selectedGenres.length > 0) {
      result = result.filter((book) =>
        book.genre?.some((genre) => selectedGenres.includes(genre))
      );
    }
    if (selectedConditions.length > 0) {
      result = result.filter((book) =>
        selectedConditions.includes(book.condition)
      );
    }
    if (forLending !== null) {
      result = result.filter((book) => book.forLend === forLending);
    }
    if (forSale !== null) {
      result = result.filter((book) => book.forSale === forSale);
    }
    if (forExchange !== null) {
      result = result.filter((book) => book.forExchange === forExchange);
    }
    if (forBidding !== null) {
      result = result.filter((book) => book.forBidding === forBidding);
    }
    if (priceRange.min || priceRange.max) {
      result = result.filter((book) => {
        if (!book.forSale) return true;
        const price = book.price;
        const min = priceRange.min ? Number.parseInt(priceRange.min) : 0;
        const max = priceRange.max
          ? Number.parseInt(priceRange.max)
          : Number.POSITIVE_INFINITY;
        return price >= min && price <= max;
      });
    }
    if (nearbyOnly) {
      const userLocation = "Colombo";
      result = result.filter((book) =>
        book.location?.toLowerCase().includes(userLocation.toLowerCase())
      );
    }
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "popular":
        result.sort(
          (a, b) => (b.wishlistedCount || 0) - (a.wishlistedCount || 0)
        );
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    setFilteredBooks(result);
  }, [
    books,
    searchQuery,
    selectedGenres,
    selectedConditions,
    forLending,
    forSale,
    forExchange,
    forBidding,
    priceRange,
    nearbyOnly,
    sortBy,
  ]);

  const applyAIRecommendations = useCallback(() => {
    let result = [...(books || [])];
    if (aiSearchQuery) {
      const query = aiSearchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query) ||
          book.genre?.some((g) => g.toLowerCase().includes(query))
      );
      if (result.length === 0) {
        // Fuzzy search if no exact matches
        const queryLower = aiSearchQuery.toLowerCase();
        result = books
          .map((book) => ({
            book,
            score: levenshteinDistance(book.title, queryLower),
          }))
          .filter((s) => s.score < 5) // Arbitrary threshold for similarity
          .sort((a, b) => a.score - b.score)
          .map((s) => s.book)
          .slice(0, 4);
      } else {
        result = result.slice(0, 4);
      }
    } else {
      result = [...books]
        .sort((a, b) => (b.wishlistedCount || 0) - (a.wishlistedCount || 0))
        .slice(0, 4);
    }
    setAIRecommendations(result);
  }, [books, aiSearchQuery]);

  useEffect(() => {
    applyFilters();
    applyAIRecommendations();
  }, [applyFilters, applyAIRecommendations]);

  const handleWishlistSearch = () => {
    const query = wishlistSearchQuery.toLowerCase();
    const bookExists = (books || []).find(
      (book) => book.title?.toLowerCase() === query
    );
    if (!bookExists) {
      setNewWishlistBook({ title: wishlistSearchQuery, hashtags: "" });
      setShowWishlistAddModal(true);
    } else {
      showToast(
        `Book "${wishlistSearchQuery}" is available in the browse section!`,
        "info"
      );
    }
  };

  const handleAddToWishlist = () => {
    if (newWishlistBook.title) {
      setWishlistedBooks((prev) => [
        ...prev,
        {
          id: `wishlist-${prev.length + 1}`,
          title: newWishlistBook.title,
          hashtags: newWishlistBook.hashtags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          available: false,
          addedAt: new Date().toISOString(),
        },
      ]);
      setShowWishlistAddModal(false);
      setWishlistSearchQuery("");
      setNewWishlistBook({ title: "", hashtags: "" });
      showToast(
        `"${newWishlistBook.title}" has been added to your wishlist!`,
        "success"
      );
    }
  };

  const handleToggleFavorite = (book) => {
    setFavoriteBooks((prev) => {
      const isFavorited = prev.find((b) => b.id === book.id);
      if (isFavorited) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [...prev, { ...book, addedAt: new Date().toISOString() }];
      }
    });
  };

  const handleRemoveFromWishlist = (bookId) => {
    setWishlistedBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleRemoveFromFavorites = (bookId) => {
    setFavoriteBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  // Enhanced borrow handler
  const handleBorrowRequest = (book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const confirmBorrowRequest = () => {
    disableBookTemporarily(selectedBook.id);
    const newRequest = {
      id: `req-${Date.now()}`,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      type: "borrow",
      status: "pending",
      requestedAt: new Date().toISOString(),
      book: selectedBook,
    };
    setMyRequests((prev) => [...prev, newRequest]);
    setShowBorrowModal(false);
    showToast(
      "Your borrow request has been sent. Wait for approval.",
      "success"
    );
  };

  // Enhanced exchange handler
  const handleExchangeRequest = (book) => {
    setSelectedBook(book);
    setShowExchangeModal(true);
  };

  const confirmExchangeRequest = () => {
    disableBookTemporarily(selectedBook.id);
    const newRequest = {
      id: `req-${Date.now()}`,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      type: "exchange",
      status: "pending",
      requestedAt: new Date().toISOString(),
      book: selectedBook,
    };
    setMyRequests((prev) => [...prev, newRequest]);
    setShowExchangeModal(false);
    showToast(
      "Your exchange request has been sent. Wait for approval.",
      "success"
    );
  };

  const handleBidConfirm = (book) => {
    disableBookTemporarily(book.id);
    showToast(
      `Your bid request for "${book.title}" was successfully sent to the owner.`,
      "success"
    );
    navigate(`bidding/${book.id}`, { state: { book } });
  };

  // Handle buy now
  const handleBuyNow = (book) => {
    disableBookTemporarily(book.id);
    navigate(`payment/${book.id}`, { state: { book } });
  };

  // Approve request (mock function - in real app this would be done by book owner)
  const approveRequest = (requestId) => {
    setMyRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
    showToast("Request approved! You can now proceed with payment.", "success");
  };

  // Handle payment for borrow
  const handleBorrowPayment = (request) => {
    setSelectedBook(request.book);
    setPaymentType("borrow");
    setShowPaymentModal(true);
  };

  // Handle payment for exchange
  const handleExchangePayment = (request) => {
    setSelectedBook(request.book);
    setPaymentType("exchange");
    setShowPaymentModal(true);
  };

  // Process payment
  const processPayment = () => {
    const amount =
      paymentType === "borrow"
        ? Math.round(selectedBook.price * 0.2) + 200
        : 200;

    setMyRequests((prev) =>
      prev.map((req) =>
        req.bookId === selectedBook.id ? { ...req, status: "completed" } : req
      )
    );

    setShowPaymentModal(false);
    showToast(
      `Payment of Rs. ${amount} successful! ${
        paymentType === "borrow"
          ? "Book will be delivered soon."
          : "Exchange completed successfully."
      }`,
      "success"
    );
  };

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Example user icon
    iconSize: [40, 40], // adjust size
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Show exchange book selection
  const showExchangeBookSelection = (request) => {
    // Mock exchange book - in real app this would come from the exchanger
    const mockExchangeBook = {
      id: "exchange-book-1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      condition: "Good",
      cover: placeholder,
    };
    setExchangeBook(mockExchangeBook);
    setSelectedBook(request.book);
    setShowExchangeBookModal(true);
  };

  // Accept exchange book
  const acceptExchangeBook = () => {
    setShowExchangeBookModal(false);
    handleExchangePayment({ book: selectedBook });
  };

  // Reject exchange book
  const rejectExchangeBook = () => {
    setMyRequests((prev) =>
      prev.map((req) =>
        req.bookId === selectedBook.id ? { ...req, status: "rejected" } : req
      )
    );
    setShowExchangeBookModal(false);
    showToast("Exchange rejected. Request has been cancelled.", "info");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedConditions([]);
    setForLending(null);
    setForSale(null);
    setForExchange(null);
    setForBidding(null);
    setPriceRange({ min: "", max: "" });
    setNearbyOnly(false);
    setSortBy("newest");
  };

  const activeFiltersCount =
    selectedGenres.length +
    selectedConditions.length +
    (forLending !== null ? 1 : 0) +
    (forSale !== null ? 1 : 0) +
    (forExchange !== null ? 1 : 0) +
    (forBidding !== null ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (nearbyOnly ? 1 : 0);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-white"
      style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {loading || books.length === 0 ? (
          <div className="text-center py-12 bg-white/90 rounded-2xl shadow-md border border-gray-200">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
            >
              {loading ? "Loading books..." : "No books available"}
            </h3>
            <p className="text-gray-600 text-sm">
              {loading ? "Fetching books from the library. Please wait." : "Check back later for new listings."}
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  className={`pb-2 px-4 ${
                    activeTab === "browse"
                      ? "border-b-2 border-yellow-500 text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("browse")}
                >
                  Browse Books
                </button>
                <button
                  className={`pb-2 px-4 ${
                    activeTab === "wishlist"
                      ? "border-b-2 border-yellow-500 text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  Wishlisted Books
                </button>
                <button
                  className={`pb-2 px-4 ${
                    activeTab === "favorites"
                      ? "border-b-2 border-yellow-500 text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("favorites")}
                >
                  Favorites
                </button>
                <button
                  className={`pb-2 px-4 ${
                    activeTab === "requests"
                      ? "border-b-2 border-yellow-500 text-yellow-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("requests")}
                >
                  My Requests ({myRequests.length})
                </button>
              </div>
            </div>

            {/* Browse Tab */}
            {activeTab === "browse" && (
              <div className="space-y-6">
                {/* Filters, Books List, and Map Section */}
                <div className="bg-white/90 rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2
                      className="text-xl sm:text-2xl font-bold text-gray-900"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      Browse Books
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/book-circles")}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
                    >
                      Go to Book Circles
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search books, authors, genres, locations..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors duration-200 ${
                        showFilters ? "bg-blue-600" : ""
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <span className="bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setNearbyOnly(!nearbyOnly)}
                      className={`px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors duration-200 ${
                        nearbyOnly
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Near Me</span>
                    </button>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <option value="newest">Newest First</option>
                      <option value="popular">Most Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center text-sm">
                            <BookOpen className="w-4 h-4 text-gray-600 mr-1" />{" "}
                            Genres
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {allGenres.map((genre) => (
                              <button
                                key={genre}
                                className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                                  selectedGenres.includes(genre)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() =>
                                  setSelectedGenres((prev) =>
                                    prev.includes(genre)
                                      ? prev.filter((g) => g !== genre)
                                      : [...prev, genre]
                                  )
                                }
                              >
                                {genre}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center text-sm">
                            <Tag className="w-4 h-4 text-gray-600 mr-1" />{" "}
                            Condition
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {allConditions.map((condition) => (
                              <button
                                key={condition}
                                className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                                  selectedConditions.includes(condition)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() =>
                                  setSelectedConditions((prev) =>
                                    prev.includes(condition)
                                      ? prev.filter((c) => c !== condition)
                                      : [...prev, condition]
                                  )
                                }
                              >
                                {condition}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center text-sm">
                            <ArrowDownUp className="w-4 h-4 text-gray-600 mr-1" />{" "}
                            Availability
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                                forLending === true
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                setForLending(forLending === true ? null : true)
                              }
                            >
                              For Lending
                            </button>
                            <button
                              className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                                forSale === true
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                setForSale(forSale === true ? null : true)
                              }
                            >
                              For Sale
                            </button>
                            <button
                              className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                                forExchange === true
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                setForExchange(
                                  forExchange === true ? null : true
                                )
                              }
                            >
                              For Exchange
                            </button>
                            <button
                              className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                                forBidding === true
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                setForBidding(forBidding === true ? null : true)
                              }
                            >
                              For Bidding
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">
                            Price Range (Rs.)
                          </h3>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={priceRange.min}
                              onChange={(e) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs"
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              value={priceRange.max}
                              onChange={(e) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: e.target.value,
                                }))
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                      {activeFiltersCount > 0 && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={clearAllFilters}
                            className="text-xs text-gray-600 hover:text-gray-800 underline font-medium"
                          >
                            Clear all filters ({activeFiltersCount})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Books List and Map Side by Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                      {/* Books List */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2
                          className="text-lg sm:text-xl font-semibold text-gray-900"
                          style={{
                            fontFamily: "'Poppins', system-ui, sans-serif",
                          }}
                        >
                          {filteredBooks.length} Books Found
                        </h2>
                        {nearbyOnly && (
                          <div className="flex items-center text-sm text-gray-600 mt-2 sm:mt-0">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>Showing books near you</span>
                          </div>
                        )}
                      </div>
                      {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredBooks.map((book) => {
                            const isDisabled = disabledBooks.has(book.id);
                            return (
                              <div
                                key={book.id}
                                className={`bg-white/90 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${
                                  isDisabled ? "opacity-50" : ""
                                }`}
                              >
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                  {book.bookImage ? (
                                    <LazyImage
                                      src={book.cover}
                                      alt={book.title}
                                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                      fileName={book.bookImage}
                                      folderName="userBooks"
                                      baseUrl={baseUrl}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <div className="text-center text-gray-500">
                                        <div className="text-xs">No Image</div>
                                        <div className="text-xs">{book.title}</div>
                                      </div>
                                    </div>
                                  )}
                                  {isDisabled && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                      <div className="text-white text-center">
                                        <Clock className="w-6 h-6 mx-auto mb-1" />
                                        <span className="text-xs">
                                          Processing...
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleToggleFavorite(book)}
                                    className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors shadow-sm ${
                                      favoriteBooks.find(
                                        (b) => b.id === book.id
                                      )
                                        ? "bg-red-100 text-red-500"
                                        : "bg-white/80 text-gray-500 hover:text-red-500"
                                    }`}
                                    disabled={isDisabled}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                  {(book.forSale ||
                                    book.forLend ||
                                    book.forExchange ||
                                    book.forBidding) && (
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
                                      {book.forSale && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                          For Sale
                                        </span>
                                      )}
                                      {book.forLend && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                          For Lending
                                        </span>
                                      )}
                                      {book.forExchange && (
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                          For Exchange
                                        </span>
                                      )}
                                      {book.forBidding && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                          For Bidding
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                                        {book.title}
                                      </h3>
                                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                        {book.author}
                                      </p>
                                    </div>
                                    {book.forSale && (
                                      <div className="text-green-600 font-semibold text-sm">
                                        Rs. {book.price}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500 space-x-2">
                                    <div className="flex items-center">
                                      <MapPin className="w-3 h-3 mr-0.5" />
                                      <span>{book.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Tag className="w-3 h-3 mr-0.5" />
                                      <span>{book.condition}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs flex items-center">
                                      <UserAvatar 
                                        user={book.owner} 
                                        size="xs" 
                                        className="mr-1" 
                                      />
                                      <span className="text-gray-600">
                                        {book.owner?.name || "Unknown"}
                                      </span>
                                      <span className="ml-1 bg-blue-100 text-blue-800 px-1 rounded text-xs">
                                        {book.owner?.trustScore || "N/A"}★
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-2 flex flex-col space-y-1">
                                    <div className="flex space-x-1">
                                      <Link
                                        to={`book-details/${book.id}`}
                                        state={{ book }}
                                        className="w-full inline-flex justify-center items-center px-2 py-1 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
                                      >
                                        View Details
                                      </Link>
                                      {book.forLend && (
                                        <Button
                                          variant="secondary"
                                          size="sm"
                                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                                          onClick={() =>
                                            handleBorrowRequest(book)
                                          }
                                          disabled={isDisabled}
                                        >
                                          Borrow
                                        </Button>
                                      )}
                                    </div>
                                    {(book.forSale ||
                                      book.forExchange ||
                                      book.forBidding) && (
                                      <div className="flex space-x-1">
                                        {book.forSale && (
                                          <Button
                                            variant="primary"
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                                            onClick={() => handleBuyNow(book)}
                                            disabled={isDisabled}
                                          >
                                            Buy Now
                                          </Button>
                                        )}
                                        {book.forExchange && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1 bg-transparent"
                                            icon={
                                              <Repeat className="w-3 h-3" />
                                            }
                                            onClick={() =>
                                              handleExchangeRequest(book)
                                            }
                                            disabled={isDisabled}
                                          >
                                            Exchange
                                          </Button>
                                        )}
                                        {book.forBidding && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1 bg-transparent"
                                            onClick={() =>
                                              handleBidConfirm(book)
                                            }
                                            disabled={isDisabled}
                                          >
                                            Bid
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-white/90 rounded-lg shadow-md border border-gray-200">
                          <BookOpen
                            size={40}
                            className="mx-auto mb-3 text-gray-300"
                          />
                          <h3
                            className="text-lg font-semibold text-gray-900"
                            style={{
                              fontFamily: "'Poppins', system-ui, sans-serif",
                            }}
                          >
                            No books found
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            Try adjusting your search or filters.
                          </p>
                          <div className="flex justify-center mb-3">
                            <Button
                              variant="primary"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg"
                              onClick={() => {
                                setNewWishlistBook({
                                  title: searchQuery,
                                  hashtags: "",
                                });
                                setShowWishlistAddModal(true);
                              }}
                            >
                              Add to Wishlist
                            </Button>
                          </div>
                          {activeFiltersCount > 0 && (
                            <Button
                              variant="outline"
                              onClick={clearAllFilters}
                              className="border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm px-4 py-1 rounded mt-3 bg-transparent"
                            >
                              Clear all filters
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-1">
                      {/* Map Section */}
                      <h3
                        className="text-lg font-semibold text-gray-900 mb-3"
                        style={{
                          fontFamily: "'Poppins', system-ui, sans-serif",
                        }}
                      >
                        Nearby Book Locations
                      </h3>
                      <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden border border-gray-200">
                        <MapContainer
                          center={userPosition}
                          zoom={12}
                          scrollWheelZoom={true}
                          className="w-full h-full z-0"
                        >
                          <TileLayer
                            attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          {/* User's location marker */}

                          <Marker position={userPosition} icon={userIcon}>
                            <Popup>Your Location</Popup>
                          </Marker>
                          {/* Available (filtered) books locations */}
                          {bookLocations.map((loc) => (
                            <Marker
                              key={loc.id}
                              position={[loc.lat, loc.lng]}
                              eventHandlers={{
                                click: () => {
                                  navigate(`book-details/${loc.id}`, {
                                    state: {
                                      book: books.find((b) => b.id === loc.id),
                                    },
                                  });
                                },
                              }}
                            >
                              <Popup>
                                <strong>{loc.title}</strong>
                                <br />
                                {loc.location}
                              </Popup>
                            </Marker>
                          ))}
                        </MapContainer>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Showing books near Colombo</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* AI Book Recommendations Section */}
                <div className="bg-white/90 rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-4 text-gray-900"
                    style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                  >
                    AI Book Recommendations
                  </h2>
                  <div className="relative flex-1 mb-4">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="I want a book named Harry Potter... (title, author, genre)"
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                      value={aiSearchQuery}
                      onChange={(e) => setAiSearchQuery(e.target.value)}
                    />
                  </div>
                  {aiRecommendations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {aiRecommendations.map((book) => (
                        <div
                          key={book.id}
                          className="bg-white/90 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          <div className="relative h-40 sm:h-48 overflow-hidden">
                            <LazyImage
                              src={book.cover}
                              alt={book.title}
                              fileName={book.bookImage}
                              folderName="userBooks"
                              baseUrl={baseUrl}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <button
                              onClick={() => handleToggleFavorite(book)}
                              className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors shadow-sm ${
                                favoriteBooks.find((b) => b.id === book.id)
                                  ? "bg-red-100 text-red-500"
                                  : "bg-white/80 text-gray-500 hover:text-red-500"
                              }`}
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                            {(book.forSale ||
                              book.forLend ||
                              book.forExchange ||
                              book.forBidding) && (
                              <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
                                {book.forSale && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                    For Sale
                                  </span>
                                )}
                                {book.forLend && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                    For Lending
                                  </span>
                                )}
                                {book.forExchange && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                    For Exchange
                                  </span>
                                )}
                                {book.forBidding && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                    For Bidding
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                              {book.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              {book.author}
                            </p>
                            <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500 space-x-2">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-0.5" />
                                <span>{book.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Tag className="w-3 h-3 mr-0.5" />
                                <span>{book.condition}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex space-x-1">
                              <Link
                                to={`book-details/${book.id}`}
                                state={{ book }}
                                className="w-full inline-flex justify-center items-center px-2 py-1 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen
                        size={40}
                        className="mx-auto mb-3 text-gray-300"
                      />
                      <p className="text-gray-600 text-sm">
                        Enter a search query to get personalized
                        recommendations.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white/90 rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-gray-900"
                  style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                >
                  Wishlisted Books
                </h2>

                {wishlistedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wishlistedBooks.map((book) => {
                      const isAvailable = books.some(
                        (b) =>
                          b.title.toLowerCase() === book.title.toLowerCase()
                      );
                      return (
                        <div
                          key={book.id}
                          className="bg-white/90 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                              {book.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              {isAvailable ? (
                                <span className="text-green-600">
                                  Book Available
                                </span>
                              ) : (
                                "Not Available"
                              )}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {book.hashtags.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              Added:{" "}
                              {new Date(book.addedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-2 flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1 bg-transparent"
                                onClick={() =>
                                  handleRemoveFromWishlist(book.id)
                                }
                              >
                                Remove from Wishlist
                              </Button>
                              {isAvailable && (
                                <Link
                                  to={`book-details/${
                                    books.find(
                                      (b) =>
                                        b.title.toLowerCase() ===
                                        book.title.toLowerCase()
                                    )?.id
                                  }`}
                                  state={{
                                    book: books.find(
                                      (b) =>
                                        b.title.toLowerCase() ===
                                        book.title.toLowerCase()
                                    ),
                                  }}
                                  className="w-full inline-flex justify-center items-center px-2 py-1 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
                                >
                                  View Details
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={40} className="mx-auto mb-3 text-gray-300" />
                    <h3
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      No wishlisted books
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Search for a book to add it to your wishlist.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white/90 rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-gray-900"
                  style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                >
                  Favorite Books
                </h2>
                {favoriteBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {favoriteBooks.map((book) => (
                      <div
                        key={book.id}
                        className="bg-white/90 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <LazyImage
                            src={book.cover}
                            alt={book.title}
                            fileName={book.bookImage}
                            folderName="userBooks"
                            baseUrl={baseUrl}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <button
                            onClick={() => handleRemoveFromFavorites(book.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-500 shadow-sm"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            {book.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            Added: {new Date(book.addedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2 flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1 bg-transparent"
                              onClick={() => handleRemoveFromFavorites(book.id)}
                            >
                              Remove from Favorites
                            </Button>
                            <Link
                              to={`book-details/${book.id}`}
                              state={{ book }}
                              className="w-full inline-flex justify-center items-center px-2 py-1 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={40} className="mx-auto mb-3 text-gray-300" />
                    <h3
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      No favorite books
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Add books to your favorites by clicking the heart icon.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* My Requests Tab */}
            {activeTab === "requests" && (
              <div className="bg-white/90 rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4 text-gray-900"
                  style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                >
                  My Requests
                </h2>
                {myRequests.length > 0 ? (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.bookTitle}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {request.type} Request
                            </p>
                            <p className="text-xs text-gray-500">
                              Requested:{" "}
                              {new Date(
                                request.requestedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : request.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status === "pending" && (
                                <Clock className="w-3 h-3 inline mr-1" />
                              )}
                              {request.status === "approved" && (
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                              )}
                              {request.status === "completed" && (
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                              )}
                              {request.status === "rejected" && (
                                <XCircle className="w-3 h-3 inline mr-1" />
                              )}
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {request.status === "approved" && (
                          <div className="mt-3 flex space-x-2">
                            {request.type === "borrow" && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                                onClick={() => handleBorrowPayment(request)}
                              >
                                Make Payment (Rs.{" "}
                                {Math.round(request.book.price * 0.2) + 200})
                              </Button>
                            )}
                            {request.type === "exchange" && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-3 py-1"
                                onClick={() =>
                                  showExchangeBookSelection(request)
                                }
                              >
                                View Exchange Book
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen
                      size={40}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <h3
                      className="text-lg font-semibold text-gray-900"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      No requests yet
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Your borrow and exchange requests will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Borrow Confirmation Modal */}
            {showBorrowModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
                <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      Confirm Borrow Request
                    </h3>
                    <button
                      onClick={() => setShowBorrowModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                      Are you sure you want to send a borrow request for:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-semibold">{selectedBook?.title}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedBook?.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        Owner: {selectedBook?.owner?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Borrowing Price: Rs. {Math.round(selectedBook?.price * 0.2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Delivery Price: Rs. 200
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowBorrowModal(false)}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={confirmBorrowRequest}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
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
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      Confirm Exchange Request
                    </h3>
                    <button
                      onClick={() => setShowExchangeModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                      Are you sure you want to send an exchange request for:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-semibold">{selectedBook?.title}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedBook?.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        Owner: {selectedBook?.owner?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Delivery Price: Rs. 200
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowExchangeModal(false)}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={confirmExchangeRequest}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
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
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      Payment Details
                    </h3>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-2">
                        {selectedBook?.title}
                      </h4>
                      <div className="space-y-2 text-sm">
                        {paymentType === "borrow" && (
                          <>
                            <div className="flex justify-between">
                              <span>Book Price:</span>
                              <span>Rs. {selectedBook?.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Borrow Fee (20%):</span>
                              <span>
                                Rs. {Math.round(selectedBook?.price * 0.2)}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span>Rs. 200</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Amount:</span>
                          <span>
                            Rs.{" "}
                            {paymentType === "borrow"
                              ? Math.round(selectedBook?.price * 0.2) + 200
                              : 200}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentModal(false)}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={processPayment}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
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
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
                    >
                      Exchange Book Offer
                    </h3>
                    <button
                      onClick={() => setShowExchangeBookModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      The owner has offered this book for exchange:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                      <LazyImage
                        src={exchangeBook?.cover || placeholder}
                        alt={exchangeBook?.title}
                        fileName={exchangeBook?.bookImage}
                        folderName="userBooks"
                        baseUrl={baseUrl}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{exchangeBook?.title}</h4>
                        <p className="text-sm text-gray-600">
                          {exchangeBook?.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          Condition: {exchangeBook?.condition}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Do you want to proceed with this exchange?
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={rejectExchangeBook}
                      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      Reject Exchange
                    </Button>
                    <Button
                      variant="primary"
                      onClick={acceptExchangeBook}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Accept & Pay Delivery (Rs. 200)
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Add Modal */}
            {showWishlistAddModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
                <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{
                          fontFamily: "'Poppins', system-ui, sans-serif",
                        }}
                      >
                        Add to Wishlist
                      </h3>
                      <p className="text-gray-600 text-sm">
                        "{newWishlistBook.title}" is not available. Add it to
                        your wishlist?
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowWishlistAddModal(false);
                        setNewWishlistBook({ title: "", hashtags: "" });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Book Title
                      </label>
                      <input
                        type="text"
                        value={newWishlistBook.title}
                        onChange={(e) =>
                          setNewWishlistBook((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter book title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hashtags
                      </label>
                      <input
                        type="text"
                        value={newWishlistBook.hashtags}
                        onChange={(e) =>
                          setNewWishlistBook((prev) => ({
                            ...prev,
                            hashtags: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter hashtags (e.g., fiction, thriller, romance)"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowWishlistAddModal(false);
                        setNewWishlistBook({ title: "", hashtags: "" });
                      }}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAddToWishlist}
                      disabled={!newWishlistBook.title}
                      className="bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-200 text-sm"
                    >
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BooksPage;