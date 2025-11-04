import { Star, Award } from 'lucide-react';

const ReviewsSection = ({ terrain }) => {
  const averageRating = terrain.rating?.average || 0;
  const totalReviews = terrain.reviews?.length || 0;

  // Catégories de notation (adaptées aux terrains de foot)
  const ratingCategories = [
    { name: 'Qualité du terrain', key: 'pitch_quality', value: 4.9 },
    { name: 'Propreté des vestiaires', key: 'cleanliness', value: 4.8 },
    { name: 'Communication', key: 'communication', value: 5.0 },
    { name: 'Emplacement', key: 'location', value: 4.7 },
    { name: 'Facilité de réservation', key: 'booking_ease', value: 5.0 },
    { name: 'Qualité-prix', key: 'value', value: 4.6 }
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
      <div className="mb-8">
        {/* Note globale */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Star className="text-gray-900 fill-gray-900" size={24} />
            <span className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-600 text-lg">·</span>
          <span className="text-lg text-gray-900 font-semibold">
            {totalReviews} avis
          </span>
        </div>

        {/* Badge "Coup de cœur joueurs" */}
        {averageRating >= 4.8 && totalReviews >= 100 && (
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-xl px-5 py-4 mb-8">
            <Award className="text-pink-600" size={28} />
            <div>
              <div className="font-bold text-gray-900 mb-1">Coup de cœur joueurs</div>
              <div className="text-sm text-gray-700">
                Ce terrain fait partie des terrains les mieux notés sur 221FOOT, basé sur les avis, les évaluations et la fiabilité.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Distribution des étoiles et catégories */}
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Distribution des étoiles */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Distribution des notes</h3>
          <div className="space-y-2">
            {starDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-12">
                  {item.stars} {item.stars === 1 ? 'étoile' : 'étoiles'}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gray-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories détaillées */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Notes par catégorie</h3>
          <div className="grid grid-cols-2 gap-4">
            {ratingCategories.map((category) => (
              <div key={category.key} className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {category.value.toFixed(1)}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gray-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(category.value / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avis individuels */}
      {terrain.reviews && terrain.reviews.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-900 mb-6 text-xl">
            Avis des joueurs
          </h3>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {terrain.reviews.slice(0, 6).map((review, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.user?.firstName?.[0] || 'J'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.user?.firstName || 'Joueur'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < review.rating
                          ? 'text-gray-900 fill-gray-900'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Bouton "Afficher tous les avis" */}
          {totalReviews > 6 && (
            <button className="mt-8 px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
              Afficher les {totalReviews} avis
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewsSection;

