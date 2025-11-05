const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');

const updateIndexes = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer tous les anciens indexes
    console.log('🗑️ Suppression des anciens indexes...');
    await Reservation.collection.dropIndexes();
    console.log('✅ Anciens indexes supprimés');

    // Recréer les indexes (MongoDB va utiliser ceux définis dans le modèle)
    console.log('📝 Création des nouveaux indexes...');
    await Reservation.ensureIndexes();
    console.log('✅ Nouveaux indexes créés');

    // Afficher les indexes actuels
    const indexes = await Reservation.collection.getIndexes();
    console.log('📋 Indexes actuels:', Object.keys(indexes));

    console.log('✅ Mise à jour des indexes terminée !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

updateIndexes();

