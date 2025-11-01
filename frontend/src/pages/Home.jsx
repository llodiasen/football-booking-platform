import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Users, Calendar, Star, Clock, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import HeroSlider from '../components/ui/HeroSlider';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/terrains?city=${selectedCity}&search=${searchQuery}`);
  };

  const senegalCities = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 
    'Louga', 'Matam', 'Tambacounda', 'Kolda', 'Diourbel'
  ];

  return (
    <div>
      {/* Hero Section - Style SportsBooking.mt avec Slider */}
      <div className="relative min-h-[450px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
        {/* Image Slider Background */}
        <HeroSlider
          images={[
            {
              url: '/images/football-hero.webp',
              alt: 'Terrain de football avec ballon',
              fallbackColor: 'from-green-600 to-green-800'
            },
            {
              url: '/images/basketball-hero.webp',
              alt: 'Basketball sur le panier',
              fallbackColor: 'from-orange-600 to-orange-800'
            },
            {
              url: '/images/Tennis-hero.webp',
              alt: 'Court de tennis',
              fallbackColor: 'from-yellow-500 to-yellow-700'
            },
            {
              url: '/images/natation-hero.jpg',
              alt: 'Piscine olympique avec nageurs',
              fallbackColor: 'from-blue-600 to-blue-800'
            },
            {
              url: '/images/fitness-hero.jpg',
              alt: 'Salle de sport et fitness',
              fallbackColor: 'from-purple-600 to-purple-800'
            }
          ]}
          autoPlayInterval={5000}
        />

        {/* Content */}
        <div className="container-custom relative z-10 py-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              TROUVEZ VOTRE SPORT
            </h1>

            {/* Search Bar - Style horizontal comme SportsBooking.mt */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch">
                {/* Sport Dropdown */}
                <div className="flex-1 px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <select
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-gray-700 bg-transparent focus:outline-none cursor-pointer text-base"
                  >
                    <option value="">Tous les sports</option>
                    <option value="football">⚽ Football</option>
                    <option value="basketball">🏀 Basketball</option>
                    <option value="natation">🏊 Natation</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div className="flex-1 px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200 flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full text-gray-700 bg-transparent focus:outline-none text-base"
                  />
                </div>

                {/* Time Picker */}
                <div className="flex-1 px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200 flex items-center gap-3">
                  <Clock className="text-gray-400" size={20} />
                  <input
                    type="time"
                    defaultValue="17:00"
                    className="w-full text-gray-700 bg-transparent focus:outline-none text-base"
                  />
                </div>

                {/* Location Dropdown */}
                <div className="flex-1 px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-gray-700 bg-transparent focus:outline-none cursor-pointer text-base"
                  >
                    <option value="">Toutes les villes</option>
                    {senegalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 transition-colors duration-200 text-base md:text-lg"
                >
                  Rechercher
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Search by Sport Section - Style SportsBooking.mt avec vraies images */}
      <div className="container-custom py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          RECHERCHER PAR SPORT
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Choisissez votre discipline préférée
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Football Card */}
          <Link to="/terrains?sport=football" className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image avec overlay dégradé pour effet photo réel */}
              <div className="aspect-[4/3] bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                
                {/* Simulation terrain de foot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="text-white text-[120px] leading-none drop-shadow-2xl">⚽</div>
                    {/* Lignes de terrain simulées */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white"></div>
                    </div>
                  </div>
                </div>
                
                {/* Vignette en bas */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              {/* Footer de la carte */}
              <div className="bg-gray-50 p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition">
                  Football
                </h3>
              </div>
            </div>
          </Link>

          {/* Basketball Card */}
          <Link to="/terrains?sport=basketball" className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image avec effet panier de basket */}
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-500 to-orange-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.3),transparent_60%)]"></div>
                
                {/* Simulation panier + ballon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Panier (cercle orange) */}
                    <div className="w-32 h-32 border-8 border-orange-400 rounded-full mb-4 mx-auto opacity-60"></div>
                    {/* Ballon */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                      <div className="text-[90px] leading-none drop-shadow-2xl">🏀</div>
                    </div>
                  </div>
                </div>
                
                {/* Vignette */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="bg-gray-50 p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition">
                  Basketball
                </h3>
              </div>
            </div>
          </Link>

          {/* Natation Card */}
          <Link to="/terrains?sport=natation" className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image avec effet piscine */}
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]"></div>
                
                {/* Simulation piscine avec lignes */}
                <div className="absolute inset-0">
                  {/* Lignes de couloir */}
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-1 bg-white/30"
                      style={{ left: `${25 * (i + 1)}%` }}
                    ></div>
                  ))}
                  
                  {/* Nageur */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[100px] leading-none drop-shadow-2xl">🏊</div>
                  </div>
                  
                  {/* Effet vagues */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' stroke='white' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat-x',
                      backgroundPosition: '0 50%'
                    }}></div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div className="bg-gray-50 p-5 text-center">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                  Natation
                </h3>
              </div>
            </div>
          </Link>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-50 py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Recherchez</h3>
              <p className="text-gray-600">
                Trouvez le terrain parfait près de chez vous avec nos filtres avancés
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Réservez</h3>
              <p className="text-gray-600">
                Choisissez votre créneau et réservez en ligne en toute sécurité
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Jouez</h3>
              <p className="text-gray-600">
                Présentez-vous au terrain et profitez de votre match
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous possédez un terrain de football ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez notre plateforme et augmentez votre visibilité
          </p>
          <Link to="/register">
            <Button size="lg">
              Inscrire mon terrain
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Terrains</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
            <div className="text-gray-600">Réservations</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
            <div className="text-gray-600">Équipes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">15</div>
            <div className="text-gray-600">Villes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

