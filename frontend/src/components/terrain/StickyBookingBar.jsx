import { useState, useEffect } from 'react';
import { Star, Share2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StickyBookingBar = ({ terrain, onShareClick, onFavoriteClick, isFavorite }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bar sticky après 400px de scroll
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReserve = () => {
    // Vérifier si l'utilisateur est connecté (même logique que BookingCard)
    const token = localStorage.getItem('token');
    const bookingUrl = `/booking/${terrain._id}?type=single`;
    
    if (!token) {
      // Rediriger vers login avec URL de retour
      navigate(`/login?redirect=${encodeURIComponent(bookingUrl)}`);
    } else {
      navigate(bookingUrl);
    }
  };

  const averageRating = terrain.rating?.average || 0;
  const totalReviews = terrain.rating?.count || 0;

  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-md z-[100] transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20">
        <div className="flex items-center justify-between py-4">
          {/* Gauche: Info terrain */}
          <div className="flex items-center gap-4">
            {/* Miniature */}
            {terrain.images && terrain.images[0] && (
              <img
                src={terrain.images[0].url}
                alt={terrain.name}
                className="w-10 h-10 rounded-lg object-cover hidden sm:block"
              />
            )}
            
            {/* Nom et note */}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm hidden md:block">
                {terrain.name}
              </h3>
              {totalReviews > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="text-gray-900 fill-gray-900" size={12} />
                  <span className="font-semibold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({totalReviews} avis)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Droite: Prix + Bouton Réserver + Actions */}
          <div className="flex items-center gap-4">
            {/* Prix */}
            <div className="text-right hidden sm:block">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-gray-900">
                  {terrain.pricePerHour?.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-sm text-gray-600">/ heure</span>
              </div>
            </div>

            {/* Bouton Réserver */}
            <button
              onClick={handleReserve}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Réserver
            </button>

            {/* Actions (Partager + Favoris) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onShareClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Partager"
              >
                <Share2 size={18} className="text-gray-700" />
              </button>
              <button
                onClick={onFavoriteClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Enregistrer"
              >
                <Heart
                  size={18}
                  className={isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-700'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyBookingBar;

