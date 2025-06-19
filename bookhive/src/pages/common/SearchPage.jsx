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
                    borderColor: '#D1D5DB', // border-gray-300
                    boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)', // focus:ring-2 focus:ring-primary/50
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.5)')}
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
                style={{ backgroundColor: '#FFC107', color: '#FFFFFF' }} // bg-primary text-white
                onMouseOver={(e) => (e.target.style.backgroundColor = '#FFA000')} // hover:bg-primary-dark
                onMouseOut={(e) => (e.target.style.backgroundColor = '#FFC107')}
              >
                Search
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm font-medium" style={{ color: '#1E3A8A' }} // text-secondary
                onMouseOver={(e) => (e.target.style.color = '#152B70')} // hover:text-secondary-dark
                onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
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