import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1e3a5f] text-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">⚽</span>
              <span className="text-xl font-bold text-white">FootballSN</span>
            </div>
            <p className="text-sm mb-4">
              Plateforme de réservation de terrains sportifs au Sénégal
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-orange-400" />
                <span>Lun-Ven: 8h-20h</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-orange-400" />
                <span>+221 XX XXX XX XX</span>
              </div>
            </div>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Sports</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terrains?sport=football" className="hover:text-orange-400 transition">
                  ⚽ Football
                </Link>
              </li>
              <li>
                <Link to="/terrains?sport=basketball" className="hover:text-orange-400 transition">
                  🏀 Basketball
                </Link>
              </li>
              <li>
                <Link to="/terrains?sport=natation" className="hover:text-orange-400 transition">
                  🏊 Natation
                </Link>
              </li>
              <li>
                <Link to="/terrains" className="hover:text-orange-400 transition">
                  Tous les terrains
                </Link>
              </li>
            </ul>
          </div>

          {/* Classes / Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/teams" className="hover:text-orange-400 transition">
                  Équipes
                </Link>
              </li>
              <li>
                <Link to="/register?type=owner" className="hover:text-orange-400 transition">
                  Devenir Propriétaire
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-400 transition">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Abonnements
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Compte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="hover:text-orange-400 transition">
                  Mon Profil
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-orange-400 transition">
                  Mes Réservations
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-orange-400 transition">
                  Paramètres
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition flex items-center gap-2">
                  <MessageCircle size={16} />
                  Chat avec nous
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Centre d'aide
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; 2024 FootballSN. Tous droits réservés.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Mail size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Phone size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button - Style SportsBooking */}
      <a
        href="https://wa.me/221XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </footer>
  );
};

export default Footer;

