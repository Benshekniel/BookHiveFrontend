import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue text-white" style={{ backgroundColor: '#407aff' }}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#1A3AFF' }}>
              BookHive is a platform connecting book enthusiasts in Sri Lanka. 
              Borrow, lend, buy, or sell books while being part of a vibrant 
              community of readers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-yellow transition-colors duration-200" style={{ color: '#ffd639' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#ffd639')}
              >
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-yellow transition-colors duration-200" style={{ color: '#ffd639' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#ffd639')}
              >
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-yellow transition-colors duration-200" style={{ color: '#ffd639' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#ffd639')}
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-light pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderColor: '#1A3AFF' }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#1A3AFF' }}>
              <li><Link to="/books" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
              >Browse Books</Link></li>
              <li><Link to="/circles" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
              >Book Circles</Link></li>
              <li><Link to="/how-it-works" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
              >How It Works</Link></li>
              <li><Link to="/about" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
              >About Us</Link></li>
              <li><Link to="/faq" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
              >FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-light pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderColor: '#1A3AFF' }}>
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#1A3AFF' }}>
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-yellow" style={{ color: '#ffd639' }} />
                <span>University of Colombo School of Computing, Colombo 07</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-yellow" style={{ color: '#ffd639' }} />
                <a href="mailto:info@bookhive.lk" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                  onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
                >info@bookhive.lk</a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-yellow" style={{ color: '#ffd639' }} />
                <a href="tel:+94112581245" className="hover:text-yellow transition-colors duration-200" style={{ color: '#1A3AFF' }}
                  onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.color = '#1A3AFF')}
                >+94 11 258 1245</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-light pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderColor: '#1A3AFF' }}>
              Newsletter
            </h3>
            <p className="text-sm" style={{ color: '#1A3AFF' }} mb-3>
              Stay updated with the latest books and events.
            </p>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-black w-full rounded-l-lg focus:outline-none"
                  style={{ boxShadow: '0 0 0 2px rgba(255, 214, 57, 0.5)' }}
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-lg transition-colors duration-200"
                  style={{ backgroundColor: '#ffd639', color: '#407aff' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#ffd639')}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 text-center text-sm" style={{ borderColor: '#1A3AFF', color: '#1A3AFF' }}>
          <p>© {new Date().getFullYear()} BookHive. All rights reserved. Developed by UCSC undergraduates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;