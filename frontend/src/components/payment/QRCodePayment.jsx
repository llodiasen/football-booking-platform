import { useState } from 'react';
import { X, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const QRCodePayment = ({ isOpen, onClose, onConfirm, terrain, paymentMethod, amount }) => {
  const { success: showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const owner = terrain?.owner;
  const paymentInfo = owner?.ownerProfile?.paymentInfo;

  // Déterminer les infos de paiement selon la méthode
  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'wave':
        return {
          name: 'Wave',
          color: '#00D9E1',
          bgColor: 'bg-[#00D9E1]',
          borderColor: 'border-[#00D9E1]',
          number: paymentInfo?.waveNumber || owner?.phone,
          qrCode: paymentInfo?.waveQRCode,
          icon: 'W',
          instructions: [
            'Ouvrez votre application Wave',
            'Scannez le QR code ci-dessus',
            'Entrez le montant exact : ' + amount + ' FCFA',
            'Validez le paiement',
            'Cliquez sur "J\'ai effectué le paiement" ci-dessous'
          ]
        };
      case 'orange_money':
        return {
          name: 'Orange Money',
          color: '#FF6600',
          bgColor: 'bg-[#FF6600]',
          borderColor: 'border-[#FF6600]',
          number: paymentInfo?.orangeMoneyNumber || owner?.phone,
          qrCode: paymentInfo?.orangeMoneyQRCode,
          icon: 'OM',
          instructions: [
            'Ouvrez votre application Orange Money',
            'Scannez le QR code ci-dessus',
            'Entrez le montant exact : ' + amount + ' FCFA',
            'Validez le paiement',
            'Cliquez sur "J\'ai effectué le paiement" ci-dessous'
          ]
        };
      case 'free_money':
        return {
          name: 'Free Money',
          color: '#E3000F',
          bgColor: 'bg-[#E3000F]',
          borderColor: 'border-[#E3000F]',
          number: paymentInfo?.freeMoneyNumber || owner?.phone,
          qrCode: paymentInfo?.freeMoneyQRCode,
          icon: 'FM',
          instructions: [
            'Ouvrez votre application Free Money',
            'Scannez le QR code ci-dessus',
            'Entrez le montant exact : ' + amount + ' FCFA',
            'Validez le paiement',
            'Cliquez sur "J\'ai effectué le paiement" ci-dessous'
          ]
        };
      default:
        return null;
    }
  };

  const details = getPaymentDetails();
  if (!details) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(details.number);
    setCopied(true);
    showSuccess('Numéro copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec couleur du service */}
            <div className={`${details.bgColor} px-8 py-6 text-white relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className={`text-2xl font-black`} style={{ color: details.color }}>
                    {details.icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Paiement {details.name}</h2>
                  <p className="text-white/90 text-sm mt-1">Montant à payer : {formatPrice(amount)} FCFA</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Montant à payer - Bien visible */}
              <div className={`${details.bgColor} bg-opacity-10 border-2 ${details.borderColor} rounded-2xl p-6 mb-6`}>
                <p className="text-sm text-gray-600 mb-1 text-center">Montant exact à payer</p>
                <p className="text-4xl font-black text-gray-900 text-center">
                  {formatPrice(amount)} <span className="text-2xl">FCFA</span>
                </p>
              </div>

              {/* QR Code SEULEMENT (pas de numéro pour protéger le propriétaire) */}
              {details.qrCode ? (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Scannez ce QR code pour payer
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src={details.qrCode} 
                      alt={`QR Code ${details.name}`}
                      className="w-72 h-72 border-4 border-gray-200 rounded-2xl shadow-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    📱 Utilisez votre app {details.name} pour scanner ce code
                  </p>
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <div className="text-center">
                    <AlertCircle className="text-yellow-600 mx-auto mb-3" size={48} />
                    <p className="font-semibold text-yellow-900 mb-2">
                      QR Code non configuré
                    </p>
                    <p className="text-sm text-yellow-700 mb-4">
                      Le propriétaire n'a pas encore configuré son QR code {details.name}.
                    </p>
                    <div className="bg-white rounded-lg p-4 text-left">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        🔒 Pour des raisons de sécurité :
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Les numéros de téléphone ne sont pas affichés</li>
                        <li>• Le propriétaire doit configurer son QR code</li>
                        <li>• Cela protège sa vie privée</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900 mb-3">Instructions :</p>
                    <ol className="space-y-2 text-sm text-blue-800">
                      {details.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="font-bold text-blue-600">{index + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Info propriétaire */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-600 mb-1">Vous payez à :</p>
                <p className="text-sm font-bold text-gray-900">
                  {owner?.firstName} {owner?.lastName}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Propriétaire de {terrain?.name}
                </p>
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!details.qrCode}
                  className={`flex-1 px-6 py-3 ${details.bgColor} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  J'ai effectué le paiement ✓
                </button>
              </div>

              {/* Warning */}
              {details.qrCode ? (
                <p className="text-xs text-gray-500 text-center mt-4">
                  ⚠️ Votre réservation sera confirmée après vérification du paiement par le propriétaire
                </p>
              ) : (
                <p className="text-xs text-yellow-700 text-center mt-4">
                  ⚠️ Vous ne pouvez pas continuer sans QR code. Contactez le propriétaire ou choisissez un autre terrain.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRCodePayment;

