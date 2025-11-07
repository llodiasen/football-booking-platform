import { useState, useEffect } from 'react';
import { 
  Heart, Star, Bell, Calendar, Settings, LogOut, Home,
  CreditCard, FileText, Users, Menu, X, Plus
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SubscriberDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
  const [stats, setStats] = useState({
    monthlyReservations: 4,
    matchesPlayed: 12,
    upcomingMatches: 2,
    subscriptionType: 'mensuel'
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'subscription', label: 'Mon abonnement', icon: CreditCard },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'team', label: 'Mon équipe', icon: Users },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const statCards = [
    {
      title: 'Réservations mensuelles',
      value: stats.monthlyReservations,
      icon: Calendar,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Matchs joués',
      value: stats.matchesPlayed,
      icon: Bell,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Prochains matchs',
      value: stats.upcomingMatches,
      icon: Calendar,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Abonnement',
      value: stats.subscriptionType.charAt(0).toUpperCase() + stats.subscriptionType.slice(1),
      icon: Heart,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-sm">{user?.firstName} {user?.lastName}</h2>
                <p className="text-xs text-gray-400">Entreprise</p>
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
                  navigate(`/dashboard/subscriber?section=${item.id}`);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
                  <p className="text-sm text-gray-600">Entreprise</p>
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

              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
                <h2 className="text-3xl font-bold mb-3">🏢 Bienvenue dans votre espace entreprise !</h2>
                <p className="text-purple-100 text-lg mb-6">
                  Gérez vos abonnements, réservez vos créneaux hebdomadaires.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/search')}
                    className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Réserver un terrain
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/subscriber?section=subscription')}
                    className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-400 transition-all"
                  >
                    Gérer mon abonnement
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECTION ABONNEMENT */}
          {section === 'subscription' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Mon abonnement actuel</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Mensuel', 'Trimestriel', 'Annuel'].map((plan) => (
                    <div
                      key={plan}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                        stats.subscriptionType === plan.toLowerCase()
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <h4 className="text-lg font-bold mb-2">{plan}</h4>
                      <p className="text-3xl font-bold text-purple-600 mb-2">
                        {plan === 'Mensuel' ? '50,000' : plan === 'Trimestriel' ? '135,000' : '480,000'}
                        <span className="text-sm text-gray-600"> FCFA</span>
                      </p>
                      <p className="text-sm text-gray-600">{plan === 'Mensuel' ? '4' : plan === 'Trimestriel' ? '12' : '48'} réservations</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION RÉSERVATIONS */}
          {section === 'reservations' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Mes réservations récurrentes</h3>
                <button 
                  onClick={() => navigate('/search')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  <Plus size={18} />
                  Nouvelle réservation
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="mx-auto mb-4" size={64} />
                <p>Aucune réservation récurrente configurée</p>
              </div>
            </div>
          )}

          {/* SECTION FACTURES */}
          {section === 'invoices' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Historique de facturation</h3>
              <div className="text-center py-12 text-gray-500">
                <FileText className="mx-auto mb-4" size={64} />
                <p>Aucune facture</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default SubscriberDashboard;
