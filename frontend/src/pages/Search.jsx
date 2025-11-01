import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { terrainAPI } from '../services/api';
import { MapPin, Star, Filter, X, ChevronDown, Grid, List, SlidersHorizontal } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filters state
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    size: '',
    type: '',
    amenities: [],
    sort: 'newest'
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
  }, [filters]);

  const loadTerrains = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.size) params.size = filters.size;
      if (filters.type) params.type = filters.type;
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
      params.sort = filters.sort;

      const response = await terrainAPI.getAll(params);
      setTerrains(response.data.data);
    } catch (error) {
      console.error('Error loading terrains:', error);
    } finally {
      setLoading(false);
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
      minPrice: '',
      maxPrice: '',
      size: '',
      type: '',
      amenities: [],
      sort: 'newest'
    });
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <SlidersHorizontal size={20} />
          Filtres
        </h3>
        <button onClick={resetFilters} className="text-sm text-primary-600 hover:underline">
          Réinitialiser
        </button>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
        <select
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes les villes</option>
          {senegalCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
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
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                className="mr-2 text-primary-600 focus:ring-primary-500"
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
              className="mr-2 text-primary-600 focus:ring-primary-500"
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
                className="mr-2 text-primary-600 focus:ring-primary-500"
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

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
            </div>
          ))}
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
            Terrains de Football au Sénégal
          </h1>
          <p className="text-gray-600">
            {terrains.length} terrain{terrains.length !== 1 ? 's' : ''} disponible{terrains.length !== 1 ? 's' : ''}
            {filters.city && ` à ${filters.city}`}
          </p>
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
            >
              <List size={20} />
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

          {/* Terrains Grid */}
          <div className="lg:col-span-3">
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
                          <img src={terrain.images[0].url} alt={terrain.name} className="w-full h-full object-cover" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

