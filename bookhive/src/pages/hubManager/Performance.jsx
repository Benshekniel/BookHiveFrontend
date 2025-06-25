import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import StatCard from '../../components/hubmanager/StatCard';
import Card from '../../components/hubmanager/Card';


const Performance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('deliveries');

  const performanceStats = [
    { title: 'Total Deliveries', value: '1,247', icon: BarChart3, color: '#3b82f6', change: '+12%', trend: 'up' },
    { title: 'Success Rate', value: '94.2%', icon: TrendingUp, color: '#22c55e', change: '+2.1%', trend: 'up' },
    { title: 'Avg Delivery Time', value: '28 min', icon: Calendar, color: '#fbbf24', change: '-3 min', trend: 'up' },
    { title: 'Customer Rating', value: '4.8/5', icon: TrendingUp, color: '#22c55e', change: '+0.2', trend: 'up' },
  ];

  const riderPerformance = [
    { name: 'Mike Johnson', deliveries: 156, successRate: 98, avgTime: 25, rating: 4.9 },
    { name: 'Alex Brown', deliveries: 142, successRate: 95, avgTime: 27, rating: 4.8 },
    { name: 'Emma Davis', deliveries: 138, successRate: 96, avgTime: 26, rating: 4.7 },
    { name: 'Tom Wilson', deliveries: 89, successRate: 92, avgTime: 32, rating: 4.6 },
  ];

  const routePerformance = [
    { route: 'Route A - Downtown', deliveries: 425, efficiency: 92, avgTime: 24 },
    { route: 'Route B - Residential North', deliveries: 356, efficiency: 88, avgTime: 28 },
    { route: 'Route C - Industrial Zone', deliveries: 298, efficiency: 85, avgTime: 35 },
  ];

  const weeklyData = [
    { day: 'Mon', deliveries: 45, success: 43 },
    { day: 'Tue', deliveries: 52, success: 49 },
    { day: 'Wed', deliveries: 48, success: 46 },
    { day: 'Thu', deliveries: 61, success: 58 },
    { day: 'Fri', deliveries: 55, success: 52 },
    { day: 'Sat', deliveries: 38, success: 36 },
    { day: 'Sun', deliveries: 32, success: 30 },
  ];

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

  const headerActionsStyles = {
    display: 'flex',
    gap: '12px'
  };

  const selectStyles = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  };

  const exportButtonStyles = {
    backgroundColor: '#3b82f6',
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

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  };

  const statCardStyles = {
    padding: '24px'
  };

  const statHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const statContentStyles = {
    display: 'flex',
    flexDirection: 'column'
  };

  const statTitleStyles = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    margin: 0
  };

  const statValueStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: '4px',
    margin: 0
  };

  const statChangeStyles = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px'
  };

  const statChangeTextStyles = {
    fontSize: '14px',
    fontWeight: '500',
    marginLeft: '4px'
  };

  const statChangeSubtextStyles = {
    fontSize: '14px',
    color: '#9ca3af',
    marginLeft: '4px'
  };

  const statIconContainerStyles = {
    padding: '12px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6'
  };

  const contentGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  };

  const chartCardStyles = {
    padding: '24px'
  };

  const chartHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  };

  const chartTitleStyles = {
    fontSize: '20px',
    fontFamily: 'Poppins, system-ui, sans-serif',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0
  };

  const legendStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '14px'
  };

  const legendItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const legendDotStyles = {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  };

  const chartContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const chartRowStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const dayLabelStyles = {
    width: '48px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280'
  };

  const barContainerStyles = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const barBackgroundStyles = {
    flex: 1,
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '24px',
    position: 'relative'
  };

  const getBarStyles = (value, max, color) => ({
    backgroundColor: color,
    height: '24px',
    borderRadius: '9999px',
    width: `${(value / max) * 100}%`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '8px'
  });

  const barValueStyles = {
    color: 'white',
    fontSize: '12px',
    fontWeight: '500'
  };

  const routeCardStyles = {
    padding: '24px'
  };

  const routeListStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const routeItemStyles = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  };

  const routeHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };

  const routeNameStyles = {
    fontWeight: '500',
    color: '#0f172a',
    fontSize: '16px',
    margin: 0
  };

  const getEfficiencyBadgeStyles = (efficiency) => {
    let bgColor, textColor;
    if (efficiency >= 90) {
      bgColor = '#dcfce7';
      textColor = '#166534';
    } else if (efficiency >= 85) {
      bgColor = '#fef3c7';
      textColor = '#92400e';
    } else {
      bgColor = '#fef2f2';
      textColor = '#dc2626';
    }
    
    return {
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: bgColor,
      color: textColor
    };
  };

  const routeStatsStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    fontSize: '14px'
  };

  const routeStatStyles = {
    display: 'flex',
    justifyContent: 'space-between'
  };

  const routeStatLabelStyles = {
    color: '#6b7280'
  };

  const routeStatValueStyles = {
    fontWeight: '500',
    color: '#0f172a'
  };

  const tableCardStyles = {
    padding: '24px'
  };

  const tableHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  };

  const filterButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const tableHeadStyles = {
    borderBottom: '1px solid #e5e7eb'
  };

  const thStyles = {
    textAlign: 'left',
    padding: '12px 16px',
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px'
  };

  const tbodyStyles = {
    
  };

  const trStyles = {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s ease'
  };

  const tdStyles = {
    padding: '12px 16px',
    fontSize: '14px'
  };

  const riderCellStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const riderAvatarStyles = {
    width: '32px',
    height: '32px',
    backgroundColor: '#fbbf24',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const riderAvatarTextStyles = {
    color: '#0f172a',
    fontWeight: '500',
    fontSize: '14px'
  };

  const riderNameStyles = {
    fontWeight: '500',
    color: '#0f172a'
  };

  const getSuccessRateBadgeStyles = (rate) => {
    let bgColor, textColor;
    if (rate >= 95) {
      bgColor = '#dcfce7';
      textColor = '#166534';
    } else if (rate >= 90) {
      bgColor = '#fef3c7';
      textColor = '#92400e';
    } else {
      bgColor = '#fef2f2';
      textColor = '#dc2626';
    }
    
    return {
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: bgColor,
      color: textColor
    };
  };

  const ratingStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const ratingValueStyles = {
    color: '#0f172a',
    fontWeight: '500'
  };

  const starStyles = {
    color: '#fbbf24'
  };

  const progressBarContainerStyles = {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '8px'
  };

  const getProgressBarStyles = (rate, color) => ({
    height: '8px',
    borderRadius: '9999px',
    width: `${rate}%`,
    backgroundColor: color
  });

  const getProgressBarColor = (rate) => {
    if (rate >= 95) return '#22c55e';
    if (rate >= 90) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div>
          <h1 style={titleStyles}>Performance Analytics</h1>
          <p style={subtitleStyles}>Track and analyze your hub's operational performance</p>
        </div>
        <div style={headerActionsStyles}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={selectStyles}
            onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
            onBlur={(e) => e.target.style.outline = 'none'}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            style={exportButtonStyles}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div style={statsGridStyles}>
        {performanceStats.map((stat, index) => (
          <Card key={index}>
            <div style={statCardStyles}>
              <div style={statHeaderStyles}>
                <div style={statContentStyles}>
                  <p style={statTitleStyles}>{stat.title}</p>
                  <p style={statValueStyles}>{stat.value}</p>
                  <div style={statChangeStyles}>
                    {stat.trend === 'up' ? (
                      <TrendingUp style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                    ) : (
                      <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                    )}
                    <span style={{
                      ...statChangeTextStyles,
                      color: stat.trend === 'up' ? '#22c55e' : '#ef4444'
                    }}>
                      {stat.change}
                    </span>
                    <span style={statChangeSubtextStyles}>vs last period</span>
                  </div>
                </div>
                <div style={statIconContainerStyles}>
                  <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={contentGridStyles}>
        {/* Weekly Performance Chart */}
        <Card>
          <div style={chartCardStyles}>
            <div style={chartHeaderStyles}>
              <h2 style={chartTitleStyles}>Weekly Performance</h2>
              <div style={legendStyles}>
                <div style={legendItemStyles}>
                  <div style={{ ...legendDotStyles, backgroundColor: '#3b82f6' }}></div>
                  <span style={{ color: '#6b7280' }}>Total Deliveries</span>
                </div>
                <div style={legendItemStyles}>
                  <div style={{ ...legendDotStyles, backgroundColor: '#22c55e' }}></div>
                  <span style={{ color: '#6b7280' }}>Successful</span>
                </div>
              </div>
            </div>
            
            <div style={chartContentStyles}>
              {weeklyData.map((data, index) => (
                <div key={index} style={chartRowStyles}>
                  <div style={dayLabelStyles}>{data.day}</div>
                  <div style={barContainerStyles}>
                    <div style={barBackgroundStyles}>
                      <div style={getBarStyles(data.deliveries, 70, '#3b82f6')}>
                        <span style={barValueStyles}>{data.deliveries}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Route Performance */}
        <Card>
          <div style={routeCardStyles}>
            <h2 style={chartTitleStyles}>Route Performance</h2>
            <div style={routeListStyles}>
              {routePerformance.map((route, index) => (
                <div key={index} style={routeItemStyles}>
                  <div style={routeHeaderStyles}>
                    <h3 style={routeNameStyles}>{route.route}</h3>
                    <span style={getEfficiencyBadgeStyles(route.efficiency)}>
                      {route.efficiency}% Efficient
                    </span>
                  </div>
                  <div style={routeStatsStyles}>
                    <div style={routeStatStyles}>
                      <span style={routeStatLabelStyles}>Deliveries:</span>
                      <span style={routeStatValueStyles}>{route.deliveries}</span>
                    </div>
                    <div style={routeStatStyles}>
                      <span style={routeStatLabelStyles}>Avg Time:</span>
                      <span style={routeStatValueStyles}>{route.avgTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Rider Performance Table */}
      <Card>
        <div style={tableCardStyles}>
          <div style={tableHeaderStyles}>
            <h2 style={chartTitleStyles}>Rider Performance</h2>
            <button 
              style={filterButtonStyles}
              onMouseEnter={(e) => e.target.style.color = '#1e40af'}
              onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
            >
              <Filter style={{ width: '16px', height: '16px' }} />
              Filter
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyles}>
              <thead style={tableHeadStyles}>
                <tr>
                  <th style={thStyles}>Rider</th>
                  <th style={thStyles}>Deliveries</th>
                  <th style={thStyles}>Success Rate</th>
                  <th style={thStyles}>Avg Time</th>
                  <th style={thStyles}>Rating</th>
                  <th style={thStyles}>Performance</th>
                </tr>
              </thead>
              <tbody style={tbodyStyles}>
                {riderPerformance.map((rider, index) => (
                  <tr 
                    key={index} 
                    style={trStyles}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <td style={tdStyles}>
                      <div style={riderCellStyles}>
                        <div style={riderAvatarStyles}>
                          <span style={riderAvatarTextStyles}>
                            {rider.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span style={riderNameStyles}>{rider.name}</span>
                      </div>
                    </td>
                    <td style={tdStyles}>{rider.deliveries}</td>
                    <td style={tdStyles}>
                      <span style={getSuccessRateBadgeStyles(rider.successRate)}>
                        {rider.successRate}%
                      </span>
                    </td>
                    <td style={tdStyles}>{rider.avgTime} min</td>
                    <td style={tdStyles}>
                      <div style={ratingStyles}>
                        <span style={ratingValueStyles}>{rider.rating}</span>
                        <span style={starStyles}>★</span>
                      </div>
                    </td>
                    <td style={tdStyles}>
                      <div style={progressBarContainerStyles}>
                        <div style={getProgressBarStyles(rider.successRate, getProgressBarColor(rider.successRate))}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Performance;