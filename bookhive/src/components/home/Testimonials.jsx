import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  { id: 1, name: "Dinesh Rajapaksa", role: "Book Lender", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", quote: "BookHive helped me share my collection...", rating: 5 },
  { id: 2, name: "Amali Fernando", role: "Student", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg", quote: "As a university student, I couldn't afford...", rating: 5 },
  { id: 3, name: "Rohan De Silva", role: "Book Circle Organizer", avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg", quote: "Our Sri Lankan Literature Circle has grown...", rating: 4 },
];

const Testimonials = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
            What Our Community Says
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Hear from readers, lenders, and book enthusiasts who are part of the BookHive community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-lg shadow-md p-6 transition-all duration-200"
              onMouseOver={(e) => (e.target.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)', e.target.style.transform = 'translateY(-4px)')} // hover:shadow-lg hover:-translate-y-1
              onMouseOut={(e) => (e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)', e.target.style.transform = 'translateY(0)')}
            >
              <div className="flex items-start mb-4">
                <div className="relative">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2" 
                    style={{ borderColor: '#FFC107' }} // border-primary
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full">
                    <Quote size={12} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-4 h-4" 
                      style={{ color: i < testimonial.rating ? '#FFC107' : '#D1D5DB' }} // text-primary or text-gray-300
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-xs text-gray-500">Verified Member</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button
            className="px-4 py-2 font-semibold rounded-lg transition-all duration-200 border-2"
            style={{ borderColor: '#FFC107', color: '#FFC107', backgroundColor: 'transparent' }} // btn-outline
            onMouseOver={(e) => (e.target.style.backgroundColor = '#FFC107', e.target.style.color = '#FFFFFF')} // hover:bg-primary hover:text-white
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent', e.target.style.color = '#FFC107')}
          >
            Read More Stories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;