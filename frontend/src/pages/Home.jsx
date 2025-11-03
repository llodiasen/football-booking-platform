import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Users, Calendar, Clock, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import HeroSlider from '../components/ui/HeroSlider';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/terrains?city=${selectedCity}&search=${searchQuery}`);
  };

  const handleNearMe = () => {
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        navigate(`/terrains?latitude=${latitude}&longitude=${longitude}&radius=50000`);
        setIsLocating(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        alert('Impossible d\'obtenir votre position. Vérifiez les permissions.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const senegalCities = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 
    'Louga', 'Matam', 'Tambacounda', 'Kolda', 'Diourbel'
  ];

  return (
    <div>
      {/* Hero Section - Minimaliste 221FOOT */}
      <div className="relative min-h-[450px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
        {/* Image Slider Background - FOOTBALL UNIQUEMENT */}
        <HeroSlider
          images={[
            {
              url: '/images/football-hero.webp',
              alt: 'Terrain de football avec ballon',
              fallbackColor: 'from-green-600 to-green-800'
            },
            {
              url: '/images/terrain-5x5.jpg',
              alt: 'Terrain de football 5x5',
              fallbackColor: 'from-green-700 to-green-900'
            },
            {
              url: '/images/terrain-7x7.webp',
              alt: 'Terrain de football 7x7',
              fallbackColor: 'from-green-600 to-green-800'
            },
            {
              url: '/images/terrain-11x11.webp',
              alt: 'Terrain de football 11x11',
              fallbackColor: 'from-green-700 to-green-900'
            }
          ]}
          autoPlayInterval={5000}
        />

        {/* Content */}
        <div className="container-custom relative z-10 py-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight drop-shadow-lg">
              Réservez Votre Terrain
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 drop-shadow-md">
              Des terrains de football partout au Sénégal 🇸🇳
            </p>

            {/* Search Bar - Une seule ligne minimaliste */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-stretch gap-2">
                {/* Recherche par nom */}
                <div className="flex-1 flex items-center gap-2 px-4">
                  <SearchIcon className="text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Nom du terrain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-gray-200"></div>

                {/* Ville */}
                <div className="flex-1 flex items-center gap-2 px-4">
                  <MapPin className="text-gray-400" size={20} />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">Toutes les villes</option>
                    {senegalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-gray-200"></div>

                {/* Bouton Près de moi */}
                <button
                  type="button"
                  onClick={handleNearMe}
                  disabled={isLocating}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:text-green-600 transition-colors disabled:opacity-50 font-medium"
                  title="Trouver les terrains près de moi"
                >
                  {isLocating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
                  ) : (
                    <>
                      <MapPin size={20} />
                      <span className="hidden lg:inline">Près de moi</span>
                    </>
                  )}
                </button>

                {/* Bouton Rechercher */}
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Rechercher
                </button>
              </form>

              {/* Lien rapide */}
              <div className="text-center mt-4">
                <Link
                  to="/terrains"
                  className="text-white/90 hover:text-white font-medium text-sm hover:underline inline-flex items-center gap-2"
                >
                  <span>Voir tous les terrains</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nos Terrains - Style GREEN SPORTS PARK - Full Width */}
      <div className="py-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 h-[380px]">
        {/* Terrain 5x5 */}
        <Link to="/terrains?size=5x5" className="group cursor-pointer relative overflow-hidden rounded-xl">
          {/* Image de fond */}
          <div className="absolute inset-0 bg-[url('/images/terrain-5x5.jpg')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Overlay gradient sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
          
          {/* Overlay couleur au hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Contenu */}
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <p className="text-xs uppercase tracking-[0.3em] mb-3 font-bold opacity-90 group-hover:opacity-100 transition-opacity">
              221FOOT
            </p>
            <h3 className="text-4xl font-extrabold mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Terrain foot À 5
            </h3>
            <p className="text-base opacity-90 leading-relaxed max-w-md group-hover:opacity-100 transition-opacity">
              Venez jouer au football sur notre terrain à 5, où l'excitation du jeu et l'esprit d'équipe se rencontrent.
            </p>
            
            {/* Ligne décorative */}
            <div className="mt-6 w-20 h-1 bg-green-500 group-hover:w-32 transition-all duration-300"></div>
          </div>

          {/* Badge taille */}
          <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            5x5
          </div>
        </Link>

        {/* Terrain 7x7 */}
        <Link to="/terrains?size=7x7" className="group cursor-pointer relative overflow-hidden rounded-xl">
          {/* Image de fond */}
          <div className="absolute inset-0 bg-[url('/images/terrain-7x7.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Overlay gradient sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
          
          {/* Overlay couleur au hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Contenu */}
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <p className="text-xs uppercase tracking-[0.3em] mb-3 font-bold opacity-90 group-hover:opacity-100 transition-opacity">
              221FOOT
            </p>
            <h3 className="text-4xl font-extrabold mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Terrain foot À 7
            </h3>
            <p className="text-base opacity-90 leading-relaxed max-w-md group-hover:opacity-100 transition-opacity">
              Explorez de nouvelles dimensions du football sur notre terrain à 7, où l'action palpitante et l'adrénaline du jeu vous attendent.
            </p>
            
            {/* Ligne décorative */}
            <div className="mt-6 w-20 h-1 bg-green-400 group-hover:w-32 transition-all duration-300"></div>
          </div>

          {/* Badge taille */}
          <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            7x7
          </div>
        </Link>

        {/* Terrain 11x11 */}
        <Link to="/terrains?size=11x11" className="group cursor-pointer relative overflow-hidden rounded-xl">
          {/* Image de fond */}
          <div className="absolute inset-0 bg-[url('/images/terrain-11x11.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Overlay gradient sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
          
          {/* Overlay couleur au hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Contenu */}
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <p className="text-xs uppercase tracking-[0.3em] mb-3 font-bold opacity-90 group-hover:opacity-100 transition-opacity">
              221FOOT
            </p>
            <h3 className="text-4xl font-extrabold mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
              Terrain foot À 11
            </h3>
            <p className="text-base opacity-90 leading-relaxed max-w-md group-hover:opacity-100 transition-opacity">
              Découvrez l'intensité et la stratégie du football sur notre terrain à 11, où chaque dribble et chaque but sont une véritable expérience.
            </p>
            
            {/* Ligne décorative */}
            <div className="mt-6 w-20 h-1 bg-green-400 group-hover:w-32 transition-all duration-300"></div>
          </div>

          {/* Badge taille */}
          <div className="absolute top-6 right-6 bg-green-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            11x11
          </div>
        </Link>
          </div>
        </div>
      </div>


      {/* How it Works Section - Amélioré */}
      <div className="relative bg-gradient-to-br from-green-50 to-white py-20 overflow-hidden">
        {/* Ligne décorative */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Réservez votre terrain en quelques clics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Étape 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-center">
                  <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Recherchez</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Trouvez le terrain parfait près de chez vous avec nos filtres avancés
                  </p>
                </div>
              </div>
              {/* Flèche */}
              <div className="hidden md:block absolute top-1/2 -right-6 text-primary-300 text-3xl font-bold">
                →
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-center">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Réservez</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Choisissez date et horaire, puis payez en ligne en toute sécurité
                  </p>
                </div>
              </div>
              {/* Flèche */}
              <div className="hidden md:block absolute top-1/2 -right-6 text-primary-300 text-3xl font-bold">
                →
              </div>
            </div>

            {/* Étape 3 */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-center">
                  <div className="bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-yellow-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Jouez</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Présentez-vous 15 minutes avant et profitez de votre match !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/terrains">
              <Button size="lg" className="px-10">
                Commencer Maintenant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Propriétaires - Minimaliste */}
      <div className="bg-gray-900 py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              Vous êtes propriétaire ?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Rejoignez notre plateforme et augmentez votre visibilité
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  Inscrire Mon Terrain
                </Button>
              </Link>
              <Link to="/terrains">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Actualités */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container-custom">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Actualités & Conseils
            </h2>
            <p className="text-lg text-gray-600">
              Restez informé des dernières nouveautés du football au Sénégal
            </p>
          </div>

          {/* Grille d'Articles */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article className="group cursor-pointer">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-green-600 to-green-800 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/football-hero.webp')] bg-cover bg-center group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Nouveauté
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock size={14} />
                    <span>Il y a 2 jours</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                    Nouveau terrain inauguré à Dakar
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Galaxy Arena vient d'ouvrir ses portes avec des installations de dernière génération. Terrains synthétiques, éclairage LED et vestiaires premium.
                  </p>
                  
                  <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                    Lire la suite →
                  </span>
                </div>
              </div>
            </article>

            {/* Article 2 */}
            <article className="group cursor-pointer">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/football-hero.webp')] bg-cover bg-center group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Conseils
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock size={14} />
                    <span>Il y a 5 jours</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                    5 conseils pour organiser un tournoi
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Découvrez nos meilleurs conseils pour organiser un tournoi de football réussi avec vos amis ou votre entreprise.
                  </p>
                  
                  <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                    Lire la suite →
                  </span>
                </div>
              </div>
            </article>

            {/* Article 3 */}
            <article className="group cursor-pointer">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-yellow-600 to-yellow-800 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/football-hero.webp')] bg-cover bg-center group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Promo
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock size={14} />
                    <span>Il y a 1 semaine</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">
                    Offre spéciale : -20% sur longue durée
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Réservez 3 heures ou plus et bénéficiez de 20% de réduction sur plusieurs terrains partenaires. Offre limitée !
                  </p>
                  
                  <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                    Lire la suite →
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* Voir tous les articles */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Voir toutes les actualités
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;

