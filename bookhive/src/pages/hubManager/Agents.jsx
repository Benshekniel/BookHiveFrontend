import { useState } from 'react';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import Card from '../../components/hubmanager/Card';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  const riders = [
    {
      id: 1,
      agentId: 'A001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 234-567-8901',
      vehicle: 'Motorcycle',
      vehicleNumber: 'ABC-123',
      status: 'active',
      rating: 4.8,
      deliveries: 247
    },
    {
      id: 2,
      agentId: 'A002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 234-567-8902',
      vehicle: 'Bicycle',
      vehicleNumber: 'BIC-456',
      status: 'active',
      rating: 4.9,
      deliveries: 189
    },
    {
      id: 3,
      agentId: 'A003',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 234-567-8903',
      vehicle: 'Scooter',
      vehicleNumber: 'SCT-789',
      status: 'inactive',
      rating: 4.6,
      deliveries: 156
    },
    {
      id: 4,
      agentId: 'A004',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 234-567-8904',
      vehicle: 'Motorcycle',
      vehicleNumber: 'MOT-321',
      status: 'active',
      rating: 4.7,
      deliveries: 203
    },
    {
      id: 5,
      agentId: 'A005',
      name: 'Alex Brown',
      email: 'alex.brown@email.com',
      phone: '+1 234-567-8905',
      vehicle: 'Van',
      vehicleNumber: 'VAN-654',
      status: 'active',
      rating: 4.5,
      deliveries: 134
    }
  ];

  const pendingRequests = [
    { id: 6, name: 'Tom Wilson', email: 'tom@example.com', phone: '+1234567893', appliedDate: '2024-01-15' },
    { id: 7, name: 'Lisa Garcia', email: 'lisa@example.com', phone: '+1234567894', appliedDate: '2024-01-14' },
  ];

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.agentId.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Table Styles
  const tableContainerStyles = {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  };

  const tableHeaderStyles = {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb'
  };

  const thStyles = {
    padding: '16px 12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb'
  };

  const tbodyStyles = {
    backgroundColor: 'white'
  };

  const trStyles = {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease'
  };

  const tdStyles = {
    padding: '16px 12px',
    fontSize: '14px',
    color: '#0f172a',
    verticalAlign: 'middle'
  };

  const agentCellStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyles = {
    width: '40px',
    height: '40px',
    backgroundColor: '#fbbf24',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    flexShrink: 0
  };

  const agentInfoStyles = {
    display: 'flex',
    flexDirection: 'column'
  };

  const agentNameStyles = {
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    fontSize: '14px'
  };

  const agentIdStyles = {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  };

  const contactInfoStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const contactTextStyles = {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0
  };

  const vehicleInfoStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const vehicleTypeStyles = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#0f172a',
    margin: 0
  };

  const vehicleNumberStyles = {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  };

  const getStatusBadgeStyles = (status) => ({
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: status === 'active' ? '#dcfce7' : '#f3f4f6',
    color: status === 'active' ? '#166534' : '#6b7280',
    textTransform: 'capitalize'
  });

  const ratingStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const ratingValueStyles = {
    fontWeight: '600',
    color: '#0f172a'
  };

  const starStyles = {
    color: '#fbbf24',
    fontSize: '14px'
  };

  const deliveriesCountStyles = {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: '16px'
  };

  const actionsContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const actionButtonStyles = {
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const viewButtonStyles = {
    ...actionButtonStyles,
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  };

  const editButtonStyles = {
    ...actionButtonStyles,
    backgroundColor: '#fef3c7',
    color: '#d97706'
  };

  const messageButtonStyles = {
    ...actionButtonStyles,
    backgroundColor: '#dcfce7',
    color: '#166534'
  };

  const deleteButtonStyles = {
    ...actionButtonStyles,
    backgroundColor: '#fef2f2',
    color: '#dc2626'
  };

  const moreButtonStyles = {
    ...actionButtonStyles,
    backgroundColor: '#f3f4f6',
    color: '#6b7280'
  };

  // Pending requests styles (keeping the card format for pending)
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

      {/* Riders Table */}
      <div style={tableContainerStyles}>
        <table style={tableStyles}>
          <thead style={tableHeaderStyles}>
            <tr>
              <th style={thStyles}>AGENT</th>
              <th style={thStyles}>CONTACT</th>
              <th style={thStyles}>VEHICLE</th>
              <th style={thStyles}>STATUS</th>
              <th style={thStyles}>RATING</th>
              <th style={thStyles}>DELIVERIES</th>
              <th style={thStyles}>ACTIONS</th>
            </tr>
          </thead>
          <tbody style={tbodyStyles}>
            {filteredRiders.map((rider) => (
              <tr
                key={rider.id}
                style={trStyles}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <td style={tdStyles}>
                  <div style={agentCellStyles}>
                    <div style={avatarStyles}>
                      {rider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={agentInfoStyles}>
                      <p style={agentNameStyles}>{rider.name}</p>
                      <p style={agentIdStyles}>{rider.agentId}</p>
                    </div>
                  </div>
                </td>
                <td style={tdStyles}>
                  <div style={contactInfoStyles}>
                    <p style={contactTextStyles}>{rider.phone}</p>
                    <p style={contactTextStyles}>{rider.email}</p>
                  </div>
                </td>
                <td style={tdStyles}>
                  <div style={vehicleInfoStyles}>
                    <p style={vehicleTypeStyles}>{rider.vehicle}</p>
                    <p style={vehicleNumberStyles}>{rider.vehicleNumber}</p>
                  </div>
                </td>
                <td style={tdStyles}>
                  <span style={getStatusBadgeStyles(rider.status)}>
                    {rider.status}
                  </span>
                </td>
                <td style={tdStyles}>
                  <div style={ratingStyles}>
                    <span style={ratingValueStyles}>{rider.rating}</span>
                    <span style={starStyles}>★</span>
                  </div>
                </td>
                <td style={tdStyles}>
                  <span style={deliveriesCountStyles}>{rider.deliveries}</span>
                </td>
                <td style={tdStyles}>
                  <div style={actionsContainerStyles}>
                    <button
                      style={viewButtonStyles}
                      title="View Profile"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dbeafe'}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      style={editButtonStyles}
                      title="Edit"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#fde68a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#fef3c7'}
                    >
                      <Edit style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      style={messageButtonStyles}
                      title="Message"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#bbf7d0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dcfce7'}
                    >
                      <MessageSquare style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      style={deleteButtonStyles}
                      title="Delete"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#fecaca'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#fef2f2'}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      style={moreButtonStyles}
                      title="More Options"
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    >
                      <MoreVertical style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents;