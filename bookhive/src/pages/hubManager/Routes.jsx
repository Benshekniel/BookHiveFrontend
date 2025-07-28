import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  RefreshCw,
  X,
  Map,
  Navigation,
  MessageCircle,
  Maximize2
} from 'lucide-react';
import { routeApi, agentApi, routeAssignmentApi, routeHelpers } from '../../services/deliveryService';

const Routes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hubId] = useState(1); // Hardcoded; consider making dynamic
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const mapRef = useRef(null);
  const fullscreenMapRef = useRef(null);
  const detailsMapRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(!!window.google);

  useEffect(() => {
    // Preload Google Maps API and fetch routes data
    const loadGoogleMapsAndData = async () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_N6VhUsq0bX8FEDfanh3Af-I1Bx5caFU&libraries=drawing,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setIsGoogleMapsLoaded(true);
        };
        script.onerror = () => {
          setError('Failed to load Google Maps API');
          setLoading(false);
        };
        document.head.appendChild(script);
      } else {
        setIsGoogleMapsLoaded(true);
      }

      await fetchRoutesData();
    };

    loadGoogleMapsAndData();
  }, [hubId]);

  const handleLoadGoogleMaps = (callback) => {
    if (window.google) {
      callback();
      return;
    }
    // If Google Maps is already loading, wait for it to complete
    if (!isGoogleMapsLoaded) {
      const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (script) {
        script.addEventListener('load', callback);
      } else {
        const newScript = document.createElement('script');
        newScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_N6VhUsq0bX8FEDfanh3Af-I1Bx5caFU&libraries=drawing,geometry`;
        newScript.async = true;
        newScript.defer = true;
        newScript.onload = () => {
          setIsGoogleMapsLoaded(true);
          callback();
        };
        newScript.onerror = () => {
          setError('Failed to load Google Maps API');
        };
        document.head.appendChild(newScript);
      }
    }
  };

  const initializeMap = (mapContainer, routes, selectedRoute = null) => {
    if (!window.google || !mapContainer) return null;

    const colomboCenter = { lat: 6.9271, lng: 79.8612 };

    const map = new window.google.maps.Map(mapContainer, {
      zoom: selectedRoute ? 14 : 12,
      center: selectedRoute ? selectedRoute.coordinates : colomboCenter,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    routes.forEach((route) => {
      const routeBounds = route.boundaryCoordinates
        ? routeHelpers.parseJsonField(route.boundaryCoordinates)
        : generateRouteBounds(route.coordinates, 0.01);

      const routePolygon = new window.google.maps.Polygon({
        paths: routeBounds,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3B82F6',
        fillOpacity: 0.15,
        map: map
      });

      const marker = new window.google.maps.Marker({
        position: route.coordinates,
        map: map,
        title: route.name,
        label: {
          text: route.id.toString(),
          color: 'white',
          fontWeight: 'bold'
        },
        icon: {
          url: 'data:image/svg+xml,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#EF4444" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${route.id}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      marker.addListener('click', () => {
        setSelectedRoute(route);
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937;">${route.name}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${route.description}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
              <div><strong>Coverage:</strong> ${route.coverageArea || 'N/A'}</div>
              <div><strong>Deliveries:</strong> ${route.maxDailyDeliveries || 0}/day</div>
              <div><strong>Riders:</strong> ${route.assignedRiders || 0}/${route.totalRiders || 0}</div>
              <div><strong>Avg. Time:</strong> ${route.estimatedDeliveryTime || 'N/A'} min</div>
            </div>
          </div>
        `
      });

      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });

      if (selectedRoute && selectedRoute.id === route.id) {
        routePolygon.setOptions({
          strokeColor: '#EF4444',
          strokeWeight: 3,
          fillOpacity: 0.25
        });
      }
    });

    return map;
  };

  const generateRouteBounds = (center, radius) => {
    const bounds = [];
    const numPoints = 8;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const lat = center.lat + (radius * Math.cos(angle));
      const lng = center.lng + (radius * Math.sin(angle));
      bounds.push({ lat, lng });
    }

    return bounds;
  };

  const fetchRoutesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const routesResponse = await routeApi.getRoutesByHub(hubId);
      const formattedRoutes = await Promise.all(routesResponse.map(async (route) => {
        const agentsResponse = await routeApi.getRouteAgents(route.routeId);
        const formattedAgents = agentsResponse.map(agent => {
          const [firstName, ...lastNameParts] = agent.agentName.split(' ');
          const lastName = lastNameParts.join(' ');
          
          return {
            id: agent.agentId,
            firstName: firstName || '',
            lastName: lastName || '',
            availabilityStatus: agent.agentAvailabilityStatus || 'UNKNOWN',
            vehicleType: agent.agentVehicleType,
            vehicleNumber: agent.agentVehicleNumber
          };
        });

        return {
          id: route.routeId,
          name: route.name,
          description: route.description || 'No description available',
          coordinates: {
            lat: route.centerLatitude || 6.9271,
            lng: route.centerLongitude || 79.8612
          },
          postalCodes: routeHelpers.parsePostalCodes(route.postalCodes),
          neighborhoods: routeHelpers.parseJsonField(route.neighborhoods),
          landmarks: routeHelpers.parseJsonField(route.landmarks),
          boundaryCoordinates: routeHelpers.parseJsonField(route.boundaryCoordinates),
          routeType: route.routeType || 'RESIDENTIAL',
          trafficPattern: route.trafficPattern || 'MODERATE',
          status: route.status?.toLowerCase() || 'active',
          coverageArea: route.coverageArea || '0 km²',
          estimatedDeliveryTime: route.estimatedDeliveryTime || 30,
          maxDailyDeliveries: route.maxDailyDeliveries || 0,
          priorityLevel: route.priorityLevel || 3,
          assignedRiders: formattedAgents.length,
          totalRiders: formattedAgents.length,
          performance: {
            trend: Math.random() > 0.5 ? 'up' : 'down',
            change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 10).toFixed(1)}%`
          },
          agents: formattedAgents
        };
      }));

      const agentsResponse = await agentApi.getAgentsByHub(hubId);
      const formattedAllAgents = agentsResponse.map(agent => {
        const [firstName, ...lastNameParts] = agent.name.split(' ');
        const lastName = lastNameParts.join(' ');
        return {
          id: agent.agentId,
          firstName: firstName || '',
          lastName: lastName || '',
          availabilityStatus: agent.availabilityStatus || 'UNKNOWN',
          vehicleType: agent.vehicleType,
          vehicleNumber: agent.vehicleNumber
        };
      });

      setRoutes(formattedRoutes);
      setAgents(formattedAllAgents);
    } catch (err) {
      console.error('Error fetching routes data:', err);
      setError('Failed to load routes data');
    } finally {
      setLoading(false);
    }
  };

  const assignRider = async (routeId, agentId) => {
    try {
      await routeAssignmentApi.assignAgentToRoute(routeId, agentId);
      const updatedAgents = await routeApi.getRouteAgents(routeId);
      const formattedUpdatedAgents = updatedAgents.map(agent => {
        const [firstName, ...lastNameParts] = agent.agentName.split(' ');
        const lastName = lastNameParts.join(' ');
        return {
          id: agent.agentId,
          firstName: firstName || '',
          lastName: lastName || '',
          availabilityStatus: agent.agentAvailabilityStatus || 'UNKNOWN',
          vehicleType: agent.agentVehicleType,
          vehicleNumber: agent.agentVehicleNumber
        };
      });

      setRoutes(prevRoutes =>
        prevRoutes.map(route =>
          route.id === routeId ? { ...route, agents: formattedUpdatedAgents, assignedRiders: formattedUpdatedAgents.length } : route
        )
      );
      alert('Rider assigned successfully!');
    } catch (err) {
      console.error('Error assigning rider:', err);
      alert('Failed to assign rider');
    }
  };

  const deleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      await routeApi.deleteRoute(routeId);
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
      if (selectedRoute && selectedRoute.id === routeId) {
        setSelectedRoute(null);
      }
    } catch (err) {
      console.error('Error deleting route:', err);
      alert('Failed to delete route');
    }
  };

  const AddRouteModal = () => {
    const [routeData, setRouteData] = useState({
      name: '',
      description: '',
      postalCodes: '',
      coordinates: { lat: 6.9271, lng: 79.8612 },
      routeType: 'RESIDENTIAL',
      trafficPattern: 'MODERATE',
      coverageArea: '',
      estimatedDeliveryTime: 30,
      maxDailyDeliveries: 50,
      priorityLevel: 3,
      neighborhoods: [],
      landmarks: [],
      boundaryCoordinates: []
    });
    const [validationErrors, setValidationErrors] = useState([]);
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setCreating(true);

      try {
        const validation = routeHelpers.validateRouteData({
          ...routeData,
          hubId,
          centerLatitude: routeData.coordinates.lat,
          centerLongitude: routeData.coordinates.lng
        });

        if (!validation.isValid) {
          setValidationErrors(validation.errors);
          setCreating(false);
          return;
        }

        const apiRouteData = {
          name: routeData.name,
          description: routeData.description,
          hubId,
          centerLatitude: routeData.coordinates.lat,
          centerLongitude: routeData.coordinates.lng,
          postalCodes: routeData.postalCodes,
          neighborhoods: routeData.neighborhoods,
          landmarks: routeData.landmarks,
          boundaryCoordinates: routeData.boundaryCoordinates,
          routeType: routeData.routeType,
          trafficPattern: routeData.trafficPattern,
          coverageArea: routeData.coverageArea,
          estimatedDeliveryTime: routeData.estimatedDeliveryTime,
          maxDailyDeliveries: routeData.maxDailyDeliveries,
          priorityLevel: routeData.priorityLevel
        };

        const createdRoute = await routeApi.createRoute(apiRouteData);
        const formattedRoute = {
          id: createdRoute.routeId,
          name: createdRoute.name,
          description: createdRoute.description || 'No description available',
          coordinates: {
            lat: createdRoute.centerLatitude || 6.9271,
            lng: createdRoute.centerLongitude || 79.8612
          },
          postalCodes: routeHelpers.parsePostalCodes(createdRoute.postalCodes),
          neighborhoods: routeHelpers.parseJsonField(createdRoute.neighborhoods),
          landmarks: routeHelpers.parseJsonField(createdRoute.landmarks),
          boundaryCoordinates: routeHelpers.parseJsonField(createdRoute.boundaryCoordinates),
          routeType: createdRoute.routeType || 'RESIDENTIAL',
          trafficPattern: createdRoute.trafficPattern || 'MODERATE',
          status: createdRoute.status?.toLowerCase() || 'active',
          coverageArea: createdRoute.coverageArea || '0 km²',
          estimatedDeliveryTime: createdRoute.estimatedDeliveryTime || 30,
          maxDailyDeliveries: createdRoute.maxDailyDeliveries || 0,
          priorityLevel: createdRoute.priorityLevel || 3,
          assignedRiders: 0,
          totalRiders: 0,
          performance: { trend: 'up', change: '+0.0%' },
          agents: []
        };

        setRoutes(prev => [...prev, formattedRoute]);
        setShowAddRoute(false);
        setRouteData({
          name: '',
          description: '',
          postalCodes: '',
          coordinates: { lat: 6.9271, lng: 79.8612 },
          routeType: 'RESIDENTIAL',
          trafficPattern: 'MODERATE',
          coverageArea: '',
          estimatedDeliveryTime: 30,
          maxDailyDeliveries: 50,
          priorityLevel: 3,
          neighborhoods: [],
          landmarks: [],
          boundaryCoordinates: []
        });
        setValidationErrors([]);
        alert('Route created successfully!');
      } catch (err) {
        console.error('Error creating route:', err);
        setValidationErrors(['Failed to create route: ' + err.message]);
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Route</h2>
              <button
                onClick={() => {
                  setShowAddRoute(false);
                  setValidationErrors([]);
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={creating}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {validationErrors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <ul className="text-red-600 text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="mb-1">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Name *
                </label>
                <input
                  type="text"
                  required
                  value={routeData.name}
                  onChange={(e) => setRouteData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Colombo 07 - Cinnamon Gardens"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Type
                </label>
                <select
                  value={routeData.routeType}
                  onChange={(e) => setRouteData(prev => ({ ...prev, routeType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                >
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="MIXED">Mixed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={routeData.description}
                onChange={(e) => setRouteData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the route coverage area..."
                disabled={creating}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Area (km²)
                </label>
                <input
                  type="text"
                  value={routeData.coverageArea}
                  onChange={(e) => setRouteData(prev => ({ ...prev, coverageArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2.5 km²"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Codes (comma-separated)
                </label>
                <input
                  type="text"
                  value={routeData.postalCodes}
                  onChange={(e) => setRouteData(prev => ({ ...prev, postalCodes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 00700, 00701, 00702"
                  disabled={creating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={routeData.coordinates.lat}
                  onChange={(e) => setRouteData(prev => ({
                    ...prev,
                    coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={routeData.coordinates.lng}
                  onChange={(e) => setRouteData(prev => ({
                    ...prev,
                    coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traffic Pattern
                </label>
                <select
                  value={routeData.trafficPattern}
                  onChange={(e) => setRouteData(prev => ({ ...prev, trafficPattern: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                >
                  <option value="LOW">Low Traffic</option>
                  <option value="MODERATE">Moderate Traffic</option>
                  <option value="HIGH">High Traffic</option>
                  <option value="VARIABLE">Variable Traffic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Est. Delivery Time (min)
                </label>
                <input
                  type="number"
                  min="1"
                  value={routeData.estimatedDeliveryTime}
                  onChange={(e) => setRouteData(prev => ({ ...prev, estimatedDeliveryTime: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Daily Deliveries
                </label>
                <input
                  type="number"
                  min="1"
                  value={routeData.maxDailyDeliveries}
                  onChange={(e) => setRouteData(prev => ({ ...prev, maxDailyDeliveries: parseInt(e.target.value) || 50 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={creating}
                />
              </div>
            </div>

            {/* <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Map className="w-4 h-4 mr-2" />
                Google Maps Integration
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Use Google Maps to pinpoint route boundaries and coordinates.
              </p>
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
                onClick={() => alert('Google Maps integration would open here')}
                disabled={creating}
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps</span>
              </button>
            </div> */}

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowAddRoute(false);
                  setValidationErrors([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Route'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RouteDetailsModal = () => {
    if (!selectedRoute) return null;

    useEffect(() => {
      if (isGoogleMapsLoaded && detailsMapRef.current) {
        initializeMap(detailsMapRef.current, [selectedRoute], selectedRoute);
      }
    }, [isGoogleMapsLoaded, selectedRoute]);

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{selectedRoute.name}</h2>
              <button
                onClick={() => setSelectedRoute(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Route Map</h3>
                <button
                  onClick={() => {
                    setShowFullscreenMap(true);
                    handleLoadGoogleMaps(() => initializeMap(fullscreenMapRef.current, routes, selectedRoute));
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Fullscreen</span>
                </button>
              </div>

              <div
                ref={detailsMapRef}
                className="w-full h-80 rounded-lg border-2 border-gray-200"
                style={{ minHeight: '320px' }}
              />
              {!isGoogleMapsLoaded && (
                <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading Google Maps...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Route Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-600 mt-1">{selectedRoute.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Coverage Area</label>
                        <p className="text-gray-600 mt-1">{selectedRoute.coverageArea}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Route Type</label>
                        <p className="text-gray-600 mt-1">{selectedRoute.routeType}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Traffic Pattern</label>
                        <p className="text-gray-600 mt-1">{selectedRoute.trafficPattern}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Daily Deliveries</label>
                        <p className="text-gray-600 mt-1">{selectedRoute.maxDailyDeliveries}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Postal Codes</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRoute.postalCodes?.map((code, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Neighborhoods</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRoute.neighborhoods?.map((neighborhood, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {neighborhood}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Landmarks</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRoute.landmarks?.map((landmark, index) => (
                          <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            {landmark}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Assigned Agents ({selectedRoute.agents?.length || 0})
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">Available</span>
                      </div>
                      <p className="text-2xl font-semibold text-green-900 mt-1">
                        {selectedRoute.agents?.filter(agent => agent.availabilityStatus === 'AVAILABLE').length || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-700">Busy</span>
                      </div>
                      <p className="text-2xl font-semibold text-yellow-900 mt-1">
                        {selectedRoute.agents?.filter(agent => agent.availabilityStatus === 'BUSY').length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedRoute.agents?.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.firstName} {agent.lastName}</p>
                            <p className="text-sm text-gray-500">Agent ID: {agent.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${agent.availabilityStatus === 'AVAILABLE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {agent.availabilityStatus}
                          </span>
                          <button className="text-blue-400 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => console.log('Send message to agent:', agent.id)}
                            className="text-green-400 hover:text-green-600"
                            title="Send Message"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {(!selectedRoute.agents || selectedRoute.agents.length === 0) && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No agents assigned to this route</p>
                        <button
                          onClick={() => console.log('Open agent assignment')}
                          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Assign Agents
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedRoute(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => console.log('Edit route:', selectedRoute.id)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Route</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OverallMapView = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
          Colombo Hub - Routes Overview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowRouteMap(!showRouteMap);
              if (!showRouteMap) {
                handleLoadGoogleMaps(() => {
                  if (mapRef.current) {
                    initializeMap(mapRef.current, routes);
                  }
                });
              }
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
          >
            <Map className="w-3 h-3" />
            <span>{showRouteMap ? 'Hide Map' : 'Show Map'}</span>
          </button>
          {showRouteMap && (
            <button
              onClick={() => {
                setShowFullscreenMap(true);
                handleLoadGoogleMaps(() => {
                  if (fullscreenMapRef.current) {
                    initializeMap(fullscreenMapRef.current, routes, selectedRoute);
                  }
                });
              }}
              className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1 text-sm"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      {showRouteMap && (
        <div className="relative bg-white rounded-lg h-96 mb-4 overflow-hidden border-2 border-gray-200">
          <div ref={mapRef} className="w-full h-full" />
          {!isGoogleMapsLoaded && (
            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Google Maps...</p>
                <p className="text-gray-500 text-sm mt-2">Displaying route overview for Colombo Hub</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (isGoogleMapsLoaded && routes.length > 0) {
      if (showRouteMap && mapRef.current) {
        initializeMap(mapRef.current, routes);
      }
      if (showFullscreenMap && fullscreenMapRef.current) {
        initializeMap(fullscreenMapRef.current, routes, selectedRoute);
      }
    }
  }, [routes, showRouteMap, showFullscreenMap, isGoogleMapsLoaded]);

  const refreshData = async () => {
    await fetchRoutesData();
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableAgents = agents.filter(agent =>
    !routes.some(route => route.agents.some(routeAgent => routeAgent.id === agent.id))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading routes...</p>
        </div>
      </div>
    );
  }

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
      <OverallMapView />

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddRoute(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>{route.name}</h3>
                <p className="text-gray-600 mt-1">{route.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${route.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
                {/* <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${route.performance.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {route.performance.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{route.performance.change}</span>
                </div> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Riders</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {route.assignedRiders}/{route.totalRiders}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Daily Deliveries</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.maxDailyDeliveries}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Coverage</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.coverageArea}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Avg. Time</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.estimatedDeliveryTime} min</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Riders ({route.agents.length})</h4>
              <div className="flex flex-wrap gap-2">
                {route.agents.slice(0, 3).map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                    </div>
                    <span className="text-xs text-blue-700">{agent.firstName} {agent.lastName}</span>
                  </div>
                ))}
                {route.agents.length > 3 && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-xs text-gray-600">+{route.agents.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedRoute(route);
                  handleLoadGoogleMaps(() => {
                    if (detailsMapRef.current) {
                      initializeMap(detailsMapRef.current, [route], route);
                    }
                  });
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => console.log('Edit route:', route.id)}
                className="bg-gray-50 text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteRoute(route.id)}
                className="bg-gray-50 text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No routes found matching your search criteria.</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Quick Route Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            id="routeSelect"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
          <select
            id="riderSelect"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Rider</option>
            {availableAgents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.firstName} {agent.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={async () => {
              const routeSelect = document.getElementById('routeSelect');
              const riderSelect = document.getElementById('riderSelect');
              const routeId = parseInt(routeSelect.value);
              const riderId = parseInt(riderSelect.value);

              if (routeId && riderId) {
                await assignRider(routeId, riderId);
                routeSelect.value = '';
                riderSelect.value = '';
              } else {
                alert('Please select both a route and a rider');
              }
            }}
            className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            Assign Rider
          </button>
        </div>

        {availableAgents.length === 0 && (
          <p className="text-amber-600 text-sm mt-2">
            No unassigned riders available. All riders are currently assigned to routes.
          </p>
        )}
      </div>

      {showAddRoute && <AddRouteModal />}
      {selectedRoute && <RouteDetailsModal />}

      {showFullscreenMap && (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
          <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Routes Map - Fullscreen View</h2>
            <button
              onClick={() => setShowFullscreenMap(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close fullscreen map"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 relative bg-white">
            <div
              ref={fullscreenMapRef}
              className="w-full h-full"
            />
            {!isGoogleMapsLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading Google Maps...</p>
                  <p className="text-gray-500 mt-2">Fullscreen route view for Colombo Hub</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border">
              <h4 className="font-semibold text-slate-900 mb-3">Map Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  <span className="text-gray-600">Route Boundary</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Route Center</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Delivery Points</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-1 bg-gray-400"></div>
                  <span className="text-gray-600">Main Roads</span>
                </div>
                <p className="text-gray-500 mt-3 text-xs">Click on any route to view details</p>
              </div>
            </div>

            {selectedRoute && (
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg border max-w-md">
                <h4 className="font-semibold text-slate-900 mb-2">{selectedRoute.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedRoute.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Coverage:</span>
                    <span className="ml-2 font-medium">{selectedRoute.coverageArea}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Deliveries:</span>
                    <span className="ml-2 font-medium">{selectedRoute.maxDailyDeliveries}/day</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Riders:</span>
                    <span className="ml-2 font-medium">{selectedRoute.assignedRiders}/{selectedRoute.totalRiders}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg. Time:</span>
                    <span className="ml-2 font-medium">{selectedRoute.estimatedDeliveryTime} min</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowFullscreenMap(false);
                  }}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  aria-label={`View details for ${selectedRoute.name}`}
                >
                  View Route Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;