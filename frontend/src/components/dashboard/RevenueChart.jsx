import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ totalRevenue, monthlyRevenue }) => {
  const data = [
    { name: 'Ce mois', value: monthlyRevenue, color: '#10b981' },
    { name: 'Autres mois', value: totalRevenue - monthlyRevenue, color: '#e5e7eb' }
  ];

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}k`;
    }
    return price;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Revenus
        </h3>
        <span className="text-xs text-gray-400 font-medium">Ce mois</span>
      </div>

      {totalRevenue > 0 ? (
        <>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 font-medium">FCFA</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Ce mois</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {new Intl.NumberFormat('fr-FR').format(monthlyRevenue)} FCFA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Aucun revenu</p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;

