import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  onClick,
  className = '' 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        group relative bg-white rounded-2xl p-6 
        border border-gray-100 
        hover:border-gray-200
        transition-all duration-300 
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : 'hover:shadow-md'}
        ${className}
      `}
    >
      {/* Icon Circle */}
      <div className="flex items-start justify-between mb-5">
        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          {Icon && <Icon className="text-gray-700" size={22} strokeWidth={2} />}
        </div>
        
        {/* Trend Badge */}
        {trend && trendValue && (
          <div className={`
            flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
            ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
          `}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Hover indicator */}
      {onClick && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="text-gray-400" size={16} />
        </div>
      )}
    </div>
  );
};

export default StatCard;

