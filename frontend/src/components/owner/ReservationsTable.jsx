import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { reservationAPI } from '../../services/api';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Copy,
  Printer,
  MoreVertical,
  User,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';

const ReservationsTable = ({ terrains }) => {
  const { success: showSuccess, error: showError } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    loadReservations();
  }, [terrains]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const response = await reservationAPI.getAll();
      const allReservations = response.data?.data || [];
      
      // Filtrer seulement les réservations des terrains du propriétaire
      const terrainIds = terrains.map(t => t._id);
      const myReservations = allReservations.filter(r => 
        terrainIds.includes(r.terrain?._id)
      );
      
      // Trier par date de création (plus récentes en premier)
      const sortedReservations = myReservations.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setReservations(sortedReservations);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
      showError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      if (newStatus === 'confirmed') {
        await reservationAPI.confirm(reservationId);
        showSuccess('Réservation confirmée');
      } else if (newStatus === 'cancelled') {
        await reservationAPI.cancel(reservationId, 'Annulée par le propriétaire');
        showSuccess('Réservation annulée');
      }
      loadReservations();
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const toggleSelection = (reservationId) => {
    setSelectedReservations(prev => 
      prev.includes(reservationId)
        ? prev.filter(id => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReservations.length === reservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map(r => r._id));
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header - Responsive */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Réservations</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{reservations.length} réservation{reservations.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {reservations.length === 0 ? (
          <div className="p-6 md:p-12 text-center">
            <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-sm md:text-base text-gray-600">Les réservations de vos terrains apparaîtront ici</p>
          </div>
        ) : (
          <>
            {/* Version DESKTOP - Table classique (hidden sur mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedReservations.length === reservations.length && reservations.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
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
                  {reservations.map((reservation) => (
                    <tr 
                      key={reservation._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedReservations.includes(reservation._id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedReservations.includes(reservation._id)}
                          onChange={() => toggleSelection(reservation._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">
                          #{reservation._id?.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reservation.startTime} - {reservation.endTime}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {reservation.client?.firstName?.charAt(0)}{reservation.client?.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {reservation.client?.firstName} {reservation.client?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{reservation.client?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{reservation.terrain?.name}</p>
                        <p className="text-xs text-gray-500">{reservation.terrain?.size}</p>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Actions rapides selon statut */}
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(reservation._id, 'confirmed')}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                                title="Confirmer"
                              >
                                <CheckCircle size={18} className="text-green-600" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(reservation._id, 'cancelled')}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                title="Rejeter"
                              >
                                <XCircle size={18} className="text-red-600" />
                              </button>
                            </>
                          )}
                          
                          {/* Bouton détails toujours visible */}
                          <button
                            onClick={() => handleViewDetails(reservation)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Version MOBILE - Cards (visible seulement sur mobile) */}
            <div className="md:hidden divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <div 
                  key={reservation._id}
                  className={`p-4 ${selectedReservations.includes(reservation._id) ? 'bg-blue-50' : ''}`}
                >
                  {/* Header avec checkbox et ID */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedReservations.includes(reservation._id)}
                        onChange={() => toggleSelection(reservation._id)}
                        className="rounded mt-1"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          #{reservation._id?.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reservation.startTime} - {reservation.endTime}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : reservation.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reservation.status === 'confirmed' && <CheckCircle size={10} />}
                      {reservation.status === 'pending' && <Clock size={10} />}
                      {reservation.status === 'cancelled' && <XCircle size={10} />}
                      {reservation.status === 'confirmed' ? 'Confirmée' :
                       reservation.status === 'pending' ? 'En attente' :
                       reservation.status === 'cancelled' ? 'Annulée' : 'Terminée'}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {reservation.client?.firstName?.charAt(0)}{reservation.client?.lastName?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {reservation.client?.firstName} {reservation.client?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{reservation.client?.email}</p>
                    </div>
                  </div>

                  {/* Terrain et Date */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Terrain</p>
                      <p className="font-medium text-gray-900 truncate">{reservation.terrain?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>

                  {/* Prix et Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Montant</p>
                      <p className="font-bold text-gray-900 text-base">
                        {formatPrice(reservation.totalPrice)} FCFA
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Actions selon statut */}
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(reservation._id, 'confirmed')}
                            className="p-2.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            title="Confirmer"
                          >
                            <CheckCircle size={20} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(reservation._id, 'cancelled')}
                            className="p-2.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Rejeter"
                          >
                            <XCircle size={20} className="text-red-600" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDetails(reservation)}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Barre d'actions pour sélections multiples */}
            {selectedReservations.length > 0 && (
              <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedReservations.length === reservations.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                  <span className="font-medium">Sélectionné{selectedReservations.length > 1 ? 's' : ''} : {selectedReservations.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 hover:bg-gray-800 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                  <button className="px-4 py-2 hover:bg-gray-800 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Copy size={16} />
                    <span>Dupliquer</span>
                  </button>
                  <button className="px-4 py-2 hover:bg-gray-800 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Printer size={16} />
                    <span>Imprimer</span>
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Détails Réservation - Style capture Shakuro */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-gray-900 text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal - Style sombre comme capture */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Réservation #{selectedReservation._id?.slice(-6).toUpperCase()}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span>{selectedReservation.client?.firstName} {selectedReservation.client?.lastName}</span>
                  <span>•</span>
                  <span>{selectedReservation.client?.email}</span>
                  <span>•</span>
                  <span>{selectedReservation.client?.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
              <div className="flex gap-6 px-6">
                <button className="py-4 border-b-2 border-green-500 text-green-500 font-semibold text-sm">
                  Détails réservation
                </button>
                <button className="py-4 text-gray-400 hover:text-white font-semibold text-sm transition-colors">
                  Informations client
                </button>
                <button className="py-4 text-gray-400 hover:text-white font-semibold text-sm transition-colors">
                  Documents
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Terrain */}
              <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                {selectedReservation.terrain?.images?.[0]?.url && (
                  <img
                    src={selectedReservation.terrain.images[0].url}
                    alt={selectedReservation.terrain.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-bold text-lg text-white">{selectedReservation.terrain?.name}</p>
                  <p className="text-sm text-gray-400">{selectedReservation.terrain?.address?.city}, {selectedReservation.terrain?.address?.region}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedReservation.terrain?.size}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    {formatPrice(selectedReservation.totalPrice)}
                  </p>
                  <p className="text-xs text-gray-400">FCFA</p>
                </div>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="font-semibold text-white">
                    {new Date(selectedReservation.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Horaire</p>
                  <p className="font-semibold text-white">
                    {selectedReservation.startTime} - {selectedReservation.endTime}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Durée</p>
                  <p className="font-semibold text-white">{selectedReservation.duration}h</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Paiement</p>
                  <p className="font-semibold text-white capitalize">{selectedReservation.paymentMethod}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedReservation.notes && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Notes du client</p>
                  <p className="text-sm text-gray-300">{selectedReservation.notes}</p>
                </div>
              )}

              {/* Motif d'annulation (si annulée) */}
              {selectedReservation.status === 'cancelled' && selectedReservation.cancellationReason && (
                <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
                  <p className="text-xs text-red-400 mb-2 font-semibold">⚠️ Motif d'annulation</p>
                  <p className="text-sm text-red-300">{selectedReservation.cancellationReason}</p>
                  {selectedReservation.cancelledAt && (
                    <p className="text-xs text-red-400 mt-2">
                      Annulée le {new Date(selectedReservation.cancelledAt).toLocaleDateString('fr-FR')} à {new Date(selectedReservation.cancelledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Copy size={16} />
                  <span>Dupliquer</span>
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Printer size={16} />
                  <span>Imprimer</span>
                </button>
              </div>

              {/* Actions de statut */}
              {selectedReservation.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReservation._id, 'confirmed');
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    ✓ Confirmer
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReservation._id, 'cancelled');
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    ✕ Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationsTable;

