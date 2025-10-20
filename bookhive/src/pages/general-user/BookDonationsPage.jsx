import React, { useState, useMemo } from 'react';
import {
  Gift,
  Trash,
  Send,
  MapPin,
  Users,
  BookOpen,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Search,
  Filter,
  Star,
  Target,
  Package,
  X,
  History,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Download,
  Truck
} from 'lucide-react';
import Button from '../../components/shared/Button';

// Mock data for previous donations
const donationHistory = [
  {
    id: 'DON-001',
    date: '2025-01-15',
    organization: 'Greenway School',
    organizationType: 'school',
    location: 'Colombo, Sri Lanka',
    status: 'delivered',
    totalBooks: 5,
    books: [
      { title: 'Basic Science Grade 9', quantity: 3, condition: 'good' },
      { title: 'Mathematics Workbook', quantity: 2, condition: 'very_good' }
    ],
    notes: 'Books were in excellent condition and greatly appreciated',
    pickupDate: '2025-01-16',
    deliveryDate: '2025-01-18',
    impactMessage: 'Your donation helped 15 students with their science studies!',
    certificateUrl: '#',
    organizationMessage: 'Thank you so much for the science books! The students are thrilled.',
    contactPerson: 'Ms. Sarah Fernando'
  },
  {
    id: 'DON-002', 
    date: '2025-01-10',
    organization: 'Rise and Read NGO',
    organizationType: 'ngo',
    location: 'Galle, Sri Lanka',
    status: 'in_transit',
    totalBooks: 3,
    books: [
      { title: 'English Grammar - Advanced', quantity: 2, condition: 'very_good' },
      { title: 'Vocabulary Builder', quantity: 1, condition: 'good' }
    ],
    notes: 'Perfect for adult literacy program',
    pickupDate: '2025-01-12',
    deliveryDate: null,
    estimatedDelivery: '2025-01-20',
    trackingNumber: 'TRK-78901234',
    contactPerson: 'Mr. Rohan Silva'
  },
  {
    id: 'DON-003',
    date: '2025-01-05',
    organization: 'Happy Kids Library',
    organizationType: 'library', 
    location: 'Kandy, Sri Lanka',
    status: 'picked_up',
    totalBooks: 8,
    books: [
      { title: 'Children\'s Fairy Tales', quantity: 5, condition: 'good' },
      { title: 'Picture Story Books', quantity: 3, condition: 'very_good' }
    ],
    notes: 'Children will love these colorful books',
    pickupDate: '2025-01-07',
    deliveryDate: null,
    estimatedDelivery: '2025-01-22',
    contactPerson: 'Mrs. Priya Mendis'
  },
  {
    id: 'DON-004',
    date: '2024-12-20',
    organization: 'Mountain View School',
    organizationType: 'school',
    location: 'Nuwara Eliya, Sri Lanka', 
    status: 'delivered',
    totalBooks: 12,
    books: [
      { title: 'World History Atlas', quantity: 4, condition: 'very_good' },
      { title: 'Geography Textbook Grade 8', quantity: 5, condition: 'good' },
      { title: 'Social Studies Workbook', quantity: 3, condition: 'excellent' }
    ],
    notes: 'Books for the new geography classroom',
    pickupDate: '2024-12-22',
    deliveryDate: '2024-12-28', 
    impactMessage: 'Your geography books are now helping 25 students learn about the world!',
    certificateUrl: '#',
    organizationMessage: 'The students love the new atlas! Thank you for making learning fun.',
    contactPerson: 'Mr. David Perera'
  }
];

const bookRequests = [
  {
    id: 1,
    title: "Grade 9 Science Textbooks",
    organization: "Greenway School",
    location: "Colombo, Sri Lanka",
    neededQuantity: 30,
    receivedQuantity: 12,
    condition: "good",
    purpose: "For new academic year students who cannot afford textbooks",
    urgency: "high",
    deadline: "2025-02-15",
    contactPerson: "Ms. Sarah Fernando",
    organizationType: "school",
    verified: true,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
    tags: ["education", "science", "textbooks"],
    createdAt: "2025-01-10"
  },
  {
    id: 2,
    title: "English Grammar Books",
    organization: "Rise and Read NGO",
    location: "Galle, Sri Lanka",
    neededQuantity: 20,
    receivedQuantity: 5,
    condition: "very_good",
    purpose: "Adult literacy program for rural communities",
    urgency: "medium",
    deadline: "2025-03-01",
    contactPerson: "Mr. Rohan Silva",
    organizationType: "ngo",
    verified: true,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
    tags: ["literacy", "english", "adult-education"],
    createdAt: "2025-01-08"
  },
  {
    id: 3,
    title: "Children's Storybooks",
    organization: "Happy Kids Library",
    location: "Kandy, Sri Lanka",
    neededQuantity: 50,
    receivedQuantity: 20,
    condition: "any",
    purpose: "Building a community library for underprivileged children",
    urgency: "low",
    deadline: "2025-04-01",
    contactPerson: "Mrs. Priya Mendis",
    organizationType: "library",
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    tags: ["children", "stories", "library"],
    createdAt: "2025-01-05"
  }
];

