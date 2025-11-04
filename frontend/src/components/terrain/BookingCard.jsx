import { useState, useRef, useEffect } from 'react';
import { Star, Flag, Calendar as CalendarIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import DateRangePicker from '../booking/DateRangePicker';

const BookingCard = ({ terrain }) => {
  const navigate = useNavigate();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
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

  const handleDateSelect = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    
    // Fermer le calendrier si les deux dates sont sélectionnées
    if (startDate && endDate) {
      setTimeout(() => setShowCalendar(false), 300);
    }
  };

  const handleClearDates = (e) => {
    e.stopPropagation();
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleReserve = () => {
    if (selectedStartDate) {
      const params = new URLSearchParams({ date: selectedStartDate });
      if (selectedEndDate) params.append('endDate', selectedEndDate);
      navigate(`/booking/${terrain._id}?${params.toString()}`);
    } else {
      navigate(`/booking/${terrain._id}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const calculateNights = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights > 0 ? terrain.pricePerHour * nights : terrain.pricePerHour;
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

      {/* Sélecteur de dates - Style Airbnb */}
      <div className="mb-4 relative" ref={calendarRef}>
        <div 
          onClick={() => setShowCalendar(!showCalendar)}
          className="grid grid-cols-2 border border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-gray-900 transition-colors"
        >
          {/* Arrivée */}
          <div className="px-4 py-3 border-r border-gray-300">
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              ARRIVÉE
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">
                {selectedStartDate 
                  ? new Date(selectedStartDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : 'Ajouter'
                }
              </span>
              {selectedStartDate && (
                <button
                  onClick={handleClearDates}
                  className="text-gray-400 hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Départ */}
          <div className="px-4 py-3">
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              DÉPART
            </label>
            <span className="text-sm text-gray-900 block">
              {selectedEndDate 
                ? new Date(selectedEndDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'Ajouter'
              }
            </span>
          </div>
        </div>

        {/* Calendrier dropdown - Style Airbnb exact */}
        {showCalendar && (
          <>
            {/* Overlay transparent pour fermer au clic */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowCalendar(false)}
            />
            {/* Modal calendrier */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 z-50 w-[650px] max-w-[95vw]">
              <DateRangePicker 
                terrainId={terrain._id}
                onDateSelect={handleDateSelect}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
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

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Estimation */}
      {selectedStartDate && selectedEndDate && (
        <>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 underline decoration-dotted">
                {formatPrice(terrain.pricePerHour)} FCFA x {calculateNights()} {calculateNights() > 1 ? 'nuits' : 'nuit'}
              </span>
              <span className="text-gray-900">{formatPrice(calculateTotal())} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 underline decoration-dotted">
                Frais de service
              </span>
              <span className="text-gray-900">0 FCFA</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Total */}
          <div className="flex justify-between items-center font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(calculateTotal())} FCFA</span>
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

