import { useState } from 'react';
import { Shield, MessageCircle, Clock, Star } from 'lucide-react';
import Button from '../ui/Button';
import MessageModal from '../messages/MessageModal';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OwnerProfile = ({ owner, terrain }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showMessageModal, setShowMessageModal] = useState(false);

  if (!owner) return null;

  const handleSendMessage = async (messageData) => {
    await messageAPI.send({
      recipientId: owner._id,
      terrainId: terrain?._id,
      subject: messageData.subject,
      message: messageData.message
    });
  };

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Ne pas pouvoir s'envoyer un message à soi-même
    if (user?._id === owner._id) {
      alert('Vous ne pouvez pas vous envoyer un message à vous-même');
      return;
    }

    setShowMessageModal(true);
  };

  const yearsActive = owner.createdAt 
    ? new Date().getFullYear() - new Date(owner.createdAt).getFullYear()
    : 1;

  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Faites connaissance avec votre propriétaire
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profil propriétaire */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {/* Avatar et nom */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {owner.firstName?.[0]}{owner.lastName?.[0]}
                </div>
                {owner.ownerProfile?.approved && (
                  <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1.5">
                    <Shield size={16} />
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {owner.firstName} {owner.lastName}
              </h3>
              {owner.ownerProfile?.approved && (
                <div className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Shield size={14} />
                  Super Propriétaire
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} className="text-gray-600" />
                <span className="text-gray-700">
                  <span className="font-semibold text-gray-900">4,92</span> note globale
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle size={16} className="text-gray-600" />
                <span className="text-gray-700">
                  <span className="font-semibold text-gray-900">518</span> avis
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-gray-600" />
                <span className="text-gray-700">
                  <span className="font-semibold text-gray-900">{yearsActive}</span> {yearsActive > 1 ? 'années' : 'année'} d'expérience
                </span>
              </div>
            </div>

            {/* Bouton message */}
            <Button
              variant="outline"
              className="w-full border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-50"
              onClick={handleMessageClick}
            >
              <MessageCircle size={18} className="mr-2" />
              Envoyer un message
            </Button>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="md:col-span-2 space-y-6">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              À propos de {owner.firstName}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              {owner.ownerProfile?.businessName 
                ? `Propriétaire de ${owner.ownerProfile.businessName}` 
                : `Propriétaire de terrain passionné de football`}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons à disposition des terrains de qualité pour permettre à tous les joueurs 
              de pratiquer leur sport favori dans les meilleures conditions. Notre engagement : 
              des installations propres, bien entretenues et un service irréprochable.
            </p>
          </div>

          {/* Détails de contact */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Taux de réponse</h4>
              <p className="text-2xl font-bold text-gray-900">100%</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Temps de réponse</h4>
              <p className="text-2xl font-bold text-gray-900">Dans l'heure</p>
            </div>
          </div>

          {/* Engagement qualité */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="text-green-600" size={20} />
              Engagement qualité
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Réponse rapide aux demandes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Terrains entretenus régulièrement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Installations propres et sécurisées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Service client disponible 7j/7</span>
              </li>
            </ul>
          </div>

          {/* Notice de sécurité */}
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900 mb-1">
              Pour protéger votre paiement, ne transférez jamais d'argent et ne communiquez jamais en dehors de la plateforme 221FOOT.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de message */}
      {showMessageModal && (
        <MessageModal
          terrain={{ ...terrain, owner }}
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
        />
      )}
    </section>
  );
};

export default OwnerProfile;

