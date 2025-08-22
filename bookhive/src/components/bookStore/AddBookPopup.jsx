import React, { useState } from 'react';
import { Plus, X, Upload, Calendar, MapPin } from 'lucide-react';

const AddBookPopup = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    authors: '',
    genres: '',
    imageUrls: '',
    condition: 'NEW',
    description: '',
    status: 'AVAILABLE',
    listingType: 'SELL_ONLY',
    sellingPrice: '',
    lendingPrice: '',
    depositAmount: '',
    isbn: '',
    publisher: '',
    publishedYear: '',
    language: 'English',
    pageCount: '',
    lendingPeriod: 7,
    bookCount: 1,
    tags: '',
    seriesName: '',
    seriesNumber: '',
    totalBooksInSeries: '',
    cover: '',
    location: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setNewBook(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveBook = async () => {
    // Basic validation
    if (!newBook.title.trim()) {
      alert('Please enter a book title');
      return;
    }
    if (!newBook.authors.trim()) {
      alert('Please enter at least one author');
      return;
    }
    if (!newBook.genres.trim()) {
      alert('Please enter at least one genre');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare DTO matching your entity structure
      const dto = {
        title: newBook.title.trim(),
        authors: newBook.authors.split(',').map(author => author.trim()).filter(author => author),
        genres: newBook.genres.split(',')
          .map(genre => genre.trim())
          .filter(genre => genre.charAt(0).toUpperCase() + genre.slice(1)),
        imageUrls: newBook.imageUrls ? [newBook.imageUrls] : [],
        condition: newBook.condition,
        description: newBook.description.trim(),
        status: newBook.status,
        listingType: newBook.listingType,
        pricing: JSON.stringify({
          ...(newBook.sellingPrice && { sellingPrice: parseFloat(newBook.sellingPrice) }),
          ...(newBook.lendingPrice && { lendingPrice: parseFloat(newBook.lendingPrice) }),
          ...(newBook.depositAmount && { depositAmount: parseFloat(newBook.depositAmount) })
        }),
        isbn: newBook.isbn.trim(),
        publisher: newBook.publisher.trim(),
        publishedYear: newBook.publishedYear ? parseInt(newBook.publishedYear) : null,
        language: newBook.language,
        pageCount: newBook.pageCount ? parseInt(newBook.pageCount) : null,
        lendingPeriod: newBook.lendingPeriod,
        bookCount: newBook.bookCount,
        tags: newBook.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        seriesInfo: newBook.seriesName ? JSON.stringify({
          series: newBook.seriesName,
          seriesNumber: newBook.seriesNumber ? parseInt(newBook.seriesNumber) : null,
          totalBooks: newBook.totalBooksInSeries ? parseInt(newBook.totalBooksInSeries) : null
        }) : null
      };

      console.log('Book data to submit:', dto);

      // Submit to API
      const response = await fetch('http://localhost:9090/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '1', // Replace with actual user ID from your auth system
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // If using JWT
        },
        body: JSON.stringify(dto)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const createdBook = await response.json();
      console.log('Book created successfully:', createdBook);
      
      // Show success message
      alert('Book added successfully!');
      
      // Reset form and close modal
      setNewBook({
        title: '',
        authors: '',
        genres: '',
        imageUrls: '',
        condition: 'NEW',
        description: '',
        status: 'AVAILABLE',
        listingType: 'SELL_ONLY',
        sellingPrice: '',
        lendingPrice: '',
        depositAmount: '',
        isbn: '',
        publisher: '',
        publishedYear: '',
        language: 'English',
        pageCount: '',
        lendingPeriod: 7,
        bookCount: 1,
        tags: '',
        seriesName: '',
        seriesNumber: '',
        totalBooksInSeries: '',
        cover: '',
        location: ''
      });
      setShowAddModal(false);
      
      // Optionally refresh the page or update the books list
      // window.location.reload(); // Simple refresh
      // or call a function to refresh the books list
      
    } catch (error) {
      console.error('Error adding book:', error);
      alert(`Error adding book: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewBook({
          ...newBook,
          imageUrls: file.name,
          cover: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Add Book Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>Add Book</span>
      </button>

      {/* Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBook.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter book title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authors <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBook.authors}
                        onChange={(e) => handleInputChange('authors', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Author names (comma-separated)"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple authors with commas</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publication Year
                      </label>
                      <input
                        type="number"
                        value={newBook.publishedYear}
                        onChange={(e) => handleInputChange('publishedYear', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="e.g., 2023"
                        min="1000"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ISBN (Optional)
                      </label>
                      <input
                        type="text"
                        value={newBook.isbn}
                        onChange={(e) => handleInputChange('isbn', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="978-0-123456-78-9"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publisher
                      </label>
                      <input
                        type="text"
                        value={newBook.publisher}
                        onChange={(e) => handleInputChange('publisher', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Publisher name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Count
                      </label>
                      <input
                        type="number"
                        value={newBook.pageCount}
                        onChange={(e) => handleInputChange('pageCount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Number of pages"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newBook.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows="4"
                      placeholder="Tell potential readers about this book - plot summary, condition details, why you're sharing it..."
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Book Image</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Book Cover <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a clear image of the book cover (JPEG, PNG, max 5MB)</p>
                    </div>
                    {newBook.cover && (
                      <div className="flex-shrink-0">
                        <img
                          src={newBook.cover}
                          alt="Book cover preview"
                          className="w-32 h-40 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBook({ ...newBook, imageUrls: '', cover: "" })}
                          className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories and Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories & Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genres <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBook.genres}
                        onChange={(e) => handleInputChange('genres', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Fiction, Romance, Thriller"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple genres with commas</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newBook.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      >
                        <option value="NEW">New - Never been read</option>
                        <option value="USED">Used - Good readable condition</option>
                        <option value="FAIR">Fair - Shows wear but readable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={newBook.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
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

                {/* Availability & Pricing */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Availability & Pricing</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newBook.listingType}
                        onChange={(e) => handleInputChange('listingType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      >
                        <option value="SELL_ONLY">Sell Only</option>
                        <option value="LEND_ONLY">Lend Only</option>
                        <option value="SELL_AND_LEND">Sell & Lend</option>
                        <option value="EXCHANGE">Exchange</option>
                        <option value="DONATE">Donate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Count
                      </label>
                      <input
                        type="number"
                        value={newBook.bookCount}
                        onChange={(e) => handleInputChange('bookCount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        min="1"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price (LKR)
                      </label>
                      <input
                        type="number"
                        value={newBook.sellingPrice}
                        onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter price if selling"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lending Price (LKR)
                      </label>
                      <input
                        type="number"
                        value={newBook.lendingPrice}
                        onChange={(e) => handleInputChange('lendingPrice', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Daily/weekly rate"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deposit Amount (LKR)
                      </label>
                      <input
                        type="number"
                        value={newBook.depositAmount}
                        onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Security deposit"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lending Period (days)
                    </label>
                    <input
                      type="number"
                      value={newBook.lendingPeriod}
                      onChange={(e) => handleInputChange('lendingPeriod', e.target.value)}
                      className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      min="1"
                      placeholder="7"
                    />
                  </div>
                </div>

                {/* Series & Tags */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Series & Tags</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Series Name
                      </label>
                      <input
                        type="text"
                        value={newBook.seriesName}
                        onChange={(e) => handleInputChange('seriesName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="e.g., Harry Potter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Series Number
                      </label>
                      <input
                        type="number"
                        value={newBook.seriesNumber}
                        onChange={(e) => handleInputChange('seriesNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Books in Series
                      </label>
                      <input
                        type="number"
                        value={newBook.totalBooksInSeries}
                        onChange={(e) => handleInputChange('totalBooksInSeries', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="7"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (Optional)
                    </label>
                    <input
                      type="text"
                      value={newBook.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="classic, must-read, vintage"
                    />
                    <p className="text-xs text-gray-500 mt-1">Help others discover your book with relevant tags (comma-separated)</p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBook}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Adding Book...' : 'Add Book to Library'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBookPopup;