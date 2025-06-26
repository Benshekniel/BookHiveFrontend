import React, { useState } from 'react';
import { BookOpen, Search, Filter, Eye, Check, X, Flag, Star } from 'lucide-react';

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState('listings');

  const bookListings = [
    {
      id: 1,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      condition: 'Good',
      owner: 'Kasun Perera',
      ownerType: 'Lender',
      status: 'active',
      reportCount: 0,
      dateAdded: '2024-01-15',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'Non-Fiction',
      condition: 'Excellent',
      owner: 'Nimali Silva',
      ownerType: 'Seller',
      status: 'reported',
      reportCount: 2,
      dateAdded: '2024-01-18',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      condition: 'Fair',
      owner: 'Rajesh Fernando',
      ownerType: 'Lender',
      status: 'pending',
      reportCount: 0,
      dateAdded: '2024-01-20',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const reportedContent = [
    {
      id: 1,
      type: 'book',
      title: 'Inappropriate content in book description',
      itemName: 'Sample Book Title',
      reportedBy: 'User123',
      reason: 'Inappropriate content',
      date: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      type: 'comment',
      title: 'Spam comment on book review',
      itemName: 'Review for "The Alchemist"',
      reportedBy: 'BookLover',
      reason: 'Spam',
      date: '2024-01-19',
      status: 'reviewed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-400 text-white';
      case 'reported': return 'bg-red-500 text-white';
      case 'rejected': return 'bg-slate-200 text-slate-800';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const getOwnerTypeColor = (type) => {
    switch (type) {
      case 'Lender': return 'bg-blue-500 text-white';
      case 'Seller': return 'bg-yellow-400 text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Content Moderation</h1>
          <p className="text-slate-600 mt-2 text-lg">Review and moderate book listings and user content</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
            8 Reported Items
          </div>
          <div className="bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
            12 Pending Review
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-lg">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                activeTab === 'listings'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              Book Listings
            </button>
            <button
              onClick={() => setActiveTab('reported')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                activeTab === 'reported'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              Reported Content
            </button>
          </nav>
        </div>

        {activeTab === 'listings' && (
          <>
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search books by title, author, or owner..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <select className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Reported</option>
                  </select>
                  <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors duration-200 flex items-center gap-2 shadow-sm">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {bookListings.map((book) => (
                    <tr key={book.id} className="hover:bg-blue-100 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={book.image} 
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow-sm"
                          />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{book.title}</div>
                            <div className="text-sm text-slate-500">by {book.author}</div>
                            <div className="text-xs text-slate-400">{book.genre}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-slate-600">{book.rating}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-slate-900 font-medium">{book.owner}</div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getOwnerTypeColor(book.ownerType)}`}>
                            {book.ownerType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900 font-medium">{book.condition}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.status)}`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {book.reportCount > 0 && <Flag className="w-4 h-4 text-red-500" />}
                          <span className={`text-sm font-medium ${book.reportCount > 0 ? 'text-red-500' : 'text-slate-500'}`}>
                            {book.reportCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          {book.status === 'pending' && (
                            <>
                              <button className="text-green-500 hover:text-green-700 p-2 hover:bg-green-100 rounded-lg transition-colors duration-200">
                                <Check className="w-4 h-4" />
                              </button>
                              <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors duration-200">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {book.status === 'reported' && (
                            <button className="text-yellow-400 hover:text-yellow-600 p-2 hover:bg-yellow-100 rounded-lg transition-colors duration-200">
                              <Flag className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'reported' && (
          <div className="p-6">
            <div className="space-y-4">
              {reportedContent.map((report) => (
                <div key={report.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        <h4 className="font-semibold text-slate-900">{report.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'pending' ? 'bg-yellow-400 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">Item: {report.itemName}</p>
                      <p className="text-sm text-slate-600 mb-1">Reported by: {report.reportedBy}</p>
                      <p className="text-sm text-slate-600 mb-1">Reason: {report.reason}</p>
                      <p className="text-xs text-slate-400">Reported on: {report.date}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="px-4 py-2 bg-blue-900 text-white text-sm rounded-lg hover:bg-blue-950 transition-colors duration-200 shadow-sm">
                        Review
                      </button>
                      <button className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;