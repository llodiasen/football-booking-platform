import { useState } from 'react';
import { Clock, Shield, XCircle, ChevronRight, X, Users, AlertTriangle } from 'lucide-react';

const ThingsToKnow = ({ terrain }) => {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  
  const openingHours = terrain.openingHours || {};
  
  // Utiliser les règles du terrain si disponibles, sinon règles par défaut
  const rules = terrain.bookingRules?.rules && terrain.bookingRules.rules.length > 0
    ? terrain.bookingRules.rules
    : [
        'Chaussures à crampons adaptées obligatoires',
        'Respect des horaires de réservation',
        'Vestiaires et douches disponibles',
        'Maximum de joueurs selon la taille du terrain',
        'Consommation d\'alcool interdite',
        'Respect du matériel et des installations'
      ];

  // Utiliser les infos de sécurité du terrain si disponibles, sinon infos par défaut
  const safetyInfo = terrain.safetyInfo && terrain.safetyInfo.length > 0
    ? terrain.safetyInfo
    : [
        'Trousse de premiers secours disponible sur place',
        'Éclairage de sécurité fonctionnel',
        'Numéros d\'urgence affichés',
        'Personnel qualifié présent',
        'Assurance responsabilité civile',
        'Protocole COVID-19 en place'
      ];

  const cancellationPolicy = [
    {
      title: 'Annulation gratuite',
      desc: 'Annulation gratuite jusqu\'à 24h avant le début de la réservation'
    },
    {
      title: 'Annulation partielle',
      desc: 'Remboursement de 50% si annulation entre 24h et 12h avant'
    },
    {
      title: 'Pas de remboursement',
      desc: 'Aucun remboursement si annulation moins de 12h avant ou en cas de non-présentation'
    }
  ];

  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        À savoir
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Règlement du terrain */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-gray-900" size={24} />
            <h3 className="font-semibold text-gray-900 text-lg">
              Règlement du terrain
            </h3>
          </div>
          
          <div className="space-y-3">
            {/* Horaires */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Horaires d'ouverture</p>
              {Object.entries(openingHours).slice(0, 3).map(([day, hours]) => (
                <p key={day} className="text-sm text-gray-700">
                  {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                </p>
              ))}
            </div>

            {/* Règles */}
            <ul className="space-y-2 mt-4">
              {rules.slice(0, 4).map((rule, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setShowRulesModal(true)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mt-4"
            >
              Afficher plus
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Sécurité et installations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-gray-900" size={24} />
            <h3 className="font-semibold text-gray-900 text-lg">
              Sécurité et installations
            </h3>
          </div>
          
          <ul className="space-y-3">
            {safetyInfo.slice(0, 5).map((info, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => setShowSafetyModal(true)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mt-4"
          >
            Afficher plus
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Conditions d'annulation */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-gray-900" size={24} />
            <h3 className="font-semibold text-gray-900 text-lg">
              Conditions d'annulation
            </h3>
          </div>
          
          <div className="space-y-4">
            {cancellationPolicy.map((policy, index) => (
              <div key={index}>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {policy.title}
                </p>
                <p className="text-sm text-gray-700">
                  {policy.desc}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowCancellationModal(true)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mt-4"
          >
            En savoir plus
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Note importante */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Note importante :</span> 
          {' '}Les conditions météorologiques extrêmes peuvent entraîner une annulation avec remboursement complet. 
          Le propriétaire se réserve le droit de modifier les horaires en cas de maintenance urgente (préavis de 48h minimum).
        </p>
      </div>

      {/* Modal Règlement intérieur */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Règlement du terrain</h2>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-8">
              <p className="text-gray-700 leading-relaxed">
                Vous allez utiliser le terrain d'un propriétaire, traitez-le donc avec soin et respect.
              </p>

              {/* Arrivée et départ */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Arrivée et départ</h3>
                <div className="space-y-3">
                  {Object.entries(openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-start gap-3">
                      <Clock size={20} className="text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {day === 'monday' ? 'Lundi' : day === 'tuesday' ? 'Mardi' : day === 'wednesday' ? 'Mercredi' : 
                           day === 'thursday' ? 'Jeudi' : day === 'friday' ? 'Vendredi' : 
                           day === 'saturday' ? 'Samedi' : 'Dimanche'}
                        </p>
                        <p className="text-gray-700">
                          {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pendant votre réservation */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Pendant votre réservation</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users size={20} className="text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{terrain.capacity || 22} joueurs maximum</p>
                    </div>
                  </div>
                  {rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-gray-600 mt-0.5" />
                      <p className="text-gray-900">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sécurité */}
      {showSafetyModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Sécurité et installations</h2>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-8">
              <p className="text-gray-700 leading-relaxed">
                Votre sécurité est notre priorité. Voici toutes les mesures mises en place.
              </p>

              {/* Équipements de sécurité */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Équipements de sécurité</h3>
                <div className="space-y-3">
                  {safetyInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Shield size={20} className="text-green-600 mt-0.5" />
                      <p className="text-gray-900">{info}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocoles */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Protocoles sanitaires</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-green-600 mt-0.5" />
                    <p className="text-gray-900">Nettoyage et désinfection réguliers des espaces communs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-green-600 mt-0.5" />
                    <p className="text-gray-900">Gel hydroalcoolique disponible à l'entrée</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-green-600 mt-0.5" />
                    <p className="text-gray-900">Respect des normes d'hygiène et de sécurité</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Conditions d'annulation */}
      {showCancellationModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Conditions d'annulation</h2>
              <button
                onClick={() => setShowCancellationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-8">
              <p className="text-gray-700 leading-relaxed">
                Consultez les conditions d'annulation avant de réserver pour éviter toute surprise.
              </p>

              {/* Politique détaillée */}
              {cancellationPolicy.map((policy, index) => (
                <div key={index} className="border-l-4 border-gray-300 pl-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {policy.desc}
                  </p>
                  
                  {index === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">✓ Recommandé :</span> Annulez au moins 24 heures avant pour un remboursement complet.
                      </p>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3">
                      <p className="text-sm text-orange-800">
                        <span className="font-semibold">⚠️ Attention :</span> En cas de non-présentation, aucun remboursement ne sera effectué.
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Conditions météo */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-blue-600" />
                  Conditions météorologiques
                </h3>
                <p className="text-sm text-gray-700">
                  En cas de pluie intense, orage ou conditions dangereuses, le propriétaire peut annuler 
                  la réservation avec un remboursement complet. Vous serez averti au moins 2 heures avant 
                  le début de votre créneau.
                </p>
              </div>

              {/* Protection paiement */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Protection de votre paiement
                </h3>
                <p className="text-sm text-gray-700">
                  Ne transférez jamais d'argent en dehors de la plateforme 221FOOT. 
                  Tous les paiements sont sécurisés et vous bénéficiez d'une protection complète.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ThingsToKnow;

