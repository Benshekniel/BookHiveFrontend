import { Package, Users, Clock, AlertTriangle, MapPin, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Active Deliveries', value: '24', icon: Package, color: '#3b82f6' },
    { title: 'Available Riders', value: '12', icon: Users, color: '#22c55e' },
    { title: 'Pending Tasks', value: '8', icon: Clock, color: '#fbbf24' },
    { title: 'Urgent Alerts', value: '3', icon: AlertTriangle, color: '#ef4444' },
  ];

  const recentDeliveries = [
    { id: 'DEL001', customer: 'John Doe', rider: 'Mike Johnson', status: 'In Transit', time: '2:30 PM' },
    { id: 'DEL002', customer: 'Sarah Smith', rider: 'Alex Brown', status: 'Delivered', time: '2:15 PM' },
    { id: 'DEL003', customer: 'Robert Wilson', rider: 'Emma Davis', status: 'Picked Up', time: '2:00 PM' },
  ];

  const alerts = [
    { type: 'warning', message: 'Delivery DEL004 is running 30 minutes late', time: '5 min ago' },
    { type: 'error', message: 'Rider Tom Wilson is unavailable', time: '10 min ago' },
    { type: 'info', message: 'New rider registration pending approval', time: '15 min ago' },
  ];

  // Delivery locations data for the map
  const deliveryLocations = [
    { area: 'Downtown', deliveries: 45, lat: 40.7589, lng: -73.9851 },
    { area: 'Northside', deliveries: 32, lat: 40.7831, lng: -73.9712 },
    { area: 'Westside', deliveries: 28, lat: 40.7505, lng: -74.0087 },
    { area: 'Eastside', deliveries: 38, lat: 40.7614, lng: -73.9776 },
    { area: 'Southside', deliveries: 22, lat: 40.7282, lng: -73.9942 },
    { area: 'Industrial', deliveries: 18, lat: 40.7505, lng: -74.0134 },
    { area: 'Suburbs', deliveries: 35, lat: 40.7831, lng: -73.9554 },
    { area: 'Harbor', deliveries: 15, lat: 40.7061, lng: -74.0087 }
  ];

  // Routes data for visual representation
  const routes = [
    { 
      id: 'A', 
      name: 'Route A - Downtown', 
      color: '#3b82f6', 
      points: [
        { lat: 40.7589, lng: -73.9851 },
        { lat: 40.7614, lng: -73.9776 },
        { lat: 40.7505, lng: -73.9712 },
        { lat: 40.7831, lng: -73.9554 }
      ],
      efficiency: 92
    },
    { 
      id: 'B', 
      name: 'Route B - Residential', 
      color: '#22c55e', 
      points: [
        { lat: 40.7831, lng: -73.9712 },
        { lat: 40.7505, lng: -74.0087 },
        { lat: 40.7282, lng: -73.9942 },
        { lat: 40.7061, lng: -74.0087 }
      ],
      efficiency: 88
    },
    { 
      id: 'C', 
      name: 'Route C - Industrial', 
      color: '#fbbf24', 
      points: [
        { lat: 40.7505, lng: -74.0134 },
        { lat: 40.7282, lng: -73.9942 },
        { lat: 40.7061, lng: -74.0087 },
        { lat: 40.7589, lng: -73.9851 }
      ],
      efficiency: 85
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color = '#3b82f6' }) => (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            margin: 0
          }}>{title}</p>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0f172a',
            marginTop: '4px',
            margin: 0
          }}>{value}</p>
        </div>
        <div style={{
          padding: '12px',
          borderRadius: '50%',
          backgroundColor: '#f3f4f6'
        }}>
          <Icon style={{
            width: '24px',
            height: '24px',
            color: color
          }} />
        </div>
      </div>
    </div>
  );

  const Card = ({ children, style = {} }) => (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      ...style
    }}>
      {children}
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{
          fontSize: '30px',
          fontFamily: 'Poppins, system-ui, sans-serif',
          fontWeight: 'bold',
          color: '#0f172a',
          margin: 0
        }}>Dashboard</h1>
        <p style={{
          color: '#6b7280',
          marginTop: '8px',
          margin: 0
        }}>Welcome back! Here's what's happening at your hub today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
      }}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Recent Deliveries */}
        <Card>
          <div style={{ padding: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontFamily: 'Poppins, system-ui, sans-serif',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '16px',
              margin: 0
            }}>Recent Deliveries</h2>
            <div>
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <p style={{
                      fontWeight: '500',
                      color: '#0f172a',
                      margin: 0
                    }}>{delivery.id}</p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>{delivery.customer} • {delivery.rider}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: delivery.status === 'Delivered' ? '#dcfce7' : delivery.status === 'In Transit' ? '#dbeafe' : '#fef3c7',
                      color: delivery.status === 'Delivered' ? '#166534' : delivery.status === 'In Transit' ? '#1e40af' : '#92400e'
                    }}>
                      {delivery.status}
                    </span>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginTop: '4px',
                      margin: 0
                    }}>{delivery.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div style={{ padding: '24px' }}>
            <h2 style={{
              fontSize: '20px',
              fontFamily: 'Poppins, system-ui, sans-serif',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '16px',
              margin: 0
            }}>Alerts & Notifications</h2>
            <div>
              {alerts.map((alert, index) => (
                <div key={index} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  borderLeft: '4px solid',
                  marginBottom: '16px',
                  backgroundColor: alert.type === 'error' ? '#fef2f2' : alert.type === 'warning' ? '#fffbeb' : '#eff6ff',
                  borderLeftColor: alert.type === 'error' ? '#f87171' : alert.type === 'warning' ? '#fbbf24' : '#60a5fa'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#0f172a',
                    margin: 0
                  }}>{alert.message}</p>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '4px',
                    margin: 0
                  }}>{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Maps Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '24px',
        marginTop: '24px'
      }}>
        {/* Delivery Locations Map */}
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <h2 style={{
                fontSize: '20px',
                fontFamily: 'Poppins, system-ui, sans-serif',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0
              }}>Delivery Locations Map</h2>
            </div>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Overlay with delivery markers */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Delivery Areas</div>
                {deliveryLocations.slice(0, 4).map((location, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%'
                    }}></div>
                    <span>{location.area}: {location.deliveries}</span>
                  </div>
                ))}
                <div style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  Total: {deliveryLocations.reduce((sum, loc) => sum + loc.deliveries, 0)} deliveries
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Routes Overview */}
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#22c55e' }} />
              <h2 style={{
                fontSize: '20px',
                fontFamily: 'Poppins, system-ui, sans-serif',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0
              }}>Routes Overview</h2>
            </div>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96797.57915830869!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Routes Legend */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>Active Routes</div>
                {routes.map((route, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '3px',
                      backgroundColor: route.color,
                      borderRadius: '2px'
                    }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '500' }}>{route.id}</span>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontWeight: '500',
                        backgroundColor: route.efficiency >= 90 ? '#dcfce7' : route.efficiency >= 85 ? '#fef3c7' : '#fef2f2',
                        color: route.efficiency >= 90 ? '#166534' : route.efficiency >= 85 ? '#92400e' : '#dc2626'
                      }}>
                        {route.efficiency}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;