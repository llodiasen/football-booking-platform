import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar,
  Heart,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

const ClientSidebar = ({ collapsed, setCollapsed, user }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/dashboard', section: 'overview' },
    { icon: Calendar, label: 'Mes Réservations', path: '/dashboard', section: 'reservations' },
    { icon: Heart, label: 'Favoris', path: '/dashboard', section: 'favorites' },
    { icon: User, label: 'Mon Profil', path: '/dashboard', section: 'profile' },
    { icon: Settings, label: 'Paramètres', path: '/dashboard', section: 'settings' }
  ];

  const isActive = (section) => {
    const params = new URLSearchParams(location.search);
    const currentSection = params.get('section') || 'overview';
    return currentSection === section;
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 min-h-screen text-white transition-all duration-300 flex flex-col fixed left-0 top-0 z-40`}>
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
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} className={active ? 'text-green-500' : ''} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
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
  );
};

export default ClientSidebar;

