import React from 'react';
import { Search, BookOpen, MessageSquare, ThumbsUp } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="py-16" style={{ backgroundColor: '#F8FAFC' }}> {/* Background */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
            How BookHive Works
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Join our community and start sharing books in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}> {/* Secondary */}
              <Search className="text-yellow" style={{ color: '#FBBF24' }} size={24} /> {/* Secondary */}
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
              Find Books
            </h3>
            <p className="text-gray-600">
              Search for books by title, author, or genre. Filter by location to find books near you.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}> {/* Accent */}
              <BookOpen className="text-blue" style={{ color: '#3B82F6' }} size={24} /> {/* Accent */}
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
              Request Books
            </h3>
            <p className="text-gray-600">
              Send a request to the owner to borrow or buy the book you're interested in.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}> {/* Secondary */}
              <MessageSquare className="text-yellow" style={{ color: '#FBBF24' }} size={24} /> {/* Secondary */}
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
              Connect
            </h3>
            <p className="text-gray-600">
              Communicate with the owner, agree on terms and arrange for pickup or delivery.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}> {/* Accent */}
              <ThumbsUp className="text-blue" style={{ color: '#3B82F6' }} size={24} /> {/* Accent */}
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
              Enjoy & Rate
            </h3>
            <p className="text-gray-600">
              Enjoy your book and leave a review to help build the owner's TrustScore.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button
            className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
            style={{ backgroundColor: '#FBBF24', color: '#FFFFFF' }} // Secondary
            onMouseOver={(e) => (e.target.style.backgroundColor = '#D97706')} // Darker Honey Yellow
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FBBF24')}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;