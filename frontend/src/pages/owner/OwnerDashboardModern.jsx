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
import StatCard from '../../components/dashboard/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import Badge from '../../components/ui/Badge';

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
    pendingBookings: 0,
    cancelledBookings: 0,
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
      const pendingBookings = myReservations.filter(r => r.status === 'pending').length;
      const cancelledBookings = myReservations.filter(r => r.status === 'cancelled').length;
      
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
        pendingBookings,
        cancelledBookings,
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

        {/* Content selon section - Design épuré avec plus d'espace blanc */}
        <div className="p-5 md:p-10 max-w-[1600px] mx-auto">
          {/* Stats Cards en haut si overview - Design épuré Shadcn */}
          {section === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  icon={stat.icon}
                  trend={stat.change > 0 ? 'up' : stat.change < 0 ? 'down' : null}
                  trendValue={stat.change}
                  onClick={() => navigate(`/dashboard?section=${stat.section}`)}
                />
              ))}
            </div>
          )}

          {/* Layout 3 colonnes épuré : Contenu central (2/3) + Sidebar droite (1/3) */}
          <div className="grid lg:grid-cols-3 gap-7">
            {/* COLONNE CENTRALE - Tableau principal (2/3 largeur) */}
            <div className="lg:col-span-2">
              
              {/* VUE D'ENSEMBLE - Design épuré */}
              {section === 'overview' && (
                <div className="space-y-6">
                  {terrains.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center hover:shadow-md transition-shadow">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-6">
                        <MapPin className="text-gray-400" size={40} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun terrain enregistré</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Commencez par ajouter votre premier terrain pour recevoir des réservations
                      </p>
                      <button
                        onClick={handleAddTerrain}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <Plus size={20} />
                        Ajouter mon premier terrain
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Activité Récente */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">Activité récente</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="text-green-600" size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{stats.totalBookings} réservations</p>
                                <p className="text-xs text-gray-500">Total sur vos terrains</p>
                              </div>
                            </div>
                            <Badge variant="success">{stats.confirmedBookings} confirmées</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Eye className="text-blue-600" size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{stats.totalViews} vues</p>
                                <p className="text-xs text-gray-500">Sur tous vos terrains</p>
                              </div>
                            </div>
                            <Badge variant="info">Ce mois</Badge>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* MES TERRAINS - Design moderne épuré */}
              {section === 'terrains' && (
                <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
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

            {/* COLONNE DROITE - Panneaux fixes épurés Shadcn UI */}
            <div className="space-y-5">
              {/* Graphique Revenus moderne avec Recharts */}
              <RevenueChart 
                totalRevenue={stats.totalRevenue}
                monthlyRevenue={stats.monthlyRevenue}
              />

              {/* Statut Réservations - Design épuré */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Statut Réservations
                  </h3>
                  <Badge variant="default">
                    {stats.totalBookings} total
                  </Badge>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Confirmées</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stats.confirmedBookings}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: stats.totalBookings > 0 ? `${(stats.confirmedBookings / stats.totalBookings) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">En attente</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stats.pendingBookings}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: stats.totalBookings > 0 ? `${(stats.pendingBookings / stats.totalBookings) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Annulées</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stats.cancelledBookings || 0}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: stats.totalBookings > 0 ? `${((stats.cancelledBookings || 0) / stats.totalBookings) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aperçu Performance - Design épuré */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Aperçu
                  </h3>
                  <Badge variant="info">Ce mois</Badge>
                </div>

                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Revenu moyen/terrain</p>
                    <p className="text-lg font-bold text-gray-900">
                      {stats.totalTerrains > 0 ? formatPrice(Math.round(stats.totalRevenue / stats.totalTerrains)) : '0'} 
                      <span className="text-sm text-gray-500 font-normal ml-1">FCFA</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">Terrains</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTerrains}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">Vues moy.</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalTerrains > 0 ? Math.round(stats.totalViews / stats.totalTerrains) : 0}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Taux de réservation</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(stats.reservationRate, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-green-600 min-w-[3rem] text-right">
                        {stats.reservationRate}%
                      </span>
                    </div>
                  </div>

                  {terrains[0] && (
                    <div className="pt-4 border-t border-gray-50">
                      <p className="text-xs font-medium text-gray-500 mb-2">Terrain populaire</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {terrains[0]?.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Card - Design moderne */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  
                  <h3 className="text-base font-bold mb-2">
                    Augmentez vos revenus
                  </h3>
                  <p className="text-green-50 text-xs mb-5 leading-relaxed">
                    Ajoutez plus de terrains et optimisez vos disponibilités
                  </p>
                  
                  <button
                    onClick={handleAddTerrain}
                    className="w-full bg-white text-green-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-green-50 hover:shadow-md transition-all"
                  >
                    + Ajouter un terrain
                  </button>
                </div>
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

