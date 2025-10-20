import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Truck, Package, Clock, Users, TrendingUp, Filter, Map, RefreshCw, AlertCircle, Navigation, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Hub = () => {
  const [activeTab, setActiveTab] = useState('hubs');
  const [hubFilter, setHubFilter] = useState('all');
  
  // Data states
  const [hubs, setHubs] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [hubPerformance, setHubPerformance] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    activeHubs: 0,
    activeDeliveries: 0,
    totalAgents: 0,
    completedToday: 0
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Pagination states for hubs
  const [currentPage, setCurrentPage] = useState(1);
  const [hubsPerPage] = useState(9);

  // Load initial data
  useEffect(() => {
    loadAllData();
    loadGoogleMaps();
  }, []);

  // Update map when hubs change and map is loaded
  useEffect(() => {
    if (mapLoaded && hubs.length > 0) {
      initializeHubMap();
    }
  }, [mapLoaded, hubs]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'schedules') {
      loadDeliverySchedules();
    } else if (activeTab === 'performance') {
      loadPerformanceData();
    }
  }, [activeTab]);

  const loadGoogleMaps = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_N6VhUsq0bX8FEDfanh3Af-I1Bx5caFU&libraries=geometry,places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      console.error('Error loading Google Maps');
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);
  };

  const initializeHubMap = () => {
    const mapElement = document.getElementById('moderator-hub-map');
    if (!mapElement || !window.google) return;

    // Default center (Colombo, Sri Lanka)
    const defaultCenter = { lat: 6.9271, lng: 79.8612 };

    // Initialize map
    const map = new window.google.maps.Map(mapElement, {
      zoom: 7,
      center: defaultCenter,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Add markers for hubs
    const bounds = new window.google.maps.LatLngBounds();
    let validMarkers = 0;

    console.log(`Adding ${hubs.length} hubs to map...`);

    hubs.forEach((hub) => {
      const coordinates = getHubCoordinates(hub);
      if (coordinates && coordinates.lat && coordinates.lng) {
        addHubMarkerToMap(map, hub, coordinates, bounds);
        validMarkers++;
      } else {
        console.warn(`Hub ${hub.hubName || hub.name} has no valid coordinates`);
      }
    });

    console.log(`Added ${validMarkers} valid markers to map`);

    // Adjust map bounds if we have markers
    if (validMarkers > 0) {
      setTimeout(() => {
        map.fitBounds(bounds);
        if (map.getZoom() > 12) {
          map.setZoom(10);
        }
      }, 1000);
    }
  };

  const addHubMarkerToMap = (map, hub, coordinates, bounds) => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn(`Invalid coordinates for hub ${hub.hubName || hub.name}:`, coordinates);
      return;
    }

    const position = { lat, lng };

    // Use red markers for all hubs
    const icon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new window.google.maps.Size(35, 35),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 35)
    };

    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: `${hub.hubName || hub.name} - ${hub.status || 'operational'}`,
      icon: icon
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: createHubInfoWindowContent(hub)
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    bounds.extend(position);
    console.log(`Added marker for ${hub.hubName || hub.name} at ${lat}, ${lng}`);
  };

  const createHubInfoWindowContent = (hub) => {
    return `
      <div style="max-width: 300px; font-family: Arial, sans-serif;">
        <h4 style="margin: 0 0 8px 0; color: #1f2937;">${hub.hubName || hub.name}</h4>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${hub.status || 'operational'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${hub.address || 'N/A'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>City:</strong> ${hub.city || 'N/A'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Agents:</strong> ${hub.agentCount || 0}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Manager:</strong> ${hub.managerName || 'Not assigned'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Today's Deliveries:</strong> ${hub.todayDeliveries || 0}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Total Deliveries:</strong> ${hub.totalDeliveries || 0}</p>
      </div>
    `;
  };

  const getHubCoordinates = (hub) => {
    // If hub has valid coordinates, use them
    if (hub.latitude && hub.longitude) {
      const lat = parseFloat(hub.latitude);
      const lng = parseFloat(hub.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    // Generate coordinates based on city/hub name
    const cityCoordinates = {
      'Colombo': { lat: 6.9271, lng: 79.8612 },
      'Kandy': { lat: 7.2906, lng: 80.6337 },
      'Galle': { lat: 6.0329, lng: 80.2168 },
      'Negombo': { lat: 7.2084, lng: 79.8375 },
      'Ratnapura': { lat: 6.6828, lng: 80.3992 },
      'Jaffna': { lat: 9.6615, lng: 80.0255 },
      'Anuradhapura': { lat: 8.3114, lng: 80.4037 },
      'Matara': { lat: 5.9549, lng: 80.5550 },
      'Nuwara Eliya': { lat: 6.9497, lng: 80.7891 },
      'Ampara': { lat: 7.2975, lng: 81.6747 },
      'Badulla': { lat: 6.9934, lng: 81.0550 },
      'Batticaloa': { lat: 7.7102, lng: 81.6924 },
      'Gampaha': { lat: 7.0840, lng: 79.9956 },
      'Hambantota': { lat: 6.1241, lng: 81.1185 },
      'Kalutara': { lat: 6.5831, lng: 79.9607 },
      'Kegalle': { lat: 7.2513, lng: 80.3464 },
      'Kurunegala': { lat: 7.4818, lng: 80.3609 },
      'Matale': { lat: 7.4675, lng: 80.6234 },
      'Monaragala': { lat: 6.8714, lng: 81.3507 },
      'Polonnaruwa': { lat: 7.9403, lng: 81.0188 },
      'Puttalam': { lat: 8.0362, lng: 79.8283 },
      'Trincomalee': { lat: 8.5874, lng: 81.2152 }
    };

    // Try to match city name
    const city = hub.city || '';
    const hubName = hub.hubName || hub.name || '';
    
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (city.toLowerCase().includes(cityName.toLowerCase()) || 
          hubName.toLowerCase().includes(cityName.toLowerCase())) {
        console.log(`Using generated coordinates for ${hub.hubName || hub.name}: ${cityName}`);
        return coords;
      }
    }

    // Default to Colombo if no match found
    console.log(`Using default coordinates (Colombo) for ${hub.hubName || hub.name}`);
    return { lat: 6.9271, lng: 79.8612 };
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching hub data from backend...');

      // Fetch hubs from the backend API
      const response = await fetch('http://localhost:9090/api/hubs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const hubsData = await response.json();
      console.log('Fetched hubs:', hubsData);
      
      // Transform the backend data to match our component structure
      const transformedHubs = hubsData.map(hub => ({
        hubId: hub.hubId,
        hubName: hub.name,
        name: hub.name,
        address: hub.address,
        city: hub.city,
        status: 'operational', // Default status since not provided by backend
        phoneNumber: hub.phoneNumber || 'N/A',
        managerName: hub.hubManagerName || 'Not assigned',
        managerId: hub.hubManagerId,
        agentCount: hub.totalAgents || 0,
        activeAgents: hub.activeAgents || 0,
        totalDeliveries: hub.totalDeliveries || 0,
        activeDeliveries: Math.floor((hub.totalDeliveries || 0) * 0.3), // Estimate active deliveries
        completedToday: Math.floor((hub.totalDeliveries || 0) * 0.1), // Estimate today's completions
        todayDeliveries: Math.floor((hub.totalDeliveries || 0) * 0.1),
        numberOfRoutes: hub.numberOfRoutes || 0,
        createdAt: hub.createdAt
      }));

      setHubs(transformedHubs);
      
      // Calculate dashboard statistics
      calculateDashboardStats({ hubs: transformedHubs, agents: [], deliveries: [] });

    } catch (err) {
      console.error('Error loading hub data:', err);
      setError('Failed to load hub data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDeliverySchedules = async () => {
    try {
      // For now, show a placeholder until delivery API is implemented
      console.log('Delivery schedules will be loaded when delivery API is ready');
      setDeliveries([]);
    } catch (err) {
      console.error('Error loading delivery schedules:', err);
    }
  };

  const loadPerformanceData = async () => {
    try {
      // Generate mock performance data based on real hubs
      const allHubPerformance = hubs.map((hub) => ({
        hubId: hub.hubId,
        hubName: hub.hubName || hub.name,
        deliveriesThisWeek: Math.floor(Math.random() * 50) + 10,
        onTimeRate: Math.floor(Math.random() * 30) + 70,
        customerSatisfaction: (Math.random() * 2 + 3).toFixed(1),
        avgDeliveryTime: Math.floor(Math.random() * 10) + 2,
        efficiency: ['excellent', 'good', 'needs_improvement'][Math.floor(Math.random() * 3)]
      }));
      
      setHubPerformance(allHubPerformance);
    } catch (err) {
      console.error('Error loading performance data:', err);
    }
  };

  const calculateDashboardStats = (data) => {
    const stats = {
      activeHubs: data.hubs?.filter(hub => hub.status === 'operational' || hub.status === 'busy')?.length || 0,
      activeDeliveries: data.hubs?.reduce((total, hub) => total + (hub.activeDeliveries || 0), 0) || 0,
      totalAgents: data.hubs?.reduce((total, hub) => total + (hub.agentCount || 0), 0) || 0,
      completedToday: data.hubs?.reduce((total, hub) => total + (hub.completedToday || 0), 0) || 0
    };
    
    setDashboardStats(stats);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    if (activeTab === 'schedules') {
      await loadDeliverySchedules();
    } else if (activeTab === 'performance') {
      await loadPerformanceData();
    }
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'in_transit': 
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'scheduled':
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency) => {
    switch (efficiency?.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs_improvement': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(timeString).toLocaleString();
    } catch {
      return timeString || 'N/A';
    }
  };

  const filteredHubs = hubFilter === 'all' 
    ? hubs 
    : hubs.filter(hub => hub.status?.toLowerCase() === hubFilter);

  // Filtered and paginated hubs
  const { paginatedHubs, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * hubsPerPage;
    const endIndex = startIndex + hubsPerPage;
    const paginated = filteredHubs.slice(startIndex, endIndex);

    return {
      paginatedHubs: paginated,
      totalPages: Math.ceil(filteredHubs.length / hubsPerPage)
    };
  }, [filteredHubs, currentPage, hubsPerPage]);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading hubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAllData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {refreshing && (
          <div className="col-span-full bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <div className="flex items-center space-x-2 text-blue-700">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Refreshing hub data...</span>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Hubs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.activeHubs}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.activeDeliveries}</p>
            </div>
            <Truck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.totalAgents}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardStats.completedToday}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hub Locations - Sri Lanka</h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Navigation size={16} />
              <span>Optimize Routes</span>
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Maximize2 size={16} />
              <span>Full Screen</span>
            </button>
          </div>
        </div>

        <div className="relative w-full h-96 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          {!mapLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <div id="moderator-hub-map" className="w-full h-full"></div>
          )}

          {hubs.length === 0 && mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hubs to display</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex items-center justify-between px-6">
            
            {/* Left side: Tabs */}
            <div className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('hubs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hubs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivery Hubs
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedules'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivery Schedules
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance Reports
              </button>
            </div>

            {/* Right side: Buttons */}
            {/* <div className="flex space-x-2 py-4">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Map className="w-4 h-4" />
                <span>View Map</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div> */}

          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'hubs' && (
            <div>
              {/* Filter and Pagination Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select 
                    value={hubFilter}
                    onChange={(e) => setHubFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Hubs</option>
                    <option value="operational">Operational</option>
                    <option value="busy">Busy</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>

              {paginatedHubs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hubs found matching the selected filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {paginatedHubs.map((hub) => (
                    <div key={hub.hubId || hub.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{hub.hubName || hub.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{hub.address}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hub.status || 'operational')}`}>
                          {hub.status || 'operational'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Manager:</span>
                          <span className="font-medium">{hub.managerName || 'Not assigned'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">City:</span>
                          <span className="font-medium">{hub.city || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{hub.phoneNumber || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-gray-900">{hub.agentCount || 0}</p>
                          <p className="text-gray-600 text-sm">Agents</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">{hub.activeDeliveries || 0}</p>
                          <p className="text-gray-600 text-sm">Active</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">{hub.completedToday || 0}</p>
                          <p className="text-gray-600 text-sm">Today</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => {
                            console.log('View details for hub:', hub.hubId);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Contact manager for hub:', hub.hubId);
                          }}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Contact Manager
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-4">
              {deliveries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No delivery schedules found.</p>
                </div>
              ) : (
                deliveries.slice(0, 10).map((delivery) => (
                  <div key={delivery.deliveryId} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {delivery.itemDescription || `Delivery #${delivery.deliveryId}`}
                          </h3>
                          <span className="text-gray-600 text-sm">#{delivery.trackingNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                            {delivery.status?.replace('_', ' ') || 'Unknown'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          From: {delivery.senderName || 'N/A'} • To: {delivery.recipientName || 'N/A'} • 
                          Agent: {delivery.agentName || 'Not assigned'} • 
                          Hub: {delivery.hubName || 'N/A'}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Created: {formatTime(delivery.createdAt)}</span>
                          </div>
                          {delivery.estimatedDelivery && (
                            <>
                              <span>•</span>
                              <span>ETA: {formatTime(delivery.estimatedDelivery)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => {
                            console.log('Track delivery:', delivery.deliveryId);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Track
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Contact agent for delivery:', delivery.deliveryId);
                          }}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Contact Agent
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {hubPerformance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No performance data available.</p>
                  <button
                    onClick={loadPerformanceData}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Load Performance Data
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hub</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hubPerformance.map((hub) => (
                        <tr key={hub.hubId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{hub.hubName}</div>
                            <div className="text-sm text-gray-500">{hub.hubId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{hub.deliveriesThisWeek || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{hub.onTimeRate || 0}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{hub.customerSatisfaction || 0}</span>
                              <span className="text-yellow-400 ml-1">★</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{hub.avgDeliveryTime || 0}h</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getEfficiencyColor(hub.efficiency)}`}>
                              {hub.efficiency?.replace('_', ' ') || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hub;