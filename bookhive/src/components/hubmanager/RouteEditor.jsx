// src/components/hubmanager/RouteEditor.jsx - Updated with red other routes and removed note
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  DrawingManager,
  Polygon,
  Marker,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';
import {
  Save,
  X,
  Edit,
  Trash2,
  MapPin,
  Info,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Map,
  Navigation,
  Copy,
  Download,
  Upload,
  Zap,
  Search
} from 'lucide-react';
import { routeApi, routeHelpers } from '../../services/deliveryService';

// Google Maps libraries to load - ensure places is included
const libraries = ['drawing', 'geometry', 'places'];

// Default map options with better road colors
const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  gestureHandling: 'greedy',
  styles: [
    {
      featureType: 'administrative.postal_code',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'on' }, { color: '#FF6B35' }, { weight: 2 }]
    },
    {
      featureType: 'administrative.postal_code',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'simplified' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#4CAF50' }]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#2196F3' }]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [{ color: '#9E9E9E' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#64B5F6' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#E8F5E8' }]
    }
  ]
};

// Drawing manager options
const drawingManagerOptions = {
  drawingMode: null,
  drawingControl: true,
  drawingControlOptions: {
    position: 9, // TOP_CENTER
    drawingModes: ['polygon']
  },
  polygonOptions: {
    fillColor: '#3B82F6',
    fillOpacity: 0.3,
    strokeColor: '#1D4ED8',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    clickable: true,
    editable: true,
    draggable: false
  }
};

// Error Boundary Component for Autocomplete
class AutocompleteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Autocomplete Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search disabled (Places API unavailable)"
            className="w-80 pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-lg"
            disabled
          />
        </div>
      );
    }

    return this.props.children;
  }
}

