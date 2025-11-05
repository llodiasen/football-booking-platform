import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CreditCard, CheckCircle, MapPin, Star, Phone, Mail, User as UserIcon, Shield } from 'lucide-react';
import { terrainAPI, reservationAPI, paytechAPI } from '../services/api';
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
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
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
    if (!terrain || !formData.startTime || !formData.endTime) return null;
    
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
      // 1. Créer la réservation
      const reservationData = {
        terrain: terrainId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const reservationResponse = await reservationAPI.create(reservationData);
      const reservation = reservationResponse.data.data;

      showSuccess('Réservation créée ! Redirection vers le paiement...');

      // 2. Initier le paiement avec PayTech
      try {
        const paymentResponse = await paytechAPI.initiatePayment(reservation._id);
        
        if (paymentResponse.data.success && paymentResponse.data.data.redirect_url) {
          // Rediriger vers PayTech pour le paiement
          window.location.href = paymentResponse.data.data.redirect_url;
        } else {
          throw new Error('URL de paiement non reçue');
        }
      } catch (paymentError) {
        console.error('Erreur initiation paiement:', paymentError);
        showError('Réservation créée mais erreur lors du paiement. Vous pouvez payer plus tard depuis votre tableau de bord.');
        setTimeout(() => {
          navigate('/dashboard?section=reservations');
        }, 2000);
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la réservation');
      setSubmitting(false);
    }
    // Note: Ne pas mettre setSubmitting(false) ici car on redirige vers PayTech
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

              {/* Si date ET créneau déjà sélectionnés (depuis page terrain) */}
              {formData.date && formData.startTime && formData.endTime ? (
                <div className="space-y-4">
                  {/* Date sélectionnée */}
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
                      className="text-sm text-green-600 hover:text-green-700 font-medium underline"
                    >
                      Modifier
                    </button>
                  </div>

                  {/* Créneau sélectionné */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Créneau horaire</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formData.startTime} - {formData.endTime}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, startTime: '', endTime: '' })}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                        onTimeSelect={handleTimeSelect}
                        selectedStartTime={formData.startTime}
                        selectedEndTime={formData.endTime}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 3. PAIEMENT */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                3. Mode de paiement
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Wave */}
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'wave' })}
                  className={`group relative p-5 border-2 rounded-xl transition-all hover:shadow-md ${
                    formData.paymentMethod === 'wave'
                      ? 'border-[#00D9E1] bg-gradient-to-br from-[#00D9E1]/10 to-[#00D9E1]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {/* Logo Wave stylisé */}
                  <div className="mb-3 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9E1] to-[#00B4BC] rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">W</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Wave</p>
                  <p className="text-xs text-gray-500 mt-1">Mobile Money</p>
                  {formData.paymentMethod === 'wave' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="text-[#00D9E1]" size={20} />
                    </div>
                  )}
                </button>

                {/* Orange Money */}
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'orange_money' })}
                  className={`group relative p-5 border-2 rounded-xl transition-all hover:shadow-md ${
                    formData.paymentMethod === 'orange_money'
                      ? 'border-[#FF6600] bg-gradient-to-br from-[#FF6600]/10 to-[#FF6600]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600] to-[#FF8533] rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">OM</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Orange Money</p>
                  <p className="text-xs text-gray-500 mt-1">Mobile Money</p>
                  {formData.paymentMethod === 'orange_money' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="text-[#FF6600]" size={20} />
                    </div>
                  )}
                </button>

                {/* Free Money */}
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'free_money' })}
                  className={`group relative p-5 border-2 rounded-xl transition-all hover:shadow-md ${
                    formData.paymentMethod === 'free_money'
                      ? 'border-[#E3000F] bg-gradient-to-br from-[#E3000F]/10 to-[#E3000F]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E3000F] to-[#FF1A2B] rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">FM</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Free Money</p>
                  <p className="text-xs text-gray-500 mt-1">Mobile Money</p>
                  {formData.paymentMethod === 'free_money' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="text-[#E3000F]" size={20} />
                    </div>
                  )}
                </button>

                {/* Espèces */}
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                  className={`group relative p-5 border-2 rounded-xl transition-all hover:shadow-md ${
                    formData.paymentMethod === 'cash'
                      ? 'border-green-600 bg-gradient-to-br from-green-50 to-green-25 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-2xl">💵</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">Espèces</p>
                  <p className="text-xs text-gray-500 mt-1">Paiement direct</p>
                  {formData.paymentMethod === 'cash' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                  )}
                </button>
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

