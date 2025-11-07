import { useState, useEffect } from 'react';
import { User, Trophy, Activity, Calendar, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    currentTeam: null
  });

  useEffect(() => {
    // Simuler le chargement des stats
    setStats({
      matchesPlayed: 32,
      goals: 12,
      assists: 8,
      currentTeam: null
    });
  }, []);

  const statCards = [
    {
      title: 'Matchs joués',
      value: stats.matchesPlayed,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Buts',
      value: stats.goals,
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Passes décisives',
      value: stats.assists,
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Équipe actuelle',
      value: stats.currentTeam || '-',
      icon: User,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Joueur</h1>
                <p className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={stat.iconColor} size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-3">
            ⚽ Bienvenue sur votre profil joueur !
          </h2>
          <p className="text-green-100 text-lg mb-6">
            Trouvez une équipe, participez à des matchs et suivez vos statistiques.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/teams/search')}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Trouver une équipe
            </button>
            <button
              onClick={() => navigate('/matches')}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-400 transition-all"
            >
              Voir les matchs
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Mon profil
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                👤 Modifier mon profil
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                📊 Mes statistiques
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                🏆 Mes récompenses
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Prochains matchs
            </h3>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto mb-3" size={48} />
              <p>Aucun match planifié</p>
              {!stats.currentTeam && (
                <button className="mt-4 text-green-600 hover:text-green-700 font-medium">
                  Rejoindre une équipe
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerDashboard;

