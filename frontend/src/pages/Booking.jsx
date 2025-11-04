import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Star, Calendar, Clock, CheckCircle, CreditCard, MessageCircle, User as UserIcon, Shield } from 'lucide-react';
import { terrainAPI, reservationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import TimeSlotPicker from '../components/reservation/TimeSlotPicker';
import AvailabilityCalendar from '../components/terrain/AvailabilityCalendar';

const Booking = () => {
  const { terrainId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: searchParams.get('date') || '',
    startTime: '',
    endTime: '',
    paymentOption: 'full', // 'full' ou 'partial'
    paymentMethod: 'wave',
    message: '',
    notes: ''
  });

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
      total,
      advancePayment: formData.paymentOption === 'partial' ? total * 0.5 : total,
      remainingPayment: formData.paymentOption === 'partial' ? total * 0.5 : 0
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
    if (!priceCalc) {
      showError('Veuillez sélectionner une date et un créneau');
      return;
    }

    setSubmitting(true);
    try {
      const reservationData = {
        terrain: terrainId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: priceCalc.durationHours,
        totalPrice: priceCalc.total,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      await reservationAPI.create(reservationData);
      showSuccess('Réservation créée avec succès !');
      setTimeout(() => navigate('/reservations'), 2000);
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const steps = [
    { id: 1, title: 'Choisissez quand vous souhaitez payer', icon: CreditCard },
    { id: 2, title: 'Ajoutez un mode de paiement', icon: Shield },
    { id: 3, title: 'Envoyez un message au propriétaire', icon: MessageCircle },
    { id: 4, title: 'Vérifiez votre demande', icon: CheckCircle }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!terrain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Terrain non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8">
        
        {/* Header avec retour */}
        <button
          onClick={() => navigate(`/terrains/${terrainId}`)}
          className="flex items-center gap-2 text-gray-900 hover:text-gray-700 mb-8"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Retour</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Demande de réservation
        </h1>

        {/* Layout 2 colonnes */}
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Colonne gauche: Étapes */}
          <div className="space-y-8">
            
            {/* Étape 1: Paiement */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-2xl font-bold text-gray-900">1</div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Choisissez quand vous souhaitez payer
                </h2>
              </div>

              <div className="space-y-3 ml-12">
                {/* Option paiement complet */}
                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-gray-900 transition-colors">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="full"
                    checked={formData.paymentOption === 'full'}
                    onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      Payer {priceCalc ? formatPrice(priceCalc.total) : '0'} FCFA maintenant
                    </div>
                  </div>
                </label>

                {/* Option paiement partiel */}
                <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-gray-900 transition-colors">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="partial"
                    checked={formData.paymentOption === 'partial'}
                    onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      Payer une partie maintenant et l'autre plus tard
                    </div>
                    {priceCalc && (
                      <div className="text-sm text-gray-700">
                        {formatPrice(priceCalc.advancePayment)} FCFA maintenant, {formatPrice(priceCalc.remainingPayment)} FCFA à payer le jour J. Pas de frais supplémentaires.
                      </div>
                    )}
                  </div>
                </label>

                <button 
                  onClick={() => priceCalc && setCurrentStep(2)}
                  disabled={!priceCalc}
                  className="w-full mt-6 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-lg transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>

            {/* Étape 2: Mode de paiement */}
            <div className={`border-b border-gray-200 pb-8 ${currentStep < 2 ? 'opacity-40' : ''}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-2xl font-bold text-gray-900">2</div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Ajoutez un mode de paiement
                </h2>
              </div>

              {currentStep >= 2 && (
                <div className="space-y-3 ml-12">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="wave">📱 Wave</option>
                    <option value="orange_money">🟠 Orange Money</option>
                    <option value="credit_card">💳 Carte bancaire</option>
                    <option value="bank_transfer">🏦 Virement bancaire</option>
                  </select>

                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-lg transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>

            {/* Étape 3: Message au propriétaire */}
            <div className={`border-b border-gray-200 pb-8 ${currentStep < 3 ? 'opacity-40' : ''}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-2xl font-bold text-gray-900">3</div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Envoyez un message au propriétaire
                </h2>
              </div>

              {currentStep >= 3 && (
                <div className="ml-12">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Bonjour, je souhaite réserver votre terrain pour..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />

                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-lg transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>

            {/* Étape 4: Vérification */}
            <div className={currentStep < 4 ? 'opacity-40' : ''}>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-2xl font-bold text-gray-900">4</div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Vérifiez votre demande
                </h2>
              </div>

              {currentStep >= 4 && (
                <div className="ml-12">
                  <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    {submitting ? 'Envoi en cours...' : 'Confirmer et payer'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite: Résumé de réservation */}
          <div>
            <div className="sticky top-24 border border-gray-300 rounded-xl p-6 shadow-lg">
              {/* Image et infos terrain */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                {terrain.images && terrain.images[0] && (
                  <img
                    src={terrain.images[0].url}
                    alt={terrain.name}
                    className="w-32 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {terrain.name}
                  </h3>
                  {terrain.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="text-gray-900 fill-gray-900" size={12} />
                      <span className="text-sm font-semibold">
                        {terrain.rating.average.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({terrain.rating.count})
                      </span>
                      <span className="text-sm text-gray-600">·</span>
                      <span className="text-sm text-gray-600">Coup de cœur joueurs</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Annulation gratuite */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="font-semibold text-gray-900 mb-2">
                  Annulation gratuite
                </div>
                <p className="text-sm text-gray-700">
                  Annulez sous 24 heures pour recevoir un remboursement intégral.{' '}
                  <button className="font-semibold underline">
                    Consulter les conditions complètes
                  </button>
                </p>
              </div>

              {/* Date et créneaux */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {/* Sélection de la date (toujours visible) */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Date</div>
                      {formData.date ? (
                        <div className="text-sm text-gray-700">
                          {new Date(formData.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long',
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Sélectionnez une date ci-dessous
                        </div>
                      )}
                    </div>
                    {formData.date && (
                      <button 
                        onClick={() => setFormData({ ...formData, date: '', startTime: '', endTime: '' })}
                        className="text-sm font-semibold underline"
                      >
                        Modifier
                      </button>
                    )}
                  </div>

                  {/* Calendrier (réduit si date déjà sélectionnée) */}
                  {!formData.date && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <AvailabilityCalendar
                        terrainId={terrainId}
                        onDateSelect={(date) => setFormData({ ...formData, date })}
                        selectedDate={formData.date}
                      />
                    </div>
                  )}
                </div>

                {/* Créneaux horaires (apparaissent IMMÉDIATEMENT après sélection date) */}
                {formData.date && (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Créneau horaire</div>
                        {formData.startTime && formData.endTime ? (
                          <div className="text-sm text-gray-700">
                            {formData.startTime} - {formData.endTime} ({priceCalc?.durationHours}h)
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">
                            Sélectionnez un créneau ci-dessous
                          </div>
                        )}
                      </div>
                      {formData.startTime && formData.endTime && (
                        <button 
                          onClick={() => setFormData({ ...formData, startTime: '', endTime: '' })}
                          className="text-sm font-semibold underline"
                        >
                          Modifier
                        </button>
                      )}
                    </div>

                    {/* TimeSlotPicker (toujours visible après sélection date) */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <TimeSlotPicker
                        terrain={terrain}
                        selectedDate={formData.date}
                        onTimeSelect={handleTimeSelect}
                        selectedStartTime={formData.startTime}
                        selectedEndTime={formData.endTime}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Détail du prix */}
              {priceCalc && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 underline decoration-dotted">
                      {formatPrice(terrain.pricePerHour)} FCFA x {priceCalc.durationHours}h
                    </span>
                    <span className="text-gray-900">{formatPrice(priceCalc.basePrice)} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 underline decoration-dotted">
                      Frais de service
                    </span>
                    <span className="text-gray-900">{formatPrice(priceCalc.serviceFee)} FCFA</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total FCFA</span>
                      <span className="text-gray-900">{formatPrice(priceCalc.total)} FCFA</span>
                    </div>
                  </div>

                  <button className="text-sm text-gray-900 underline font-semibold">
                    Détail du prix
                  </button>
                </div>
              )}

              {/* Badge perle rare */}
              {terrain.rating?.average >= 4.8 && (
                <div className="mt-6 flex items-start gap-2 text-sm">
                  <div className="text-pink-500">♦️</div>
                  <p className="text-gray-700">
                    <span className="font-semibold">C'est une perle rare.</span> Les réservations sont fréquentes chez ce propriétaire.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <a href="#" className="hover:underline">Confidentialité</a>
            <span>·</span>
            <a href="#" className="hover:underline">Conditions générales</a>
            <span>·</span>
            <a href="#" className="hover:underline">Fonctionnement du site</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
