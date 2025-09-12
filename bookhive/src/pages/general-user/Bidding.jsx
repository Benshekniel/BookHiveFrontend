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
  Timer,
  Trophy,
  CreditCard,
  Banknote,
  Truck
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [deliveryAmount] = useState(100); // Fixed delivery charge
  const [hasWithdrawn, setHasWithdrawn] = useState(false);
  
  // Auction timing state
  const [auctionData] = useState({
    startDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
    endDate: new Date(Date.now() - 1 * 60 * 1000), // Ended 10 minutes ago (FOR DEMO)
    initialBiddingAmount: 500 // Initial minimum bid
  });
  
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
          { 
            id: 4, 
            bidder: "You", // Current user is now the highest bidder (DEMO)
            amount: 1500, 
            time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), 
            status: "Active",
            trustScore: 4.5
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
    const initialAmount = auctionData.initialBiddingAmount || 0;
    return Math.max(currentHighest + 50, initialAmount + 50); // Minimum increment of 50 above current highest or initial
  }, [highestBid, book, auctionData.initialBiddingAmount]);

  // Check if auction has ended
  const isAuctionEnded = useMemo(() => {
    return new Date() > new Date(auctionData.endDate);
  }, [auctionData.endDate]);

  // Check if current user is the winner
  const isCurrentUserWinner = useMemo(() => {
    if (!isAuctionEnded || !highestBid || hasWithdrawn) return false;
    return highestBid.bidder === currentUser.name && highestBid.status !== "Withdrawn";
  }, [isAuctionEnded, highestBid, currentUser.name, hasWithdrawn]);

  // Get auction winner (could be current user or next highest if withdrawn)
  const auctionWinner = useMemo(() => {
    if (!isAuctionEnded) return null;
    
    const activeBids = currentBids.filter(bid => bid.status !== "Withdrawn");
    if (activeBids.length === 0) return null;
    
    return activeBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), activeBids[0]);
  }, [isAuctionEnded, currentBids]);

  // Check if current user has won but withdrawn
  const hasCurrentUserWithdrawn = useMemo(() => {
    return currentBids.some(bid => 
      bid.bidder === currentUser.name && 
      bid.status === "Withdrawn"
    );
  }, [currentBids, currentUser.name]);

  // Time remaining calculation
  const timeRemaining = useMemo(() => {
    const now = new Date();
    const endTime = new Date(auctionData.endDate);
    const diff = endTime - now;
    
    if (diff <= 0) return "Auction Ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  }, [auctionData.endDate]);

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
    
    if (numAmount < auctionData.initialBiddingAmount) {
      return `Minimum bid is Rs. ${auctionData.initialBiddingAmount}`;
    }
    
    if (numAmount < minimumBidAmount) {
      return `Minimum bid is Rs. ${minimumBidAmount}`;
    }
    
    if (numAmount > book?.price * 3) {
      return `Bid seems too high. Maximum recommended: Rs. ${book?.price * 3}`;
    }
    
    return null;
  };

  // Event handlers
  const handleBidSubmit = async () => {
    if (!book || isAuctionEnded) return;
    
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
      console.error("Bidding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Payment successful! You will receive delivery details shortly.");
      setShowPaymentModal(false);
      
      // Update bid status to "Won"
      setBidHistory(prev => ({
        ...prev,
        [id]: prev[id].map(bid => 
          bid.bidder === currentUser.name && bid.amount === highestBid.amount
            ? { ...bid, status: "Won" }
            : bid
        )
      }));
      
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCancel = () => {
    const confirmed = window.confirm(
      "Warning: If you withdraw from this auction, your trust score will be decreased by 200 points. Are you sure you want to continue?"
    );
    
    if (confirmed) {
      setHasWithdrawn(true);
      setShowPaymentModal(false);
      
      // Find current user's winning bid and mark as withdrawn
      const currentUserWinningBid = currentBids.find(bid => 
        bid.bidder === currentUser.name && bid.amount === highestBid.amount
      );
      
      // Find next highest bidder (excluding current user's bids)
      const otherBids = currentBids.filter(bid => bid.bidder !== currentUser.name);
      const nextHighestBid = otherBids.length > 0 
        ? otherBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), otherBids[0])
        : null;
      
      // Update bid history with withdrawal and new winner
      setBidHistory(prev => ({
        ...prev,
        [id]: prev[id].map(bid => {
          if (bid.id === currentUserWinningBid?.id) {
            return { ...bid, status: "Withdrawn" };
          }
          if (nextHighestBid && bid.id === nextHighestBid.id) {
            return { ...bid, status: "Winner" };
          }
          return bid;
        })
      }));
      
      // Show withdrawal message
      alert("Your trust score has been decreased by 200 points. The book will be offered to the next highest bidder.");
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

          {/* Auction Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600 font-medium">Auction Started</div>
                <div className="text-gray-800">{new Date(auctionData.startDate).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600 font-medium">Auction Ends</div>
                <div className="text-gray-800">{new Date(auctionData.endDate).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600 font-medium">Time Remaining</div>
                <div className={`font-bold ${isAuctionEnded ? 'text-red-600' : 'text-green-600'}`}>
                  {timeRemaining}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-gray-600 font-medium text-sm">Initial Bidding Amount</div>
              <div className="text-xl font-bold text-blue-600">Rs. {auctionData.initialBiddingAmount}</div>
            </div>
          </div>

          {/* Auction Status Alert */}
          {isAuctionEnded && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="font-medium text-red-800">Auction Ended</p>
                  {auctionWinner && (
                    <p className="text-sm text-red-600">
                      Winner: {auctionWinner.bidder} with Rs. {auctionWinner.amount}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Winner Notification for Current User */}
          {isCurrentUserWinner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-6 h-6 text-green-600 mr-2" />
                  <div>
                    <p className="font-bold text-green-800 text-lg">Congratulations! You Won!</p>
                    <p className="text-sm text-green-600">
                      Winning bid: Rs. {highestBid.amount}
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Continue with Payment
                </Button>
              </div>
            </div>
          )}

          {/* Withdrawal Message for Current User */}
          {hasCurrentUserWithdrawn && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                <div>
                  <p className="font-bold text-red-800 text-lg">You Withdrew</p>
                  <p className="text-sm text-red-600">
                    Your trust score has been decreased by 200 points. The book has been offered to the next highest bidder.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-blue-600 font-semibold text-sm">Current Highest</div>
              <div className="text-xl font-bold text-blue-800">
                Rs. {highestBid?.amount || auctionData.initialBiddingAmount}
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
                Rs. {bidStatistics.averageBid > 0 ? Math.round(bidStatistics.averageBid) : auctionData.initialBiddingAmount}
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
            
            {/* Auction ended message */}
            {isAuctionEnded && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <p className="text-gray-700 font-medium">Bidding has ended</p>
                </div>
              </div>
            )}
            
            {/* Current highest bid alert */}
            {!isAuctionEnded && highestBid && (
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

            {/* Bid input - only show if auction hasn't ended */}
            {!isAuctionEnded && (
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
                    Minimum bid: Rs. {minimumBidAmount} (Initial: Rs. {auctionData.initialBiddingAmount})
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
            )}
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
                .map((bid) => {
                  let statusColor = 'bg-gray-50 border-gray-200';
                  let statusBadge = null;
                  
                  // Check if this bid is the current winner (after any withdrawals)
                  const isCurrentWinner = isAuctionEnded && auctionWinner && 
                    bid.id === auctionWinner.id && bid.status !== "Withdrawn";
                  
                  if (bid.status === "Withdrawn") {
                    statusColor = 'bg-red-50 border-red-200';
                    statusBadge = (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Withdrawn
                      </span>
                    );
                  } else if (isCurrentWinner || bid.status === "Winner") {
                    statusColor = 'bg-green-50 border-green-200';
                    statusBadge = (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner
                      </span>
                    );
                  } else if (bid.bidder === currentUser.name) {
                    statusColor = 'bg-blue-50 border-blue-200';
                  }
                  
                  return (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${statusColor}`}
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
                        {statusBadge}
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
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Gavel className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No bids yet. Be the first to bid!</p>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Trophy className="w-6 h-6 text-green-500 mr-2" />
                  Payment for Winning Bid
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Book Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex gap-4">
                  <img
                    src={book.cover || 'https://via.placeholder.com/80'}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-sm text-gray-600">Condition: {book.condition}</p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Winning Bid Amount:</span>
                    <span className="font-medium">Rs. {highestBid?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span className="font-medium">Rs. {deliveryAmount}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>Rs. {(highestBid?.amount || 0) + deliveryAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border rounded-lg flex items-center justify-center ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 border rounded-lg flex items-center justify-center ${
                      paymentMethod === 'cash'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mr-2" />
                    Cash on Delivery
                  </button>
                </div>
              </div>

              {/* Card Details (if card payment selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Info for Cash Payment */}
              {paymentMethod === 'cash' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      You will pay Rs. {(highestBid?.amount || 0) + deliveryAmount} to the delivery agent upon receiving the book.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handlePaymentCancel}
                  className="flex-1 border border-red-300 text-red-700 hover:bg-red-50"
                  disabled={loading}
                >
                  Cancel & Withdraw
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  {loading ? (
                    <>
                      <Timer className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {paymentMethod === 'card' ? 'Pay Now' : 'Confirm Order'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingPage;