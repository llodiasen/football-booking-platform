const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

const cleanDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Trouver le Complexe BeSport d'Ibrahima
    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    if (!ibrahima) {
      console.log('❌ Ibrahima non trouvé');
      process.exit(1);
    }

    const complexeBeSport = await Terrain.findOne({ 
      name: /Complexe.*BeSport/i,
      owner: ibrahima._id
    });

    if (!complexeBeSport) {
      console.log('❌ Complexe BeSport non trouvé');
      process.exit(1);
    }

    console.log('✅ Complexe BeSport trouvé:', complexeBeSport.name);
    console.log('   ID:', complexeBeSport._id);
    console.log('   Propriétaire:', ibrahima.email);

    // 2. Compter les terrains actuels
    const totalTerrains = await Terrain.countDocuments();
    console.log(`\n📊 Total terrains avant nettoyage: ${totalTerrains}`);

    // 3. Supprimer TOUS les autres terrains
    const deleteResult = await Terrain.deleteMany({ 
      _id: { $ne: complexeBeSport._id } 
    });
    console.log(`\n🗑️  ${deleteResult.deletedCount} terrains supprimés`);

    // 4. Supprimer TOUTES les réservations (on repart à zéro)
    const reservationsDeleted = await Reservation.deleteMany({});
    console.log(`🗑️  ${reservationsDeleted.deletedCount} réservations supprimées`);

    // 5. Vérifier le résultat
    const remainingTerrains = await Terrain.countDocuments();
    const remainingReservations = await Reservation.countDocuments();

    console.log(`\n✅ Base de données nettoyée !`);
    console.log(`   Terrains restants: ${remainingTerrains} (devrait être 1)`);
    console.log(`   Réservations restantes: ${remainingReservations} (devrait être 0)`);
    console.log(`\n🏟️  Terrain conservé:`);
    console.log(`   - ${complexeBeSport.name}`);
    console.log(`   - Propriétaire: ${ibrahima.firstName} ${ibrahima.lastName} (${ibrahima.email})`);
    console.log(`   - ID: ${complexeBeSport._id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

cleanDatabase();

