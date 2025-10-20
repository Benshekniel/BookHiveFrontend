import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from '../../components/AuthContext';
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  MapPin,
  Phone,
  User,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Shield,
  Truck,
  Clock,
  Star,
  X
} from "lucide-react";
import Button from "../../components/shared/Button";
import LazyImage from "../../components/LazyImage";

const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: "cash_on_delivery",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  DIGITAL_WALLET: "digital_wallet",
};

// UserAvatar component for consistent user image handling
const UserAvatar = ({ user, size = "md", className = "" }) => {
  const baseUrl = 'http://localhost:9090';
  
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };
  
  const getDefaultUserAvatar = (userName) => {
    const colors = [
      ['%237C3AED', '%234C1D95'],
      ['%2306B6D4', '%230891B2'],
      ['%2310B981', '%23059669'],
      ['%23F59E0B', '%23D97706'],
      ['%23EF4444', '%23DC2626'],
      ['%238B5CF6', '%237C3AED'],
    ];
    
    const hash = (userName || 'User').split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const colorIndex = Math.abs(hash) % colors.length;
    const [color1, color2] = colors[colorIndex];
    
    return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cradialGradient id='bg' cx='50%25' cy='30%25'%3e%3cstop offset='0%25' stop-color='${color1}'/%3e%3cstop offset='100%25' stop-color='${color2}'/%3e%3c/radialGradient%3e%3c/defs%3e%3ccircle cx='50' cy='50' r='50' fill='url(%23bg)'/%3e%3ccircle cx='50' cy='37' r='18' fill='%23FFFFFF' opacity='0.9'/%3e%3cpath d='M50 60c-15 0-28 10-30 22 0 3 2 5 5 5h50c3 0 5-2 5-5-2-12-15-22-30-22z' fill='%23FFFFFF' opacity='0.9'/%3e%3c/svg%3e`;
  };

  const getUserImageSrc = () => {
    if (user?.profileImage) {
      return `${baseUrl}/getFileAsBase64?fileName=${user.profileImage}&folderName=userProfiles`;
    }
    if (user?.avatar && user.avatar !== "https://via.placeholder.com/50" && user.avatar !== null && user.avatar !== 'https://via.placeholder.com/20') {
      return user.avatar;
    }
    return getDefaultUserAvatar(user?.name);
  };

  return (
    <img
      src={getUserImageSrc()}
      alt={user?.name || "User"}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
      onError={(e) => { e.target.src = getDefaultUserAvatar(user?.name); }}
    />
  );
};

const PaymentPage = () => {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;
  const orderType = state?.type || 'purchase';

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH_ON_DELIVERY);
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    specialInstructions: ""
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    walletType: "paypal"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoadingUserData(true);
      const encodedEmail = encodeURIComponent(user.email);
      const url = `http://localhost:9090/api/getLoginUser?email=${encodedEmail}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch user details: ${response.status}`);
      const userData = await response.json();
      const newDeliveryDetails = {
        fullName: userData.fname && userData.lname ? `${userData.fname} ${userData.lname}` : (userData.name || ""),
        address: userData.address || "",
        phone: userData.phone ? (userData.phone.toString().startsWith('+') ? userData.phone.toString() : `+94 ${userData.phone}`) : "",
        email: userData.email || user.email || "",
        specialInstructions: ""
      };
      setDeliveryDetails(newDeliveryDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setDeliveryDetails({ fullName: "", address: "", phone: "", email: user.email, specialInstructions: "" });
    } finally {
      setLoadingUserData(false);
    }
  }, [user.email]);

  useEffect(() => {
    if (user?.email) fetchUserDetails();
    else setLoadingUserData(false);
  }, [user, fetchUserDetails]);

  useEffect(() => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 2 : 2));
    setEstimatedDelivery(deliveryDate);
  }, [paymentMethod]);

  if (!user) return <p>Please log in.</p>;

  const validateDeliveryDetails = () => {
    const newErrors = {};
    if (!deliveryDetails.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!deliveryDetails.address.trim()) newErrors.address = "Address is required";
    if (!deliveryDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+94\s?\d{9}$/.test(deliveryDetails.phone.replace(/\s+/g, ''))) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number";
    }
    if (!deliveryDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryDetails.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  };

  const validatePaymentDetails = () => {
    const newErrors = {};
    if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD || paymentMethod === PAYMENT_METHODS.DEBIT_CARD) {
      if (!paymentDetails.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s+/g, ''))) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      if (!paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
        newErrors.expiry = "Expiry date is required";
      } else {
        const now = new Date();
        const expiry = new Date(2000 + parseInt(paymentDetails.expiryYear), parseInt(paymentDetails.expiryMonth) - 1);
        if (expiry < now) newErrors.expiry = "Card has expired";
      }
      if (!paymentDetails.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
      if (!paymentDetails.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";
    }
    return newErrors;
  };

  const handleDeliveryChange = (field, value) => {
    setDeliveryDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(' ') : v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const deliveryErrors = validateDeliveryDetails();
    const paymentErrors = validatePaymentDetails();
    const allErrors = { ...deliveryErrors, ...paymentErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const transactionDTO = {
        type: "SALE", // As per backend requirement
        status: "PENDING", // Initial status, backend will adjust based on payment method
        paymentAmount: calculateTotal(),
        paMethodNew: paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? "card" : "cash",
        paymentStatus: paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? "COMPLETED" : "PENDING",
        bookId: book.id,
        userId: user.userId // Updated to use user.userId from AuthContext
      };

      const response = await fetch('http://localhost:9090/api/userTranscation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionDTO)
      });

      if (!response.ok) throw new Error('Failed to process transaction');
      
      const result = await response.json();
      if (result && result.transactionId) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/user/browse-books', { 
            state: { 
              message: `Order confirmed for "${book.title}"! Transaction ID: ${result.transactionId}. You will receive a confirmation email shortly.` 
            } 
          });
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setErrors({ submit: "Payment failed. Please try again or contact support." });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const bookPrice = book?.price || 0;
    const deliveryFee = paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 200 : 0;
    const processingFee = paymentMethod !== PAYMENT_METHODS.CASH_ON_DELIVERY ? 200 : 0;
    return bookPrice + deliveryFee + processingFee;
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Book not found</h2>
          <p className="text-gray-600 mb-6">The book you're trying to purchase could not be found.</p>
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your order for "{book.title}" has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Order Total:</strong> Rs. {calculateTotal()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estimated Delivery:</strong> {estimatedDelivery?.toDateString()}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
                <p className="text-gray-600">Secure checkout for "{book.title}"</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Information
                </h2>
                {loadingUserData && (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full mr-2"></div>
                    Loading your details...
                  </div>
                )}
                {!loadingUserData && deliveryDetails.fullName && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Auto-filled from your profile
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={deliveryDetails.fullName}
                      onChange={(e) => handleDeliveryChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={deliveryDetails.phone}
                      onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="+94 712 345 678"
                    />
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={deliveryDetails.email}
                    onChange={(e) => handleDeliveryChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                  <div className="relative">
                    <textarea
                      value={deliveryDetails.address}
                      onChange={(e) => handleDeliveryChange('address', e.target.value)}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-20 resize-none ${errors.address ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="Enter your complete delivery address"
                    />
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                  <textarea
                    value={deliveryDetails.specialInstructions}
                    onChange={(e) => handleDeliveryChange('specialInstructions', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-16 resize-none"
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-3 mb-6">
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.CASH_ON_DELIVERY)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive the book</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">+ Rs. 200 delivery fee</span>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPaymentMethod(PAYMENT_METHODS.CREDIT_CARD)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === PAYMENT_METHODS.CREDIT_CARD ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                      {paymentMethod === PAYMENT_METHODS.CREDIT_CARD && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Secure payment with your card</p>
                    </div>
                  </div>
                </div>
              </div>

              {(paymentMethod === PAYMENT_METHODS.CREDIT_CARD || paymentMethod === PAYMENT_METHODS.DEBIT_CARD) && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      value={paymentDetails.cardholderName}
                      onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.cardholderName ? 'border-red-300' : 'border-gray-200'}`}
                      placeholder="Name on card"
                    />
                    {errors.cardholderName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                        className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.cardNumber ? 'border-red-300' : 'border-gray-200'}`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-600 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={paymentDetails.expiryMonth}
                          onChange={(e) => handlePaymentChange('expiryMonth', e.target.value)}
                          className={`px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.expiry ? 'border-red-300' : 'border-gray-200'}`}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        <select
                          value={paymentDetails.expiryYear}
                          onChange={(e) => handlePaymentChange('expiryYear', e.target.value)}
                          className={`px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.expiry ? 'border-red-300' : 'border-gray-200'}`}
                        >
                          <option value="">YY</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={(year % 100).toString().padStart(2, '0')}>
                              {(year % 100).toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.expiry && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.expiry}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={paymentDetails.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.cvv ? 'border-red-300' : 'border-gray-200'}`}
                          placeholder="123"
                          maxLength="4"
                        />
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.cvv && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-200">
                <LazyImage
                  fileName={book.bookImage}
                  folderName="userBooks"
                  alt={book.title}
                  baseUrl="http://localhost:9090"
                  placeholder="data:image/svg+xml,%3csvg width='150' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='200' fill='%236B7280'/%3e%3ctext x='75' y='100' text-anchor='middle' fill='%23FFFFFF' font-size='14'%3eNo Image%3c/text%3e%3c/svg%3e"
                  className="w-16 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                  <p className="text-xs text-gray-500 mt-1">Condition: {book.condition}</p>
                  <div className="flex items-center mt-2">
                    <UserAvatar user={book.owner} size="xs" className="mr-1" />
                    <span className="text-xs text-gray-600">{book.owner?.name}</span>
                    <span className="ml-1 bg-blue-100 text-blue-800 px-1 rounded text-xs flex items-center">
                      <Star className="w-2 h-2 mr-0.5" />
                      {book.owner?.trustScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Estimated Delivery</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {estimatedDelivery?.toDateString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? '2-3 business days' : '2-3 business days'}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Book Price</span>
                  <span className="text-gray-900">Rs. {book.price}</span>
                </div>
                {paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">Rs. 200</span>
                  </div>
                )}
                {paymentMethod !== PAYMENT_METHODS.CASH_ON_DELIVERY && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">Rs. 200</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">Rs. {calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center text-green-700 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Complete Purchase
                  </div>
                )}
              </Button>

              {errors.submit && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.submit}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-3 text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

// import React, { useState, useEffect, useCallback } from "react";
// import { useAuth } from '../../components/AuthContext';
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   ShoppingCart,
//   CreditCard,
//   MapPin,
//   Phone,
//   User,
//   Lock,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   Calendar,
//   Shield,
//   Truck,
//   Clock,
//   Star,
//   X
// } from "lucide-react";
// import Button from "../../components/shared/Button";
// import LazyImage from "../../components/LazyImage";

// const PAYMENT_METHODS = {
//   CASH_ON_DELIVERY: "cash_on_delivery",
//   CREDIT_CARD: "credit_card",
//   DEBIT_CARD: "debit_card",
//   DIGITAL_WALLET: "digital_wallet",
// };

// // UserAvatar component for consistent user image handling
// const UserAvatar = ({ user, size = "md", className = "" }) => {
//   const baseUrl = 'http://localhost:9090';
  
//   // Size configurations
//   const sizes = {
//     xs: "w-4 h-4",
//     sm: "w-6 h-6",
//     md: "w-10 h-10", 
//     lg: "w-12 h-12"
//   };
  
//   // Generate colored avatar based on user name for visual distinction
//   const getDefaultUserAvatar = (userName) => {
//     const colors = [
//       ['%237C3AED', '%234C1D95'], // Purple
//       ['%2306B6D4', '%230891B2'], // Cyan
//       ['%2310B981', '%23059669'], // Emerald
//       ['%23F59E0B', '%23D97706'], // Amber
//       ['%23EF4444', '%23DC2626'], // Red
//       ['%238B5CF6', '%237C3AED'], // Violet
//     ];
    
//     // Simple hash function to get consistent color for user
//     const hash = (userName || 'User').split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0);
//       return a & a;
//     }, 0);
    
//     const colorIndex = Math.abs(hash) % colors.length;
//     const [color1, color2] = colors[colorIndex];
    
//     return `data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cradialGradient id='bg' cx='50%25' cy='30%25'%3e%3cstop offset='0%25' stop-color='${color1}'/%3e%3cstop offset='100%25' stop-color='${color2}'/%3e%3c/radialGradient%3e%3c/defs%3e%3ccircle cx='50' cy='50' r='50' fill='url(%23bg)'/%3e%3ccircle cx='50' cy='37' r='18' fill='%23FFFFFF' opacity='0.9'/%3e%3cpath d='M50 60c-15 0-28 10-30 22 0 3 2 5 5 5h50c3 0 5-2 5-5-2-12-15-22-30-22z' fill='%23FFFFFF' opacity='0.9'/%3e%3c/svg%3e`;
//   };

//   // If user has a profile image from backend, try to load it
//   const getUserImageSrc = () => {
//     if (user?.profileImage) {
//       // Try backend endpoint for user profile images
//       return `${baseUrl}/getFileAsBase64?fileName=${user.profileImage}&folderName=userProfiles`;
//     }
//     if (user?.avatar && user.avatar !== "https://via.placeholder.com/50" && user.avatar !== null && user.avatar !== 'https://via.placeholder.com/20') {
//       // Use provided avatar URL if it's not a placeholder
//       return user.avatar;
//     }
//     // Use default vector avatar (will be used most of the time)
//     return getDefaultUserAvatar(user?.name);
//   };

//   return (
//     <img
//       src={getUserImageSrc()}
//       alt={user?.name || "User"}
//       className={`${sizes[size]} rounded-full object-cover ${className}`}
//       onError={(e) => {
//         // Fallback to default avatar if loading fails
//         e.target.src = getDefaultUserAvatar(user?.name);
//       }}
//     />
//   );
// };

// const PaymentPage = () => {
//   const { user } = useAuth();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const book = state?.book;
//   const orderType = state?.type || 'purchase';

//   // Form state
//   const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH_ON_DELIVERY);
//   const [deliveryDetails, setDeliveryDetails] = useState({
//     fullName: "",
//     address: "",
//     phone: "",
//     email: "",
//     specialInstructions: ""
//   });
//   const [paymentDetails, setPaymentDetails] = useState({
//     cardNumber: "",
//     expiryMonth: "",
//     expiryYear: "",
//     cvv: "",
//     cardholderName: "",
//     walletType: "paypal"
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [estimatedDelivery, setEstimatedDelivery] = useState(null);
//   const [loadingUserData, setLoadingUserData] = useState(true);

//   // Fetch user details from backend
//   const fetchUserDetails = useCallback(async () => {
//     try {
//       setLoadingUserData(true);
//       console.log('Fetching user details for email:', user.email);
      
//       // URL encode the email to handle special characters
//       const encodedEmail = encodeURIComponent(user.email);
//       const url = `http://localhost:9090/api/getLoginUser?email=${encodedEmail}`;
//       console.log('Fetching from URL:', url);
      
//       const response = await fetch(url);
//       console.log('Response status:', response.status);
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch user details: ${response.status} - ${errorText}`);
//       }
      
//       const userData = await response.json();
//       console.log('User data received:', userData);
      
//       // Update delivery details with user data
//       const newDeliveryDetails = {
//         fullName: userData.fname && userData.lname ? `${userData.fname} ${userData.lname}` : (userData.name || ""),
//         address: userData.address || "",
//         phone: userData.phone ? 
//           (userData.phone.toString().startsWith('+') ? userData.phone.toString() : `+94 ${userData.phone}`) : "",
//         email: userData.email || user.email || "",
//         specialInstructions: ""
//       };
      
//       console.log('Setting delivery details:', newDeliveryDetails);
//       setDeliveryDetails(newDeliveryDetails);
      
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       // Set defaults with user email from auth context
//       setDeliveryDetails({
//         fullName: "",
//         address: "",
//         phone: "",
//         email: user.email,
//         specialInstructions: ""
//       });
//     } finally {
//       setLoadingUserData(false);
//     }
//   }, [user.email]);

//   // Fetch user details on component mount
//   useEffect(() => {
//     console.log('useEffect triggered with user:', user);
//     if (user?.email) {
//       console.log('User email exists, calling fetchUserDetails');
//       fetchUserDetails();
//     } else {
//       console.log('No user email available');
//       setLoadingUserData(false);
//     }
//   }, [user, fetchUserDetails]);

//   // Calculate estimated delivery
//   useEffect(() => {
//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + (paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 2 : 2));
//     setEstimatedDelivery(deliveryDate);
//   }, [paymentMethod]);

//   // Early return after all hooks
//   if (!user) {
//     return <p>Please log in.</p>;
//   }

//   // Validation functions
//   const validateDeliveryDetails = () => {
//     const newErrors = {};
    
//     if (!deliveryDetails.fullName.trim()) {
//       newErrors.fullName = "Full name is required";
//     }
    
//     if (!deliveryDetails.address.trim()) {
//       newErrors.address = "Address is required";
//     }
    
//     if (!deliveryDetails.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^\+94\s?\d{9}$/.test(deliveryDetails.phone.replace(/\s+/g, ''))) {
//       newErrors.phone = "Please enter a valid Sri Lankan phone number";
//     }
    
//     if (!deliveryDetails.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryDetails.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
    
//     return newErrors;
//   };

//   const validatePaymentDetails = () => {
//     const newErrors = {};
    
//     if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD || paymentMethod === PAYMENT_METHODS.DEBIT_CARD) {
//       if (!paymentDetails.cardNumber.trim()) {
//         newErrors.cardNumber = "Card number is required";
//       } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s+/g, ''))) {
//         newErrors.cardNumber = "Card number must be 16 digits";
//       }
      
//       if (!paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
//         newErrors.expiry = "Expiry date is required";
//       } else {
//         const now = new Date();
//         const expiry = new Date(2000 + parseInt(paymentDetails.expiryYear), parseInt(paymentDetails.expiryMonth) - 1);
//         if (expiry < now) {
//           newErrors.expiry = "Card has expired";
//         }
//       }
      
//       if (!paymentDetails.cvv.trim()) {
//         newErrors.cvv = "CVV is required";
//       } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
//         newErrors.cvv = "CVV must be 3 or 4 digits";
//       }
      
//       if (!paymentDetails.cardholderName.trim()) {
//         newErrors.cardholderName = "Cardholder name is required";
//       }
//     }
    
//     return newErrors;
//   };

//   // Event handlers
//   const handleDeliveryChange = (field, value) => {
//     setDeliveryDetails(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const handlePaymentChange = (field, value) => {
//     setPaymentDetails(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     const matches = v.match(/\d{4,16}/g);
//     const match = matches && matches[0] || '';
//     const parts = [];
//     for (let i = 0; i < match.length; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
//     if (parts.length) {
//       return parts.join(' ');
//     } else {
//       return v;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const deliveryErrors = validateDeliveryDetails();
//     const paymentErrors = validatePaymentDetails();
//     const allErrors = { ...deliveryErrors, ...paymentErrors };
    
//     if (Object.keys(allErrors).length > 0) {
//       setErrors(allErrors);
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Mock successful payment
//       setShowSuccess(true);
      
//       // Redirect after success
//       setTimeout(() => {
//         navigate('/user/browse-books', { 
//           state: { 
//             message: `Order confirmed for "${book.title}"! You will receive a confirmation email shortly.` 
//           } 
//         });
//       }, 3000);
      
//     } catch (error) {
//       setErrors({ submit: "Payment failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate total
//   const calculateTotal = () => {
//     const bookPrice = book?.price || 0;
//     const deliveryFee = paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? 200 : 0;
//     const processingFee = paymentMethod !== PAYMENT_METHODS.CASH_ON_DELIVERY ? 200 : 0;
//     return bookPrice + deliveryFee + processingFee;
//   };

//   // Error fallback
//   if (!book) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//         <div className="max-w-2xl mx-auto text-center py-12">
//           <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2">Book not found</h2>
//           <p className="text-gray-600 mb-6">The book you're trying to purchase could not be found.</p>
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

//   // Success modal
//   if (showSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
//         <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-200 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
//           <p className="text-gray-600 mb-4">
//             Your order for "{book.title}" has been confirmed.
//           </p>
//           <div className="bg-gray-50 rounded-lg p-4 mb-4">
//             <p className="text-sm text-gray-600">
//               <strong>Order Total:</strong> Rs. {calculateTotal()}
//             </p>
//             <p className="text-sm text-gray-600">
//               <strong>Estimated Delivery:</strong> {estimatedDelivery?.toDateString()}
//             </p>
//           </div>
//           <p className="text-sm text-gray-500">
//             You will receive a confirmation email shortly.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                   Complete Your Purchase
//                 </h1>
//                 <p className="text-gray-600">Secure checkout for "{book.title}"</p>
//               </div>
//             </div>
//             <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
//               <Shield className="w-4 h-4" />
//               <span>Secure Payment</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Delivery Information */}
//             <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold text-gray-900 flex items-center">
//                   <Truck className="w-5 h-5 mr-2" />
//                   Delivery Information
//                 </h2>
//                 {loadingUserData && (
//                   <div className="flex items-center text-sm text-gray-500">
//                     <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full mr-2"></div>
//                     Loading your details...
//                   </div>
//                 )}
//                 {!loadingUserData && deliveryDetails.fullName && (
//                   <div className="flex items-center text-sm text-green-600">
//                     <CheckCircle className="w-4 h-4 mr-1" />
//                     Auto-filled from your profile
//                   </div>
//                 )}
//               </div>
              
             
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={deliveryDetails.fullName}
//                       onChange={(e) => handleDeliveryChange('fullName', e.target.value)}
//                       className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                         errors.fullName ? 'border-red-300' : 'border-gray-200'
//                       }`}
//                       placeholder="Enter your full name"
//                     />
//                     <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                   </div>
//                   {errors.fullName && (
//                     <p className="text-red-600 text-sm mt-1 flex items-center">
//                       <AlertCircle className="w-3 h-3 mr-1" />
//                       {errors.fullName}
//                     </p>
//                   )}
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="tel"
//                       value={deliveryDetails.phone}
//                       onChange={(e) => handleDeliveryChange('phone', e.target.value)}
//                       className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                         errors.phone ? 'border-red-300' : 'border-gray-200'
//                       }`}
//                       placeholder="+94 712 345 678"
//                     />
//                     <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                   </div>
//                   {errors.phone && (
//                     <p className="text-red-600 text-sm mt-1 flex items-center">
//                       <AlertCircle className="w-3 h-3 mr-1" />
//                       {errors.phone}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     value={deliveryDetails.email}
//                     onChange={(e) => handleDeliveryChange('email', e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                       errors.email ? 'border-red-300' : 'border-gray-200'
//                     }`}
//                     placeholder="your.email@example.com"
//                   />
//                   {errors.email && (
//                     <p className="text-red-600 text-sm mt-1 flex items-center">
//                       <AlertCircle className="w-3 h-3 mr-1" />
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Delivery Address *
//                   </label>
//                   <div className="relative">
//                     <textarea
//                       value={deliveryDetails.address}
//                       onChange={(e) => handleDeliveryChange('address', e.target.value)}
//                       className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-20 resize-none ${
//                         errors.address ? 'border-red-300' : 'border-gray-200'
//                       }`}
//                       placeholder="Enter your complete delivery address"
//                     />
//                     <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                   </div>
//                   {errors.address && (
//                     <p className="text-red-600 text-sm mt-1 flex items-center">
//                       <AlertCircle className="w-3 h-3 mr-1" />
//                       {errors.address}
//                     </p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Special Instructions (Optional)
//                   </label>
//                   <textarea
//                     value={deliveryDetails.specialInstructions}
//                     onChange={(e) => handleDeliveryChange('specialInstructions', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 h-16 resize-none"
//                     placeholder="Any special delivery instructions..."
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                 <CreditCard className="w-5 h-5 mr-2" />
//                 Payment Method
//               </h2>
              
//               {/* Payment Options */}
//               <div className="space-y-3 mb-6">
//                 <div
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => setPaymentMethod(PAYMENT_METHODS.CASH_ON_DELIVERY)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
//                         paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
//                           ? 'border-blue-500 bg-blue-500'
//                           : 'border-gray-300'
//                       }`}>
//                         {paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
//                           <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Cash on Delivery</p>
//                         <p className="text-sm text-gray-600">Pay when you receive the book</p>
//                       </div>
//                     </div>
//                     <span className="text-sm text-gray-500">+ Rs. 200 delivery fee</span>
//                   </div>
//                 </div>

//                 <div
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     paymentMethod === PAYMENT_METHODS.CREDIT_CARD
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => setPaymentMethod(PAYMENT_METHODS.CREDIT_CARD)}
//                 >
//                   <div className="flex items-center">
//                     <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
//                       paymentMethod === PAYMENT_METHODS.CREDIT_CARD
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300'
//                     }`}>
//                       {paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
//                         <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Credit/Debit Card</p>
//                       <p className="text-sm text-gray-600">Secure payment with your card</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* <div
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     paymentMethod === PAYMENT_METHODS.DIGITAL_WALLET
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => setPaymentMethod(PAYMENT_METHODS.DIGITAL_WALLET)}
//                 >
//                   <div className="flex items-center">
//                     <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
//                       paymentMethod === PAYMENT_METHODS.DIGITAL_WALLET
//                         ? 'border-blue-500 bg-blue-500'
//                         : 'border-gray-300'
//                     }`}>
//                       {paymentMethod === PAYMENT_METHODS.DIGITAL_WALLET && (
//                         <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Digital Wallet</p>
//                       <p className="text-sm text-gray-600">PayPal, Apple Pay, Google Pay</p>
//                     </div>
//                   </div>
//                 </div> */}
//               </div>

//               {/* Card Details Form */}
//               {(paymentMethod === PAYMENT_METHODS.CREDIT_CARD || paymentMethod === PAYMENT_METHODS.DEBIT_CARD) && (
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Cardholder Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={paymentDetails.cardholderName}
//                       onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
//                       className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                         errors.cardholderName ? 'border-red-300' : 'border-gray-200'
//                       }`}
//                       placeholder="Name on card"
//                     />
//                     {errors.cardholderName && (
//                       <p className="text-red-600 text-sm mt-1 flex items-center">
//                         <AlertCircle className="w-3 h-3 mr-1" />
//                         {errors.cardholderName}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Card Number *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={paymentDetails.cardNumber}
//                         onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
//                         className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                           errors.cardNumber ? 'border-red-300' : 'border-gray-200'
//                         }`}
//                         placeholder="1234 5678 9012 3456"
//                         maxLength="19"
//                       />
//                       <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                     </div>
//                     {errors.cardNumber && (
//                       <p className="text-red-600 text-sm mt-1 flex items-center">
//                         <AlertCircle className="w-3 h-3 mr-1" />
//                         {errors.cardNumber}
//                       </p>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Expiry Date *
//                       </label>
//                       <div className="grid grid-cols-2 gap-2">
//                         <select
//                           value={paymentDetails.expiryMonth}
//                           onChange={(e) => handlePaymentChange('expiryMonth', e.target.value)}
//                           className={`px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                             errors.expiry ? 'border-red-300' : 'border-gray-200'
//                           }`}
//                         >
//                           <option value="">MM</option>
//                           {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
//                             <option key={month} value={month.toString().padStart(2, '0')}>
//                               {month.toString().padStart(2, '0')}
//                             </option>
//                           ))}
//                         </select>
//                         <select
//                           value={paymentDetails.expiryYear}
//                           onChange={(e) => handlePaymentChange('expiryYear', e.target.value)}
//                           className={`px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                             errors.expiry ? 'border-red-300' : 'border-gray-200'
//                           }`}
//                         >
//                           <option value="">YY</option>
//                           {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
//                             <option key={year} value={(year % 100).toString().padStart(2, '0')}>
//                               {(year % 100).toString().padStart(2, '0')}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       {errors.expiry && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center">
//                           <AlertCircle className="w-3 h-3 mr-1" />
//                           {errors.expiry}
//                         </p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         CVV *
//                       </label>
//                       <div className="relative">
//                         <input
//                           type="text"
//                           value={paymentDetails.cvv}
//                           onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
//                           className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                             errors.cvv ? 'border-red-300' : 'border-gray-200'
//                           }`}
//                           placeholder="123"
//                           maxLength="4"
//                         />
//                         <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.cvv && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center">
//                           <AlertCircle className="w-3 h-3 mr-1" />
//                           {errors.cvv}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Digital Wallet Options */}
//               {/* {paymentMethod === PAYMENT_METHODS.DIGITAL_WALLET && (
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Choose Wallet Provider
//                   </label>
//                   <select
//                     value={paymentDetails.walletType}
//                     onChange={(e) => handlePaymentChange('walletType', e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//                   >
//                     <option value="paypal">PayPal</option>
//                     <option value="apple_pay">Apple Pay</option>
//                     <option value="google_pay">Google Pay</option>
//                   </select>
//                 </div>
//               )} */}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 sticky top-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
//               {/* Book Details */}
//               <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-200">
//                 <LazyImage
//                   fileName={book.bookImage}
//                   folderName="userBooks"
//                   alt={book.title}
//                   baseUrl="http://localhost:9090"
//                   placeholder="data:image/svg+xml,%3csvg width='150' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='150' height='200' fill='%236B7280'/%3e%3ctext x='75' y='100' text-anchor='middle' fill='%23FFFFFF' font-size='14'%3eNo Image%3c/text%3e%3c/svg%3e"
//                   className="w-16 h-20 object-cover rounded-lg shadow-sm"
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{book.title}</h3>
//                   <p className="text-xs text-gray-600 mt-1">{book.author}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Condition: {book.condition}
//                   </p>
//                   <div className="flex items-center mt-2">
//                     <UserAvatar 
//                       user={book.owner}
//                       size="xs"
//                       className="mr-1"
//                     />
//                     <span className="text-xs text-gray-600">{book.owner?.name}</span>
//                     <span className="ml-1 bg-blue-100 text-blue-800 px-1 rounded text-xs flex items-center">
//                       <Star className="w-2 h-2 mr-0.5" />
//                       {book.owner?.trustScore}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Information */}
//               <div className="mb-4 pb-4 border-b border-gray-200">
//                 <div className="flex items-center text-sm text-gray-600 mb-2">
//                   <Clock className="w-4 h-4 mr-2" />
//                   <span>Estimated Delivery</span>
//                 </div>
//                 <p className="text-sm font-medium text-gray-900">
//                   {estimatedDelivery?.toDateString()}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? '2-3 business days' : '2-3 business days'}
//                 </p>
//               </div>

//               {/* Price Breakdown */}
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Book Price</span>
//                   <span className="text-gray-900">Rs. {book.price}</span>
//                 </div>
//                 {paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Delivery Fee</span>
//                     <span className="text-gray-900">Rs. 200</span>
//                   </div>
//                 )}
//                 {paymentMethod !== PAYMENT_METHODS.CASH_ON_DELIVERY && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Delivery Fee</span>
//                     <span className="text-gray-900">Rs. 200</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-2">
//                   <div className="flex justify-between text-lg font-semibold">
//                     <span className="text-gray-900">Total</span>
//                     <span className="text-gray-900">Rs. {calculateTotal()}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Security Notice */}
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//                 <div className="flex items-center text-green-700 text-sm">
//                   <Shield className="w-4 h-4 mr-2" />
//                   <span>Your payment is secured with SSL encryption</span>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 variant="primary"
//                 fullWidth
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                     Processing...
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center">
//                     <ShoppingCart className="w-5 h-5 mr-2" />
//                     Complete Purchase
//                   </div>
//                 )}
//               </Button>

//               {errors.submit && (
//                 <p className="text-red-600 text-sm mt-2 flex items-center">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {errors.submit}
//                 </p>
//               )}

//               <p className="text-xs text-gray-500 mt-3 text-center">
//                 By completing this purchase, you agree to our Terms of Service and Privacy Policy.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;