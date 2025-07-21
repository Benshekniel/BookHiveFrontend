import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Package, 
  Eye, 
  MessageSquare,
  Building2,
  ArrowLeft,
  CheckCircle,
  Truck,
  RotateCcw,
  AlertTriangle,
  X
} from 'lucide-react';

const Delivery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedHub, setSelectedHub] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const hubs = [
    {
      id: 'H001',
      name: 'Downtown Hub',
      location: 'Business District',
      activeDeliveries: 12,
      completedToday: 45,
      totalDeliveries: 156
    },
    {
      id: 'H002',
      name: 'North Hub',
      location: 'Industrial Park',
      activeDeliveries: 8,
      completedToday: 38,
      totalDeliveries: 124
    },
    {
      id: 'H003',
      name: 'South Hub',
      location: 'Commerce District',
      activeDeliveries: 15,
      completedToday: 42,
      totalDeliveries: 189
    },
    {
      id: 'H004',
      name: 'West Hub',
      location: 'Logistics Avenue',
      activeDeliveries: 6,
      completedToday: 31,
      totalDeliveries: 98
    },
  ];

const deliveries = [
  {
    id: 'D001',
    hubId: 'H001',
    customer: 'John Smith',
    pickup: '123 Main St',
    dropoff: '456 Oak Ave',
    rider: 'Jane Doe',
    status: 'in-transit',
    estimatedTime: '30 min',
    orderTime: '09:15 AM',
    priority: 'high',
    trackingNumber: 'D001',
    description: 'Standard package',
    weight: '2.5 kg',
    dimensions: '30x20x10 cm',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'D002',
    hubId: 'H001',
    customer: 'Sarah Johnson',
    pickup: '789 Pine Rd',
    dropoff: '321 Elm St',
    rider: 'Mike Wilson',
    status: 'delivered',
    estimatedTime: 'Completed',
    orderTime: '08:45 AM',
    priority: 'medium',
    trackingNumber: 'D002',
    description: 'Fragile package',
    weight: '1.8 kg',
    dimensions: '25x15x8 cm',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'D003',
    hubId: 'H002',
    customer: 'Mike Wilson',
    pickup: '654 Cedar Ln',
    dropoff: '987 Birch Dr',
    rider: 'Lisa Brown',
    status: 'picked-up',
    estimatedTime: '45 min',
    orderTime: '10:00 AM',
    priority: 'low',
    trackingNumber: 'D003',
    description: 'Documents',
    weight: '0.5 kg',
    dimensions: '22x28x1 cm',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'D004',
    hubId: 'H003',
    customer: 'Lisa Brown',
    pickup: '147 Maple St',
    dropoff: '258 Willow Ave',
    rider: 'Tom Smith',
    status: 'delayed',
    estimatedTime: 'Overdue',
    orderTime: '09:30 AM',
    priority: 'high',
    trackingNumber: 'D004',
    description: 'Urgent package',
    weight: '3.2 kg',
    dimensions: '35x25x15 cm',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'D005',
    hubId: 'H004',
    customer: 'Emily Davis',
    pickup: '369 Spruce St',
    dropoff: '741 Pine Rd',
    rider: 'Alex Carter',
    status: 'in-transit',
    estimatedTime: '25 min',
    orderTime: '10:45 AM',
    priority: 'medium',
    trackingNumber: 'D005',
    description: 'Electronics',
    weight: '4.0 kg',
    dimensions: '40x30x20 cm',
    paymentMethod: 'PayPal'
  },
  {
    id: 'D006',
    hubId: 'H005',
    customer: 'David Lee',
    pickup: '852 Oak Ln',
    dropoff: '963 Cedar Dr',
    rider: 'Sophie Turner',
    status: 'delivered',
    estimatedTime: 'Completed',
    orderTime: '07:30 AM',
    priority: 'low',
    trackingNumber: 'D006',
    description: 'Clothing',
    weight: '1.2 kg',
    dimensions: '30x25x5 cm',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'D007',
    hubId: 'H001',
    customer: 'Anna Taylor',
    pickup: '159 Elm Ave',
    dropoff: '753 Maple St',
    rider: 'James Brown',
    status: 'picked-up',
    estimatedTime: '40 min',
    orderTime: '11:00 AM',
    priority: 'high',
    trackingNumber: 'D007',
    description: 'Medical supplies',
    weight: '2.0 kg',
    dimensions: '25x20x10 cm',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'D008',
    hubId: 'H001',
    customer: 'Robert Wilson',
    pickup: '426 Birch Rd',
    dropoff: '582 Pine St',
    rider: 'Emma White',
    status: 'in-transit',
    estimatedTime: '35 min',
    orderTime: '09:50 AM',
    priority: 'medium',
    trackingNumber: 'D008',
    description: 'Books',
    weight: '3.5 kg',
    dimensions: '35x25x10 cm',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'D009',
    hubId: 'H001',
    customer: 'Laura Martinez',
    pickup: '741 Cedar Ave',
    dropoff: '369 Oak St',
    rider: 'Chris Evans',
    status: 'delivered',
    estimatedTime: 'Completed',
    orderTime: '08:00 AM',
    priority: 'low',
    trackingNumber: 'D009',
    description: 'Household items',
    weight: '5.0 kg',
    dimensions: '45x30x25 cm',
    paymentMethod: 'PayPal'
  },
  {
    id: 'D010',
    hubId: 'H001',
    customer: 'Michael Chen',
    pickup: '987 Willow Dr',
    dropoff: '123 Spruce Ln',
    rider: 'Olivia Green',
    status: 'delayed',
    estimatedTime: 'Overdue',
    orderTime: '10:15 AM',
    priority: 'high',
    trackingNumber: 'D010',
    description: 'Urgent documents',
    weight: '0.8 kg',
    dimensions: '30x20x2 cm',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'D011',
    hubId: 'H001',
    customer: 'Sophia Adams',
    pickup: '258 Maple Rd',
    dropoff: '654 Elm Ave',
    rider: 'Liam Parker',
    status: 'in-transit',
    estimatedTime: '20 min',
    orderTime: '11:30 AM',
    priority: 'medium',
    trackingNumber: 'D011',
    description: 'Groceries',
    weight: '6.0 kg',
    dimensions: '50x35x20 cm',
    paymentMethod: 'Cash on Delivery'
  },
  {
    id: 'D012',
    hubId: 'H001',
    customer: 'Daniel Kim',
    pickup: '321 Pine St',
    dropoff: '789 Cedar Ln',
    rider: 'Mia Johnson',
    status: 'picked-up',
    estimatedTime: '50 min',
    orderTime: '09:00 AM',
    priority: 'low',
    trackingNumber: 'D012',
    description: 'Office supplies',
    weight: '2.8 kg',
    dimensions: '40x30x15 cm',
    paymentMethod: 'Credit Card'
  }
];

