import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Award, TrendingUp, Users, 
  Mail, Phone, Ruler, Weight, Trophy, Target, Star,
  Flag, Heart, Shield, Activity
} from 'lucide-react';
import axios from 'axios';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayer();
  }, [id]);

  const loadPlayer = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/players/${id}`);
      
      if (response.data.success) {
        setPlayer(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement joueur:', error);
    } finally {
      setLoading(false);
    }
  };

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
      'débutant': 'bg-gray-100 text-gray-700 border-gray-300',
      'intermédiaire': 'bg-blue-100 text-blue-700 border-blue-300',
      'avancé': 'bg-green-100 text-green-700 border-green-300',
      'expert': 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Joueur non trouvé</h3>
          <button
            onClick={() => navigate('/players')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec photo de couverture */}
      <div className="relative h-80 bg-gradient-to-r from-green-600 to-green-700">
        <img
          src={`https://source.unsplash.com/1920x400/?african,football,player,soccer&sig=${player._id}`}
          alt="Cover"
          className="w-full h-full object-cover opacity-30"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&h=400&fit=crop&q=80`;
          }}
        />
        
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/players')}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Retour</span>
        </button>

        {/* Badge disponible */}
        {player.lookingForTeam && (
          <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold">
            ✅ Disponible
          </div>
        )}
      </div>

      <div className="container-custom -mt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Photo et infos principales */}
          <div className="lg:col-span-1">
            {/* Photo du joueur */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <img
                src={`https://source.unsplash.com/400x500/?african,football,player,soccer&sig=${player._id}`}
                alt={`${player.firstName} ${player.lastName}`}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=500&fit=crop&q=80`;
                }}
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {player.firstName} {player.lastName}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getPositionIcon(player.position)}</span>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">{player.position}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getLevelColor(player.level)}`}>
                      {player.level}
                    </span>
                  </div>
                </div>

                {/* Équipe actuelle */}
                {player.currentTeam && (
                  <Link
                    to={`/teams/${player.currentTeam._id}`}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mb-4"
                  >
                    <p className="text-xs text-gray-500 mb-1">Équipe actuelle</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={player.currentTeam.logo}
                        alt={player.currentTeam.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-bold text-gray-900">{player.currentTeam.name}</p>
                    </div>
                  </Link>
                )}

                {/* Bouton contact */}
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3">
                  <Mail size={18} />
                  Contacter
                </button>

                {/* Localisation */}
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin size={18} />
                  <span>{player.city}, {player.region}</span>
                </div>

                {/* Contact */}
                {player.email && (
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail size={18} />
                    <span className="text-sm">{player.email}</span>
                  </div>
                )}
                {player.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} />
                    <span className="text-sm">{player.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Caractéristiques physiques */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span className="text-sm">Âge</span>
                  </div>
                  <span className="font-semibold text-gray-900">{calculateAge(player.dateOfBirth)} ans</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Ruler size={18} />
                    <span className="text-sm">Taille</span>
                  </div>
                  <span className="font-semibold text-gray-900">{player.height} cm</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Weight size={18} />
                    <span className="text-sm">Poids</span>
                  </div>
                  <span className="font-semibold text-gray-900">{player.weight} kg</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Flag size={18} />
                    <span className="text-sm">Pied préféré</span>
                  </div>
                  <span className="font-semibold text-gray-900">{player.preferredFoot}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy size={18} />
                    <span className="text-sm">Expérience</span>
                  </div>
                  <span className="font-semibold text-gray-900">{player.yearsOfExperience} ans</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Stats et bio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistiques principales */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="text-green-600" size={28} />
                Statistiques
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Activity size={20} />
                    <span className="text-xs font-medium">Matchs</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{player.stats?.matchesPlayed || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Target size={20} />
                    <span className="text-xs font-medium">Buts</span>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{player.stats?.goals || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Heart size={20} />
                    <span className="text-xs font-medium">Passes D.</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-900">{player.stats?.assists || 0}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-600 mb-2">
                    <Star size={20} />
                    <span className="text-xs font-medium">Moyenne</span>
                  </div>
                  <p className="text-3xl font-bold text-yellow-900">
                    {player.stats?.matchesPlayed > 0 
                      ? ((player.stats?.goals || 0) / player.stats.matchesPlayed).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>

              {/* Cartons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-700">Cartons jaunes</span>
                    <div className="w-8 h-10 bg-yellow-400 rounded"></div>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 mt-2">{player.stats?.yellowCards || 0}</p>
                </div>

                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700">Cartons rouges</span>
                    <div className="w-8 h-10 bg-red-500 rounded"></div>
                  </div>
                  <p className="text-2xl font-bold text-red-900 mt-2">{player.stats?.redCards || 0}</p>
                </div>
              </div>
            </div>

            {/* Biographie */}
            {player.bio && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
                <p className="text-gray-700 leading-relaxed">{player.bio}</p>
              </div>
            )}

            {/* Historique des équipes */}
            {player.teamsHistory && player.teamsHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Users className="text-green-600" size={24} />
                  Historique des équipes
                </h2>
                <div className="space-y-3">
                  {player.teamsHistory.map((history, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={history.teamId?.logo}
                        alt={history.teamId?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{history.teamId?.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(history.startDate).getFullYear()} - 
                          {history.endDate ? new Date(history.endDate).getFullYear() : 'Présent'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disponibilité */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                {player.lookingForTeam ? '✅ Disponible pour rejoindre une équipe' : '👥 Déjà dans une équipe'}
              </h2>
              <p className="text-green-100 mb-6">
                {player.lookingForTeam 
                  ? `${player.firstName} est actuellement à la recherche d'une équipe. Contactez-le pour discuter d'une collaboration.`
                  : `${player.firstName} fait déjà partie d'une équipe mais reste ouvert aux opportunités.`
                }
              </p>
              <button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-colors">
                Envoyer une invitation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;

