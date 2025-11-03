import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Star, Share2, Heart, Calendar, 
  CheckCircle, Phone, Mail, Shield, Wifi, Car, 
  Users, Zap, Home, ChevronRight, Info, DollarSign, CreditCard,
  ChevronLeft, X, Facebook, Twitter, Link as LinkIcon, Copy
} from 'lucide-react';
import { terrainAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SingleTerrainMap from '../components/terrain/SingleTerrainMap';

const TerrainDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess } = useToast();
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
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

  const getDayName = (day) => {
    const days = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };
    return days[day] || day;
  };

  const getTodayHours = () => {
    if (!terrain?.openingHours) return null;
    const today = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
    return terrain.openingHours[today];
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

  // Navigation images
  const nextImage = () => {
    if (terrain?.images && terrain.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % terrain.images.length);
    }
  };

  const prevImage = () => {
    if (terrain?.images && terrain.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + terrain.images.length) % terrain.images.length);
    }
  };

  // Partage réseaux sociaux
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Découvrez ${terrain?.name} sur 221FOOT - ${terrain?.address.city}, Sénégal`;

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    showSuccess('Lien copié dans le presse-papier !');
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!terrain) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Terrain non trouvé</h2>
        <Link to="/terrains">
          <Button>Retour aux terrains</Button>
        </Link>
      </div>
    );
  }

  const todayHours = getTodayHours();

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Accueil</Link>
            <ChevronRight size={16} />
            <Link to="/terrains" className="hover:text-primary-600">Terrains</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">{terrain.name}</span>
          </div>
        </div>
      </div>

      {/* Galerie Images avec Navigation */}
      <div className="relative h-96 md:h-[500px] bg-gray-900 group">
        {terrain.images && terrain.images.length > 0 ? (
          <>
            {/* Image principale */}
            <img
              src={terrain.images[selectedImage]?.url || terrain.images[0].url}
              alt={terrain.images[selectedImage]?.alt || terrain.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowLightbox(true)}
              loading="eager"
              decoding="async"
              style={{ imageRendering: 'high-quality' }}
            />

            {/* Flèches Navigation */}
            {terrain.images.length > 1 && (
              <>
                {/* Flèche Gauche */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  <ChevronLeft size={24} className="text-gray-900" />
                </button>

                {/* Flèche Droite */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  <ChevronRight size={24} className="text-gray-900" />
                </button>

                {/* Indicateur de position */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                  {selectedImage + 1} / {terrain.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
            <MapPin className="text-white/40" size={120} />
          </div>
        )}

        {/* Actions flottantes - Top Right */}
        <div className="absolute top-6 right-6 flex gap-3">
          {/* Bouton Partage */}
          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition shadow-lg"
            >
              <Share2 size={20} className="text-gray-700" />
            </button>

            {/* Menu Partage */}
            {showShareMenu && (
              <div className="absolute top-14 right-0 bg-white rounded-lg shadow-2xl p-3 w-56 z-10">
                <p className="text-xs font-semibold text-gray-900 mb-3 px-2">Partager ce terrain</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition text-sm text-gray-700 hover:text-blue-600"
                  >
                    <Facebook size={18} />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sky-50 rounded-lg transition text-sm text-gray-700 hover:text-sky-600"
                  >
                    <Twitter size={18} />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition text-sm text-gray-700 hover:text-green-600"
                  >
                    <Phone size={18} />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-sm text-gray-700"
                  >
                    <Copy size={18} />
                    <span>Copier le lien</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bouton Favori */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition shadow-lg"
          >
            <Heart 
              size={20} 
              className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-700'}
            />
          </button>
        </div>
      </div>

      {/* Galerie Miniatures */}
      {terrain.images && terrain.images.length > 1 && (
        <div className="bg-gray-50 border-b">
          <div className="container-custom py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {terrain.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-green-600 ring-2 ring-green-200 scale-105' 
                      : 'border-gray-200 hover:border-green-400'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.alt || `Image ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    decoding="async"
                    style={{ imageRendering: 'high-quality' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lightbox */}
      {showLightbox && terrain.images && terrain.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          {/* Image en grand */}
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={terrain.images[selectedImage].url}
              alt={terrain.images[selectedImage].alt || terrain.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              loading="eager"
              decoding="async"
              style={{ imageRendering: 'high-quality' }}
            />

            {/* Bouton Fermer */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Navigation Lightbox */}
            {terrain.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition"
                >
                  <ChevronLeft size={32} className="text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition"
                >
                  <ChevronRight size={32} className="text-white" />
                </button>

                {/* Compteur */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                  {selectedImage + 1} / {terrain.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Contenu Principal */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne Principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* En-tête */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                  {terrain.size}
                </span>
                <span className="capitalize">{terrain.type}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {terrain.name}
              </h1>

              {/* Localisation */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin size={18} />
                <span>Situé à {terrain.address.city}, {terrain.address.region}</span>
              </div>

              {/* Note */}
              {terrain.rating?.average > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                    <span className="font-bold text-xl">{terrain.rating.average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-600">
                    ({terrain.rating.count} avis)
                  </span>
                </div>
              )}
            </div>

            {/* Horaires d'Ouverture */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="text-primary-600" size={24} />
                Horaires d'ouverture
              </h2>
              
              {todayHours && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="font-semibold text-green-900">
                      Ouvert aujourd'hui
                    </span>
                  </div>
                  <p className="text-green-700 mt-1 ml-7">
                    {todayHours.closed ? 'Fermé' : `${todayHours.open} à ${todayHours.close}`}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {Object.entries(terrain.openingHours || {}).map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium">{getDayName(day)}</span>
                    <span className={hours.closed ? 'text-red-600' : 'text-gray-900'}>
                      {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Adresse & Carte */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-primary-600" size={24} />
                Adresse
              </h2>
              <p className="text-gray-700 mb-4">
                {terrain.address.street && `${terrain.address.street}, `}
                {terrain.address.city}, {terrain.address.region}
              </p>
              
              {/* Carte Interactive */}
              <div className="mt-4">
                <SingleTerrainMap terrain={terrain} />
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">À propos</h2>
              <p className="text-gray-700 leading-relaxed">
                {terrain.description}
              </p>
            </Card>

            {/* Équipements */}
            {terrain.amenities && terrain.amenities.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Équipements & Services</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {terrain.amenities.map((amenity, idx) => {
                    const Icon = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Icon className="text-primary-600" size={20} />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {amenityLabels[amenity] || amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Consignes */}
            {terrain.bookingRules?.instructions && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-blue-600" size={24} />
                  Consignes Importantes
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {terrain.bookingRules.instructions}
                </p>
              </Card>
            )}

            {/* Politique d'Annulation */}
            {terrain.bookingRules?.cancellationPolicy && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Politique d'Annulation</h2>
                <p className="text-gray-700 leading-relaxed">
                  {terrain.bookingRules.cancellationPolicy}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar - Réservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Card Réservation */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Réservation</h2>
                
                {/* Prix */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary-600">
                      {terrain.pricePerHour.toLocaleString()}
                    </span>
                    <span className="text-gray-600">FCFA / heure</span>
                  </div>
                  
                  {/* Prix variables si activés */}
                  {terrain.pricing?.useAdvancedPricing && (
                    <div className="mt-3 text-sm text-gray-600">
                      {terrain.pricing.weekdayPrice && (
                        <p>• Semaine : {terrain.pricing.weekdayPrice.toLocaleString()} FCFA/h</p>
                      )}
                      {terrain.pricing.weekendPrice && (
                        <p>• Weekend : {terrain.pricing.weekendPrice.toLocaleString()} FCFA/h</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Acompte */}
                {terrain.bookingRules?.advancePayment?.required && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                      ⚠️ Acompte requis
                    </p>
                    <p className="text-sm text-yellow-700">
                      {terrain.bookingRules.advancePayment.type === 'percentage'
                        ? `${terrain.bookingRules.advancePayment.amount}% du montant total`
                        : `${terrain.bookingRules.advancePayment.amount.toLocaleString()} FCFA`
                      }
                    </p>
                  </div>
                )}

                {/* Réductions actives */}
                {terrain.discounts && terrain.discounts.filter(d => d.active).length > 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      🎁 Réductions actives
                    </p>
                    {terrain.discounts.filter(d => d.active).map((discount, idx) => (
                      <p key={idx} className="text-sm text-green-700">
                        • {discount.name}
                      </p>
                    ))}
                  </div>
                )}

                {/* Bouton Réserver */}
                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  onClick={() => navigate(`/booking/${terrain._id}`)}
                >
                  <Calendar size={20} className="mr-2" />
                  Réserver Maintenant
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Vous ne serez pas débité immédiatement
                </p>
              </Card>

              {/* Navigation Interne */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 text-gray-900">Dans cette page :</h3>
                <nav className="space-y-2">
                  <a href="#horaires" className="block text-sm text-primary-600 hover:underline">
                    Horaires d'ouverture
                  </a>
                  <a href="#adresse" className="block text-sm text-primary-600 hover:underline">
                    Adresse
                  </a>
                  <a href="#equipements" className="block text-sm text-primary-600 hover:underline">
                    Équipements
                  </a>
                  <a href="#consignes" className="block text-sm text-primary-600 hover:underline">
                    Consignes
                  </a>
                  <a href="#avis" className="block text-sm text-primary-600 hover:underline">
                    Avis
                  </a>
                </nav>
              </Card>

              {/* Infos Pratiques */}
              <Card className="p-6 bg-gray-50">
                <h3 className="font-bold mb-4 text-gray-900">Infos Pratiques</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Durée minimum : 1 heure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Arriver 15min avant</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="font-medium">Acompte 50% requis</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CreditCard size={16} className="text-green-600" />
                    <span>Paiement en ligne obligatoire</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Shield size={16} className="text-green-600" />
                    <span>Paiement sécurisé</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Avis Section */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Avis des clients</h2>
          
          {terrain.reviews && terrain.reviews.length > 0 ? (
            <div className="space-y-4">
              {terrain.reviews.slice(0, 5).map((review, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="text-primary-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Client</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">Aucun avis pour le moment</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerrainDetails;
