import { useState } from 'react';
import { DollarSign, Plus, Trash2, Clock, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const PricingEditor = ({ pricing, onPricingChange }) => {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    name: '',
    days: [],
    startTime: '18:00',
    endTime: '22:00',
    price: ''
  });

  const days = [
    { key: 'monday', label: 'Lun', fullLabel: 'Lundi' },
    { key: 'tuesday', label: 'Mar', fullLabel: 'Mardi' },
    { key: 'wednesday', label: 'Mer', fullLabel: 'Mercredi' },
    { key: 'thursday', label: 'Jeu', fullLabel: 'Jeudi' },
    { key: 'friday', label: 'Ven', fullLabel: 'Vendredi' },
    { key: 'saturday', label: 'Sam', fullLabel: 'Samedi' },
    { key: 'sunday', label: 'Dim', fullLabel: 'Dimanche' }
  ];

  const handleToggleAdvanced = () => {
    onPricingChange({
      ...pricing,
      useAdvancedPricing: !pricing.useAdvancedPricing
    });
  };

  const handlePriceChange = (field, value) => {
    onPricingChange({
      ...pricing,
      [field]: parseFloat(value) || 0
    });
  };

  const handleAddTimeSlot = () => {
    if (!newSlot.name || newSlot.days.length === 0 || !newSlot.price) {
      alert('Veuillez remplir tous les champs du créneau');
      return;
    }

    const timeSlots = [...(pricing.timeSlots || []), {
      ...newSlot,
      price: parseFloat(newSlot.price),
      active: true
    }];

    onPricingChange({
      ...pricing,
      timeSlots
    });

    // Reset
    setNewSlot({
      name: '',
      days: [],
      startTime: '18:00',
      endTime: '22:00',
      price: ''
    });
    setShowAddSlot(false);
  };

  const handleRemoveSlot = (index) => {
    const timeSlots = pricing.timeSlots.filter((_, i) => i !== index);
    onPricingChange({
      ...pricing,
      timeSlots
    });
  };

  const toggleDay = (day) => {
    setNewSlot(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toggle Prix Avancés */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div>
          <h4 className="font-semibold text-blue-900">Tarification Avancée</h4>
          <p className="text-sm text-blue-700">
            Prix différents selon les jours et créneaux horaires
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={pricing.useAdvancedPricing}
            onChange={handleToggleAdvanced}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {pricing.useAdvancedPricing && (
        <>
          {/* Prix Semaine & Weekend */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Prix Semaine (Lun-Ven)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pricing.weekdayPrice || ''}
                  onChange={(e) => handlePriceChange('weekdayPrice', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 focus:ring-2 focus:ring-primary-500"
                  placeholder="25000"
                  min="0"
                />
                <span className="absolute right-3 top-2 text-gray-500 text-sm">FCFA/h</span>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <label className="flex items-center gap-2 text-sm font-medium text-orange-900 mb-2">
                <Calendar size={16} />
                Prix Weekend (Sam-Dim)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pricing.weekendPrice || ''}
                  onChange={(e) => handlePriceChange('weekendPrice', e.target.value)}
                  className="w-full rounded-lg border border-orange-300 px-3 py-2 pr-16 focus:ring-2 focus:ring-orange-500"
                  placeholder="35000"
                  min="0"
                />
                <span className="absolute right-3 top-2 text-gray-500 text-sm">FCFA/h</span>
              </div>
            </div>
          </div>

          {/* Créneaux Horaires Spéciaux */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock size={18} />
                Créneaux Horaires Spéciaux
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddSlot(!showAddSlot)}
              >
                <Plus size={16} className="mr-1" />
                Ajouter
              </Button>
            </div>

            {/* Liste des créneaux existants */}
            {pricing.timeSlots && pricing.timeSlots.length > 0 && (
              <div className="space-y-2">
                {pricing.timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-900">{slot.name}</span>
                        <span className="text-sm text-purple-700">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {slot.days.map(d => days.find(day => day.key === d)?.label).join(', ')}
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                          • {slot.price.toLocaleString()} FCFA/h
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire Ajout Créneau */}
            {showAddSlot && (
              <div className="p-4 bg-white border-2 border-purple-300 rounded-lg space-y-4">
                <h5 className="font-semibold text-purple-900">Nouveau Créneau</h5>
                
                <Input
                  label="Nom du créneau"
                  value={newSlot.name}
                  onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
                  placeholder="Ex: Happy Hour, Peak Hours, Soirée..."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jours concernés
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          newSlot.days.includes(day.key)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure début
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure fin
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix pour ce créneau
                  </label>
                  <input
                    type="number"
                    value={newSlot.price}
                    onChange={(e) => setNewSlot({ ...newSlot, price: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 focus:ring-2 focus:ring-purple-500"
                    placeholder="45000"
                    min="0"
                  />
                  <span className="absolute right-3 top-9 text-gray-500 text-sm">FCFA/h</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddTimeSlot}
                    size="sm"
                    className="flex-1"
                  >
                    Ajouter ce créneau
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddSlot(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {/* Exemple d'utilisation */}
            {!showAddSlot && (!pricing.timeSlots || pricing.timeSlots.length === 0) && (
              <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-2">
                  💡 <strong>Exemples de créneaux :</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• <strong>Happy Hour</strong> : Lun-Jeu 14h-18h à 20,000 FCFA</li>
                  <li>• <strong>Peak Hours</strong> : Ven-Sam 18h-23h à 45,000 FCFA</li>
                  <li>• <strong>Matinée</strong> : Lun-Ven 08h-12h à 22,000 FCFA</li>
                </ul>
              </div>
            )}
          </div>

          {/* Prévisualisation */}
          {(pricing.weekdayPrice || pricing.weekendPrice || (pricing.timeSlots && pricing.timeSlots.length > 0)) && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">📊 Aperçu de vos tarifs</h4>
              <div className="space-y-2 text-sm">
                {pricing.weekdayPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Lundi-Vendredi :</span>
                    <span className="font-semibold text-green-700">
                      {pricing.weekdayPrice.toLocaleString()} FCFA/h
                    </span>
                  </div>
                )}
                {pricing.weekendPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Weekend (Sam-Dim) :</span>
                    <span className="font-semibold text-orange-700">
                      {pricing.weekendPrice.toLocaleString()} FCFA/h
                    </span>
                  </div>
                )}
                {pricing.timeSlots && pricing.timeSlots.map((slot, idx) => (
                  <div key={idx} className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-purple-700">
                      {slot.name} ({slot.startTime}-{slot.endTime}) :
                    </span>
                    <span className="font-semibold text-purple-700">
                      {slot.price.toLocaleString()} FCFA/h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!pricing.useAdvancedPricing && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            ℹ️ Vous utilisez actuellement le <strong>prix standard</strong> pour tous les jours et heures.
            Activez la tarification avancée pour définir des prix différents selon les jours et créneaux horaires.
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingEditor;

