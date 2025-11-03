require('dotenv').config();
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
};

const fixBeSportMainImage = async () => {
  await connectDB();

  try {
    const terrain = await Terrain.findOne({ name: 'Complexe BeSport' });

    if (!terrain) {
      console.log('❌ Terrain non trouvé');
      process.exit(1);
    }

    console.log('✅ Terrain trouvé:', terrain.name);
    console.log('');

    // Utiliser dakar-besport-1.jpg comme image principale
    terrain.images = [
      {
        url: '/images/dakar-besport-1.jpg',
        alt: 'Complexe BeSport - Vue principale',
        isPrimary: true
      },
      {
        url: '/images/dakar-besport-2.jpg',
        alt: 'Complexe BeSport - Terrain',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-3.jpg',
        alt: 'Complexe BeSport - Installations',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-4.jpg',
        alt: 'Complexe BeSport - Vue extérieure',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-5.jpg',
        alt: 'Complexe BeSport - Cadre idéal',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-6.jpg',
        alt: 'Complexe BeSport - École de foot',
        isPrimary: false
      }
    ];

    await terrain.save();

    console.log('✅ Image principale corrigée !');
    console.log('');
    console.log('📸 Images :');
    terrain.images.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.url} ${img.isPrimary ? '⭐ (Principale)' : ''}`);
    });
    console.log('');
    console.log('🎉 Le terrain BeSport utilise maintenant des images qui existent !');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixBeSportMainImage();

