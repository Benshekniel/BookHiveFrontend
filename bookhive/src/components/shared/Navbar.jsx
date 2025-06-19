import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Bell, MessageSquare, User } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center flex-grow max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                style={{ boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)' }} // focus:ring-2 focus:ring-primary/50
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.5)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/books" className="text-gray-600" style={{ color: '#1E3A8A' }} // text-secondary
                  onMouseOver={(e) => (e.target.style.color = '#152B70')} // hover:text-secondary
                  onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                >
                  Books
                </Link>
                <Link to="/circles" className="text-gray-600" style={{ color: '#1E3A8A' }}
                  onMouseOver={(e) => (e.target.style.color = '#152B70')}
                  onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                >
                  Book Circles
                </Link>
                <Link to="/notifications">
                  <div className="relative">
                    <Bell size={20} className="text-gray-600" style={{ color: '#1E3A8A' }}
                      onMouseOver={(e) => (e.target.style.color = '#152B70')}
                      onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                    />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                  </div>
                </Link>
                <Link to="/messages">
                  <div className="relative">
                    <MessageSquare size={20} className="text-gray-600" style={{ color: '#1E3A8A' }}
                      onMouseOver={(e) => (e.target.style.color = '#152B70')}
                      onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                    />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                  </div>
                </Link>
                <div className="cursor-pointer">
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    style={{ border: '2px solid #FFC107' }} // border-2 border-primary
                  />
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-600"
            style={{ color: '#1E3A8A' }}
            onMouseOver={(e) => (e.target.style.color = '#152B70')}
            onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search books, authors, genres..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              style={{ boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)' }} // focus:ring-2 focus:ring-primary/50
              onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 193, 7, 0.5)')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t border-gray-200 animate-fade-in">
            <ul className="space-y-3">
              <li>
                <Link to="/books" className="block text-gray-600" style={{ color: '#1E3A8A' }}
                  onMouseOver={(e) => (e.target.style.color = '#152B70')}
                  onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                >
                  Books
                </Link>
              </li>
              <li>
                <Link to="/circles" className="block text-gray-600" style={{ color: '#1E3A8A' }}
                  onMouseOver={(e) => (e.target.style.color = '#152B70')}
                  onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                >
                  Book Circles
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/notifications" className="flex items-center text-gray-600" style={{ color: '#1E3A8A' }}
                      onMouseOver={(e) => (e.target.style.color = '#152B70')}
                      onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                    >
                      <Bell size={18} className="mr-2" />
                      Notifications
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" className="flex items-center text-gray-600" style={{ color: '#1E3A8A' }}
                      onMouseOver={(e) => (e.target.style.color = '#152B70')}
                      onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                    >
                      <MessageSquare size={18} className="mr-2" />
                      Messages
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="flex items-center text-gray-600" style={{ color: '#1E3A8A' }}
                      onMouseOver={(e) => (e.target.style.color = '#152B70')}
                      onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
                    >
                      <User size={18} className="mr-2" />
                      My Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">
                      <Button variant="outline" fullWidth>
                        Log In
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup">
                      <Button variant="primary" fullWidth>
                        Sign Up
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;