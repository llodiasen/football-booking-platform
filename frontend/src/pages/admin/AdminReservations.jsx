import { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Filter, 
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { reservationAPI } from '../../services/api';

const AdminReservations = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: ''
  });

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAll();
      setReservations(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const filteredReservations = reservations.filter((res) => {
    if (filters.status && res.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const clientName = `${res.client?.firstName} ${res.client?.lastName}`.toLowerCase();
      const terrainName = res.terrain?.name?.toLowerCase() || '';
      if (!clientName.includes(searchLower) && !terrainName.includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 overflow-auto`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
              <p className="text-gray-600 mt-1">{filteredReservations.length} réservations trouvées</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                <span>Import</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                <Upload size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher client, terrain..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={16} />
              <span>Tous les filtres</span>
            </button>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Réservation
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Terrain
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          Aucune réservation trouvée
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((reservation) => (
                        <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900 text-sm">
                              #{reservation._id?.slice(-6).toUpperCase()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {reservation.client?.firstName} {reservation.client?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{reservation.client?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{reservation.terrain?.name}</p>
                            <p className="text-xs text-gray-500">{reservation.terrain?.address?.city}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              reservation.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : reservation.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status === 'confirmed' && <CheckCircle size={12} />}
                              {reservation.status === 'pending' && <Clock size={12} />}
                              {reservation.status === 'cancelled' && <XCircle size={12} />}
                              {reservation.status === 'confirmed' ? 'Confirmée' :
                               reservation.status === 'pending' ? 'En attente' :
                               reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-gray-900 text-sm">
                              {formatPrice(reservation.totalPrice)} FCFA
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">
                              {new Date(reservation.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleViewDetails(reservation)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Voir détails"
                            >
                              <Eye size={18} className="text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Détails Réservation */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Réservation #{selectedReservation._id?.slice(-6).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedReservation.client?.firstName} {selectedReservation.client?.lastName}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Informations Client */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  👤 Informations Client
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nom complet</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedReservation.client?.firstName} {selectedReservation.client?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm font-medium text-gray-900">{selectedReservation.client?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Téléphone</span>
                    <span className="text-sm font-medium text-gray-900">{selectedReservation.client?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Détails Réservation */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  📋 Détails Réservation
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Terrain</span>
                    <span className="text-sm font-medium text-gray-900">{selectedReservation.terrain?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(selectedReservation.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Horaire</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedReservation.startTime} - {selectedReservation.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Durée</span>
                    <span className="text-sm font-medium text-gray-900">{selectedReservation.duration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Statut</span>
                    <span className={`text-sm font-semibold ${
                      selectedReservation.status === 'confirmed' ? 'text-green-600' :
                      selectedReservation.status === 'pending' ? 'text-yellow-600' :
                      selectedReservation.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {selectedReservation.status === 'confirmed' ? 'Confirmée' :
                       selectedReservation.status === 'pending' ? 'En attente' :
                       selectedReservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  💳 Paiement
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Montant total</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(selectedReservation.totalPrice)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Méthode</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {selectedReservation.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Statut paiement</span>
                    <span className="text-sm font-semibold text-green-600">
                      {selectedReservation.paymentStatus || 'Payé'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedReservation.notes && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">📝 Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedReservation.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors">
                Exporter PDF
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
                  Dupliquer
                </button>
                <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium text-sm transition-colors">
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;

