import { 
  Plus, Edit, Trash2, Search, BookOpen, X, Star, MapPin, 
  Clock, Heart, Share2, MessageCircle, Filter, Grid, List,
  Users, Award, Calendar, TrendingUp, Eye, ShoppingCart,
  Menu, Home, Settings, Bell, User, ChevronLeft, ChevronRight,
  Download, Upload, BarChart3, Target, Bookmark, Gift
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../components/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LazyImage from "../../components/LazyImage";
import imageCache from "../../utils/imageCache";

const BookListingManagementPage = () => {
  const { user } = useAuth();
  const baseUrl = 'http://localhost:9090';
  const [listings, setListings] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Preload images for better performance
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
  }, [baseUrl]);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/getBooks`, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Fixed placeholder image - using a simple gray rectangle
      const placeholder = "data:image/svg+xml,%3csvg width='150' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='200' fill='%236B7280'/%3e%3ctext x='75' y='100' text-anchor='middle' fill='%23FFFFFF' font-size='14'%3eNo Image%3c/text%3e%3c/svg%3e";
      
      // Only show books for the logged-in user
      const tempBooks = response.data.filter(book => user && book.userEmail === user.email).map((book, index) => {
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
        images: [],
        cover: placeholder, // LazyImage will handle the actual loading
        bookImage: book.bookImage || null,
        views: book.views || 0,
        wishlistedBy: book.wishlistedBy || 0,
        trustScore: book.trustScore || 0,
        reviews: book.reviews || 0,
        status: book.status || 'active',
        };
      });
      setListings(tempBooks);
      setTimeout(() => {
        preloadImages(tempBooks);
      }, 1000);
    } catch (err) {
      toast.error(`Failed to fetch books: ${err.message}`);
    }
  }, [baseUrl, preloadImages, user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Update newBook email when user changes
  useEffect(() => {
    if (user?.email) {
      setNewBook(prev => ({
        ...prev,
        userEmail: user.email
      }));
    }
  }, [user]);

  // Clear cache when user logs out
  useEffect(() => {
    if (!user) {
      imageCache.clear();
    }
  }, [user]);

  const [newBook, setNewBook] = useState({
    userEmail: user?.email || '',
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
    forBidding: false,
    biddingStartDate: '',
    biddingEndDate: '',
    initialBidPrice: '',
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
    // Check if user is logged in
    if (!user?.email) {
      toast.error("Please log in to add a book.");
      return;
    }

    // Reset form for new book
    setNewBook({
      userEmail: user.email,
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
      forBidding: false,
      biddingStartDate: '',
      biddingEndDate: '',
      initialBidPrice: '',
      description: '',
      location: '',
      publishYear: '',
      isbn: '',
      language: 'English',
      hashtags: [],
      cover: '',
      imageFile: null,
    });
    setEditBook(null); // Make sure we're in add mode
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    // Check if user is logged in
    if (!user?.email) {
      toast.error("Please log in to edit a book.");
      return;
    }

    // Populate form with existing book data
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
      forBidding: book.forBidding || false,
      biddingStartDate: book.biddingStartDate ? new Date(book.biddingStartDate).toISOString().slice(0, 16) : '',
      biddingEndDate: book.biddingEndDate ? new Date(book.biddingEndDate).toISOString().slice(0, 16) : '',
      initialBidPrice: book.initialBidPrice || '',
      description: book.description,
      location: book.location,
      publishYear: book.publishYear,
      isbn: book.isbn,
      language: book.language,
      hashtags: book.hashtags ? book.hashtags : [],
      cover: book.cover || '',
      imageFile: null, // No new image selected initially
    });
    setEditBook(book); // Set edit mode
    setShowEditModal(true);
  };

  const handleAddNewBook = async (bookData) => {
    try {
      // The backend expects @RequestPart("coverImage") and @RequestPart("bookData")
      const formDataToSend = new FormData();
      
      // Add image file as "coverImage" (required for new books)
      if (newBook.imageFile) {
        formDataToSend.append('coverImage', newBook.imageFile);
      } else {
        // Backend might require an image, so show error if missing
        toast.error("Please upload a book cover image.");
        throw new Error("Book cover image is required");
      }
      
      // Spring Boot @RequestPart("bookData") UserBooksDTO expects JSON with proper content-type
      const bookDataBlob = new Blob([JSON.stringify(bookData)], {
        type: 'application/json'
      });
      formDataToSend.append('bookData', bookDataBlob);
      
      const response = await axios.post(
        `${baseUrl}/api/saveBook-User`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error adding new book:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 405) {
        toast.error('Invalid request method. The endpoint might not support this operation.');
      } else if (error.response?.status === 415) {
        toast.error('The server doesn\'t support this data format. Make sure the image and data are properly formatted.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid book data. Please check all fields and try again.');
      } else if (error.message === "Book cover image is required") {
        // Don't show additional toast, already shown above
      } else {
        toast.error('Failed to add book. Please try again.');
      }
      throw error;
    }
  };

  const handleUpdateBookWithImage = async (bookData) => {
    try {
      const formDataToSend = new FormData();
      
      // Add image file as "coverImage" (optional for updates)
      if (newBook.imageFile) {
        formDataToSend.append('coverImage', newBook.imageFile);
      }
      
      // Add book data as "bookData" - Spring Boot expects this as a JSON part
      const bookDataBlob = new Blob([JSON.stringify(bookData)], {
        type: 'application/json'
      });
      formDataToSend.append('bookData', bookDataBlob);
      
      const response = await axios.put(
        `${baseUrl}/api/updateBookWithImage/${editBook.bookId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error updating book with image:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 404) {
        toast.error('Book not found. It may have been deleted.');
      } else if (error.response?.status === 405) {
        toast.error('Invalid request method for image update.');
      } else if (error.response?.status === 415) {
        toast.error('The server doesn\'t support this data format. Make sure the image and data are properly formatted.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid book data. Please check all fields and try again.');
      } else {
        toast.error('Failed to update book with image. Please try again.');
      }
      throw error;
    }
  };

  const handleUpdateBookWithoutImage = async (bookData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/updateBook/${editBook.bookId}`,
        bookData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error updating book without image:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 404) {
        toast.error('Book not found. It may have been deleted.');
      } else if (error.response?.status === 405) {
        toast.error('Invalid request method for book update. Please contact support.');
      } else {
        toast.error('Failed to update book. Please try again.');
      }
      throw error;
    }
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();

    // Validate user authentication
    if (!user?.email) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    // Validate required fields
    if (!newBook.title.trim()) {
      toast.error("Book title is required.");
      return;
    }

    if (!newBook.author.trim()) {
      toast.error("Author name is required.");
      return;
    }

    // For new books, image is required
    if (!editBook && !newBook.imageFile) {
      toast.error("Please upload a book cover image.");
      return;
    }

    // Prepare book data
    const bookData = {
      userEmail: user.email,
      title: newBook.title.trim(),
      authors: newBook.author.split(",").map(a => a.trim()).filter(a => a),
      genres: newBook.genre,
      condition: newBook.condition,
      forSale: newBook.forSale,
      price: newBook.forSale ? parseFloat(newBook.price || 0) : 0,
      forLend: newBook.forLend,
      lendingAmount: newBook.forLend ? parseFloat(newBook.lendingAmount || 0) : 0,
      lendingPeriod: newBook.forLend ? parseInt(newBook.lendingPeriod || 0) : 0,
      forExchange: newBook.forExchange,
      exchangePeriod: newBook.forExchange ? parseInt(newBook.exchangePeriod || 0) : 0,
      forBidding: newBook.forBidding,
      initialBidPrice: newBook.forBidding ? parseFloat(newBook.initialBidPrice || 0) : 0,
      biddingStartDate: newBook.forBidding ? newBook.biddingStartDate : "",
      biddingEndDate: newBook.forBidding ? newBook.biddingEndDate : "",
      description: newBook.description.trim(),
      location: newBook.location.trim(),
      publishYear: newBook.publishYear.trim(),
      isbn: newBook.isbn.trim(),
      language: newBook.language,
      hashtags: newBook.hashtags
    };

    if (editBook) {
      bookData.bookId = editBook.bookId;
    }

    // Show loading toast
    const toastId = editBook ? "book-update" : "book-upload";
    const loadingMessage = editBook ? "📝 Updating your book..." : "📤 Adding your book to the library...";
    
    toast.info(loadingMessage, { toastId });

    try {
      let response;
      
      if (editBook) {
        // UPDATE EXISTING BOOK
        if (newBook.imageFile) {
          // Update with new image using PUT endpoint
          response = await handleUpdateBookWithImage(bookData);
        } else {
          // Update without changing image using POST endpoint
          response = await handleUpdateBookWithoutImage(bookData);
        }
      } else {
        // ADD NEW BOOK
        response = await handleAddNewBook(bookData);
      }

      // Dismiss loading toast
      toast.dismiss(toastId);

      // Handle response
      if (response.data.message === "success" || response.status === 200) {
        // Enhanced success messages with more details
        if (editBook) {
          toast.success(`🎉 Success! "${newBook.title}" has been updated successfully!`, {
            duration: 4000
          });
        } else {
          toast.success(`📚 Success! "${newBook.title}" has been added to your library!`, {
            duration: 4000
          });
        }
        
        // Close modals and reset state
        setShowAddModal(false);
        setShowEditModal(false);
        setEditBook(null);
        
        // Reset form state
        setNewBook({
          userEmail: user?.email || '',
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
          forBidding: false,
          biddingStartDate: '',
          biddingEndDate: '',
          initialBidPrice: '',
          description: '',
          location: '',
          publishYear: '',
          isbn: '',
          language: 'English',
          hashtags: [],
          cover: '',
          imageFile: null,
        });
        
        // Clear cache if needed
        if (response.data.bookImage) {
          imageCache.delete(response.data.bookImage, 'userBooks');
        }
        
        // Refresh the book list
        fetchBooks();
      } else {
        toast.error("❌ Failed to save book: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving book:", error);
      
      // Dismiss loading toast
      toast.dismiss(toastId);
      
      // Simplified error handling with cleaner messages
      if (error.response?.status === 401) {
        toast.error("❌ Session expired. Please log in again.", { duration: 5000 });
      } else if (error.response?.status === 400) {
        toast.error("❌ Invalid book data. Please check all required fields.", { duration: 5000 });
      } else if (error.response?.status === 413) {
        toast.error("❌ File too large for upload. Please use a smaller image (max 5MB).", { duration: 5000 });
      } else if (error.response?.status === 500) {
        toast.error("❌ Server error. Please try again later.", { duration: 5000 });
      } else if (error.message.includes('Network Error')) {
        toast.error("❌ Network error. Please check your connection and try again.", { duration: 5000 });
      } else if (error.message === "Book cover image is required") {
        // Don't show additional toast, already shown in handleAddNewBook
      } else {
        toast.error(`❌ Failed to ${editBook ? 'update' : 'add'} book. Please try again.`, { duration: 5000 });
      }
    }
  };

  const handleDeleteBook = async (id) => {
    // Find the book title for better user feedback
    const bookToDelete = listings.find(book => book.bookId === id);
    const bookTitle = bookToDelete?.title || 'this book';
    
    if (window.confirm(`⚠️ Delete Book Confirmation\n\nAre you sure you want to permanently delete "${bookTitle}" from your library?\n\nThis action cannot be undone.`)) {
      // Show loading toast for delete operation
      toast.info(`🗑️ Deleting "${bookTitle}"...`, { 
        autoClose: false,
        toastId: `delete-${id}`
      });
      
      try {
        const response = await axios.delete(`${baseUrl}/api/deleteBook/${id}`);
        
        // Dismiss loading toast
        toast.dismiss(`delete-${id}`);
        
        if (response.data.message === "success") {
          // Remove from local state immediately for better UX
          setListings(listings.filter((book) => book.bookId !== id));
          
          // Show success message
          toast.success(`🗑️ Success! "${bookTitle}" has been deleted from your library!`, {
            duration: 4000
          });
        } else {
          toast.error(`❌ Failed to delete "${bookTitle}": ${response.data.message}`, {
            duration: 5000
          });
        }
      } catch (err) {
        // Dismiss loading toast
        toast.dismiss(`delete-${id}`);
        
        console.error('Delete error:', err);
        
        if (err.response?.status === 401) {
          toast.error("❌ Session expired. Please log in again.", { duration: 5000 });
        } else if (err.response?.status === 404) {
          toast.error(`❌ Book "${bookTitle}" not found. It may have already been deleted.`, { duration: 5000 });
        } else {
          toast.error(`❌ Failed to delete "${bookTitle}". Please try again.`, { duration: 5000 });
        }
      }
    }
  };

  const filteredListings = listings.filter((book) => {
  // Only show books owned by the logged-in user
  const isOwner = user && book.userEmail === user.email;
  const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
  const matchesGenre = !filterGenre || book.genres.includes(filterGenre);
  const matchesCondition = !filterCondition || book.condition === filterCondition;
  return isOwner && matchesSearch && matchesGenre && matchesCondition;
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

  const BookCard = ({ book }) => {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
          {book.bookImage ? (
            <LazyImage
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        <button
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-sm z-10"
          title="Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        {(book.forSale || book.forLend || book.forExchange || book.forBidding) && (
          <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
            {book.forSale && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">For Sale</span>}
            {book.forLend && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">For Lending</span>}
            {book.forExchange && <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">For Exchange</span>}
            {book.forBidding && <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">For Bidding</span>}
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
          {book.forBidding && book.initialBidPrice && <div className="text-right"><p className="text-lg font-bold text-orange-600">Start: Rs. {book.initialBidPrice}</p></div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forSale ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>{book.forSale ? "For Sale" : "Not for Sale"}</span>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forLend ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{book.forLend ? "For Lending" : "Not for Lending"}</span>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forExchange ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"}`}>{book.forExchange ? "For Exchange" : "Not for Exchange"}</span>
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${book.forBidding ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-600"}`}>{book.forBidding ? "For Bidding" : "Not for Bidding"}</span>
        </div>
        {(book.forLend || book.forExchange || book.forBidding) && (
          <div className="bg-gray-50 rounded-lg p-3 text-xs">
            {book.forLend && book.lendingAmount && <div className="mb-1"><span className="font-medium text-gray-700">Lending Fee:</span> Rs. {book.lendingAmount}</div>}
            {book.forLend && book.lendingPeriod && <div className="mb-1"><span className="font-medium text-gray-700">Lending Period:</span> {book.lendingPeriod} days</div>}
            {book.forExchange && book.exchangePeriod && <div className="mb-1"><span className="font-medium text-gray-700">Exchange Period:</span> {book.exchangePeriod} days</div>}
            {book.forBidding && (
              <div className="space-y-1">
                {book.initialBidPrice && <div><span className="font-medium text-gray-700">Starting Bid:</span> Rs. {book.initialBidPrice}</div>}
                {book.biddingStartDate && <div><span className="font-medium text-gray-700">Auction Start:</span> {new Date(book.biddingStartDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>}
                {book.biddingEndDate && <div><span className="font-medium text-gray-700">Auction End:</span> {new Date(book.biddingEndDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>}
              </div>
            )}
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
  };

  const stats = {
    totalBooks: listings.length,
    activeListings: listings.filter(b => b.status === 'active').length,
    forSale: listings.filter(b => b.forSale).length,
    forLend: listings.filter(b => b.forLend).length,
    forExchange: listings.filter(b => b.forExchange).length,
    forBidding: listings.filter(b => b.forBidding).length,
    totalViews: listings.reduce((sum, book) => sum + (book.views || 0), 0),
    totalWishlists: listings.reduce((sum, book) => sum + (book.wishlistedBy || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Books</h1>
              <p className="text-blue-100 text-lg">Manage Your books to lend, sell or exchange</p>
            </div>
            <button 
              onClick={handleAddBook} 
              disabled={!user}
              className={`${user ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-medium`}
            >
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.forBidding}</div>
              <div className="text-sm text-amber-600">For Bidding</div>
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
        {!user ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center border border-gray-200">
            <User size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Please log in to view your books</h3>
            <p className="text-gray-500">You need to be logged in to manage your book listings</p>
          </div>
        ) : sortedListings.length > 0 ? (
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
              <button 
                onClick={handleAddBook} 
                disabled={!user}
                className={`${user ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-6 py-3 rounded-xl transition-colors`}
              >
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
                            // Validate file type (Google Drive compatible image formats)
                            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                            if (!allowedTypes.includes(file.type)) {
                              toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                              e.target.value = ''; // Clear the input
                              return;
                            }
                            
                            // Validate file size (5MB limit for Google Drive efficiency)
                            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                            if (file.size > maxSize) {
                              toast.error('File size must be less than 5MB for Google Drive upload');
                              e.target.value = ''; // Clear the input
                              return;
                            }
                            
                            // Generate preview for user
                            const reader = new FileReader();
                            reader.onload = () => {
                              setNewBook({ ...newBook, imageFile: file, cover: reader.result });
                            };
                            reader.onerror = () => {
                              toast.error('Failed to read image file');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                        required={!editBook}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editBook ? 
                          'Upload a new image to replace the current book cover (optional)' : 
                          'Upload a clear image of the book cover (JPEG, PNG, max 5MB)'
                        }
                      </p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lending Period (Days)</label>
                            <input
                              type="number"
                              value={newBook.lendingPeriod}
                              onChange={(e) => setNewBook({ ...newBook, lendingPeriod: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              placeholder="Enter number of days (e.g., 7, 14, 30)"
                              min="1"
                              max="365"
                            />
                            <p className="text-xs text-gray-500 mt-1">How many days you want to lend this book</p>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Period (Days)</label>
                          <input
                            type="number"
                            value={newBook.exchangePeriod}
                            onChange={(e) => setNewBook({ ...newBook, exchangePeriod: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter number of days (e.g., 30, 45, 60)"
                            min="1"
                            max="365"
                          />
                          <p className="text-xs text-gray-500 mt-1">How many days you want to exchange books</p>
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={newBook.forBidding}
                          onChange={(e) => setNewBook({ ...newBook, forBidding: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Available for Bidding</span>
                      </label>
                      {newBook.forBidding && (
                        <div className="ml-7 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Bid Price (LKR)</label>
                            <input
                              type="number"
                              value={newBook.initialBidPrice}
                              onChange={(e) => setNewBook({ ...newBook, initialBidPrice: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              placeholder="Starting bid amount"
                              min="0"
                              step="10"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum starting bid amount</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bidding Start Date & Time</label>
                            <input
                              type="datetime-local"
                              value={newBook.biddingStartDate}
                              onChange={(e) => setNewBook({ ...newBook, biddingStartDate: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              min={new Date().toISOString().slice(0, 16)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bidding End Date & Time</label>
                            <input
                              type="datetime-local"
                              value={newBook.biddingEndDate}
                              onChange={(e) => setNewBook({ ...newBook, biddingEndDate: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              min={newBook.biddingStartDate || new Date().toISOString().slice(0, 16)}
                            />
                          </div>
                          <p className="text-xs text-gray-500">Set the auction start and end times for this book</p>
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