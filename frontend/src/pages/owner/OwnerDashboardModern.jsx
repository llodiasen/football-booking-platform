import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSearchParams, Link } from 'react-router-dom';
import { terrainAPI } from '../../services/api';
import { 
  Plus, MapPin, Calendar, DollarSign, Eye, TrendingUp,
  ArrowUpRight, Edit, Trash2, Settings as SettingsIcon,
  CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import TerrainFormModal from '../../components/owner/TerrainFormModal';
import AvailabilityManager from '../../components/owner/AvailabilityManager';

const OwnerDashboardModern = () => {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
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
    revenueChange: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const terrainsResponse = await terrainAPI.getOwnerTerrains();
      const myTerrains = terrainsResponse.data.data;
      setTerrains(myTerrains);

      const totalTerrains = myTerrains.length;
      const approvedTerrains = myTerrains.filter(t => t.isApproved).length;
      const pendingTerrains = myTerrains.filter(t => !t.isApproved).length;
      const totalViews = myTerrains.reduce((sum, t) => sum + (t.views || 0), 0);

      setStats({
        totalTerrains,
        approvedTerrains,
        pendingTerrains,
        totalBookings: 0,
        confirmedBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalViews,
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
      change: null
    },
    {
      title: 'Réservations',
      value: stats.totalBookings,
      subtitle: `${stats.confirmedBookings} confirmées`,
      icon: Calendar,
      color: 'green',
      change: null
    },
    {
      title: 'Revenus Total',
      value: `${formatPrice(stats.totalRevenue)} FCFA`,
      subtitle: `Ce mois: ${formatPrice(stats.monthlyRevenue)} FCFA`,
      icon: DollarSign,
      color: 'green',
      change: stats.revenueChange
    },
    {
      title: 'Vues Totales',
      value: stats.totalViews,
      subtitle: 'Sur tous vos terrains',
      icon: Eye,
      color: 'purple',
      change: null
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
      {/* Sidebar */}
      <OwnerSidebar collapsed={collapsed} setCollapsed={setCollapsed} onAddTerrain={handleAddTerrain} user={user} />

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 overflow-auto`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {section === 'overview' && 'Vue d\'ensemble'}
                {section === 'terrains' && 'Mes Terrains'}
                {section === 'reservations' && 'Réservations'}
                {section === 'availability' && 'Gestion des Disponibilités'}
                {section === 'revenue' && 'Revenus'}
                {section === 'stats' && 'Statistiques'}
                {section === 'settings' && 'Paramètres'}
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenue {user?.firstName}, gérez vos terrains et réservations
              </p>
            </div>
            <button
              onClick={handleAddTerrain}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus size={20} />
              <span>Ajouter un terrain</span>
            </button>
          </div>
        </div>

        {/* Content selon section - Layout comme capture Shakuro */}
        <div className="p-8">
          {/* Stats Cards en haut si overview */}
          {section === 'overview' && (
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
                        {/* Statistiques globales */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            const colors = colorClasses[stat.color];
                            return (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
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

              {/* RÉSERVATIONS - Tableau style capture */}
              {section === 'reservations' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Réservations</h2>
                  </div>
                  <div className="p-12 text-center">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
                    <p className="text-gray-600">Les réservations de vos terrains apparaîtront ici</p>
                  </div>
                </div>
              )}

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

              {/* REVENUS */}
              {section === 'revenue' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Revenus</h2>
                  </div>
                  <div className="p-12 text-center">
                    <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun revenu enregistré</h3>
                    <p className="text-gray-600">Vos revenus apparaîtront ici après les premières réservations</p>
                  </div>
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
              {section === 'settings' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Paramètres</h2>
                  </div>
                  <div className="p-12 text-center">
                    <SettingsIcon className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Paramètres du compte</h3>
                    <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
                  </div>
                </div>
              )}
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
                    <p className="text-xl font-bold text-green-600">0%</p>
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

