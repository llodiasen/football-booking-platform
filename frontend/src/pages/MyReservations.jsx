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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Réservations
          </h1>
          <p className="text-gray-600">
            Gérez et consultez toutes vos réservations
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 mb-8">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'upcoming', label: 'À venir' },
            { key: 'past', label: 'Passées' },
            { key: 'cancelled', label: 'Annulées' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
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
              <Card key={reservation._id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* Image Terrain */}
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {reservation.terrain?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reservation.terrain?.address.city}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={16} />
                        <span>
                          {new Date(reservation.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={16} />
                        <span>{reservation.startTime} - {reservation.endTime}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <DollarSign size={16} />
                        <span className="font-semibold">{reservation.finalPrice.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <Link to={`/terrains/${reservation.terrain._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye size={16} className="mr-2" />
                          Voir le terrain
                        </Button>
                      </Link>

                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelReservation(reservation._id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X size={16} className="mr-2" />
                          Annuler
                        </Button>
                      )}
                    </div>

                    {/* Contact Propriétaire */}
                    {(reservation.status === 'confirmed' && reservation.paymentStatus === 'paid') && (
                      <div className="mt-6">
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
