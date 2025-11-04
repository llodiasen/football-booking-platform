import { useState } from 'react';
import { Star, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const BookingCard = ({ terrain }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');

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

      {/* Sélecteur de date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez une date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
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
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 underline decoration-dotted">
            {formatPrice(terrain.pricePerHour)} FCFA x 1 heure
          </span>
          <span className="text-gray-900">{formatPrice(terrain.pricePerHour)} FCFA</span>
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
        <span className="text-gray-900">{formatPrice(terrain.pricePerHour)} FCFA</span>
      </div>

      {/* Signaler */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mt-6 mx-auto transition-colors">
        <Flag size={16} />
        Signaler cette annonce
      </button>
    </div>
  );
};

export default BookingCard;

