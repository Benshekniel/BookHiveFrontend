import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // TODO: Implement search logic
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
              Search Books
            </h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, genres..."
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none"
                  style={{
                    borderColor: '#D1D5DB',
                    boxShadow: '0 0 0 2px rgba(255, 214, 57, 0.5)',
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-semibold rounded-lg transition-all duration-200"
                style={{ backgroundColor: '#ffd639', color: '#407aff' }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#FFC107')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ffd639')}
              >
                Search
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm font-medium" style={{ color: '#407aff' }}
                onMouseOver={(e) => (e.target.style.color = '#1A3AFF')}
                onMouseOut={(e) => (e.target.style.color = '#407aff')}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;