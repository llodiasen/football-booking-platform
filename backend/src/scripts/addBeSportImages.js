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

const addBeSportImages = async () => {
  await connectDB();

  try {
    // Trouver le terrain "Complexe BeSport"
    const terrain = await Terrain.findOne({ name: 'Complexe BeSport' });

    if (!terrain) {
      console.log('❌ Terrain "Complexe BeSport" non trouvé');
      process.exit(1);
    }

    console.log('✅ Terrain trouvé:', terrain.name);
    console.log('📍 Ville:', terrain.address.city);
    console.log('🆔 ID:', terrain._id);
    console.log('');

    // Ajouter toutes les images
    terrain.images = [
      {
        url: '/images/dakar-besport-main.jpg',
        alt: 'Complexe BeSport - Terrain éclairé de nuit',
        isPrimary: true
      },
      {
        url: '/images/dakar-besport-1.jpg',
        alt: 'Complexe BeSport - Vue principale',
        isPrimary: false
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

    console.log('✅ 7 images ajoutées avec succès !');
    console.log('');
    console.log('📸 Images :');
    terrain.images.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.url} ${img.isPrimary ? '⭐ (Principale)' : ''}`);
    });
    console.log('');
    console.log('🎉 Le terrain BeSport a maintenant une galerie complète !');
    console.log('');
    console.log('📌 IMPORTANT : Sauvegardez votre nouvelle image dans :');
    console.log('C:\\Users\\wopal\\Desktop\\football-booking-platform\\frontend\\public\\images\\dakar-besport-main.jpg');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addBeSportImages();

