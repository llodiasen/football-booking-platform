import { useState } from 'react';
import { Tag, Plus, Trash2, Percent, DollarSign, Clock, Gift, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const DiscountsEditor = ({ discounts = [], onDiscountsChange }) => {
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    type: 'duration',
    name: '',
    description: '',
    value: '',
    valueType: 'percentage',
    conditions: {
      minDuration: 3,
      promoCode: '',
      timeSlot: {
        startTime: '14:00',
        endTime: '17:00',
        days: []
      },
      maxUses: null
    },
    validFrom: '',
    validUntil: '',
    active: true
  });

  const discountTypes = [
    { value: 'duration', label: 'Réduction Durée', icon: Clock, description: 'Ex: -20% si réservation ≥ 3h' },
    { value: 'promo_code', label: 'Code Promo', icon: Tag, description: 'Ex: WELCOME10 pour -10%' },
    { value: 'time_slot', label: 'Happy Hour', icon: Calendar, description: 'Ex: -30% de 14h à 17h' },
    { value: 'first_booking', label: 'Première Réservation', icon: Gift, description: 'Offre de bienvenue' }
  ];

  const days = [
    { key: 'monday', label: 'Lun' },
    { key: 'tuesday', label: 'Mar' },
    { key: 'wednesday', label: 'Mer' },
    { key: 'thursday', label: 'Jeu' },
    { key: 'friday', label: 'Ven' },
    { key: 'saturday', label: 'Sam' },
    { key: 'sunday', label: 'Dim' }
  ];

  const handleAddDiscount = () => {
    // Validation
    if (!newDiscount.name || !newDiscount.value) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    if (newDiscount.type === 'promo_code' && !newDiscount.conditions.promoCode) {
      alert('Veuillez définir un code promo');
      return;
    }

    if (newDiscount.type === 'time_slot' && newDiscount.conditions.timeSlot.days.length === 0) {
      alert('Sélectionnez au moins un jour pour le créneau');
      return;
    }

    onDiscountsChange([...discounts, {
      ...newDiscount,
      value: parseFloat(newDiscount.value),
      conditions: {
        ...newDiscount.conditions,
        usedCount: 0
      }
    }]);

    // Reset
    setNewDiscount({
      type: 'duration',
      name: '',
      description: '',
      value: '',
      valueType: 'percentage',
      conditions: {
        minDuration: 3,
        promoCode: '',
        timeSlot: {
          startTime: '14:00',
          endTime: '17:00',
          days: []
        },
        maxUses: null
      },
      validFrom: '',
      validUntil: '',
      active: true
    });
    setShowAddDiscount(false);
  };

  const handleRemoveDiscount = (index) => {
    onDiscountsChange(discounts.filter((_, i) => i !== index));
  };

  const toggleDiscountActive = (index) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index].active = !updatedDiscounts[index].active;
    onDiscountsChange(updatedDiscounts);
  };

  const toggleDay = (day) => {
    setNewDiscount(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        timeSlot: {
          ...prev.conditions.timeSlot,
          days: prev.conditions.timeSlot.days.includes(day)
            ? prev.conditions.timeSlot.days.filter(d => d !== day)
            : [...prev.conditions.timeSlot.days, day]
        }
      }
    }));
  };

  const getDiscountIcon = (type) => {
    const found = discountTypes.find(t => t.value === type);
    return found ? found.icon : Tag;
  };

  const formatDiscountValue = (discount) => {
    if (discount.valueType === 'percentage') {
      return `-${discount.value}%`;
    }
    return `-${discount.value.toLocaleString()} FCFA`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <Tag size={18} />
          Réductions & Promotions
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDiscount(!showAddDiscount)}
        >
          <Plus size={16} className="mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Liste des réductions existantes */}
      {discounts.length > 0 && (
        <div className="space-y-2">
          {discounts.map((discount, index) => {
            const Icon = getDiscountIcon(discount.type);
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition ${
                  discount.active
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    discount.active ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon size={18} className={discount.active ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{discount.name}</span>
                      <span className={`text-sm font-bold ${
                        discount.active ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {formatDiscountValue(discount)}
                      </span>
                    </div>
                    {discount.description && (
                      <p className="text-sm text-gray-600 mt-1">{discount.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {discount.type === 'duration' && (
                        <span>≥ {discount.conditions.minDuration}h</span>
                      )}
                      {discount.type === 'promo_code' && (
                        <span className="font-mono bg-white px-2 py-1 rounded border">
                          {discount.conditions.promoCode}
                        </span>
                      )}
                      {discount.conditions.maxUses && (
                        <span>{discount.conditions.usedCount || 0}/{discount.conditions.maxUses} utilisations</span>
                      )}
                      {discount.validUntil && (
                        <span>Jusqu'au {new Date(discount.validUntil).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleDiscountActive(index)}
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      discount.active
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {discount.active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveDiscount(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulaire Ajout Réduction */}
      {showAddDiscount && (
        <div className="p-4 bg-white border-2 border-green-300 rounded-lg space-y-4">
          <h5 className="font-semibold text-green-900">Nouvelle Réduction</h5>

          {/* Type de réduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de réduction
            </label>
            <div className="grid grid-cols-2 gap-2">
              {discountTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setNewDiscount({ ...newDiscount, type: type.value })}
                    className={`p-3 rounded-lg border-2 text-left transition ${
                      newDiscount.type === type.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} className={newDiscount.type === type.value ? 'text-green-600' : 'text-gray-400'} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nom */}
          <Input
            label="Nom de la réduction"
            value={newDiscount.name}
            onChange={(e) => setNewDiscount({ ...newDiscount, name: e.target.value })}
            placeholder="Ex: Promo Longue Durée, Happy Hour..."
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <input
              type="text"
              value={newDiscount.description}
              onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Visible par les clients"
            />
          </div>

          {/* Valeur de la réduction */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de valeur
              </label>
              <select
                value={newDiscount.valueType}
                onChange={(e) => setNewDiscount({ ...newDiscount, valueType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (FCFA)</option>
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeur
              </label>
              <input
                type="number"
                value={newDiscount.value}
                onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
                className="w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder={newDiscount.valueType === 'percentage' ? '20' : '5000'}
                min="0"
                max={newDiscount.valueType === 'percentage' ? '100' : undefined}
              />
              <span className="absolute right-3 top-9 text-gray-500 text-sm">
                {newDiscount.valueType === 'percentage' ? '%' : 'FCFA'}
              </span>
            </div>
          </div>

          {/* Conditions selon le type */}
          {newDiscount.type === 'duration' && (
            <Input
              label="Durée minimum (heures)"
              type="number"
              value={newDiscount.conditions.minDuration}
              onChange={(e) => setNewDiscount({
                ...newDiscount,
                conditions: { ...newDiscount.conditions, minDuration: parseFloat(e.target.value) }
              })}
              placeholder="3"
              min="1"
            />
          )}

          {newDiscount.type === 'promo_code' && (
            <div>
              <Input
                label="Code Promo"
                value={newDiscount.conditions.promoCode}
                onChange={(e) => setNewDiscount({
                  ...newDiscount,
                  conditions: { ...newDiscount.conditions, promoCode: e.target.value.toUpperCase() }
                })}
                placeholder="WELCOME10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Les clients entreront ce code lors de la réservation
              </p>
            </div>
          )}

          {newDiscount.type === 'time_slot' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jours du Happy Hour
                </label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        newDiscount.conditions.timeSlot.days.includes(day.key)
                          ? 'bg-green-600 text-white'
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
                    value={newDiscount.conditions.timeSlot.startTime}
                    onChange={(e) => setNewDiscount({
                      ...newDiscount,
                      conditions: {
                        ...newDiscount.conditions,
                        timeSlot: { ...newDiscount.conditions.timeSlot, startTime: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    value={newDiscount.conditions.timeSlot.endTime}
                    onChange={(e) => setNewDiscount({
                      ...newDiscount,
                      conditions: {
                        ...newDiscount.conditions,
                        timeSlot: { ...newDiscount.conditions.timeSlot, endTime: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          {/* Dates de validité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valide du (optionnel)
              </label>
              <input
                type="date"
                value={newDiscount.validFrom}
                onChange={(e) => setNewDiscount({ ...newDiscount, validFrom: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jusqu'au (optionnel)
              </label>
              <input
                type="date"
                value={newDiscount.validUntil}
                onChange={(e) => setNewDiscount({ ...newDiscount, validUntil: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Limite d'utilisation */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={newDiscount.conditions.maxUses !== null}
                onChange={(e) => setNewDiscount({
                  ...newDiscount,
                  conditions: {
                    ...newDiscount.conditions,
                    maxUses: e.target.checked ? 50 : null
                  }
                })}
                className="w-4 h-4"
              />
              Limiter le nombre d'utilisations
            </label>
            {newDiscount.conditions.maxUses !== null && (
              <input
                type="number"
                value={newDiscount.conditions.maxUses}
                onChange={(e) => setNewDiscount({
                  ...newDiscount,
                  conditions: { ...newDiscount.conditions, maxUses: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="50"
                min="1"
              />
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddDiscount}
              size="sm"
              className="flex-1"
            >
              Créer la réduction
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddDiscount(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Message si aucune réduction */}
      {!showAddDiscount && discounts.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-sm text-gray-600 mb-2">
            💡 <strong>Exemples de réductions :</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• <strong>Longue durée</strong> : -20% si réservation ≥ 3h</li>
            <li>• <strong>Code WELCOME10</strong> : -10% pour nouveaux clients</li>
            <li>• <strong>Happy Hour</strong> : -30% de 14h à 17h en semaine</li>
            <li>• <strong>Première réservation</strong> : -5,000 FCFA de bienvenue</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiscountsEditor;

