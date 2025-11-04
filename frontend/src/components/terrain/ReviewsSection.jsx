import { Star, Award, Sparkles, CheckCircle, MapPin, MessageCircle, DollarSign, Key } from 'lucide-react';

const ReviewsSection = ({ terrain }) => {
  const averageRating = terrain.rating?.average || 0;
  const totalReviews = terrain.reviews?.length || 0;

  // Catégories de notation avec icônes (style Airbnb)
  const ratingCategories = [
    { name: 'Propreté', key: 'cleanliness', value: 4.9, icon: Sparkles },
    { name: 'Précision', key: 'accuracy', value: 4.9, icon: CheckCircle },
    { name: 'Arrivée', key: 'arrival', value: 5.0, icon: Key },
    { name: 'Communication', key: 'communication', value: 5.0, icon: MessageCircle },
    { name: 'Emplacement', key: 'location', value: 4.8, icon: MapPin },
    { name: 'Qualité-prix', key: 'value', value: 4.8, icon: DollarSign }
  ];

  // Distribution des étoiles (simulée pour l'instant)
  const starDistribution = [
    { stars: 5, count: 450 },
    { stars: 4, count: 60 },
    { stars: 3, count: 8 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ];

  const maxCount = Math.max(...starDistribution.map(d => d.count));

  return (
    <section className="py-12 border-t border-gray-200">
      {/* Distribution et catégories côte à côte (même hauteur) */}
      <div className="grid md:grid-cols-2 gap-16 mb-12">
        {/* Gauche: Évaluation globale (distribution) - Style Airbnb exact */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évaluation globale</h3>
          <div className="flex-1 flex flex-col justify-between space-y-3">
            {starDistribution.reverse().map((item) => {
              const percentage = (item.count / maxCount) * 100;
              const barHeight = item.stars === 5 ? 'h-2' : 'h-1.5'; // 5 étoiles plus épais
              const barColor = item.stars === 5 ? 'bg-gray-900' : 'bg-gray-300'; // 5 étoiles noir, autres gris
              
              return (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 w-3">
                    {item.stars}
                  </span>
                  <div className="flex-1 bg-transparent overflow-hidden">
                    <div
                      className={`${barHeight} ${barColor} rounded-sm transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Droite: Catégories avec icônes (alignées en hauteur) */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 opacity-0">Catégories</h3>
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {ratingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-700" />
                    <span className="text-base text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-base font-semibold text-gray-900">
                    {category.value.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Avis individuels (2 colonnes, 3 par colonne) */}
      {terrain.reviews && terrain.reviews.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 mb-10">
            {terrain.reviews.slice(0, 6).map((review, index) => {
              // Limiter le texte à ~150 caractères
              const maxLength = 150;
              const commentText = review.comment || '';
              const truncatedComment = commentText.length > maxLength 
                ? commentText.substring(0, maxLength) + '...' 
                : commentText;
              const showReadMore = commentText.length > maxLength;

              return (
                <div key={index} className="flex flex-col">
                  {/* Header: Photo + Nom + Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {review.user?.firstName?.[0] || 'J'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {review.user?.firstName || 'Joueur'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {review.user?.city || '4 ans sur 221FOOT'}
                      </div>
                    </div>
                  </div>

                  {/* 5 étoiles noires pleines */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="text-gray-900 fill-gray-900"
                      />
                    ))}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-600 mb-3">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>

                  {/* Texte de l'avis */}
                  <p className="text-sm text-gray-900 leading-relaxed mb-2">
                    {truncatedComment}
                  </p>

                  {/* Lien "Lire la suite" */}
                  {showReadMore && (
                    <button className="text-sm font-semibold text-gray-900 underline hover:text-gray-700 text-left">
                      Lire la suite
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bouton "Afficher tous les avis" (style Airbnb) */}
          <div className="flex items-center gap-4">
            {totalReviews > 6 && (
              <button className="px-6 py-3 border border-gray-900 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                Afficher les {totalReviews} commentaires
              </button>
            )}
            <button className="text-sm text-gray-600 underline hover:text-gray-900">
              Fonctionnement des commentaires
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ReviewsSection;