const statics = [
    {
      title: 'Total Today',
      value: '50', // Placeholder value
      change: '+5 from yesterday',
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'In Transit',
      value: '15',
      change: '+2 in last hour',
      icon: Truck,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      title: 'Delivered',
      value: '30',
      change: '+8 today',
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      title: 'Delayed',
      value: '5',
      change: 'Needs attention',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'in-transit': return 'bg-blue-100 text-blue-600';
      case 'picked-up': return 'bg-yellow-100 text-yellow-600';
      case 'delayed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-yellow-400 text-blue-900';
      case 'medium': return 'bg-gray-100 text-gray-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package, color: 'red' },
      { key: 'picked-up', label: 'Picked Up', icon: User, color: 'yellow' },
      { key: 'in-transit', label: 'In Transit', icon: Truck, color: 'blue' },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' }
    ];

    const statusOrder = ['pending', 'picked-up', 'in-transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const hubDeliveries = selectedHub
    ? deliveries.filter(d => d.hubId === selectedHub.id)
    : deliveries;

  const filteredDeliveries = hubDeliveries.filter(delivery => {
    const matchesSearch = delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.tostoichiometry) ||
      delivery.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: hubDeliveries.length,
    inTransit: hubDeliveries.filter(d => d.status === 'in-transit' || d.status === 'picked-up').length,
    delivered: hubDeliveries.filter(d => d.status === 'delivered').length,
    delayed: hubDeliveries.filter(d => d.status === 'delayed').length
  };

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDelivery(null);
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
                  
                  <div className="flex flex-col items-center relative">
                    <span className={`text-xs text-center font-medium transition-colors duration-300 ${getTextColors(step)} px-2`}>
                      {step.label}
                    </span>
                    
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
            <TrackingProgressBar delivery={delivery} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {delivery.customer}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Rider Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {delivery.rider}
                  </p>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

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

  if (!selectedHub) {
    return (
      <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search hubs by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              onClick={() => setSelectedHub(hub)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-900"
            >
              <div className="flex items-center justify-between mb-4">
                <Building2 className="text-blue-600" size={32} />
                <span className="text-sm text-gray-500">{hub.id}</span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1 font-heading">{hub.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{hub.location}</p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="text-sm font-medium text-blue-600">{hub.activeDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed Today</span>
                  <span className="text-sm font-medium text-green-600">{hub.completedToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-sm font-medium text-slate-900">{hub.totalDeliveries}</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">
                View Deliveries
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedHub(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">{selectedHub.name} Deliveries</h2>
            <p className="text-gray-600">Monitor deliveries from {selectedHub.location}</p>
          </div>
        </div>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
          <Eye size={20} />
          <span>Analytics</span>
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statics.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 font-heading">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>

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
              {filteredDeliveries.map((delivery) => (
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
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No deliveries found matching your search criteria.</p>
        </div>
      )}

      {showModal && (
        <DeliveryModal 
          delivery={selectedDelivery} 
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Delivery;