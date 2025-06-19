import React from 'react';
import { Heart, MapPin, Clock, Tag, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const BookCard = ({ book }) => {
  return (
    <div className="card card-hover group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute top-0 right-0 p-2">
          <button className="p-1.5 bg-white rounded-full text-gray-500 hover:text-error transition-colors shadow-sm">
            <Heart size={18} />
          </button>
        </div>
        {book.forSale && book.forLend ? (
          <div className="absolute top-2 left-2 flex space-x-1">
            <span className="badge badge-primary">For Sale</span>
            <span className="badge badge-secondary">For Lending</span>
          </div>
        ) : book.forSale ? (
          <div className="absolute top-2 left-2">
            <span className="badge badge-primary">For Sale</span>
          </div>
        ) : book.forLend ? (
          <div className="absolute top-2 left-2">
            <span className="badge badge-secondary">For Lending</span>
          </div>
        ) : null}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-semibold text-lg line-clamp-1">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          </div>
          {book.forSale && (
            <div className="text-secondary font-semibold">
              Rs. {book.price}
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{book.location}</span>
          </div>
          <div className="flex items-center">
            <Tag size={14} className="mr-1" />
            <span>{book.condition}</span>
          </div>
          {book.forLend && (
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{book.lendingPeriod} days</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="trust-score text-xs">
            <img
              src={book.owner.avatar}
              alt={book.owner.name}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="text-gray-600">{book.owner.name}</span>
            <div className="ml-1 bg-primary/20 text-primary px-1 rounded">
              {book.owner.trustScore}★
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <MessageSquare size={14} className="mr-1" />
            <span>Contact</span>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Link to={`/books/${book.id}`} className="block w-full">
            <Button variant="outline" fullWidth size="sm">
              View Details
            </Button>
          </Link>
          {book.forLend && (
            <Button variant="secondary" size="sm">
              Request
            </Button>
          )}
          {book.forSale && !book.forLend && (
            <Button variant="primary" size="sm">
              Buy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;