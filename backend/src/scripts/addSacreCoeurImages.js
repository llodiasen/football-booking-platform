require('dotenv').config();
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB:', err.message);
    process.exit(1);
  }
};

const addSacreCoeurImages = async () => {
  await connectDB();

  try {
    // Trouver le terrain "AS Dakar Sacré-Cœur"
    const terrain = await Terrain.findOne({ name: 'AS Dakar Sacré-Cœur' });

    if (!terrain) {
      console.log('❌ Terrain "AS Dakar Sacré-Cœur" non trouvé');
      process.exit(1);
    }

    console.log('✅ Terrain trouvé:', terrain.name);
    console.log('📍 Ville:', terrain.address.city);
    console.log('🆔 ID:', terrain._id);
    console.log('');

    // Ajouter toutes les images
    terrain.images = [
      {
        url: '/images/dakar-sacre-coeur-main.jpg',
        alt: 'AS Dakar Sacré-Cœur - Vue principale',
        isPrimary: true
      },
      {
        url: '/images/dakar-sacre-coeur-1.jpg',
        alt: 'AS Dakar Sacré-Cœur - Terrain',
        isPrimary: false
      },
      {
        url: '/images/dakar-sacre-coeur-2.jpg',
        alt: 'AS Dakar Sacré-Cœur - Installations',
        isPrimary: false
      },
      {
        url: '/images/dakar-sacre-coeur-3.jpg',
        alt: 'AS Dakar Sacré-Cœur - Centre de formation',
        isPrimary: false
      },
      {
        url: '/images/dakar-sacre-coeur-4.jpg',
        alt: 'AS Dakar Sacré-Cœur - Équipements',
        isPrimary: false
      }
    ];

    await terrain.save();

    console.log('✅ 5 images ajoutées avec succès !');
    console.log('');
    console.log('📸 Images :');
    terrain.images.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.url} ${img.isPrimary ? '⭐ (Principale)' : ''}`);
    });
    console.log('');
    console.log('🎉 Le terrain AS Dakar Sacré-Cœur a maintenant une galerie complète !');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addSacreCoeurImages();

