import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Users, 
  Bell, 
  HelpCircle, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [notifications] = useState(7);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Réservations', path: '/admin/reservations', badge: null },
    { icon: MapPin, label: 'Terrains', path: '/admin/terrains' },
    { icon: CreditCard, label: 'Paiements', path: '/admin/payments' },
    { icon: Users, label: 'Clients', path: '/admin/customers' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications', badge: notifications },
    { icon: HelpCircle, label: 'Aide & Support', path: '/admin/support' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 min-h-screen text-white transition-all duration-300 flex flex-col fixed left-0 top-0 z-40`}>
      {/* Header Logo */}
      <div className="p-6 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">221</span>
            </div>
            <span className="font-bold text-lg">221FOOT Admin</span>
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
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
              F
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} className={active ? 'text-green-500' : ''} />
              {!collapsed && (
                <>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Badge quand collapsed */}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
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
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">Admin 221FOOT</p>
              <p className="text-xs text-gray-400 truncate">admin@221foot.sn</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;

