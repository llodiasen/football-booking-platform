import { X, Calendar, Clock, MapPin, DollarSign, User, CheckCircle, XCircle, Reply } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NotificationDetailModal = ({ notification, onClose, onActionComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (notification?.relatedEntity?.type === 'Reservation') {
      loadReservationDetails(notification.relatedEntity.id);
    } else {
      setLoading(false);
    }
  }, [notification]);

  const loadReservationDetails = async (reservationId) => {
    try {
      const response = await reservationAPI.getOne(reservationId);
      setReservation(response.data.data);
    } catch (error) {
      console.error('Erreur chargement réservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!reservation) return;
    
    setActionLoading(true);
    try {
      if (newStatus === 'confirmed') {
        await reservationAPI.confirm(reservation._id);
        showSuccess('Réservation confirmée avec succès');
      } else if (newStatus === 'cancelled') {
        await reservationAPI.cancel(reservation._id, 'Annulée par le propriétaire');
        showSuccess('Réservation annulée avec succès');
      }
      
      // Recharger les détails
      await loadReservationDetails(reservation._id);
      
      // Callback pour rafraîchir le dashboard
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
      showError(error.response?.data?.message || 'Erreur lors du changement de statut');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'yellow', text: 'En attente' },
      confirmed: { color: 'green', text: 'Confirmée' },
      cancelled: { color: 'red', text: 'Annulée' },
      completed: { color: 'blue', text: 'Terminée' }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${badge.color}-100 text-${badge.color}-700`}>
        {badge.text}
      </span>
    );
  };

  // Vérifier si l'utilisateur est propriétaire
  const isOwner = user?.role === 'owner';

  // Gérer la redirection vers les messages
  const handleReplyToMessage = () => {
    navigate('/dashboard?section=messages');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-bold text-white">Détails de la notification</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(90vh-80px)]">
          {/* Notification Info */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{
                notification.type === 'reservation_confirmed' ? '✅' :
                notification.type === 'reservation_cancelled' ? '❌' :
                notification.type === 'new_reservation' ? '🎉' :
                notification.type === 'payment_received' ? '💰' :
                '📢'
              }</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : reservation ? (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Détails de la réservation</h4>
                {getStatusBadge(reservation.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Terrain */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={16} />
                    <span className="text-xs font-medium">TERRAIN</span>
                  </div>
                  <p className="font-bold text-gray-900">{reservation.terrain?.name}</p>
                  <p className="text-sm text-gray-600">{reservation.terrain?.address?.city}</p>
                </div>

                {/* Date */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={16} />
                    <span className="text-xs font-medium">DATE</span>
                  </div>
                  <p className="font-bold text-gray-900">
                    {new Date(reservation.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Horaire */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={16} />
                    <span className="text-xs font-medium">HORAIRE</span>
                  </div>
                  <p className="font-bold text-gray-900">
                    {reservation.startTime} - {reservation.endTime}
                  </p>
                  <p className="text-sm text-gray-600">{reservation.duration}h</p>
                </div>

                {/* Prix */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign size={16} />
                    <span className="text-xs font-medium">MONTANT</span>
                  </div>
                  <p className="font-bold text-green-600 text-lg">
                    {reservation.finalPrice?.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              {/* Info supplémentaires */}
              {reservation.status === 'cancelled' && reservation.cancellationReason && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-red-700 mb-1">Raison de l'annulation</p>
                  <p className="text-sm text-red-900">{reservation.cancellationReason}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-gray-600">Détails non disponibles</p>
            </div>
          )}

          {/* Actions - Responsive */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            {/* Boutons d'action propriétaire - Stack sur mobile */}
            {isOwner && reservation && reservation.status === 'pending' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors text-sm w-full sm:w-auto"
                  title="Confirmer la réservation"
                >
                  <CheckCircle size={16} />
                  {actionLoading ? 'Traitement...' : 'Confirmer'}
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors text-sm w-full sm:w-auto"
                  title="Annuler la réservation"
                >
                  <XCircle size={16} />
                  {actionLoading ? 'Traitement...' : 'Refuser'}
                </button>
              </div>
            )}
            
            {/* Boutons d'action - Stack sur mobile, flex sur desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:justify-end">
              {/* Bouton Répondre pour les messages */}
              {notification.type === 'new_message' && (
                <button
                  onClick={handleReplyToMessage}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm w-full sm:w-auto order-first sm:order-none"
                >
                  <Reply size={16} />
                  Répondre
                </button>
              )}
              
              {/* Bouton Voir le terrain pour les clients */}
              {reservation && !isOwner && (
                <a
                  href={`/terrains/${reservation.terrain?._id}`}
                  className="flex items-center justify-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm w-full sm:w-auto order-first sm:order-none"
                >
                  Voir le terrain
                </a>
              )}
              
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm w-full sm:w-auto"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;

