import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF' }}> {/* bg-secondary text-white */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#D1D5DB' }}> {/* text-gray-200 */}
              BookHive is a platform connecting book enthusiasts in Sri Lanka. 
              Borrow, lend, buy, or sell books while being part of a vibrant 
              community of readers.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="transition-colors duration-200" style={{ color: '#FFFFFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')} // hover:text-primary
                onMouseOut={(e) => (e.target.style.color = '#FFFFFF')}
              >
                <Facebook size={20} />
              </a>
              <a href="#" className="transition-colors duration-200" style={{ color: '#FFFFFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FFFFFF')}
              >
                <Twitter size={20} />
              </a>
              <a href="#" className="transition-colors duration-200" style={{ color: '#FFFFFF' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FFFFFF')}
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderBottom: '2px solid #3B82F6' }}> {/* border-b border-blue-400 */}
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#D1D5DB' }}>
              <li><Link to="/books" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')} // hover:text-primary
                onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
              >
                Browse Books
              </Link></li>
              <li><Link to="/circles" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
              >
                Book Circles
              </Link></li>
              <li><Link to="/how-it-works" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
              >
                How It Works
              </Link></li>
              <li><Link to="/about" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
              >
                About Us
              </Link></li>
              <li><Link to="/faq" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
              >
                FAQs
              </Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderBottom: '2px solid #3B82F6' }}>
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: '#D1D5DB' }}>
              <li className="flex items-center">
                <MapPin size={16} className="mr-2" style={{ color: '#FFC107' }} /> {/* text-primary */}
                <span>University of Colombo School of Computing, Colombo 07</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" style={{ color: '#FFC107' }} />
                <a href="mailto:info@bookhive.lk" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                  onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
                >
                  info@bookhive.lk
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" style={{ color: '#FFC107' }} />
                <a href="tel:+94112581245" className="transition-colors duration-200" style={{ color: '#D1D5DB' }}
                  onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.color = '#D1D5DB')}
                >
                  +94 11 258 1245
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2" style={{ fontFamily: "'Poppins', system-ui, sans-serif", borderBottom: '2px solid #3B82F6' }}>
              Newsletter
            </h3>
            <p className="text-sm mb-3" style={{ color: '#D1D5DB' }}>
              Stay updated with the latest books and events.
            </p>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-black w-full rounded-l-lg focus:outline-none"
                  style={{ boxShadow: '0 0 0 1px #FFC107' }} // focus:ring-1 focus:ring-primary
                  onFocus={(e) => (e.target.style.boxShadow = '0 0 0 1px #FFC107')}
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-r-lg transition-colors duration-200"
                  style={{ backgroundColor: '#FFC107', color: '#FFFFFF' }} // bg-primary text-white
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#FFA000')} // hover:bg-primary-dark
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#FFC107')}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 text-center text-sm" style={{ borderColor: '#3B82F6', color: '#D1D5DB' }}> {/* border-t border-blue-400 text-gray-300 */}
          <p>&copy; {new Date().getFullYear()} BookHive. All rights reserved. Developed by UCSC undergraduates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;