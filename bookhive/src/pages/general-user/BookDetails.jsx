import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Tag, Heart, MessageSquare, Gavel, ArrowRight, X } from "lucide-react";
import Button from "../../components/shared/Button";
import { books } from "../../data/mockData";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);

  useEffect(() => {
    if (id) {
      const foundBook = books.find((b) => b.id === parseInt(id));
      setBook(foundBook || null);
    } else if (location.state?.book) {
      setBook(location.state.book);
    } else {
      navigate("browse-books"); // Relative path
    }
  }, [id, navigate]);

  const handleBidSubmit = () => {
    if (!bidAmount || !book) return;
    console.log(`Bid submitted: Rs. ${bidAmount} for ${book.title}`);
    alert(`Your bid of Rs. ${bidAmount} has been submitted for "${book.title}"`);
    setShowBidModal(false);
    setBidAmount("");
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Book Details</h1>
            <p className="text-blue-100 mt-2">Explore and interact with this book</p>
          </div>
          <Link
            to="browse-books" // Relative path
            className="inline-flex items-center px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <ArrowRight className="w-5 h-5 rotate-180 mr-2" />
            Back to Books
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3">
              <div className="relative h-64 overflow-hidden rounded-lg">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-sm">
                  <Heart className="w-5 h-5" />
                </button>
                {book.forSale && book.forLend ? (
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">For Sale</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">For Lending</span>
                  </div>
                ) : book.forSale ? (
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">For Sale</span>
                  </div>
                ) : book.forLend ? (
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">For Lending</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-gray-700 mb-4">{book.description}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{book.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{book.condition}</span>
                </div>
                {book.forSale && <div className="text-green-600 font-semibold">Rs. {book.price}</div>}
              </div>

              <div className="flex items-center mb-4">
                <img src={book.owner.avatar} alt={book.owner.name} className="h-6 w-6 rounded-full object-cover mr-2" />
                <span className="text-gray-600 mr-1">{book.owner.name}</span>
                <span className="bg-yellow-100 text-yellow-800 px-1 rounded text-xs">{book.owner.trustScore}★</span>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Contact Owner</span>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Link
                  to="browse-books" // Relative path
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-medium"
                >
                  Back to Browse
                </Link>
                {book.forLend && (
                  <Button variant="secondary" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Request to Lend
                  </Button>
                )}
                {book.forSale && (
                  <Button variant="primary" fullWidth={false} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Buy Now
                  </Button>
                )}
                {book.forSale && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                    icon={<Gavel className="w-4 h-4" />}
                    onClick={() => setShowBidModal(true)}
                  >
                    Place Bid
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 shadow-2xl">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Place a Bid</h3>
              <button onClick={() => setShowBidModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {book && (
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Book: <span className="font-medium">{book.title}</span></p>
                <p className="text-gray-600 mb-4">Current Price: <span className="font-medium text-green-600">Rs. {book.price}</span></p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount (Rs.)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your bid amount"
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" fullWidth onClick={() => setShowBidModal(false)} className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100">
                Cancel
              </Button>
              <Button variant="primary" fullWidth onClick={handleBidSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Submit Bid
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;