import React from 'react';
import { Users, BookOpen, ArrowRight } from 'lucide-react';
import { bookCircles } from '../../data/mockData';
import { Link } from 'react-router-dom';

const BookCirclesSection = () => {
  return (
    <div className="py-16" style={{ backgroundColor: '#F9FAFB' }}> {/* bg-gray-50 */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
            Join Book Circles
          </h2>
          <Link 
            to="/circles" 
            className="flex items-center transition-colors"
            style={{ color: '#1E3A8A' }} // text-secondary
            onMouseOver={(e) => (e.target.style.color = '#152B70')} // hover:text-secondary-dark
            onMouseOut={(e) => (e.target.style.color = '#1E3A8A')}
          >
            <span className="mr-1">View All</span>
            <ArrowRight size={18} />
          </Link>
        </div>
        
        <p className="text-gray-600 mb-10 max-w-3xl">
          Connect with fellow readers who share your interests. Join book circles to discuss 
          your favorite genres, discover new titles, and build lasting connections.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookCircles.map((circle) => (
            <div key={circle.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200"
              onMouseOver={(e) => (e.target.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)', e.target.style.transform = 'translateY(-4px)')} // card-hover
              onMouseOut={(e) => (e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)', e.target.style.transform = 'translateY(0)')}
            >
              <div className="h-40 relative">
                <img 
                  src={circle.coverImage} 
                  alt={circle.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>{circle.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {circle.description}
                </p>
                <div className="flex justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Users size={14} className="mr-1" />
                    <span>{circle.members.length} members</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <BookOpen size={14} className="mr-1" />
                    <span>{circle.books.length} books</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {circle.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#1E3A8A/10', color: '#1E3A8A' }} // bg-secondary/10 text-secondary
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {circle.members.slice(0, 3).map((member, index) => (
                      <img
                        key={index}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 object-cover"
                        style={{ borderColor: '#FFFFFF' }} // border-white
                        title={member.name}
                      />
                    ))}
                    {circle.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2"
                        style={{ borderColor: '#FFFFFF' }}
                      >
                        +{circle.members.length - 3}
                      </div>
                    )}
                  </div>
                  <Link to={`/circles/${circle.id}`}>
                    <button
                      className="px-4 py-2 font-semibold rounded-lg transition-all duration-200 border-2"
                      style={{ borderColor: '#FFC107', color: '#FFC107', backgroundColor: 'transparent' }} // btn-outline btn-sm
                      onMouseOver={(e) => (e.target.style.backgroundColor = '#FFC107', e.target.style.color = '#FFFFFF')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent', e.target.style.color = '#FFC107')}
                    >
                      Join Circle
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-primary/10 border-2 border-dashed rounded-lg transition-all duration-200"
            onMouseOver={(e) => (e.target.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)', e.target.style.transform = 'translateY(-4px)')} // card-hover
            onMouseOut={(e) => (e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)', e.target.style.transform = 'translateY(0)')}
            style={{ borderColor: '#FFC107' }} // border-primary
          >
            <div className="p-8 flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FFC107/20' }}> {/* bg-primary/20 */}
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>Create Your Own Circle</h3>
              <p className="text-gray-600 mb-6">
                Start a new book circle based on your interests and invite others to join.
              </p>
              <button
                className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
                style={{ backgroundColor: '#FFC107', color: '#FFFFFF' }} // btn-primary
                onMouseOver={(e) => (e.target.style.backgroundColor = '#FFA000')} // hover:bg-primary-dark
                onMouseOut={(e) => (e.target.style.backgroundColor = '#FFC107')}
              >
                Create Circle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCirclesSection;