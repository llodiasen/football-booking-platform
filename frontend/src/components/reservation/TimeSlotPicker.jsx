import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { terrainAPI } from '../../services/api';

const TimeSlotPicker = ({ terrain, selectedDate, onTimeSelect, selectedStartTime, selectedEndTime }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (selectedDate && terrain) {
      loadAvailability();
    }
  }, [selectedDate, terrain]);

  const loadAvailability = async () => {
    if (!selectedDate || !terrain?._id) {
      console.log('❌ selectedDate ou terrain._id manquant');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Chargement disponibilités pour:', selectedDate);
      const response = await terrainAPI.getAvailability(terrain._id, selectedDate);
      console.log('✅ Disponibilités chargées:', response.data.data);
      setAvailability(response.data.data);
      generateTimeSlots(response.data.data);
    } catch (error) {
      console.error('❌ Erreur chargement disponibilité:', error);
      setTimeSlots([]); // Réinitialiser les créneaux en cas d'erreur
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

    // Générer les créneaux selon la durée minimum de réservation
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    // Durée minimum de réservation (par défaut 2h = 120 min)
    const minDuration = (availabilityData.terrain.bookingRules?.minDuration || 2) * 60;

    for (let minutes = openMinutes; minutes + minDuration <= closeMinutes; minutes += minDuration) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const startTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      const endMinutes = minutes + minDuration;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      // Vérifier si ce créneau est disponible (réservations + blocages manuels)
      const isBookedByReservation = isTimeSlotBooked(startTime, endTime, availabilityData.reservations);
      const isBlockedManually = isTimeSlotBooked(startTime, endTime, availabilityData.blockedSlots || []);
      const isBooked = isBookedByReservation || isBlockedManually;

      slots.push({
        startTime,
        endTime,
        isBooked,
        isManualBlock: isBlockedManually,
        blockReason: isBlockedManually ? getBlockReason(startTime, endTime, availabilityData.blockedSlots) : null,
        display: `${startTime} - ${endTime}`
      });
    }

    setTimeSlots(slots);
  };

  const isTimeSlotBooked = (slotStart, slotEnd, reservations) => {
    if (!reservations || reservations.length === 0) return false;

    return reservations.some(reservation => {
      const resStart = reservation.startTime;
      const resEnd = reservation.endTime;

      // Vérifier si le créneau chevauche une réservation existante
      return (
        (slotStart >= resStart && slotStart < resEnd) ||
        (slotEnd > resStart && slotEnd <= resEnd) ||
        (slotStart <= resStart && slotEnd >= resEnd)
      );
    });
  };

  const getBlockReason = (slotStart, slotEnd, blockedSlots) => {
    if (!blockedSlots) return null;
    
    const blocked = blockedSlots.find(slot => {
      return (
        (slotStart >= slot.startTime && slotStart < slot.endTime) ||
        (slotEnd > slot.startTime && slotEnd <= slot.endTime) ||
        (slotStart <= slot.startTime && slotEnd >= slot.endTime)
      );
    });

    if (blocked) {
      const reasonLabels = {
        'maintenance': 'Maintenance',
        'private_event': 'Événement privé',
        'closed': 'Fermé',
        'other': 'Indisponible'
      };
      return reasonLabels[blocked.reason] || 'Indisponible';
    }

    return null;
  };

  const handleSlotClick = (slot) => {
    if (slot.isBooked) return; // Ne rien faire si réservé
    
    onTimeSelect({
      startTime: slot.startTime,
      endTime: slot.endTime
    });
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-200">
        <Calendar className="mx-auto text-blue-400 mb-3" size={48} />
        <p className="text-blue-700 font-medium">
          Sélectionnez d'abord une date pour voir les créneaux disponibles
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-3">Chargement des disponibilités...</p>
      </div>
    );
  }

  if (availability && availability.terrain.openingHours) {
    const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = availability.terrain.openingHours[dayName];

    if (hours && hours.closed) {
      return (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
          <XCircle className="mx-auto text-red-400 mb-3" size={48} />
          <p className="text-red-700 font-medium">
            Le terrain est fermé ce jour-là
          </p>
        </div>
      );
    }
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-700">
          Aucun créneau disponible pour cette date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="text-green-600" size={20} />
          Créneaux Horaires
        </h3>
        <p className="text-sm text-gray-600">
          {timeSlots.filter(s => !s.isBooked).length} créneaux disponibles
        </p>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4 text-xs mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span className="text-gray-700">Réservé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Sélectionné</span>
        </div>
      </div>

      {/* Grille de créneaux */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => {
          const isSelected = selectedStartTime === slot.startTime;
          
          return (
            <button
              key={index}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.isBooked}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${slot.isBooked 
                  ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-60' 
                  : isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-green-500 hover:shadow-md hover:scale-105 cursor-pointer'
                }
              `}
            >
              {/* Icône de statut */}
              <div className="absolute top-2 right-2">
                {slot.isBooked ? (
                  <XCircle size={16} className="text-red-500" />
                ) : isSelected ? (
                  <CheckCircle size={16} className="text-blue-500" />
                ) : (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>

              {/* Heure */}
              <div className="text-center">
                <p className={`text-sm font-bold mb-1 ${
                  slot.isBooked 
                    ? 'text-red-700' 
                    : isSelected 
                      ? 'text-blue-700'
                      : 'text-gray-900'
                }`}>
                  {slot.startTime}
                </p>
                <p className="text-xs text-gray-500">à</p>
                <p className={`text-sm font-bold ${
                  slot.isBooked 
                    ? 'text-red-700' 
                    : isSelected 
                      ? 'text-blue-700'
                      : 'text-gray-900'
                }`}>
                  {slot.endTime}
                </p>
              </div>

              {/* Label statut */}
              <div className="mt-2">
                <span className={`text-xs font-medium ${
                  slot.isBooked 
                    ? 'text-red-600' 
                    : isSelected 
                      ? 'text-blue-600'
                      : 'text-green-600'
                }`}>
                  {slot.isBooked 
                    ? (slot.isManualBlock && slot.blockReason) 
                      ? slot.blockReason 
                      : 'Réservé'
                    : isSelected 
                      ? 'Sélectionné' 
                      : 'Libre'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info supplémentaire */}
      {availability && availability.reservations.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ {availability.reservations.length} réservation(s) déjà confirmée(s) pour cette date
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;

