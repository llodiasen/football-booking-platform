import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Share2, Heart, 
  Users, Zap, Car, Wifi, Home,
  CheckCircle, X, Facebook, Twitter, Link as LinkIcon, Copy
} from 'lucide-react';
import { terrainAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ImageGallery from '../components/terrain/ImageGallery';
import BookingCard from '../components/terrain/BookingCard';
import ReviewsSection from '../components/terrain/ReviewsSection';
import OwnerProfile from '../components/terrain/OwnerProfile';
import ThingsToKnow from '../components/terrain/ThingsToKnow';
import SingleTerrainMap from '../components/terrain/SingleTerrainMap';
import StickyBookingBar from '../components/terrain/StickyBookingBar';
import AvailabilityCalendar from '../components/terrain/AvailabilityCalendar';

const TerrainDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess } = useToast();
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    loadTerrain();
  }, [id]);

  const loadTerrain = async () => {
    try {
      const response = await terrainAPI.getOne(id);
      setTerrain(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement terrain:', error);
      setLoading(false);
    }
  };

  const amenityIcons = {
    vestiaires: Users,
    douches: Zap,
    parking: Car,
    eclairage: Zap,
    tribune: Home,
    cafeteria: Users,
    wifi: Wifi
  };

  const amenityLabels = {
    vestiaires: 'Vestiaires',
    douches: 'Douches',
    parking: 'Parking',
    eclairage: 'Éclairage',
    tribune: 'Tribune',
    cafeteria: 'Cafétéria',
    wifi: 'WiFi'
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Découvrez ${terrain?.name} sur 221FOOT`;

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      copy: null
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      showSuccess('Lien copié !');
      setShowShareMenu(false);
      return;
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    showSuccess(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!terrain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terrain non trouvé</h2>
          <button 
            onClick={() => navigate('/search')}
            className="text-green-600 hover:underline"
          >
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  const averageRating = terrain.rating?.average || 0;
  const totalReviews = terrain.rating?.count || 0;

  return (
    <div className="bg-white">
      {/* Sticky Booking Bar - Apparaît au scroll */}
      <StickyBookingBar 
        terrain={terrain}
        onShareClick={() => setShowShareMenu(!showShareMenu)}
        onFavoriteClick={handleFavorite}
        isFavorite={isFavorite}
      />

      {/* Container principal */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20 py-6">
        
        {/* Header: Titre + Actions */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {terrain.name}
          </h1>
          
          {/* Sous-header: Rating, Localisation, Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {totalReviews > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="text-gray-900 fill-gray-900" size={16} />
                    <span className="font-semibold text-gray-900">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-600">·</span>
                  <button className="font-semibold text-gray-900 underline hover:bg-gray-100 px-1 rounded">
                    {totalReviews} avis
                  </button>
                  <span className="text-gray-600">·</span>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-600" />
                <button className="font-semibold text-gray-900 underline hover:bg-gray-100 px-1 rounded">
                  {terrain.address.city}, {terrain.address.region}, Sénégal
                </button>
              </div>
            </div>

            {/* Actions: Partager + Favoris */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                >
                  <Share2 size={16} />
                  Partager
                </button>

                {/* Menu partage */}
                {showShareMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowShareMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Facebook size={18} />
                        <span className="font-medium text-gray-900">Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Twitter size={18} />
                        <span className="font-medium text-gray-900">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Copy size={18} />
                        <span className="font-medium text-gray-900">Copier le lien</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleFavorite}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
              >
                <Heart 
                  size={16} 
                  className={isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-700'}
                />
                Enregistrer
              </button>
            </div>
          </div>
        </div>

        {/* Galerie d'images */}
        <ImageGallery images={terrain.images} terrainName={terrain.name} />

        {/* Layout principal: 2 colonnes (détails + booking card) */}
        <div className="grid lg:grid-cols-3 gap-16 mt-12 relative">
          
          {/* Colonne gauche: Détails (2/3) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section intro */}
            <section className="pb-8 border-b border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Terrain de football à {terrain.address.city}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-gray-700">
                  <span>Type: {terrain.type}</span>
                  <span>·</span>
                  <span>Taille: {terrain.size}</span>
                  <span>·</span>
                  <span>Capacité: {terrain.capacity || 22} joueurs</span>
                </div>
              </div>

              {/* Annulation gratuite */}
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Annulation gratuite avant 24h
                  </p>
                  <p className="text-sm text-gray-700">
                    Réservez maintenant et annulez jusqu'à 24 heures avant votre créneau pour un remboursement complet.
                  </p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                À propos de ce terrain
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {terrain.description}
              </p>
            </section>

            {/* Équipements */}
            <section className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Ce que propose ce terrain
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {terrain.amenities && terrain.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || CheckCircle;
                  const label = amenityLabels[amenity] || amenity;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon size={24} className="text-gray-700" />
                      <span className="text-gray-900 font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
              {terrain.amenities && terrain.amenities.length > 8 && (
                <button className="mt-6 px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  Afficher les {terrain.amenities.length} équipements
                </button>
              )}
            </section>

            {/* Calendrier de disponibilité */}
            <section className="pb-8 border-b border-gray-200">
              <AvailabilityCalendar terrainId={terrain._id} />
            </section>

          </div>

          {/* Colonne droite: Booking Card (1/3) - Sticky */}
          <div className="lg:col-span-1">
            <BookingCard terrain={terrain} />
          </div>
        </div>

        {/* Avis - FULL WIDTH */}
        <section className="mt-8 -mx-6 sm:-mx-10 lg:-mx-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20">
            <ReviewsSection terrain={terrain} />
          </div>
        </section>

        {/* Carte FULL WIDTH */}
        <section className="mt-8 -mx-6 sm:-mx-10 lg:-mx-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Où se situe le terrain
            </h3>
            <p className="text-gray-700">
              {terrain.address.street}, {terrain.address.city}, {terrain.address.region}, Sénégal
            </p>
          </div>

          <SingleTerrainMap terrain={terrain} />
          
          {/* Points forts du quartier - Horizontal et joli */}
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20 mt-8">
            <h4 className="font-semibold text-gray-900 mb-6">
              Points forts du quartier
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-3xl">🚌</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Transport</p>
                  <p className="text-xs text-gray-600">Bus à 5 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-3xl">🏪</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Commerce</p>
                  <p className="text-xs text-gray-600">À 2 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="text-3xl">🚗</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Parking</p>
                  <p className="text-xs text-gray-600">Gratuit</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="text-3xl">🏥</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Santé</p>
                  <p className="text-xs text-gray-600">À 10 min</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Propriétaire - FULL WIDTH (sans bordures, fond blanc) */}
        <section className="mt-8 -mx-6 sm:-mx-10 lg:-mx-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20 py-12">
            <OwnerProfile owner={terrain.owner} />
          </div>
        </section>

        {/* À savoir - FULL WIDTH */}
        <section className="mt-0 -mx-6 sm:-mx-10 lg:-mx-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-20 py-12">
            <ThingsToKnow terrain={terrain} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TerrainDetails;
