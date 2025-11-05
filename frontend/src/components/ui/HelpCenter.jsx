import { useState } from 'react';
import { X, HelpCircle, MessageCircle, Phone, Mail, Search, ChevronRight } from 'lucide-react';

const HelpCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: '🏟️ Réservations',
      questions: [
        {
          q: 'Comment réserver un terrain ?',
          a: 'Sélectionnez un terrain, choisissez une date et un créneau horaire disponible, puis confirmez votre réservation. Vous pouvez payer en ligne ou sur place.'
        },
        {
          q: 'Puis-je annuler ma réservation ?',
          a: 'Oui, vous pouvez annuler jusqu\'à 24h avant l\'heure de début. L\'annulation se fait depuis votre tableau de bord dans "Mes Réservations".'
        },
        {
          q: 'Comment modifier une réservation ?',
          a: 'Contactez le propriétaire du terrain via le système de messagerie ou annulez et créez une nouvelle réservation.'
        }
      ]
    },
    {
      title: '💳 Paiements',
      questions: [
        {
          q: 'Quels modes de paiement sont acceptés ?',
          a: 'Nous acceptons Wave, Orange Money, Free Money et le paiement en espèces sur place.'
        },
        {
          q: 'Quand suis-je débité ?',
          a: 'Le paiement est effectué au moment de la confirmation de la réservation. Aucun prélèvement avant validation.'
        },
        {
          q: 'Puis-je obtenir un remboursement ?',
          a: 'Oui, en cas d\'annulation dans les délais (24h avant), vous serez remboursé à 100%.'
        }
      ]
    },
    {
      title: '👤 Propriétaires',
      questions: [
        {
          q: 'Comment ajouter mon terrain ?',
          a: 'Inscrivez-vous en tant que propriétaire, accédez à votre tableau de bord et cliquez sur "Ajouter un terrain". Remplissez les informations et attendez la validation.'
        },
        {
          q: 'Comment gérer les disponibilités ?',
          a: 'Dans votre dashboard, allez dans "Disponibilités" pour bloquer ou débloquer des créneaux horaires selon vos besoins.'
        },
        {
          q: 'Quand suis-je payé ?',
          a: 'Les paiements sont transférés automatiquement après chaque réservation confirmée, généralement sous 48h.'
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(qa =>
      searchQuery === '' ||
      qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <>
      {/* Bouton Toggle flottant à droite */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105"
        style={{ backgroundColor: '#15803d' }}
      >
        <HelpCircle size={20} />
        <span className="hidden sm:inline text-sm">Besoin d'aide ?</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <HelpCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Centre d'aide</h2>
                    <p className="text-green-100 text-sm">Comment pouvons-nous vous aider ?</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher une réponse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchQuery && filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">Aucun résultat trouvé pour "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCategories.map((category, catIndex) => (
                    <div key={catIndex}>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{category.title}</h3>
                      <div className="space-y-3">
                        {category.questions.map((qa, qaIndex) => (
                          <details
                            key={qaIndex}
                            className="group bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all"
                          >
                            <summary className="flex items-center justify-between p-4 cursor-pointer">
                              <span className="font-semibold text-gray-900 text-sm">{qa.q}</span>
                              <ChevronRight className="text-gray-400 group-open:rotate-90 transition-transform" size={18} />
                            </summary>
                            <div className="px-4 pb-4 pt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-200">
                              {qa.a}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Contact rapide */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <p className="text-sm text-gray-600 mb-4 font-medium">Vous ne trouvez pas votre réponse ?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://wa.me/221771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-sm font-medium justify-center"
                  style={{ backgroundColor: '#15803d' }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href="tel:+221771234567"
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg transition-all text-sm font-medium justify-center"
                >
                  <Phone size={16} />
                  Appeler
                </a>
                <a
                  href="mailto:support@221foot.sn"
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg transition-all text-sm font-medium justify-center"
                >
                  <Mail size={16} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpCenter;

