import React, { useState } from "react";
import { BookOpen, Search, Filter, Eye, ArrowRight } from "lucide-react";
import { books } from "../../data/mockData";

const BrowseBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(books);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredBooks(
      books.filter((book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Welcome to Browse Books, Nive!</h1>
              <p className="text-blue-100 text-lg">Discover a wide range of books to borrow or buy</p>
            </div>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Search Books</p>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by title or author..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Filter by Genre</p>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option value="">All Genres</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Classic">Classic</option>
                </select>
              </div>
              <Filter className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Filter by Availability</p>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <option value="">All Availability</option>
                  <option value="forLend">For Lending</option>
                  <option value="forSale">For Sale</option>
                </select>
              </div>
              <Filter className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book Listings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Available Books</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="text-yellow-600 font-medium">
                              {book.forSale ? `Rs. ${book.price}` : "For Lending"}
                            </span>
                          </div>
                        </div>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          <Eye className="w-4 h-4 inline mr-1" />
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No books found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Placeholder for Future Section (e.g., Recommendations) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recommended Books</h2>
              </div>
            </div>
            <div className="p-6 text-center py-8">
              <p className="text-gray-500">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseBooks;