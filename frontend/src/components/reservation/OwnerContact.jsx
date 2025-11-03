import { useState } from 'react';
import { Phone, Mail, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { reservationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const OwnerContact = ({ reservation }) => {
  const [contactRevealed, setContactRevealed] = useState(reservation.ownerContactRevealed || false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  // Vérifier si la réservation est payée et confirmée
  const canReveal = reservation.status === 'confirmed' && reservation.paymentStatus === 'paid';

  const handleRevealContact = async () => {
    setLoading(true);
    try {
      const response = await reservationAPI.revealContact(reservation._id);
      setOwnerInfo(response.data.data.owner);
      setContactRevealed(true);
      showSuccess('Contact du propriétaire révélé ! 📞');
    } catch (error) {
      showError(error.response?.data?.message || 'Erreur lors de la révélation du contact');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  if (!canReveal) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
            <EyeOff className="text-yellow-700" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">
              Contact Propriétaire Masqué
            </h4>
            <p className="text-sm text-yellow-700">
              {reservation.paymentStatus !== 'paid' 
                ? '🔒 Le contact du propriétaire sera disponible après validation du paiement'
                : '🔒 En attente de confirmation de votre réservation'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!contactRevealed && !ownerInfo) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
              <Eye className="text-green-700" size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">
                Contact Propriétaire Disponible
              </h4>
              <p className="text-sm text-green-700">
                ✅ Votre paiement est validé. Vous pouvez maintenant contacter le propriétaire.
              </p>
            </div>
          </div>
          <Button
            onClick={handleRevealContact}
            disabled={loading}
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Eye size={16} />
            {loading ? 'Chargement...' : 'Voir le Contact'}
          </Button>
        </div>
      </div>
    );
  }

  // Contact révélé
  const owner = ownerInfo || reservation.terrain?.owner;

  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle className="text-green-600" size={20} />
        </div>
        <h4 className="font-bold text-green-900">Contact Propriétaire</h4>
      </div>

      {owner && (
        <div className="space-y-3">
          {/* Nom */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500">Propriétaire</p>
              <p className="font-semibold text-gray-900">
                {owner.firstName} {owner.lastName}
              </p>
            </div>
          </div>

          {/* Téléphone */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="font-semibold text-blue-900">
                  {owner.phone}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleCall(owner.phone)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Phone size={16} className="mr-1" />
              Appeler
            </Button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="text-purple-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold text-purple-900 text-sm">
                  {owner.email}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleEmail(owner.email)}
              size="sm"
              variant="outline"
            >
              <Mail size={16} className="mr-1" />
              Envoyer
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-800 font-medium mb-1">💡 Conseils :</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Contactez le propriétaire pour confirmer les derniers détails</li>
              <li>• Arrivez 15 minutes avant l'heure de réservation</li>
              <li>• Gardez ce numéro en cas de besoin le jour J</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerContact;

