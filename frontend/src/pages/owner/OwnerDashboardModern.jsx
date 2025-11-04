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

          {/* Section Content According to Active Tab */}
          {section === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
                <div className="space-y-4">
                  {terrains.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 mb-2">Aucun terrain enregistré</p>
                      <p className="text-sm text-gray-500 mb-4">Commencez par ajouter votre premier terrain</p>
                      <button
                        onClick={handleAddTerrain}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        <Plus size={18} />
                        Ajouter mon premier terrain
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600">Dernières activités sur vos terrains...</p>
                  )}
                </div>
              </div>

              {/* Quick Stats Panel */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taux d'approbation</span>
                      <span className="font-bold text-gray-900">
                        {stats.totalTerrains > 0 
                          ? `${Math.round((stats.approvedTerrains / stats.totalTerrains) * 100)}%`
                          : '0%'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Vues par terrain</span>
                      <span className="font-bold text-gray-900">
                        {stats.totalTerrains > 0 
                          ? Math.round(stats.totalViews / stats.totalTerrains)
                          : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taux de réservation</span>
                      <span className="font-bold text-green-600">78%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">🚀 Augmentez vos réservations</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Ajoutez plus de terrains et optimisez vos disponibilités
                  </p>
                  <button
                    onClick={handleAddTerrain}
                    className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition-colors"
                  >
                    Ajouter un terrain
                  </button>
                </div>
              </div>
            </div>
          )}

          {section === 'terrains' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mes Terrains ({terrains.length})</h2>
              </div>

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
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {terrains.map((terrain) => (
                    <div key={terrain._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gray-200 relative">
                        {terrain.images?.[0]?.url ? (
                          <img
                            src={terrain.images[0].url}
                            alt={terrain.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <MapPin className="text-gray-400" size={48} />
                          </div>
                        )}
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          terrain.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {terrain.isApproved ? '✓ Approuvé' : '⏳ En attente'}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{terrain.name}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <MapPin size={14} className="mr-1" />
                          {terrain.address.city}, {terrain.address.region}
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              {formatPrice(terrain.pricePerHour)}
                            </p>
                            <p className="text-xs text-gray-500">FCFA/heure</p>
                          </div>
                          <div className="text-right">
                            <p className="flex items-center gap-1 text-sm font-medium">
                              <Eye size={14} />
                              {terrain.views || 0}
                            </p>
                            <p className="text-xs text-gray-500">vues</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTerrain(terrain)}
                            className="flex-1 px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit size={14} />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteTerrain(terrain._id)}
                            className="px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'availability' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Gestion des Disponibilités</h2>
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
          )}
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

