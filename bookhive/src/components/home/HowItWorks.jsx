import React from 'react';
import { Search, BookOpen, MessageSquare, ThumbsUp } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="py-16" style={{ backgroundColor: '#F9FAFB' }}> {/* bg-gray-50 */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
            How BookHive Works
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Join our community and start sharing books in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-transform duration-300"
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-8px)')} // hover:-translate-y-2
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FFC107/20' }}> {/* bg-primary/20 */}
              <Search className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Find Books</h3>
            <p className="text-gray-600">
              Search for books by title, author, or genre. Filter by location to find books near you.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-transform duration-300"
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-8px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#1E3A8A/20' }}> {/* bg-secondary/20 */}
              <BookOpen className="text-secondary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Request Books</h3>
            <p className="text-gray-600">
              Send a request to the owner to borrow or buy the book you're interested in.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-transform duration-300"
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-8px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FFC107/20' }}>
              <MessageSquare className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Connect</h3>
            <p className="text-gray-600">
              Communicate with the owner, agree on terms and arrange for pickup or delivery.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-transform duration-300"
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-8px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#1E3A8A/20' }}>
              <ThumbsUp className="text-secondary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Enjoy & Rate</h3>
            <p className="text-gray-600">
              Enjoy your book and leave a review to help build the owner's TrustScore.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button
            className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
            style={{ backgroundColor: '#FFC107', color: '#FFFFFF' }} // btn-primary
            onMouseOver={(e) => (e.target.style.backgroundColor = '#FFA000')} // hover:bg-primary-dark
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FFC107')}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;