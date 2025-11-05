import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Users, Calendar, Clock, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

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
      {/* Hero Section - Image fixe haute qualité */}
      <div className="relative min-h-[450px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image HD avec overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2940&auto=format&fit=crop"
            alt="Terrain de football professionnel"
            className="w-full h-full object-cover scale-105"
          />
          {/* Overlay gradient pour assombrir et contraste */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-green-900/70"></div>
          
          {/* Effet de grille subtile */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10 py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Title - Font élégante */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-[1.1] drop-shadow-2xl">
              <span className="block bg-gradient-to-r from-white via-white to-green-200 bg-clip-text text-transparent">
                Réservez Votre
              </span>
              <span className="block bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mt-2">
                Terrain de Foot
              </span>
            </h1>
            <p className="text-white/90 text-sm md:text-base lg:text-lg mb-6 md:mb-8 drop-shadow-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Trouvez et réservez les meilleurs terrains de football partout au Sénégal 🇸🇳
            </p>

            {/* Search Bar - Responsive Mobile */}
            <div className="max-w-4xl mx-auto px-2">
              <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-full shadow-2xl p-3 md:p-2 flex flex-col md:flex-row items-stretch gap-3 md:gap-2">
                {/* Recherche par nom */}
                <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-0">
                  <SearchIcon className="text-gray-400 flex-shrink-0" size={18} />
                  <input
                    type="text"
                    placeholder="Nom du terrain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm md:text-base text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-gray-200"></div>

                {/* Ville */}
                <div className="flex-1 flex items-center gap-2 px-3 md:px-4 py-2 md:py-0">
                  <MapPin className="text-gray-400 flex-shrink-0" size={18} />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-sm md:text-base text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">Toutes les villes</option>
                    {senegalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Bouton Rechercher - Full width sur mobile */}
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold h-10 px-6 md:px-8 rounded-full transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Rechercher
                </button>
              </form>

              {/* Bouton Près de moi - Mobile séparé */}
              <button
                type="button"
                onClick={handleNearMe}
                disabled={isLocating}
                className="md:hidden mt-3 w-full bg-white/90 backdrop-blur-sm text-gray-700 font-medium px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-2"
              >
                {isLocating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
                ) : (
                  <>
                    <MapPin size={20} />
                    <span>Près de moi</span>
                  </>
                )}
              </button>

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

      {/* Nos Terrains - Full Width Stretched */}
      <div className="pb-8 md:pb-12">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            
            {/* Terrain 5x5 - Responsive */}
            <Link to="/terrains?size=5x5" className="group cursor-pointer relative overflow-hidden h-[280px] md:h-[400px]">
              {/* Image de fond */}
              <div className="absolute inset-0 bg-[url('/images/terrain-5x5.jpg')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
              
              {/* Overlay gradient sombre */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
              
              {/* Overlay couleur au hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Contenu - Responsive */}
              <div className="relative h-full flex flex-col justify-end p-5 md:p-8 text-white">
                <p className="text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 font-bold opacity-90">
                  221FOOT
                </p>
                <h3 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  Terrain foot À 5
                </h3>
                <p className="text-sm md:text-base opacity-90 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                  terrain à 5, où l'excitation du jeu et l'esprit d'équipe se rencontrent.
                </p>
                
                {/* Ligne décorative */}
                <div className="mt-3 md:mt-6 w-16 md:w-20 h-1 bg-green-500 group-hover:w-24 md:group-hover:w-32 transition-all duration-300"></div>
              </div>

              {/* Badge taille */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-green-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                5x5
              </div>
            </Link>

            {/* Terrain 7x7 - Responsive */}
            <Link to="/terrains?size=7x7" className="group cursor-pointer relative overflow-hidden h-[280px] md:h-[400px]">
              {/* Image de fond */}
              <div className="absolute inset-0 bg-[url('/images/terrain-7x7.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
              
              {/* Overlay gradient sombre */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
              
              {/* Overlay couleur au hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Contenu - Responsive */}
              <div className="relative h-full flex flex-col justify-end p-5 md:p-8 text-white">
                <p className="text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 font-bold opacity-90">
                  221FOOT
                </p>
                <h3 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  Terrain foot À 7
                </h3>
                <p className="text-sm md:text-base opacity-90 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                  l'action palpitante et l'adrénaline du jeu vous attendent.
                </p>
                
                {/* Ligne décorative */}
                <div className="mt-3 md:mt-6 w-16 md:w-20 h-1 bg-green-400 group-hover:w-24 md:group-hover:w-32 transition-all duration-300"></div>
              </div>

              {/* Badge taille */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                7x7
              </div>
            </Link>

            {/* Terrain 11x11 - Responsive */}
            <Link to="/terrains?size=11x11" className="group cursor-pointer relative overflow-hidden h-[280px] md:h-[400px]">
              {/* Image de fond */}
              <div className="absolute inset-0 bg-[url('/images/terrain-11x11.webp')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"></div>
              
              {/* Overlay gradient sombre */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>
              
              {/* Overlay couleur au hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Contenu - Responsive */}
              <div className="relative h-full flex flex-col justify-end p-5 md:p-8 text-white">
                <p className="text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 font-bold opacity-90">
                  221FOOT
                </p>
                <h3 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                  Terrain foot À 11
                </h3>
                <p className="text-sm md:text-base opacity-90 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                  chaque dribble et chaque but sont une véritable expérience.
                </p>
                
                {/* Ligne décorative */}
                <div className="mt-3 md:mt-6 w-16 md:w-20 h-1 bg-green-400 group-hover:w-24 md:group-hover:w-32 transition-all duration-300"></div>
              </div>

              {/* Badge taille */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-green-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg">
                11x11
              </div>
            </Link>
          </div>
        </div>
      </div>


      {/* How it Works Section - Responsive */}
      <div className="relative bg-gradient-to-br from-green-50 to-white py-12 md:py-20 overflow-hidden">
        {/* Ligne décorative */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>

        <div className="relative z-10 px-4 md:px-8 lg:px-12">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600">
              Réservez votre terrain en quelques clics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {/* Étape 1 */}
            <div className="relative bg-white border-r border-gray-100 p-8 hover:bg-gray-50 transition-all group">
              <div className="text-center">
                <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <SearchIcon className="text-green-600" size={28} />
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">ÉTAPE 1</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Recherchez</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Trouvez le terrain parfait près de chez vous
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative bg-white border-r border-gray-100 p-8 hover:bg-gray-50 transition-all group">
              <div className="text-center">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="text-blue-600" size={28} />
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">ÉTAPE 2</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Choisissez</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sélectionnez votre date et créneau horaire
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="relative bg-white border-r border-gray-100 p-8 hover:bg-gray-50 transition-all group">
              <div className="text-center">
                <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="text-purple-600" size={28} />
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">ÉTAPE 3</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Payez</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Réglez en ligne en toute sécurité
                </p>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="relative bg-white p-8 hover:bg-gray-50 transition-all group">
              <div className="text-center">
                <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="text-yellow-600" size={28} />
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">ÉTAPE 4</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Jouez !</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Présentez-vous et profitez de votre match
                </p>
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

      {/* CTA Propriétaires - Avec image HD */}
      <div className="relative overflow-hidden py-16 md:py-20">
        {/* Background Image HD */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2940&auto=format&fit=crop"
            alt="Terrain de football professionnel"
            className="w-full h-full object-cover"
          />
          {/* Overlay sombre pour contraste */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-green-900/70"></div>
        </div>

        {/* Content */}
        <div className="container-custom px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Vous êtes propriétaire ?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              Rejoignez notre plateforme et augmentez votre visibilité
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
              <Link to="/register?role=owner" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-base" style={{ backgroundColor: '#15803d' }}>
                  Inscrire mon terrain
                </button>
              </Link>
              <Link to="/terrains" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30 text-base">
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Actualités - Responsive */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20">
        <div className="container-custom px-4">
          {/* En-tête */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
              Actualités & Conseils
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600">
              Restez informé des dernières nouveautés du football au Sénégal
            </p>
          </div>

          {/* Grille d'Articles - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                  
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary-600 transition">
                    Nouveau terrain inauguré à Dakar
                  </h3>
                  
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3">
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
                  
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary-600 transition">
                    5 conseils pour organiser un tournoi
                  </h3>
                  
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3">
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
                  
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary-600 transition">
                    Offre spéciale : -20% sur longue durée
                  </h3>
                  
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3">
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

