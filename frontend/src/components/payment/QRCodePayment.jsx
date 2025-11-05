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
            'Scannez le QR code ci-dessous OU envoyez au numéro affiché',
            'Entrez le montant exact',
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
            'Scannez le QR code ci-dessous OU envoyez au numéro affiché',
            'Entrez le montant exact',
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
            'Scannez le QR code ci-dessous OU envoyez au numéro affiché',
            'Entrez le montant exact',
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

              {/* QR Code OU Numéro */}
              {details.qrCode ? (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Scannez ce QR code
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src={details.qrCode} 
                      alt={`QR Code ${details.name}`}
                      className="w-64 h-64 border-4 border-gray-200 rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Ou envoyez au numéro
                  </p>
                  <div className={`flex items-center justify-between p-4 border-2 ${details.borderColor} rounded-xl bg-gray-50`}>
                    <span className="text-2xl font-bold text-gray-900 tracking-wide">
                      {details.number}
                    </span>
                    <button
                      onClick={handleCopyNumber}
                      className={`flex items-center gap-2 px-4 py-2 ${details.bgColor} text-white rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={18} />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Copier
                        </>
                      )}
                    </button>
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
                  className={`flex-1 px-6 py-3 ${details.bgColor} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg`}
                >
                  J'ai effectué le paiement ✓
                </button>
              </div>

              {/* Warning */}
              <p className="text-xs text-gray-500 text-center mt-4">
                ⚠️ Votre réservation sera confirmée après vérification du paiement par le propriétaire
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRCodePayment;

