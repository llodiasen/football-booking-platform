import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = ({ images, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Images par défaut si aucune image fournie
  const defaultImages = [
    {
      url: '/images/football-1.jpg',
      alt: 'Terrain de football',
      fallbackColor: 'from-green-600 to-green-800'
    },
    {
      url: '/images/basketball-1.jpg',
      alt: 'Terrain de basketball',
      fallbackColor: 'from-orange-600 to-orange-800'
    },
    {
      url: '/images/natation-1.jpg',
      alt: 'Piscine',
      fallbackColor: 'from-blue-600 to-blue-800'
    }
  ];

  const slides = images || defaultImages;

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, slides.length, autoPlayInterval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="absolute inset-0">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Tentative de charger l'image, sinon afficher le gradient de fallback */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.fallbackColor}`}>
            <img
              src={slide.url}
              alt={slide.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Overlay sombre pour meilleure lisibilité */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
        aria-label="Image précédente"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10"
        aria-label="Image suivante"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

