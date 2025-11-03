import { useState, useEffect } from 'react';
import { terrainAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { X, Upload, MapPin, DollarSign, Image as ImageIcon, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PricingEditor from './PricingEditor';
import DiscountsEditor from './DiscountsEditor';

const TerrainFormModal = ({ terrain, onClose, onSuccess }) => {
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      region: '',
      coordinates: {
        type: 'Point',
        coordinates: [0, 0] // [longitude, latitude]
      }
    },
    type: 'synthetique',
    size: '7x7',
    pricePerHour: '',
    pricing: {
      useAdvancedPricing: false,
      weekdayPrice: 0,
      weekendPrice: 0,
      timeSlots: []
    },
    discounts: [],
    bookingRules: {
      advancePayment: {
        required: false,
        amount: 50,
        type: 'percentage'
      },
      instructions: 'Merci d\'arriver 15 minutes avant l\'heure de réservation pour récupérer les clés et accéder aux vestiaires.',
      cancellationPolicy: 'Annulation gratuite jusqu\'à 24h avant la réservation.'
    },
    amenities: [],
    openingHours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '22:00', closed: false },
      sunday: { open: '08:00', close: '22:00', closed: false }
    },
    images: []
  });

  const senegalCities = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor',
    'Louga', 'Matam', 'Tambacounda', 'Kolda', 'Diourbel',
    'Mbour', 'Rufisque', 'Pikine', 'Guédiawaye', 'Richard-Toll'
  ];

  const senegalRegions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga',
    'Tambacounda', 'Kaolack', 'Kolda', 'Ziguinchor', 'Fatick',
    'Kaffrine', 'Kédougou', 'Matam', 'Sédhiou'
  ];

  const amenitiesList = [
    { id: 'vestiaires', label: 'Vestiaires' },
    { id: 'douches', label: 'Douches' },
    { id: 'parking', label: 'Parking' },
    { id: 'eclairage', label: 'Éclairage nocturne' },
    { id: 'tribune', label: 'Tribune/Gradins' },
    { id: 'cafeteria', label: 'Cafétéria' },
    { id: 'wifi', label: 'WiFi' }
  ];

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  useEffect(() => {
    if (terrain) {
      setFormData({
        ...terrain,
        pricePerHour: terrain.pricePerHour.toString()
      });
    }
  }, [terrain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    const index = name === 'longitude' ? 0 : 1;
    const newCoordinates = [...formData.address.coordinates.coordinates];
    newCoordinates[index] = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: {
          ...prev.address.coordinates,
          coordinates: newCoordinates
        }
      }
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleDayClosedToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          closed: !prev.openingHours[day].closed
        }
      }
    }));
  };

  const handleBookingRulesChange = (field, value) => {
    if (field.startsWith('advancePayment.')) {
      const subField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bookingRules: {
          ...prev.bookingRules,
          advancePayment: {
            ...prev.bookingRules.advancePayment,
            [subField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bookingRules: {
          ...prev.bookingRules,
          [field]: value
        }
      }));
    }
  };

  const handlePricingChange = (newPricing) => {
    setFormData(prev => ({
      ...prev,
      pricing: newPricing
    }));
  };

  const handleDiscountsChange = (newDiscounts) => {
    setFormData(prev => ({
      ...prev,
      discounts: newDiscounts
    }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Entrez l\'URL de l\'image :');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url, isMain: prev.images.length === 0 }]
      }));
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour)
      };

      if (terrain) {
        await terrainAPI.update(terrain._id, dataToSend);
        showSuccess('Terrain modifié avec succès! 🎉');
      } else {
        await terrainAPI.create(dataToSend);
        showSuccess('Terrain créé avec succès! 🎉');
      }
      onSuccess();
    } catch (err) {
      showError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {terrain ? 'Modifier le terrain' : 'Ajouter un terrain'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin size={20} />
              Informations de base
            </h3>
            
            <Input
              label="Nom du terrain"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Galaxy Arena, Le Temple du Foot..."
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Décrivez votre terrain, les équipements, l'ambiance..."
                required
                minLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 20 caractères</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de terrain
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="synthetique">Synthétique</option>
                  <option value="naturel">Naturel (gazon)</option>
                  <option value="stabilise">Stabilisé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="5x5">5x5 (Futsal)</option>
                  <option value="7x7">7x7</option>
                  <option value="11x11">11x11 (Terrain complet)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adresse & Localisation</h3>
            
            <Input
              label="Rue / Adresse"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Ex: Boulevard Habib Bourguiba, Ouakam"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <select
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Sélectionnez une ville</option>
                  {senegalCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région
                </label>
                <select
                  name="address.region"
                  value={formData.address.region}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Sélectionnez une région</option>
                  {senegalRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Longitude"
                name="longitude"
                type="number"
                step="0.000001"
                value={formData.address.coordinates.coordinates[0]}
                onChange={handleCoordinatesChange}
                placeholder="-17.4677"
              />
              <Input
                label="Latitude"
                name="latitude"
                type="number"
                step="0.000001"
                value={formData.address.coordinates.coordinates[1]}
                onChange={handleCoordinatesChange}
                placeholder="14.7167"
              />
            </div>
            <p className="text-xs text-gray-500">
              💡 Utilisez Google Maps pour trouver les coordonnées GPS exactes
            </p>
          </div>

          {/* Prix */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign size={20} />
              Tarification
            </h3>
            
            <Input
              label="Prix de base par heure (FCFA)"
              name="pricePerHour"
              type="number"
              value={formData.pricePerHour}
              onChange={handleChange}
              placeholder="25000"
              required
              min="0"
            />
            <p className="text-xs text-gray-600">
              💡 Ce prix s'applique si vous n'activez pas la tarification avancée
            </p>

            {/* Tarification Avancée */}
            <PricingEditor
              pricing={formData.pricing}
              onPricingChange={handlePricingChange}
            />

            {/* Réductions & Promotions */}
            <DiscountsEditor
              discounts={formData.discounts}
              onDiscountsChange={handleDiscountsChange}
            />
          </div>

          {/* Règles de Réservation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={20} />
              Règles de Réservation
            </h3>
            
            {/* Acompte */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bookingRules.advancePayment.required}
                  onChange={(e) => handleBookingRulesChange('advancePayment.required', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="font-medium">Exiger un acompte pour valider la réservation</span>
              </label>

              {formData.bookingRules.advancePayment.required && (
                <div className="ml-6 space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'acompte
                      </label>
                      <select
                        value={formData.bookingRules.advancePayment.type}
                        onChange={(e) => handleBookingRulesChange('advancePayment.type', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="percentage">Pourcentage (%)</option>
                        <option value="fixed">Montant fixe (FCFA)</option>
                      </select>
                    </div>

                    <Input
                      label={formData.bookingRules.advancePayment.type === 'percentage' ? 'Pourcentage' : 'Montant (FCFA)'}
                      type="number"
                      value={formData.bookingRules.advancePayment.amount}
                      onChange={(e) => handleBookingRulesChange('advancePayment.amount', parseFloat(e.target.value) || 0)}
                      placeholder={formData.bookingRules.advancePayment.type === 'percentage' ? '50' : '15000'}
                      min="0"
                      max={formData.bookingRules.advancePayment.type === 'percentage' ? '100' : undefined}
                    />
                  </div>

                  <p className="text-xs text-gray-600">
                    {formData.bookingRules.advancePayment.type === 'percentage' 
                      ? `Les clients devront payer ${formData.bookingRules.advancePayment.amount}% du montant total pour confirmer leur réservation.`
                      : `Les clients devront payer ${formData.bookingRules.advancePayment.amount.toLocaleString()} FCFA pour confirmer leur réservation.`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Consignes de location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consignes pour les clients 📋
              </label>
              <textarea
                value={formData.bookingRules.instructions}
                onChange={(e) => handleBookingRulesChange('instructions', e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ajoutez des consignes supplémentaires si nécessaire..."
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bookingRules.instructions.length}/1000 caractères
              </p>
              <p className="text-xs text-gray-600 mt-1">
                💡 Consigne par défaut : "Merci d'arriver 15 minutes avant l'heure de réservation"
              </p>
              <p className="text-xs text-gray-600 mt-1">
                ℹ️ Durée minimum de réservation : 1 heure
              </p>
            </div>

            {/* Politique d'annulation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique d'annulation
              </label>
              <textarea
                value={formData.bookingRules.cancellationPolicy}
                onChange={(e) => handleBookingRulesChange('cancellationPolicy', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: Annulation gratuite jusqu'à 24h avant la réservation. Au-delà, l'acompte est non remboursable."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bookingRules.cancellationPolicy.length}/500 caractères
              </p>
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Équipements disponibles</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {amenitiesList.map(amenity => (
                <label 
                  key={amenity.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Horaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={20} />
              Horaires d'ouverture
            </h3>
            <div className="space-y-3">
              {days.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-2 w-32">
                    <input
                      type="checkbox"
                      checked={formData.openingHours[key].closed}
                      onChange={() => handleDayClosedToggle(key)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                  
                  {!formData.openingHours[key].closed ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={formData.openingHours[key].open}
                        onChange={(e) => handleHoursChange(key, 'open', e.target.value)}
                        className="px-3 py-1 border rounded"
                      />
                      <span className="text-gray-500">à</span>
                      <input
                        type="time"
                        value={formData.openingHours[key].close}
                        onChange={(e) => handleHoursChange(key, 'close', e.target.value)}
                        className="px-3 py-1 border rounded"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm flex-1">Fermé</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon size={20} />
              Photos du terrain
            </h3>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleImageUrlAdd}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Ajouter une image (URL)
            </Button>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Terrain ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {img.isMain && (
                      <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : (terrain ? 'Modifier' : 'Créer le terrain')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TerrainFormModal;

