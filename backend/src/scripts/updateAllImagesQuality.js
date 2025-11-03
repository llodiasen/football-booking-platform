const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
require('dotenv').config();

// Images HAUTE QUALITÉ 1200x800 q=85
const footballImages = [
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1614632537239-d3f634c3c3a7?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1489944440615-453fc2b8dbb0?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1516380906154-7210c34e8dfc?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1563566759544-b64f62e0e6e9?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1576659531892-0f4991fca82b?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1560071426-a8e0c60a5f96?w=1200&h=800&fit=crop&q=85',
];

const galleryImages = [
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1505933542594-38ca0771fafc?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1489944440615-453fc2b8dbb0?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1516380906154-7210c34e8dfc?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&h=800&fit=crop&q=85',
  'https://images.unsplash.com/photo-1563566759544-b64f62e0e6e9?w=1200&h=800&fit=crop&q=85',
];

function getRandomImages(seed) {
  const randomIndex = seed % footballImages.length;
  
  const mainImage = footballImages[randomIndex];
  
  const galleryImgs = [];
  for (let i = 1; i <= 5; i++) {
    const index = (randomIndex + i) % galleryImages.length;
    galleryImgs.push(galleryImages[index]);
  }
  
  return {
    main: mainImage,
    gallery: galleryImgs
  };
}

const updateAllImagesQuality = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const terrains = await Terrain.find({});
    console.log(`📊 ${terrains.length} terrains trouvés\n`);

    let updated = 0;

    for (let i = 0; i < terrains.length; i++) {
      const terrain = terrains[i];
      
      // Obtenir les nouvelles images haute qualité
      const images = getRandomImages(i);
      
      // Remplacer toutes les images avec la haute qualité
      const terrainImages = [
        { url: images.main, isMain: true },
        ...images.gallery.map(url => ({ url, isMain: false }))
      ];

      terrain.images = terrainImages;
      await terrain.save();
      
      console.log(`✅ Images HAUTE QUALITÉ pour "${terrain.name}"`);
      updated++;
    }

    console.log(`\n
╔═══════════════════════════════════════════════════════════╗
║           MISE À JOUR IMAGES HAUTE QUALITÉ                ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ✅ Terrains mis à jour    : ${updated.toString().padStart(3)}                      ║
║   📊 Total traité           : ${terrains.length.toString().padStart(3)}                      ║
║                                                           ║
║   🖼️  Images par terrain     :   6                       ║
║      • 1 image principale (1200x800 px - q85)            ║
║      • 5 images galerie (1200x800 px - q85)              ║
║                                                           ║
║   📸 Résolution : 1200 x 800 pixels                       ║
║   🎨 Qualité : 85% (très haute)                          ║
║   💾 Taille : ~150-200 KB par image                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    console.log(`\n📸 Total d'images mises à jour : ${updated * 6}`);
    console.log(`✨ Les images ne seront plus floues !\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

updateAllImagesQuality();

