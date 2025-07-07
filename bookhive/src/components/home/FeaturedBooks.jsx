import React from 'react';
import { ArrowRight } from 'lucide-react';
import BookGrid from '../book/BookGrid';
import { books } from '../../data/mockData';
import { Link } from 'react-router-dom';

const FeaturedBooks = () => {
  const topBooks = [...books]
    .sort((a, b) => b.wishlistedCount - a.wishlistedCount)
    .slice(0, 4);

  return (
    <div className="py-16 bg-white"> {/* Cards */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
            Featured Books
          </h2>
          <Link 
            to="/books" 
            className="flex items-center transition-colors"
            style={{ color: '#1E3A8A' }} // Primary
            onMouseOver={(e) => (e.target.style.color = '#0F172A')} // Text (darker shade)
            onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
          >
            <span className="mr-1">View All</span>
            <ArrowRight size={18} />
          </Link>
        </div>
        
        <BookGrid books={topBooks} />
        
        <div className="mt-12 bg-gray-50 rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img 
                src="https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg" 
                alt="Add your books" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
                Have Books to Share?
              </h3>
              <p className="text-gray-600 mb-6">
                List your books on BookHive and connect with readers across Sri Lanka. 
                Whether you want to lend, sell, or donate, our platform makes it easy 
                to share your books with others.
              </p>
              <button
                className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
                style={{ backgroundColor: '#FBBF24', color: '#FFFFFF' }} // Secondary
                onMouseOver={(e) => (e.target.style.backgroundColor = '#D97706')} // Darker Honey Yellow
                onMouseOut={(e) => (e.target.style.backgroundColor = '#FBBF24')}
              >
                Add Your Books
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBooks;