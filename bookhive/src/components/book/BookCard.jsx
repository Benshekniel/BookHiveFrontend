import React, { useState } from 'react';
import { Heart, MapPin, Clock, Tag, MessageSquare, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const BookCard = ({ book }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const getBadgeStyles = (type) => {
    const baseStyles = "px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm";
    switch (type) {
      case 'sale':
        return `${baseStyles} bg-primary/90 text-white shadow-lg`;
      case 'lend':
        return `${baseStyles} bg-secondary/90 text-white shadow-lg`;
      default:
        return baseStyles;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleWishlistToggle}
            className={`p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${
              isWishlisted
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
            }`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Status Badges */}
        {(book.forSale || book.forLend) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {book.forSale && (
              <span className={getBadgeStyles('sale')}>
                For Sale
              </span>
            )}
            {book.forLend && (
              <span className={getBadgeStyles('lend')}>
                For Lending
              </span>
            )}
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/books/${book.id}`}
            className="px-4 py-2 bg-white/90 backdrop-blur-sm text-textPrimary rounded-lg font-semibold transition-all duration-300 hover:bg-white hover:scale-105 flex items-center gap-2"
          >
            <Eye size={16} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-lg text-textPrimary line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 font-medium">{book.author}</p>
          </div>
          {book.forSale && (
            <div className="ml-3 text-right">
              <div className="text-lg font-bold text-secondary">
                Rs. {book.price?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Price</div>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            <span className="font-medium">{book.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag size={12} className="text-gray-400" />
            <span className={`font-medium ${getConditionColor(book.condition)}`}>
              {book.condition}
            </span>
          </div>
          {book.forLend && (
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-gray-400" />
              <span className="font-medium">{book.lendingPeriod} days</span>
            </div>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <img
              src={book.owner.avatar}
              alt={book.owner.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <p className="text-sm font-semibold text-textPrimary">{book.owner.name}</p>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-xs font-bold text-primary">{book.owner.trustScore}</span>
                <span className="text-xs text-gray-500">Trust Score</span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
            <MessageSquare size={12} />
            Contact
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/books/${book.id}`} className="flex-1">
            <Button variant="outline" fullWidth size="sm" className="font-semibold">
              View Details
            </Button>
          </Link>
          {book.forLend && (
            <Button variant="secondary" size="sm" className="px-4 font-semibold">
              Request
            </Button>
          )}
          {book.forSale && !book.forLend && (
            <Button variant="primary" size="sm" className="px-4 font-semibold">
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;