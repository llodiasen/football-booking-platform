import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Users, Trophy, TrendingUp, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    position: 'all',
    level: 'all',
    city: 'all',
    lookingForTeam: false
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/players`);
      
      if (response.data.success) {
        setPlayers(response.data.data || []);
        console.log('✅ Joueurs chargés:', response.data.data.length);
      }
    } catch (error) {
      console.error('Erreur chargement joueurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les joueurs
  const filteredPlayers = players.filter(player => {
    const matchSearch = 
      player.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchPosition = filters.position === 'all' || player.position === filters.position;
    const matchLevel = filters.level === 'all' || player.level === filters.level;
    const matchCity = filters.city === 'all' || player.city === filters.city;
    const matchLooking = !filters.lookingForTeam || player.lookingForTeam === true;

    return matchSearch && matchPosition && matchLevel && matchCity && matchLooking;
  });

  // Extraire les villes uniques
  const cities = [...new Set(players.map(p => p.city).filter(Boolean))];

  const getPositionIcon = (position) => {
    const icons = {
      'gardien': '🧤',
      'défenseur': '🛡️',
      'milieu': '⚙️',
      'attaquant': '⚡'
    };
    return icons[position] || '⚽';
  };

  const getLevelColor = (level) => {
    const colors = {
      'débutant': 'bg-gray-100 text-gray-700',
      'intermédiaire': 'bg-blue-100 text-blue-700',
      'avancé': 'bg-green-100 text-green-700',
      'expert': 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container-custom py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Joueurs</h1>
              <p className="text-green-100 text-lg">
                {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''} disponible{filteredPlayers.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un joueur par nom ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={filters.position}
                onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Toutes</option>
                <option value="gardien">🧤 Gardien</option>
                <option value="défenseur">🛡️ Défenseur</option>
                <option value="milieu">⚙️ Milieu</option>
                <option value="attaquant">⚡ Attaquant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Tous</option>
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="avancé">Avancé</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Toutes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.lookingForTeam}
                  onChange={(e) => setFilters({ ...filters, lookingForTeam: e.target.checked })}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Cherche une équipe</span>
              </label>
            </div>
          </div>
        </div>

        {/* Liste des joueurs */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun joueur trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/players/${player._id}`)}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={`https://source.unsplash.com/400x300/?african,football,player,soccer&sig=${player._id}`}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop&q=80`;
                    }}
                  />
                  {player.lookingForTeam && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Disponible
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {player.firstName} {player.lastName}
                  </h3>

                  {/* Position et niveau */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-2xl">{getPositionIcon(player.position)}</span>
                    <span className="font-medium text-gray-700">{player.position}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(player.level)}`}>
                      {player.level}
                    </span>
                    {player.lookingForTeam && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 font-semibold flex items-center gap-1">
                        🔍 Recherche équipe
                      </span>
                    )}
                  </div>

                  {/* Localisation */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin size={16} />
                    <span>{player.city || 'Dakar'}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Matchs</p>
                      <p className="font-bold text-gray-900">{player.stats?.matchesPlayed || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Buts</p>
                      <p className="font-bold text-green-600">{player.stats?.goals || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Passes</p>
                      <p className="font-bold text-blue-600">{player.stats?.assists || 0}</p>
                    </div>
                  </div>

                  {/* Équipe actuelle - Badge */}
                  {player.currentTeam && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300 font-semibold">
                        <Users size={14} />
                        {player.currentTeam.name || 'Équipe inconnue'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination placeholder */}
        {filteredPlayers.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Précédent
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;

