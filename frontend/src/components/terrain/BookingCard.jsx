import { useState, useRef, useEffect } from 'react';
import { Star, Flag, Calendar as CalendarIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import AvailabilityCalendar from './AvailabilityCalendar';

const BookingCard = ({ terrain }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Fermer le calendrier si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCalendar]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Fermer le calendrier après sélection
    setTimeout(() => setShowCalendar(false), 300);
  };

  const handleClearDate = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
  };

  const handleReserve = () => {
    if (selectedDate) {
      navigate(`/booking/${terrain._id}?date=${selectedDate}`);
    } else {
      navigate(`/booking/${terrain._id}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const averageRating = terrain.rating?.average || 0;
  const totalReviews = terrain.rating?.count || 0;

  return (
    <div className="sticky top-24 bg-white border border-gray-300 rounded-xl shadow-xl p-6">
      {/* Prix et notation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-semibold text-gray-900">
              {formatPrice(terrain.pricePerHour)} FCFA
            </span>
            <span className="text-gray-600"> / heure</span>
          </div>
          {totalReviews > 0 && (
            <div className="flex items-center gap-1">
              <Star className="text-gray-900 fill-gray-900" size={14} />
              <span className="font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600 text-sm ml-1">
                · {totalReviews} avis
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sélecteur de date pour terrain de foot */}
      <div className="mb-4 relative" ref={calendarRef}>
        <div 
          onClick={() => setShowCalendar(!showCalendar)}
          className="border border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-gray-900 transition-colors"
        >
          <div className="px-4 py-3">
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              DATE DE RÉSERVATION
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString('fr-FR', { 
                      weekday: 'short',
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })
                  : 'Sélectionnez une date'
                }
              </span>
              {selectedDate && (
                <button
                  onClick={handleClearDate}
                  className="text-gray-400 hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Calendrier dropdown */}
        {showCalendar && (
          <>
            {/* Overlay transparent pour fermer au clic */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowCalendar(false)}
            />
            {/* Modal calendrier */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 z-50 w-[400px] max-w-[95vw]">
              <AvailabilityCalendar 
                terrainId={terrain._id}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
          </>
        )}
      </div>

      {/* Bouton réserver */}
      <Button
        onClick={handleReserve}
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Réserver
      </Button>

      {/* Note de paiement */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Aucun montant ne vous sera débité pour le moment
      </p>

      {/* Information date sélectionnée */}
      {selectedDate && (
        <>
          <div className="border-t border-gray-200 my-6"></div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-green-900">
                Date sélectionnée
              </span>
            </div>
            <p className="text-sm text-green-800">
              {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
            <p className="text-xs text-green-700 mt-2">
              Vous pourrez choisir vos créneaux horaires à l'étape suivante
            </p>
          </div>
        </>
      )}

      {/* Signaler */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mt-6 mx-auto transition-colors">
        <Flag size={16} />
        Signaler cette annonce
      </button>
    </div>
  );
};

export default BookingCard;

