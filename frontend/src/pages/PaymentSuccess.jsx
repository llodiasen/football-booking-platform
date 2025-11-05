import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Rediriger vers le dashboard après 5 secondes
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
        {/* Icône de succès */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={48} />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement réussi !
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Votre paiement a été effectué avec succès. Votre réservation est maintenant confirmée.
        </p>

        {/* Informations */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Statut :</span> Confirmé
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Référence :</span> {searchParams.get('ref_command') || 'N/A'}
          </p>
        </div>

        {/* Countdown */}
        <p className="text-sm text-gray-500 mb-6">
          Redirection automatique dans <span className="font-bold text-green-600">{countdown}</span> secondes...
        </p>

        {/* Bouton */}
        <button
          onClick={() => navigate('/dashboard?section=reservations')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Voir mes réservations
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

