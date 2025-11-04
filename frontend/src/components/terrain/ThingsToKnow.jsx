import { Clock, Shield, XCircle, ChevronRight } from 'lucide-react';

const ThingsToKnow = ({ terrain }) => {
  const openingHours = terrain.openingHours || {};
  
  const rules = [
    'Chaussures à crampons adaptées obligatoires',
    'Respect des horaires de réservation',
    'Vestiaires et douches disponibles',
    'Maximum de joueurs selon la taille du terrain',
    'Consommation d\'alcool interdite',
    'Respect du matériel et des installations'
  ];

  const safetyInfo = [
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

            <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mt-4">
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

          <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mt-4">
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

          <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mt-4">
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
    </section>
  );
};

export default ThingsToKnow;

