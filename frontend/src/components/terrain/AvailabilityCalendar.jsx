import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { terrainAPI } from '../../services/api';

const AvailabilityCalendar = ({ terrainId, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailability();
  }, [terrainId, currentMonth]);

  const loadAvailability = async () => {
    if (!terrainId) return;
    
    setLoading(true);
    try {
      const bookedSet = new Set();
      const today = new Date();
      
      // Charger les 30 prochains jours
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        try {
          const response = await terrainAPI.getAvailability(terrainId, dateString);
          const availability = response.data.data;
          
          const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
          const hours = availability.terrain.openingHours[dayName];
          
          if (hours && !hours.closed) {
            const openMinutes = parseInt(hours.open.split(':')[0]) * 60;
            const closeMinutes = parseInt(hours.close.split(':')[0]) * 60;
            const totalSlots = Math.floor((closeMinutes - openMinutes) / 60);
            
            const reservedSlots = availability.reservations?.length || 0;
            const blockedSlots = availability.blockedSlots?.length || 0;
            const takenSlots = reservedSlots + blockedSlots;
            
            if (takenSlots >= totalSlots) {
              bookedSet.add(dateString);
            }
          }
        } catch (err) {
          console.error(`Erreur date ${dateString}:`, err);
        }
      }
      
      setBookedDates(bookedSet);
    } catch (error) {
      console.error('Erreur chargement disponibilités:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderMonth = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Jours vides au début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateString = currentDate.toISOString().split('T')[0];
      const isPast = currentDate < today;
      const isBooked = bookedDates.has(dateString);
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = selectedDate === dateString;
      const isDisabled = isPast || isBooked;
      
      let dayClasses = 'h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium relative transition-all';
      
      if (isDisabled) {
        dayClasses += ' text-gray-300 cursor-not-allowed';
      } else if (isSelected) {
        dayClasses += ' bg-gray-900 text-white font-bold cursor-pointer';
      } else if (isToday) {
        dayClasses += ' border-2 border-gray-900 text-gray-900 font-bold cursor-pointer hover:bg-gray-100';
      } else {
        dayClasses += ' text-gray-900 cursor-pointer hover:bg-gray-100';
      }

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onDateSelect && onDateSelect(dateString)}
          disabled={isDisabled}
          className={dayClasses}
          title={isBooked ? 'Tous les créneaux sont pris' : isPast ? 'Date passée' : ''}
        >
          {day}
          {isBooked && !isPast && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[1.5px] h-12 bg-red-500 rotate-45" />
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {selectedDate && (
            <p className="text-sm text-gray-700 mb-1">
              Date sélectionnée
            </p>
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDate 
              ? new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Sélectionnez une date'
            }
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center capitalize">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
          <div key={idx} className="h-10 flex items-center justify-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendrier */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {renderMonth()}
        </div>
      )}

      {/* Légende */}
      <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-gray-200 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-900 rounded-full"></div>
          <span className="text-gray-700 font-medium">Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full relative flex items-center justify-center">
            <span className="text-gray-400 line-through font-bold">15</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[1.5px] h-6 bg-red-500 rotate-45"></div>
            </div>
          </div>
          <span className="text-red-600 font-medium">Dates déjà prises</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-500">20</span>
          </div>
          <span className="text-gray-700 font-medium">Disponible</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

