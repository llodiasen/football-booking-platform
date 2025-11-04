import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images, terrainName }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    );
  }

  const mainImage = images[0];
  const gridImages = images.slice(1, 5); // Max 4 images dans la grille

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Galerie principale */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[60vh] min-h-[400px] max-h-[600px]">
        {/* Grande image principale - gauche (2/4 colonnes) */}
        <div 
          className="md:col-span-2 relative cursor-pointer group overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainImage.url}
            alt={`${terrainName} - Vue principale`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="eager"
            decoding="async"
            style={{ imageRendering: 'high-quality' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Grille 2x2 à droite (2/4 colonnes) */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          {gridImages.map((image, index) => (
            <div
              key={index}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(index + 1)}
            >
              <img
                src={image.url}
                alt={`${terrainName} - Vue ${index + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                style={{ imageRendering: 'high-quality' }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Bouton "Afficher toutes les photos" */}
        {images.length > 5 && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-6 right-6 bg-white hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg border border-gray-900 flex items-center gap-2 transition-all duration-200 hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Afficher toutes les photos ({images.length})
          </button>
        )}
      </div>

      {/* Lightbox modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Header lightbox */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
            <button
              onClick={() => setShowLightbox(false)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Fermer"
            >
              <X size={32} />
            </button>
            <div className="text-white font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-20">
            <img
              src={images[currentImageIndex].url}
              alt={`${terrainName} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

