import { useState, useEffect } from 'react';
import { Calendar, Clock, Lock, Unlock, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { terrainAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AvailabilityManager = ({ terrains, selectedTerrain, onSelectTerrain }) => {
  const { success: showSuccess, error: showError } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [slotToBlock, setSlotToBlock] = useState(null);
  const [blockForm, setBlockForm] = useState({
    reason: 'maintenance',
    note: ''
  });

  // Terrain actuel (soit sélectionné, soit le premier de la liste)
  const terrain = selectedTerrain || terrains?.[0];

  useEffect(() => {
    if (selectedDate && terrain) {
      loadAvailability();
    }
  }, [selectedDate, terrain]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const response = await terrainAPI.getAvailability(terrain._id, selectedDate);
      setAvailability(response.data.data);
      generateTimeSlots(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors du chargement des disponibilités');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (availabilityData) => {
    const slots = [];
    const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = availabilityData.terrain.openingHours[dayName];

    if (!hours || hours.closed) {
      setTimeSlots([]);
      return;
    }

    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    for (let minutes = openMinutes; minutes < closeMinutes; minutes += 60) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const startTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      const endMinutes = minutes + 60;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      const hasReservation = availabilityData.reservations.some(r => r.startTime === startTime);
      const blockedSlot = (availabilityData.blockedSlots || []).find(b => b.startTime === startTime);

      slots.push({
        startTime,
        endTime,
        hasReservation,
        isBlocked: !!blockedSlot,
        blockReason: blockedSlot?.reason,
        blockNote: blockedSlot?.note
      });
    }

    setTimeSlots(slots);
  };

  const handleBlockSlot = (slot) => {
    setSlotToBlock(slot);
    setShowBlockModal(true);
  };

  const confirmBlockSlot = async () => {
    try {
      await terrainAPI.blockTimeSlot(terrain._id, {
        date: selectedDate,
        startTime: slotToBlock.startTime,
        endTime: slotToBlock.endTime,
        reason: blockForm.reason,
        note: blockForm.note
      });

      showSuccess('Créneau bloqué avec succès');
      setShowBlockModal(false);
      setSlotToBlock(null);
      setBlockForm({ reason: 'maintenance', note: '' });
      loadAvailability(); // Recharger
      if (onUpdate) onUpdate();
    } catch (error) {
      showError('Erreur lors du blocage du créneau');
    }
  };

  const handleUnblockSlot = async (slot) => {
    if (!confirm('Débloquer ce créneau ?')) return;

    try {
      await terrainAPI.unblockTimeSlot(terrain._id, {
        date: selectedDate,
        startTime: slot.startTime
      });

      showSuccess('Créneau débloqué avec succès');
      loadAvailability();
      if (onUpdate) onUpdate();
    } catch (error) {
      showError('Erreur lors du déblocage du créneau');
    }
  };

  const reasonLabels = {
    'maintenance': 'Maintenance',
    'private_event': 'Événement privé',
    'closed': 'Fermé',
    'other': 'Autre'
  };

  if (!terrain) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun terrain disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de terrain */}
      {terrains && terrains.length > 1 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sélectionner un terrain
          </label>
          <select
            value={terrain._id}
            onChange={(e) => {
              const selected = terrains.find(t => t._id === e.target.value);
              if (onSelectTerrain) onSelectTerrain(selected);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {terrains.map(t => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestion des Disponibilités
        </h2>
        <p className="text-gray-600">
          Bloquez ou débloquez des créneaux horaires pour {terrain.name}
        </p>
      </div>

      {/* Sélection de date */}
      <Card className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez une date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </Card>

      {/* Grille de créneaux */}
      {selectedDate && (
        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-3">Chargement...</p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="mx-auto mb-3" size={48} />
              <p>Terrain fermé ce jour-là</p>
            </div>
          ) : (
            <>
              {/* Légende */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Réservé par client</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Bloqué manuellement</span>
                </div>
              </div>

              {/* Grille */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all
                      ${slot.isBlocked 
                        ? 'bg-orange-50 border-orange-300' 
                        : slot.hasReservation
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200'
                      }
                    `}
                  >
                    {/* Heure */}
                    <div className="text-center mb-3">
                      <p className="text-sm font-bold text-gray-900">
                        {slot.startTime}
                      </p>
                      <p className="text-xs text-gray-500">à</p>
                      <p className="text-sm font-bold text-gray-900">
                        {slot.endTime}
                      </p>
                    </div>

                    {/* Statut */}
                    <div className="text-center mb-3">
                      {slot.isBlocked && (
                        <div>
                          <p className="text-xs font-medium text-orange-700 mb-1">
                            🔒 {reasonLabels[slot.blockReason] || 'Bloqué'}
                          </p>
                          {slot.blockNote && (
                            <p className="text-xs text-orange-600">
                              {slot.blockNote}
                            </p>
                          )}
                        </div>
                      )}
                      {slot.hasReservation && !slot.isBlocked && (
                        <p className="text-xs font-medium text-blue-700">
                          👤 Réservé
                        </p>
                      )}
                      {!slot.isBlocked && !slot.hasReservation && (
                        <p className="text-xs font-medium text-green-700">
                          ✅ Libre
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {slot.isBlocked ? (
                        <button
                          onClick={() => handleUnblockSlot(slot)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition"
                        >
                          <Unlock size={12} />
                          Débloquer
                        </button>
                      ) : !slot.hasReservation ? (
                        <button
                          onClick={() => handleBlockSlot(slot)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium transition"
                        >
                          <Lock size={12} />
                          Bloquer
                        </button>
                      ) : (
                        <div className="flex-1 px-2 py-1.5 bg-gray-200 text-gray-500 rounded text-xs font-medium text-center">
                          Non modifiable
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">
                    {timeSlots.filter(s => !s.isBlocked && !s.hasReservation).length}
                  </p>
                  <p className="text-xs text-green-600">Libres</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">
                    {timeSlots.filter(s => s.hasReservation).length}
                  </p>
                  <p className="text-xs text-blue-600">Réservés</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">
                    {timeSlots.filter(s => s.isBlocked).length}
                  </p>
                  <p className="text-xs text-orange-600">Bloqués</p>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Modal de blocage */}
      {showBlockModal && slotToBlock && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Bloquer un créneau
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Créneau sélectionné :</p>
              <p className="text-lg font-bold text-gray-900">
                {slotToBlock.startTime} - {slotToBlock.endTime}
              </p>
            </div>

            <div className="space-y-4">
              {/* Raison */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du blocage
                </label>
                <select
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="maintenance">🔧 Maintenance</option>
                  <option value="private_event">🎉 Événement privé</option>
                  <option value="closed">🚫 Fermé</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optionnelle)
                </label>
                <textarea
                  value={blockForm.note}
                  onChange={(e) => setBlockForm({ ...blockForm, note: e.target.value })}
                  placeholder="Ex: Réparation du gazon"
                  maxLength={200}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {blockForm.note.length}/200 caractères
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={confirmBlockSlot}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <Lock size={16} className="mr-2" />
                  Bloquer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;

