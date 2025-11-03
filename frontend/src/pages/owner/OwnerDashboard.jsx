import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { terrainAPI } from '../../services/api';
import { 
  Plus, MapPin, Calendar, DollarSign, Eye, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, Edit, Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TerrainFormModal from '../../components/owner/TerrainFormModal';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [showTerrainForm, setShowTerrainForm] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [terrains, setTerrains] = useState([]);
  const [stats, setStats] = useState({
    totalTerrains: 0,
    approvedTerrains: 0,
    pendingTerrains: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalViews: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger les terrains du propriétaire
      const terrainsResponse = await terrainAPI.getOwnerTerrains();
      const myTerrains = terrainsResponse.data.data;
      setTerrains(myTerrains);

      // Calculer les statistiques
      const totalTerrains = myTerrains.length;
      const approvedTerrains = myTerrains.filter(t => t.isApproved).length;
      const pendingTerrains = myTerrains.filter(t => !t.isApproved).length;
      const totalViews = myTerrains.reduce((sum, t) => sum + (t.views || 0), 0);

      setStats({
        totalTerrains,
        approvedTerrains,
        pendingTerrains,
        totalBookings: 0, // TODO: implémenter avec API réservations
        confirmedBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalViews
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

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Propriétaire
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue {user?.firstName}, gérez vos terrains et réservations
            </p>
          </div>
          <Button 
            onClick={handleAddTerrain}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter un terrain
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {/* Total Terrains */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Mes Terrains</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTerrains}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.approvedTerrains} approuvés
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MapPin className="text-blue-600" size={28} />
            </div>
          </div>
        </Card>

        {/* Total Réservations */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Réservations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                {stats.confirmedBookings} confirmées
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="text-green-600" size={28} />
            </div>
          </div>
        </Card>

        {/* Revenus */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Revenus Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalRevenue.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ce mois: {stats.monthlyRevenue.toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={28} />
            </div>
          </div>
        </Card>

        {/* Vues totales */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Vues Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalViews}</p>
              <p className="text-xs text-gray-500 mt-1">
                Sur tous vos terrains
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Eye className="text-purple-600" size={28} />
            </div>
          </div>
        </Card>
      </div>

      {/* Terrains en attente d'approbation */}
      {stats.pendingTerrains > 0 && (
        <Card className="p-6 mb-8 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-orange-900">
                {stats.pendingTerrains} terrain(s) en attente d'approbation
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Vos terrains seront visibles après validation par un administrateur.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des Terrains */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Mes Terrains</h2>
          {terrains.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddTerrain}
            >
              <Plus size={16} className="mr-2" />
              Ajouter
            </Button>
          )}
        </div>

        {terrains.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun terrain enregistré
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier terrain
            </p>
            <Button onClick={handleAddTerrain}>
              <Plus size={20} className="mr-2" />
              Ajouter mon premier terrain
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {terrains.map((terrain) => (
              <div 
                key={terrain._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {terrain.images && terrain.images.length > 0 ? (
                      <img 
                        src={terrain.images[0].url} 
                        alt={terrain.name}
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
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{terrain.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {terrain.address.city} • {terrain.type} • {terrain.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditTerrain(terrain)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTerrain(terrain._id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm font-semibold text-primary-600">
                        {terrain.pricePerHour.toLocaleString()} FCFA/h
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Eye size={14} />
                        {terrain.views || 0} vues
                      </span>
                      {terrain.isApproved ? (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle size={14} />
                          Approuvé
                        </span>
                      ) : (
                        <span className="text-sm text-orange-600 flex items-center gap-1">
                          <Clock size={14} />
                          En attente
                        </span>
                      )}
                      {!terrain.isActive && (
                        <span className="text-sm text-red-600 flex items-center gap-1">
                          <XCircle size={14} />
                          Désactivé
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Formulaire Terrain */}
      {showTerrainForm && (
        <TerrainFormModal
          terrain={selectedTerrain}
          onClose={() => {
            setShowTerrainForm(false);
            setSelectedTerrain(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;

