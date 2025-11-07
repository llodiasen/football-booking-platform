import { useState, useEffect } from 'react';
import { 
  User, Trophy, Activity, Calendar, Settings, LogOut,
  Users, MapPin, Award, Home, Search, Plus, Menu, X
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success: showSuccess } = useToast();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
  const [stats, setStats] = useState({
    matchesPlayed: 32,
    goals: 12,
    assists: 8,
    currentTeam: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [teams, setTeams] = useState([]);
  const [searchTeam, setSearchTeam] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Charger les équipes disponibles
  useEffect(() => {
    if (section === 'teams') {
      loadTeams();
    }
  }, [section]);

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/teams`);
      
      if (response.data.success) {
        setTeams(response.data.data || []);
        console.log('✅ Équipes chargées:', response.data.data.length);
      }
    } catch (error) {
      console.error('Erreur chargement équipes:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  // Filtrer les équipes par recherche
  const filteredTeams = teams.filter(team =>
    team.name?.toLowerCase().includes(searchTeam.toLowerCase()) ||
    team.city?.toLowerCase().includes(searchTeam.toLowerCase())
  );

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'teams', label: 'Équipes', icon: Users },
    { id: 'matches', label: 'Mes Matchs', icon: Trophy },
    { id: 'stats', label: 'Statistiques', icon: Activity },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const statCards = [
    {
      title: 'Matchs joués',
      value: stats.matchesPlayed,
      icon: Activity,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Buts',
      value: stats.goals,
      icon: Trophy,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Passes décisives',
      value: stats.assists,
      icon: Award,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Équipe actuelle',
      value: stats.currentTeam || '-',
      icon: User,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const handleJoinTeam = () => {
    if (!joinCode) {
      return;
    }
    // TODO: API call pour rejoindre l'équipe
    showSuccess('Demande envoyée à l\'équipe !');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-sm">{user?.firstName} {user?.lastName}</h2>
                <p className="text-xs text-gray-400">Joueur</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 hover:bg-gray-800 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/dashboard/player?section=${item.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(m => m.id === section)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          
          {/* VUE D'ENSEMBLE */}
          {section === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className={`${stat.bgColor} p-3 rounded-xl inline-flex mb-4`}>
                        <Icon className={stat.iconColor} size={24} />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white mb-8">
                <h2 className="text-3xl font-bold mb-3">⚽ Bienvenue sur votre profil joueur !</h2>
                <p className="text-green-100 text-lg mb-6">
                  Trouvez une équipe, participez à des matchs et suivez vos statistiques.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/dashboard/player?section=teams')}
                    className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Trouver une équipe
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/player?section=matches')}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-400 transition-all"
                  >
                    Voir les matchs
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECTION ÉQUIPES */}
          {section === 'teams' && (
            <div className="space-y-6">
              {/* Rejoindre une équipe avec code */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rejoindre une équipe</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Entrez le code d'invitation"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                    maxLength={8}
                  />
                  <button
                    onClick={handleJoinTeam}
                    disabled={!joinCode}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-colors"
                  >
                    Rejoindre
                  </button>
                </div>
              </div>

              {/* Recherche d'équipes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Équipes disponibles ({filteredTeams.length})
                </h3>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTeam}
                    onChange={(e) => setSearchTeam(e.target.value)}
                    placeholder="Rechercher une équipe par nom ou ville..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {loadingTeams ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : filteredTeams.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="mx-auto mb-4" size={64} />
                    <p className="text-lg font-medium mb-2">Aucune équipe trouvée</p>
                    <p className="text-sm">Essayez de modifier votre recherche</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTeams.map((team) => (
                      <div
                        key={team._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all cursor-pointer"
                        onClick={() => navigate(`/teams/${team._id}`)}
                      >
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{team.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={14} />
                            {team.city}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {team.category || 'Amateur'}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              {team.matchType || '11v11'}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Voir
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION MATCHS */}
          {section === 'matches' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mes matchs</h3>
              <div className="text-center py-12 text-gray-500">
                <Trophy className="mx-auto mb-4" size={64} />
                <p>Aucun match à venir</p>
                <p className="text-sm mt-2">Rejoignez une équipe pour participer aux matchs</p>
              </div>
            </div>
          )}

          {/* SECTION STATS */}
          {section === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-1">Buts</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.goals}</p>
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-1">Passes décisives</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.assists}</p>
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-1">Cartons jaunes</p>
                  <p className="text-4xl font-bold text-yellow-600">3</p>
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-1">Cartons rouges</p>
                  <p className="text-4xl font-bold text-red-600">0</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default PlayerDashboard;
