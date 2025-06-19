import React from 'react';
import { Search, BookOpen, Users, MapPin } from 'lucide-react';
import Button from '../shared/Button';

const Hero = () => {
  const honeycombBgStyle = {
    backgroundImage: 'radial-gradient(transparent 0%, transparent 20%, rgba(255, 214, 57, 0.05) 20%), radial-gradient(transparent 0%, transparent 20%, rgba(64, 122, 255, 0.05) 20%)',
    backgroundPosition: '0 0, 20px 20px',
    backgroundSize: '40px 40px',
  };

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#407aff' }}>
      <div className="absolute inset-0 opacity-10" style={honeycombBgStyle}></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-10 md:mb-0" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
            <h1 className="text-4xl md:text-5xl leading-tight mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontWeight: 'bold' }}>
              Connect with Book Lovers Across Sri Lanka
            </h1>
            <p className="text-lg mb-8 max-w-lg" style={{ color: '#1A3AFF' }}>
              Borrow, lend, buy, or sell books through a trusted community platform. 
              Join BookHive today and be part of Sri Lanka's largest book sharing network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="shadow-lg"
              >
                Join BookHive
              </Button>
              <Button 
                variant="outline" 
                size="lg"
              >
                How It Works
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-6 max-w-md">
              <div className="flex items-start">
                <div className="p-2 rounded-full mr-3" style={{ backgroundColor: '#ffd639' }}>
                  <BookOpen className="text-blue" style={{ color: '#407aff' }} size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">1000+ Books</h3>
                  <p className="text-sm" style={{ color: '#1A3AFF' }}>Available for lending & sale</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-full mr-3" style={{ backgroundColor: '#ffd639' }}>
                  <Users className="text-blue" style={{ color: '#407aff' }} size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">500+ Users</h3>
                  <p className="text-sm" style={{ color: '#1A3AFF' }}>Growing community</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 rounded-full mr-3" style={{ backgroundColor: '#ffd639' }}>
                  <MapPin className="text-blue" style={{ color: '#407aff' }} size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">25 Districts</h3>
                  <p className="text-sm" style={{ color: '#1A3AFF' }}>Nationwide coverage</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative max-w-md">
              <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2">
                <img 
                  src="https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg" 
                  alt="Books on shelf" 
                  className="rounded-lg h-80 w-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-md transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2 z-10 w-36">
                <img 
                  src="https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg" 
                  alt="Featured book" 
                  className="w-full h-24 object-cover rounded mb-2" 
                />
                <p className="font-semibold text-xs truncate">The Silent Patient</p>
                <div className="flex items-center mt-1">
                  <div className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255, 214, 57, 0.2)', color: '#ffd639' }}>
                    4.8★
                  </div>
                  <p className="text-xs text-gray-500 ml-1">Bestseller</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-md transition-all duration-200 transform hover:shadow-lg hover:-translate-y-2 z-20 w-32">
                <div className="flex items-center mb-2">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full object-cover border-2" 
                    style={{ borderColor: '#ffd639' }}
                  />
                  <div className="ml-2">
                    <p className="font-semibold text-xs">Jayani</p>
                    <div className="text-xs px-1 rounded-full" style={{ backgroundColor: 'rgba(255, 214, 57, 0.2)', color: '#ffd639' }}>
                      4.9★
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Top lender in Colombo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;