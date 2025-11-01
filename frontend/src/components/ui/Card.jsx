export const Card = ({ children, className = '', hover = false, onClick }) => {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

