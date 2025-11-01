import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Style SportsBooking.mt */}
          <Link to="/" className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-[#1e3a5f] rounded-sm transform rotate-12"></div>
              <div className="absolute top-1 left-2 w-1 h-6 bg-orange-500"></div>
              <div className="absolute top-0 left-2 w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            {/* Logo Text */}
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-orange-500">Sports</span>
              <span className="text-[#1e3a5f]">Booking</span>
            </span>
          </Link>

          {/* Desktop Navigation - Style minimaliste SportsBooking */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register?role=owner" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors font-medium"
                >
                  Venue Managers
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Accueil
              </Link>
              <Link to="/terrains" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Terrains
              </Link>
              <Link to="/teams" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                Équipes
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>
                    Profil ({user?.firstName})
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-left text-red-600 hover:text-red-700"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/register?role=owner" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    Gestionnaire de Terrain
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

