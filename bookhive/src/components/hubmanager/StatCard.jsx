import Card from './Card';

const StatCard = ({ title, value, icon: Icon, color = '#3b82f6' }) => {
  const cardContentStyles = {
    padding: '24px'
  };

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyles = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280'
  };

  const valueStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: '4px'
  };

  const iconContainerStyles = {
    padding: '12px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6'
  };

  const iconStyles = {
    width: '24px',
    height: '24px',
    color: color
  };

  return (
    <Card>
      <div style={cardContentStyles}>
        <div style={containerStyles}>
          <div style={textContainerStyles}>
            <p style={titleStyles}>{title}</p>
            <p style={valueStyles}>{value}</p>
          </div>
          <div style={iconContainerStyles}>
            <Icon style={iconStyles} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;