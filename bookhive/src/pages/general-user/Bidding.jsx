import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  Gavel, 
  X, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  User, 
  MapPin, 
  Star,
  ArrowLeft,
  Timer
} from "lucide-react";
import Button from "../../components/shared/Button";

const BiddingPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;
  
  // State management
  const [bidAmount, setBidAmount] = useState("");
  const [bidHistory, setBidHistory] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showBidTips, setShowBidTips] = useState(false);
  
  // Mock user data - replace with actual user context
  const [currentUser] = useState({
    id: "current-user",
    name: "You",
    trustScore: 4.5
  });

  // Initialize bid history
  useEffect(() => {
    if (id) {
      // Mock bid history - replace with actual API call
      setBidHistory({
        [id]: [
          { 
            id: 1, 
            bidder: "Sarah Johnson", 
            amount: 1000, 
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
            status: "Active",
            trustScore: 4.2
          },
          { 
            id: 2, 
            bidder: "Mike Chen", 
            amount: 1200, 
            time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), 
            status: "Active",
            trustScore: 4.7
          },
          { 
            id: 3, 
            bidder: "Alex Rivera", 
            amount: 1350, 
            time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), 
            status: "Active",
            trustScore: 4.1
          },
        ],
      });
    }
  }, [id]);

  // Memoized calculations
  const currentBids = useMemo(() => bidHistory[id] || [], [bidHistory, id]);
  
  const highestBid = useMemo(() => {
    if (currentBids.length === 0) return null;
    return currentBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), currentBids[0]);
  }, [currentBids]);

  const userBids = useMemo(() => 
    currentBids.filter(bid => bid.bidder === currentUser.name),
    [currentBids, currentUser.name]
  );

  const minimumBidAmount = useMemo(() => {
    if (!book) return 0;
    const currentHighest = highestBid?.amount || 0;
    const bookPrice = book.price || 0;
    return Math.max(currentHighest + 50, bookPrice * 0.1); // Minimum increment of 50 or 10% of book price
  }, [highestBid, book]);

  const bidStatistics = useMemo(() => {
    if (currentBids.length === 0) return { totalBids: 0, uniqueBidders: 0, averageBid: 0 };
    
    const uniqueBidders = new Set(currentBids.map(bid => bid.bidder)).size;
    const totalBids = currentBids.length;
    const averageBid = currentBids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids;
    
    return { totalBids, uniqueBidders, averageBid };
  }, [currentBids]);

  // Validation
  const validateBid = (amount) => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      return "Please enter a valid bid amount";
    }
    
    if (numAmount <= 0) {
      return "Bid amount must be positive";
    }
    
    if (numAmount < minimumBidAmount) {
      return `Minimum bid is Rs. ${minimumBidAmount}`;
    }
    
    if (numAmount > book?.price * 2) {
      return `Bid seems too high. Maximum recommended: Rs. ${book?.price * 2}`;
    }
    
    return null;
  };

  // Event handlers
  const handleBidSubmit = async () => {
    if (!book) return;
    
    const validationError = validateBid(bidAmount);
    if (validationError) {
      setErrors({ bidAmount: validationError });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBid = {
        id: Date.now(),
        bidder: currentUser.name,
        amount: parseInt(bidAmount),
        time: new Date().toISOString(),
        status: "Active",
        trustScore: currentUser.trustScore
      };

      setBidHistory(prev => ({
        ...prev,
        [id]: [...(prev[id] || []), newBid]
      }));

      setBidAmount("");
      
      // Show success message
      alert(`Your bid of Rs. ${bidAmount} has been submitted for "${book.title}"`);
      
    } catch (error) {
      setErrors({ submit: "Failed to submit bid. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    setBidAmount(value);
    
    // Clear validation errors when user starts typing
    if (errors.bidAmount) {
      setErrors(prev => ({ ...prev, bidAmount: null }));
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - bidTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Error fallback
  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-xl mx-auto text-center py-12">
          <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Book not found</h2>
          <p className="text-gray-600 mb-6">The book you're trying to bid on could not be found.</p>
          <Button
            variant="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/books")}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Bidding for "{book.title}"
              </h1>
              <p className="text-gray-600">by {book.author}</p>
            </div>
            <button
              onClick={() => navigate("/books")}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-blue-600 font-semibold text-sm">Current Highest</div>
              <div className="text-xl font-bold text-blue-800">
                Rs. {highestBid?.amount || book.price}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 font-semibold text-sm">Total Bids</div>
              <div className="text-xl font-bold text-green-800">{bidStatistics.totalBids}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-purple-600 font-semibold text-sm">Bidders</div>
              <div className="text-xl font-bold text-purple-800">{bidStatistics.uniqueBidders}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-orange-600 font-semibold text-sm">Avg Bid</div>
              <div className="text-xl font-bold text-orange-800">
                Rs. {bidStatistics.averageBid > 0 ? Math.round(bidStatistics.averageBid) : book.price}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book Information */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img
                  src={book.cover || 'https://via.placeholder.com/150'}
                  alt={book.title}
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{book.location}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Condition:</span> {book.condition}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Listed Price:</span> Rs. {book.price}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Genre:</span> {book.genre?.join(", ")}
                </div>
                <div className="flex items-center text-sm mt-2">
                  <img
                    src={book.owner?.avatar || 'https://via.placeholder.com/40'}
                    alt={book.owner?.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-gray-600">{book.owner?.name}</span>
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {book.owner?.trustScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
            
            {/* Current highest bid alert */}
            {highestBid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Current highest bid: Rs. {highestBid.amount}
                    </p>
                    <p className="text-xs text-yellow-600">
                      by {highestBid.bidder} • {formatTimeAgo(highestBid.time)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Your current bid status */}
            {userBids.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Your highest bid: Rs. {Math.max(...userBids.map(b => b.amount))}
                    </p>
                    <p className="text-xs text-blue-600">
                      {userBids.length} bid{userBids.length > 1 ? 's' : ''} placed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bid input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount (Rs.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={handleBidAmountChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-lg ${
                      errors.bidAmount ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder={`Minimum: Rs. ${minimumBidAmount}`}
                    min={minimumBidAmount}
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <Gavel className="w-5 h-5" />
                  </div>
                </div>
                {errors.bidAmount && (
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.bidAmount}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Minimum bid: Rs. {minimumBidAmount}
                </p>
              </div>

              {/* Bid tips */}
              <div className="bg-gray-50 rounded-lg p-3">
                <button
                  onClick={() => setShowBidTips(!showBidTips)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showBidTips ? 'Hide' : 'Show'} Bidding Tips
                </button>
                {showBidTips && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p>• Bid incrementally to stay competitive</p>
                    <p>• Monitor the auction closely in the final minutes</p>
                    <p>• Set a maximum budget and stick to it</p>
                    <p>• Consider the book's condition and market value</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/user/browse-books")}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleBidSubmit}
                  disabled={loading || !bidAmount || !!errors.bidAmount}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Timer className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Gavel className="w-4 h-4 mr-2" />
                      Place Bid
                    </>
                  )}
                </Button>
              </div>

              {errors.submit && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.submit}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bid History */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Bid History ({currentBids.length})
          </h3>
          
          {currentBids.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentBids
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .map((bid) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      bid.bidder === currentUser.name 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className={`font-medium ${
                          bid.bidder === currentUser.name ? 'text-blue-800' : 'text-gray-800'
                        }`}>
                          {bid.bidder}
                        </span>
                        {bid.trustScore && (
                          <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {bid.trustScore}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        bid.bidder === currentUser.name ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        Rs. {bid.amount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeAgo(bid.time)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Gavel className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No bids yet. Be the first to bid!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiddingPage;