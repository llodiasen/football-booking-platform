import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, DollarSign, X, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { reservationAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import OwnerContact from '../components/reservation/OwnerContact';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAll();
      setReservations(response.data.data);
    } catch (error) {
      showError('Erreur lors du chargement des réservations');
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
      loadReservations();
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'yellow', text: 'En attente', icon: AlertCircle },
      confirmed: { color: 'green', text: 'Confirmée', icon: CheckCircle },
      cancelled: { color: 'red', text: 'Annulée', icon: X },
      completed: { color: 'blue', text: 'Terminée', icon: CheckCircle }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-${badge.color}-100 text-${badge.color}-700`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const badges = {
      pending: { color: 'yellow', text: 'En attente' },
      paid: { color: 'green', text: 'Payé' },
      refunded: { color: 'gray', text: 'Remboursé' },
      failed: { color: 'red', text: 'Échec' }
    };

    const badge = badges[paymentStatus] || badges.pending;

    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-${badge.color}-100 text-${badge.color}-700`}>
        {badge.text}
      </span>
    );
  };

  // Vérifier si une réservation peut être annulée (non passée et plus de 2h avant le début)
  const canCancelReservation = (reservation) => {
    // Vérifier le statut
    if (reservation.status !== 'pending' && reservation.status !== 'confirmed') {
      return false;
    }

    // Vérifier si la date est passée ou moins de 2h avant le début
    const reservationDateTime = new Date(reservation.date);
    const [startHour, startMin] = reservation.startTime.split(':').map(Number);
    reservationDateTime.setHours(startHour, startMin, 0, 0);
    
    const now = new Date();
    const hoursUntilReservation = (reservationDateTime - now) / (1000 * 60 * 60);
    
    // Peut annuler seulement si plus de 2 heures avant le début
    return hoursUntilReservation > 2;
  };

  // Obtenir le message d'impossibilité d'annulation
  const getCancellationMessage = (reservation) => {
    const reservationDateTime = new Date(reservation.date);
    const [startHour, startMin] = reservation.startTime.split(':').map(Number);
    reservationDateTime.setHours(startHour, startMin, 0, 0);
    
    const now = new Date();
    const hoursUntilReservation = (reservationDateTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilReservation <= 0) {
      return "Cette réservation est terminée";
    } else if (hoursUntilReservation <= 2) {
      return "Annulation impossible (moins de 2h avant le début)";
    }
    return null;
  };

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return res.status === 'confirmed' || res.status === 'pending';
    if (filter === 'past') return res.status === 'completed';
    if (filter === 'cancelled') return res.status === 'cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-12">
      <div className="container-custom px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Mes Réservations
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gérez et consultez toutes vos réservations
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'upcoming', label: 'À venir' },
            { key: 'past', label: 'Passées' },
            { key: 'cancelled', label: 'Annulées' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {filteredReservations.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par réserver un terrain
            </p>
            <Link to="/terrains">
              <Button>Trouver un Terrain</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation._id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Image Terrain */}
                  <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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

                  {/* Infos */}
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {reservation.terrain?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reservation.terrain?.address.city}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
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
                        <DollarSign size={16} className="flex-shrink-0" />
                        <span className="font-semibold">{reservation.finalPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 sm:mt-6">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start">
                        <Link to={`/terrains/${reservation.terrain._id}`} className="flex-1 sm:flex-initial">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <Eye size={16} className="mr-2" />
                            Voir le terrain
                          </Button>
                        </Link>

                        {canCancelReservation(reservation) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation._id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
                          >
                            <X size={16} className="mr-2" />
                            Annuler
                          </Button>
                        ) : (
                          (reservation.status === 'confirmed' || reservation.status === 'pending') && 
                          getCancellationMessage(reservation) && (
                            <p className="text-xs text-gray-500 italic flex items-center w-full sm:w-auto sm:ml-2">
                              <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                              {getCancellationMessage(reservation)}
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    {/* Contact Propriétaire */}
                    {(reservation.status === 'confirmed' && reservation.paymentStatus === 'paid') && (
                      <div className="mt-4 sm:mt-6">
                        <OwnerContact reservation={reservation} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
