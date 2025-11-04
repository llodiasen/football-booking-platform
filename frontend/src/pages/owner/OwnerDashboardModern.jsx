import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { terrainAPI, reservationAPI } from '../../services/api';
import { 
  Plus, MapPin, Calendar, DollarSign, Eye, TrendingUp,
  ArrowUpRight, Edit, Trash2, Settings as SettingsIcon,
  CheckCircle, Clock, XCircle, AlertCircle, Home, Bell, LogOut, BarChart3
} from 'lucide-react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import TerrainFormModal from '../../components/owner/TerrainFormModal';
import AvailabilityManager from '../../components/owner/AvailabilityManager';
import SettingsSection from '../../components/dashboard/SettingsSection';
import ReservationsTable from '../../components/owner/ReservationsTable';

const OwnerDashboardModern = () => {
  const { user, logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const section = searchParams.get('section') || 'overview';
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTerrainForm, setShowTerrainForm] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [terrains, setTerrains] = useState([]);
  const [selectedTerrainForAvailability, setSelectedTerrainForAvailability] = useState(null);
  
  const [stats, setStats] = useState({
    totalTerrains: 0,
    approvedTerrains: 0,
    pendingTerrains: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    reservationRate: 0,
    revenueChange: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger les terrains
      const terrainsResponse = await terrainAPI.getOwnerTerrains();
      const myTerrains = terrainsResponse.data.data;
      setTerrains(myTerrains);

      const totalTerrains = myTerrains.length;
      const approvedTerrains = myTerrains.filter(t => t.isApproved).length;
      const pendingTerrains = myTerrains.filter(t => !t.isApproved).length;
      const totalViews = myTerrains.reduce((sum, t) => sum + (t.views || 0), 0);

      // Charger les réservations
      const reservationsResponse = await reservationAPI.getAll();
      const allReservations = reservationsResponse.data?.data || [];
      
      // Filtrer seulement les réservations des terrains du propriétaire
      const terrainIds = myTerrains.map(t => t._id);
      const myReservations = allReservations.filter(r => 
        terrainIds.includes(r.terrain?._id)
      );

      const totalBookings = myReservations.length;
      const confirmedBookings = myReservations.filter(r => r.status === 'confirmed').length;
      const totalRevenue = myReservations
        .filter(r => r.status === 'confirmed' || r.status === 'completed')
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
      
      // Revenus du mois en cours
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = myReservations
        .filter(r => {
          const resDate = new Date(r.date);
          return resDate >= startOfMonth && (r.status === 'confirmed' || r.status === 'completed');
        })
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      // Calculer le taux de réservation
      const reservationRate = totalViews > 0 
        ? ((totalBookings / totalViews) * 100).toFixed(1)
        : totalBookings > 0 ? 100 : 0;

      setStats({
        totalTerrains,
        approvedTerrains,
        pendingTerrains,
        totalBookings,
        confirmedBookings,
        totalRevenue,
        monthlyRevenue,
        totalViews,
        reservationRate,
        revenueChange: 12.5
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      showError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTerrain = () => {
    setSelectedTerrain(null);
    setShowTerrainForm(true);
  };

  const handleEditTerrain = (terrain) => {
    setSelectedTerrain(terrain);
    setShowTerrainForm(true);
  };

  const handleDeleteTerrain = async (terrainId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce terrain ?')) return;

    try {
      await terrainAPI.delete(terrainId);
      showSuccess('Terrain supprimé avec succès');
      loadDashboardData();
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleFormSuccess = () => {
    setShowTerrainForm(false);
    setSelectedTerrain(null);
    loadDashboardData();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const statCards = [
    {
      title: 'Mes Terrains',
      value: stats.totalTerrains,
      subtitle: `${stats.approvedTerrains} approuvés`,
      icon: MapPin,
      color: 'blue',
      change: null,
      section: 'terrains'
    },
    {
      title: 'Réservations',
      value: stats.totalBookings,
      subtitle: `${stats.confirmedBookings} confirmées`,
      icon: Calendar,
      color: 'green',
      change: null,
      section: 'reservations'
    },
    {
      title: 'Revenus Total',
      value: `${formatPrice(stats.totalRevenue)} FCFA`,
      subtitle: `Ce mois: ${formatPrice(stats.monthlyRevenue)} FCFA`,
      icon: DollarSign,
      color: 'green',
      change: stats.revenueChange,
      section: 'revenue'
    },
    {
      title: 'Vues Totales',
      value: stats.totalViews,
      subtitle: 'Sur tous vos terrains',
      icon: Eye,
      color: 'purple',
      change: null,
      section: 'stats'
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <OwnerSidebar collapsed={collapsed} setCollapsed={setCollapsed} onAddTerrain={handleAddTerrain} user={user} />
        <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} flex items-center justify-center bg-gray-50`}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Caché sur mobile avec overlay si ouvert */}
      <OwnerSidebar collapsed={collapsed} setCollapsed={setCollapsed} onAddTerrain={handleAddTerrain} user={user} />

      {/* Main Content - Responsive margins */}
      <div className={`flex-1 ${collapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'} transition-all duration-300 overflow-auto`}>
        {/* Header avec Navigation - Responsive padding et text */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 md:py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            {/* Logo et Titre */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link 
                to="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">221</span>
                </div>
                <span className="hidden sm:inline font-bold text-gray-900 text-sm md:text-base">Foot Réservation</span>
              </Link>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                  {section === 'overview' && 'Vue d\'ensemble'}
                  {section === 'terrains' && 'Mes Terrains'}
                  {section === 'reservations' && 'Réservations'}
                  {section === 'availability' && 'Disponibilités'}
                  {section === 'revenue' && 'Revenus'}
                  {section === 'stats' && 'Statistiques'}
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

              {/* Bouton Ajouter Terrain */}
              <button
                onClick={handleAddTerrain}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 md:px-4 py-2 md:py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Plus size={16} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Menu Profil */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Home size={18} />
                        <span>Retour à l'accueil</span>
                      </Link>
                      
                      <Link
                        to="/dashboard?section=settings"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <SettingsIcon size={18} />
                        <span>Paramètres</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                      >
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content selon section - Layout comme capture Shakuro */}
        <div className="p-4 md:p-8">
          {/* Stats Cards en haut si overview - Cliquables */}
          {section === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const colors = colorClasses[stat.color];
                
                return (
                  <div 
                    key={index} 
                    onClick={() => navigate(`/dashboard?section=${stat.section}`)}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colors.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                        <Icon className={colors.icon} size={24} />
                      </div>
                      {stat.change && (
                        <div className={`flex items-center gap-1 ${colors.badge} px-2 py-1 rounded-full text-xs font-semibold`}>
                          <ArrowUpRight size={14} />
                          <span>{stat.change}%</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Layout 3 colonnes comme capture Shakuro : Tableau central (2/3) + Panneaux droite (1/3) */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* COLONNE CENTRALE - Tableau principal (2/3 largeur) */}
            <div className="lg:col-span-2">
              
              {/* VUE D'ENSEMBLE */}
              {section === 'overview' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Tableau de bord</h2>
                  </div>
                  <div className="p-6">
                    {terrains.length === 0 ? (
                      <div className="text-center py-16">
                        <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun terrain enregistré</h3>
                        <p className="text-gray-600 mb-6">Commencez par ajouter votre premier terrain</p>
                        <button
                          onClick={handleAddTerrain}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                        >
                          <Plus size={20} />
                          Ajouter mon premier terrain
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-700">Aperçu rapide de vos terrains et réservations</p>
                        {/* Statistiques globales - Cliquables */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            const colors = colorClasses[stat.color];
                            return (
                              <div 
                                key={index} 
                                onClick={() => navigate(`/dashboard?section=${stat.section}`)}
                                className="bg-gray-50 hover:bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-green-300"
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`${colors.bg} p-2 rounded-lg`}>
                                    <Icon className={colors.icon} size={20} />
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">{stat.title}</p>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MES TERRAINS - Format tableau comme capture */}
              {section === 'terrains' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Mes Terrains</h2>
                    <span className="text-sm text-gray-600">{terrains.length} terrain{terrains.length !== 1 ? 's' : ''}</span>
                  </div>

                  {terrains.length === 0 ? (
                    <div className="p-12 text-center">
                      <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun terrain enregistré</h3>
                      <p className="text-gray-600 mb-6">Commencez par ajouter votre premier terrain</p>
                      <button
                        onClick={handleAddTerrain}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        <Plus size={20} />
                        Ajouter mon premier terrain
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Terrain
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Localisation
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Prix/h
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Vues
                            </th>
                            <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {terrains.map((terrain) => (
                            <tr key={terrain._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                    {terrain.images?.[0]?.url ? (
                                      <img
                                        src={terrain.images[0].url}
                                        alt={terrain.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <MapPin size={16} className="text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{terrain.name}</p>
                                    <p className="text-xs text-gray-500">{terrain.size}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-900">{terrain.address.city}</p>
                                <p className="text-xs text-gray-500">{terrain.address.region}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  terrain.isApproved
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {terrain.isApproved ? <CheckCircle size={12} /> : <Clock size={12} />}
                                  {terrain.isApproved ? 'Approuvé' : 'En attente'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <p className="font-bold text-gray-900 text-sm">
                                  {formatPrice(terrain.pricePerHour)} FCFA
                                </p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Eye size={14} className="text-gray-400" />
                                  <span className="font-medium text-gray-900 text-sm">{terrain.views || 0}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditTerrain(terrain)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit size={16} className="text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTerrain(terrain._id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 size={16} className="text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* RÉSERVATIONS - Tableau complet avec actions */}
              {section === 'reservations' && <ReservationsTable terrains={terrains} />}

              {/* DISPONIBILITÉS */}
              {section === 'availability' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Gestion des Disponibilités</h2>
                  </div>
                  <div className="p-6">
                    {terrains.length === 0 ? (
                      <div className="text-center py-16">
                        <Clock className="mx-auto text-gray-400 mb-4" size={64} />
                        <p className="text-gray-600 mb-4">Ajoutez d'abord un terrain pour gérer les disponibilités</p>
                        <button
                          onClick={handleAddTerrain}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors"
                        >
                          <Plus size={18} />
                          Ajouter un terrain
                        </button>
                      </div>
                    ) : (
                      <AvailabilityManager 
                        terrains={terrains}
                        selectedTerrain={selectedTerrainForAvailability}
                        onSelectTerrain={setSelectedTerrainForAvailability}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* REVENUS - Page détaillée */}
              {section === 'revenue' && (
                <div className="space-y-6">
                  {/* Résumé Revenus */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé des Revenus</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-500 p-3 rounded-lg">
                            <DollarSign className="text-white" size={20} />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">Revenu Total</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)} <span className="text-base">FCFA</span></p>
                        <p className="text-xs text-gray-600 mt-2">Depuis le début</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-500 p-3 rounded-lg">
                            <Calendar className="text-white" size={20} />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">Ce Mois</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.monthlyRevenue)} <span className="text-base">FCFA</span></p>
                        <p className="text-xs text-gray-600 mt-2">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-500 p-3 rounded-lg">
                            <TrendingUp className="text-white" size={20} />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">Revenu Moyen/Terrain</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalTerrains > 0 ? formatPrice(Math.round(stats.totalRevenue / stats.totalTerrains)) : 0} <span className="text-base">FCFA</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-2">Par terrain</p>
                      </div>
                    </div>
                  </div>

                  {/* Détails des Réservations Payées */}
                  {stats.totalRevenue > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Détails des Revenus</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <div>
                            <p className="font-semibold text-gray-900">Réservations Confirmées</p>
                            <p className="text-sm text-gray-600">{stats.confirmedBookings} réservation{stats.confirmedBookings > 1 ? 's' : ''}</p>
                          </div>
                          <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalRevenue)} FCFA</p>
                        </div>
                        
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <div>
                            <p className="font-semibold text-gray-900">Réservations En Attente</p>
                            <p className="text-sm text-gray-600">{stats.totalBookings - stats.confirmedBookings} réservation{stats.totalBookings - stats.confirmedBookings > 1 ? 's' : ''}</p>
                          </div>
                          <p className="text-lg font-bold text-yellow-600">En attente</p>
                        </div>
                        
                        <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                          <div>
                            <p className="font-bold text-gray-900">Total Réservations</p>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{stats.totalBookings}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                      <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun revenu enregistré</h3>
                      <p className="text-gray-600">Vos revenus apparaîtront ici après les premières réservations confirmées</p>
                    </div>
                  )}
                </div>
              )}

              {/* STATISTIQUES */}
              {section === 'stats' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Statistiques</h2>
                  </div>
                  <div className="p-12 text-center">
                    <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Statistiques détaillées</h3>
                    <p className="text-gray-600">Graphiques et analyses de performance à venir</p>
                  </div>
                </div>
              )}

              {/* PARAMÈTRES */}
              {section === 'settings' && <SettingsSection />}
            </div>

            {/* COLONNE DROITE - Panneaux fixes visibles sur toutes les sections */}
            <div className="space-y-6">
              {/* Graphique Revenus (Donut Chart) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">REVENUS</h3>
                
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
                        strokeDasharray={`${(stats.totalRevenue / 5000000) * 440} 440`}
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
                      <span className="text-gray-700">Ce mois</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatPrice(stats.monthlyRevenue)} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-700">Total</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatPrice(stats.totalRevenue)} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Statut Terrains */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">STATUT TERRAINS</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Approuvés</span>
                      <span className="text-sm font-bold text-green-600">{stats.approvedTerrains}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: stats.totalTerrains > 0 ? `${(stats.approvedTerrains / stats.totalTerrains) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.totalTerrains > 0 ? Math.round((stats.approvedTerrains / stats.totalTerrains) * 100) : 0}%
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">En attente</span>
                      <span className="text-sm font-bold text-yellow-600">{stats.pendingTerrains}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: stats.totalTerrains > 0 ? `${(stats.pendingTerrains / stats.totalTerrains) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.totalTerrains > 0 ? Math.round((stats.pendingTerrains / stats.totalTerrains) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Aperçu Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">APERÇU</h3>
                  <select className="text-xs text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer">
                    <option>Ce mois</option>
                    <option>Cette semaine</option>
                    <option>Aujourd'hui</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Revenu moyen/terrain</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.totalTerrains > 0 ? formatPrice(Math.round(stats.totalRevenue / stats.totalTerrains)) : '0'} FCFA
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total terrains</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalTerrains}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vues moyennes</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.totalTerrains > 0 ? Math.round(stats.totalViews / stats.totalTerrains) : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Taux réservation</p>
                    <p className="text-xl font-bold text-green-600">{stats.reservationRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Terrain populaire</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {terrains[0]?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">🚀 Conseil</h3>
                <p className="text-green-100 text-sm mb-4">
                  Ajoutez plus de terrains et optimisez vos disponibilités pour augmenter vos revenus
                </p>
                <button
                  onClick={handleAddTerrain}
                  className="w-full bg-white text-green-600 font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-green-50 transition-colors"
                >
                  Ajouter un terrain
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ajout/Modification Terrain */}
      {showTerrainForm && (
        <TerrainFormModal
          isOpen={showTerrainForm}
          onClose={() => setShowTerrainForm(false)}
          onSuccess={handleFormSuccess}
          terrain={selectedTerrain}
        />
      )}
    </div>
  );
};

export default OwnerDashboardModern;

