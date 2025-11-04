import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { terrainAPI } from '../services/api';
import { MapPin, Star, Filter, X, ChevronDown, Grid, List, SlidersHorizontal, Map } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MapView from '../components/terrain/MapView';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [userLocation, setUserLocation] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters state
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    maxDistance: '', // Nouveau filtre distance en km
    minPrice: '',
    maxPrice: '',
    size: '',
    type: '',
    amenities: [],
    sort: searchParams.get('latitude') && searchParams.get('longitude') ? 'distance' : 'newest',
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    radius: searchParams.get('radius') || '10000'
  });

  const senegalCities = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor',
    'Louga', 'Matam', 'Tambacounda', 'Kolda', 'Diourbel'
  ];

  const sizes = ['5x5', '7x7', '11x11'];
  const types = ['synthetique', 'naturel', 'stabilise'];
  const amenitiesList = ['vestiaires', 'douches', 'parking', 'eclairage', 'tribune', 'cafeteria', 'wifi'];

  useEffect(() => {
    loadTerrains();
    
    // Récupérer position utilisateur depuis URL
    const lat = searchParams.get('latitude');
    const lng = searchParams.get('longitude');
    if (lat && lng) {
      setUserLocation([parseFloat(lat), parseFloat(lng)]);
      setViewMode('map'); // Afficher la carte par défaut si géolocalisation
    }
  }, [filters]);

  const loadTerrains = async (pageNum = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.size) params.size = filters.size;
      if (filters.type) params.type = filters.type;
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
      
      // Géolocalisation
      if (filters.latitude && filters.longitude) {
        params.latitude = filters.latitude;
        params.longitude = filters.longitude;
        params.radius = filters.radius;
      }
      
      // Distance maximale (convertir en mètres pour le radius)
      if (filters.maxDistance && filters.latitude && filters.longitude) {
        params.radius = filters.maxDistance * 1000; // Convertir km en mètres
      }
      
      params.sort = filters.sort;
      params.page = pageNum;
      params.limit = 12;

      const response = await terrainAPI.getAll(params);
      
      if (append) {
        setTerrains(prev => [...prev, ...response.data.data]);
      } else {
        setTerrains(response.data.data);
      }
      
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error loading terrains:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      loadTerrains(nextPage, true);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      search: '',
      maxDistance: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      type: '',
      amenities: [],
      sort: 'newest',
      latitude: '',
      longitude: '',
      radius: '10000'
    });
    setUserLocation(null);
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <SlidersHorizontal size={20} />
          Filtres
        </h3>
        <button onClick={resetFilters} className="text-sm text-green-600 hover:underline">
          Réinitialiser
        </button>
      </div>

      {/* Geolocation Button */}
      <div>
        <button
          onClick={() => {
            if (!navigator.geolocation) {
              alert('La géolocalisation n\'est pas supportée par votre navigateur');
              return;
            }
            
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setFilters(prev => ({
                  ...prev,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  radius: '50000',
                  sort: 'distance'
                }));
                setUserLocation([latitude, longitude]);
                setViewMode('map');
              },
              (error) => {
                console.error('Erreur de géolocalisation:', error);
                alert('Impossible d\'obtenir votre position. Vérifiez les permissions.');
              }
            );
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg font-medium transition"
        >
          <MapPin size={16} />
          <span className="text-sm">Près de moi</span>
        </button>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
        <select
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Toutes les villes</option>
          {senegalCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Distance Filter - TOUJOURS VISIBLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Distance maximale
          {!filters.latitude && !filters.longitude && (
            <span className="text-xs text-gray-500 ml-2">(Activer la géolocalisation)</span>
          )}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="200"
            step="5"
            value={filters.maxDistance || 50}
            onChange={(e) => updateFilter('maxDistance', e.target.value)}
            disabled={!filters.latitude || !filters.longitude}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 ${
              (!filters.latitude || !filters.longitude) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{filters.maxDistance || 50} km</span>
            <span className="text-gray-400">max 200 km</span>
          </div>
          {!filters.latitude && !filters.longitude && (
            <p className="text-xs text-blue-600 mt-1">
              💡 Cliquez sur "Près de moi" pour activer ce filtre
            </p>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA/h)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Taille du terrain</label>
        <div className="space-y-2">
          {sizes.map(size => (
            <label key={size} className="flex items-center">
              <input
                type="radio"
                name="size"
                checked={filters.size === size}
                onChange={() => updateFilter('size', size)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">{size}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="size"
              checked={filters.size === ''}
              onChange={() => updateFilter('size', '')}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm">Toutes tailles</span>
          </label>
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de terrain</label>
        <div className="space-y-2">
          {types.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="type"
                checked={filters.type === type}
                onChange={() => updateFilter('type', type)}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              checked={filters.type === ''}
              onChange={() => updateFilter('type', '')}
              className="mr-2 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Tous types</span>
          </label>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Équipements</label>
        <div className="space-y-2">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="mr-2 text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-sm capitalize">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && terrains.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container-custom">
          {/* Header Skeleton */}
          <div className="mb-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>

          {/* Toolbar Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between">
            <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar Skeleton */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i}>
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terrains Grid Skeleton */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-300 rounded w-24"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {filters.latitude && filters.longitude ? (
              <span className="flex items-center gap-2">
                <MapPin className="text-primary-600" size={32} />
                Terrains près de vous
              </span>
            ) : (
              'Terrains de Football au Sénégal'
            )}
          </h1>
          <p className="text-gray-600">
            {terrains.length} terrain{terrains.length !== 1 ? 's' : ''} affiché{terrains.length !== 1 ? 's' : ''}
            {pagination.total > terrains.length && ` sur ${pagination.total} au total`}
            {filters.city && ` à ${filters.city}`}
            {filters.latitude && filters.longitude && ` dans un rayon de ${parseInt(filters.radius) / 1000} km`}
          </p>
          
          {/* Badge Géolocalisation */}
          {filters.latitude && filters.longitude && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
              <MapPin size={16} />
              <span>Triés par distance</span>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, latitude: '', longitude: '', sort: 'newest' }));
                  setSearchParams({});
                }}
                className="ml-2 hover:text-primary-900"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} />
              Filtres
            </button>

            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {filters.latitude && filters.longitude && (
                <option value="distance">📍 Plus proches</option>
              )}
              <option value="newest">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Vue grille"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Vue liste"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded transition ${viewMode === 'map' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Vue carte"
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterPanel />
          </div>

          {/* Filters Modal - Mobile */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFilters(false)}>
              <div className="bg-white w-80 h-full overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Filtres</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Terrains Grid / List / Map */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              /* Vue Carte */
              <div className="h-[calc(100vh-200px)] min-h-[700px] bg-white rounded-lg overflow-hidden shadow-md">
                <MapView terrains={terrains} userLocation={userLocation} />
              </div>
            ) : (
              /* Vue Liste/Grille */
              <>
                {terrains.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">⚽</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Aucun terrain trouvé
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                    <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                    {terrains.map(terrain => (
                      <Card key={terrain._id} hover className="overflow-hidden">
                        <Link to={`/terrains/${terrain._id}`}>
                          <div className="h-48 bg-gray-200 relative overflow-hidden">
                            {terrain.images?.[0]?.url ? (
                              <img 
                                src={terrain.images[0].url} 
                                alt={terrain.name} 
                                className="w-full h-full object-cover" 
                                loading="lazy"
                                decoding="async"
                                style={{ imageRendering: 'high-quality' }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <MapPin size={48} />
                              </div>
                            )}
                            {terrain.promotions?.some(p => p.isActive) && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Promo
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 hover:text-primary-600 transition">
                              {terrain.name}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <MapPin size={16} className="mr-1" />
                              {terrain.address.city}, {terrain.address.region}
                            </div>
                            <div className="flex items-center mb-3">
                              <Star size={16} className="text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{terrain.rating?.average?.toFixed(1) || 'N/A'}</span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({terrain.rating?.count || 0} avis)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {terrain.amenities?.slice(0, 3).map((amenity, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-primary-600">
                                  {terrain.pricePerHour.toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-sm"> FCFA/h</span>
                              </div>
                              <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                                {terrain.size}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Bouton Charger Plus */}
                {!loading && terrains.length > 0 && pagination.page < pagination.totalPages && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Chargement...
                        </span>
                      ) : (
                        `Charger plus (${pagination.total - terrains.length} restants)`
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

