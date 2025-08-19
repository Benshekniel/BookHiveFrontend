import React from 'react';
import BookCard from './BookCard';
import { BookOpen, Search } from 'lucide-react';

const BookGrid = ({ books, title, subtitle, showEmptyState = true, className = "" }) => {
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <BookOpen size={40} className="text-gray-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Search size={16} className="text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
        No books found
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        We couldn't find any books matching your criteria. Try adjusting your search or browse our featured collection.
      </p>
    </div>
  );

  return (
    <div className={`mb-8 ${className}`}>
      {/* Header Section */}
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-textPrimary mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {books && books.length > 0 ? (
          books.map((book, index) => (
            <div
              key={book.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <BookCard book={book} />
            </div>
          ))
        ) : showEmptyState ? (
          <EmptyState />
        ) : null}
      </div>

      {/* Books Count */}
      {books && books.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-textPrimary">{books.length}</span>
            {books.length === 1 ? ' book' : ' books'}
          </p>
        </div>
      )}

      {/* Add custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookGrid;