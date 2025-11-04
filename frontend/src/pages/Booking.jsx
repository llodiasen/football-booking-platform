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
  
  // Type de réservation : 'single' (ponctuelle) ou 'subscription' (mensuelle)
  const bookingType = searchParams.get('type') || 'single';
  
  const [formData, setFormData] = useState({
    // Réservation ponctuelle
    date: searchParams.get('date') || '',
    startTime: '',
    endTime: '',
    // Abonnement mensuel
    weekday: '', // 'monday', 'tuesday', etc.
    subscriptionStartDate: '',
    // Commun
    paymentOption: 'full', // 'full' ou 'partial'
    paymentMethod: 'wave',
    message: '',
    notes: ''
  });

  useEffect(() => {
    console.log('🔄 Booking - useEffect déclenché, terrainId:', terrainId);
    loadTerrain();
  }, [terrainId]);

  const loadTerrain = async () => {
    console.log('📥 Booking - Chargement du terrain:', terrainId);
    try {
      const response = await terrainAPI.getOne(terrainId);
      console.log('✅ Booking - Terrain chargé:', response.data.data);
      setTerrain(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Booking - Erreur chargement terrain:', error);
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
    if (!user) {
      showError('Veuillez vous connecter pour finaliser la réservation');
      navigate('/login', { state: { returnTo: `/booking/${terrainId}?date=${formData.date}` }});
      return;
    }

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

  console.log('🎨 Booking - Rendu composant, loading:', loading, 'terrain:', terrain ? 'existe' : 'null');

  if (loading) {
    console.log('⏳ Booking - Affichage spinner de chargement');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!terrain) {
    console.log('❌ Booking - Terrain non trouvé, affichage message erreur');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Terrain non trouvé</p>
      </div>
    );
  }

  console.log('✅ Booking - Affichage de la page complète');
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
          {bookingType === 'subscription' ? 'Demande d\'abonnement mensuel' : 'Demande de réservation'}
        </h1>

        {/* Badge type de réservation */}
        <div className="mb-6">
          {bookingType === 'subscription' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg">
              <span className="text-purple-700 font-semibold">🔄 Abonnement Mensuel</span>
              <span className="text-purple-600 text-sm">4 séances · Même jour et heure</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border-2 border-blue-300 rounded-lg">
              <span className="text-blue-700 font-semibold">⚽ Réservation Ponctuelle</span>
              <span className="text-blue-600 text-sm">Une seule séance</span>
            </div>
          )}
        </div>

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

              {/* Date et créneaux - Flux selon le type */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                
                {/* ======================== */}
                {/* RÉSERVATION PONCTUELLE */}
                {/* ======================== */}
                {bookingType === 'single' && (
                  <>
                    {/* ÉTAPE 1 : Sélection de la date */}
                    {!formData.date && (
                      <div className="space-y-4">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">📅 Étape 1 : Choisissez votre date</div>
                          <p className="text-sm text-gray-600">Sélectionnez la date de votre réservation</p>
                        </div>
                        
                        <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50/30">
                          <AvailabilityCalendar
                            terrainId={terrainId}
                            onDateSelect={(date) => {
                              console.log('📅 Date sélectionnée:', date);
                              setFormData({ ...formData, date, startTime: '', endTime: '' });
                            }}
                            selectedDate={formData.date}
                          />
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 2 : Date sélectionnée + Sélection du créneau */}
                    {formData.date && (
                      <div className="space-y-6">
                        {/* Résumé date sélectionnée */}
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-green-700 text-lg">✓</span>
                                <span className="font-semibold text-gray-900">Date sélectionnée</span>
                              </div>
                              <div className="text-gray-700 font-medium">
                                {new Date(formData.date).toLocaleDateString('fr-FR', { 
                                  weekday: 'long',
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </div>
                            </div>
                            <button 
                              onClick={() => setFormData({ ...formData, date: '', startTime: '', endTime: '' })}
                              className="text-sm font-semibold text-green-700 hover:text-green-900 underline"
                            >
                              Modifier
                            </button>
                          </div>
                        </div>

                        {/* TimeSlotPicker pour choisir le créneau */}
                        <div>
                          <div className="mb-4">
                            <div className="font-semibold text-gray-900 mb-1">⏰ Étape 2 : Choisissez votre créneau horaire</div>
                            {formData.startTime && formData.endTime ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-700 text-lg">✓</span>
                                <span className="text-gray-700">
                                  Créneau : <span className="font-medium">{formData.startTime} - {formData.endTime}</span>
                                  {priceCalc && <span className="ml-2 text-gray-600">({priceCalc.durationHours}h)</span>}
                                </span>
                                <button 
                                  onClick={() => setFormData({ ...formData, startTime: '', endTime: '' })}
                                  className="text-sm font-semibold text-green-700 hover:text-green-900 underline ml-2"
                                >
                                  Modifier
                                </button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600">Cliquez sur un créneau disponible pour le sélectionner</p>
                            )}
                          </div>

                          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50/20">
                            <TimeSlotPicker
                              terrain={terrain}
                              selectedDate={formData.date}
                              onTimeSelect={handleTimeSelect}
                              selectedStartTime={formData.startTime}
                              selectedEndTime={formData.endTime}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ======================== */}
                {/* ABONNEMENT MENSUEL */}
                {/* ======================== */}
                {bookingType === 'subscription' && (
                  <div className="space-y-8">
                    {/* ÉTAPE 1 : Choisir le jour de la semaine */}
                    <div>
                      <div className="mb-4">
                        <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          {formData.weekday ? <span className="text-purple-700">✓</span> : <span>1️⃣</span>}
                          <span>Choisissez le jour de la semaine</span>
                        </div>
                        <p className="text-sm text-gray-600">Votre séance se répétera ce jour chaque semaine</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'monday', label: 'Lundi' },
                          { value: 'tuesday', label: 'Mardi' },
                          { value: 'wednesday', label: 'Mercredi' },
                          { value: 'thursday', label: 'Jeudi' },
                          { value: 'friday', label: 'Vendredi' },
                          { value: 'saturday', label: 'Samedi' },
                          { value: 'sunday', label: 'Dimanche' }
                        ].map((day) => (
                          <button
                            key={day.value}
                            onClick={() => setFormData({ ...formData, weekday: day.value, startTime: '', endTime: '' })}
                            className={`p-4 rounded-xl font-medium transition-all border-2 ${
                              formData.weekday === day.value
                                ? 'bg-purple-100 border-purple-500 text-purple-900 shadow-md'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ÉTAPE 2 : Choisir le créneau (si jour sélectionné) */}
                    {formData.weekday && (
                      <div className="space-y-4">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            {formData.startTime ? <span className="text-purple-700">✓</span> : <span>2️⃣</span>}
                            <span>Choisissez votre créneau horaire</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Ce créneau se répétera chaque {formData.weekday === 'monday' ? 'lundi' : formData.weekday === 'tuesday' ? 'mardi' : formData.weekday === 'wednesday' ? 'mercredi' : formData.weekday === 'thursday' ? 'jeudi' : formData.weekday === 'friday' ? 'vendredi' : formData.weekday === 'saturday' ? 'samedi' : 'dimanche'}
                          </p>
                        </div>

                        {formData.startTime && formData.endTime && (
                          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-purple-700 text-lg">✓</span>
                              <span className="text-gray-700">
                                Créneau : <span className="font-medium">{formData.startTime} - {formData.endTime}</span>
                              </span>
                              <button 
                                onClick={() => setFormData({ ...formData, startTime: '', endTime: '' })}
                                className="text-sm font-semibold text-purple-700 hover:text-purple-900 underline ml-2"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50/20">
                          <p className="text-sm text-gray-600 mb-4">
                            💡 Les créneaux affichés sont basés sur un {formData.weekday === 'monday' ? 'lundi' : formData.weekday === 'tuesday' ? 'mardi' : formData.weekday === 'wednesday' ? 'mercredi' : formData.weekday === 'thursday' ? 'jeudi' : formData.weekday === 'friday' ? 'vendredi' : formData.weekday === 'saturday' ? 'samedi' : 'dimanche'} type
                          </p>
                          <TimeSlotPicker
                            terrain={terrain}
                            selectedDate={(() => {
                              // Trouver le prochain jour correspondant
                              const today = new Date();
                              const daysMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
                              const targetDay = daysMap[formData.weekday];
                              const currentDay = today.getDay();
                              let daysUntilTarget = targetDay - currentDay;
                              if (daysUntilTarget <= 0) daysUntilTarget += 7;
                              const nextDate = new Date(today);
                              nextDate.setDate(today.getDate() + daysUntilTarget);
                              return nextDate.toISOString().split('T')[0];
                            })()}
                            onTimeSelect={handleTimeSelect}
                            selectedStartTime={formData.startTime}
                            selectedEndTime={formData.endTime}
                          />
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 3 : Choisir la date de début (si créneau sélectionné) */}
                    {formData.weekday && formData.startTime && formData.endTime && !formData.subscriptionStartDate && (
                      <div>
                        <div className="mb-4">
                          <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <span>3️⃣</span>
                            <span>Choisissez la date de début</span>
                          </div>
                          <p className="text-sm text-gray-600">À partir de quelle semaine souhaitez-vous commencer ?</p>
                        </div>

                        <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50/20">
                          <AvailabilityCalendar
                            terrainId={terrainId}
                            onDateSelect={(date) => {
                              setFormData({ ...formData, subscriptionStartDate: date });
                            }}
                            selectedDate={formData.subscriptionStartDate}
                          />
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 4 : Résumé des 4 séances (si date de début sélectionnée) */}
                    {formData.subscriptionStartDate && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-purple-700 text-xl">🔄</span>
                          <h3 className="font-bold text-gray-900">Récapitulatif de votre abonnement</h3>
                        </div>

                        <div className="space-y-3">
                          {[0, 7, 14, 21].map((days, index) => {
                            const sessionDate = new Date(formData.subscriptionStartDate);
                            sessionDate.setDate(sessionDate.getDate() + days);
                            return (
                              <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-200">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">
                                    {sessionDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {formData.startTime} - {formData.endTime}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            💰 <span className="font-semibold">Économie de 20%</span> par rapport à 4 réservations individuelles
                          </p>
                        </div>
                      </div>
                    )}
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
