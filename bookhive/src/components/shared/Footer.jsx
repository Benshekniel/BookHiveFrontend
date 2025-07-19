import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue text-white" style={{ backgroundColor: '#1E3A8A' }}> {/* Primary */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#F8FAFC' }}> {/* Background */}
              BookHive is a platform connecting book enthusiasts in Sri Lanka. 
              Borrow, lend, buy, or sell books while being part of a vibrant 
              community of readers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-yellow transition-colors duration-200" style={{ color: '#FBBF24' }} /* Secondary */
                onMouseOver={(e) => (e.target.style.color = '#D97706')} /* Darker Secondary */
                onMouseOut={(e) => (e.target.style.color = '#FBBF24')}
              >
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-yellow transition-colors duration-200" style={{ color: '#FBBF24' }} /* Secondary */
                onMouseOver={(e) => (e.target.style.color = '#D97706')}
                onMouseOut={(e) => (e.target.style.color = '#FBBF24')}
              >
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-yellow transition-colors duration-200" style={{ color: '#FBBF24' }} /* Secondary */
                onMouseOver={(e) => (e.target.style.color = '#D97706')}
                onMouseOut={(e) => (e.target.style.color = '#FBBF24')}
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-light pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderColor: '#F8FAFC' }}> {/* Background */}
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#F8FAFC' }}> {/* Background */}
              <li><Link to="/books" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                onMouseOver={(e) => (e.target.style.color = '#FBBF24')} /* Secondary */
                onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
              >Browse Books</Link></li>
              <li><Link to="/circles" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                onMouseOver={(e) => (e.target.style.color = '#FBBF24')}
                onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
              >Book Circles</Link></li>
              <li><Link to="/how-it-works" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                onMouseOver={(e) => (e.target.style.color = '#FBBF24')}
                onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
              >How It Works</Link></li>
              <li><Link to="/about" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                onMouseOver={(e) => (e.target.style.color = '#FBBF24')}
                onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
              >About Us</Link></li>
              <li><Link to="/faq" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                onMouseOver={(e) => (e.target.style.color = '#FBBF24')}
                onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
              >FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-light pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderColor: '#F8FAFC' }}> {/* Background */}
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#F8FAFC' }}> {/* Background */}
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-yellow" style={{ color: '#FBBF24' }} /> {/* Secondary */}
                <span>University of Colombo School of Computing, Colombo 07</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-yellow" style={{ color: '#FBBF24' }} /> {/* Secondary */}
                <a href="mailto:info@bookhive.lk" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                  onMouseOver={(e) => (e.target.style.color = '#FBBF24')}
                  onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
                >info@bookhive.lk</a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-yellow" style={{ color: '#FBBF24' }} /> {/* Secondary */}
                <a href="tel:+94112581245" className="hover:text-yellow transition-colors duration-200" style={{ color: '#F8FAFC' }}
                  onMouseOver={(e) => (e.target.style.color = '#FBBF24')}
                  onMouseOut={(e) => (e.target.style.color = '#F8FAFC')}
                >+94 11 258 1245</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-blue-light pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderColor: '#F8FAFC' }}> {/* Background */}
              Newsletter
            </h3>
            <p className="text-sm mb-3" style={{ color: '#F8FAFC' }}> {/* Background */}
              Stay updated with the latest books and events.
            </p>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-black w-full rounded-l-lg focus:outline-none"
                  style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }} /* Text, Cards */
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.5)')} /* Secondary */
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-lg transition-colors duration-200"
                  style={{ backgroundColor: '#FBBF24', color: '#FFFFFF' }} /* Secondary */
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#D97706')} /* Darker Secondary */
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#FBBF24')}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 text-center text-sm" style={{ borderColor: '#F8FAFC', color: '#F8FAFC' }}> {/* Background */}
          <p>© {new Date().getFullYear()} BookHive. All rights reserved. Developed by UCSC undergraduates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;