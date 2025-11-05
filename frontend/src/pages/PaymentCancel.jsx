import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Rediriger vers le dashboard après 10 secondes
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/dashboard?section=reservations');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icône d'annulation */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-red-600" size={48} />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement annulé
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Le paiement a été annulé. Votre réservation est toujours en attente de paiement.
        </p>

        {/* Informations */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Statut :</span> En attente
          </p>
          <p className="text-sm text-gray-600">
            Vous pouvez effectuer le paiement plus tard depuis votre tableau de bord.
          </p>
        </div>

        {/* Countdown */}
        <p className="text-sm text-gray-500 mb-6">
          Redirection automatique dans <span className="font-bold text-red-600">{countdown}</span> secondes...
        </p>

        {/* Boutons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard?section=reservations')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Voir mes réservations
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;

