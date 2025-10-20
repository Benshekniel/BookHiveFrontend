import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Package, 
  Eye, 
  MessageSquare,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Truck,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { deliveryApi, agentApi } from '../../services/deliveryService';

const Deliveries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    delayed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch deliveries and stats from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all deliveries
        const deliveriesResponse = await deliveryApi.getAllDeliveries();
        
        // Transform backend data to match frontend structure
        const transformedDeliveries = deliveriesResponse.map(delivery => ({
          id: delivery.id,
          customer: delivery.customerName || 'Unknown Customer',
          customerPhone: delivery.customerPhone || 'N/A',
          customerEmail: delivery.customerEmail || 'N/A',
          pickup: delivery.pickupAddress || 'Pickup location',
          dropoff: delivery.deliveryAddress || 'Delivery location',
          rider: delivery.agentName || 'Unassigned',
          riderPhone: delivery.agentPhone || 'N/A',
          status: mapBackendStatus(delivery.status),
          estimatedTime: calculateEstimatedTime(delivery),
          orderTime: formatTime(delivery.createdAt || delivery.orderTime),
          priority: delivery.priority?.toLowerCase() || 'normal',
          value: `${delivery.value || 0}`,
          trackingNumber: delivery.trackingNumber,
          description: delivery.description || 'No description available',
          weight: delivery.weight || 'N/A',
          dimensions: delivery.dimensions || 'N/A',
          paymentMethod: delivery.paymentMethod || 'N/A',
          deliveryNotes: delivery.deliveryNotes || '',
          createdAt: delivery.createdAt,
          pickupTime: delivery.pickupTime,
          estimatedDelivery: delivery.estimatedDelivery
        }));
        
        setDeliveries(transformedDeliveries);
        
        // Calculate stats
        const statsData = calculateStats(transformedDeliveries);
        setStats(statsData);
        
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError('Failed to load deliveries');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'PENDING': 'pending',
      'ASSIGNED': 'pending',
      'PICKED_UP': 'picked-up',
      'IN_TRANSIT': 'in-transit',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
      'DELAYED': 'delayed'
    };
    return statusMap[backendStatus] || 'pending';
  };

  // Calculate estimated time based on delivery data
  const calculateEstimatedTime = (delivery) => {
    if (delivery.status === 'DELIVERED') return 'Completed';
    if (delivery.status === 'DELAYED') return 'Overdue';
    if (delivery.status === 'PENDING') return 'Waiting';
    
    // For in-transit deliveries, calculate based on creation time
    const estimatedMinutes = 30; // Default estimation
    return `${estimatedMinutes} min`;
  };

  // Format time from backend
  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate delivery statistics
  const calculateStats = (deliveriesData) => {
    const total = deliveriesData.length;
    const inTransit = deliveriesData.filter(d => d.status === 'in-transit' || d.status === 'picked-up').length;
    const delivered = deliveriesData.filter(d => d.status === 'delivered').length;
    const delayed = deliveriesData.filter(d => d.status === 'delayed').length;
    
    return { total, inTransit, delivered, delayed };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'in-transit': return 'bg-blue-100 text-blue-600';
      case 'picked-up': return 'bg-yellow-100 text-yellow-600';
      case 'delayed': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-yellow-400 text-blue-900';
      case 'normal': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package, color: 'red' },
      { key: 'picked-up', label: 'Picked Up', icon: User, color: 'yellow' },
      { key: 'in-transit', label: 'In Transit', icon: Truck, color: 'blue' },
      { key: 'delivered', label: 'Delivered', icon: Home, color: 'green' }
    ];

    const statusOrder = ['pending', 'picked-up', 'in-transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  // Filter deliveries based on search and status
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.id?.toString().includes(searchTerm.toLowerCase()) ||
                         delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDelivery(null);
  };

  // Update delivery status
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      // Map frontend status to backend status
      const backendStatusMap = {
        'pending': 'PENDING',
        'picked-up': 'PICKED_UP',
        'in-transit': 'IN_TRANSIT',
        'delivered': 'DELIVERED',
        'delayed': 'DELAYED'
      };
      
      await deliveryApi.updateDeliveryStatus(deliveryId, backendStatusMap[newStatus]);
      
      // Update local state
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );
      
      // Recalculate stats
      const updatedDeliveries = deliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: newStatus }
          : delivery
      );
      setStats(calculateStats(updatedDeliveries));
      
    } catch (err) {
      console.error('Error updating delivery status:', err);
      alert('Failed to update delivery status');
    }
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const TrackingProgressBar = ({ delivery }) => {
    const steps = getTrackingSteps(delivery.status);
    
    const getStepColors = (step) => {
      if (step.completed) {
        switch (step.color) {
          case 'red': return 'bg-red-500 text-white';
          case 'blue': return 'bg-blue-500 text-white';
          case 'green': return 'bg-green-500 text-white';
          case 'yellow': return 'bg-yellow-500 text-white';
          default: return 'bg-blue-500 text-white';
        }
      } else if (step.active) {
        switch (step.color) {
          case 'red': return 'bg-red-100 text-red-500 border-2 border-red-500';
          case 'blue': return 'bg-blue-100 text-blue-500 border-2 border-blue-500';
          case 'green': return 'bg-green-100 text-green-500 border-2 border-green-500';
          case 'yellow': return 'bg-yellow-100 text-yellow-500 border-2 border-yellow-500';
          default: return 'bg-blue-100 text-blue-500 border-2 border-blue-500';
        }
      } else {
        return 'bg-gray-100 text-gray-400';
      }
    };

    const getTextColors = (step) => {
      if (step.completed) {
        switch (step.color) {
          case 'red': return 'text-red-600';
          case 'blue': return 'text-blue-600';
          case 'green': return 'text-green-600';
          case 'yellow': return 'text-yellow-600';
          default: return 'text-blue-600';
        }
      } else if (step.active) {
        switch (step.color) {
          case 'red': return 'text-red-500';
          case 'blue': return 'text-blue-500';
          case 'green': return 'text-green-500';
          case 'yellow': return 'text-yellow-500';
          default: return 'text-blue-500';
        }
      } else {
        return 'text-gray-500';
      }
    };

    const getUnderlineColors = (step) => {
      if (step.completed || step.active) {
        switch (step.color) {
          case 'red': return 'bg-red-500';
          case 'blue': return 'bg-blue-500';
          case 'green': return 'bg-green-500';
          case 'yellow': return 'bg-yellow-500';
          default: return 'bg-blue-500';
        }
      } else {
        return 'bg-gray-300';
      }
    };
    
    return (
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${getStepColors(step)} ${
                    step.completed ? 'shadow-lg transform scale-110' : step.active ? 'animate-pulse' : ''
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Step Label with Animated Filling Underline */}
                  <div className="flex flex-col items-center relative">
                    <span className={`text-xs text-center font-medium transition-colors duration-300 ${getTextColors(step)} px-2`}>
                      {step.label}
                    </span>
                    
                    {/* Animated Filling Underline */}
                    <div className="relative mt-1 w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getUnderlineColors(step)} ${
                          step.active ? 'animate-pulse' : ''
                        }`}
                        style={{
                          width: step.completed ? '100%' : step.active ? '100%' : '0%',
                          animationDuration: step.active ? '1s' : '0s'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const DeliveryModal = ({ delivery, onClose }) => {
    if (!delivery) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-xl">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Delivery Details</h2>
              <p className="text-sm text-gray-600">{delivery.trackingNumber}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 bg-gray-50">
            {/* Tracking Progress */}
            <TrackingProgressBar delivery={delivery} />

            {/* Delivery Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {delivery.customer}
                  </p>
                  <p className="text-sm flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {delivery.customerPhone}
                  </p>
                  <p className="text-sm flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {delivery.customerEmail}
                  </p>
                </div>
              </div>

              {/* Rider Information */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Rider Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {delivery.rider}
                  </p>
                  <p className="text-sm flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {delivery.riderPhone}
                  </p>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Route Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Pickup Location</p>
                    <p className="text-sm">{delivery.pickup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Delivery Location</p>
                    <p className="text-sm">{delivery.dropoff}</p>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Package Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Description:</span> {delivery.description}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Weight:</span> {delivery.weight}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dimensions:</span> {delivery.dimensions}
                  </p>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                      {delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment & Timing */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Payment & Value
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Value:</span> {delivery.value}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Payment Method:</span> {delivery.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Timing Information */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Timing Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Order Time:</span> {delivery.orderTime}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">ETA:</span> {delivery.estimatedTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
              >
                Close
              </button>
              <button 
                onClick={() => console.log('Contact rider:', delivery.rider)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Rider</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pagination Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-b-xl">
        {/* Results info */}
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredDeliveries.length)} of{' '}
            {filteredDeliveries.length} results
          </p>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-1">
          {/* First page */}
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
                disabled={pageNumber === '...'}
                className={`px-3 py-2 text-sm rounded-lg ${
                  pageNumber === currentPage
                    ? 'bg-blue-600 text-white'
                    : pageNumber === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {/* Next page */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Loading animation
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Total Today</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">In Transit</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.inTransit}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.delivered}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Delayed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.delayed}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="picked-up">Picked Up</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      {/* Deliveries List with Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">
                        {delivery.trackingNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-slate-900">{delivery.customer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{delivery.pickup}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span className="text-sm text-gray-600">{delivery.dropoff}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-slate-900">{delivery.rider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{delivery.estimatedTime}</p>
                      <p className="text-xs text-gray-500">Ordered: {delivery.orderTime}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        onClick={() => handleViewDelivery(delivery)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        onClick={() => console.log('Message about delivery:', delivery.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <PaginationControls />
      </div>

      {filteredDeliveries.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No deliveries found matching your search criteria.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <DeliveryModal 
          delivery={selectedDelivery} 
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Deliveries;