const RouteEditor = ({ 
  routeId = null, 
  hubId = 1, 
  onSave, 
  onCancel, 
  initialCenter = { lat: 6.9271, lng: 79.8612 }, // Colombo, Sri Lanka
  mode = 'create' // 'create' or 'edit'
}) => {
  // State management
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [routeType, setRouteType] = useState('RESIDENTIAL');
  const [trafficPattern, setTrafficPattern] = useState('MODERATE');
  const [postalCodes, setPostalCodes] = useState('');
  const [neighborhoods, setNeighborhoods] = useState('');
  const [landmarks, setLandmarks] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(30);
  const [maxDailyDeliveries, setMaxDailyDeliveries] = useState(50);
  const [priorityLevel, setPriorityLevel] = useState(3);
  
  const [polygon, setPolygon] = useState(null);
  const [polygonPath, setPolygonPath] = useState([]);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [showMap, setShowMap] = useState(true);

  // Other routes state
  const [otherRoutes, setOtherRoutes] = useState([]);
  const [showOtherRoutes, setShowOtherRoutes] = useState(true);
  const [otherRoutePolygons, setOtherRoutePolygons] = useState([]);

  // Search state
  const [placesReady, setPlacesReady] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const polygonRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const fileInputRef = useRef(null);
  const eventListenersRef = useRef([]);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);

  // Hardcoded API key as requested
  const googleMapsApiKey = "AIzaSyC_N6VhUsq0bX8FEDfanh3Af-I1Bx5caFU";

  // Load Google Maps API with consistent ID
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // Keep consistent with your working version
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries,
    preventGoogleFontsLoading: true,
  });

  // Check if Places API is available
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
      setPlacesReady(true);
      console.log('Places API is ready');
    } else if (isLoaded) {
      console.warn('Places API not available');
      setPlacesReady(false);
    }
  }, [isLoaded]);

  // Load other routes for context
  const loadOtherRoutes = async () => {
    try {
      const allRoutes = await routeApi.getRoutesByHub(hubId);
      
      const filteredRoutes = allRoutes.filter(route => 
        !routeId || route.routeId !== parseInt(routeId)
      );
      
      const formattedOtherRoutes = filteredRoutes.map(route => {
        const boundaryCoordinates = routeHelpers.parseBoundaryCoordinates(route.boundaryCoordinates);
        
        return {
          id: route.routeId,
          name: route.name,
          routeType: route.routeType || 'RESIDENTIAL',
          boundaryCoordinates: boundaryCoordinates,
          coordinates: {
            lat: route.centerLatitude || 6.9271,
            lng: route.centerLongitude || 79.8612
          }
        };
      });
      
      setOtherRoutes(formattedOtherRoutes);
      console.log(`Loaded ${formattedOtherRoutes.length} other routes for context`);
    } catch (err) {
      console.error('Error loading other routes:', err);
    }
  };

  // Create polygons for other routes
  const createOtherRoutePolygons = useCallback(() => {
    if (!mapRef.current || !window.google || !isLoaded) return;

    // Clear existing other route polygons
    otherRoutePolygons.forEach(polygon => {
      if (polygon) {
        polygon.setMap(null);
      }
    });

    const newOtherPolygons = [];

    otherRoutes.forEach(route => {
      if (route.boundaryCoordinates && route.boundaryCoordinates.length >= 3) {
        const routeColor = getOtherRouteColor(route.routeType);
        
        const otherPolygon = new window.google.maps.Polygon({
          paths: route.boundaryCoordinates,
          strokeColor: routeColor.stroke,
          strokeOpacity: 0.8, // Increased opacity for better visibility
          strokeWeight: 2,
          fillColor: routeColor.fill,
          fillOpacity: 0.2, // Increased opacity for better visibility
          clickable: true,
          editable: false,
          draggable: false,
          map: showOtherRoutes ? mapRef.current : null
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 4px 0; color: #1f2937;">${route.name}</h4>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">Type: ${route.routeType}</p>
              <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Click to view details</p>
            </div>
          `
        });

        otherPolygon.addListener('click', (event) => {
          infoWindow.setPosition(event.latLng);
          infoWindow.open(mapRef.current);
        });

        newOtherPolygons.push(otherPolygon);
      }
    });

    setOtherRoutePolygons(newOtherPolygons);
  }, [otherRoutes, showOtherRoutes, mapRef, isLoaded]);

  // Get colors for other routes - All red for better visibility
  const getOtherRouteColor = (routeType) => {
    // All other routes in red color for better visibility
    return { stroke: '#DC2626', fill: '#DC2626' }; // Red color
  };

  // Toggle other routes visibility
  const toggleOtherRoutes = () => {
    setShowOtherRoutes(!showOtherRoutes);
    otherRoutePolygons.forEach(polygon => {
      if (polygon) {
        polygon.setMap(!showOtherRoutes ? mapRef.current : null);
      }
    });
  };

  // Handle place selection from search with error handling
  const onPlaceChanged = useCallback(() => {
    try {
      if (autocompleteRef.current && placesReady) {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry && place.geometry.location) {
          const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setMapCenter(newCenter);
          setMapZoom(15);
          
          if (mapRef.current) {
            mapRef.current.panTo(newCenter);
            mapRef.current.setZoom(15);
          }
          
          setSuccess(`Moved to: ${place.formatted_address || place.name}`);
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (error) {
      console.error('Error in place selection:', error);
      setError('Error selecting location');
      setTimeout(() => setError(''), 3000);
    }
  }, [placesReady]);

  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  // Manual search function as fallback
  const handleManualSearch = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return;
    
    // Simple geocoding fallback
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { 
        address: searchTerm,
        componentRestrictions: { country: 'LK' }
      },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const newCenter = {
            lat: location.lat(),
            lng: location.lng()
          };
          setMapCenter(newCenter);
          setMapZoom(15);
          
          if (mapRef.current) {
            mapRef.current.panTo(newCenter);
            mapRef.current.setZoom(15);
          }
          
          setSuccess(`Found: ${results[0].formatted_address}`);
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Location not found');
          setTimeout(() => setError(''), 3000);
        }
      }
    );
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
      }

      switch (event.key) {
        case 'Delete':
        case 'Backspace':
        case '-':
        case '_':
          event.preventDefault();
          if (selectedVertex !== null) {
            removeVertex(selectedVertex);
          }
          break;
        case '+':
        case '=':
          event.preventDefault();
          if (selectedVertex !== null) {
            addVertex(selectedVertex);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedVertex(null);
          break;
        case 'h':
        case 'H':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            toggleOtherRoutes();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVertex, polygon, polygonPath, showOtherRoutes]);

  // Load other routes when component mounts
  useEffect(() => {
    if (isLoaded) {
      loadOtherRoutes();
    }
  }, [isLoaded, routeId, hubId]);

  // Create other route polygons when loaded
  useEffect(() => {
    if (isLoaded && otherRoutes.length > 0) {
      createOtherRoutePolygons();
    }
  }, [otherRoutes, isLoaded, createOtherRoutePolygons, showOtherRoutes]);

  // Add calculatePolygonPerimeter function if missing
  const calculatePolygonPerimeter = useCallback((coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const current = coordinates[i];
      const next = coordinates[(i + 1) % coordinates.length];
      
      // Use Haversine formula for distance
      const R = 6371; // Earth radius in kilometers
      const dLat = (next.lat - current.lat) * Math.PI / 180;
      const dLng = (next.lng - current.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(current.lat * Math.PI / 180) * Math.cos(next.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      perimeter += distance;
    }
    
    return parseFloat(perimeter.toFixed(2));
  }, []);

  // Cleanup function for event listeners
  const cleanupEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(listener => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      } else if (window.google && window.google.maps && window.google.maps.event && listener) {
        window.google.maps.event.removeListener(listener);
      }
    });
    eventListenersRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupEventListeners();
      if (polygon) {
        polygon.setMap(null);
      }
      otherRoutePolygons.forEach(polygon => {
        if (polygon) {
          polygon.setMap(null);
        }
      });
    };
  }, [cleanupEventListeners, polygon, otherRoutePolygons]);

  // Load existing route data if editing
  useEffect(() => {
    if (routeId && isLoaded && isEditing) {
      loadExistingRoute();
    }
  }, [routeId, isLoaded, isEditing]);

  // Auto-save draft functionality
  useEffect(() => {
    if (!isEditing && routeName) {
      const draftKey = `route_draft_${hubId}`;
      const draftData = {
        routeName,
        routeDescription,
        routeType,
        trafficPattern,
        postalCodes,
        neighborhoods,
        landmarks,
        estimatedDeliveryTime,
        maxDailyDeliveries,
        priorityLevel,
        polygonPath,
        mapCenter,
        timestamp: Date.now()
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
    }
  }, [routeName, routeDescription, routeType, trafficPattern, postalCodes, 
      neighborhoods, landmarks, estimatedDeliveryTime, maxDailyDeliveries, 
      priorityLevel, polygonPath, mapCenter, isEditing, hubId]);

  // Load draft data
  useEffect(() => {
    if (!isEditing && !routeId) {
      const draftKey = `route_draft_${hubId}`;
      const draftData = localStorage.getItem(draftKey);
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          const hoursSinceLastEdit = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
          
          if (hoursSinceLastEdit < 24) { // Only restore if less than 24 hours old
            setRouteName(parsed.routeName || '');
            setRouteDescription(parsed.routeDescription || '');
            setRouteType(parsed.routeType || 'RESIDENTIAL');
            setTrafficPattern(parsed.trafficPattern || 'MODERATE');
            setPostalCodes(parsed.postalCodes || '');
            setNeighborhoods(parsed.neighborhoods || '');
            setLandmarks(parsed.landmarks || '');
            setEstimatedDeliveryTime(parsed.estimatedDeliveryTime || 30);
            setMaxDailyDeliveries(parsed.maxDailyDeliveries || 50);
            setPriorityLevel(parsed.priorityLevel || 3);
            if (parsed.polygonPath && parsed.polygonPath.length > 0) {
              setPolygonPath(parsed.polygonPath);
            }
            if (parsed.mapCenter) {
              setMapCenter(parsed.mapCenter);
            }
            setSuccess('Draft restored from previous session');
            setTimeout(() => setSuccess(''), 3000);
          }
        } catch (e) {
          console.warn('Failed to restore draft:', e);
        }
      }
    }
  }, [isEditing, routeId, hubId]);

  // Load existing route data
  const loadExistingRoute = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const route = await routeApi.getRouteById(routeId);
      
      setRouteName(route.name || '');
      setRouteDescription(route.description || '');
      setRouteType(route.routeType || 'RESIDENTIAL');
      setTrafficPattern(route.trafficPattern || 'MODERATE');
      setEstimatedDeliveryTime(route.estimatedDeliveryTime || 30);
      setMaxDailyDeliveries(route.maxDailyDeliveries || 50);
      setPriorityLevel(route.priorityLevel || 3);
      
      // Handle postal codes
      if (route.postalCodes) {
        const codes = routeHelpers.parsePostalCodes(route.postalCodes);
        setPostalCodes(codes.join(', '));
      }

      // Handle neighborhoods
      if (route.neighborhoods) {
        const neighborhoodList = routeHelpers.parseJsonField(route.neighborhoods);
        setNeighborhoods(neighborhoodList.join(', '));
      }

      // Handle landmarks
      if (route.landmarks) {
        const landmarkList = routeHelpers.parseJsonField(route.landmarks);
        setLandmarks(landmarkList.join(', '));
      }

      // Set map center to route center
      if (route.centerLatitude && route.centerLongitude) {
        const center = {
          lat: parseFloat(route.centerLatitude),
          lng: parseFloat(route.centerLongitude)
        };
        setMapCenter(center);
      }

      // Load boundary coordinates if available
      if (route.boundaryCoordinates) {
        const boundaryCoords = routeHelpers.parseBoundaryCoordinates(route.boundaryCoordinates);
        if (boundaryCoords && boundaryCoords.length >= 3) {
          setPolygonPath(boundaryCoords);
          console.log('Loaded existing route boundary:', boundaryCoords.length, 'points');
        }
      }
    } catch (err) {
      console.error('Error loading route:', err);
      setError('Failed to load route data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle polygon completion from drawing manager
  const onPolygonComplete = useCallback((newPolygon) => {
    console.log('Polygon completed');
    
    // Clean up previous event listeners
    cleanupEventListeners();
    
    // Remove any existing polygon
    if (polygon) {
      polygon.setMap(null);
    }

    // Disable drawing mode
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }

    // Set the new polygon
    setPolygon(newPolygon);
    polygonRef.current = newPolygon;

    // Get the path coordinates
    const path = newPolygon.getPath();
    const coordinates = [];
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({
        lat: parseFloat(point.lat().toFixed(6)),
        lng: parseFloat(point.lng().toFixed(6))
      });
    }
    
    setPolygonPath(coordinates);
    setError(''); // Clear any previous errors
    setSuccess(`Polygon created with ${coordinates.length} vertices`);
    setTimeout(() => setSuccess(''), 3000);

    // Add listeners for path changes
    if (window.google && window.google.maps) {
      const insertListener = window.google.maps.event.addListener(path, 'insert_at', () => {
        updatePolygonPath(newPolygon);
      });
      
      const removeListener = window.google.maps.event.addListener(path, 'remove_at', () => {
        updatePolygonPath(newPolygon);
      });
      
      const setListener = window.google.maps.event.addListener(path, 'set_at', () => {
        updatePolygonPath(newPolygon);
      });

      // Store listeners for cleanup
      eventListenersRef.current.push(insertListener, removeListener, setListener);
    }

    console.log('Polygon created with', coordinates.length, 'vertices');
  }, [polygon, cleanupEventListeners]);

  // Update polygon path when vertices change
  const updatePolygonPath = useCallback((currentPolygon) => {
    if (!currentPolygon) return;

    const path = currentPolygon.getPath();
    const coordinates = [];
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({
        lat: parseFloat(point.lat().toFixed(6)),
        lng: parseFloat(point.lng().toFixed(6))
      });
    }
    
    setPolygonPath(coordinates);
  }, []);

  // Create polygon from loaded coordinates
  const createPolygonFromCoordinates = useCallback((coordinates) => {
    if (!mapRef.current || !window.google || coordinates.length < 3) return;

    console.log('Creating polygon from coordinates:', coordinates.length, 'points');

    // Clean up previous event listeners
    cleanupEventListeners();

    // Remove existing polygon
    if (polygon) {
      polygon.setMap(null);
    }

    // Create new polygon
    const newPolygon = new window.google.maps.Polygon({
      paths: coordinates,
      ...drawingManagerOptions.polygonOptions,
      map: mapRef.current
    });

    setPolygon(newPolygon);
    polygonRef.current = newPolygon;

    // Add event listeners
    const path = newPolygon.getPath();
    
    if (window.google && window.google.maps) {
      const insertListener = window.google.maps.event.addListener(path, 'insert_at', () => {
        updatePolygonPath(newPolygon);
      });
      
      const removeListener = window.google.maps.event.addListener(path, 'remove_at', () => {
        updatePolygonPath(newPolygon);
      });
      
      const setListener = window.google.maps.event.addListener(path, 'set_at', () => {
        updatePolygonPath(newPolygon);
      });

      // Store listeners for cleanup
      eventListenersRef.current.push(insertListener, removeListener, setListener);
    }

    // Fit map to polygon bounds
    const bounds = new window.google.maps.LatLngBounds();
    coordinates.forEach(coord => {
      bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });
    
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(mapRef.current, 'idle', () => {
        if (mapRef.current.getZoom() > 16) {
          mapRef.current.setZoom(16);
        }
        window.google.maps.event.removeListener(listener);
      });
    }

    console.log('Polygon created successfully');
  }, [polygon, cleanupEventListeners, updatePolygonPath]);

  // Effect to create polygon when path is loaded
  useEffect(() => {
    if (polygonPath.length >= 3 && isLoaded && mapRef.current && !polygon) {
      createPolygonFromCoordinates(polygonPath);
    }
  }, [polygonPath, isLoaded, createPolygonFromCoordinates, polygon]);

  // Clear current polygon - modified to ensure map is visible
  const clearPolygon = useCallback(() => {
    cleanupEventListeners();
    
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
      polygonRef.current = null;
    }
    setPolygonPath([]);
    setSelectedVertex(null);
    setError('');
    setSuccess('Polygon cleared - Draw a new polygon using the tools above');
    setTimeout(() => setSuccess(''), 3000);
    
    // Ensure map is visible
    setShowMap(true);
    
    // Re-enable drawing mode
    if (drawingManagerRef.current && window.google) {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  }, [polygon, cleanupEventListeners]);

  // Clear draft
  const clearDraft = () => {
    const draftKey = `route_draft_${hubId}`;
    localStorage.removeItem(draftKey);
    setSuccess('Draft cleared');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Add vertex to polygon at specific index
  const addVertex = (index) => {
    if (!polygon || polygonPath.length < 2) return;

    const path = polygon.getPath();
    const currentPoint = polygonPath[index];
    const nextPoint = polygonPath[(index + 1) % polygonPath.length];
    
    // Calculate midpoint
    const midLat = (currentPoint.lat + nextPoint.lat) / 2;
    const midLng = (currentPoint.lng + nextPoint.lng) / 2;
    
    const newPoint = new window.google.maps.LatLng(midLat, midLng);
    path.insertAt(index + 1, newPoint);
    
    // Update selected vertex to the new one
    setSelectedVertex(index + 1);
    setSuccess('Vertex added (Keyboard: + key)');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Remove vertex from polygon
  const removeVertex = (index) => {
    if (!polygon || polygonPath.length <= 3) {
      setError('Polygon must have at least 3 vertices');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const path = polygon.getPath();
    path.removeAt(index);
    
    // Reset selected vertex
    setSelectedVertex(null);
    setSuccess('Vertex removed (Keyboard: Delete/- key)');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Import coordinates from JSON file
  const importCoordinates = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate the imported data
        if (Array.isArray(data) && data.length >= 3) {
          const validation = routeHelpers.validateBoundaryCoordinates(data);
          if (validation.isValid) {
            setPolygonPath(data);
            setSuccess(`Imported ${data.length} coordinates successfully`);
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setError('Invalid coordinate data: ' + validation.errors.join(', '));
          }
        } else {
          setError('File must contain an array of at least 3 coordinate objects');
        }
      } catch (err) {
        setError('Invalid JSON file format');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // Export coordinates to JSON file
  const exportCoordinates = () => {
    if (polygonPath.length === 0) {
      setError('No coordinates to export');
      return;
    }

    const dataStr = JSON.stringify(polygonPath, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `route_${routeName.replace(/[^a-zA-Z0-9]/g, '_')}_coordinates.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    setSuccess('Coordinates exported successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Copy coordinates to clipboard
  const copyCoordinates = async () => {
    if (polygonPath.length === 0) {
      setError('No coordinates to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(polygonPath, null, 2));
      setSuccess('Coordinates copied to clipboard');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy coordinates');
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = [];

    if (!routeName.trim()) {
      errors.push('Route name is required');
    }

    if (routeName.trim().length < 3) {
      errors.push('Route name must be at least 3 characters long');
    }

    if (polygonPath.length < 3) {
      errors.push('Route boundary must have at least 3 points');
    }

    if (estimatedDeliveryTime < 1 || estimatedDeliveryTime > 300) {
      errors.push('Estimated delivery time must be between 1 and 300 minutes');
    }

    if (maxDailyDeliveries < 1 || maxDailyDeliveries > 1000) {
      errors.push('Max daily deliveries must be between 1 and 1000');
    }

    if (priorityLevel < 1 || priorityLevel > 5) {
      errors.push('Priority level must be between 1 and 5');
    }

    return errors;
  };

  // Save route
  const saveRoute = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }

      // Calculate polygon center and area
      const center = routeHelpers.getPolygonCenter(polygonPath);
      const area = routeHelpers.calculatePolygonArea(polygonPath);

      // Parse arrays from comma-separated strings
      const neighborhoodArray = neighborhoods.split(',').map(n => n.trim()).filter(n => n);
      const landmarkArray = landmarks.split(',').map(l => l.trim()).filter(l => l);

      const routeData = {
        name: routeName.trim(),
        description: routeDescription.trim(),
        hubId: parseInt(hubId),
        centerLatitude: center.lat,
        centerLongitude: center.lng,
        boundaryCoordinates: polygonPath,
        coverageArea: `${area} km²`,
        routeType: routeType,
        trafficPattern: trafficPattern,
        postalCodes: postalCodes.trim(),
        neighborhoods: neighborhoodArray,
        landmarks: landmarkArray,
        estimatedDeliveryTime: parseInt(estimatedDeliveryTime),
        maxDailyDeliveries: parseInt(maxDailyDeliveries),
        priorityLevel: parseInt(priorityLevel)
      };

      console.log('Saving route data:', routeData);

      let result;
      if (isEditing && routeId) {
        result = await routeApi.updateRoute(routeId, routeData);
        setSuccess('Route updated successfully!');
        
        // Clear draft if updating
        clearDraft();
      } else {
        result = await routeApi.createRoute(routeData);
        setSuccess('Route created successfully!');
        
        // Clear draft after successful creation
        clearDraft();
      }

      console.log('Route saved:', result);

      // Call onSave callback if provided
      if (onSave) {
        setTimeout(() => onSave(result), 1500); // Delay to show success message
      }

    } catch (err) {
      console.error('Error saving route:', err);
      setError('Failed to save route: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate polygon statistics
  const getPolygonStats = () => {
    if (polygonPath.length < 3) return null;

    const area = routeHelpers.calculatePolygonArea(polygonPath);
    const perimeter = calculatePolygonPerimeter(polygonPath);
    const center = routeHelpers.getPolygonCenter(polygonPath);
    const bounds = {
      north: Math.max(...polygonPath.map(p => p.lat)),
      south: Math.min(...polygonPath.map(p => p.lat)),
      east: Math.max(...polygonPath.map(p => p.lng)),
      west: Math.min(...polygonPath.map(p => p.lng))
    };

    return { area, perimeter, center, bounds, vertices: polygonPath.length };
  };

  // Handle map load
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    console.log('Map loaded');
  }, []);

  // Handle drawing manager load
  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
    console.log('Drawing manager loaded');
  }, []);

  // Generate sample polygon for testing
  const generateSamplePolygon = () => {
    const sampleCoords = routeHelpers.generateSampleBoundary(mapCenter, 1);
    setPolygonPath(sampleCoords);
    setError('');
    setSuccess('Sample polygon generated');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Smart polygon generation based on postal codes
  const generateSmartPolygon = async () => {
    if (!postalCodes.trim()) {
      setError('Please enter postal codes first');
      return;
    }

    try {
      const codes = postalCodes.split(',').map(code => code.trim());
      // This would typically call a geocoding service
      // For now, generate a polygon around the map center
      const smartCoords = routeHelpers.generateSampleBoundary(mapCenter, 1.5);
      setPolygonPath(smartCoords);
      setSuccess('Smart polygon generated based on postal codes');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to generate smart polygon');
    }
  };

  // Error handling for missing API key
  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <div className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Google Maps API Key Missing</h3>
          <p className="text-red-600 mb-4">Please check your Google Maps API key configuration</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <div className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to load Google Maps</h3>
          <p className="text-red-600 mb-4">Please check your API key and internet connection</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isLoading ? 'Loading route data...' : 'Loading Google Maps...'}
          </h3>
          <p className="text-gray-600">Please wait while we set up the route editor</p>
        </div>
      </div>
    );
  }

  const stats = getPolygonStats();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden max-h-screen">
      {/* Scrollable Container */}
      <div className="overflow-y-auto max-h-screen">
        {/* Header Form */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Map className="w-8 h-8 mr-3 text-blue-600" />
                {isEditing ? 'Edit Route' : 'Create New Route'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Modify the route boundary and settings' : 'Draw a polygon on the map to define the route boundary'}
              </p>
              {/* Removed the other routes count note */}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCoordinates(!showCoordinates)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                {showCoordinates ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showCoordinates ? 'Hide' : 'Show'} Coordinates</span>
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showAdvanced ? 'Basic' : 'Advanced'} Options
              </button>
              {otherRoutes.length > 0 && (
                <button
                  onClick={toggleOtherRoutes}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors flex items-center space-x-2 ${
                    showOtherRoutes 
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>{showOtherRoutes ? 'Hide' : 'Show'} Other Routes</span>
                </button>
              )}
            </div>
          </div>

          {/* Map Container */}
          {showMap && (
            <div className="relative h-[600px] bg-gray-100 mb-6">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onMapLoad}
                options={defaultMapOptions}
                onZoomChanged={() => {
                  if (mapRef.current) {
                    setMapZoom(mapRef.current.getZoom());
                  }
                }}
              >
                {/* Drawing Manager */}
                <DrawingManager
                  onLoad={onDrawingManagerLoad}
                  onPolygonComplete={onPolygonComplete}
                  options={drawingManagerOptions}
                />

                {/* Vertex Markers for Editing */}
                {polygon && polygonPath.map((vertex, index) => (
                  <Marker
                    key={`vertex-${index}`}
                    position={vertex}
                    draggable={true}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: selectedVertex === index ? '#EF4444' : '#3B82F6',
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeWeight: 2
                    }}
                    onDragEnd={(e) => {
                      const newLat = e.latLng.lat();
                      const newLng = e.latLng.lng();
                      
                      // Update the polygon path
                      const path = polygon.getPath();
                      path.setAt(index, new window.google.maps.LatLng(newLat, newLng));
                    }}
                    onClick={() => setSelectedVertex(selectedVertex === index ? null : index)}
                    title={`Vertex ${index + 1} - Click to select, drag to move`}
                  />
                ))}
              </GoogleMap>

              {/* Search Box with Error Boundary */}
              <div className="absolute top-15 left-2 z-10">
                <AutocompleteErrorBoundary>
                  {isLoaded && placesReady ? (
                    <Autocomplete
                      onLoad={onAutocompleteLoad}
                      onPlaceChanged={onPlaceChanged}
                      options={{
                        componentRestrictions: { country: "lk" },
                        fields: ["place_id", "geometry", "name", "formatted_address"],
                      }}
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search for places..."
                          className="w-70 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </Autocomplete>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search places(press Enter)"
                        className="w-70 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleManualSearch(e.target.value);
                          }
                        }}
                      />
                    </div>
                  )}
                </AutocompleteErrorBoundary>
              </div>

              {/* Map Controls */}
              {/* <div className="absolute top-16 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Navigation className="w-4 h-4 mr-2" />
                  Instructions
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use the polygon tool to draw route boundaries</li>
                  <li>• Click vertices to select and edit them</li>
                  <li>• Drag vertices to adjust the shape</li>
                  <li>• Press + to add vertex, Delete/- to remove</li>
                  <li>• Orange lines show postal code boundaries</li>
                  <li>• Red polygons show other existing routes</li>
                  <li>• Use search box to navigate to locations</li>
                </ul>
              </div> */}

              {/* Keyboard Shortcuts Info */}
              {/* <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Keyboard Shortcuts</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><kbd className="bg-gray-100 px-1 rounded">+</kbd> Add vertex</li>
                  <li><kbd className="bg-gray-100 px-1 rounded">Delete</kbd> Remove vertex</li>
                  <li><kbd className="bg-gray-100 px-1 rounded">-</kbd> Remove vertex</li>
                  <li><kbd className="bg-gray-100 px-1 rounded">Esc</kbd> Deselect vertex</li>
                  <li><kbd className="bg-gray-100 px-1 rounded">Ctrl+H</kbd> Toggle other routes</li>
                </ul>
              </div> */}

              {/* Other Routes Legend - Updated to show all as red */}
              {/* {otherRoutes.length > 0 && showOtherRoutes && (
                <div className="absolute top-32 right-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Other Routes ({otherRoutes.length})</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {otherRoutes.slice(0, 5).map(route => (
                      <div key={route.id} className="flex items-center space-x-2 text-xs mb-1">
                        <div 
                          className="w-3 h-3 rounded-sm border"
                          style={{ 
                            backgroundColor: '#DC2626', // Red color
                            opacity: 0.4
                          }}
                        ></div>
                        <span className="text-gray-600 truncate">{route.name}</span>
                      </div>
                    ))}
                    {otherRoutes.length > 5 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{otherRoutes.length - 5} more routes
                      </div>
                    )}
                  </div>
                </div>
              )} */}

              {/* Vertex Control Panel */}
              {selectedVertex !== null && (
                <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Vertex {selectedVertex + 1} Selected
                  </h4>
                  <div className="text-xs text-gray-600 mb-3 space-y-1">
                    <div>Lat: {polygonPath[selectedVertex]?.lat.toFixed(6)}</div>
                    <div>Lng: {polygonPath[selectedVertex]?.lng.toFixed(6)}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addVertex(selectedVertex)}
                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      title="Add vertex after this point (+ key)"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeVertex(selectedVertex)}
                      disabled={polygonPath.length <= 3}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Remove this vertex (Delete/- key)"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedVertex(null)}
                      className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      title="Deselect vertex (Esc key)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Drawing Status */}
              {/* <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${polygonPath.length >= 3 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {polygonPath.length === 0 ? 'No boundary drawn' : 
                     polygonPath.length < 3 ? `${polygonPath.length} points (need ${3 - polygonPath.length} more)` :
                     `Boundary ready (${polygonPath.length} vertices)`}
                  </span>
                </div>
                {stats && (
                  <div className="text-xs text-gray-500 mt-1">
                    Area: {stats.area} km² | Perimeter: {stats.perimeter} km
                  </div>
                )}
              </div> */}

              {/* Map Info */}
              {/* <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border">
                <div className="text-xs text-gray-600 mb-2">Zoom: {mapZoom}</div>
                <div className="text-xs text-gray-600">
                  Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                </div>
                <div className="text-xs text-gray-600">
                  Search: {placesReady ? 'Ready' : 'Fallback'}
                </div>
              </div> */}
            </div>
          )}

          {/* Coordinates Display */}
          {showCoordinates && polygonPath.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Boundary Coordinates ({polygonPath.length} points)</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={copyCoordinates}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={exportCoordinates}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto bg-white p-3 rounded border border-gray-300">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(polygonPath, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Basic Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="Enter route name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Type
              </label>
              <select
                value={routeType}
                onChange={(e) => setRouteType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="MIXED">Mixed</option>
                <option value="UNIVERSITY">University</option>
                <option value="DOWNTOWN">Downtown</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={routeDescription}
                onChange={(e) => setRouteDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Codes (comma-separated)
              </label>
              <input
                type="text"
                value={postalCodes}
                onChange={(e) => setPostalCodes(e.target.value)}
                placeholder="e.g., 00700, 00701, 00702"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhoods (comma-separated)
              </label>
              <input
                type="text"
                value={neighborhoods}
                onChange={(e) => setNeighborhoods(e.target.value)}
                placeholder="e.g., Cinnamon Gardens, Kollupitiya"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="mb-6 p-6 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Advanced Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Traffic Pattern
                  </label>
                  <select
                    value={trafficPattern}
                    onChange={(e) => setTrafficPattern(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
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
                    max="300"
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Daily Deliveries
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={maxDailyDeliveries}
                    onChange={(e) => setMaxDailyDeliveries(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmarks (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={landmarks}
                    onChange={(e) => setLandmarks(e.target.value)}
                    placeholder="e.g., Independence Square, Liberty Plaza"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 font-medium">Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-green-800 font-medium">Success</h4>
                <p className="text-green-700 text-sm mt-1">{success}</p>
              </div>
            </div>
          )}

          {/* Polygon Statistics */}
          {stats && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Route Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded border shadow-sm">
                  <span className="text-blue-700 font-medium">Vertices:</span>
                  <span className="ml-2 text-lg font-bold">{stats.vertices}</span>
                </div>
                <div className="bg-white p-3 rounded border shadow-sm">
                  <span className="text-blue-700 font-medium">Area:</span>
                  <span className="ml-2 text-lg font-bold">{stats.area} km²</span>
                </div>
                <div className="bg-white p-3 rounded border shadow-sm">
                  <span className="text-blue-700 font-medium">Perimeter:</span>
                  <span className="ml-2 text-lg font-bold">{stats.perimeter} km</span>
                </div>
                <div className="bg-white p-3 rounded border shadow-sm">
                  <span className="text-blue-700 font-medium">Center:</span>
                  <span className="ml-2 text-xs font-medium">
                    {stats.center.lat.toFixed(4)}, {stats.center.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveRoute}
              disabled={isSaving || !routeName.trim() || polygonPath.length < 3}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Route' : 'Save Route'}
                </>
              )}
            </button>
            
            <button
              onClick={clearPolygon}
              disabled={isSaving}
              className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Polygon
            </button>

            <button
              onClick={generateSamplePolygon}
              disabled={isSaving}
              className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Generate Sample
            </button>

            <button
              onClick={generateSmartPolygon}
              disabled={isSaving || !postalCodes.trim()}
              className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Smart Generate
            </button>

            <button
              onClick={copyCoordinates}
              disabled={polygonPath.length === 0}
              className="flex items-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </button>

            <button
              onClick={exportCoordinates}
              disabled={polygonPath.length === 0}
              className="flex items-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="flex items-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importCoordinates}
              className="hidden"
            />

            {onCancel && (
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteEditor;