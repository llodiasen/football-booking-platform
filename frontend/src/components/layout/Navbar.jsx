import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, Search } from 'lucide-react';
import { useState } from 'react';
import Logo from '../ui/Logo';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

              {/* Separator */}
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>

              {/* Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <Menu size={20} />
                <span className="hidden md:inline font-medium">Menu</span>
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <Link 
                to="/terrains" 
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <Search size={20} />
                <span className="hidden md:inline font-medium">Recherche</span>
              </Link>

              {/* Separator */}
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>

              {/* User Account */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={20} />
                  <Link to="/profile" className="hidden md:inline font-medium hover:text-green-600 transition-colors">
                    {user?.firstName}
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden md:inline font-medium">Mon compte</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="bg-white border-b border-gray-200 shadow-lg">
          <div className="container-custom py-6">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Navigation Links */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Navigation</h3>
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Accueil
                  </Link>
                  <Link 
                    to="/terrains" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tous les terrains
                  </Link>
                  <Link 
                    to="/terrains?size=5x5" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Terrains 5x5
                  </Link>
                  <Link 
                    to="/terrains?size=7x7" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Terrains 7x7
                  </Link>
                  <Link 
                    to="/terrains?size=11x11" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Terrains 11x11
                  </Link>
                </div>
              </div>

              {/* User Actions */}
              {isAuthenticated ? (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Mon espace</h3>
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/reservations" 
                      className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mes réservations
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-left text-red-600 hover:text-red-700 transition-colors text-sm"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Compte</h3>
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link 
                      to="/register" 
                      className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </div>
                </div>
              )}

              {/* Proprietaires */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Propriétaires</h3>
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/register?role=owner" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Ajouter mon terrain
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-green-600 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gérer mes terrains
                  </Link>
                </div>
              </div>

              {/* Aide */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Aide</h3>
                <div className="flex flex-col space-y-2">
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors text-sm">
                    Comment ça marche ?
                  </a>
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors text-sm">
                    FAQ
                  </a>
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors text-sm">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

