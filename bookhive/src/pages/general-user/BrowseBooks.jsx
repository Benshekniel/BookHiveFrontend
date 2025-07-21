import React, { useState, useEffect, useCallback } from "react";
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
  Book,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { books } from "../../data/mockData";
import Button from "../../components/shared/Button";

const BooksPage = () => {
  const [filteredBooks, setFilteredBooks] = useState(books || []);
  const [wishlistedBooks, setWishlistedBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistSearchQuery, setWishlistSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showWishlistAddModal, setShowWishlistAddModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [forLending, setForLending] = useState(null);
  const [forSale, setForSale] = useState(null);
  const [forExchange, setForExchange] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [newWishlistBook, setNewWishlistBook] = useState({ title: "", hashtags: "" });
  const [activeTab, setActiveTab] = useState("browse");
  const navigate = useNavigate();

  const allGenres = Array.from(new Set((books || []).flatMap((book) => book.genre))).sort();
  const allConditions = Array.from(new Set((books || []).map((book) => book.condition)));

  useEffect(() => {
    console.log("Books data:", books);
    if (!books || books.length === 0) {
      console.warn("No books data available");
    }
    setFilteredBooks(books || []);
  }, []);

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

    if (priceRange.min || priceRange.max) {
      result = result.filter((book) => {
        if (!book.forSale) return true;
        const price = book.price;
        const min = priceRange.min ? parseInt(priceRange.min) : 0;
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    if (nearbyOnly) {
      const userLocation = "Colombo"; // Replace with mockData.currentUser.location
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
        result.sort((a, b) => (b.wishlistedCount || 0) - (a.wishlistedCount || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredBooks(result);
  }, [
    searchQuery,
    selectedGenres,
    selectedConditions,
    forLending,
    forSale,
    forExchange,
    priceRange,
    nearbyOnly,
    sortBy,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleWishlistSearch = () => {
    const query = wishlistSearchQuery.toLowerCase();
    const bookExists = (books || []).find((book) => book.title?.toLowerCase() === query);
    if (!bookExists) {
      setNewWishlistBook({ title: wishlistSearchQuery, hashtags: "" });
      setShowWishlistAddModal(true);
    } else {
      alert(`Book "${wishlistSearchQuery}" is available in the browse section!`);
    }
  };

  const handleAddToWishlist = () => {
    if (newWishlistBook.title) {
      setWishlistedBooks((prev) => [
        ...prev,
        {
          id: `wishlist-${prev.length + 1}`,
          title: newWishlistBook.title,
          hashtags: newWishlistBook.hashtags.split(",").map((tag) => tag.trim()).filter(Boolean),
          available: false,
          addedAt: new Date().toISOString(),
        },
      ]);
      setShowWishlistAddModal(false);
      setWishlistSearchQuery("");
      setNewWishlistBook({ title: "", hashtags: "" });
      alert(`"${newWishlistBook.title}" has been added to your wishlist!`);
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

  const handleBorrowConfirm = (book) => {
    alert(`Your borrow request for "${book.title}" was successfully sent to the seller.`);
  };

  const handleExchangeConfirm = (book) => {
    alert(`Your exchange request for "${book.title}" was successfully sent to the owner.`);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedConditions([]);
    setForLending(null);
    setForSale(null);
    setForExchange(null);
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
    (priceRange.min || priceRange.max ? 1 : 0) +
    (nearbyOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <div className="max-w-8xl mx-auto p-4 sm:p-6">
        {(!books || books.length === 0) ? (
          <div className="text-center py-12 bg-white/90 rounded-lg shadow-md border border-gray-200">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
              No books available
            </h3>
            <p className="text-gray-600 text-sm">Please check your data source or try again later.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white/90 rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-6">
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                    activeTab === "browse"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("browse")}
                >
                  Browse Books
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                    activeTab === "wishlist"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  Wishlisted Books
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                    activeTab === "favorites"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("favorites")}
                >
                  Favorites
                </button>
              </div>
            </div>

            {/* Browse Tab */}
            {activeTab === "browse" && (
              <div className="bg-white/90 rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                    Browse Books
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/book-circles")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    Go to Book Circles
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors ${
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
                    className={`px-3 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors ${
                      nearbyOnly ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Near Me</span>
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors hover:bg-gray-50"
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
                          <BookOpen className="w-4 h-4 text-gray-600 mr-1" /> Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {allGenres.map((genre) => (
                            <button
                              key={genre}
                              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                selectedGenres.includes(genre)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                setSelectedGenres((prev) =>
                                  prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
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
                          <Tag className="w-4 h-4 text-gray-600 mr-1" /> Condition
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {allConditions.map((condition) => (
                            <button
                              key={condition}
                              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                selectedConditions.includes(condition)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              onClick={() =>
                                setSelectedConditions((prev) =>
                                  prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
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
                          <ArrowDownUp className="w-4 h-4 text-gray-600 mr-1" /> Availability
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                              forLending === true ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setForLending(forLending === true ? null : true)}
                          >
                            For Lending
                          </button>
                          <button
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                              forSale === true ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setForSale(forSale === true ? null : true)}
                          >
                            For Sale
                          </button>
                          <button
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                              forExchange === true ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setForExchange(forExchange === true ? null : true)}
                          >
                            For Exchange
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-sm">Price Range (Rs.)</h3>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
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

                <div className="mt-4">
                  {filteredBooks.length > 0 ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                          {filteredBooks.length} Books Found
                        </h2>
                        {nearbyOnly && (
                          <div className="flex items-center text-sm text-gray-600 mt-2 sm:mt-0">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>Showing books near you</span>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredBooks.map((book) => (
                          <div
                            key={book.id}
                            className="bg-white/90 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                          >
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                              <img
                                src={book.cover || "https://via.placeholder.com/150"}
                                alt={book.title}
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
                              {(book.forSale || book.forLend || book.forExchange) && (
                                <div className="absolute top-2 left-2 flex space-x-1">
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
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{book.title}</h3>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{book.author}</p>
                                </div>
                                {book.forSale && (
                                  <div className="text-green-600 font-semibold text-sm">Rs. {book.price}</div>
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
                                <div className="flex items-center">
                                  <Book className="w-3 h-3 mr-0.5" />
                                  <span>{book.inStock}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-xs flex items-center">
                                  <img
                                    src={book.owner?.avatar || "https://via.placeholder.com/50"}
                                    alt={book.owner?.name || "Owner"}
                                    className="h-4 w-4 rounded-full object-cover mr-1"
                                  />
                                  <span className="text-gray-600">{book.owner?.name || "Unknown"}</span>
                                  <span className="ml-1 bg-blue-100 text-blue-800 px-1 rounded text-xs">
                                    {book.owner?.trustScore || "N/A"}★
                                  </span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                  <MessageSquare className="w-3 h-3 mr-0.5" />
                                  <span>Contact</span>
                                </div>
                              </div>
                              <div className="mt-2 flex flex-col space-y-1">
                                <div className="flex space-x-1">
                                  <Link
                                    to={`/book-details/${book.id}`}
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
                                      onClick={() => handleBorrowConfirm(book)}
                                    >
                                      Borrow
                                    </Button>
                                  )}
                                </div>
                                {(book.forSale || book.forExchange) && (
                                  <div className="flex space-x-1">
                                    {book.forSale && (
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                                        onClick={() => navigate(`/payment/${book.id}`, { state: { book } })}
                                      >
                                        Buy Now
                                      </Button>
                                    )}
                                    {book.forExchange && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1"
                                        icon={<Repeat className="w-3 h-3" />}
                                        onClick={() => handleExchangeConfirm(book)}
                                      >
                                        Exchange
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-white/90 rounded-lg shadow-md border border-gray-200">
                      <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                        No books found
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">Try adjusting your search or filters.</p>
                      <Button
                        variant="primary"
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg"
                        onClick={() => {
                          setNewWishlistBook({ title: searchQuery, hashtags: "" });
                          setShowWishlistAddModal(true);
                        }}
                      >
                        Add to Wishlist
                      </Button>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={clearAllFilters}
                          className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm px-3 py-1 mt-2"
                        >
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white/90 rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                  Wishlisted Books
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search for a book to add to wishlist..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                      value={wishlistSearchQuery}
                      onChange={(e) => setWishlistSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg"
                    onClick={handleWishlistSearch}
                  >
                    Search & Add
                  </Button>
                </div>
                {wishlistedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {wishlistedBooks.map((book) => {
                      const isAvailable = books.some((b) => b.title.toLowerCase() === book.title.toLowerCase());
                      return (
                        <div
                          key={book.id}
                          className="bg-white/90 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{book.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              {isAvailable ? (
                                <span className="text-green-600">Book Available</span>
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
                            <p className="text-xs text-gray-500">Added: {new Date(book.addedAt).toLocaleDateString()}</p>
                            <div className="mt-2 flex space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1"
                                onClick={() => handleRemoveFromWishlist(book.id)}
                              >
                                Remove from Wishlist
                              </Button>
                              {isAvailable && (
                                <Link
                                  to={`/book-details/${books.find((b) => b.title.toLowerCase() === book.title.toLowerCase())?.id}`}
                                  state={{ book: books.find((b) => b.title.toLowerCase() === book.title.toLowerCase()) }}
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
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      No wishlisted books
                    </h3>
                    <p className="text-gray-600 text-sm">Search for a book to add it to your wishlist.</p>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white/90 rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
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
                          <img
                            src={book.cover || "https://via.placeholder.com/150"}
                            alt={book.title}
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
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{book.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">{book.author}</p>
                          <p className="text-xs text-gray-500">Added: {new Date(book.addedAt).toLocaleDateString()}</p>
                          <div className="mt-2 flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-2 py-1"
                              onClick={() => handleRemoveFromFavorites(book.id)}
                            >
                              Remove from Favorites
                            </Button>
                            <Link
                              to={`/book-details/${book.id}`}
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
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      No favorite books
                    </h3>
                    <p className="text-gray-600 text-sm">Add books to your favorites by clicking the heart icon.</p>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Add Modal */}
            {showWishlistAddModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 shadow-2xl">
                <div className="bg-white/95 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
                        Add to Wishlist
                      </h3>
                      <p className="text-gray-600">
                        "{newWishlistBook.title}" is not available. Add it to your wishlist?
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                      <input
                        type="text"
                        value={newWishlistBook.title}
                        onChange={(e) => setNewWishlistBook((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter book title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
                      <input
                        type="text"
                        value={newWishlistBook.hashtags}
                        onChange={(e) => setNewWishlistBook((prev) => ({ ...prev, hashtags: e.target.value }))}
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
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAddToWishlist}
                      disabled={!newWishlistBook.title}
                      className="bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-200"
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