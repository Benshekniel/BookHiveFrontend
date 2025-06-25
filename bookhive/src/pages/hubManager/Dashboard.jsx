import { Package, Users, Clock, AlertTriangle } from 'lucide-react';
import StatCard from '../../components/hubmanager/StatCard';
import Card from '../../components/hubmanager/Card';

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

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const headerStyles = {
    marginBottom: '8px'
  };

  const titleStyles = {
    fontSize: '30px',
    fontFamily: 'Poppins, system-ui, sans-serif',
    fontWeight: 'bold',
    color: '#0f172a'
  };

  const subtitleStyles = {
    color: '#6b7280',
    marginTop: '8px'
  };

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  };

  const contentGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  };

  const cardContentStyles = {
    padding: '24px'
  };

  const cardTitleStyles = {
    fontSize: '20px',
    fontFamily: 'Poppins, system-ui, sans-serif',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '16px'
  };

  const deliveryItemStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '16px'
  };

  const deliveryInfoStyles = {
    display: 'flex',
    flexDirection: 'column'
  };

  const deliveryIdStyles = {
    fontWeight: '500',
    color: '#0f172a'
  };

  const deliveryDetailsStyles = {
    fontSize: '14px',
    color: '#6b7280'
  };

  const deliveryStatusStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  };

  const statusBadgeStyles = {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  };

  const getStatusStyles = (status) => {
    const baseStyles = { ...statusBadgeStyles };
    switch (status) {
      case 'Delivered':
        return { ...baseStyles, backgroundColor: '#dcfce7', color: '#166534' };
      case 'In Transit':
        return { ...baseStyles, backgroundColor: '#dbeafe', color: '#1e40af' };
      default:
        return { ...baseStyles, backgroundColor: '#fef3c7', color: '#92400e' };
    }
  };

  const alertItemStyles = {
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '4px solid',
    marginBottom: '16px'
  };

  const getAlertStyles = (type) => {
    const baseStyles = { ...alertItemStyles };
    switch (type) {
      case 'error':
        return { ...baseStyles, backgroundColor: '#fef2f2', borderLeftColor: '#f87171' };
      case 'warning':
        return { ...baseStyles, backgroundColor: '#fffbeb', borderLeftColor: '#fbbf24' };
      default:
        return { ...baseStyles, backgroundColor: '#eff6ff', borderLeftColor: '#60a5fa' };
    }
  };

  const alertMessageStyles = {
    fontSize: '14px',
    color: '#0f172a'
  };

  const alertTimeStyles = {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px'
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Dashboard</h1>
        <p style={subtitleStyles}>Welcome back! Here's what's happening at your hub today.</p>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyles}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div style={contentGridStyles}>
        {/* Recent Deliveries */}
        <Card>
          <div style={cardContentStyles}>
            <h2 style={cardTitleStyles}>Recent Deliveries</h2>
            <div>
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} style={deliveryItemStyles}>
                  <div style={deliveryInfoStyles}>
                    <p style={deliveryIdStyles}>{delivery.id}</p>
                    <p style={deliveryDetailsStyles}>{delivery.customer} • {delivery.rider}</p>
                  </div>
                  <div style={deliveryStatusStyles}>
                    <span style={getStatusStyles(delivery.status)}>
                      {delivery.status}
                    </span>
                    <p style={{ ...deliveryDetailsStyles, marginTop: '4px' }}>{delivery.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div style={cardContentStyles}>
            <h2 style={cardTitleStyles}>Alerts & Notifications</h2>
            <div>
              {alerts.map((alert, index) => (
                <div key={index} style={getAlertStyles(alert.type)}>
                  <p style={alertMessageStyles}>{alert.message}</p>
                  <p style={alertTimeStyles}>{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;