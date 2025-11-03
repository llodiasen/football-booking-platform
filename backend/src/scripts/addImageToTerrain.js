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

const addImageToTerrain = async () => {
  await connectDB();

  try {
    // Trouver le terrain "Stade Maître Babacar Sèye"
    const terrain = await Terrain.findOne({ name: 'Stade Maître Babacar Sèye' });

    if (!terrain) {
      console.log('❌ Terrain "Stade Maître Babacar Sèye" non trouvé');
      process.exit(1);
    }

    console.log('✅ Terrain trouvé:', terrain.name);
    console.log('📍 Ville:', terrain.address.city);
    console.log('🆔 ID:', terrain._id);
    console.log('');

    // Ajouter l'image
    terrain.images = [
      {
        url: '/images/stade-louga.jpg',
        alt: 'Stade Maître Babacar Sèye - Louga',
        isPrimary: true
      }
    ];

    await terrain.save();

    console.log('✅ Image ajoutée avec succès !');
    console.log('🖼️  URL:', terrain.images[0].url);
    console.log('');
    console.log('📌 ÉTAPE SUIVANTE :');
    console.log('Sauvegardez votre image de stade dans :');
    console.log('C:\\Users\\wopal\\Desktop\\football-booking-platform\\frontend\\public\\images\\stade-louga.jpg');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addImageToTerrain();

