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
  Gavel,
  ArrowRight,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { books } from "../../data/mockData";
import Button from "../../components/shared/Button";

const BooksPage = () => {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [forLending, setForLending] = useState(null);
  const [forSale, setForSale] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [nearbyOnly, setNearbyOnly] = useState(false);

  // Get unique genres from all books
  const allGenres = Array.from(
    new Set(books.flatMap((book) => book.genre))
  ).sort();

  // Get unique conditions from all books
  const allConditions = Array.from(
    new Set(books.map((book) => book.condition))
  );

  const applyFilters = useCallback(() => {
    let result = [...books];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.some((g) => g.toLowerCase().includes(query)) ||
          book.location.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((book) =>
        book.genre.some((genre) => selectedGenres.includes(genre))
      );
    }

    // Apply condition filter
    if (selectedConditions.length > 0) {
      result = result.filter((book) =>
        selectedConditions.includes(book.condition)
      );
    }

    // Apply lending/sale filters
    if (forLending !== null) {
      result = result.filter((book) => book.forLend === forLending);
    }

    if (forSale !== null) {
      result = result.filter((book) => book.forSale === forSale);
    }

    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      result = result.filter((book) => {
        if (!book.forSale) return true;
        const price = book.price;
        const min = priceRange.min ? parseInt(priceRange.min) : 0;
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply nearby filter (mock implementation)
    if (nearbyOnly) {
      result = result.filter((book) =>
        book.location.toLowerCase().includes("colombo")
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "popular":
        result.sort((a, b) => b.wishlistedCount - a.wishlistedCount);
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
    priceRange,
    nearbyOnly,
    sortBy,
  ]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleBidSubmit = () => {
    if (!bidAmount || !selectedBook) return;

    // Mock bid submission
    console.log(`Bid submitted: Rs. ${bidAmount} for ${selectedBook.title}`);
    alert(
      `Your bid of Rs. ${bidAmount} has been submitted for "${selectedBook.title}"`
    );

    setShowBidModal(false);
    setBidAmount("");
    setSelectedBook(null);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedConditions([]);
    setForLending(null);
    setForSale(null);
    setPriceRange({ min: "", max: "" });
    setNearbyOnly(false);
    setSortBy("newest");
  };

  const activeFiltersCount =
    selectedGenres.length +
    selectedConditions.length +
    (forLending !== null ? 1 : 0) +
    (forSale !== null ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (nearbyOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
              <p className="text-blue-100 text-lg">
                Discover a wide range of books to borrow or buy
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search books, authors, genres, locations..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                showFilters ? "bg-yellow-600" : ""
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-yellow-600 text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setNearbyOnly(!nearbyOnly)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                nearbyOnly
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Near Me</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors hover:bg-gray-50"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genre Filter */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 text-gray-600 mr-2" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map((genre) => (
                      <button
                        key={genre}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedGenres.includes(genre)
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          if (selectedGenres.includes(genre)) {
                            setSelectedGenres(
                              selectedGenres.filter((g) => g !== genre)
                            );
                          } else {
                            setSelectedGenres([...selectedGenres, genre]);
                          }
                        }}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition Filter */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Tag className="w-5 h-5 text-gray-600 mr-2" />
                    Condition
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allConditions.map((condition) => (
                      <button
                        key={condition}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedConditions.includes(condition)
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          if (selectedConditions.includes(condition)) {
                            setSelectedConditions(
                              selectedConditions.filter((c) => c !== condition)
                            );
                          } else {
                            setSelectedConditions([
                              ...selectedConditions,
                              condition,
                            ]);
                          }
                        }}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <ArrowDownUp className="w-5 h-5 text-gray-600 mr-2" />
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        forLending === true
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setForLending(forLending === true ? null : true)
                      }
                    >
                      For Lending
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        forSale === true
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setForSale(forSale === true ? null : true)}
                    >
                      For Sale
                    </button>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold mb-2">Price Range (Rs.)</h3>
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
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
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
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600 hover:text-gray-800 underline font-medium"
                  >
                    Clear all filters ({activeFiltersCount})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          <div className="mt-6">
            {filteredBooks.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredBooks.length} Books Found
                  </h2>
                  {nearbyOnly && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-5 h-5 mr-1" />
                      <span>Showing books near you</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Book Grid with Bidding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute top-2 right-2">
                          <button className="p-1.5 bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-sm">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                        {book.forSale && book.forLend ? (
                          <div className="absolute top-2 left-2 flex space-x-1">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              For Sale
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              For Lending
                            </span>
                          </div>
                        ) : book.forSale ? (
                          <div className="absolute top-2 left-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              For Sale
                            </span>
                          </div>
                        ) : book.forLend ? (
                          <div className="absolute top-2 left-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              For Lending
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {book.author}
                            </p>
                          </div>
                          {book.forSale && (
                            <div className="text-green-600 font-semibold">
                              Rs. {book.price}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center mt-2 text-sm text-gray-500 space-x-3">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{book.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            <span>{book.condition}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs">
                            <img
                              src={book.owner.avatar}
                              alt={book.owner.name}
                              className="h-5 w-5 rounded-full object-cover mr-1 inline"
                            />
                            <span className="text-gray-600">
                              {book.owner.name}
                            </span>
                            <span className="ml-1 bg-yellow-100 text-yellow-800 px-1 rounded text-xs">
                              {book.owner.trustScore}★
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            <span>Contact</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <Link
                              to={`book-details/${book.id}`} // Changed from `/book-details/${book.id}` to relative path
                              state={{ book }}
                              className="w-full inline-flex justify-center items-center px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-medium"
                            >
                              View Details
                            </Link>
                            {book.forLend && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Request
                              </Button>
                            )}
                          </div>

                          {book.forSale && (
                            <div className="flex space-x-2">
                              <Button
                                variant="primary"
                                fullWidth
                                size="sm"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                              >
                                Buy Now
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                                icon={<Gavel className="w-4 h-4" />}
                                onClick={() => {
                                  setSelectedBook(book);
                                  setShowBidModal(true);
                                }}
                              >
                                Bid
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  No books found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 shadow-2xl">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Place a Bid</h3>
              <button
                onClick={() => setShowBidModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedBook && (
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Book:{" "}
                  <span className="font-medium">{selectedBook.title}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Current Price:{" "}
                  <span className="font-medium text-green-600">
                    Rs. {selectedBook.price}
                  </span>
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount (Rs.)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your bid amount"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowBidModal(false)}
                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleBidSubmit}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Submit Bid
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
