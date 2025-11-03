import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Tag, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { terrainAPI, reservationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Booking = () => {
  const { terrainId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    paymentMethod: 'wave',
    promoCode: '',
    notes: ''
  });

  const [priceCalculation, setPriceCalculation] = useState(null);
  const [step, setStep] = useState(1); // 1: Date/Heure, 2: Récapitulatif, 3: Paiement

  useEffect(() => {
    loadTerrain();
  }, [terrainId]);

  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime) {
      calculatePrice();
    }
  }, [formData.date, formData.startTime, formData.endTime, formData.promoCode]);

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
    if (!terrain) return;

    const start = formData.startTime.split(':').map(Number);
    const end = formData.endTime.split(':').map(Number);
    const durationHours = (end[0] * 60 + end[1] - start[0] * 60 - start[1]) / 60;

    if (durationHours <= 0) {
      setPriceCalculation(null);
      return;
    }

    // Calcul simple (à améliorer avec l'API backend)
    const basePrice = terrain.pricePerHour * durationHours;
    let finalPrice = basePrice;
    let discountAmount = 0;

    // Appliquer réductions
    if (terrain.discounts) {
      terrain.discounts.forEach(discount => {
        if (!discount.active) return;
        
        if (discount.type === 'duration' && durationHours >= discount.conditions.minDuration) {
          const amount = discount.valueType === 'percentage'
            ? (basePrice * discount.value) / 100
            : discount.value;
          discountAmount += amount;
        }
      });
    }

    finalPrice = basePrice - discountAmount;

    setPriceCalculation({
      basePrice,
      discountAmount,
      finalPrice,
      durationHours,
      advancePayment: terrain.bookingRules?.advancePayment?.required
        ? terrain.bookingRules.advancePayment.type === 'percentage'
          ? (finalPrice * terrain.bookingRules.advancePayment.amount) / 100
          : terrain.bookingRules.advancePayment.amount
        : 0
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!priceCalculation) {
      showError('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    try {
      const reservationData = {
        terrain: terrainId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: priceCalculation.durationHours,
        totalPrice: priceCalculation.finalPrice,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await reservationAPI.create(reservationData);
      showSuccess('Réservation créée avec succès ! Redirection vers le paiement...');
      setTimeout(() => navigate('/reservations'), 2000);
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const timeOptions = [];
  for (let h = 6; h <= 23; h++) {
    timeOptions.push(`${h.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${h.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Réserver : {terrain?.name}
            </h1>
            <p className="text-gray-600">
              Complétez le formulaire pour finaliser votre réservation
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="font-medium">Date & Heure</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="font-medium">Récapitulatif</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="font-medium">Paiement</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Colonne Principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Date & Heure */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="text-primary-600" size={24} />
                    Date et Horaire
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="Date de réservation"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de début
                        </label>
                        <select
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure de fin
                        </label>
                        <select
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {priceCalculation && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✅ Durée : {priceCalculation.durationHours}h (minimum 1h requis)
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Code Promo */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Tag className="text-primary-600" size={24} />
                    Code Promo (optionnel)
                  </h2>
                  <Input
                    placeholder="WELCOME10"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleChange}
                  />
                </Card>

                {/* Méthode de Paiement */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="text-primary-600" size={24} />
                    Méthode de Paiement
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {['wave', 'orange_money', 'free_money', 'cash'].map(method => (
                      <label
                        key={method}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                          formData.paymentMethod === method
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="font-medium capitalize">
                          {method === 'wave' && '📱 Wave'}
                          {method === 'orange_money' && '🍊 Orange Money'}
                          {method === 'free_money' && '💰 Free Money'}
                          {method === 'cash' && '💵 Espèces'}
                        </span>
                      </label>
                    ))}
                  </div>
                </Card>

                {/* Notes */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Notes (optionnel)</h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Informations supplémentaires pour le propriétaire..."
                    maxLength={500}
                  />
                </Card>
              </div>

              {/* Sidebar - Récapitulatif */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

                  {/* Terrain */}
                  <div className="mb-6 pb-6 border-b">
                    <p className="text-sm text-gray-600 mb-1">Terrain</p>
                    <p className="font-semibold text-gray-900">{terrain?.name}</p>
                    <p className="text-sm text-gray-600">{terrain?.address.city}</p>
                  </div>

                  {/* Date & Heure */}
                  {formData.date && (
                    <div className="mb-6 pb-6 border-b">
                      <p className="text-sm text-gray-600 mb-2">Date & Horaire</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(formData.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.startTime} - {formData.endTime}
                        {priceCalculation && ` (${priceCalculation.durationHours}h)`}
                      </p>
                    </div>
                  )}

                  {/* Prix */}
                  {priceCalculation && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prix de base</span>
                        <span className="font-semibold">{priceCalculation.basePrice.toLocaleString()} FCFA</span>
                      </div>

                      {priceCalculation.discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Réduction</span>
                          <span>-{priceCalculation.discountAmount.toLocaleString()} FCFA</span>
                        </div>
                      )}

                      <div className="pt-3 border-t flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-2xl text-primary-600">
                          {priceCalculation.finalPrice.toLocaleString()} FCFA
                        </span>
                      </div>

                      {priceCalculation.advancePayment > 0 && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm font-semibold text-yellow-900">
                            Acompte à payer maintenant
                          </p>
                          <p className="text-xl font-bold text-yellow-700">
                            {priceCalculation.advancePayment.toLocaleString()} FCFA
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Solde à régler sur place
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bouton Confirmer */}
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={!priceCalculation || submitting}
                  >
                    {submitting ? 'Traitement...' : 'Confirmer la Réservation'}
                  </Button>

                  {/* Sécurité */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle size={14} className="text-green-600" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
