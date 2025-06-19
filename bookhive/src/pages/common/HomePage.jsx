import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import Hero from '../../components/home/Hero';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturedBooks from '../../components/home/FeaturedBooks';
import BookCirclesSection from '../../components/home/BookCirclesSection';
import TrustScoreSection from '../../components/home/TrustScoreSection';
import Testimonials from '../../components/home/Testimonials';

const HomePage = () => {
  // Inline styles for custom utilities (e.g., honeycomb-bg, hexagon)
  const honeycombBgStyle = {
    backgroundImage: 'radial-gradient(transparent 0%, transparent 20%, rgba(255, 193, 7, 0.05) 20%), radial-gradient(transparent 0%, transparent 20%, rgba(30, 58, 138, 0.05) 20%)',
    backgroundPosition: '0 0, 20px 20px',
    backgroundSize: '40px 40px',
  };

  const hexagonStyle = {
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <FeaturedBooks />
        <TrustScoreSection />
        <BookCirclesSection />
        <Testimonials />
        
        {/* Call to Action */}
        <div className="py-16" style={{ backgroundColor: '#FFC107' }}> {/* primary: #FFC107 */}
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#1E3A8A' }}> {/* secondary: #1E3A8A */}
              Ready to Join the BookHive Community?
            </h2>
            <p className="max-w-2xl mx-auto mb-8" style={{ color: '#152B70' }}> {/* secondary-dark: #152B70 */}
              Sign up today and start connecting with book lovers across Sri Lanka. 
              Share, borrow, and discover your next favorite read.
            </p>
            <button
              className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
              style={{
                backgroundColor: '#1E3A8A', // secondary
                color: '#FFFFFF', // text-white
                border: '2px solid #1E3A8A', // btn-secondary base
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#152B70')} // hover:bg-secondary-dark
              onMouseOut={(e) => (e.target.style.backgroundColor = '#1E3A8A')}
            >
              Join BookHive Now
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;