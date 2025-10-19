import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search,
  MapPin,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Map,
  Navigation,
  Maximize2,
  X,
  Package,
  Route,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import { hubApi, agentApi, deliveryApi, transactionApi } from '../../services/deliveryService';

const Hubs = () => {
  const [totalHubs, setTotalHubs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHub, setSelectedHub] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignAgentModal, setShowAssignAgentModal] = useState(false);
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    todayDeliveries: 0,
    monthlyRevenue: 0,
    activeHubs: 0
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [hubsPerPage] = useState(6); // 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [hasMoreHubs, setHasMoreHubs] = useState(true);
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch hubs data
  useEffect(() => {
    fetchHubsData();
    loadGoogleMaps();
    fetchAvailableAgents();
  }, []);

  // Update map when hubs change
  useEffect(() => {
    if (mapLoaded && hubs.length > 0) {
      initializeHubMap();
    }
  }, [mapLoaded, hubs]);

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

  const fetchAvailableAgents = async () => {
    try {
      setLoadingAgents(true);

      // Fetch available agents
      const agents = await agentApi.getAvailableAgents();

      // Filter agents who are not assigned to any hub or are available for reassignment
      const unassignedAgents = Array.isArray(agents)
        ? agents.filter(agent => !agent.hubId || agent.availabilityStatus === 'AVAILABLE')
        : [];

      setAvailableAgents(unassignedAgents);

    } catch (error) {
      console.error('Error fetching available agents:', error);
      setAvailableAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  };

  const initializeHubMap = () => {
    const mapElement = document.getElementById('hub-map');
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

    hubs.forEach((hub, index) => {
      console.log(`Hub ${hub.name}:`, hub.coordinates);
      if (hub.coordinates && hub.coordinates.lat && hub.coordinates.lng) {
        addHubMarkerToMap(map, hub, bounds);
        validMarkers++;
      } else {
        console.warn(`Hub ${hub.name} has no valid coordinates:`, hub.coordinates);
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

    // Add legend
    addHubMapLegend(map);
  };

  const addHubMarkerToMap = (map, hub, bounds) => {
    const lat = parseFloat(hub.coordinates.lat);
    const lng = parseFloat(hub.coordinates.lng);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn(`Invalid coordinates for hub ${hub.name}:`, hub.coordinates);
      return;
    }

    const position = { lat, lng };

    // Use red markers for all hubs regardless of status
    const icon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new window.google.maps.Size(35, 35),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 35)
    };

    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: `${hub.name} - ${hub.status}`,
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
    console.log(`Added marker for ${hub.name} at ${lat}, ${lng}`);
  };

  const createHubInfoWindowContent = (hub) => {
    return `
      <div style="max-width: 300px; font-family: Arial, sans-serif;">
        <h4 style="margin: 0 0 8px 0; color: #1f2937;">${hub.name}</h4>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${hub.status}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${hub.location}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>City:</strong> ${hub.city}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Agents:</strong> ${hub.agents} (${hub.availableAgents} available)</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Manager:</strong> ${hub.hubManager || 'Not assigned'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Today's Deliveries:</strong> ${hub.todayDeliveries}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Revenue:</strong> Rs.${hub.monthlyRevenue.toLocaleString()}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Routes:</strong> ${hub.routes}</p>
      </div>
    `;
  };

  const addHubMapLegend = (map) => {
    // Legend implementation (currently commented out)
  };

  //  Updated fetchHubsData function - Load only 6 hubs initially
  const fetchHubsData = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching initial 6 hubs...');

      //  Always load only 6 hubs initially
      const initialLimit = 6;

      // Fetch hubs with limit and stats in parallel
      const [hubsResponse, hubStatsResponse] = await Promise.all([
        hubApi.getAllHubs(useCache, initialLimit).catch(err => {
          console.error('Failed to fetch hubs:', err);
          return [];
        }),
        hubApi.getHubStats(useCache).catch(err => {
          console.error('Failed to fetch hub stats:', err);
          return [];
        })
      ]);

      console.log(`Fetched ${hubsResponse.length} hubs initially`);

      // Rest of your existing processing logic...
      const allTransactions = await transactionApi.getAllTransactions(useCache).catch(err => {
        console.error('Failed to fetch transactions:', err);
        return [];
      });

      const processedHubs = await Promise.all(
        hubsResponse.map(hub => processHubWithRealDataAndDashboardRevenue(hub, allTransactions))
      );

      const calculatedStats = calculateStatsFromHubsWithDashboardRevenue(hubStatsResponse, processedHubs, allTransactions);

      setHubs(processedHubs);
      setTotalHubs(processedHubs.length);
      setStats(calculatedStats);
      
      //  Set hasMoreHubs based on response length
      setHasMoreHubs(hubsResponse.length === initialLimit);
      
      //  Reset current page to 1
      setCurrentPage(1);

      console.log('Hubs data loaded successfully');

    } catch (err) {
      console.error('Error fetching hubs data:', err);
      setError('Failed to load hubs data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Updated loadMoreHubs function
  const loadMoreHubs = async () => {
    if (loadingMore || !hasMoreHubs) return;
    
    try {
      setLoadingMore(true);

      // Calculate next limit
      const nextLimit = (currentPage + 1) * hubsPerPage;
      console.log(`Loading more hubs, new limit: ${nextLimit}`);

      // Fetch next batch of hubs
      const hubsResponse = await hubApi.getAllHubs(true, nextLimit);

      if (hubsResponse.length <= hubs.length) {
        // No more hubs available
        setHasMoreHubs(false);
        return;
      }

      const allTransactions = await transactionApi.getAllTransactions(true);
      const processedHubs = await Promise.all(
        hubsResponse.map(hub => processHubWithRealDataAndDashboardRevenue(hub, allTransactions))
      );

      setHubs(processedHubs);
      setCurrentPage(prev => prev + 1);
      setTotalHubs(processedHubs.length);
      
      // Check if we have more hubs
      setHasMoreHubs(hubsResponse.length === nextLimit);

      console.log(`Loaded ${processedHubs.length} total hubs`);

    } catch (err) {
      console.error('Error loading more hubs:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const processHubWithRealDataAndDashboardRevenue = async (hub, allTransactions) => {
    try {
      // Get real agent and delivery data for each hub
      const [agents, deliveries] = await Promise.all([
        hubApi.getHubAgents(hub.hubId).catch(() => []),
        hubApi.getHubDeliveries(hub.hubId).catch(() => [])
      ]);

      const totalAgents = agents.length;
      const availableAgents = agents.filter(agent =>
        agent.availabilityStatus === 'AVAILABLE'
      ).length;

      // Count today's deliveries
      const today = new Date();
      const todayDeliveries = deliveries.filter(delivery => {
        const deliveryDate = new Date(delivery.createdAt);
        return deliveryDate.toDateString() === today.toDateString();
      }).length;

      // Calculate revenue using fixed function
      const monthlyRevenue = calculateHubRevenueFixed(
        hub.hubId,
        hub.name,
        deliveries,
        allTransactions
      );

      // Generate coordinates if missing
      const coordinates = getHubCoordinates(hub);

      return {
        id: hub.hubId,
        name: hub.name || `Hub ${hub.hubId}`,
        location: hub.address || 'Unknown Location',
        coordinates,
        hubManager: hub.hubManagerName || null,
        hubManagerId: hub.hubManagerId || null,
        agents: totalAgents,
        availableAgents,
        status: determineHubStatus(hub, totalAgents, todayDeliveries),
        todayDeliveries,
        monthlyRevenue,
        routes: hub.numberOfRoutes || 0,
        city: hub.city || 'Unknown City',
        phoneNumber: hub.phoneNumber || 'N/A',
        email: hub.email || 'N/A',
        description: hub.description || `${hub.name || 'This hub'} serves the local community with efficient delivery services.`,
        establishedYear: hub.establishedYear || '2020',
        maxCapacity: hub.maxCapacity || 50,
        isNearCapacity: totalAgents > 40,
        efficiencyScore: totalAgents > 0 ? Math.floor((todayDeliveries / totalAgents) * 10) + 70 : 70,
        lastUpdated: new Date().toISOString(),
        createdAt: hub.createdAt
      };
    } catch (error) {
      console.error(`Error processing hub ${hub.hubId}:`, error);
      return {
        id: hub.hubId,
        name: hub.name || `Hub ${hub.hubId}`,
        location: hub.address || 'Unknown Location',
        city: hub.city || 'Unknown City',
        coordinates: getHubCoordinates(hub),
        hubManager: hub.hubManagerName || null,
        hubManagerId: hub.hubManagerId || null,
        agents: 0,
        availableAgents: 0,
        status: 'Unknown',
        todayDeliveries: 0,
        monthlyRevenue: 0,
        routes: 0,
        phoneNumber: 'N/A',
        email: 'N/A',
        description: 'Hub data unavailable',
        efficiencyScore: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  };

  // Fixed revenue calculation function - using Object instead of Map
  const calculateHubRevenueFixed = (hubId, hubName, hubDeliveries, allTransactions) => {
    try {
      console.log(`Calculating revenue for hub ${hubName}...`);

      // Use Object instead of Map to avoid naming conflicts with Google Maps
      const transactionMap = {};
      allTransactions.forEach(transaction => {
        transactionMap[transaction.transactionId] = transaction;
      });

      let revenue = 0;

      // Method 1: Calculate revenue from deliveries with transactions
      hubDeliveries.forEach(delivery => {
        if (delivery.transactionId) {
          const transaction = transactionMap[delivery.transactionId];
          if (transaction && (transaction.paymentStatus === 'COMPLETED' || transaction.paymentStatus === 'PAID')) {
            const amount = parseFloat(transaction.paymentAmount || 0);
            if (!isNaN(amount)) {
              revenue += amount;
            }
          }
        }
      });

      // Method 2: Direct hub transaction matching
      allTransactions.forEach(transaction => {
        if ((transaction.hubId === hubId || transaction.hubName === hubName) &&
          (transaction.paymentStatus === 'COMPLETED' || transaction.paymentStatus === 'PAID')) {

          const amount = parseFloat(transaction.paymentAmount || 0);
          if (!isNaN(amount)) {
            // Only add if not already counted through delivery
            const alreadyCounted = hubDeliveries.some(d => d.transactionId === transaction.transactionId);
            if (!alreadyCounted) {
              revenue += amount;
            }
          }
        }
      });

      console.log(`Hub ${hubName} revenue calculated: Rs.${revenue}`);
      return revenue;

    } catch (error) {
      console.error(`Error calculating revenue for hub ${hubName}:`, error);
      return 0;
    }
  };

  // Function to get or generate coordinates for hubs
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
    const hubName = hub.name || '';

    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (city.toLowerCase().includes(cityName.toLowerCase()) ||
        hubName.toLowerCase().includes(cityName.toLowerCase())) {
        console.log(`Using generated coordinates for ${hub.name}: ${cityName}`);
        return coords;
      }
    }

    // Default to Colombo if no match found
    console.log(`Using default coordinates (Colombo) for ${hub.name}`);
    return { lat: 6.9271, lng: 79.8612 };
  };

  const calculateStatsFromHubsWithDashboardRevenue = (hubStatsResponse, processedHubs, allTransactions) => {
    try {
      // Calculate total revenue using Dashboard's approach
      const totalRevenue = allTransactions
        .filter(t => t.paymentStatus === 'COMPLETED' || t.paymentStatus === 'PAID')
        .reduce((total, transaction) => {
          const amount = parseFloat(transaction.paymentAmount || 0);
          return total + (isNaN(amount) ? 0 : amount);
        }, 0);

      // Use hub stats if available, otherwise calculate from processed hubs
      if (Array.isArray(hubStatsResponse) && hubStatsResponse.length > 0) {
        const totalRoutes = hubStatsResponse.reduce((sum, hub) => sum + (hub.totalRoutes || 0), 0);
        const todayDeliveries = hubStatsResponse.reduce((sum, hub) => sum + (hub.todayDeliveries || 0), 0);
        const activeHubs = hubStatsResponse.filter(hub => (hub.totalAgents || 0) > 0).length;

        return {
          totalRoutes: totalRoutes || processedHubs.reduce((sum, hub) => sum + hub.routes, 0),
          todayDeliveries: todayDeliveries || processedHubs.reduce((sum, hub) => sum + hub.todayDeliveries, 0),
          monthlyRevenue: totalRevenue,
          activeHubs: activeHubs || processedHubs.filter(hub => hub.agents > 0).length
        };
      }

      // Fallback to processed hubs data
      return {
        totalRoutes: processedHubs.reduce((sum, hub) => sum + hub.routes, 0),
        todayDeliveries: processedHubs.reduce((sum, hub) => sum + hub.todayDeliveries, 0),
        monthlyRevenue: totalRevenue,
        activeHubs: processedHubs.filter(hub => hub.agents > 0).length
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalRoutes: 0,
        todayDeliveries: 0,
        monthlyRevenue: 0,
        activeHubs: 0
      };
    }
  };

  const determineHubStatus = (hub, agents, todayDeliveries) => {
    if (!hub.hubManagerName) return 'Needs Hub Manager';
    if (agents === 0) return 'No Agents';
    if (agents > 40) return 'Near Capacity';
    if (todayDeliveries < 5) return 'Low Activity';
    return 'Operational';
  };

  // Hub management functions
  const updateHub = async (hubId, updateData) => {
    try {
      await hubApi.updateHub(hubId, updateData);

      // Update local state
      setHubs(prevHubs =>
        prevHubs.map(hub =>
          hub.id === hubId
            ? { ...hub, ...updateData, lastUpdated: new Date().toISOString() }
            : hub
        )
      );

      alert('Hub updated successfully!');
    } catch (err) {
      console.error('Error updating hub:', err);
      alert('Failed to update hub: ' + err.message);
    }
  };

  const assignManager = async (hubId, managerData) => {
    try {
      await hubApi.assignManager(hubId, managerData.userId);

      // Update local state
      setHubs(prevHubs =>
        prevHubs.map(hub =>
          hub.id === hubId
            ? { ...hub, hubManager: managerData.name, hubManagerId: managerData.userId, status: 'Operational' }
            : hub
        )
      );

      alert('Hub manager assigned successfully!');
    } catch (err) {
      console.error('Error assigning hub manager:', err);
      alert('Failed to assign hub manager: ' + err.message);
    }
  };

  const assignAgent = async (hubId, agentData) => {
    try {
      // Create agent with hub assignment
      await agentApi.createAgent({
        userId: agentData.userId,
        name: agentData.name,
        email: agentData.email,
        phoneNumber: agentData.phoneNumber,
        hubId: hubId,
        availabilityStatus: 'AVAILABLE'
      });

      // Refresh data to show updated agent count
      await fetchHubsData(false);
      await fetchAvailableAgents();

      alert('Agent assigned to hub successfully!');
    } catch (err) {
      console.error('Error assigning agent to hub:', err);
      alert('Failed to assign agent to hub: ' + err.message);
    }
  };

  const refreshData = async () => {
    await fetchHubsData(false);
    await fetchAvailableAgents();
  };

  // Utility functions
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Operational':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Near Capacity':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'Low Activity':
        return <AlertCircle className="text-orange-400" size={20} />;
      case 'Needs Hub Manager':
      case 'No Agents':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-600 text-white';
      case 'Near Capacity':
        return 'bg-yellow-400 text-white';
      case 'Low Activity':
        return 'bg-orange-400 text-white';
      case 'Needs Hub Manager':
      case 'No Agents':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  //  Updated filtered hubs - No pagination, just search filtering
  const filteredHubs = useMemo(() => {
    return hubs.filter(hub =>
      hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hubs, searchTerm]);

  // Dropdown component
  const Dropdown = ({ hubId, isOpen, onToggle, onAssignManager, onAssignAgent }) => (
    <div className="relative">
      <button
        onClick={() => onToggle(hubId)}
        className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={onAssignManager}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Assign Manager
            </button>
            <button
              onClick={onAssignAgent}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Assign Agent
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Modal components (keeping your existing ones...)
  const ManageModal = ({ hub, onClose }) => {
    const [formData, setFormData] = useState({
      name: hub?.name || '',
      location: hub?.location || '',
      city: hub?.city || '',
      phoneNumber: hub?.phoneNumber || '',
      email: hub?.email || '',
      description: hub?.description || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        await updateHub(hub.id, {
          name: formData.name,
          address: formData.location,
          city: formData.city,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          description: formData.description
        });
        onClose();
      } catch (err) {
        console.error('Error saving hub:', err);
      } finally {
        setSaving(false);
      }
    };

    if (!hub) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Manage {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={saving}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Hub Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Hub Manager Assignment Modal - Using User ID Input
  const AssignHubManagerModal = ({ hub, onClose }) => {
    const [formData, setFormData] = useState({
      userId: '',
      name: '',
      email: ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.userId) {
        alert('Please enter a user ID');
        return;
      }

      setSaving(true);

      try {
        await assignManager(hub.id, {
          userId: parseInt(formData.userId),
          name: formData.name,
          email: formData.email
        });
        onClose();
      } catch (err) {
        console.error('Error assigning manager:', err);
        alert('Failed to assign hub manager: ' + err.message);
      } finally {
        setSaving(false);
      }
    };

    if (!hub) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Assign Hub Manager for {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={saving}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <input
                type="number"
                placeholder="Enter user ID"
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Manager Name (Optional)</label>
              <input
                type="text"
                placeholder="Enter manager name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Email (Optional)</label>
              <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Enter the User ID of the person you want to assign as hub manager.
                The name and email fields are optional and will be used for display purposes.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                disabled={saving || !formData.userId}
              >
                {saving ? 'Assigning...' : 'Assign Manager'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Agent Assignment Modal - Using Dropdown
  const AssignAgentModal = ({ hub, onClose }) => {
    const [selectedAgent, setSelectedAgent] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedAgent) {
        alert('Please select an agent');
        return;
      }

      setSaving(true);

      try {
        const agent = availableAgents.find(a =>
          a.agentId?.toString() === selectedAgent || a.userId?.toString() === selectedAgent
        );

        if (!agent) {
          throw new Error('Selected agent not found');
        }

        await assignAgent(hub.id, {
          userId: agent.userId || agent.agentId,
          name: agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim(),
          email: agent.email,
          phoneNumber: agent.phoneNumber || agent.phone
        });
        onClose();
      } catch (err) {
        console.error('Error assigning agent:', err);
        alert('Failed to assign agent: ' + err.message);
      } finally {
        setSaving(false);
      }
    };

    if (!hub) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Assign Agent to {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={saving}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Select Agent</label>
              {loadingAgents ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading available agents...</p>
                </div>
              ) : availableAgents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No available agents found</p>
                  <p className="text-xs text-gray-400 mt-1">Create agents first or ensure agents are marked as available</p>
                </div>
              ) : (
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  disabled={saving}
                  required
                >
                  <option value="">Select an agent...</option>
                  {availableAgents.map((agent) => (
                    <option key={agent.agentId || agent.userId} value={agent.agentId || agent.userId}>
                      {agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || `Agent ${agent.agentId || agent.userId}`}
                      {agent.email && ` (${agent.email})`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedAgent && (
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 mb-2">Selected Agent Details:</h4>
                {(() => {
                  const agent = availableAgents.find(a =>
                    a.agentId?.toString() === selectedAgent || a.userId?.toString() === selectedAgent
                  );
                  return agent ? (
                    <div className="text-sm text-green-800 space-y-1">
                      <p><strong>Name:</strong> {agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'N/A'}</p>
                      <p><strong>Email:</strong> {agent.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {agent.phoneNumber || agent.phone || 'N/A'}</p>
                      <p><strong>Status:</strong> {agent.availabilityStatus || 'Available'}</p>
                      <p><strong>Agent ID:</strong> {agent.agentId || agent.userId}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={saving || !selectedAgent}
              >
                {saving ? 'Assigning...' : 'Assign Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={refreshData}
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
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Routes</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{stats.totalRoutes}</p>
            </div>
            <Route className="text-yellow-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Deliveries</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{stats.todayDeliveries}</p>
            </div>
            <Package className="text-blue-800" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">Rs.{stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Hubs</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{stats.activeHubs}</p>
            </div>
            <MapPin className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 font-heading">Hub Locations - Sri Lanka</h3>
          <div className="flex space-x-2">
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
            <div id="hub-map" className="w-full h-full"></div>
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

      {/*  Updated Search Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search hubs by name, location, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
        </div>

        {/*  Results counter */}
        <div className="text-sm text-gray-600">
          Showing {filteredHubs.length} of {totalHubs} hubs
        </div>
      </div>

      {/*  Hubs Grid - Now shows filtered hubs without pagination */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => (
          <div key={hub.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Hub Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 font-heading">{hub.name}</h3>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <span>{hub.location}, {hub.city}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Dropdown
                  hubId={hub.id}
                  isOpen={openDropdown === hub.id}
                  onToggle={(hubId) => setOpenDropdown(openDropdown === hubId ? null : hubId)}
                  onAssignManager={() => {
                    setSelectedHub(hub);
                    setShowAssignModal(true);
                    setOpenDropdown(null);
                  }}
                  onAssignAgent={() => {
                    setSelectedHub(hub);
                    setShowAssignAgentModal(true);
                    setOpenDropdown(null);
                  }}
                />
              </div>
            </div>

            {/* Hub Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="text-blue-600" size={16} />
                  <span className="text-sm font-medium">Agents</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{hub.agents}</p>
                <p className="text-xs text-gray-500">{hub.availableAgents} available</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Package className="text-green-600" size={16} />
                  <span className="text-sm font-medium">Today</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{hub.todayDeliveries}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="text-green-600" size={16} />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <p className="text-lg font-bold text-slate-900">Rs.{hub.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Dashboard Config</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Route className="text-blue-600" size={16} />
                  <span className="text-sm font-medium">Routes</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{hub.routes}</p>
              </div>
            </div>

            {/* Hub Manager Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1">Hub Manager</p>
              {hub.hubManager ? (
                <p className="text-sm text-gray-600">{hub.hubManager}</p>
              ) : (
                <p className="text-sm text-red-600">No hub manager assigned</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                className="flex-1 bg-blue-900 text-white py-2 px-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-1"
                onClick={() => {
                  setSelectedHub(hub);
                  setShowManageModal(true);
                }}
              >
                <Settings size={16} />
                <span className="text-sm">Manage</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*  Load More Button */}
      {hasMoreHubs && !searchTerm && (
        <div className="flex justify-center">
          <button
            onClick={loadMoreHubs}
            disabled={loadingMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <ChevronDown size={20} />
                <span>Load More Hubs</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* No Results State */}
      {filteredHubs.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">
            {searchTerm ? 'No hubs found matching your search' : 'No hubs available'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showManageModal && (
        <ManageModal hub={selectedHub} onClose={() => setShowManageModal(false)} />
      )}
      {showAssignModal && (
        <AssignHubManagerModal hub={selectedHub} onClose={() => setShowAssignModal(false)} />
      )}
      {showAssignAgentModal && (
        <AssignAgentModal hub={selectedHub} onClose={() => setShowAssignAgentModal(false)} />
      )}
    </div>
  );
};

export default Hubs;