import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Contact */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo variant="white" />
            </div>
            <p className="text-sm mb-4 text-gray-400">
              Plateforme de réservation de terrains de football au Sénégal 🇸🇳
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-400" />
                <span>Lun-Dim: 24h/24</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                <span>+221 77 XXX XX XX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-green-400" />
                <span>contact@221foot.sn</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-400 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/terrains" className="hover:text-green-400 transition">
                  Tous les terrains
                </Link>
              </li>
              <li>
                <Link to="/terrains?size=5x5" className="hover:text-green-400 transition">
                  Terrains 5x5
                </Link>
              </li>
              <li>
                <Link to="/terrains?size=7x7" className="hover:text-green-400 transition">
                  Terrains 7x7
                </Link>
              </li>
              <li>
                <Link to="/terrains?size=11x11" className="hover:text-green-400 transition">
                  Terrains 11x11
                </Link>
              </li>
            </ul>
          </div>

          {/* Pour Vous */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Pour Vous</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/teams" className="hover:text-green-400 transition">
                  Équipes
                </Link>
              </li>
              <li>
                <Link to="/register?role=owner" className="hover:text-green-400 transition">
                  Ajouter mon terrain
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-green-400 transition">
                  Gérer mes terrains
                </Link>
              </li>
            </ul>
          </div>

          {/* Mon Compte */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Mon Compte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-green-400 transition">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-green-400 transition">
                  Inscription
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-green-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-green-400 transition">
                  Mes réservations
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-green-400 transition">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wide">Aide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#comment-ca-marche" className="hover:text-green-400 transition">
                  Comment ça marche ?
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-green-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-green-400 transition flex items-center gap-2">
                  <MessageCircle size={16} />
                  Contact
                </a>
              </li>
              <li>
                <a href="#confidentialite" className="hover:text-green-400 transition">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; 2025 221FOOT - Plateforme de Réservation de Terrains au Sénégal. Tous droits réservés.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="mailto:contact@221foot.sn" className="text-gray-400 hover:text-green-400 transition" aria-label="Email">
              <Mail size={20} />
            </a>
            <a href="tel:+221XXXXXXXXX" className="text-gray-400 hover:text-green-400 transition" aria-label="Téléphone">
              <Phone size={20} />
            </a>
            <a href="https://wa.me/221XXXXXXXXX" className="text-gray-400 hover:text-green-400 transition" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/221XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle size={24} className="group-hover:animate-pulse" />
      </a>
    </footer>
  );
};

export default Footer;

