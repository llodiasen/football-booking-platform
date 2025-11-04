import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { terrainAPI } from '../../services/api';

const DateRangePicker = ({ terrainId, onDateSelect, selectedStartDate, selectedEndDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(selectedStartDate || null);
  const [endDate, setEndDate] = useState(selectedEndDate || null);
  const [bookedDates, setBookedDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookedDates();
  }, [terrainId, currentMonth]);

  const loadBookedDates = async () => {
    if (!terrainId) return;
    
    setLoading(true);
    try {
      const bookedSet = new Set();
      const today = new Date();
      
      // Charger les disponibilités pour les 60 prochains jours
      const promises = [];
      for (let i = 0; i < 60; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        promises.push(
          terrainAPI.getAvailability(terrainId, dateString)
            .then(response => {
              const availability = response.data.data;
              
              // Si toutes les créneaux sont réservés, marquer la date comme complète
              const openingHours = availability.terrain.openingHours;
              const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
              const hours = openingHours[dayName];
              
              if (hours && !hours.closed) {
                // Calculer le nombre de créneaux disponibles
                const openMinutes = parseInt(hours.open.split(':')[0]) * 60 + parseInt(hours.open.split(':')[1]);
                const closeMinutes = parseInt(hours.close.split(':')[0]) * 60 + parseInt(hours.close.split(':')[1]);
                const totalSlots = Math.floor((closeMinutes - openMinutes) / 60);
                
                // Compter les réservations + blocages
                const reservedSlots = availability.reservations?.length || 0;
                const blockedSlots = availability.blockedSlots?.length || 0;
                const takenSlots = reservedSlots + blockedSlots;
                
                // Si tous les créneaux sont pris, marquer la date
                if (takenSlots >= totalSlots) {
                  bookedSet.add(dateString);
                }
              } else if (!hours || hours.closed) {
                // Si fermé ce jour-là, marquer comme non disponible
                bookedSet.add(dateString);
              }
              
              return dateString;
            })
            .catch(err => {
              console.error(`Erreur date ${dateString}:`, err);
              return dateString;
            })
        );
      }
      
      await Promise.all(promises);
      setBookedDates(bookedSet);
    } catch (error) {
      console.error('Erreur chargement dates:', error);
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
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lundi = 0

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderMonth = (monthOffset = 0) => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + monthOffset);
    
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(date);
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
      const isDisabled = isPast || isBooked;
      
      const isStart = startDate && dateString === startDate;
      const isEnd = endDate && dateString === endDate;
      const isInRange = startDate && endDate && 
        currentDate >= new Date(startDate) && 
        currentDate <= new Date(endDate);

      let dayClasses = 'h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all relative';
      
      if (isDisabled) {
        dayClasses += ' text-gray-300 line-through cursor-not-allowed';
      } else if (isStart || isEnd) {
        dayClasses += ' bg-gray-900 text-white font-bold cursor-pointer';
      } else if (isInRange) {
        dayClasses += ' bg-gray-100 text-gray-900 cursor-pointer';
      } else {
        dayClasses += ' text-gray-900 hover:bg-gray-100 cursor-pointer';
      }

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(dateString)}
          disabled={isDisabled}
          className={dayClasses}
          title={isBooked ? 'Déjà réservé' : isPast ? 'Date passée' : ''}
        >
          {day}
          {isBooked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[1px] h-12 bg-red-400 rotate-45 absolute" />
            </div>
          )}
        </button>
      );
    }

    return (
      <div className="flex-1 min-w-[280px]">
        <div className="font-semibold text-gray-900 mb-4 text-center">
          {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </div>
        
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
            <div key={idx} className="h-10 flex items-center justify-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const handleDateClick = (dateString) => {
    if (!startDate || (startDate && endDate)) {
      // Nouvelle sélection
      setStartDate(dateString);
      setEndDate(null);
      if (onDateSelect) onDateSelect(dateString, null);
    } else {
      // Sélection de la date de fin
      const start = new Date(startDate);
      const end = new Date(dateString);
      
      if (end < start) {
        // Si la date de fin est avant le début, inverser
        setStartDate(dateString);
        setEndDate(startDate);
        if (onDateSelect) onDateSelect(dateString, startDate);
      } else {
        setEndDate(dateString);
        if (onDateSelect) onDateSelect(startDate, dateString);
      }
    }
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    if (onDateSelect) onDateSelect(null, null);
  };

  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const formatDateRange = () => {
    if (!startDate) return 'Sélectionnez vos dates';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const startFormatted = start.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (!end) return startFormatted;
    
    const endFormatted = end.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return (
      <div>
        <div className="font-semibold text-gray-900">
          {nights} {nights > 1 ? 'nuits' : 'nuit'}
        </div>
        <div className="text-sm text-gray-600">
          {startFormatted} - {endFormatted}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* En-tête avec dates sélectionnées */}
      {startDate && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex-1">
            {formatDateRange()}
          </div>
          <button
            onClick={handleClearDates}
            className="text-sm text-gray-600 underline hover:text-gray-900 flex items-center gap-1"
          >
            Effacer les dates
          </button>
        </div>
      )}

      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendriers (2 mois côte à côte) */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-4">
          {renderMonth(0)}
          {renderMonth(1)}
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-900"></div>
          <span className="text-gray-700 font-medium">Dates sélectionnées</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200"></div>
          <span className="text-gray-700 font-medium">Plage sélectionnée</span>
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

export default DateRangePicker;

