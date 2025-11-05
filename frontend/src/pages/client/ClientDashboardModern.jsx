import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, Heart, User as UserIcon, Settings as SettingsIcon,
  MapPin, Clock, TrendingUp, ArrowUpRight
} from 'lucide-react';
import ClientSidebar from '../../components/client/ClientSidebar';
import SettingsSection from '../../components/dashboard/SettingsSection';
import { reservationAPI } from '../../services/api';

const ClientDashboardModern = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  
  const [stats, setStats] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    totalSpent: 0,
    favoriteTerrains: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [section]); // Recharger quand on change de section

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const reservationsResponse = await reservationAPI.getAll();
      const myReservations = reservationsResponse.data?.data || [];
      setReservations(myReservations);

      const confirmed = myReservations.filter(r => r.status === 'confirmed').length;
      const pending = myReservations.filter(r => r.status === 'pending').length;
      const totalSpent = myReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      setStats({
        totalReservations: myReservations.length,
        confirmedReservations: confirmed,
        pendingReservations: pending,
        totalSpent,
        favoriteTerrains: 0
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const statCards = [
    {
      title: 'Réservations',
      value: stats.totalReservations,
      subtitle: `${stats.confirmedReservations} confirmées`,
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Dépenses',
      value: `${formatPrice(stats.totalSpent)} FCFA`,
      subtitle: 'Total dépensé',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Favoris',
      value: stats.favoriteTerrains,
      subtitle: 'Terrains favoris',
      icon: Heart,
      color: 'purple'
    }
  ];

  const colorClasses = {
    green: { bg: 'bg-green-50', icon: 'text-green-600' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600' }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <ClientSidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
        <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} flex items-center justify-center bg-gray-50`}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 overflow-auto`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {section === 'overview' && 'Tableau de bord'}
              {section === 'reservations' && 'Mes Réservations'}
              {section === 'favorites' && 'Mes Favoris'}
              {section === 'profile' && 'Mon Profil'}
              {section === 'settings' && 'Paramètres'}
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenue {user?.firstName}, gérez vos réservations
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Cards (overview seulement) */}
          {section === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const colors = colorClasses[stat.color];
                
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colors.bg} p-3 rounded-xl`}>
                        <Icon className={colors.icon} size={24} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Layout 3 colonnes */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* COLONNE CENTRALE (2/3) */}
            <div className="lg:col-span-2">
              
              {/* VUE D'ENSEMBLE */}
              {section === 'overview' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Réservations Récentes</h2>
                  {reservations.length === 0 ? (
                    <div className="text-center py-16">
                      <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">Commencez par réserver un terrain</p>
                      <Link
                        to="/terrains"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        Voir les terrains
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reservations.slice(0, 5).map((reservation) => (
                        <div key={reservation._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{reservation.terrain?.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(reservation.date).toLocaleDateString('fr-FR')} · {reservation.startTime} - {reservation.endTime}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status === 'confirmed' ? 'Confirmée' :
                             reservation.status === 'pending' ? 'En attente' : 'Terminée'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MES RÉSERVATIONS */}
              {section === 'reservations' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Mes Réservations ({reservations.length})</h2>
                    <button
                      onClick={loadDashboardData}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Actualiser
                    </button>
                  </div>
                  {reservations.length === 0 ? (
                    <div className="p-12 text-center">
                      <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">Vous n'avez pas encore réservé de terrain</p>
                      <Link
                        to="/terrains"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        Explorer les terrains
                      </Link>
                    </div>
                  ) : (
                    <div className="p-6 space-y-4">
                      {reservations.map((reservation) => (
                        <div key={reservation._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{reservation.terrain?.name}</h3>
                              <p className="text-sm text-gray-600">{reservation.terrain?.address?.city}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status === 'confirmed' ? 'Confirmée' :
                               reservation.status === 'pending' ? 'En attente' :
                               reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(reservation.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Horaire</p>
                              <p className="font-medium text-gray-900">{reservation.startTime} - {reservation.endTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Durée</p>
                              <p className="font-medium text-gray-900">{reservation.duration}h</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Montant</p>
                              <p className="font-bold text-green-600">{formatPrice(reservation.totalPrice)} FCFA</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FAVORIS */}
              {section === 'favorites' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Mes Favoris</h2>
                  </div>
                  <div className="p-12 text-center">
                    <Heart className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun favori</h3>
                    <p className="text-gray-600">Ajoutez vos terrains préférés en favoris</p>
                  </div>
                </div>
              )}

              {/* PROFIL */}
              {section === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Mon Profil</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                        <p className="text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="text-green-600 hover:underline font-medium">
                      Modifier mon profil →
                    </Link>
                  </div>
                </div>
              )}

              {/* PARAMÈTRES */}
              {section === 'settings' && <SettingsSection />}
            </div>

            {/* COLONNE DROITE - Panneaux (1/3) */}
            <div className="space-y-6">
              {/* Statistiques */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">STATISTIQUES</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total réservations</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalReservations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Confirmées</p>
                    <p className="text-xl font-bold text-green-600">{stats.confirmedReservations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">En attente</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.pendingReservations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total dépensé</p>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(stats.totalSpent)} FCFA</p>
                  </div>
                </div>
              </div>

              {/* Prochaine Réservation */}
              {reservations.length > 0 && (
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4">PROCHAINE RÉSERVATION</h3>
                  <div className="space-y-2">
                    <p className="font-bold text-lg">{reservations[0].terrain?.name}</p>
                    <p className="text-green-100 text-sm">
                      {new Date(reservations[0].date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-green-100 text-sm">
                      {reservations[0].startTime} - {reservations[0].endTime}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Explorer */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">⚽ Réserver un terrain</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Découvrez les terrains disponibles près de chez vous
                </p>
                <Link
                  to="/terrains"
                  className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Explorer les terrains
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardModern;

