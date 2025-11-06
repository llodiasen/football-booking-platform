const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');

async function testReservationOrder() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    // Trouver les réservations du propriétaire Ibrahima
    const owner = await User.findOne({ email: 'soonoup93@gmail.com' });
    if (!owner) {
      console.log('❌ Propriétaire non trouvé');
      process.exit(1);
    }

    const terrains = await Terrain.find({ owner: owner._id });
    const terrainIds = terrains.map(t => t._id);

    // Récupérer les réservations triées par createdAt
    const reservations = await Reservation.find({ terrain: { $in: terrainIds } })
      .populate('client', 'firstName lastName')
      .populate('terrain', 'name')
      .sort('-createdAt')
      .limit(10)
      .lean();

    console.log('📋 LES 10 DERNIÈRES RÉSERVATIONS (ordre de création):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    reservations.forEach((res, index) => {
      const createdDate = new Date(res.createdAt);
      const statusEmoji = 
        res.status === 'confirmed' ? '✅' :
        res.status === 'pending' ? '⏳' :
        res.status === 'cancelled' ? '❌' :
        '✔️';
      
      console.log(`${index + 1}. ${statusEmoji} ${res.client.firstName} ${res.client.lastName}`);
      console.log(`   Terrain: ${res.terrain.name}`);
      console.log(`   Date réservation: ${new Date(res.date).toLocaleDateString('fr-FR')}`);
      console.log(`   Heure: ${res.startTime} - ${res.endTime}`);
      console.log(`   📅 Créée le: ${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR')}`);
      console.log(`   Statut: ${res.status}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Les réservations sont triées par date de création (plus récentes en premier)');
    console.log('💡 La plus récente commande apparaît en position #1');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testReservationOrder();

