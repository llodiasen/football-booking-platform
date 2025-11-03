import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
      // Afficher après 15 secondes
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15000); // 15 secondes

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fadeIn">
      <div className="bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Texte */}
            <div className="flex-1 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🍪 Nous utilisons des témoins
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Nous avons besoin de votre consentement pour recueillir certains témoins (cookies) que nous utilisons pour améliorer votre expérience sur notre site et diffuser des contenus personnalisés.
              </p>
              <a 
                href="#" 
                className="text-sm text-green-600 hover:text-green-700 font-medium underline"
              >
                Politique relative aux fichiers témoins
              </a>
            </div>

            {/* Boutons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCustomize}
                className="whitespace-nowrap"
              >
                Personnaliser
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="whitespace-nowrap bg-green-600 hover:bg-green-700"
              >
                Tout accepter
              </Button>
            </div>
          </div>

          {/* Options détaillées */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Cookies essentiels */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-1 w-4 h-4 text-green-600 rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Cookies essentiels</p>
                    <p className="text-xs text-gray-600">
                      Nécessaires au fonctionnement du site (toujours activés)
                    </p>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 w-4 h-4 text-green-600 rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Cookies analytiques</p>
                    <p className="text-xs text-gray-600">
                      Nous aident à améliorer notre site (Google Analytics)
                    </p>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 w-4 h-4 text-green-600 rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Cookies marketing</p>
                    <p className="text-xs text-gray-600">
                      Publicités personnalisées selon vos préférences
                    </p>
                  </div>
                </div>

                {/* Cookies réseaux sociaux */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 w-4 h-4 text-green-600 rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Réseaux sociaux</p>
                    <p className="text-xs text-gray-600">
                      Partage de contenu sur les réseaux sociaux
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons personnalisés */}
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={handleReject}>
                  Refuser tout
                </Button>
                <Button onClick={handleAcceptAll} className="bg-green-600 hover:bg-green-700">
                  Enregistrer mes préférences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