const availableBooks = [
  {
    id: 101,
    title: "English Grammar - Advanced",
    condition: "very_good",
    quantity: 5,
    category: "Language",
    isbn: "978-0123456789",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150&h=200&fit=crop"
  },
  {
    id: 102,
    title: "Basic Science Grade 9",
    condition: "good",
    quantity: 10,
    category: "Science",
    isbn: "978-0987654321",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150&h=200&fit=crop"
  },
  {
    id: 103,
    title: "Physics for Beginners",
    condition: "excellent",
    quantity: 15,
    category: "Science",
    isbn: "978-0456789123",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=150&h=200&fit=crop"
  },
  {
    id: 104,
    title: "Children's Fairy Tales",
    condition: "good",
    quantity: 8,
    category: "Children",
    isbn: "978-0789123456",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop"
  },
  {
    id: 105,
    title: "World History Atlas",
    condition: "very_good",
    quantity: 3,
    category: "History",
    isbn: "978-0321654987",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=150&h=200&fit=crop"
  }
];

const BookDonationsPage = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'donations'
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [donationResult, setDonationResult] = useState(null);
  const [selectedDonationHistory, setSelectedDonationHistory] = useState(null);
  const [donationFilter, setDonationFilter] = useState('all'); // 'all', 'delivered', 'in_transit', 'picked_up'
  const [donationSortBy, setDonationSortBy] = useState('newest'); // 'newest', 'oldest', 'organization'

  // Filter and search logic for requests
  const filteredRequests = useMemo(() => {
    return bookRequests.filter(req => {
      const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUrgency = filterUrgency === 'all' || req.urgency === filterUrgency;
      const matchesLocation = filterLocation === 'all' || req.location.includes(filterLocation);
      
      return matchesSearch && matchesUrgency && matchesLocation;
    });
  }, [searchTerm, filterUrgency, filterLocation]);

  // Filter and search logic for donation history
  const filteredDonations = useMemo(() => {
    let filtered = donationHistory.filter(donation => {
      const matchesFilter = donationFilter === 'all' || donation.status === donationFilter;
      return matchesFilter;
    });

    // Sort donations
    filtered.sort((a, b) => {
      switch (donationSortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'organization':
          return a.organization.localeCompare(b.organization);
        case 'newest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [donationFilter, donationSortBy]);

  // Calculate donation statistics
  const donationStats = useMemo(() => {
    const totalDonations = donationHistory.length;
    const totalBooks = donationHistory.reduce((sum, donation) => sum + donation.totalBooks, 0);
    const deliveredDonations = donationHistory.filter(d => d.status === 'delivered').length;
    const uniqueOrganizations = new Set(donationHistory.map(d => d.organization)).size;
    
    return {
      totalDonations,
      totalBooks,
      deliveredDonations,
      uniqueOrganizations
    };
  }, []);

  // Add book to donation list
  const handleSelectBook = (book) => {
    if (!selectedBooks.some(b => b.id === book.id)) {
      setSelectedBooks([...selectedBooks, {
        ...book,
        donateQuantity: 1
      }]);
    }
  };

  // Remove book from donation list
  const handleRemoveBook = (bookId) => {
    setSelectedBooks(selectedBooks.filter(b => b.id !== bookId));
    setErrors(prev => ({ ...prev, [bookId]: undefined }));
  };

  // Handle quantity change
  const handleQuantityChange = (bookId, value) => {
    const updatedBooks = selectedBooks.map(book => {
      if (book.id === bookId) {
        return { ...book, donateQuantity: Math.max(1, Math.min(value, book.quantity)) };
      }
      return book;
    });

    setSelectedBooks(updatedBooks);

    // Clear any existing errors for this book
    setErrors(prev => ({ ...prev, [bookId]: undefined }));
  };

  const handleDonationSubmit = () => {
    if (Object.values(errors).some(error => error)) {
      alert("Please resolve all errors before submitting.");
      return;
    }

    if (selectedBooks.length === 0) {
      alert("Please select at least one book to donate.");
      return;
    }

    // Calculate total books donated
    const totalBooksdonated = selectedBooks.reduce((sum, book) => sum + book.donateQuantity, 0);
    
    // Add to donation history
    const newDonation = {
      id: `DON-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      organization: selectedDonation.organization,
      organizationType: selectedDonation.organizationType,
      location: selectedDonation.location,
      status: 'picked_up',
      totalBooks: totalBooksdonated,
      books: selectedBooks.map(book => ({
        title: book.title,
        quantity: book.donateQuantity,
        condition: book.condition
      })),
      notes: notes,
      pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      deliveryDate: null,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
      contactPerson: selectedDonation.contactPerson
    };

    // Add to the beginning of donation history
    donationHistory.unshift(newDonation);
    
    setDonationResult({
      organization: selectedDonation.organization,
      totalBooks: totalBooksdonated,
      books: selectedBooks,
      notes: notes
    });
    
    setShowSuccessModal(true);

    // Reset state after showing success
    setTimeout(() => {
      setSelectedBooks([]);
      setNotes('');
      setSelectedDonation(null);
      setShowSuccessModal(false);
      setDonationResult(null);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'picked_up': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (received, needed) => {
    return Math.min((received / needed) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderDonationHistoryCard = (donation) => {
    return (
      <div
        key={donation.id}
        className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gift className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{donation.organization}</h3>
                <p className="text-xs text-gray-500">Donation ID: {donation.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(donation.status)}`}>
                {getStatusIcon(donation.status)}
                <span className="capitalize">{donation.status.replace('_', ' ')}</span>
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Date:</span>
              <span className="font-medium">{formatDate(donation.date)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Books:</span>
              <span className="font-medium">{donation.totalBooks} books</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Location:</span>
              <span className="font-medium">{donation.location}</span>
            </div>
            {donation.pickupDate && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Pickup:</span>
                <span className="font-medium">{formatDate(donation.pickupDate)}</span>
              </div>
            )}
            {donation.deliveryDate && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Delivered:</span>
                <span className="font-medium">{formatDate(donation.deliveryDate)}</span>
              </div>
            )}
            {donation.estimatedDelivery && !donation.deliveryDate && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Est. Delivery:</span>
                <span className="font-medium">{formatDate(donation.estimatedDelivery)}</span>
              </div>
            )}
          </div>

          {/* Books List */}
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Books Donated:</h4>
            <div className="space-y-1">
              {donation.books.slice(0, 2).map((book, index) => (
                <div key={index} className="text-xs text-gray-600">
                  • {book.title} (Qty: {book.quantity}, {book.condition})
                </div>
              ))}
              {donation.books.length > 2 && (
                <div className="text-xs text-gray-500">
                  + {donation.books.length - 2} more books
                </div>
              )}
            </div>
          </div>

          {/* Impact Message */}
          {donation.impactMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-green-800 font-medium">
                🎉 {donation.impactMessage}
              </p>
            </div>
          )}

          {/* Organization Message */}
          {donation.organizationMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-blue-800 italic">
                "{donation.organizationMessage}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 hover:bg-gray-100 text-xs px-3 py-1"
              onClick={() => setSelectedDonationHistory(donation)}
              icon={<Eye className="w-3 h-3" />}
            >
              View Details
            </Button>
            <div className="flex items-center space-x-2">
              {donation.trackingNumber && (
                <span className="text-xs text-gray-500">
                  Track: {donation.trackingNumber}
                </span>
              )}
              {donation.certificateUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
                  icon={<Download className="w-3 h-3" />}
                >
                  Certificate
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRequestCard = (req) => {
    const progressPercentage = getProgressPercentage(req.receivedQuantity, req.neededQuantity);
    const isSelected = selectedDonation?.id === req.id;

    return (
      <div
        key={req.id}
        className={`bg-white/90 backdrop-blur-md rounded-xl shadow-lg border transition-all duration-300 cursor-pointer hover:shadow-xl ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
        }`}
        onClick={() => setSelectedDonation(req)}
      >
        {/* Request Image */}
        <div className="relative h-40 overflow-hidden rounded-t-xl">
          <img
            src={req.image}
            alt={req.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(req.urgency)}`}>
              {req.urgency} priority
            </span>
            {req.verified && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gift className="text-blue-600 w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{req.title}</h3>
                <p className="text-xs text-gray-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {req.organization}
                </p>
              </div>
            </div>
            <Heart className={`w-5 h-5 ${isSelected ? 'text-red-500' : 'text-gray-300'}`} />
          </div>

          {/* Location and Deadline */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{req.location}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>Deadline: {formatDate(req.deadline)}</span>
            </div>
          </div>

          {/* Purpose */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 italic">
            "{req.purpose}"
          </p>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs text-gray-500">
                {req.receivedQuantity}/{req.neededQuantity} books
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {req.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Contact Person */}
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
            Contact: {req.contactPerson}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Tabs */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Book Donations</h1>
              <p className="text-gray-600">
                {activeTab === 'requests' 
                  ? 'Help communities by donating your books to those who need them most'
                  : 'Track your donation history and see the impact you\'ve made'
                }
              </p>
            </div>
            {activeTab === 'requests' && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Target className="w-4 h-4" />
                <span>{bookRequests.length} active requests</span>
              </div>
            )}
            {activeTab === 'donations' && (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{donationStats.totalBooks}</div>
                  <div className="text-xs text-gray-500">Books Donated</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{donationStats.uniqueOrganizations}</div>
                  <div className="text-xs text-gray-500">Organizations Helped</div>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Gift className="w-4 h-4" />
                <span>Donation Requests</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'donations'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <History className="w-4 h-4" />
                <span>My Donations ({donationStats.totalDonations})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' ? (
          <>
            {/* Search and Filters for Requests */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search requests by title, organization, or purpose..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <select
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">All Locations</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Galle">Galle</option>
                  <option value="Kandy">Kandy</option>
                </select>
              </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(renderRequestCard)
              ) : (
                <div className="col-span-full text-center py-12 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Donation Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gift className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{donationStats.totalDonations}</div>
                    <div className="text-sm text-gray-500">Total Donations</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{donationStats.totalBooks}</div>
                    <div className="text-sm text-gray-500">Books Donated</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-purple-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{donationStats.deliveredDonations}</div>
                    <div className="text-sm text-gray-500">Delivered</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="text-yellow-600 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{donationStats.uniqueOrganizations}</div>
                    <div className="text-sm text-gray-500">Organizations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters for Donation History */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
                <select
                  value={donationFilter}
                  onChange={(e) => setDonationFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="in_transit">In Transit</option>
                  <option value="picked_up">Picked Up</option>
                </select>
                <select
                  value={donationSortBy}
                  onChange={(e) => setDonationSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="organization">By Organization</option>
                </select>
                <div className="flex-1"></div>
                <div className="text-sm text-gray-500">
                  {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>

            {/* Donation History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.length > 0 ? (
                filteredDonations.map(renderDonationHistoryCard)
              ) : (
                <div className="col-span-full text-center py-12 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
                  <History className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations found</h3>
                  <p className="text-gray-500">
                    {donationHistory.length === 0 
                      ? "You haven't made any donations yet. Start by browsing donation requests!"
                      : "Try adjusting your filter criteria."
                    }
                  </p>
                  {donationHistory.length === 0 && (
                    <Button
                      variant="primary"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
                      onClick={() => setActiveTab('requests')}
                    >
                      Browse Requests
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Donation Section - only show on requests tab */}
        {activeTab === 'requests' && selectedDonation && (
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Donate to: {selectedDonation.organization}
                </h2>
                <p className="text-gray-600 text-sm">
                  Help them reach their goal of {selectedDonation.neededQuantity} books
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setSelectedDonation(null);
                  setSelectedBooks([]);
                  setNotes('');
                  setErrors({});
                }}
                icon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </div>

            {/* Available Books */}
            <div>
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Select Your Books
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {availableBooks.map((book) => {
                  const isSelected = selectedBooks.some(b => b.id === book.id);
                  return (
                    <div key={book.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex space-x-3">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{book.title}</h4>
                          <p className="text-xs text-gray-600">Available: {book.quantity}</p>
                          <p className="text-xs text-gray-500">Condition: {book.condition}</p>
                          <Button
                            variant={isSelected ? "outline" : "primary"}
                            size="sm"
                            className={`mt-2 text-xs ${
                              isSelected 
                                ? "border-green-200 text-green-600 bg-green-50" 
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                            onClick={() => handleSelectBook(book)}
                            disabled={isSelected}
                            icon={isSelected ? <CheckCircle className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          >
                            {isSelected ? "Added" : "Add"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Books */}
            {selectedBooks.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Selected Books ({selectedBooks.length})
                </h3>
                <div className="space-y-3">
                  {selectedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{book.title}</h4>
                          <p className="text-sm text-gray-500">Condition: {book.condition}</p>
                          <div className="mt-2 flex items-center space-x-3">
                            <label htmlFor={`quantity-${book.id}`} className="text-sm font-medium text-gray-700">
                              Quantity:
                            </label>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(book.id, book.donateQuantity - 1)}
                                className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
                                disabled={book.donateQuantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="bg-white border border-gray-300 rounded px-3 py-1 text-sm min-w-[3rem] text-center">
                                {book.donateQuantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(book.id, book.donateQuantity + 1)}
                                className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
                                disabled={book.donateQuantity >= book.quantity}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">of {book.quantity} available</span>
                          </div>
                          {errors[book.id] && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors[book.id]}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBook(book.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        title="Remove Book"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Donation Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Donation Summary</h4>
                  <div className="text-sm text-gray-600">
                    <p>Total books to donate: <span className="font-semibold">
                      {selectedBooks.reduce((sum, book) => sum + book.donateQuantity, 0)}
                    </span></p>
                    <p>Recipient: <span className="font-semibold">{selectedDonation.organization}</span></p>
                    <p>Location: <span className="font-semibold">{selectedDonation.location}</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="You can mention pickup preferences, book condition details, or any special instructions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleDonationSubmit}
                icon={<Send className="w-4 h-4" />}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                disabled={selectedBooks.length === 0 || Object.values(errors).some(e => e)}
              >
                Submit Donation
              </Button>
            </div>
          </div>
        )}

        {/* Donation History Detail Modal */}
        {selectedDonationHistory && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Donation Details</h3>
                    <p className="text-gray-600">ID: {selectedDonationHistory.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDonationHistory(null)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Status and Timeline */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedDonationHistory.status)}`}>
                      {getStatusIcon(selectedDonationHistory.status)}
                      <span className="capitalize">{selectedDonationHistory.status.replace('_', ' ')}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedDonationHistory.status === 'delivered' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Donation Submitted</div>
                        <div className="text-xs text-gray-500">{formatDate(selectedDonationHistory.date)}</div>
                      </div>
                    </div>
                    {selectedDonationHistory.pickupDate && (
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${selectedDonationHistory.status !== 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Books Picked Up</div>
                          <div className="text-xs text-gray-500">{formatDate(selectedDonationHistory.pickupDate)}</div>
                        </div>
                      </div>
                    )}
                    {selectedDonationHistory.deliveryDate ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Delivered Successfully</div>
                          <div className="text-xs text-gray-500">{formatDate(selectedDonationHistory.deliveryDate)}</div>
                        </div>
                      </div>
                    ) : selectedDonationHistory.estimatedDelivery && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Expected Delivery</div>
                          <div className="text-xs text-gray-500">{formatDate(selectedDonationHistory.estimatedDelivery)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Organization Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Organization:</span>
                      <div className="font-medium">{selectedDonationHistory.organization}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium capitalize">{selectedDonationHistory.organizationType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <div className="font-medium">{selectedDonationHistory.location}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Contact:</span>
                      <div className="font-medium">{selectedDonationHistory.contactPerson}</div>
                    </div>
                  </div>
                </div>

                {/* Books Details */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Books Donated ({selectedDonationHistory.totalBooks})</h4>
                  <div className="space-y-2">
                    {selectedDonationHistory.books.map((book, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">Condition: {book.condition}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          Qty: {book.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedDonationHistory.notes && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Your Notes</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      {selectedDonationHistory.notes}
                    </div>
                  </div>
                )}

                {/* Impact Message */}
                {selectedDonationHistory.impactMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-green-900 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Impact Report
                    </h4>
                    <p className="text-green-800 text-sm">
                      {selectedDonationHistory.impactMessage}
                    </p>
                  </div>
                )}

                {/* Organization Message */}
                {selectedDonationHistory.organizationMessage && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">Message from Organization</h4>
                    <p className="text-blue-800 text-sm italic">
                      "{selectedDonationHistory.organizationMessage}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  {selectedDonationHistory.trackingNumber && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tracking:</span> {selectedDonationHistory.trackingNumber}
                    </div>
                  )}
                  <div className="flex space-x-3">
                    {selectedDonationHistory.certificateUrl && (
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download Certificate
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      onClick={() => setSelectedDonationHistory(null)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && donationResult && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Donation Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for donating {donationResult.totalBooks} book{donationResult.totalBooks > 1 ? 's' : ''} to {donationResult.organization}
                </p>
                <div className="bg-gray-50 rounded-lg p-3 text-left">
                  <h4 className="font-medium text-gray-800 mb-2">Donation Details:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {donationResult.books.map(book => (
                      <li key={book.id}>• {book.title} (Qty: {book.donateQuantity})</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  You will receive a confirmation email with pickup details shortly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDonationsPage;