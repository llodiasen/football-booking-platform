import { useState, useRef, useEffect } from 'react';
import { Star, Flag, Calendar as CalendarIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import AvailabilityCalendar from './AvailabilityCalendar';

const BookingCard = ({ terrain }) => {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState('single'); // 'single' ou 'subscription'
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
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    
    let bookingUrl;
    if (bookingType === 'subscription') {
      // Abonnement mensuel
      bookingUrl = `/booking/${terrain._id}?type=subscription`;
    } else {
      // Réservation ponctuelle
      if (selectedDate) {
        bookingUrl = `/booking/${terrain._id}?type=single&date=${selectedDate}`;
      } else {
        bookingUrl = `/booking/${terrain._id}?type=single`;
      }
    }

    // Si non connecté, rediriger vers login avec URL de retour
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(bookingUrl)}`);
    } else {
      navigate(bookingUrl);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const calculateMonthlyPrice = () => {
    // 20% de réduction pour abonnement mensuel (4 semaines)
    const weeklyPrice = terrain.pricePerHour;
    const monthlyPrice = weeklyPrice * 4;
    const discount = monthlyPrice * 0.20;
    return {
      original: monthlyPrice,
      discounted: monthlyPrice - discount,
      discount: discount,
      percentage: 20
    };
  };

  const monthlyPricing = calculateMonthlyPrice();

  const averageRating = terrain.rating?.average || 0;
  const totalReviews = terrain.rating?.count || 0;

  return (
    <div className="sticky top-24 bg-white border border-gray-300 rounded-xl shadow-xl p-6">
      {/* Toggle Réservation / Abonnement */}
      <div className="mb-6 bg-gray-100 rounded-lg p-1 grid grid-cols-2 gap-1">
        <button
          onClick={() => setBookingType('single')}
          className={`py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            bookingType === 'single'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Réservation
        </button>
        <button
          onClick={() => setBookingType('subscription')}
          className={`py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            bookingType === 'subscription'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Abonnement
        </button>
      </div>

      {/* Prix et notation */}
      <div className="mb-6">
        {bookingType === 'single' ? (
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
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-2xl font-semibold text-gray-900">
                  {formatPrice(monthlyPricing.discounted)} FCFA
                </span>
                <span className="text-gray-600"> / mois</span>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold">
                -{monthlyPricing.percentage}%
              </div>
            </div>
            <div className="text-sm text-gray-600 line-through">
              {formatPrice(monthlyPricing.original)} FCFA
            </div>
            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <span className="font-semibold">💰 Économisez {formatPrice(monthlyPricing.discount)} FCFA</span> avec l'abonnement mensuel !
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sélection selon le type */}
      {bookingType === 'single' ? (
        /* Sélecteur de date pour réservation ponctuelle */
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
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowCalendar(false)}
              />
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
      ) : (
        /* Options pour abonnement mensuel */
        <div className="mb-4 space-y-3">
          {/* Jour de la semaine */}
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-2">
              JOUR DE LA SEMAINE
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
              <option value="">Sélectionnez un jour</option>
              <option value="monday">Lundi</option>
              <option value="tuesday">Mardi</option>
              <option value="wednesday">Mercredi</option>
              <option value="thursday">Jeudi</option>
              <option value="friday">Vendredi</option>
              <option value="saturday">Samedi</option>
              <option value="sunday">Dimanche</option>
            </select>
          </div>

          {/* Créneau horaire */}
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-2">
              CRÉNEAU HORAIRE
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
              <option value="">Sélectionnez un créneau</option>
              <option value="08:00-09:00">08:00 - 09:00</option>
              <option value="09:00-10:00">09:00 - 10:00</option>
              <option value="10:00-11:00">10:00 - 11:00</option>
              <option value="14:00-15:00">14:00 - 15:00</option>
              <option value="15:00-16:00">15:00 - 16:00</option>
              <option value="18:00-19:00">18:00 - 19:00</option>
              <option value="19:00-20:00">19:00 - 20:00</option>
              <option value="20:00-21:00">20:00 - 21:00</option>
            </select>
          </div>

          {/* Avantages abonnement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-xs font-semibold text-blue-900 mb-2">✨ Avantages abonnement :</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Même jour et heure chaque semaine</li>
              <li>✓ Priorité de réservation garantie</li>
              <li>✓ Annulation flexible</li>
              <li>✓ Économie de {monthlyPricing.percentage}%</li>
            </ul>
          </div>
        </div>
      )}

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

