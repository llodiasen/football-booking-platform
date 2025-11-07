import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Mail, Phone, Flag, 
  Trophy, Target, Heart, Activity, Star, Share2, 
  MessageCircle, UserPlus, Shield, Zap, Award
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

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
      'gardien': <Shield className="text-blue-600" size={20} />,
      'défenseur': <Shield className="text-purple-600" size={20} />,
      'milieu': <Activity className="text-green-600" size={20} />,
      'attaquant': <Zap className="text-red-600" size={20} />
    };
    return icons[position] || <Activity size={20} />;
  };

  const getLevelBadge = (level) => {
    const badges = {
      'débutant': 'bg-gray-100 text-gray-800 border border-gray-300',
      'intermédiaire': 'bg-blue-100 text-blue-800 border border-blue-300',
      'avancé': 'bg-green-100 text-green-800 border border-green-300',
      'expert': 'bg-purple-100 text-purple-800 border border-purple-300'
    };
    return badges[level] || badges['débutant'];
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

  // Gérer l'envoi d'invitation
  const handleSendInvite = async () => {
    if (!isAuthenticated) {
      showError('Vous devez être connecté pour envoyer une invitation');
      navigate(`/login?redirect=/players/${id}`);
      return;
    }

    // Vérifier que l'utilisateur est un capitaine d'équipe
    if (user?.role !== 'team') {
      showError('Seuls les capitaines d\'équipe peuvent envoyer des invitations');
      return;
    }

    setSendingInvite(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/teams/invite-player`, {
        playerId: player._id,
        playerEmail: player.email,
        teamId: user._id // Si user.role === 'team', user._id est l'ID de l'équipe
      });

      if (response.data.success) {
        showSuccess(`✅ Invitation envoyée à ${player.firstName} ${player.lastName} !`);
      }
    } catch (error) {
      console.error('Erreur envoi invitation:', error);
      showError(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setSendingInvite(false);
    }
  };

  // Gérer le contact (redirection vers messages)
  const handleContact = () => {
    if (!isAuthenticated) {
      showError('Vous devez être connecté pour contacter ce joueur');
      navigate(`/login?redirect=/players/${id}`);
      return;
    }

    // Rediriger vers la messagerie avec ce joueur
    navigate(`/dashboard?section=messages&conversationWith=${player._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Joueur non trouvé</h3>
          <button
            onClick={() => navigate('/players')}
            className="text-gray-900 hover:underline font-medium"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header épuré - Style Airbnb */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate('/players')}
              className="flex items-center gap-2 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Joueurs</span>
            </button>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Galerie d'images - Style Airbnb Grid */}
      <div className="max-w-7xl mx-auto px-0 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-xl overflow-hidden">
          {/* Image principale */}
          <div className="relative h-[400px] lg:h-[500px]">
            <img
              src={`https://source.unsplash.com/800x600/?african,football,player,soccer&sig=${player._id}`}
              alt={`${player.firstName} ${player.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop&q=80';
              }}
            />
            {player.lookingForTeam && (
              <div className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg font-semibold text-sm">
                ✓ Disponible
              </div>
            )}
          </div>

          {/* Grille de 4 images secondaires */}
          <div className="hidden lg:grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-[246px]">
                <img
                  src={`https://source.unsplash.com/400x300/?football,player,african,sport&sig=${player._id}-${i}`}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop&q=80';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal - Layout Airbnb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Colonne principale - 2/3 */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* En-tête joueur */}
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">
                    {player.firstName} {player.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      {getPositionIcon(player.position)}
                      <span className="font-medium">{player.position}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadge(player.level)}`}>
                      {player.level}
                    </span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-gray-700">
                      <MapPin size={16} />
                      <span className="text-sm">{player.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Équipe actuelle - Encart */}
              {player.currentTeam && (
                <Link
                  to={`/teams/${player.currentTeam._id}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={player.currentTeam.logo}
                    alt={player.currentTeam.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Équipe actuelle</p>
                    <p className="text-lg font-semibold text-gray-900">{player.currentTeam.name}</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Caractéristiques - Grille propre */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Âge</p>
                  <p className="text-2xl font-semibold text-gray-900">{calculateAge(player.dateOfBirth)}</p>
                  <p className="text-xs text-gray-500">ans</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Taille</p>
                  <p className="text-2xl font-semibold text-gray-900">{player.height}</p>
                  <p className="text-xs text-gray-500">cm</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Poids</p>
                  <p className="text-2xl font-semibold text-gray-900">{player.weight}</p>
                  <p className="text-xs text-gray-500">kg</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Pied préféré</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{player.preferredFoot}</p>
                </div>
              </div>
            </div>

            {/* Statistiques - Cards modernes */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Statistiques</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <Activity className="text-blue-600 mb-2" size={24} />
                  <p className="text-3xl font-bold text-gray-900">{player.stats?.matchesPlayed || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Matchs</p>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <Target className="text-green-600 mb-2" size={24} />
                  <p className="text-3xl font-bold text-gray-900">{player.stats?.goals || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Buts</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <Heart className="text-purple-600 mb-2" size={24} />
                  <p className="text-3xl font-bold text-gray-900">{player.stats?.assists || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Passes D.</p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                  <Star className="text-yellow-600 mb-2" size={24} />
                  <p className="text-3xl font-bold text-gray-900">
                    {player.stats?.matchesPlayed > 0 
                      ? ((player.stats?.goals || 0) / player.stats.matchesPlayed).toFixed(1)
                      : '0.0'
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Moyenne</p>
                </div>
              </div>

              {/* Cartons */}
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="w-6 h-8 bg-yellow-400 rounded"></div>
                  <div>
                    <p className="text-sm text-gray-600">Cartons jaunes</p>
                    <p className="text-2xl font-bold text-gray-900">{player.stats?.yellowCards || 0}</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="w-6 h-8 bg-red-500 rounded"></div>
                  <div>
                    <p className="text-sm text-gray-600">Cartons rouges</p>
                    <p className="text-2xl font-bold text-gray-900">{player.stats?.redCards || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biographie */}
            {player.bio && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">À propos</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{player.bio}</p>
              </div>
            )}

            {/* Historique */}
            {player.teamsHistory && player.teamsHistory.length > 0 && (
              <div className="pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Parcours</h2>
                <div className="space-y-4">
                  {player.teamsHistory.map((history, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <img
                        src={history.teamId?.logo}
                        alt={history.teamId?.name}
                        className="w-14 h-14 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">{history.teamId?.name}</p>
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

            {/* Expérience */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Expérience</h2>
              <div className="flex items-center gap-2">
                <Trophy className="text-gray-400" size={24} />
                <span className="text-lg text-gray-700">{player.yearsOfExperience} ans d'expérience</span>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 - Sticky comme Airbnb */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Card de réservation - Style Airbnb */}
              <div className="border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Disponibilité</p>
                  {player.lookingForTeam ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="font-semibold">Disponible</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="font-semibold">Non disponible</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleSendInvite}
                  disabled={sendingInvite}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md hover:shadow-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingInvite ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Envoyer une invitation</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={handleContact}
                  className="w-full border border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Contacter
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Vous ne serez pas débité
                </p>
              </div>

              {/* Contact */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-3">
                  {player.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={18} className="text-gray-400" />
                      <span className="text-sm">{player.email}</span>
                    </div>
                  )}
                  {player.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={18} className="text-gray-400" />
                      <span className="text-sm">{player.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm">{player.city}, {player.region}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Flag size={18} className="text-gray-400" />
                    <span className="text-sm">Sénégal</span>
                  </div>
                </div>
              </div>

              {/* Badge vérification */}
              {player.isVerified && (
                <div className="border border-gray-200 rounded-2xl p-6 bg-green-50">
                  <div className="flex items-center gap-3">
                    <Award className="text-green-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Profil vérifié</p>
                      <p className="text-xs text-gray-600">Identité confirmée</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;
