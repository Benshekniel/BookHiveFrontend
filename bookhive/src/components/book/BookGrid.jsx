import React from 'react';
import BookCard from './BookCard';

const BookGrid = ({ books, title }) => {
  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-2xl font-heading font-semibold mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookGrid;