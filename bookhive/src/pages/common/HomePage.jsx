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
  const honeycombBgStyle = {
    backgroundImage: 'radial-gradient(transparent 0%, transparent 20%, rgba(251, 191, 36, 0.05) 20%), radial-gradient(transparent 0%, transparent 20%, rgba(59, 130, 246, 0.05) 20%)', // Secondary, Accent
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
        
        <div className="py-16" style={{ backgroundColor: '#FBBF24' }}> {/* Secondary */}
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif", color: '#0F172A' }}> {/* Text */}
              Ready to Join the BookHive Community?
            </h2>
            <p className="max-w-2xl mx-auto mb-8" style={{ color: '#1E40AF' }}> {/* Darker Accent */}
              Sign up today and start connecting with book lovers across Sri Lanka. 
              Share, borrow, and discover your next favorite read.
            </p>
            <button
              className="px-4 py-2 font-semibold rounded-lg transition-all duration-200"
              style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', border: '2px solid #3B82F6' }} // Accent
              onMouseOver={(e) => (e.target.style.backgroundColor = '#1E40AF')} // Darker Accent
              onMouseOut={(e) => (e.target.style.backgroundColor = '#3B82F6')}
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