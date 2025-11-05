import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageCircle,
  BarChart3, 
  Users, 
  Settings,
  HelpCircle,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Orders', path: '/admin/reservations' },
    { icon: MessageCircle, label: 'Chat', path: '/admin/chat' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Users, label: 'Customers', path: '/admin/customers' }
  ];

  const preferencesItems = [
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: HelpCircle, label: 'Help', path: '/admin/help' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-72 bg-gray-50 min-h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-gray-200">
      {/* Header Logo */}
      <div className="p-8 pb-6">
        <h1 className="text-2xl font-bold text-purple-900">
          221<span className="text-purple-600">FOOT</span>
        </h1>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            MAIN MENU
          </p>
          <div className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-purple-900 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            PREFERENCES
          </p>
          <div className="space-y-1">
            {preferencesItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-purple-900 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer User Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm relative">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center font-bold text-white text-xl mb-3">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <p className="font-bold text-gray-900 text-sm">
              {user?.firstName || 'Admin'} {user?.lastName || 'User'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

