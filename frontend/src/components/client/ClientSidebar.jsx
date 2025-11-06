import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar,
  Heart,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Bell,
  MessageCircle
} from 'lucide-react';
import { messageAPI } from '../../services/api';

const ClientSidebar = ({ collapsed, setCollapsed, user, mobileMenuOpen = false, setMobileMenuOpen = () => {} }) => {
  const location = useLocation();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/dashboard', section: 'overview' },
    { icon: Calendar, label: 'Mes Réservations', path: '/dashboard', section: 'reservations' },
    { icon: Users, label: 'Mes Équipes', path: '/dashboard', section: 'teams' },
    { icon: MessageCircle, label: 'Messages', path: '/dashboard', section: 'messages' },
    { icon: Heart, label: 'Favoris', path: '/dashboard', section: 'favorites' },
    { icon: Bell, label: 'Notifications', path: '/dashboard', section: 'notifications' },
    { icon: User, label: 'Mon Profil', path: '/dashboard', section: 'profile' },
    { icon: Settings, label: 'Paramètres', path: '/dashboard', section: 'settings' }
  ];

  useEffect(() => {
    // Charger le nombre de messages non lus
    const loadUnreadCount = async () => {
      try {
        const response = await messageAPI.getUnreadCount();
        setUnreadMessages(response.data.data?.unreadCount || 0);
      } catch (error) {
        console.error('Erreur chargement messages non lus:', error);
      }
    };

    loadUnreadCount();
    
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(loadUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (section) => {
    const params = new URLSearchParams(location.search);
    const currentSection = params.get('section') || 'overview';
    return currentSection === section;
  };

  return (
    <>
      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 min-h-screen text-white transition-all duration-300 flex flex-col fixed left-0 top-0 z-50 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      {/* Header Logo */}
      <div className="p-6 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">221</span>
            </div>
            <span className="font-bold text-base">Mon Espace</span>
          </div>
        )}
        <button
          onClick={() => {
            setMobileMenuOpen(false); // Fermer sur mobile
            setCollapsed(!collapsed); // Toggle sur desktop
          }}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="md:hidden"><X size={20} /></span>
          <span className="hidden md:inline">{collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}</span>
        </button>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.section);
          
          return (
            <Link
              key={item.section}
              to={`${item.path}?section=${item.section}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <div className="relative">
                <Icon size={20} className={active ? 'text-green-500' : ''} />
                {/* Badge de messages non lus */}
                {item.section === 'messages' && unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              {!collapsed && (
                <span className="font-medium text-sm flex-1">{item.label}</span>
              )}
              {/* Badge à droite si sidebar ouverte */}
              {!collapsed && item.section === 'messages' && unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {unreadMessages}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">Client</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ClientSidebar;

