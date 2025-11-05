import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CreditCard, CheckCircle, MapPin, Star, Phone, Mail, User as UserIcon } from 'lucide-react';
import { terrainAPI, reservationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TimeSlotPicker from '../components/reservation/TimeSlotPicker';
import AvailabilityCalendar from '../components/terrain/AvailabilityCalendar';

const BookingModern = () => {
  const { terrainId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const bookingType = searchParams.get('type') || 'single';
  
  const [formData, setFormData] = useState({
    date: searchParams.get('date') || '',
    startTime: '',
    endTime: '',
    paymentMethod: 'wave',
    notes: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    loadTerrain();
  }, [terrainId]);

  const loadTerrain = async () => {
    try {
      const response = await terrainAPI.getOne(terrainId);
      setTerrain(response.data.data);
      setLoading(false);
    } catch (error) {
      showError('Erreur lors du chargement du terrain');
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!formData.startTime || !formData.endTime) return null;
    
    const [startH, startM] = formData.startTime.split(':').map(Number);
    const [endH, endM] = formData.endTime.split(':').map(Number);
    const durationHours = (endH * 60 + endM - startH * 60 - startM) / 60;
    
    if (durationHours <= 0) return null;

    const basePrice = terrain.pricePerHour * durationHours;
    const serviceFee = 0;
    const total = basePrice + serviceFee;

    return {
      basePrice,
      durationHours,
      serviceFee,
      total
    };
  };

  const priceCalc = calculatePrice();

  const handleTimeSelect = (timeSlot) => {
    setFormData({
      ...formData,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      const currentPath = `/booking/${terrainId}?type=${bookingType}${formData.date ? `&date=${formData.date}` : ''}`;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!priceCalc) {
      showError('Veuillez sélectionner un créneau horaire');
      return;
    }

    if (!acceptTerms) {
      showError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setSubmitting(true);

    try {
      const reservationData = {
        terrain: terrainId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await reservationAPI.create(reservationData);
      showSuccess('Réservation effectuée avec succès !');
      navigate('/dashboard?section=reservations');
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (loading || !terrain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <Link 
          to={`/terrains/${terrainId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-xl font-bold">Réservation</span>
        </Link>

        {/* Layout 2 colonnes */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE - Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. INFORMATIONS CONTACT */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                1. Informations de contact
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Prénom
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={user?.firstName || 'Chargement...'}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Nom
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={user?.lastName || 'Chargement...'}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      disabled
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
                    />
                    {user?.phone && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DATE ET CRÉNEAU */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                2. Date et créneau horaire
              </h2>

              {/* Sélection de date */}
              {!formData.date && (
                <div className="mb-6">
                  <AvailabilityCalendar
                    terrainId={terrainId}
                    onDateSelect={(date) => setFormData({ ...formData, date })}
                    selectedDate={formData.date}
                  />
                </div>
              )}

              {/* Date sélectionnée */}
              {formData.date && (
                <div className="mb-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Date sélectionnée</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(formData.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, date: '', startTime: '', endTime: '' })}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              )}

              {/* Sélection de créneau */}
              {formData.date && (
                <div>
                  <TimeSlotPicker
                    terrain={terrain}
                    selectedDate={formData.date}
                    onSelectSlot={handleTimeSelect}
                    selectedSlot={formData.startTime ? { startTime: formData.startTime, endTime: formData.endTime } : null}
                  />
                </div>
              )}
            </div>

            {/* 3. PAIEMENT */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                3. Mode de paiement
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'wave', label: 'Wave', icon: '📱' },
                  { value: 'orange_money', label: 'Orange Money', icon: '🍊' },
                  { value: 'free_money', label: 'Free Money', icon: '💳' },
                  { value: 'cash', label: 'Espèces', icon: '💵' }
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === method.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                  </button>
                ))}
              </div>

              {/* Notes optionnelles */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Notes (optionnel)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Message pour le propriétaire..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* COLONNE DROITE - Résumé sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Récapitulatif</h3>
              </div>

              <div className="p-6">
                {/* Terrain Image */}
                {terrain.images && terrain.images[0] && (
                  <img
                    src={terrain.images[0].url}
                    alt={terrain.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}

                {/* Terrain Details */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-2">{terrain.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={16} />
                    <span>{terrain.address?.city}, {terrain.address?.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-sm font-semibold text-gray-900">
                        {terrain.rating?.average?.toFixed(1) || '5.0'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({terrain.rating?.count || 0} avis)
                    </span>
                  </div>
                  <div className="mt-3 inline-flex px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                    {terrain.size}
                  </div>
                </div>

                {/* Prix breakdown */}
                {priceCalc && (
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">PRIX ({priceCalc.durationHours}h)</span>
                      <span className="font-semibold text-gray-900">{formatPrice(priceCalc.basePrice)} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">FRAIS DE SERVICE</span>
                      <span className="font-semibold text-green-600">Gratuit</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-gray-900">TOTAL</span>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(priceCalc.total)} FCFA</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton Checkout */}
                <button
                  onClick={handleSubmit}
                  disabled={!priceCalc || submitting || !acceptTerms}
                  className="w-full mt-6 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: priceCalc && acceptTerms && !submitting ? '#15803d' : undefined }}
                >
                  {submitting ? (
                    'Traitement...'
                  ) : (
                    <>
                      <span>Confirmer la réservation</span>
                      <ChevronLeft className="rotate-180" size={18} />
                    </>
                  )}
                </button>

                {/* Conditions */}
                <div className="mt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      En confirmant, j'accepte les{' '}
                      <a href="/terms" className="text-green-600 hover:underline font-medium">
                        conditions d'utilisation
                      </a>
                    </span>
                  </label>
                </div>

                {/* Garantie */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <Shield className="text-green-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-semibold text-green-900 mb-1">
                        Paiement sécurisé
                      </p>
                      <p className="text-xs text-green-700">
                        Vos données sont cryptées et protégées
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModern;

