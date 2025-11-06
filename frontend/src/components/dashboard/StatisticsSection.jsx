import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const StatisticsSection = ({ terrains, reservations, stats }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [reservationsByTerrain, setReservationsByTerrain] = useState([]);
  const [reservationsByDay, setReservationsByDay] = useState([]);
  const [reservationStatusData, setReservationStatusData] = useState([]);

  useEffect(() => {
    if (reservations && reservations.length > 0) {
      // Données de revenus par mois (6 derniers mois)
      const monthlyRevenue = calculateMonthlyRevenue();
      setRevenueData(monthlyRevenue);

      // Réservations par terrain
      const terrainStats = calculateReservationsByTerrain();
      setReservationsByTerrain(terrainStats);

      // Réservations par jour de la semaine
      const dayStats = calculateReservationsByDay();
      setReservationsByDay(dayStats);

      // Statut des réservations
      const statusStats = calculateReservationStatus();
      setReservationStatusData(statusStats);
    }
  }, [reservations, terrains]);

  const calculateMonthlyRevenue = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[monthDate.getMonth()];
      
      const monthRevenue = reservations
        .filter(r => {
          const resDate = new Date(r.date);
          return resDate.getMonth() === monthDate.getMonth() &&
                 resDate.getFullYear() === monthDate.getFullYear() &&
                 (r.status === 'confirmed' || r.status === 'completed');
        })
        .reduce((sum, r) => sum + (r.finalPrice || r.totalPrice || 0), 0);

      data.push({
        name: monthName,
        revenus: monthRevenue / 1000 // En milliers
      });
    }

    return data;
  };

  const calculateReservationsByTerrain = () => {
    if (!terrains || terrains.length === 0) return [];

    return terrains.slice(0, 5).map(terrain => {
      const count = reservations.filter(r => 
        r.terrain?._id === terrain._id || r.terrain === terrain._id
      ).length;

      return {
        name: terrain.name.length > 15 ? terrain.name.substring(0, 15) + '...' : terrain.name,
        réservations: count
      };
    }).filter(t => t.réservations > 0);
  };

  const calculateReservationsByDay = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    reservations.forEach(r => {
      const date = new Date(r.date);
      let dayIndex = date.getDay() - 1; // Convertir dimanche (0) -> 6
      if (dayIndex === -1) dayIndex = 6;
      dayCounts[dayIndex]++;
    });

    return days.map((day, index) => ({
      name: day,
      réservations: dayCounts[index]
    }));
  };

  const calculateReservationStatus = () => {
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const completed = reservations.filter(r => r.status === 'completed').length;

    return [
      { name: 'Confirmées', value: confirmed, color: '#10b981' },
      { name: 'En attente', value: pending, color: '#f59e0b' },
      { name: 'Terminées', value: completed, color: '#3b82f6' },
      { name: 'Annulées', value: cancelled, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  if (!reservations || reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune donnée disponible</h3>
        <p className="text-gray-600">
          Les statistiques apparaîtront ici une fois que vous aurez des réservations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="opacity-80" size={24} />
            <span className="text-xs font-medium opacity-80">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{formatPrice(stats.totalRevenue)}</p>
          <p className="text-sm opacity-80">Revenus FCFA</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="opacity-80" size={24} />
            <span className="text-xs font-medium opacity-80">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalBookings}</p>
          <p className="text-sm opacity-80">Réservations</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="opacity-80" size={24} />
            <span className="text-xs font-medium opacity-80">Unique</span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {new Set(reservations.map(r => r.client?._id || r.client)).size}
          </p>
          <p className="text-sm opacity-80">Clients</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="opacity-80" size={24} />
            <span className="text-xs font-medium opacity-80">Moyenne</span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats.totalTerrains > 0 
              ? formatPrice(Math.round(stats.totalRevenue / stats.totalTerrains))
              : '0'
            }
          </p>
          <p className="text-sm opacity-80">FCFA/Terrain</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Revenus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Évolution des revenus (6 derniers mois)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip 
                formatter={(value) => [`${formatPrice(value * 1000)} FCFA`, 'Revenus']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenus" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique Réservations par terrain */}
        {reservationsByTerrain.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Réservations par terrain
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reservationsByTerrain}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="réservations" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Graphique Réservations par jour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Réservations par jour de la semaine
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="réservations" 
                fill="#8b5cf6" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique Statut des réservations (Pie Chart) */}
        {reservationStatusData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Répartition par statut
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reservationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reservationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Réservations']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsSection;

