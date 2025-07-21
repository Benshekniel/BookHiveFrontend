import React, { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, Truck, MapPin, Calendar, Star, MessageSquare, RefreshCw, AlertCircle, Eye, BookOpen, DollarSign, User, Phone, Mail, ArrowRight, Download, FileText, Camera, ThumbsUp, ThumbsDown } from "lucide-react";
import { books, users } from "../../data/mockData";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    bookCondition: 5,
    ownerRating: 5,
  });

  // Mock orders data with real-time tracking, including exchange orders
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      type: "purchase",
      book: books[0],
      seller: users[0],
      orderDate: "2024-01-15",
      status: "delivered",
      totalAmount: 1500,
      deliveryMethod: "pickup",
      deliveryAddress: "University of Colombo, Colombo 03",
      estimatedDelivery: "2024-01-17",
      actualDelivery: "2024-01-16",
      trackingNumber: "BH001234567",
      paymentMethod: "cash_on_delivery",
      tracking: [
        { status: "Order Placed", timestamp: "2024-01-15 10:30 AM", description: "Your order has been confirmed" },
        { status: "Seller Confirmed", timestamp: "2024-01-15 02:15 PM", description: "Seller has confirmed the order" },
        { status: "Ready for Pickup", timestamp: "2024-01-16 09:00 AM", description: "Book is ready for pickup" },
        { status: "Delivered", timestamp: "2024-01-16 03:30 PM", description: "Order successfully delivered" },
      ],
    },
    {
      id: "ORD002",
      type: "borrow",
      book: books[1],
      lender: users[1],
      orderDate: "2024-01-18",
      status: "active",
      borrowPeriod: 21,
      startDate: "2024-01-20",
      returnDate: "2024-02-10",
      deliveryMethod: "delivery",
      deliveryAddress: "123 Galle Road, Colombo 04",
      trackingNumber: "BH001234568",
      securityDeposit: 500,
      tracking: [
        { status: "Request Approved", timestamp: "2024-01-18 11:00 AM", description: "Lender approved your request" },
        { status: "Book Dispatched", timestamp: "2024-01-19 02:00 PM", description: "Book is on the way to you" },
        { status: "Delivered", timestamp: "2024-01-20 10:15 AM", description: "Book delivered successfully" },
        { status: "Borrowing Active", timestamp: "2024-01-20 10:15 AM", description: "Enjoy reading! Return by Feb 10" },
      ],
    },
    {
      id: "ORD003",
      type: "purchase",
      book: books[2],
      seller: users[2],
      orderDate: "2024-01-20",
      status: "in_transit",
      totalAmount: 2000,
      deliveryMethod: "delivery",
      deliveryAddress: "456 Kandy Road, Kandy",
      estimatedDelivery: "2024-01-23",
      trackingNumber: "BH001234569",
      paymentMethod: "online",
      tracking: [
        { status: "Order Placed", timestamp: "2024-01-20 09:15 AM", description: "Your order has been confirmed" },
        { status: "Payment Confirmed", timestamp: "2024-01-20 09:20 AM", description: "Payment received successfully" },
        { status: "Seller Confirmed", timestamp: "2024-01-20 01:30 PM", description: "Seller has confirmed the order" },
        { status: "In Transit", timestamp: "2024-01-21 08:00 AM", description: "Book is on the way to you" },
      ],
    },
    {
      id: "ORD004",
      type: "borrow",
      book: books[3],
      lender: users[3],
      orderDate: "2024-01-10",
      status: "overdue",
      borrowPeriod: 14,
      startDate: "2024-01-12",
      returnDate: "2024-01-26",
      deliveryMethod: "pickup",
      deliveryAddress: "University Library, Colombo 07",
      trackingNumber: "BH001234570",
      securityDeposit: 300,
      overdueBy: 2,
      tracking: [
        { status: "Request Approved", timestamp: "2024-01-10 02:00 PM", description: "Lender approved your request" },
        { status: "Book Collected", timestamp: "2024-01-12 11:00 AM", description: "You collected the book" },
        { status: "Return Due", timestamp: "2024-01-26 11:59 PM", description: "Book return was due" },
        { status: "Overdue", timestamp: "2024-01-27 12:00 AM", description: "Book is now overdue" },
      ],
    },
    // New mock exchange orders
    {
      id: "ORD005",
      type: "exchange",
      book: books[4] || books[0], // Fallback if books[4] not defined
      exchanger: users[4] || users[0],
      orderDate: "2024-02-01",
      status: "active",
      exchangePeriod: 30,
      startDate: "2024-02-02",
      returnDate: "2024-03-03",
      deliveryMethod: "delivery",
      deliveryAddress: "789 Main Street, Colombo 05",
      trackingNumber: "BH001234571",
      tracking: [
        { status: "Exchange Approved", timestamp: "2024-02-01 10:00 AM", description: "Exchanger approved your request" },
        { status: "Books Exchanged", timestamp: "2024-02-02 02:00 PM", description: "Books have been exchanged" },
        { status: "Exchange Active", timestamp: "2024-02-02 02:00 PM", description: "Exchange period started" },
      ],
    },
    {
      id: "ORD006",
      type: "exchange",
      book: books[5] || books[1],
      exchanger: users[5] || users[1],
      orderDate: "2024-02-05",
      status: "delivered",
      exchangePeriod: 14,
      startDate: "2024-02-06",
      returnDate: "2024-02-20",
      deliveryMethod: "pickup",
      deliveryAddress: "Library Pickup Point, Colombo 03",
      trackingNumber: "BH001234572",
      tracking: [
        { status: "Exchange Approved", timestamp: "2024-02-05 11:00 AM", description: "Exchanger approved your request" },
        { status: "Books Picked Up", timestamp: "2024-02-06 09:00 AM", description: "Books exchanged via pickup" },
        { status: "Exchange Completed", timestamp: "2024-02-20 05:00 PM", description: "Exchange period ended successfully" },
      ],
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-800 bg-green-100";
      case "active":
        return "text-blue-800 bg-blue-100";
      case "in_transit":
        return "text-yellow-800 bg-yellow-100";
      case "overdue":
        return "text-red-800 bg-red-100";
      case "pending":
        return "text-gray-800 bg-gray-100";
      case "cancelled":
        return "text-gray-500 bg-gray-200";
      default:
        return "text-gray-500 bg-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={16} />;
      case "active":
        return <BookOpen size={16} />;
      case "in_transit":
        return <Truck size={16} />;
      case "overdue":
        return <AlertCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "borrowed") return order.type === "borrow";
    if (activeTab === "purchased") return order.type === "purchase";
    if (activeTab === "exchanged") return order.type === "exchange";
    if (activeTab === "active") return ["active", "in_transit"].includes(order.status);
    if (activeTab === "completed") return order.status === "delivered";
    return true;
  });

  const handleReviewSubmit = () => {
    console.log("Review submitted:", reviewForm);
    alert("Thank you for your review!");
    setShowReviewModal(false);
    setReviewForm({ rating: 5, comment: "", bookCondition: 5, ownerRating: 5 });
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.status === "in_transit" && Math.random() > 0.8) {
            // Simulate tracking update
            const newTracking = [...order.tracking];
            if (newTracking.length < 5) {
              newTracking.push({
                status: "Out for Delivery",
                timestamp: new Date().toLocaleString(),
                description: "Your book is out for delivery",
              });
            }
            return { ...order, tracking: newTracking };
          }
          return order;
        })
      );
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const renderOrderCard = (order) => (
    <div
      key={order.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={order.book.cover}
            alt={order.book.title}
            className="w-16 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{order.book.title}</h3>
            <p className="text-gray-600">{order.book.author}</p>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
            <p className="text-sm text-gray-500">{order.orderDate}</p>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
          </div>
          {order.type === "purchase" && (
            <p className="text-lg font-bold text-green-600 mt-2">Rs. {order.totalAmount}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">
            <strong>{order.type === "purchase" ? "Seller:" : order.type === "borrow" ? "Lender:" : "Exchanger:"}</strong>{" "}
            {(order.seller || order.lender || order.exchanger).name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Delivery:</strong>{" "}
            {order.deliveryMethod === "pickup" ? "Pickup" : "Home Delivery"}
          </p>
          {order.trackingNumber && (
            <p className="text-sm text-gray-600">
              <strong>Tracking:</strong> {order.trackingNumber}
            </p>
          )}
        </div>
        <div>
          {(order.type === "borrow" || order.type === "exchange") && (
            <>
              <p className="text-sm text-gray-600">
                <strong>Return Date:</strong> {order.returnDate}
              </p>
              {order.status === "overdue" && (
                <p className="text-sm text-red-600">
                  <strong>Overdue by:</strong> {order.overdueBy} days
                </p>
              )}
            </>
          )}
          {order.estimatedDelivery && order.status !== "delivered" && (
            <p className="text-sm text-gray-600">
              <strong>Expected:</strong> {order.estimatedDelivery}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setShowTrackingModal(true);
          }}
          className="bg-transparent border-2 border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Track Order</span>
        </button>
        {order.status === "delivered" && (
          <button
            onClick={() => {
              setSelectedOrder(order);
              setShowReviewModal(true);
            }}
            className="bg-transparent border-2 border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <Star className="w-4 h-4" />
            <span>Write Review</span>
          </button>
        )}
        <button
          className="bg-transparent border-2 border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact {order.type === "purchase" ? "Seller" : order.type === "borrow" ? "Lender" : "Exchanger"}</span>
        </button>
        {order.status === "delivered" && (
          <button
            className="bg-transparent border-2 border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-blue-100 text-lg">Track your borrowed, purchased, and exchanged books</p>
            </div>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                <Package className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Currently Borrowed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter((o) => o.type === "borrow" && o.status === "active").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Currently Exchanged</p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter((o) => o.type === "exchange" && o.status === "active").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <RefreshCw className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.filter((o) => o.status === "overdue").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap border-b">
            {[
              { key: "all", label: "All Orders", count: orders.length },
              { key: "active", label: "Active", count: orders.filter((o) => ["active", "in_transit"].includes(o.status)).length },
              { key: "borrowed", label: "Borrowed Books", count: orders.filter((o) => o.type === "borrow").length },
              { key: "purchased", label: "Purchased Books", count: orders.filter((o) => o.type === "purchase").length },
              { key: "exchanged", label: "Exchanged Books", count: orders.filter((o) => o.type === "exchange").length },
              { key: "completed", label: "Completed", count: orders.filter((o) => o.status === "delivered").length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${activeTab} orders found.`}
              </p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Books</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Order Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-transparent bg-opacity-100 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Order Tracking</h3>
                  <p className="text-gray-600">Order #{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedOrder.book.cover}
                    alt={selectedOrder.book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900">{selectedOrder.book.title}</h4>
                    <p className="text-gray-600">{selectedOrder.book.author}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status.replace("_", " ")}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <span className="text-xs text-gray-500">
                          Tracking: {selectedOrder.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Delivery Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-gray-900">
                    <User className="mr-2 text-gray-600" size={16} />
                    {selectedOrder.type === "purchase" ? "Seller" : selectedOrder.type === "borrow" ? "Lender" : "Exchanger"} Details
                  </h4>
                  <p className="text-sm">{(selectedOrder.seller || selectedOrder.lender || selectedOrder.exchanger).name}</p>
                  <p className="text-sm text-gray-600">{(selectedOrder.seller || selectedOrder.lender || selectedOrder.exchanger).location}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      className="bg-transparent border-2 border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                    <button
                      className="bg-transparent border-2 border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-gray-100 transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-gray-900">
                    <MapPin className="mr-2 text-gray-600" size={16} />
                    Delivery Information
                  </h4>
                  <p className="text-sm">{selectedOrder.deliveryMethod === "pickup" ? "Pickup" : "Home Delivery"}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                  {selectedOrder.estimatedDelivery && (
                    <p className="text-sm text-gray-600 mt-1">
                      Expected: {selectedOrder.estimatedDelivery}
                    </p>
                  )}
                </div>
              </div>
              {/* Tracking Timeline */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center text-gray-900">
                  <Truck className="mr-2 text-gray-600" size={16} />
                  Tracking History
                </h4>
                <div className="space-y-4">
                  {selectedOrder.tracking.map((track, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${
                          index === 0 ? "bg-yellow-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{track.status}</p>
                            <p className="text-sm text-gray-600">{track.description}</p>
                          </div>
                          <span className="text-xs text-gray-500">{track.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  className="bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Contact {selectedOrder.type === "purchase" ? "Seller" : selectedOrder.type === "borrow" ? "Lender" : "Exchanger"}</span>
                </button>
                {selectedOrder.status === "delivered" && (
                  <button
                    onClick={() => {
                      setShowTrackingModal(false);
                      setShowReviewModal(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Write a Review</h3>
              <p className="text-gray-600">{selectedOrder.book.title}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                      className={`text-2xl ${star <= reviewForm.rating ? "text-yellow-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Condition Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm((prev) => ({ ...prev, bookCondition: star }))}
                      className={`text-xl ${star <= reviewForm.bookCondition ? "text-green-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedOrder.type === "purchase" ? "Seller" : selectedOrder.type === "borrow" ? "Lender" : "Exchanger"} Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm((prev) => ({ ...prev, ownerRating: star }))}
                      className={`text-xl ${star <= reviewForm.ownerRating ? "text-blue-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  placeholder="Share your experience with this book and the owner..."
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewForm({ rating: 5, comment: "", bookCondition: 5, ownerRating: 5 });
                }}
                className="bg-transparent border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewForm.comment.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;