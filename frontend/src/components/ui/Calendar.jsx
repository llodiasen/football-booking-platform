import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';

const Calendar = ({ 
  selected, 
  onSelect, 
  disabledDates = [],
  bookedDates = [],
  className = '' 
}) => {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = React.useState(selected || today);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const isDateDisabled = (date) => {
    const isPast = isBefore(date, today);
    const isDisabled = disabledDates.some(d => isSameDay(d, date));
    return isPast || isDisabled;
  };

  const isDateBooked = (date) => {
    return bookedDates.some(d => isSameDay(d, date));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      onSelect(date);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Mois suivant"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectedDay = selected && isSameDay(day, selected);
          const isTodayDay = isToday(day);
          const isDisabled = isDateDisabled(day);
          const isBooked = isDateBooked(day);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={`
                relative h-12 rounded-lg text-sm font-medium transition-all
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-100'}
                ${isSelectedDay ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                ${isTodayDay && !isSelectedDay ? 'border-2 border-green-600 text-green-600' : ''}
                ${!isSelectedDay && !isTodayDay && isCurrentMonth && !isDisabled ? 'text-gray-900' : ''}
                ${isBooked && !isSelectedDay ? 'bg-blue-50 text-blue-700' : ''}
              `}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              
              {/* Indicateur de réservations */}
              {isBooked && !isSelectedDay && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-green-600 rounded-lg"></div>
          <span className="text-gray-600">Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
          <span className="text-gray-600">Sélectionné</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <span className="text-gray-600">Réservations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 opacity-40 rounded-lg"></div>
          <span className="text-gray-600">Indisponible</span>
        </div>
      </div>
    </div>
  );
};

// Wrapper pour React hooks
import React from 'react';
export default Calendar;

