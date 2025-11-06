import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Heart, User as UserIcon, Settings as SettingsIcon,
  MapPin, Clock, TrendingUp, ArrowUpRight, CheckCircle, Eye, X,
  Home, Users, Plus
} from 'lucide-react';
import ClientSidebar from '../../components/client/ClientSidebar';
import SettingsSection from '../../components/dashboard/SettingsSection';
import NotificationsPanel from '../../components/notifications/NotificationsPanel';
import NotificationDropdown from '../../components/notifications/NotificationDropdown';
import MessagesPanel from '../../components/messages/MessagesPanel';
import TeamFormModal from '../../components/team/TeamFormModal';
import { reservationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';

const ClientDashboardModern = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  
  const [stats, setStats] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    totalSpent: 0,
    favoriteTerrains: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [section]);

  // Fermer le menu "Créer" quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCreateMenu && !event.target.closest('.create-menu-container')) {
        setShowCreateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCreateMenu]);

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

  const handleCancelReservation = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    const reason = prompt('Raison de l\'annulation (optionnel) :');
    
    try {
      await reservationAPI.cancel(id, reason);
      showSuccess('Réservation annulée avec succès');
      loadDashboardData();
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const canCancelReservation = (reservation) => {
    if (reservation.status !== 'pending' && reservation.status !== 'confirmed') {
      return false;
    }

    const reservationDateTime = new Date(reservation.date);
    const [startHour, startMin] = reservation.startTime.split(':').map(Number);
    reservationDateTime.setHours(startHour, startMin, 0, 0);
    
    const now = new Date();
    const hoursUntilReservation = (reservationDateTime - now) / (1000 * 60 * 60);
    
    return hoursUntilReservation > 2;
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
      color: 'green',
      link: '/dashboard?section=reservations'
    },
    {
      title: 'Dépenses',
      value: stats.totalSpent > 0 ? `${formatPrice(stats.totalSpent)} FCFA` : '0 FCFA',
      subtitle: 'Total dépensé',
      icon: TrendingUp,
      color: 'blue',
      change: null
    },
    {
      title: 'En attente',
      value: stats.pendingReservations,
      subtitle: 'Réservations en attente',
      icon: Clock,
      color: 'yellow',
      link: '/dashboard?section=reservations'
    },
    {
      title: 'Favoris',
      value: stats.favoriteTerrains,
      subtitle: 'Terrains favoris',
      icon: Heart,
      color: 'purple',
      link: '/dashboard?section=favorites'
    }
  ];

  const colorClasses = {
    green: { bg: 'bg-green-50', icon: 'text-green-600' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
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
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Logo et Titre */}
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base">
                  221
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                    {section === 'overview' && 'Tableau de bord'}
                    {section === 'reservations' && 'Mes Réservations'}
                    {section === 'favorites' && 'Mes Favoris'}
                    {section === 'notifications' && 'Notifications'}
                    {section === 'messages' && 'Messages'}
                    {section === 'teams' && 'Mes Équipes'}
                    {section === 'profile' && 'Mon Profil'}
                    {section === 'settings' && 'Paramètres'}
                  </h1>
                </div>
              </div>

              {/* Actions Header */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Bouton Accueil - Desktop */}
                <Link
                  to="/"
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home size={20} />
                  <span>Accueil</span>
                </Link>

                {/* Menu Créer (dropdown) */}
                <div className="relative create-menu-container">
                  <button
                    onClick={() => setShowCreateMenu(!showCreateMenu)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 md:gap-2 text-sm md:text-base shadow-sm"
                  >
                    <Plus size={16} className="md:w-5 md:h-5" />
                    <span>Créer</span>
                  </button>

                  {/* Menu déroulant */}
                  {showCreateMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                      <button
                        onClick={() => {
                          setShowCreateMenu(false);
                          // TODO: Ouvrir modal de création de match
                          showSuccess('Fonctionnalité "Créer un match" à venir');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Calendar size={18} className="text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Créer un match</p>
                          <p className="text-xs text-gray-500">Organiser une rencontre</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowCreateMenu(false);
                          setShowTeamModal(true);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Users size={18} className="text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Créer une équipe</p>
                          <p className="text-xs text-gray-500">Former votre équipe</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowCreateMenu(false);
                          navigate('/search');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <MapPin size={18} className="text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Réserver un terrain</p>
                          <p className="text-xs text-gray-500">Trouver un terrain disponible</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Avatar mobile */}
                <div className="md:hidden w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards (overview seulement) - Design moderne */}
          {section === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const colors = colorClasses[stat.color];
                
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => stat.link && navigate(stat.link)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colors.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                        <Icon className={colors.icon} size={24} />
                      </div>
                      {stat.change && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          +{stat.change}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.subtitle}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Activité récente - Section overview uniquement */}
          {section === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Total Réservations */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stats.totalReservations} réservations
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">Total de vos réservations</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle size={14} />
                        {stats.confirmedReservations} confirmées
                      </span>
                      {stats.pendingReservations > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
                          <Clock size={14} />
                          {stats.pendingReservations} en attente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dépenses */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {formatPrice(stats.totalSpent)} FCFA
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">Total dépensé</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-medium">
                        {stats.totalReservations > 0 
                          ? `${formatPrice(Math.round(stats.totalSpent / stats.totalReservations))} FCFA/réservation`
                          : 'Aucune dépense'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout 3 colonnes (Messages prend toute la largeur) */}
          <div className={`grid ${section === 'messages' ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
            {/* COLONNE CENTRALE (2/3, 100% pour Messages) */}
            <div className={section === 'messages' ? 'col-span-1' : 'lg:col-span-2'}>
              
              {/* VUE D'ENSEMBLE */}
              {section === 'overview' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Réservations Récentes</h2>
                        <p className="text-sm text-gray-600">Vos 5 dernières réservations</p>
                      </div>
                      <Link
                        to="/dashboard?section=reservations"
                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        Voir tout
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {reservations.length === 0 ? (
                    <div className="text-center py-16 px-6">
                      <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">Découvrez nos terrains et réservez dès maintenant</p>
                      <Link
                        to="/terrains"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                      >
                        <Calendar size={20} />
                        Explorer les terrains
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {reservations.slice(0, 5).map((reservation) => (
                        <div key={reservation._id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h4 className="font-semibold text-gray-900 truncate">{reservation.terrain?.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  reservation.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {reservation.status === 'confirmed' ? 'Confirmée' :
                                   reservation.status === 'pending' ? 'En attente' :
                                   reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(reservation.date).toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {reservation.startTime} - {reservation.endTime}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-green-600">
                                  {reservation.finalPrice?.toLocaleString()} FCFA
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MES RÉSERVATIONS - Liste complète */}
              {section === 'reservations' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Toutes mes réservations</h2>
                        <p className="text-sm text-gray-600 mt-1">{reservations.length} réservation{reservations.length > 1 ? 's' : ''}</p>
                      </div>
                      <button
                        onClick={loadDashboardData}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                      >
                        Actualiser
                      </button>
                    </div>
                  </div>

                  {reservations.length === 0 ? (
                    <div className="p-12 text-center">
                      <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
                      <p className="text-gray-600 mb-6">Vous n'avez pas encore réservé de terrain</p>
                      <Link
                        to="/terrains"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-colors"
                      >
                        Explorer les terrains
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {reservations.map((reservation) => (
                        <div key={reservation._id} className="p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Image */}
                            <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                              {reservation.terrain?.images?.[0]?.url ? (
                                <img
                                  src={reservation.terrain.images[0].url}
                                  alt={reservation.terrain.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <MapPin className="text-gray-400" size={32} />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {reservation.terrain?.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {reservation.terrain?.address?.city}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  reservation.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {reservation.status === 'confirmed' ? 'Confirmée' :
                                   reservation.status === 'pending' ? 'En attente' :
                                   reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <Calendar size={16} className="flex-shrink-0" />
                                  <span>
                                    {new Date(reservation.date).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <Clock size={16} className="flex-shrink-0" />
                                  <span>{reservation.startTime} - {reservation.endTime}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <TrendingUp size={16} className="flex-shrink-0" />
                                  <span className="font-semibold">{reservation.finalPrice?.toLocaleString()} FCFA</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Link to={`/terrains/${reservation.terrain._id}`}>
                                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    <Eye size={16} className="mr-2" />
                                    Voir le terrain
                                  </Button>
                                </Link>

                                {canCancelReservation(reservation) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelReservation(reservation._id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                                  >
                                    <X size={16} className="mr-2" />
                                    Annuler
                                  </Button>
                                )}
                              </div>
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
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Mes Favoris</h2>
                  </div>
                  <div className="p-12 text-center">
                    <Heart className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun favori</h3>
                    <p className="text-gray-600">Ajoutez vos terrains préférés en favoris</p>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {section === 'notifications' && <NotificationsPanel />}

              {/* MESSAGES */}
              {section === 'messages' && <MessagesPanel />}

              {/* ÉQUIPES */}
              {section === 'teams' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Mes Équipes</h2>
                        <p className="text-sm text-gray-600 mt-1">Gérez vos équipes de football</p>
                      </div>
                      <button
                        onClick={() => setShowTeamModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Créer une équipe
                      </button>
                    </div>
                  </div>
                  <div className="p-12 text-center">
                    <Users className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune équipe</h3>
                    <p className="text-gray-600 mb-6">Créez votre première équipe pour jouer avec vos amis</p>
                    <button
                      onClick={() => setShowTeamModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors"
                    >
                      <Plus size={20} />
                      Créer une équipe
                    </button>
                  </div>
                </div>
              )}

              {/* PROFIL */}
              {section === 'profile' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
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

            {/* COLONNE DROITE - Panneaux (1/3) - Design épuré moderne (masquée pour Messages) */}
            {section !== 'messages' && (
              <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              {/* Statistiques personnelles - Design moderne */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">MES STATISTIQUES</h3>
                
                <div className="space-y-5">
                  <div className="pb-4 border-b border-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Total réservations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
                  </div>

                  <div className="pb-4 border-b border-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Confirmées</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-green-600">{stats.confirmedReservations}</p>
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="pb-4 border-b border-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">En attente</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-yellow-600">{stats.pendingReservations}</p>
                      <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <Clock className="text-yellow-600" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Total dépensé</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(stats.totalSpent)} 
                      <span className="text-sm text-gray-500 font-normal ml-1">FCFA</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Prochaine Réservation - Card gradient */}
              {reservations.length > 0 && reservations.some(r => r.status === 'confirmed' || r.status === 'pending') && (
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">PROCHAINE RÉSERVATION</h3>
                  {(() => {
                    const upcoming = reservations
                      .filter(r => (r.status === 'confirmed' || r.status === 'pending') && new Date(r.date) >= new Date())
                      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
                    
                    if (!upcoming) return null;

                    return (
                      <div>
                        <h4 className="font-bold text-lg mb-2">{upcoming.terrain?.name}</h4>
                        <div className="space-y-2 text-sm opacity-90">
                          <p className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(upcoming.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock size={14} />
                            {upcoming.startTime} - {upcoming.endTime}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Actions rapides */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">ACTIONS RAPIDES</h3>
                <div className="space-y-3">
                  <Link
                    to="/terrains"
                    className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Réserver un terrain
                  </Link>
                  <Link
                    to="/teams"
                    className="w-full block text-center bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm border border-gray-200 transition-colors"
                  >
                    Voir les équipes
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <h3 className="text-sm font-bold text-blue-900 mb-2">
                  💡 Besoin d'aide ?
                </h3>
                <p className="text-xs text-blue-800 mb-3">
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
            )}
          </div>
        </div>
      </div>

      {/* Modal de création d'équipe */}
      {showTeamModal && (
        <TeamFormModal
          onClose={() => setShowTeamModal(false)}
          onSuccess={(team) => {
            showSuccess(`Équipe "${team.name}" créée avec succès !`);
            navigate('/teams');
          }}
        />
      )}
    </div>
  );
};

export default ClientDashboardModern;
