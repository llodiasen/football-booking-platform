import { useState, useEffect } from 'react';
import { 
  Users, Calendar, TrendingUp, Award, Settings, LogOut, 
  UserPlus, MapPin, Trophy, MessageCircle, Home, Plus,
  Menu, X, Search, Send, Copy, Check
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AddMemberModal from '../../components/team/AddMemberModal';
import MessagesPanel from '../../components/messages/MessagesPanel';

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
  const [stats, setStats] = useState({
    totalMembers: 15,
    matchesPlayed: 24,
    wins: 18,
    upcomingReservations: 3
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [inviteCode] = useState(user?._id?.substring(0, 8).toUpperCase() || 'TEAM1234');
  const [copied, setCopied] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'members', label: 'Membres', icon: Users },
    { id: 'matches', label: 'Matchs', icon: Trophy },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'stats', label: 'Statistiques', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const statCards = [
    {
      title: 'Membres',
      value: stats.totalMembers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Matchs joués',
      value: stats.matchesPlayed,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Victoires',
      value: stats.wins,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Réservations',
      value: stats.upcomingReservations,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    showSuccess('Code d\'invitation copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = (memberData) => {
    // Ajouter le membre à la liste locale
    setMembers(prev => [...prev, {
      ...memberData,
      id: Date.now(),
      joinedAt: new Date()
    }]);
    setStats(prev => ({ ...prev, totalMembers: prev.totalMembers + 1 }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-sm">{user?.name || 'Mon Équipe'}</h2>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = section === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/dashboard/team?section=${item.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(m => m.id === section)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-600">{user?.name || 'Mon Équipe'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/?section=reservations')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  <span>Réserver un terrain</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          
          {/* VUE D'ENSEMBLE */}
          {section === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        if (stat.title === 'Membres') navigate('/dashboard/team?section=members');
                        if (stat.title === 'Matchs joués') navigate('/dashboard/team?section=matches');
                        if (stat.title === 'Réservations') navigate('/dashboard/team?section=reservations');
                      }}
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white mb-8">
                <h2 className="text-3xl font-bold mb-3">
                  🎉 Bienvenue dans votre espace équipe !
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Gérez vos membres, réservez des terrains et organisez vos matchs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/search')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Réserver un terrain
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/team?section=members')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-400 transition-all"
                  >
                    Gérer les membres
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/team?section=matches')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-400 transition-all"
                  >
                    Organiser un match
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/dashboard/team?section=reservations')}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      📅 Voir les réservations
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/team?section=members')}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      👥 Inviter des membres
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/team?section=stats')}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      📊 Statistiques détaillées
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
                    <button 
                      onClick={() => navigate('/dashboard/team?section=matches')}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Organiser un match
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SECTION MEMBRES */}
          {section === 'members' && (
            <div className="space-y-6">
              {/* Code d'invitation */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Code d'invitation de l'équipe</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/20 backdrop-blur rounded-xl px-4 py-3">
                    <p className="text-2xl font-mono font-bold">{inviteCode}</p>
                  </div>
                  <button
                    onClick={handleCopyInviteCode}
                    className="flex items-center gap-2 px-4 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copié' : 'Copier'}
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-3">
                  Partagez ce code avec vos joueurs pour qu'ils rejoignent l'équipe
                </p>
              </div>

              {/* Liste des membres */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Membres de l'équipe ({stats.totalMembers})
                  </h3>
                  <button 
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <UserPlus size={18} />
                    Ajouter un membre
                  </button>
                </div>

                {/* Liste des membres */}
                {members.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="mx-auto mb-4" size={64} />
                    <p className="text-lg font-medium mb-2">Aucun membre pour le moment</p>
                    <p className="text-sm mb-6">Commencez par ajouter des joueurs à votre équipe</p>
                    <button 
                      onClick={() => setShowAddMemberModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Ajouter le premier membre
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{member.firstName} {member.lastName}</h4>
                            <p className="text-sm text-gray-600">
                              {member.position === 'gardien' && '🧤 Gardien'}
                              {member.position === 'défenseur' && '🛡️ Défenseur'}
                              {member.position === 'milieu' && '⚙️ Milieu'}
                              {member.position === 'attaquant' && '⚡ Attaquant'}
                              {' • '}
                              <span className="text-gray-500">{member.role}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            Actif
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Ajouter Membre */}
          {showAddMemberModal && (
            <AddMemberModal
              onClose={() => setShowAddMemberModal(false)}
              onSuccess={handleAddMember}
              teamId={user?._id}
            />
          )}

          {/* SECTION MATCHS */}
          {section === 'matches' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Organiser un match
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <Plus size={18} />
                    Nouveau match
                  </button>
                </div>

                {/* Formulaire organiser match */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Équipe adverse
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Rechercher une équipe..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terrain
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Choisir un terrain...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horaire
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors">
                  Proposer le match
                </button>
              </div>

              {/* Liste des matchs */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Historique des matchs</h3>
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="mx-auto mb-4" size={64} />
                  <p>Aucun match enregistré</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION RÉSERVATIONS */}
          {section === 'reservations' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mes réservations</h3>
                <button 
                  onClick={() => navigate('/search')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  Réserver
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="mx-auto mb-4" size={64} />
                <p className="text-lg font-medium mb-2">Aucune réservation</p>
                <p className="text-sm mb-6">Réservez un terrain pour votre équipe</p>
                <button 
                  onClick={() => navigate('/search')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Explorer les terrains
                </button>
              </div>
            </div>
          )}

          {/* SECTION STATISTIQUES */}
          {section === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Taux de victoire */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Taux de victoire</h4>
                  <p className="text-4xl font-bold text-green-600">
                    {stats.matchesPlayed > 0 ? Math.round((stats.wins / stats.matchesPlayed) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{stats.wins} victoires sur {stats.matchesPlayed} matchs</p>
                </div>

                {/* Matchs nuls */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Matchs nuls</h4>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.matchesPlayed - stats.wins - Math.floor(stats.matchesPlayed * 0.2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Cette saison</p>
                </div>

                {/* Défaites */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Défaites</h4>
                  <p className="text-4xl font-bold text-red-600">
                    {Math.floor(stats.matchesPlayed * 0.2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Cette saison</p>
                </div>
              </div>

              {/* Graphique placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Performance sur les 6 derniers mois</h3>
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="mx-auto mb-4" size={64} />
                  <p>Graphique à venir</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION MESSAGES */}
          {section === 'messages' && <MessagesPanel />}

          {/* SECTION SETTINGS */}
          {section === 'settings' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Paramètres de l'équipe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'équipe
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
                  Sauvegarder les modifications
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default TeamDashboard;
