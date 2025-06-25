const Card = ({ children, className = '' }) => {
  const cardStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  return (
    <div style={cardStyles} className={className}>
      {children}
    </div>
  );
};

export default Card;