import { useState } from 'react';
import { Star, Award, Sparkles, CheckCircle, MapPin, MessageCircle, DollarSign, Key, X } from 'lucide-react';

const ReviewsSection = ({ terrain }) => {
  const [selectedReview, setSelectedReview] = useState(null);
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
        {/* Gauche: Évaluation globale (distribution) - Style Airbnb 2ème capture */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Star className="text-gray-900 fill-gray-900" size={18} />
            <h3 className="text-base font-semibold text-gray-900">Évaluation globale</h3>
          </div>
          <div className="flex-1 flex flex-col justify-evenly space-y-2">
            {starDistribution.reverse().map((item) => {
              const percentage = (item.count / maxCount) * 100;
              // Barre très épaisse et noire pour 5 étoiles, fines et grises pour le reste
              const barHeight = item.stars === 5 ? 'h-2.5' : 'h-1'; 
              const barColor = item.stars === 5 ? 'bg-gray-900' : 'bg-gray-300';
              const barRadius = item.stars === 5 ? 'rounded' : 'rounded-sm';
              
              return (
                <div key={item.stars} className="flex items-center gap-4">
                  <span className="text-sm font-normal text-gray-900 w-2">
                    {item.stars}
                  </span>
                  <div className="flex-1">
                    <div
                      className={`${barHeight} ${barColor} ${barRadius} transition-all duration-700`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Droite: Catégories avec icônes (alignées en hauteur) - Style 2ème capture */}
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 mb-8 opacity-0">Catégories</h3>
          <div className="flex-1 flex flex-col justify-evenly space-y-2">
            {ratingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.key} className="flex items-center justify-between gap-8">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {category.value.toFixed(1).replace('.', ',')}
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
                    <button 
                      onClick={() => setSelectedReview(review)}
                      className="text-sm font-semibold text-gray-900 underline hover:text-gray-700 text-left"
                    >
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

      {/* Modal pour afficher le commentaire complet */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Avis complet</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* Info utilisateur */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {selectedReview.user?.firstName?.[0] || 'J'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg">
                    {selectedReview.user?.firstName || 'Joueur'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedReview.user?.city || '4 ans sur 221FOOT'}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-gray-900 fill-gray-900"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(selectedReview.createdAt).toLocaleDateString('fr-FR', { 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              {/* Commentaire complet */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                  {selectedReview.comment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;

