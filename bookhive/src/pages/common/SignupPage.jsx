import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Search, BookOpen, X, Star, MapPin, 
  Clock, Heart, Share2, MessageCircle, Filter, Grid, List,
  Users, Award, Calendar, TrendingUp, Eye, ShoppingCart,
  Menu, Home, Settings, Bell, User, ChevronLeft, ChevronRight,
  Download, Upload, BarChart3, Target, Bookmark, Gift
} from "lucide-react";
import { bookApi } from "../../services/bookApiService";
import axios from "axios";

const BookListingManagementPage = () => {
  const [listings, setListings] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9090/api/getBooks', {
        headers: { 'Content-Type': 'application/json' },
      });
      const bookCoverImages = [
        'https://cdn.europosters.eu/image/1300/214933.jpg',
        'https://bookholics.lk/wp-content/uploads/2023/01/The-Hobbit-Film-tie-in-edition.jpg',
        'https://images.unsplash.com/photo-1589994965851-a8f0a1617a31?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200&q=80',
        'https://images.unsplash.com/photo-1512820790803-2e00615cf763?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200&q=80',
        'https://images.unsplash.com/photo-1611676279444-5577698aa13c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200&q=80',
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200&q=80',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200&q=80',
      ];
      setListings(
        response.data.map((book, index) => {
          const imageIndex = (book.bookId || index) % bookCoverImages.length;
          const selectedImage = bookCoverImages[imageIndex];
          return {
            bookId: book.bookId || Date.now() + index,
            userEmail: book.userEmail,
            title: book.title || '',
            authors: book.authors || [],
            genres: book.genres || [],
            condition: book.condition || 'New',
            forSale: book.forSale || false,
            price: book.price || 0,
            forLend: book.forLend || false,
            lendingAmount: book.lendingAmount || 0,
            lendingPeriod: book.lendingPeriod || '',
            forExchange: book.forExchange || false,
            exchangePeriod: book.exchangePeriod || '',
            description: book.description || '',
            location: book.location || '',
            publishYear: book.publishYear || '',
            isbn: book.isbn || '',
            language: book.language || 'English',
            hashtags: book.hashtags || [],
            createdAt: book.createdAt || new Date().toISOString(),
            updatedAt: book.updatedAt || new Date().toISOString(),
            images: [selectedImage],
            cover: selectedImage,
            views: book.views || 0,
            wishlistedBy: book.wishlistedBy || 0,
            trustScore: book.trustScore || 0,
            reviews: book.reviews || 0,
            status: book.status || 'active',
          };
        })
      );
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch books: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [newBook, setNewBook] = useState({
    userEmail: 'user@example.com',
    title: '',
    author: '',
    genre: [],
    condition: 'New',
    forSale: true,
    price: '',
    forLend: false,
    lendingAmount: '',
    lendingPeriod: '',
    forExchange: false,
    exchangePeriod: '',
    description: '',
    location: '',
    publishYear: '',
    isbn: '',
    language: 'English',
    hashtags: [],
    cover: '',
    imageFile: null,
  });

  const handleAddBook = () => {
    setNewBook({
      userEmail: 'user@example.com',
      title: '',
      author: '',
      genre: [],
      condition: 'New',
      forSale: true,
      price: '',
      forLend: false,
      lendingAmount: '',
      lendingPeriod: '',
      forExchange: false,
      exchangePeriod: '',
      description: '',
      location: '',
      publishYear: '',
      isbn: '',
      language: 'English',
      hashtags: [],
      cover: '',
      imageFile: null,
    });
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setNewBook({
      userEmail: book.userEmail,
      title: book.title,
      author: book.authors ? book.authors.join(', ') : '',
      genre: book.genres ? book.genres : [],
      condition: book.condition,
      forSale: book.forSale,
      price: book.price || '',
      forLend: book.forLend,
      lendingAmount: book.lendingAmount || '',
      lendingPeriod: book.lendingPeriod || '',
      forExchange: book.forExchange,
      exchangePeriod: book.exchangePeriod || '',
      description: book.description,
      location: book.location,
      publishYear: book.publishYear,
      isbn: book.isbn,
      language: book.language,
      hashtags: book.hashtags ? book.hashtags : [],
      cover: book.cover || (book.images ? book.images[0] : ''),
      imageFile: null,
    });
    setEditBook(book);
    setShowEditModal(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();

    // Validate image upload
    if (!editBook && !newBook.imageFile) {
      setError('Book cover image is required');
      alert('Book cover image is required');
      return;
    }

    // Create FormData and append file + JSON
    const formDataToSend = new FormData();

    // Append image file if uploaded
    if (newBook.imageFile) {
      formDataToSend.append('coverImage', newBook.imageFile);
    }

    // Create bookData JSON
    const bookData = {
      userEmail: "user@gmail.com",
      title: newBook.title,
      authors: newBook.author.split(",").map(a => a.trim()).filter(a => a),
      genres: newBook.genre,
      condition: newBook.condition,
      forSale: newBook.forSale,
      price: newBook.forSale ? parseFloat(newBook.price || 0) : 0,
      forLend: newBook.forLend,
      lendingAmount: newBook.forLend ? parseFloat(newBook.lendingAmount || 0) : 0,
      lendingPeriod: newBook.forLend ? newBook.lendingPeriod : "",
      forExchange: newBook.forExchange,
      exchangePeriod: newBook.forExchange ? newBook.exchangePeriod : "",
      description: newBook.description,
      location: newBook.location,
      publishYear: newBook.publishYear,
      isbn: newBook.isbn,
      language: newBook.language,
      hashtags: newBook.hashtags
    };

    if (editBook) {
      bookData.bookId = editBook.bookId;
    }

    const jsonBlob = new Blob([JSON.stringify(bookData)], {
      type: 'application/json',
    });

    formDataToSend.append('bookData', jsonBlob);

    try {
      setLoading(true);
      let response;
      if (editBook) {
        response = await axios.put(
          `http://localhost:9090/api/updateBook/${editBook.bookId}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:9090/api/saveBook-User",
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      if (response.data.message === "success") {
        alert(editBook ? "Book Updated successfully!" : "Book Added successfully!");
        setShowAddModal(false);
        setShowEditModal(false);
        setEditBook(null);
        fetchBooks();
      } else {
        setError(response.data.message);
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saving book:", error);
      const errMsg = "Something went wrong: " + (error.response?.data?.message || error.message);
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await bookApi.deleteBook(id);
        setListings(listings.filter((book) => book.bookId !== id));
        toast.success("Book deleted successfully!");
      } catch (err) {
        toast.error(`Failed to delete book: ${err.message}`);
      }
    }
  };

  const filteredListings = listings.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = !filterGenre || book.genres.includes(filterGenre);
    const matchesCondition = !filterCondition || book.condition === filterCondition;
    return matchesSearch && matchesGenre && matchesCondition;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return (a.price || 0) - (b.price || 0);
      case "price-high": return (b.price || 0) - (a.price || 0);
      case "rating": return (b.rating || 0) - (a.rating || 0);
      case "popular": return (b.views || 0) - (a.views || 0);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const allGenres = [...new Set(listings.flatMap(book => book.genres || []))];

  const BookCard = ({ book }) => (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
        <img
          src={book.cover || "https://via.placeholder.com/150x200/6B7280/FFFFFF?text=No+Image"}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-sm"
          title="Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        {(book.forSale || book.forLend || book.forExchange) && (
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {book.forSale && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">For Sale</span>}
            {book.forLend && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">For Lending</span>}
            {book.forExchange && <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">For Exchange</span>}
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">{book.title}</h3>
            {book.trustScore >= 90 && <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
          </div>
          <p className="text-gray-600 text-sm mb-2">by {book.authors.join(', ')}</p>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">{[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            ))}</div>
            <span className="text-sm text-gray-600 ml-1">{book.rating || 0}</span>
            <span className="text-xs text-gray-400">({book.reviews || 0} reviews)</span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={() => handleEditBook(book)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Book">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteBook(book.bookId)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Delete Book">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {book.genres.slice(0, 3).map((g, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{g}</span>
          ))}
          {book.genres.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{book.genres.length - 3}</span>}
        </div>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{book.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{book.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{book.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{book.wishlistedBy || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.condition === 'New' ? "bg-green-100 text-green-800" : book.condition === 'Like New' ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>{book.condition}</span>
          </div>
          {book.forSale && book.price && <div className="text-right"><p className="text-lg font-bold text-green-600">Rs. {book.price}</p></div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forSale ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>{book.forSale ? "For Sale" : "Not for Sale"}</span>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forLend ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{book.forLend ? "For Lending" : "Not for Lending"}</span>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forExchange ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"}`}>{book.forExchange ? "For Exchange" : "Not for Exchange"}</span>
        </div>
        {(book.forLend || book.forExchange) && (
          <div className="bg-gray-50 rounded-lg p-3 text-xs">
            {book.forLend && book.lendingAmount && <div className="mb-1"><span className="font-medium text-gray-700">Lending Fee:</span> Rs. {book.lendingAmount}</div>}
            {book.forLend && book.lendingPeriod && <div className="mb-1"><span className="font-medium text-gray-700">Lending Period:</span> {book.lendingPeriod}</div>}
            {book.forExchange && book.exchangePeriod && <div><span className="font-medium text-gray-700">Exchange Period:</span> {book.exchangePeriod}</div>}
          </div>
        )}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">View Details</button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="Share"><Share2 className="w-4 h-4 text-gray-600" /></button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" title="Message"><MessageCircle className="w-4 h-4 text-gray-600" /></button>
        </div>
      </div>
    </div>
  );

  const stats = {
    totalBooks: listings.length,
    activeListings: listings.filter(b => b.status === 'active').length,
    forSale: listings.filter(b => b.forSale).length,
    forLend: listings.filter(b => b.forLend).length,
    forExchange: listings.filter(b => b.forExchange).length,
    totalViews: listings.reduce((sum, book) => sum + (book.views || 0), 0),
    totalWishlists: listings.reduce((sum, book) => sum + (book.wishlistedBy || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Books</h1>
              <p className="text-blue-100 text-lg">Manage Your books to lend, sell or exchange</p>
            </div>
            <button onClick={handleAddBook} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-medium">
              <Plus className="w-5 h-5" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Listings</h1>
              <p className="text-gray-600">Add, edit, or remove your book listings</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
              <div className="text-sm text-blue-600">Total Books</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
              <div className="text-sm text-green-600">Active</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.forSale}</div>
              <div className="text-sm text-purple-600">For Sale</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.forLend}</div>
              <div className="text-sm text-orange-600">For Lend</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.forExchange}</div>
              <div className="text-sm text-pink-600">For Exchange</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalViews}</div>
              <div className="text-sm text-indigo-600">Total Views</div>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.totalWishlists}</div>
              <div className="text-sm text-teal-600">Wishlisted</div>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Genres</option>
              {allGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
            </select>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-3 transition-colors ${viewMode === "grid" ? "bg-yellow-400 text-blue-900" : "bg-white text-gray-600 hover:bg-gray-50"}`} title="Grid View">
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-3 transition-colors ${viewMode === "list" ? "bg-yellow-400 text-blue-900" : "bg-white text-gray-600 hover:bg-gray-50"}`} title="List View">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {loading && <p className="text-center">Loading...</p>}
        {sortedListings.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"}`}>
            {sortedListings.map((book) => <BookCard key={book.bookId} book={book} />)}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center border border-gray-200">
            <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterGenre || filterCondition ? "Try adjusting your search filters or clearing them to see more results." : "Add your first book to start building your library."}
            </p>
            <div className="flex gap-3 justify-center">
              {(searchQuery || filterGenre || filterCondition) && (
                <button onClick={() => { setSearchQuery(""); setFilterGenre(""); setFilterCondition(""); }} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Clear Filters
                </button>
              )}
              <button onClick={handleAddBook} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors">
                Add Your First Book
              </button>
            </div>
          </div>
        )}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 md:p-6 w-full max-w-2xl mx-2 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold">{editBook ? "Edit Book Listing" : "Add New Book"}</h3>
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditBook(null); }} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveBook} className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Book Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter book title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Author <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter author name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year</label>
                      <input
                        type="text"
                        value={newBook.publishYear}
                        onChange={(e) => setNewBook({ ...newBook, publishYear: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="e.g., 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ISBN (Optional)</label>
                      <input
                        type="text"
                        value={newBook.isbn}
                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="978-0-123456-78-9"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newBook.description}
                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows="4"
                      placeholder="Tell potential readers about this book - plot summary, condition details, why you're sharing it..."
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Image</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Book Cover <span className="text-red-500">*</span></label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setNewBook({ ...newBook, imageFile: file, cover: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a clear image of the book cover (JPEG, PNG, max 5MB)</p>
                    </div>
                    {newBook.cover && (
                      <div className="flex-shrink-0">
                        <img src={newBook.cover} alt="Book cover preview" className="w-32 h-40 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => setNewBook({ ...newBook, cover: "", imageFile: null })} className="mt-2 text-sm text-red-500 hover:text-red-700 underline">Remove Image</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories & Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Genre/Categories</label>
                      <input
                        type="text"
                        value={Array.isArray(newBook.genre) ? newBook.genre.join(", ") : ""}
                        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value.split(",").map(g => g.trim()).filter(g => g) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Fiction, Romance, Thriller"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple genres with commas</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition <span className="text-red-500">*</span></label>
                      <select
                        value={newBook.condition}
                        onChange={(e) => setNewBook({ ...newBook, condition: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      >
                        <option value="New">New - Never been read</option>
                        <option value="Like New">Like New - Excellent condition</option>
                        <option value="Used">Used - Good readable condition</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={newBook.language}
                        onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Sinhala">Sinhala</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Location</label>
                      <input
                        type="text"
                        value={newBook.location}
                        onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="City, Province (e.g., Colombo, Western Province)"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Availability Options</h4>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={newBook.forSale}
                          onChange={(e) => setNewBook({ ...newBook, forSale: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Available for Sale</span>
                      </label>
                      {newBook.forSale && (
                        <div className="ml-7">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price (LKR)</label>
                          <input
                            type="number"
                            value={newBook.price}
                            onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter selling price"
                            min="0"
                          />
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={newBook.forLend}
                          onChange={(e) => setNewBook({ ...newBook, forLend: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Available for Lending</span>
                      </label>
                      {newBook.forLend && (
                        <div className="ml-7 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lending Amount (LKR)</label>
                            <input
                              type="number"
                              value={newBook.lendingAmount}
                              onChange={(e) => setNewBook({ ...newBook, lendingAmount: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              placeholder="e.g., 200 (security deposit)"
                              min="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">Security deposit or lending fee</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lending Period</label>
                            <select
                              value={newBook.lendingPeriod}
                              onChange={(e) => setNewBook({ ...newBook, lendingPeriod: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            >
                              <option value="">Select lending period</option>
                              <option value="7 days">7 days</option>
                              <option value="14 days">14 days</option>
                              <option value="21 days">21 days</option>
                              <option value="30 days">30 days</option>
                              <option value="Custom">Custom period</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={newBook.forExchange}
                          onChange={(e) => setNewBook({ ...newBook, forExchange: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Available for Exchange</span>
                      </label>
                      {newBook.forExchange && (
                        <div className="ml-7">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Period</label>
                          <select
                            value={newBook.exchangePeriod}
                            onChange={(e) => setNewBook({ ...newBook, exchangePeriod: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="">Select exchange period</option>
                            <option value="30 days">30 days</option>
                            <option value="45 days">45 days</option>
                            <option value="60 days">60 days</option>
                            <option value="90 days">90 days</option>
                            <option value="Permanent">Permanent exchange</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">How long you want to exchange books</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Hashtags (Optional)</h4>
                  <input
                    type="text"
                    value={Array.isArray(newBook.hashtags) ? newBook.hashtags.join(", ") : ""}
                    onChange={(e) => setNewBook({ ...newBook, hashtags: e.target.value.split(",").map(h => h.trim()).filter(h => h) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="#classic, #must-read, #vintage"
                  />
                  <p className="text-xs text-gray-500 mt-1">Help others discover your book with relevant hashtags</p>
                </div>
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditBook(null); }} className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium">{editBook ? "Update Book Listing" : "Add Book to Library"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListingManagementPage;
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { BookOpen } from 'lucide-react';
// import Button from '../../components/shared/Button';
// import axios from "axios";
// import { showMessageCard } from './MessageCard'; 

// const signupSchemaStep1 = z.object({
//   firstName: z.string().min(2, 'First Name must be at least 2 characters'),
//   lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   phone: z.string()
//     .regex(/^\d+$/, 'Phone must contain only numbers')
//     .min(10, 'Phone must be at least 10 digits')
//     .max(10, 'Phone must not exceed 10 digits'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   confirmPassword: z.string().min(8, 'Confirm password must match'),
//   address: z.string().min(5, 'Address must be at least 5 characters'),
//   city: z.string().min(2, 'City must be at least 2 characters'),
//   state: z.string().min(2, 'State must be at least 2 characters'),
//   zipCode: z.string().min(5, 'Zip Code must be at least 5 characters'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Passwords do not match',
//   path: ['confirmPassword'],
// });

// const signupSchemaStep2 = z.object({
//   role: z.enum(['user', 'bookstore', 'organization', 'delivery-agent'], 'Please select a role'),
// });

// const userSchemaStep3 = z.object({
//   dob: z.string().min(1, 'Date of birth is required'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   billImage: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
// });

// const bookstoreSchemaStep3 = z.object({
//   storeRegistrationNo: z.string().min(1, 'Store Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYear: z.string().min(1, 'Running Year is required'),
// });

// const organizationSchemaStep3 = z.object({
//   organizationType: z.string().min(1, 'Organization Type is required'),
//   registrationNo: z.string().min(1, 'Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYears: z.string().min(1, 'Running Years is required'),
// });

// const deliveryAgentSchemaStep3 = z.object({
//   age: z.string().min(1, 'Age is required'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   hub: z.string().min(1, 'Hub is required'),
//   vehicleType: z.string().min(1, 'Vehicle Type is required'),
//   vehicleRC: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
// });

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [selectedRole, setSelectedRole] = useState('');

//   const getSchemaForStep = () => {
//     if (step === 1) return signupSchemaStep1;
//     if (step === 2) return signupSchemaStep2;
//     if (step === 3) {
//       switch (selectedRole) {
//         case 'user': return userSchemaStep3;
//         case 'bookstore': return bookstoreSchemaStep3;
//         case 'organization': return organizationSchemaStep3;
//         case 'delivery-agent': return deliveryAgentSchemaStep3;
//         default: return userSchemaStep3;
//       }
//     }
//     return signupSchemaStep1;
//   };

//   const { register, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: zodResolver(getSchemaForStep()),
//   });
//   const [error, setError] = useState('');

//   const onSubmitStep1 = (data) => {
//     setFormData({ ...formData, ...data });
//     setStep(2);
//     reset();
//   };

//   const onSubmitStep2 = (data) => {
//     setFormData({ ...formData, ...data });
//     setSelectedRole(data.role);
//     setStep(3);
//     reset();
//   };

//   const onSubmitStep3 = async (data) => {
//     const allData = { ...formData, ...data };
//     setFormData(allData);

//     if (selectedRole === 'user') {
//       const idFrontFile = allData.idFront?.[0];
//       const idBackFile = allData.idBack?.[0];
//       const billImageFile = allData.billImage?.[0];

//       // Validate file uploads
//       if (!idFrontFile || !idBackFile || !billImageFile) {
//         setError('ID Front, ID Back, and Bill Image are required');
//         showMessageCard('Error', 'ID Front, ID Back, and Bill Image are required', 'error');
//         return;
//       }

//       try {
//         // Upload files to Google Drive
//         const idFrontFormData = new FormData();
//         idFrontFormData.append('file', idFrontFile);
//         const idFrontResponse = await axios.post('http://localhost:9090/upload/idFront', idFrontFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const idFrontId = idFrontResponse.data;

//         const idBackFormData = new FormData();
//         idBackFormData.append('file', idBackFile);
//         const idBackResponse = await axios.post('http://localhost:9090/upload/idBack', idBackFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const idBackId = idBackResponse.data;

//         const billImageFormData = new FormData();
//         billImageFormData.append('file', billImageFile);
//         const billImageResponse = await axios.post('http://localhost:9090/upload/billImage', billImageFormData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const billImageId = billImageResponse.data;

//         // Create userData with file IDs
//         const userData = {
//           email: allData.email,
//           password: allData.password,
//           fname: allData.firstName,
//           lname: allData.lastName,
//           phone: parseInt(allData.phone.slice(0, 10), 10),
//           dob: allData.dob,
//           idType: allData.idType,
//           gender: allData.gender,
//           address: allData.address,
//           city: allData.city,
//           state: allData.state,
//           zip: allData.zipCode,
//           idFront: idFrontId,
//           idBack: idBackId,
//           billImage: billImageId,
//         };

//         // Submit to register endpoint
//         const formDataToSend = new FormData();
//         const jsonBlob = new Blob([JSON.stringify(userData)], {
//           type: 'application/json',
//         });
//         formDataToSend.append('userData', jsonBlob);

//         const response = await axios.post('http://localhost:9090/api/registerUser', formDataToSend, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const result = response.data;

//         if (result.message === 'success&pending') {
//           showMessageCard(
//             'Your account request has been received!',
//             'We are currently verifying your information. Please check your email for updates.',
//             'info'
//           );
//         } else if (result.message === 'success&active') {
//           showMessageCard(
//             'Account Created Successfully!',
//             'You can now log in to your account.',
//             'success'
//           );
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           showMessageCard(
//             'Error',
//             'Something went wrong: ' + result.message,
//             'error'
//           );
//           setError(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         const errMsg =
//           'Something went wrong: ' +
//           (error.response?.data?.message || error.message);
//         showMessageCard('Error', errMsg, 'error');
//         setError(errMsg);
//       }
//     } else if (selectedRole === 'organization') {
//       const registrationCopyFile = allData.registrationCopy?.[0];

//       if (!registrationCopyFile) {
//         setError('Registration copy is required');
//         showMessageCard('Error', 'Registration copy is required', 'error');
//         return;
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append('registrationCopyFile', registrationCopyFile);

//       const orgData = {
//         type: allData.organizationType,
//         reg_no: allData.registrationNo,
//         fname: allData.firstName,
//         lname: allData.lastName,
//         email: allData.email,
//         password: allData.password,
//         phone: parseInt(allData.phone.slice(0, 10), 10),
//         years: parseInt(allData.runningYears, 10),
//         address: allData.address,
//         city: allData.city,
//         state: allData.state,
//         zip: allData.zipCode
//       };

//       const jsonBlob = new Blob([JSON.stringify(orgData)], {
//         type: 'application/json'
//       });

//       formDataToSend.append('orgData', jsonBlob);

//       try {
//         const response = await axios.post('http://localhost:9090/api/registerOrg', formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         const result = response.data;

//         if (result.message === 'success&pending') {
//           showMessageCard(
//             'Your account request has been received!',
//             'We are currently verifying your information. Please check your email for updates.',
//             'info'
//           );
//         } else if (result.message === 'success&active') {
//           showMessageCard(
//             'Account Created Successfully!',
//             'You can now log in to your account.',
//             'success'
//           );
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           showMessageCard(
//             'Error',
//             'Something went wrong: ' + result.message,
//             'error'
//           );
//           setError(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         const errMsg =
//           'Something went wrong: ' +
//           (error.response?.data?.message || error.message);
//         showMessageCard('Error', errMsg, 'error');
//         setError(errMsg);
//       }
//     } else {
//       navigate('/login');
//     }
//   };

//   const roleOptions = [
//     { value: 'user', label: 'User (Buyer, Borrower, Lender, Seller)' },
//     { value: 'bookstore', label: 'Book Store' },
//     { value: 'organization', label: 'Organization' },
//     { value: 'delivery-agent', label: 'Delivery Agent' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//             <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
//             <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>BookHive</span></span>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="font-medium" style={{ color: '#407aff' }}
//             onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
//             onMouseOut={(e) => (e.target.style.color = '#407aff')}
//           >
//             Log in
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
//           <div className="mb-6">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   1
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   2
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   3
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(
//             step === 1 ? onSubmitStep1 : step === 2 ? onSubmitStep2 : onSubmitStep3
//           )}>
//             {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            
//             {step === 1 && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                       First Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="firstName"
//                         type="text"
//                         {...register('firstName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="John"
//                       />
//                       {errors.firstName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                       Last Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="lastName"
//                         type="text"
//                         {...register('lastName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="Doe"
//                       />
//                       {errors.lastName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="email"
//                       type="email"
//                       {...register('email')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="john.doe@example.com"
//                     />
//                     {errors.email && (
//                       <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                     Phone Number
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="phone"
//                       type="tel"
//                       {...register('phone')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123-456-7890"
//                     />
//                     {errors.phone && (
//                       <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="password"
//                         type="password"
//                         {...register('password')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.password && (
//                         <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                       Confirm Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="confirmPassword"
//                         type="password"
//                         {...register('confirmPassword')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.confirmPassword && (
//                         <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                     Address
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="address"
//                       type="text"
//                       {...register('address')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123 Main Street"
//                     />
//                     {errors.address && (
//                       <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                       City
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="city"
//                         type="text"
//                         {...register('city')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="New York"
//                       />
//                       {errors.city && (
//                         <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                       State
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="state"
//                         type="text"
//                         {...register('state')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="NY"
//                       />
//                       {errors.state && (
//                         <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
//                       Zip Code
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="zipCode"
//                         type="text"
//                         {...register('zipCode')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="10001"
//                       />
//                       {errors.zipCode && (
//                         <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                     </div>
//                   </div>
//                   <div className="mt-6">
//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                       onClick={() => navigate('/login')}
//                     >
//                       Google
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end">
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-4">
//                     Select Your Role
//                   </label>
//                   <div className="space-y-3">
//                     {roleOptions.map((option) => (
//                       <div key={option.value} className="flex items-center">
//                         <input
//                           id={option.value}
//                           type="radio"
//                           value={option.value}
//                           {...register('role')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor={option.value} className="ml-3 block text-sm text-gray-900">
//                           {option.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.role && (
//                     <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
//                   )}
//                 </div>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(1)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'user' && (
//               <>
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
//                     Date of Birth
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="dob"
//                       type="date"
//                       {...register('dob')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.dob && (
//                       <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="billImage" className="block text-sm font-medium text-gray-700">
//                     Bill Image (Address Proof)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="billImage"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('billImage')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.billImage && (
//                       <p className="mt-1 text-sm text-red-600">{errors.billImage.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="male"
//                         type="radio"
//                         value="male"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
//                         Male
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="female"
//                         type="radio"
//                         value="female"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
//                         Female
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="other"
//                         type="radio"
//                         value="other"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
//                         Other
//                       </label>
//                     </div>
//                   </div>
//                   {errors.gender && (
//                     <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'bookstore' && (
//               <>
//                 <div>
//                   <label htmlFor="storeRegistrationNo" className="block text-sm font-medium text-gray-700">
//                     Store Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="storeRegistrationNo"
//                       type="text"
//                       {...register('storeRegistrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="REG123456"
//                     />
//                     {errors.storeRegistrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.storeRegistrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYear" className="block text-sm font-medium text-gray-700">
//                     Running Year
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYear"
//                       type="number"
//                       {...register('runningYear')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="2020"
//                     />
//                     {errors.runningYear && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYear.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'organization' && (
//               <>
//                 <div>
//                   <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
//                     Organization Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="organizationType"
//                       {...register('organizationType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select organization type</option>
//                       <option value="nonprofit">Non-Profit</option>
//                       <option value="government">Government</option>
//                       <option value="educational">Educational Institution</option>
//                       <option value="library">Library</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {errors.organizationType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
//                     Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationNo"
//                       type="text"
//                       {...register('registrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="ORG123456"
//                     />
//                     {errors.registrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYears" className="block text-sm font-medium text-gray-700">
//                     Running Years
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYears"
//                       type="number"
//                       {...register('runningYears')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="5"
//                     />
//                     {errors.runningYears && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYears.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'delivery-agent' && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="age" className="block text-sm font-medium text-gray-700">
//                       Age
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="age"
//                         type="number"
//                         {...register('age')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="25"
//                       />
//                       {errors.age && (
//                         <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Gender
//                     </label>
//                     <div className="flex space-x-4">
//                       <div className="flex items-center">
//                         <input
//                           id="male-agent"
//                           type="radio"
//                           value="male"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="male-agent" className="ml-2 block text-sm text-gray-900">
//                           Male
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="female-agent"
//                           type="radio"
//                           value="female"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="female-agent" className="ml-2 block text-sm text-gray-900">
//                           Female
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="other-agent"
//                           type="radio"
//                           value="other"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="other-agent" className="ml-2 block text-sm text-gray-900">
//                           Other
//                         </label>
//                       </div>
//                     </div>
//                     {errors.gender && (
//                       <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic-agent"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic-agent" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport-agent"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport-agent" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="hub" className="block text-sm font-medium text-gray-700">
//                     Hub
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="hub"
//                       {...register('hub')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select hub</option>
//                       <option value="central">Central Hub</option>
//                       <option value="north">North Hub</option>
//                       <option value="south">South Hub</option>
//                       <option value="east">East Hub</option>
//                       <option value="west">West Hub</option>
//                     </select>
//                     {errors.hub && (
//                       <p className="mt-1 text-sm text-red-600">{errors.hub.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
//                     Vehicle Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="vehicleType"
//                       {...register('vehicleType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select vehicle type</option>
//                       <option value="bike">Bike</option>
//                       <option value="car">Car</option>
//                       <option value="van">Van</option>
//                       <option value="truck">Truck</option>
//                       <option value="bicycle">Bicycle</option>
//                     </select>
//                     {errors.vehicleType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleRC" className="block text-sm font-medium text-gray-700">
//                     Vehicle Registration Certificate (RC)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="vehicleRC"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('vehicleRC')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.vehicleRC && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleRC.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <input
//                       id="terms"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       required
//                     />
//                   </div>
//                   <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="font-medium text-gray-700">
//                       I agree to the Terms and Conditions
//                     </label>
//                     <p className="text-gray-500">
//                       By creating an account, you agree to our{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Privacy Policy
//                       </a>
//                       .
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { BookOpen } from 'lucide-react';
// import Button from '../../components/shared/Button';
// import axios from "axios";
// import { showMessageCard } from './MessageCard'; 

// const signupSchemaStep1 = z.object({
//   firstName: z.string().min(2, 'First Name must be at least 2 characters'),
//   lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email'),
//   phone: z.string()
//     .regex(/^\d+$/, 'Phone must contain only numbers')
//     .min(10, 'Phone must be at least 10 digits')
//     .max(10, 'Phone must not exceed 10 digits'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   confirmPassword: z.string().min(8, 'Confirm password must match'),
//   address: z.string().min(5, 'Address must be at least 5 characters'),
//   city: z.string().min(2, 'City must be at least 2 characters'),
//   state: z.string().min(2, 'State must be at least 2 characters'),
//   zipCode: z.string().min(5, 'Zip Code must be at least 5 characters'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Passwords do not match',
//   path: ['confirmPassword'],
// });

// const signupSchemaStep2 = z.object({
//   role: z.enum(['user', 'bookstore', 'organization', 'delivery-agent'], 'Please select a role'),
// });

// const userSchemaStep3 = z.object({
//   dob: z.string().min(1, 'Date of birth is required'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   billImage: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
// });

// const bookstoreSchemaStep3 = z.object({
//   storeRegistrationNo: z.string().min(1, 'Store Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYear: z.string().min(1, 'Running Year is required'),
// });

// const organizationSchemaStep3 = z.object({
//   organizationType: z.string().min(1, 'Organization Type is required'),
//   registrationNo: z.string().min(1, 'Registration No is required'),
//   registrationCopy: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
//   runningYears: z.string().min(1, 'Running Years is required'),
// });

// const deliveryAgentSchemaStep3 = z.object({
//   age: z.string().min(1, 'Age is required'),
//   gender: z.enum(['male', 'female', 'other'], 'Please select gender'),
//   idType: z.enum(['nic', 'passport'], 'Please select ID type'),
//   idFront: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   idBack: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png'].includes(file[0].type), 'Please upload a valid image (JPEG/PNG)'),
//   hub: z.string().min(1, 'Hub is required'),
//   vehicleType: z.string().min(1, 'Vehicle Type is required'),
//   vehicleRC: z.any().refine((file) => file && file[0] && ['image/jpeg', 'image/png', 'application/pdf'].includes(file[0].type), 'Please upload a valid image or PDF'),
// });

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});
//   const [selectedRole, setSelectedRole] = useState('');

//   const getSchemaForStep = () => {
//     if (step === 1) return signupSchemaStep1;
//     if (step === 2) return signupSchemaStep2;
//     if (step === 3) {
//       switch (selectedRole) {
//         case 'user': return userSchemaStep3;
//         case 'bookstore': return bookstoreSchemaStep3;
//         case 'organization': return organizationSchemaStep3;
//         case 'delivery-agent': return deliveryAgentSchemaStep3;
//         default: return userSchemaStep3;
//       }
//     }
//     return signupSchemaStep1;
//   };

//   const { register, handleSubmit, formState: { errors }, reset } = useForm({
//     resolver: zodResolver(getSchemaForStep()),
//   });
//   const [error, setError] = useState('');

//   const onSubmitStep1 = (data) => {
//     setFormData({ ...formData, ...data });
//     setStep(2);
//     reset();
//   };

//   const onSubmitStep2 = (data) => {
//     setFormData({ ...formData, ...data });
//     setSelectedRole(data.role);
//     setStep(3);
//     reset();
//   };


//   const onSubmitStep3 = async (data) => {
//     const allData = { ...formData, ...data };
//     setFormData(allData);
  
//     if (selectedRole === 'organization') {
//       const registrationCopyFile = allData.registrationCopy?.[0];
  
//       if (!registrationCopyFile) {
//         setError('Registration copy is required');
//         alert('Registration copy is required');
//         return;
//       }
  
//       // 📦 Create FormData and append JSON + file
//       const formDataToSend = new FormData();
      
//       // Append file
//       formDataToSend.append('registrationCopyFile', registrationCopyFile);
  
//       // Create JSON and append as Blob
//       const orgData = {
//         type: allData.organizationType,
//         reg_no: allData.registrationNo,
//         fname: allData.firstName,
//         lname: allData.lastName,
//         email: allData.email,
//         password: allData.password,
//         phone: parseInt(allData.phone.slice(0, 10), 10),
//         years: parseInt(allData.runningYears, 10),
//         address: allData.address,
//         city: allData.city,
//         state: allData.state,
//         zip: allData.zipCode
//       };
  
//       const jsonBlob = new Blob([JSON.stringify(orgData)], {
//         type: 'application/json'
//       });
  
//       formDataToSend.append('orgData', jsonBlob);
  
//       try {
//         const response = await axios.post('http://localhost:9090/api/registerOrg', formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
  
//         const result = response.data;

//         if (result.message === 'success&pending') {
//           // Show card for pending verification
//           showMessageCard(
//             'Your account request has been received!',
//             'We are currently verifying your information. Please check your email for updates.',
//             'info'
//           );
//         } else if (result.message === 'success&active') {
//           // Show card for successful account creation
//           showMessageCard(
//             'Account Created Successfully!',
//             'You can now log in to your account.',
//             'success'
//           );
//           setTimeout(() => navigate('/login'), 2000);
//         } else {
//           // Any other response, treat as error
//           showMessageCard(
//             'Error',
//             'Something went wrong: ' + result.message,
//             'error'
//           );
//           setError(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         const errMsg =
//           'Something went wrong: ' +
//           (error.response?.data?.message || error.message);
//         showMessageCard('Error', errMsg, 'error');
//         setError(errMsg);
//       }
    
//     } 

//     if (selectedRole === 'user') {
//     const idFrontFile = allData.idFront?.[0];
//     const idBackFile = allData.idBack?.[0];
//     const billImageFile = allData.billImage?.[0];

//     // Validate file uploads
//     if (!idFrontFile || !idBackFile || !billImageFile) {
//       setError('ID Front, ID Back, and Bill Image are required');
//       alert('ID Front, ID Back, and Bill Image are required');
//       return;
//     }

//     // 📦 Create FormData and append JSON + files
//     const formDataToSend = new FormData();

//     // Append files
//     formDataToSend.append('idFront', idFrontFile);
//     formDataToSend.append('idBack', idBackFile);
//     formDataToSend.append('billImage', billImageFile);

//     // Create JSON and append as Blob
//     const userData = {
//       email: allData.email,
//       password: allData.password,
//       fname: allData.firstName,
//       lname: allData.lastName,
//       phone: parseInt(allData.phone.slice(0, 10), 10),
//       dob: allData.dob,
//       idType: allData.idType,
//       gender: allData.gender,
//       address: allData.address,
//       city: allData.city,
//       state: allData.state,
//       zip: allData.zipCode,
//     };

//     const jsonBlob = new Blob([JSON.stringify(userData)], {
//       type: 'application/json',
//     });

//     formDataToSend.append('userData', jsonBlob);

//     try {
//       const response = await axios.post(
//         'http://localhost:9090/api/registerUser',
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       const result = response.data;

//       if (result.message === 'success&pending') {
//         // Show card for pending verification
//         showMessageCard(
//           'Your account request has been received!',
//           'We are currently verifying your information. Please check your email for updates.',
//           'info'
//         );
//       } else if (result.message === 'success&active') {
//         // Show card for successful account creation
//         showMessageCard(
//           'Account Created Successfully!',
//           'You can now log in to your account.',
//           'success'
//         );
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         // Any other response, treat as error
//         showMessageCard(
//           'Error',
//           'Something went wrong: ' + result.message,
//           'error'
//         );
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       const errMsg =
//         'Something went wrong: ' +
//         (error.response?.data?.message || error.message);
//       showMessageCard('Error', errMsg, 'error');
//       setError(errMsg);
//     }
//   } 
  
//     else {
//     navigate('/login');
//   }
//   };
  
  
  
  

//   const roleOptions = [
//     { value: 'user', label: 'User (Buyer, Borrower, Lender, Seller)' },
//     { value: 'bookstore', label: 'Book Store' },
//     { value: 'organization', label: 'Organization' },
//     { value: 'delivery-agent', label: 'Delivery Agent' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="flex items-center text-3xl font-bold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//             <BookOpen className="mr-2" style={{ color: '#ffd639' }} size={32} />
//             <span><span style={{ color: '#2563eb' }}>Book</span><span style={{ color: '#FFC107' }}>BookHive</span></span>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="font-medium" style={{ color: '#407aff' }}
//             onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
//             onMouseOut={(e) => (e.target.style.color = '#407aff')}
//           >
//             Log in
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 transition-all duration-200">
//           <div className="mb-6">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   1
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   2
//                 </div>
//                 <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
//                   3
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form className="space-y-6" onSubmit={handleSubmit(
//             step === 1 ? onSubmitStep1 : step === 2 ? onSubmitStep2 : onSubmitStep3
//           )}>
//             {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            
//             {step === 1 && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                       First Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="firstName"
//                         type="text"
//                         {...register('firstName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="John"
//                       />
//                       {errors.firstName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                       Last Name
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="lastName"
//                         type="text"
//                         {...register('lastName')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="Doe"
//                       />
//                       {errors.lastName && (
//                         <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="email"
//                       type="email"
//                       {...register('email')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="john.doe@example.com"
//                     />
//                     {errors.email && (
//                       <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                     Phone Number
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="phone"
//                       type="tel"
//                       {...register('phone')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123-456-7890"
//                     />
//                     {errors.phone && (
//                       <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="password"
//                         type="password"
//                         {...register('password')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.password && (
//                         <p class courage="mt-1 text-sm text-red-600">{errors.password.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                       Confirm Password
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="confirmPassword"
//                         type="password"
//                         {...register('confirmPassword')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5 twistDB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="••••••••"
//                       />
//                       {errors.confirmPassword && (
//                         <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                     Address
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="address"
//                       type="text"
//                       {...register('address')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="123 Main Street"
//                     />
//                     {errors.address && (
//                       <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                       City
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="city"
//                         type="text"
//                         {...register('city')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="New York"
//                       />
//                       {errors.city && (
//                         <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                       State
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="state"
//                         type="text"
//                         {...register('state')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="NY"
//                       />
//                       {errors.state && (
//                         <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
//                       Zip Code
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="zipCode"
//                         type="text"
//                         {...register('zipCode')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="10001"
//                       />
//                       {errors.zipCode && (
//                         <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300" />
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                     </div>
//                   </div>
//                   <div className="mt-6">
//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                       onClick={() => navigate('/login')}
//                     >
//                       Google
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end">
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-4">
//                     Select Your Role
//                   </label>
//                   <div className="space-y-3">
//                     {roleOptions.map((option) => (
//                       <div key={option.value} className="flex items-center">
//                         <input
//                           id={option.value}
//                           type="radio"
//                           value={option.value}
//                           {...register('role')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor={option.value} className="ml-3 block text-sm text-gray-900">
//                           {option.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.role && (
//                     <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
//                   )}
//                 </div>
//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(1)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Next
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'user' && (
//               <>
//                 <div>
//                   <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
//                     Date of Birth
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="dob"
//                       type="date"
//                       {...register('dob')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.dob && (
//                       <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="billImage" className="block text-sm font-medium text-gray-700">
//                     Bill Image (Address Proof)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="billImage"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('billImage')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.billImage && (
//                       <p className="mt-1 text-sm text-red-600">{errors.billImage.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="male"
//                         type="radio"
//                         value="male"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
//                         Male
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="female"
//                         type="radio"
//                         value="female"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
//                         Female
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="other"
//                         type="radio"
//                         value="other"
//                         {...register('gender')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="other" className="ml-2 block text-sm text-gray-900">
//                         Other
//                       </label>
//                     </div>
//                   </div>
//                   {errors.gender && (
//                     <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'bookstore' && (
//               <>
//                 <div>
//                   <label htmlFor="storeRegistrationNo" className="block text-sm font-medium text-gray-700">
//                     Store Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="storeRegistrationNo"
//                       type="text"
//                       {...register('storeRegistrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="REG123456"
//                     />
//                     {errors.storeRegistrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.storeRegistrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYear" className="block text-sm font-medium text-gray-700">
//                     Running Year
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYear"
//                       type="number"
//                       {...register('runningYear')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="2020"
//                     />
//                     {errors.runningYear && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYear.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'organization' && (
//               <>
//                 <div>
//                   <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
//                     Organization Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="organizationType"
//                       {...register('organizationType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select organization type</option>
//                       <option value="nonprofit">Non-Profit</option>
//                       <option value="government">Government</option>
//                       <option value="educational">Educational Institution</option>
//                       <option value="library">Library</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {errors.organizationType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.organizationType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
//                     Registration No
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationNo"
//                       type="text"
//                       {...register('registrationNo')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="ORG123456"
//                     />
//                     {errors.registrationNo && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationNo.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="registrationCopy" className="block text-sm font-medium text-gray-700">
//                     Registration Copy
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="registrationCopy"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('registrationCopy')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.registrationCopy && (
//                       <p className="mt-1 text-sm text-red-600">{errors.registrationCopy.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="runningYears" className="block text-sm font-medium text-gray-700">
//                     Running Years
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="runningYears"
//                       type="number"
//                       {...register('runningYears')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       placeholder="5"
//                     />
//                     {errors.runningYears && (
//                       <p className="mt-1 text-sm text-red-600">{errors.runningYears.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && selectedRole === 'delivery-agent' && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="age" className="block text-sm font-medium text-gray-700">
//                       Age
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="age"
//                         type="number"
//                         {...register('age')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                         placeholder="25"
//                       />
//                       {errors.age && (
//                         <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Gender
//                     </label>
//                     <div className="flex space-x-4">
//                       <div className="flex items-center">
//                         <input
//                           id="male-agent"
//                           type="radio"
//                           value="male"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="male-agent" className="ml-2 block text-sm text-gray-900">
//                           Male
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="female-agent"
//                           type="radio"
//                           value="female"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="female-agent" className="ml-2 block text-sm text-gray-900">
//                           Female
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="other-agent"
//                           type="radio"
//                           value="other"
//                           {...register('gender')}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         />
//                         <label htmlFor="other-agent" className="ml-2 block text-sm text-gray-900">
//                           Other
//                         </label>
//                       </div>
//                     </div>
//                     {errors.gender && (
//                       <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     ID Type
//                   </label>
//                   <div className="flex space-x-4">
//                     <div className="flex items-center">
//                       <input
//                         id="nic-agent"
//                         type="radio"
//                         value="nic"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="nic-agent" className="ml-2 block text-sm text-gray-900">
//                         NIC
//                       </label>
//                     </div>
//                     <div className="flex items-center">
//                       <input
//                         id="passport-agent"
//                         type="radio"
//                         value="passport"
//                         {...register('idType')}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <label htmlFor="passport-agent" className="ml-2 block text-sm text-gray-900">
//                         Passport
//                       </label>
//                     </div>
//                   </div>
//                   {errors.idType && (
//                     <p className="mt-1 text-sm text-red-600">{errors.idType.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="idFront" className="block text-sm font-medium text-gray-700">
//                       ID Front
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idFront"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idFront')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idFront && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idFront.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="idBack" className="block text-sm font-medium text-gray-700">
//                       ID Back
//                     </label>
//                     <div className="mt-1">
//                       <input
//                         id="idBack"
//                         type="file"
//                         accept="image/jpeg,image/png"
//                         {...register('idBack')}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                         style={{ borderColor: '#D1D5DB' }}
//                         onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                         onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                       />
//                       {errors.idBack && (
//                         <p className="mt-1 text-sm text-red-600">{errors.idBack.message}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="hub" className="block text-sm font-medium text-gray-700">
//                     Hub
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="hub"
//                       {...register('hub')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select hub</option>
//                       <option value="central">Central Hub</option>
//                       <option value="north">North Hub</option>
//                       <option value="south">South Hub</option>
//                       <option value="east">East Hub</option>
//                       <option value="west">West Hub</option>
//                     </select>
//                     {errors.hub && (
//                       <p className="mt-1 text-sm text-red-600">{errors.hub.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
//                     Vehicle Type
//                   </label>
//                   <div className="mt-1">
//                     <select
//                       id="vehicleType"
//                       {...register('vehicleType')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     >
//                       <option value="">Select vehicle type</option>
//                       <option value="bike">Bike</option>
//                       <option value="car">Car</option>
//                       <option value="van">Van</option>
//                       <option value="truck">Truck</option>
//                       <option value="bicycle">Bicycle</option>
//                     </select>
//                     {errors.vehicleType && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="vehicleRC" className="block text-sm font-medium text-gray-700">
//                     Vehicle Registration Certificate (RC)
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="vehicleRC"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       {...register('vehicleRC')}
//                       className="w-full px-3 py-2 border rounded-lg focus:outline-none"
//                       style={{ borderColor: '#D1D5DB' }}
//                       onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
//                       onBlur={(e) => (e.target.style.boxShadow = 'none')}
//                     />
//                     {errors.vehicleRC && (
//                       <p className="mt-1 text-sm text-red-600">{errors.vehicleRC.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button type="button" variant="secondary" onClick={() => setStep(2)}>
//                     Back
//                   </Button>
//                   <Button type="submit" variant="primary">
//                     Submit
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 3 && (
//               <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <input
//                       id="terms"
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       required
//                     />
//                   </div>
//                   <div className="ml-3 text-sm">
//                     <label htmlFor="terms" className="font-medium text-gray-700">
//                       I agree to the Terms and Conditions
//                     </label>
//                     <p className="text-gray-500">
//                       By creating an account, you agree to our{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-blue-600 hover:text-blue-500">
//                         Privacy Policy
//                       </a>
//                       .
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;
