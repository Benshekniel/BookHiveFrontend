import { useState, useEffect, useRef } from 'react';
import { Package, Users, Clock, AlertTriangle, MapPin, TrendingUp, RefreshCw, Timer, Archive, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deliveryApi, agentApi, hubApi } from '../../services/deliveryService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    availableRiders: 0,
    totalDeliveries: 0,
    totalDeliveryTime: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch dashboard data on initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    loadGoogleMaps();
  }, []);

  // Update map when today's deliveries change
  useEffect(() => {
    if (mapLoaded && todayDeliveries.length > 0) {
      initializeMap();
    }
  }, [mapLoaded, todayDeliveries]);

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_N6VhUsq0bX8FEDfanh3Af-I1Bx5caFU&libraries=geometry,places`; script.async = true;
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

  const initializeMap = () => {
    const mapElement = document.getElementById('delivery-map');
    if (!mapElement || !window.google) return;

    // Default center (Colombo, Sri Lanka)
    const defaultCenter = { lat: 6.9271, lng: 79.8612 };

    // Initialize map
    const map = new window.google.maps.Map(mapElement, {
      zoom: 12,
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

    // Add markers for today's deliveries
    const bounds = new window.google.maps.LatLngBounds();
    let validMarkers = 0;

    todayDeliveries.forEach((delivery, index) => {
      if (delivery.deliveryLatitude && delivery.deliveryLongitude) {
        // Use existing coordinates
        addMarkerToMap(map, delivery, bounds);
        validMarkers++;
      } else if (delivery.deliveryAddress) {
        // Geocode the address
        geocodeAndAddMarker(map, delivery, bounds);
      }
    });

    // Adjust map bounds if we have markers
    if (validMarkers > 0) {
      setTimeout(() => {
        map.fitBounds(bounds);
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
      }, 1000);
    }

    // Add legend with improved styling
    addMapLegend(map);
  };

  const addMarkerToMap = (map, delivery, bounds) => {
    const position = {
      lat: parseFloat(delivery.deliveryLatitude),
      lng: parseFloat(delivery.deliveryLongitude)
    };

    // Create custom marker icon based on status
    const icon = {
      url: getMarkerIcon(delivery.status),
      scaledSize: new window.google.maps.Size(30, 30),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(15, 30)
    };

    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: `${delivery.trackingNumber} - ${delivery.status}`,
      icon: icon
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: createInfoWindowContent(delivery)
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    bounds.extend(position);
  };

  const geocodeAndAddMarker = (map, delivery, bounds) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: delivery.deliveryAddress }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const position = results[0].geometry.location;

        const icon = {
          url: getMarkerIcon(delivery.status),
          scaledSize: new window.google.maps.Size(30, 30),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 30)
        };

        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: `${delivery.trackingNumber} - ${delivery.status}`,
          icon: icon
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(delivery)
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        bounds.extend(position);
      } else {
        console.error('Geocoding failed for address:', delivery.deliveryAddress, status);
      }
    });
  };

  const getMarkerIcon = (status) => {
    // Return different colored markers based on delivery status
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';

    switch (status) {
      case 'PICKED_UP':
        return `${baseUrl}blue-dot.png`;
      case 'IN_TRANSIT':
        return `${baseUrl}yellow-dot.png`;
      case 'DELIVERED':
        return `${baseUrl}green-dot.png`;
      case 'DELAYED':
        return `${baseUrl}red-dot.png`;
      default:
        return `${baseUrl}red-dot.png`;
    }
  };

  const createInfoWindowContent = (delivery) => {
    return `
      <div style="max-width: 300px; font-family: Arial, sans-serif;">
        <h4 style="margin: 0 0 8px 0; color: #1f2937;">${delivery.trackingNumber}</h4>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${mapBackendStatus(delivery.status)}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Customer:</strong> ${delivery.customerName || 'Unknown'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Agent:</strong> ${delivery.agentName || 'Unassigned'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${delivery.deliveryAddress}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Pickup Time:</strong> ${formatTime(delivery.pickupTime)}</p>
        ${delivery.deliveryNotes ? `<p style="margin: 4px 0; font-size: 12px; color: #6b7280;"><strong>Notes:</strong> ${delivery.deliveryNotes}</p>` : ''}
      </div>
    `;
  };

  const addMapLegend = (map) => {
    const legend = document.createElement('div');
    legend.style.backgroundColor = 'white';
    legend.style.border = '2px solid #ccc';
    legend.style.borderRadius = '6px';
    legend.style.boxShadow = '0 2px 8px rgba(0,0,0,.15)';
    legend.style.cursor = 'default';
    legend.style.marginBottom = '22px';
    legend.style.marginRight = '10px';
    legend.style.padding = '12px';
    legend.style.fontFamily = 'Arial, sans-serif';
    legend.style.fontSize = '13px';
    legend.style.lineHeight = '1.4';

    legend.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; text-align: center; color: #333;">Today's Deliveries</div>
      <div style="display: flex; align-items: center; margin-bottom: 6px;">
        <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
             style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;"> 
        <span style="color: #555;">Picked Up</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 6px;">
        <img src="https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" 
             style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;"> 
        <span style="color: #555;">In Transit</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 6px;">
        <img src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" 
             style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;"> 
        <span style="color: #555;">Delivered</span>
      </div>
      <div style="display: flex; align-items: center;">
        <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" 
             style="width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0;"> 
        <span style="color: #555;">Pending</span>
      </div>
    `;

    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch data from multiple endpoints
      const [deliveriesResponse, agentsResponse] = await Promise.all([
        deliveryApi.getAllDeliveries(),
        agentApi.getAllAgents()
      ]);

      // Filter today's deliveries that have been picked up
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format

      const todayPickedDeliveries = deliveriesResponse.filter(delivery => {
        if (!delivery.pickupTime) return false;

        const pickupDate = new Date(delivery.pickupTime);
        const pickupDateStr = pickupDate.toISOString().split('T')[0];

        return pickupDateStr === todayStr;
      });

      setTodayDeliveries(todayPickedDeliveries);

      // Calculate stats
      const activeDeliveries = deliveriesResponse.filter(d =>
        ['IN_TRANSIT', 'PICKED_UP'].includes(d.status)
      ).length;

      const availableRiders = agentsResponse.filter(a =>
        a.availabilityStatus === 'AVAILABLE'
      ).length;

      // Calculate total deliveries (all deliveries)
      const totalDeliveries = deliveriesResponse.length;

      // Calculate total delivery time (sum of all delivery times)
      const deliveredOrders = deliveriesResponse.filter(d => d.status === 'DELIVERED');
      let totalDeliveryTime = 0;

      if (deliveredOrders.length > 0) {
        totalDeliveryTime = deliveredOrders.reduce((acc, delivery) => {
          if (delivery.createdAt && delivery.deliveryTime) {
            const created = new Date(delivery.createdAt);
            const delivered = new Date(delivery.deliveryTime);
            const timeDiff = (delivered - created) / (1000 * 60); // in minutes
            return acc + timeDiff;
          }
          // Fallback: use random time between 20-60 minutes for demo
          return acc + (20 + Math.random() * 40);
        }, 0);
        totalDeliveryTime = Math.round(totalDeliveryTime);
      } else {
        // Fallback for demo purposes - calculate based on total deliveries
        totalDeliveryTime = totalDeliveries * 35; // 35 minutes per delivery average
      }

      setStats({
        activeDeliveries,
        availableRiders,
        totalDeliveries,
        totalDeliveryTime
      });

      // Transform recent deliveries
      const transformedDeliveries = deliveriesResponse
        .slice(0, 5) // Get latest 5
        .map(delivery => ({
          id: delivery.trackingNumber || `DEL${delivery.deliveryId}`,
          customer: delivery.customerName || 'Unknown Customer',
          rider: delivery.agentName || 'Unassigned',
          status: mapBackendStatus(delivery.status),
          time: formatTime(delivery.updatedAt || delivery.createdAt)
        }));

      setRecentDeliveries(transformedDeliveries);

      // Generate alerts based on data
      const generatedAlerts = generateAlerts(deliveriesResponse, agentsResponse);
      setAlerts(generatedAlerts);

      // Generate weekly delivery performance data
      const weeklyPerformanceData = generateWeeklyData(deliveriesResponse);
      setWeeklyData(weeklyPerformanceData);

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'PENDING': 'Pending',
      'ASSIGNED': 'Assigned',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
      'DELAYED': 'Delayed'
    };
    return statusMap[backendStatus] || 'Unknown';
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const generateAlerts = (deliveries, agents) => {
    const alerts = [];

    // Check for delayed deliveries
    const delayedDeliveries = deliveries.filter(d => d.status === 'DELAYED');
    delayedDeliveries.forEach(delivery => {
      alerts.push({
        type: 'warning',
        message: `Delivery ${delivery.trackingNumber || delivery.deliveryId} is running late`,
        time: formatTime(delivery.updatedAt)
      });
    });

    // Check for unavailable riders
    const unavailableRiders = agents.filter(a => a.availabilityStatus === 'UNAVAILABLE');
    if (unavailableRiders.length > 0) {
      alerts.push({
        type: 'error',
        message: `${unavailableRiders.length} rider(s) are currently unavailable`,
        time: '5 min ago'
      });
    }

    // Check for pending deliveries without agents
    const unassignedDeliveries = deliveries.filter(d =>
      d.status === 'PENDING' && !d.agentId
    );
    if (unassignedDeliveries.length > 0) {
      alerts.push({
        type: 'info',
        message: `${unassignedDeliveries.length} pending deliveries need agent assignment`,
        time: '10 min ago'
      });
    }

    return alerts.slice(0, 3); // Show only latest 3 alerts
  };

  const generateWeeklyData = (deliveries) => {
    // Generate weekly performance data for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();

    const weeklyData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index)); // Get the date for each day

      // Filter deliveries for this specific day
      const dayDeliveries = deliveries.filter(delivery => {
        const deliveryDate = new Date(delivery.createdAt || delivery.updatedAt);
        return deliveryDate.toDateString() === date.toDateString();
      });

      // Calculate metrics for this day
      const totalDeliveries = dayDeliveries.length;
      const successfulDeliveries = dayDeliveries.filter(d => d.status === 'DELIVERED').length;
      const failedDeliveries = dayDeliveries.filter(d => d.status === 'CANCELLED' || d.status === 'DELAYED').length;

      // If no real data, generate demo data for visualization
      const deliveries_count = totalDeliveries > 0 ? totalDeliveries : Math.floor(Math.random() * 50) + 20;
      const successful = successfulDeliveries > 0 ? successfulDeliveries : Math.floor(deliveries_count * 0.8);
      const failed = failedDeliveries > 0 ? failedDeliveries : deliveries_count - successful;

      return {
        day,
        date: date.toISOString().split('T')[0],
        deliveries: deliveries_count,
        successful,
        failed,
        efficiency: Math.round((successful / deliveries_count) * 100)
      };
    });

    return weeklyData;
  };

  const StatCard = ({ title, value, icon: Icon, color, suffix = "" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500 m-0">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 m-0">{value}{suffix}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );

  if (loading && recentDeliveries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          icon={Package}
          color="text-blue-500"
        />
        <StatCard
          title="Available Riders"
          value={stats.availableRiders}
          icon={Users}
          color="text-green-500"
        />
        <StatCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          icon={Archive}
          color="text-purple-500"
        />
        <StatCard
          title="Today's Pickups"
          value={todayDeliveries.length}
          icon={Timer}
          color="text-orange-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Deliveries */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-poppins font-semibold text-slate-900 mb-4 m-0">Recent Deliveries</h2>
            <div>
              {recentDeliveries.length > 0 ? (
                recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex flex-col">
                      <p className="font-medium text-slate-900 m-0">{delivery.id}</p>
                      <p className="text-sm text-gray-500 m-0">{delivery.customer} • {delivery.rider}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={
                        `px-2 py-1 rounded-full text-xs font-medium
                        ${delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            delivery.status === 'Picked Up' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'}`
                      }>
                        {delivery.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1 m-0">{delivery.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent deliveries</p>
              )}
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-poppins font-semibold text-slate-900 mb-4 m-0">Alerts & Notifications</h2>
            <div>
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg border-l-4 mb-4
                      ${alert.type === 'error' ? 'bg-red-50 border-red-400' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                          'bg-blue-50 border-blue-400'}
                    `}
                  >
                    <p className="text-sm text-slate-900 m-0">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1 m-0">{alert.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No active alerts</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Maps Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mt-1">
        {/* Delivery Locations Map */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-poppins font-semibold text-slate-900 m-0">Today's Delivery Locations</h2>
              </div>
              <div className="text-sm text-gray-600">
                {todayDeliveries.length} pickups today
              </div>
            </div>
            <div className="relative w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              {!mapLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <div id="delivery-map" className="w-full h-full"></div>
              )}

              {todayDeliveries.length === 0 && mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No pickups for today</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Weekly Performance Chart */}
        <div className="grid gap-6 grid-cols-1">
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w- h-5 text-green-500" />
                <h2 className="text-xl font-poppins font-semibold text-slate-900 m-0">Weekly Delivery Performance</h2>
              </div>
              <div className="relative w-full h-[300px] mt-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 20, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"

                    />
                    <YAxis

                    />
                    <Tooltip

                    />
                    <Bar
                      dataKey="deliveries"
                      fill="#3b82f6"
                      name="deliveries"
                      radius={[4, 4, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;