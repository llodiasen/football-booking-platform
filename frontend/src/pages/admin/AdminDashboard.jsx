import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  MapPin,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { reservationAPI, terrainAPI } from '../../services/api';

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalReservations: 0,
    activeTerrains: 0,
    totalCustomers: 0,
    revenueChange: 0,
    reservationsChange: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger les données (à adapter selon vos APIs)
      const reservations = await reservationAPI.getAll();
      const terrains = await terrainAPI.getAll({ limit: 100 });

      // Calculer les statistiques
      const totalRevenue = reservations.data?.data?.reduce((acc, res) => acc + (res.totalPrice || 0), 0) || 0;
      const totalReservations = reservations.data?.count || 0;
      const activeTerrains = terrains.data?.count || 0;

      setStats({
        totalRevenue,
        totalReservations,
        activeTerrains,
        totalCustomers: 0, // À implémenter
        revenueChange: 12.5, // Simulation
        reservationsChange: 8.3 // Simulation
      });

      setRecentReservations(reservations.data?.data?.slice(0, 10) || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const statCards = [
    {
      title: 'Revenus Totaux',
      value: `${formatPrice(stats.totalRevenue)} FCFA`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Réservations',
      value: stats.totalReservations,
      change: stats.reservationsChange,
      icon: Calendar,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Terrains Actifs',
      value: stats.activeTerrains,
      change: 0,
      icon: MapPin,
      color: 'purple',
      trend: null
    },
    {
      title: 'Clients',
      value: stats.totalCustomers,
      change: 15.2,
      icon: Users,
      color: 'yellow',
      trend: 'up'
    }
  ];

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      badge: 'bg-green-100 text-green-700'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-700'
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} flex items-center justify-center`}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 overflow-auto`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Vue d'ensemble de votre plateforme</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white">
                <option>Ce mois</option>
                <option>Cette semaine</option>
                <option>Aujourd'hui</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              const colors = colorClasses[stat.color];
              
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${colors.bg} p-3 rounded-xl`}>
                      <Icon className={colors.icon} size={24} />
                    </div>
                    {stat.trend && (
                      <div className={`flex items-center gap-1 ${colors.badge} px-2 py-1 rounded-full text-xs font-semibold`}>
                        {stat.trend === 'up' ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        <span>{stat.change}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Reservations - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Réservations Récentes</h2>
                  <Link to="/admin/reservations" className="text-sm font-semibold text-green-600 hover:text-green-700">
                    Voir tout →
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Réservation
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Montant
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentReservations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          Aucune réservation récente
                        </td>
                      </tr>
                    ) : (
                      recentReservations.map((reservation) => (
                        <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                #{reservation._id?.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(reservation.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">
                              {reservation.client?.firstName} {reservation.client?.lastName}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              reservation.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : reservation.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status === 'confirmed' ? 'Confirmée' :
                               reservation.status === 'pending' ? 'En attente' :
                               reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-semibold text-gray-900 text-sm">
                              {formatPrice(reservation.totalPrice)} FCFA
                            </p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Panels - Takes 1 column */}
            <div className="space-y-6">
              {/* Revenue Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Distribution Revenus</h3>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90 w-40 h-40">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#10b981"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(stats.totalRevenue / 3000000) * 440} 440`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(stats.totalRevenue / 1000)}k
                      </p>
                      <p className="text-xs text-gray-500">FCFA</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Confirmées</span>
                    </div>
                    <span className="font-semibold text-gray-900">89%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">En attente</span>
                    </div>
                    <span className="font-semibold text-gray-900">8%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Annulées</span>
                    </div>
                    <span className="font-semibold text-gray-900">3%</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu Rapide</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Réservation moyenne</span>
                    <span className="font-bold text-gray-900">25,500 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux d'occupation</span>
                    <span className="font-bold text-gray-900">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temps de réponse</span>
                    <span className="font-bold text-gray-900">12 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux annulation</span>
                    <span className="font-bold text-red-600">3.2%</span>
                  </div>
                </div>
              </div>

              {/* Top Terrains */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-4">🏆 Top Terrain du Mois</h3>
                <p className="text-2xl font-bold mb-2">SowFoot</p>
                <p className="text-green-100 text-sm mb-4">Dakar, Sénégal</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-100">Réservations</span>
                  <span className="font-bold">45 ce mois</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

