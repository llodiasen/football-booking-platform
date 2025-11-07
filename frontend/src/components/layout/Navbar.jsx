import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, Search, Globe, Home, Gift, UserPlus, LogIn, HelpCircle, MapPin, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Logo from '../ui/Logo';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* Top Bar - Dark Grey */}
      <div className="bg-gray-800 text-white">
        <div className="container-custom">
          <div className="flex justify-end items-center h-10">
            <span className="text-sm font-semibold">Français</span>
          </div>
        </div>
      </div>

      {/* Main Bar - White */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
            </div>

            {/* Center - Menu Explorer */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/search"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MapPin size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Terrains</span>
              </Link>
              <Link
                to="/teams"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Équipes</span>
              </Link>
              <Link
                to="/players"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Joueurs</span>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Nous rejoindre */}
              <Link 
                to="/role-selection"
                className="hidden md:flex items-center gap-2 text-sm font-semibold bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                style={{ backgroundColor: '#15803d' }}
              >
                Nous rejoindre
              </Link>

              {/* Sélecteur de langue avec drapeaux */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors">
                  <span className="text-xl">🇫🇷</span>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">FR</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <span className="text-xl">🇫🇷</span>
                    <span className="text-sm font-medium text-gray-900">Français</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                    <span className="text-xl">🇬🇧</span>
                    <span className="text-sm font-medium text-gray-900">English</span>
                  </button>
                </div>
              </div>

              {/* User Menu Button (Hamburger + Profile) */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 border border-gray-300 rounded-full pl-3 pr-2 py-1.5 hover:shadow-md transition-all"
                >
                  <Menu size={18} className="text-gray-700" />
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                </button>

                {/* Dropdown Menu (Style Airbnb) */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to={
                            user?.role === 'team' ? '/dashboard/team?section=reservations' :
                            user?.role === 'player' ? '/dashboard/player?section=reservations' :
                            user?.role === 'subscriber' ? '/dashboard/subscriber?section=reservations' :
                            '/dashboard?section=reservations'
                          }
                          className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Mes réservations
                        </Link>
                        <Link
                          to={
                            user?.role === 'team' ? '/dashboard/team?section=settings' :
                            user?.role === 'player' ? '/dashboard/player?section=settings' :
                            user?.role === 'subscriber' ? '/dashboard/subscriber?section=settings' :
                            '/dashboard?section=settings'
                          }
                          className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Compte
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        {user?.role === 'owner' && (
                          <>
                            <Link
                              to="/dashboard"
                              className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Gérer mes terrains
                            </Link>
                            <div className="border-t border-gray-200 my-2"></div>
                          </>
                        )}
                        
                        <a
                          href="#"
                          className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Centre d'aide
                        </a>
                        <button
                          onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                          className="block w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Nous rejoindre (mis en avant) */}
                        <Link
                          to="/role-selection"
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">
                                Nous rejoindre
                              </div>
                              <div className="text-xs text-gray-600">
                                Rejoignez-nous en tant qu'équipe, joueur, entreprise ou propriétaire.
                              </div>
                            </div>
                            <Home size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                          </div>
                        </Link>

                        <div className="border-t border-gray-200 my-2"></div>

                        <Link
                          to="/login"
                          className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Se connecter
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          S'inscrire
                        </Link>

                        <div className="border-t border-gray-200 my-2"></div>

                        <a
                          href="#"
                          className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Cartes cadeaux
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Centre d'aide
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation Mobile */}
      {mobileMenuOpen && (
        <div className="bg-white border-b border-gray-200 shadow-lg md:hidden">
          <div className="container-custom py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/terrains" 
                className="text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tous les terrains
              </Link>
              <Link 
                to="/terrains?size=5x5" 
                className="text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terrains 5x5
              </Link>
              <Link 
                to="/terrains?size=7x7" 
                className="text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terrains 7x7
              </Link>
              <Link 
                to="/terrains?size=11x11" 
                className="text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terrains 11x11
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

