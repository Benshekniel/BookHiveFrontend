import { useState } from 'react';
import { Plus, Search, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/hubmanager/Card';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  const riders = [
    { id: 1, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567890', route: 'Route A', status: 'active', performance: 95 },
    { id: 2, name: 'Alex Brown', email: 'alex@example.com', phone: '+1234567891', route: 'Route B', status: 'active', performance: 88 },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', phone: '+1234567892', route: 'Route C', status: 'inactive', performance: 92 },
  ];

  const pendingRequests = [
    { id: 4, name: 'Tom Wilson', email: 'tom@example.com', phone: '+1234567893', appliedDate: '2024-01-15' },
    { id: 5, name: 'Lisa Garcia', email: 'lisa@example.com', phone: '+1234567894', appliedDate: '2024-01-14' },
  ];

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyles = {
    fontSize: '30px',
    fontFamily: 'Poppins, system-ui, sans-serif',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: 0
  };

  const subtitleStyles = {
    color: '#6b7280',
    marginTop: '8px',
    margin: 0
  };

  const addButtonStyles = {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  };

  const tabsContainerStyles = {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#f3f4f6',
    padding: '4px',
    borderRadius: '8px',
    width: 'fit-content'
  };

  const getTabStyles = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? 'white' : 'transparent',
    color: isActive ? '#1e3a8a' : '#6b7280',
    boxShadow: isActive ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
  });

  const searchContainerStyles = {
    position: 'relative',
    maxWidth: '384px'
  };

  const searchInputStyles = {
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    width: '100%',
    fontSize: '14px',
    outline: 'none'
  };

  const searchIconStyles = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '16px',
    height: '16px'
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  };

  const riderCardContentStyles = {
    padding: '24px'
  };

  const riderHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  };

  const riderInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyles = {
    width: '48px',
    height: '48px',
    backgroundColor: '#fbbf24',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const avatarTextStyles = {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: '14px'
  };

  const riderNameStyles = {
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    fontSize: '16px'
  };

  const getStatusBadgeStyles = (status) => ({
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '4px',
    backgroundColor: status === 'active' ? '#dcfce7' : '#f3f4f6',
    color: status === 'active' ? '#166534' : '#6b7280'
  });

  const moreButtonStyles = {
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  };

  const riderDetailsStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px'
  };

  const detailTextStyles = {
    color: '#6b7280',
    margin: 0
  };

  const performanceRowStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const performanceValueStyles = {
    fontWeight: '500',
    color: '#22c55e'
  };

  const actionsStyles = {
    marginTop: '16px',
    display: 'flex',
    gap: '8px'
  };

  const primaryButtonStyles = {
    flex: 1,
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const secondaryButtonStyles = {
    flex: 1,
    border: '1px solid #d1d5db',
    color: '#374151',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const pendingListStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const pendingCardStyles = {
    padding: '24px'
  };

  const pendingContentStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const pendingInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const pendingDetailsStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const pendingNameStyles = {
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    fontSize: '16px'
  };

  const pendingTextStyles = {
    color: '#6b7280',
    margin: 0,
    fontSize: '14px'
  };

  const pendingDateStyles = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0
  };

  const pendingActionsStyles = {
    display: 'flex',
    gap: '8px'
  };

  const approveButtonStyles = {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'background-color 0.2s ease'
  };

  const rejectButtonStyles = {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>Agents</h1>
          <p style={subtitleStyles}>Manage your delivery riders and their assignments</p>
        </div>
        <button 
          style={addButtonStyles}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e40af'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1e3a8a'}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Rider
        </button>
      </div>

      {/* Tabs */}
      <div style={tabsContainerStyles}>
        <button
          onClick={() => setActiveTab('active')}
          style={getTabStyles(activeTab === 'active')}
        >
          Active Riders
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={getTabStyles(activeTab === 'pending')}
        >
          Pending Requests
        </button>
      </div>

      {activeTab === 'active' && (
        <>
          {/* Search */}
          <div style={searchContainerStyles}>
            <Search style={searchIconStyles} />
            <input
              type="text"
              placeholder="Search riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyles}
              onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
              onBlur={(e) => e.target.style.outline = 'none'}
            />
          </div>

          {/* Riders Grid */}
          <div style={gridStyles}>
            {filteredRiders.map((rider) => (
              <Card key={rider.id}>
                <div style={riderCardContentStyles}>
                  <div style={riderHeaderStyles}>
                    <div style={riderInfoStyles}>
                      <div style={avatarStyles}>
                        <span style={avatarTextStyles}>
                          {rider.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 style={riderNameStyles}>{rider.name}</h3>
                        <span style={getStatusBadgeStyles(rider.status)}>
                          {rider.status}
                        </span>
                      </div>
                    </div>
                    <button style={moreButtonStyles}>
                      <MoreVertical style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  
                  <div style={riderDetailsStyles}>
                    <p style={detailTextStyles}>{rider.email}</p>
                    <p style={detailTextStyles}>{rider.phone}</p>
                    <p style={detailTextStyles}>Route: <span style={{ fontWeight: '500' }}>{rider.route}</span></p>
                    <div style={performanceRowStyles}>
                      <span style={detailTextStyles}>Performance:</span>
                      <span style={performanceValueStyles}>{rider.performance}%</span>
                    </div>
                  </div>

                  <div style={actionsStyles}>
                    <button 
                      style={primaryButtonStyles}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                      View Profile
                    </button>
                    <button 
                      style={secondaryButtonStyles}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Message
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'pending' && (
        <div style={pendingListStyles}>
          {pendingRequests.map((request) => (
            <Card key={request.id}>
              <div style={pendingCardStyles}>
                <div style={pendingContentStyles}>
                  <div style={pendingInfoStyles}>
                    <div style={avatarStyles}>
                      <span style={avatarTextStyles}>
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div style={pendingDetailsStyles}>
                      <h3 style={pendingNameStyles}>{request.name}</h3>
                      <p style={pendingTextStyles}>{request.email}</p>
                      <p style={pendingTextStyles}>{request.phone}</p>
                      <p style={pendingDateStyles}>Applied: {request.appliedDate}</p>
                    </div>
                  </div>
                  <div style={pendingActionsStyles}>
                    <button 
                      style={approveButtonStyles}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
                    >
                      <CheckCircle style={{ width: '16px', height: '16px' }} />
                      Approve
                    </button>
                    <button 
                      style={rejectButtonStyles}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;