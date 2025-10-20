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
import { useAuth } from "../../components/AuthContext";

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:9090/api";

const BiddingPage = () => {
  const { id } = useParams(); // /user/browse-books/bidding/:id
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const book = state?.book;

  if (!user) return null;

  // Local state
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
  const [deliveryAmount] = useState(100);
  const [hasWithdrawn, setHasWithdrawn] = useState(false);
  const [fetchingBids, setFetchingBids] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  // Auto-apply winner control
  const [winnerApplying, setWinnerApplying] = useState(false);
  const [winnerApplied, setWinnerApplied] = useState(false);

  // Auction meta from Bid_History
  const [auctionData, setAuctionData] = useState({
    bidId: null,
    startDate: null,
    endDate: null,
    initialBiddingAmount: undefined, // authoritative from Bid_History when available
    bidEnd: false,
    bidWinner: null,
    bookImage: null,
  });

  // Map backend user_bid -> UI
  const mapBackendBid = (b) => ({
    id: b.placemet_id,
    placementId: b.placemet_id,
    bidId: b.bid_id,
    bookId: b.bookId,
    userId: b.user_id,
    amount: b.bid_amount,
    bidder: b.name,
    time: b.created_at,
    status: "Active",
    trustScore: null,
  });

  // Fetch all user bids for a book
  const fetchBids = async () => {
    if (!id) return;
    try {
      setFetchingBids(true);
      const res = await fetch(`${API_BASE}/bidFetch/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch bids: ${res.status}`);
      const data = await res.json();
      const mapped = Array.isArray(data) ? data.map(mapBackendBid) : [];
      setBidHistory((prev) => ({ ...prev, [id]: mapped }));
    } catch (err) {
      console.error("Fetch bids error:", err);
    } finally {
      setFetchingBids(false);
    }
  };

  // Fetch Bid_History meta for a book
  const fetchAuctionMeta = async () => {
    if (!id) return;
    try {
      setFetchingMeta(true);
      const res = await fetch(`${API_BASE}/bidHistoryFetch/${id}`);
      if (!res.ok) {
        throw new Error(`fetch meta status ${res.status}`);
      }
      const arr = await res.json(); // array
      if (!Array.isArray(arr) || arr.length === 0) return;

      // Choose the most recent by biddingStartDate
      arr.sort((a, b) => new Date(b.biddingStartDate) - new Date(a.biddingStartDate));
      const h = arr[0];

      setAuctionData({
        bidId: h?.bid_id ?? null,
        startDate: h?.biddingStartDate ? new Date(h.biddingStartDate) : null,
        endDate: h?.biddingEndDate ? new Date(h.biddingEndDate) : null,
        initialBiddingAmount: typeof h?.initial_bid_amount === "number" ? h.initial_bid_amount : Number(h?.initial_bid_amount ?? 0),
        bidEnd: !!h?.bidEnd,
        bidWinner: h?.bidWinner ?? null,
        bookImage: h?.bookImage ?? null,
      });
    } catch (err) {
      console.warn("Bid_History meta not available:", err.message);
    } finally {
      setFetchingMeta(false);
    }
  };

  // Initial load + refresh bids periodically
  useEffect(() => {
    fetchAuctionMeta();
    fetchBids();
    const interval = setInterval(fetchBids, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Current bids for this book
  const currentBids = useMemo(() => bidHistory[id] || [], [bidHistory, id]);

  // Highest bid
  const highestBid = useMemo(() => {
    if (currentBids.length === 0) return null;
    return currentBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), currentBids[0]);
  }, [currentBids]);

  // User bids
  const userBids = useMemo(
    () => currentBids.filter((bid) => bid.bidder === user.name),
    [currentBids, user.name]
  );

  // Timeline and countdown
  const hasTimeline = !!(auctionData.startDate && auctionData.endDate);
  const isAuctionStarted = useMemo(() => {
    if (!hasTimeline) return true;
    return new Date() >= new Date(auctionData.startDate);
  }, [hasTimeline, auctionData.startDate]);

  const isAuctionEnded = useMemo(() => {
    if (!hasTimeline) return false;
    return new Date() > new Date(auctionData.endDate);
  }, [hasTimeline, auctionData.endDate]);

  const biddingActive = isAuctionStarted && !isAuctionEnded;

  const timeRemaining = useMemo(() => {
    if (!hasTimeline) return "—";
    const now = new Date();
    const endTime = new Date(auctionData.endDate);
    const diff = endTime - now;
    if (diff <= 0) return "Auction Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  }, [hasTimeline, auctionData.endDate]);

  // Helper to extract numeric from candidates
  const extractNumber = (...candidates) => {
    for (const v of candidates) {
      const n = v !== undefined && v !== null ? Number(v) : NaN;
      if (!isNaN(n) && isFinite(n)) return n;
    }
    return undefined;
  };

  // Effective initial bid (Bid_History -> state/book -> bids min -> book.price -> 0)
  const effectiveInitial = useMemo(() => {
    // 1) Bid_History (authoritative)
    if (auctionData.initialBiddingAmount !== undefined && auctionData.initialBiddingAmount !== null) {
      const n = Number(auctionData.initialBiddingAmount);
      if (!isNaN(n)) return n;
    }
    // 2) Route state/book aliases
    const fromProps = extractNumber(
      state?.initialBidAmount,
      state?.initial_bid_amount,
      state?.initialBiddingAmount,
      state?.initial_bidding_amount,
      state?.startingBid,
      state?.starting_bid,
      state?.startingPrice,
      state?.starting_price,
      state?.minBid,
      state?.min_bid,
      state?.minStartingBid,
      book?.initialBidAmount,
      book?.initial_bid_amount,
      book?.initialBiddingAmount,
      book?.initial_bidding_amount,
      book?.startingBid,
      book?.starting_bid,
      book?.startingPrice,
      book?.starting_price,
      book?.minBid,
      book?.min_bid,
      book?.minStartingBid
    );
    if (fromProps !== undefined) return fromProps;
    // 3) Use min of existing bids
    if (currentBids.length > 0) {
      const min = currentBids.reduce((acc, b) => Math.min(acc, Number(b.amount)), Number(currentBids[0].amount));
      return isNaN(min) ? 0 : min;
    }
    // 4) Listed price fallback
    if (book?.price) {
      const n = Number(book.price);
      if (!isNaN(n)) return n;
    }
    // 5) Final fallback
    return 0;
  }, [auctionData.initialBiddingAmount, state, book, currentBids]);

  // Minimum allowed: strictly greater than both initial and highest
  const minAllowed = useMemo(() => {
    const current = Number(highestBid?.amount || 0);
    return Math.max(current, effectiveInitial) + 1;
  }, [highestBid, effectiveInitial]);

  // Stats
  const bidStatistics = useMemo(() => {
    if (currentBids.length === 0) return { totalBids: 0, uniqueBidders: 0, averageBid: 0 };
    const uniqueBidders = new Set(currentBids.map(bid => bid.bidder)).size;
    const totalBids = currentBids.length;
    const averageBid = currentBids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids;
    return { totalBids, uniqueBidders, averageBid };
  }, [currentBids]);

  // Winner logic (UI-only)
  const auctionWinner = useMemo(() => {
    if (!isAuctionEnded) return null;
    const activeBids = currentBids.filter(bid => bid.status !== "Withdrawn");
    if (activeBids.length === 0) return null;
    return activeBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), activeBids[0]);
  }, [isAuctionEnded, currentBids]);

  const highestBeforeEnd = highestBid; // alias for clarity

  const isCurrentUserWinner = useMemo(() => {
    if (!isAuctionEnded || !auctionWinner || hasWithdrawn) return false;
    return auctionWinner.bidder === user.name && auctionWinner.status !== "Withdrawn";
  }, [isAuctionEnded, auctionWinner, user.name, hasWithdrawn]);

  const hasCurrentUserWithdrawn = useMemo(() => {
    return currentBids.some(bid => bid.bidder === user.name && bid.status === "Withdrawn");
  }, [currentBids, user.name]);

  // Validation
  const validateBid = (amount) => {
    const num = Number(amount);
    if (!amount || isNaN(num)) return "Please enter a valid bid amount";
    if (num <= 0) return "Bid amount must be positive";
    if (num <= effectiveInitial) return `Bid must be greater than the initial bid (Rs. ${effectiveInitial})`;
    const current = Number(highestBid?.amount || 0);
    if (num <= current) return `Bid must be greater than the current highest bid (Rs. ${current})`;
    return null;
  };

  // Submit bid -> POST /api/bids/place
  const handleBidSubmit = async () => {
    if (!book || !biddingActive) return;

    const validationError = validateBid(bidAmount);
    if (validationError) {
      setErrors({ bidAmount: validationError });
      return;
    }

    // Prefer bidId from Bid_History meta
    const derivedBidId =
      auctionData.bidId ??
      currentBids?.[0]?.bidId ??
      state?.bidId ?? state?.bid_id ??
      book?.bidId ?? book?.bid_id;

    if (!derivedBidId) {
      setErrors({
        submit:
          "Missing bidId. Please ensure Bid_History exists for this book or pass bidId via route state."
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        bidId: Number(derivedBidId),
        bookId: Number(id),
        userId: Number(user.userId),
        bidAmount: Number(bidAmount),
        name: user.name
      };

      const res = await fetch(`${API_BASE}/bids/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit bid");
      }

      let msg = "";
      try { msg = await res.text(); } catch (_) {}

      await fetchBids(); // refresh to show server timestamps
      setBidAmount("");
      alert(msg || `Your bid of Rs. ${payload.bidAmount} has been submitted for "${book.title}"`);
    } catch (error) {
      setErrors({ submit: error.message || "Failed to submit bid. Please try again." });
      console.error("Bidding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Payment successful! You will receive delivery details shortly.");
      setShowPaymentModal(false);
      // UI-only status update
      setBidHistory(prev => ({
        ...prev,
        [id]: prev[id]?.map(bid => 
          auctionWinner && bid.id === auctionWinner.id
            ? { ...bid, status: "Won" }
            : bid
        ) || []
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

      const currentUserWinningBid = auctionWinner && currentBids.find(bid => 
        bid.bidder === user.name && bid.id === auctionWinner.id
      );
      const otherBids = currentBids.filter(bid => bid.bidder !== user.name);
      const nextHighestBid = otherBids.length > 0 
        ? otherBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), otherBids[0])
        : null;

      setBidHistory(prev => ({
        ...prev,
        [id]: (prev[id] || []).map(bid => {
          if (currentUserWinningBid && bid.id === currentUserWinningBid.id) {
            return { ...bid, status: "Withdrawn" };
          }
          if (nextHighestBid && bid.id === nextHighestBid.id) {
            return { ...bid, status: "Winner" };
          }
          return bid;
        })
      }));

      alert("Your trust score has been decreased by 200 points. The book will be offered to the next highest bidder.");
    }
  };

  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    setBidAmount(value);
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

  // Auto-apply winner to Bid_History when auction ends
  const applyWinnerToHistory = async (bidId, winnerName) => {
    try {
      setWinnerApplying(true);
      const url = `${API_BASE}/bidHistoryApplywinner?bidId=${encodeURIComponent(bidId)}&winnerName=${encodeURIComponent(winnerName)}`;
      const res = await fetch(url, { method: "PUT" });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to update winner");
      // Reflect in local meta
      setAuctionData(prev => ({ ...prev, bidWinner: winnerName }));
      setWinnerApplied(true);
      console.info(text || "Winner applied");
    } catch (err) {
      console.error("Apply winner error:", err);
    } finally {
      setWinnerApplying(false);
    }
  };

  useEffect(() => {
    if (!isAuctionEnded) return;
    if (winnerApplied) return;
    if (auctionData.bidWinner) return; // already set on server
    const finalWinnerName = auctionWinner?.bidder || highestBeforeEnd?.bidder;
    const finalBidId = auctionData.bidId ?? currentBids?.[0]?.bidId ?? state?.bidId ?? state?.bid_id ?? book?.bidId ?? book?.bid_id;
    if (!finalWinnerName || !finalBidId) return;
    applyWinnerToHistory(Number(finalBidId), finalWinnerName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuctionEnded, auctionWinner, highestBeforeEnd, auctionData.bidId, auctionData.bidWinner, winnerApplied]);

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
                <div className="text-gray-800">
                  {auctionData.startDate ? new Date(auctionData.startDate).toLocaleString() : (fetchingMeta ? "Loading..." : "—")}
                </div>
              </div>
              <div>
                <div className="text-gray-600 font-medium">Auction Ends</div>
                <div className="text-gray-800">
                  {auctionData.endDate ? new Date(auctionData.endDate).toLocaleString() : (fetchingMeta ? "Loading..." : "—")}
                </div>
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
              <div className="text-xl font-bold text-blue-600">Rs. {effectiveInitial}</div>
            </div>
          </div>

          {/* Auction Status Alert */}
          {isAuctionEnded && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="font-medium text-red-800">Auction Ended {winnerApplying ? "(applying winner...)" : ""}</p>
                  {(auctionWinner || auctionData.bidWinner) && (
                    <p className="text-sm text-red-600">
                      Winner: {auctionData.bidWinner || auctionWinner?.bidder} with Rs. {auctionWinner?.amount ?? highestBeforeEnd?.amount ?? "-"}
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
                      Winning bid: Rs. {auctionWinner?.amount}
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
                Rs. {highestBid?.amount || effectiveInitial}
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
                Rs. {bidStatistics.averageBid > 0 ? Math.round(bidStatistics.averageBid) : effectiveInitial}
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
                  <span className="font-medium">Genre:</span> {Array.isArray(book.genre) ? book.genre.join(", ") : book.genre}
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

            {!isAuctionStarted && hasTimeline && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <p className="text-gray-700 font-medium">Auction not started yet</p>
                </div>
              </div>
            )}

            {isAuctionEnded && hasTimeline && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <p className="text-gray-700 font-medium">Bidding has ended</p>
                </div>
              </div>
            )}
            
            {biddingActive && highestBid && (
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

            {biddingActive && (
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
                      placeholder={`Minimum: Rs. ${minAllowed}`}
                      min={minAllowed}
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
                    Must be greater than both the initial bid (Rs. {effectiveInitial}) and the current highest bid (Rs. {highestBid?.amount || 0}).
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <button
                    onClick={() => setShowBidTips(!showBidTips)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showBidTips ? 'Hide' : 'Show'} Bidding Tips
                  </button>
                  {showBidTips && (
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <p>• Place a bid slightly above the current highest to stay ahead</p>
                      <p>• Monitor the auction close to the end time</p>
                      <p>• Set a maximum budget and stick to it</p>
                    </div>
                  )}
                </div>

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
            Bid History ({currentBids.length}) {fetchingBids && <span className="text-xs text-gray-400 ml-2">refreshing...</span>}
          </h3>
          
          {currentBids.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentBids
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .map((bid) => {
                  let statusColor = 'bg-gray-50 border-gray-200';
                  let statusBadge = null;
                  
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
                  } else if (bid.bidder === user.name) {
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
                            bid.bidder === user.name ? 'text-blue-800' : 'text-gray-800'
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
                          bid.bidder === user.name ? 'text-blue-800' : 'text-gray-800'
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
                    <span className="font-medium">Rs. {auctionWinner?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span className="font-medium">Rs. {deliveryAmount}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>Rs. {(auctionWinner?.amount || 0) + deliveryAmount}</span>
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

              {/* Card Details */}
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
                      You will pay Rs. {(auctionWinner?.amount || 0) + deliveryAmount} to the delivery agent upon receiving the book.
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


// import React, { useState, useEffect, useMemo } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { 
//   Gavel, 
//   X, 
//   Clock, 
//   TrendingUp, 
//   AlertCircle, 
//   CheckCircle, 
//   User, 
//   MapPin, 
//   Star,
//   ArrowLeft,
//   Timer,
//   Trophy,
//   CreditCard,
//   Banknote,
//   Truck
// } from "lucide-react";
// import Button from "../../components/shared/Button";
// import { useAuth } from "../../components/AuthContext";

// const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:9090/api";

// const BiddingPage = () => {
//   const { id } = useParams(); // /user/browse-books/bidding/:id
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const book = state?.book;

//   if (!user) return null;

//   // Local state
//   const [bidAmount, setBidAmount] = useState("");
//   const [bidHistory, setBidHistory] = useState({});
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showBidTips, setShowBidTips] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [cardDetails, setCardDetails] = useState({
//     number: "",
//     expiry: "",
//     cvv: "",
//     name: ""
//   });
//   const [deliveryAmount] = useState(100);
//   const [hasWithdrawn, setHasWithdrawn] = useState(false);
//   const [fetchingBids, setFetchingBids] = useState(false);
//   const [fetchingMeta, setFetchingMeta] = useState(false);

//   // Auction meta from Bid_History
//   const [auctionData, setAuctionData] = useState({
//     bidId: null,
//     startDate: null,
//     endDate: null,
//     initialBiddingAmount: undefined, // authoritative from Bid_History when available
//     bidEnd: false,
//     bidWinner: null,
//     bookImage: null,
//   });

//   // Map backend user_bid -> UI
//   const mapBackendBid = (b) => ({
//     id: b.placemet_id,
//     placementId: b.placemet_id,
//     bidId: b.bid_id,
//     bookId: b.bookId,
//     userId: b.user_id,
//     amount: b.bid_amount,
//     bidder: b.name,
//     time: b.created_at,
//     status: "Active",
//     trustScore: null,
//   });

//   // Fetch all user bids for a book
//   const fetchBids = async () => {
//     if (!id) return;
//     try {
//       setFetchingBids(true);
//       const res = await fetch(`${API_BASE}/bidFetch/${id}`);
//       if (!res.ok) throw new Error(`Failed to fetch bids: ${res.status}`);
//       const data = await res.json();
//       const mapped = Array.isArray(data) ? data.map(mapBackendBid) : [];
//       setBidHistory((prev) => ({ ...prev, [id]: mapped }));
//     } catch (err) {
//       console.error("Fetch bids error:", err);
//     } finally {
//       setFetchingBids(false);
//     }
//   };

//   // Fetch Bid_History meta for a book
//   const fetchAuctionMeta = async () => {
//     if (!id) return;
//     try {
//       setFetchingMeta(true);
//       const res = await fetch(`${API_BASE}/bidHistoryFetch/${id}`);
//       if (!res.ok) {
//         // 404 means no history; keep previous behavior/fallbacks
//         throw new Error(`fetch meta status ${res.status}`);
//       }
//       const arr = await res.json(); // array
//       if (!Array.isArray(arr) || arr.length === 0) return;

//       // Choose the most recent by biddingStartDate (in case multiple records exist)
//       arr.sort((a, b) => new Date(b.biddingStartDate) - new Date(a.biddingStartDate));
//       const h = arr[0];

//       setAuctionData({
//         bidId: h?.bid_id ?? null,
//         startDate: h?.biddingStartDate ? new Date(h.biddingStartDate) : null,
//         endDate: h?.biddingEndDate ? new Date(h.biddingEndDate) : null,
//         initialBiddingAmount: typeof h?.initial_bid_amount === "number" ? h.initial_bid_amount : Number(h?.initial_bid_amount ?? 0),
//         bidEnd: !!h?.bidEnd,
//         bidWinner: h?.bidWinner ?? null,
//         bookImage: h?.bookImage ?? null,
//       });
//     } catch (err) {
//       console.warn("Bid_History meta not available:", err.message);
//       // leave auctionData as-is; UI will fallback
//     } finally {
//       setFetchingMeta(false);
//     }
//   };

//   // Initial load + refresh bids periodically
//   useEffect(() => {
//     fetchAuctionMeta();
//     fetchBids();
//     const interval = setInterval(fetchBids, 10000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   // Current bids for this book
//   const currentBids = useMemo(() => bidHistory[id] || [], [bidHistory, id]);

//   // Highest bid
//   const highestBid = useMemo(() => {
//     if (currentBids.length === 0) return null;
//     return currentBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), currentBids[0]);
//   }, [currentBids]);

//   // User bids
//   const userBids = useMemo(
//     () => currentBids.filter((bid) => bid.bidder === user.name),
//     [currentBids, user.name]
//   );

//   // Timeline and countdown (authoritative from Bid_History, fallback to open if missing)
//   const hasTimeline = !!(auctionData.startDate && auctionData.endDate);
//   const isAuctionStarted = useMemo(() => {
//     if (!hasTimeline) return true;
//     return new Date() >= new Date(auctionData.startDate);
//   }, [hasTimeline, auctionData.startDate]);

//   const isAuctionEnded = useMemo(() => {
//     if (!hasTimeline) return false;
//     return new Date() > new Date(auctionData.endDate);
//   }, [hasTimeline, auctionData.endDate]);

//   const biddingActive = isAuctionStarted && !isAuctionEnded;

//   const timeRemaining = useMemo(() => {
//     if (!hasTimeline) return "—";
//     const now = new Date();
//     const endTime = new Date(auctionData.endDate);
//     const diff = endTime - now;
//     if (diff <= 0) return "Auction Ended";
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${minutes}m remaining`;
//   }, [hasTimeline, auctionData.endDate]);

//   // Helper to extract numeric from candidates
//   const extractNumber = (...candidates) => {
//     for (const v of candidates) {
//       const n = v !== undefined && v !== null ? Number(v) : NaN;
//       if (!isNaN(n) && isFinite(n)) return n;
//     }
//     return undefined;
//   };

//   // Effective initial bid (Bid_History -> state/book -> bids min -> book.price -> 0)
//   const effectiveInitial = useMemo(() => {
//     // 1) Bid_History (authoritative)
//     if (auctionData.initialBiddingAmount !== undefined && auctionData.initialBiddingAmount !== null) {
//       const n = Number(auctionData.initialBiddingAmount);
//       if (!isNaN(n)) return n;
//     }
//     // 2) Route state/book aliases
//     const fromProps = extractNumber(
//       state?.initialBidAmount,
//       state?.initial_bid_amount,
//       state?.initialBiddingAmount,
//       state?.initial_bidding_amount,
//       state?.startingBid,
//       state?.starting_bid,
//       state?.startingPrice,
//       state?.starting_price,
//       state?.minBid,
//       state?.min_bid,
//       state?.minStartingBid,
//       book?.initialBidAmount,
//       book?.initial_bid_amount,
//       book?.initialBiddingAmount,
//       book?.initial_bidding_amount,
//       book?.startingBid,
//       book?.starting_bid,
//       book?.startingPrice,
//       book?.starting_price,
//       book?.minBid,
//       book?.min_bid,
//       book?.minStartingBid
//     );
//     if (fromProps !== undefined) return fromProps;
//     // 3) Use min of existing bids
//     if (currentBids.length > 0) {
//       const min = currentBids.reduce((acc, b) => Math.min(acc, Number(b.amount)), Number(currentBids[0].amount));
//       return isNaN(min) ? 0 : min;
//     }
//     // 4) Listed price fallback
//     if (book?.price) {
//       const n = Number(book.price);
//       if (!isNaN(n)) return n;
//     }
//     // 5) Final fallback
//     return 0;
//   }, [auctionData.initialBiddingAmount, state, book, currentBids]);

//   // Minimum allowed: strictly greater than both initial and highest
//   const minAllowed = useMemo(() => {
//     const current = Number(highestBid?.amount || 0);
//     return Math.max(current, effectiveInitial) + 1;
//   }, [highestBid, effectiveInitial]);

//   // Stats
//   const bidStatistics = useMemo(() => {
//     if (currentBids.length === 0) return { totalBids: 0, uniqueBidders: 0, averageBid: 0 };
//     const uniqueBidders = new Set(currentBids.map(bid => bid.bidder)).size;
//     const totalBids = currentBids.length;
//     const averageBid = currentBids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids;
//     return { totalBids, uniqueBidders, averageBid };
//   }, [currentBids]);

//   // Winner logic (UI-only)
//   const isCurrentUserWinner = useMemo(() => {
//     if (!isAuctionEnded || !highestBid || hasWithdrawn) return false;
//     return highestBid.bidder === user.name && highestBid.status !== "Withdrawn";
//   }, [isAuctionEnded, highestBid, user.name, hasWithdrawn]);

//   const auctionWinner = useMemo(() => {
//     if (!isAuctionEnded) return null;
//     const activeBids = currentBids.filter(bid => bid.status !== "Withdrawn");
//     if (activeBids.length === 0) return null;
//     return activeBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), activeBids[0]);
//   }, [isAuctionEnded, currentBids]);

//   const hasCurrentUserWithdrawn = useMemo(() => {
//     return currentBids.some(bid => bid.bidder === user.name && bid.status === "Withdrawn");
//   }, [currentBids, user.name]);

//   // Validation
//   const validateBid = (amount) => {
//     const num = Number(amount);
//     if (!amount || isNaN(num)) return "Please enter a valid bid amount";
//     if (num <= 0) return "Bid amount must be positive";
//     if (num <= effectiveInitial) return `Bid must be greater than the initial bid (Rs. ${effectiveInitial})`;
//     const current = Number(highestBid?.amount || 0);
//     if (num <= current) return `Bid must be greater than the current highest bid (Rs. ${current})`;
//     return null;
//   };

//   // Submit bid -> POST /api/bids/place
//   const handleBidSubmit = async () => {
//     if (!book || !biddingActive) return;

//     const validationError = validateBid(bidAmount);
//     if (validationError) {
//       setErrors({ bidAmount: validationError });
//       return;
//     }

//     // Prefer bidId from Bid_History meta
//     const derivedBidId =
//       auctionData.bidId ??
//       currentBids?.[0]?.bidId ??
//       state?.bidId ?? state?.bid_id ??
//       book?.bidId ?? book?.bid_id;

//     if (!derivedBidId) {
//       setErrors({
//         submit:
//           "Missing bidId. Please ensure Bid_History exists for this book or pass bidId via route state."
//       });
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       const payload = {
//         bidId: Number(derivedBidId),
//         bookId: Number(id),
//         userId: Number(user.userId),
//         bidAmount: Number(bidAmount),
//         name: user.name
//       };

//       const res = await fetch(`${API_BASE}/bids/place`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Failed to submit bid");
//       }

//       let msg = "";
//       try { msg = await res.text(); } catch (_) {}

//       await fetchBids(); // refresh to show server timestamps
//       setBidAmount("");
//       alert(msg || `Your bid of Rs. ${payload.bidAmount} has been submitted for "${book.title}"`);
//     } catch (error) {
//       setErrors({ submit: error.message || "Failed to submit bid. Please try again." });
//       console.error("Bidding error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       alert("Payment successful! You will receive delivery details shortly.");
//       setShowPaymentModal(false);
//       // UI-only status update
//       setBidHistory(prev => ({
//         ...prev,
//         [id]: prev[id]?.map(bid => 
//           bid.bidder === user.name && highestBid && bid.amount === highestBid.amount
//             ? { ...bid, status: "Won" }
//             : bid
//         ) || []
//       }));
//     } catch (error) {
//       alert("Payment failed. Please try again.");
//       console.error("Payment error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentCancel = () => {
//     const confirmed = window.confirm(
//       "Warning: If you withdraw from this auction, your trust score will be decreased by 200 points. Are you sure you want to continue?"
//     );
//     if (confirmed) {
//       setHasWithdrawn(true);
//       setShowPaymentModal(false);

//       const currentUserWinningBid = highestBid && currentBids.find(bid => 
//         bid.bidder === user.name && bid.amount === highestBid.amount
//       );
//       const otherBids = currentBids.filter(bid => bid.bidder !== user.name);
//       const nextHighestBid = otherBids.length > 0 
//         ? otherBids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), otherBids[0])
//         : null;

//       setBidHistory(prev => ({
//         ...prev,
//         [id]: (prev[id] || []).map(bid => {
//           if (currentUserWinningBid && bid.id === currentUserWinningBid.id) {
//             return { ...bid, status: "Withdrawn" };
//           }
//           if (nextHighestBid && bid.id === nextHighestBid.id) {
//             return { ...bid, status: "Winner" };
//           }
//           return bid;
//         })
//       }));

//       alert("Your trust score has been decreased by 200 points. The book will be offered to the next highest bidder.");
//     }
//   };

//   const handleBidAmountChange = (e) => {
//     const value = e.target.value;
//     setBidAmount(value);
//     if (errors.bidAmount) {
//       setErrors(prev => ({ ...prev, bidAmount: null }));
//     }
//   };

//   const formatTimeAgo = (timestamp) => {
//     const now = new Date();
//     const bidTime = new Date(timestamp);
//     const diffInMinutes = Math.floor((now - bidTime) / (1000 * 60));
//     if (diffInMinutes < 1) return "Just now";
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return `${Math.floor(diffInMinutes / 1440)}d ago`;
//   };

//   if (!book) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//         <div className="max-w-xl mx-auto text-center py-12">
//           <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2">Book not found</h2>
//           <p className="text-gray-600 mb-6">The book you're trying to bid on could not be found.</p>
//           <Button
//             variant="primary"
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
//             onClick={() => navigate("/books")}
//             icon={<ArrowLeft className="w-4 h-4" />}
//           >
//             Back to Books
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//           <div className="flex justify-between items-start mb-4">
//             <div className="flex-1">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                 Bidding for "{book.title}"
//               </h1>
//               <p className="text-gray-600">by {book.author}</p>
//             </div>
//             <button
//               onClick={() => navigate("/books")}
//               className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Auction Timeline */}
//           <div className="bg-gray-50 rounded-lg p-4 mb-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//               <div>
//                 <div className="text-gray-600 font-medium">Auction Started</div>
//                 <div className="text-gray-800">
//                   {auctionData.startDate ? new Date(auctionData.startDate).toLocaleString() : (fetchingMeta ? "Loading..." : "—")}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-600 font-medium">Auction Ends</div>
//                 <div className="text-gray-800">
//                   {auctionData.endDate ? new Date(auctionData.endDate).toLocaleString() : (fetchingMeta ? "Loading..." : "—")}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-600 font-medium">Time Remaining</div>
//                 <div className={`font-bold ${isAuctionEnded ? 'text-red-600' : 'text-green-600'}`}>
//                   {timeRemaining}
//                 </div>
//               </div>
//             </div>
//             <div className="mt-3 pt-3 border-t border-gray-200">
//               <div className="text-gray-600 font-medium text-sm">Initial Bidding Amount</div>
//               <div className="text-xl font-bold text-blue-600">Rs. {effectiveInitial}</div>
//             </div>
//           </div>

//           {/* Auction Status Alert */}
//           {isAuctionEnded && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//               <div className="flex items-center">
//                 <Clock className="w-5 h-5 text-red-600 mr-2" />
//                 <div>
//                   <p className="font-medium text-red-800">Auction Ended</p>
//                   {auctionWinner && (
//                     <p className="text-sm text-red-600">
//                       Winner: {auctionWinner.bidder} with Rs. {auctionWinner.amount}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Winner Notification for Current User */}
//           {isCurrentUserWinner && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <Trophy className="w-6 h-6 text-green-600 mr-2" />
//                   <div>
//                     <p className="font-bold text-green-800 text-lg">Congratulations! You Won!</p>
//                     <p className="text-sm text-green-600">
//                       Winning bid: Rs. {highestBid.amount}
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="primary"
//                   onClick={() => setShowPaymentModal(true)}
//                   className="bg-green-500 hover:bg-green-600 text-white"
//                 >
//                   <CreditCard className="w-4 h-4 mr-2" />
//                   Continue with Payment
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Withdrawal Message for Current User */}
//           {hasCurrentUserWithdrawn && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//               <div className="flex items-center">
//                 <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
//                 <div>
//                   <p className="font-bold text-red-800 text-lg">You Withdrew</p>
//                   <p className="text-sm text-red-600">
//                     Your trust score has been decreased by 200 points. The book has been offered to the next highest bidder.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Quick Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <div className="text-blue-600 font-semibold text-sm">Current Highest</div>
//               <div className="text-xl font-bold text-blue-800">
//                 Rs. {highestBid?.amount || effectiveInitial}
//               </div>
//             </div>
//             <div className="bg-green-50 p-3 rounded-lg">
//               <div className="text-green-600 font-semibold text-sm">Total Bids</div>
//               <div className="text-xl font-bold text-green-800">{bidStatistics.totalBids}</div>
//             </div>
//             <div className="bg-purple-50 p-3 rounded-lg">
//               <div className="text-purple-600 font-semibold text-sm">Bidders</div>
//               <div className="text-xl font-bold text-purple-800">{bidStatistics.uniqueBidders}</div>
//             </div>
//             <div className="bg-orange-50 p-3 rounded-lg">
//               <div className="text-orange-600 font-semibold text-sm">Avg Bid</div>
//               <div className="text-xl font-bold text-orange-800">
//                 Rs. {bidStatistics.averageBid > 0 ? Math.round(bidStatistics.averageBid) : effectiveInitial}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Book Information */}
//           <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
//             <div className="flex gap-4">
//               <div className="flex-shrink-0">
//                 <img
//                   src={book.cover || 'https://via.placeholder.com/150'}
//                   alt={book.title}
//                   className="w-24 h-32 object-cover rounded-lg shadow-md"
//                 />
//               </div>
//               <div className="flex-1 space-y-2">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <MapPin className="w-4 h-4 mr-1" />
//                   <span>{book.location}</span>
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-medium">Condition:</span> {book.condition}
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-medium">Listed Price:</span> Rs. {book.price}
//                 </div>
//                 <div className="text-sm">
//                   <span className="font-medium">Genre:</span> {Array.isArray(book.genre) ? book.genre.join(", ") : book.genre}
//                 </div>
//                 <div className="flex items-center text-sm mt-2">
//                   <img
//                     src={book.owner?.avatar || 'https://via.placeholder.com/40'}
//                     alt={book.owner?.name}
//                     className="w-6 h-6 rounded-full mr-2"
//                   />
//                   <span className="text-gray-600">{book.owner?.name}</span>
//                   <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs flex items-center">
//                     <Star className="w-3 h-3 mr-1" />
//                     {book.owner?.trustScore}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bidding Form */}
//           <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>

//             {!isAuctionStarted && hasTimeline && (
//               <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-center">
//                   <Clock className="w-5 h-5 text-gray-600 mr-2" />
//                   <p className="text-gray-700 font-medium">Auction not started yet</p>
//                 </div>
//               </div>
//             )}

//             {isAuctionEnded && hasTimeline && (
//               <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-center">
//                   <Clock className="w-5 h-5 text-gray-600 mr-2" />
//                   <p className="text-gray-700 font-medium">Bidding has ended</p>
//                 </div>
//               </div>
//             )}
            
//             {biddingActive && highestBid && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
//                 <div className="flex items-center">
//                   <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
//                   <div>
//                     <p className="text-sm font-medium text-yellow-800">
//                       Current highest bid: Rs. {highestBid.amount}
//                     </p>
//                     <p className="text-xs text-yellow-600">
//                       by {highestBid.bidder} • {formatTimeAgo(highestBid.time)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {userBids.length > 0 && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
//                 <div className="flex items-center">
//                   <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
//                   <div>
//                     <p className="text-sm font-medium text-blue-800">
//                       Your highest bid: Rs. {Math.max(...userBids.map(b => b.amount))}
//                     </p>
//                     <p className="text-xs text-blue-600">
//                       {userBids.length} bid{userBids.length > 1 ? 's' : ''} placed
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {biddingActive && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Bid Amount (Rs.)
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       value={bidAmount}
//                       onChange={handleBidAmountChange}
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-lg ${
//                         errors.bidAmount ? 'border-red-300' : 'border-gray-200'
//                       }`}
//                       placeholder={`Minimum: Rs. ${minAllowed}`}
//                       min={minAllowed}
//                     />
//                     <div className="absolute right-3 top-3 text-gray-400">
//                       <Gavel className="w-5 h-5" />
//                     </div>
//                   </div>
//                   {errors.bidAmount && (
//                     <div className="flex items-center text-red-600 text-sm mt-1">
//                       <AlertCircle className="w-4 h-4 mr-1" />
//                       {errors.bidAmount}
//                     </div>
//                   )}
//                   <p className="text-xs text-gray-500 mt-1">
//                     Must be greater than both the initial bid (Rs. {effectiveInitial}) and the current highest bid (Rs. {highestBid?.amount || 0}).
//                   </p>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <button
//                     onClick={() => setShowBidTips(!showBidTips)}
//                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     {showBidTips ? 'Hide' : 'Show'} Bidding Tips
//                   </button>
//                   {showBidTips && (
//                     <div className="mt-2 text-xs text-gray-600 space-y-1">
//                       <p>• Place a bid slightly above the current highest to stay ahead</p>
//                       <p>• Monitor the auction close to the end time</p>
//                       <p>• Set a maximum budget and stick to it</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex space-x-3">
//                   <Button
//                     variant="outline"
//                     onClick={() => navigate("/user/browse-books")}
//                     className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
//                   >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button
//                     variant="primary"
//                     onClick={handleBidSubmit}
//                     disabled={loading || !bidAmount || !!errors.bidAmount}
//                     className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <>
//                         <Timer className="w-4 h-4 mr-2 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Gavel className="w-4 h-4 mr-2" />
//                         Place Bid
//                       </>
//                     )}
//                   </Button>
//                 </div>

//                 {errors.submit && (
//                   <div className="flex items-center text-red-600 text-sm">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.submit}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Bid History */}
//         <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//             <Clock className="w-5 h-5 mr-2" />
//             Bid History ({currentBids.length}) {fetchingBids && <span className="text-xs text-gray-400 ml-2">refreshing...</span>}
//           </h3>
          
//           {currentBids.length > 0 ? (
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {currentBids
//                 .sort((a, b) => new Date(b.time) - new Date(a.time))
//                 .map((bid) => {
//                   let statusColor = 'bg-gray-50 border-gray-200';
//                   let statusBadge = null;
                  
//                   const isCurrentWinner = isAuctionEnded && auctionWinner && 
//                     bid.id === auctionWinner.id && bid.status !== "Withdrawn";
                  
//                   if (bid.status === "Withdrawn") {
//                     statusColor = 'bg-red-50 border-red-200';
//                     statusBadge = (
//                       <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
//                         Withdrawn
//                       </span>
//                     );
//                   } else if (isCurrentWinner || bid.status === "Winner") {
//                     statusColor = 'bg-green-50 border-green-200';
//                     statusBadge = (
//                       <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
//                         <Trophy className="w-3 h-3 mr-1" />
//                         Winner
//                       </span>
//                     );
//                   } else if (bid.bidder === user.name) {
//                     statusColor = 'bg-blue-50 border-blue-200';
//                   }
                  
//                   return (
//                     <div
//                       key={bid.id}
//                       className={`flex items-center justify-between p-3 rounded-lg border ${statusColor}`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="flex items-center">
//                           <User className="w-4 h-4 text-gray-400 mr-2" />
//                           <span className={`font-medium ${
//                             bid.bidder === user.name ? 'text-blue-800' : 'text-gray-800'
//                           }`}>
//                             {bid.bidder}
//                           </span>
//                           {bid.trustScore && (
//                             <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs flex items-center">
//                               <Star className="w-3 h-3 mr-1" />
//                               {bid.trustScore}
//                             </span>
//                           )}
//                         </div>
//                         {statusBadge}
//                       </div>
//                       <div className="text-right">
//                         <div className={`font-bold ${
//                           bid.bidder === user.name ? 'text-blue-800' : 'text-gray-800'
//                         }`}>
//                           Rs. {bid.amount}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {formatTimeAgo(bid.time)}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <Gavel className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>No bids yet. Be the first to bid!</p>
//             </div>
//           )}
//         </div>

//         {/* Payment Modal */}
//         {showPaymentModal && (
//           <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-900 flex items-center">
//                   <Trophy className="w-6 h-6 text-green-500 mr-2" />
//                   Payment for Winning Bid
//                 </h3>
//                 <button
//                   onClick={() => setShowPaymentModal(false)}
//                   className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               {/* Book Details */}
//               <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                 <div className="flex gap-4">
//                   <img
//                     src={book.cover || 'https://via.placeholder.com/80'}
//                     alt={book.title}
//                     className="w-16 h-20 object-cover rounded"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-medium text-gray-900">{book.title}</h4>
//                     <p className="text-sm text-gray-600">by {book.author}</p>
//                     <p className="text-sm text-gray-600">Condition: {book.condition}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Summary */}
//               <div className="bg-blue-50 rounded-lg p-4 mb-4">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Winning Bid Amount:</span>
//                     <span className="font-medium">Rs. {highestBid?.amount}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Delivery Charges:</span>
//                     <span className="font-medium">Rs. {deliveryAmount}</span>
//                   </div>
//                   <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-lg">
//                     <span>Total Amount:</span>
//                     <span>Rs. {(highestBid?.amount || 0) + deliveryAmount}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method Selection */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Method
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <button
//                     onClick={() => setPaymentMethod('card')}
//                     className={`p-3 border rounded-lg flex items-center justify-center ${
//                       paymentMethod === 'card'
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 text-gray-700'
//                     }`}
//                   >
//                     <CreditCard className="w-4 h-4 mr-2" />
//                     Card
//                   </button>
//                   <button
//                     onClick={() => setPaymentMethod('cash')}
//                     className={`p-3 border rounded-lg flex items-center justify-center ${
//                       paymentMethod === 'cash'
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 text-gray-700'
//                     }`}
//                   >
//                     <Banknote className="w-4 h-4 mr-2" />
//                     Cash on Delivery
//                   </button>
//                 </div>
//               </div>

//               {/* Card Details */}
//               {paymentMethod === 'card' && (
//                 <div className="space-y-3 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Card Number
//                     </label>
//                     <input
//                       type="text"
//                       value={cardDetails.number}
//                       onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                       placeholder="1234 5678 9012 3456"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Expiry Date
//                       </label>
//                       <input
//                         type="text"
//                         value={cardDetails.expiry}
//                         onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                         placeholder="MM/YY"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         CVV
//                       </label>
//                       <input
//                         type="text"
//                         value={cardDetails.cvv}
//                         onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
//                         className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                         placeholder="123"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Cardholder Name
//                     </label>
//                     <input
//                       type="text"
//                       value={cardDetails.name}
//                       onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                       placeholder="John Doe"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Delivery Info for Cash Payment */}
//               {paymentMethod === 'cash' && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
//                   <div className="flex items-center">
//                     <Truck className="w-5 h-5 text-yellow-600 mr-2" />
//                     <p className="text-sm text-yellow-800">
//                       You will pay Rs. {(highestBid?.amount || 0) + deliveryAmount} to the delivery agent upon receiving the book.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-3">
//                 <Button
//                   variant="outline"
//                   onClick={handlePaymentCancel}
//                   className="flex-1 border border-red-300 text-red-700 hover:bg-red-50"
//                   disabled={loading}
//                 >
//                   Cancel & Withdraw
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={handlePayment}
//                   disabled={loading}
//                   className="flex-1 bg-green-500 hover:bg-green-600 text-white"
//                 >
//                   {loading ? (
//                     <>
//                       <Timer className="w-4 h-4 mr-2 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <CreditCard className="w-4 h-4 mr-2" />
//                       {paymentMethod === 'card' ? 'Pay Now' : 'Confirm Order'}
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BiddingPage;