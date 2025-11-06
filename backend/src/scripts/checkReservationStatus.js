const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');

async function checkReservationStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    // Trouver la dernière réservation
    const reservation = await Reservation.findOne()
      .sort({ createdAt: -1 })
      .populate('client', 'firstName lastName email')
      .populate('terrain', 'name');

    if (!reservation) {
      console.log('❌ Aucune réservation trouvée');
      process.exit(0);
    }

    console.log('📋 DERNIÈRE RÉSERVATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Client:', reservation.client.firstName, reservation.client.lastName);
    console.log('📧 Email:', reservation.client.email);
    console.log('🏟️  Terrain:', reservation.terrain.name);
    console.log('📅 Date:', new Date(reservation.date).toLocaleDateString('fr-FR'));
    console.log('⏰ Heure:', reservation.startTime, '-', reservation.endTime);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 STATUT:', reservation.status.toUpperCase());
    console.log('💰 Prix:', reservation.finalPrice, 'FCFA');
    console.log('⏰ Créée le:', new Date(reservation.createdAt).toLocaleString('fr-FR'));
    
    if (reservation.confirmedAt) {
      console.log('✅ Confirmée le:', new Date(reservation.confirmedAt).toLocaleString('fr-FR'));
      console.log('👨‍💼 Confirmée par:', reservation.confirmedBy);
    } else {
      console.log('⏳ Pas encore confirmée');
    }
    
    if (reservation.status === 'pending') {
      console.log('\n⚠️  La réservation est toujours EN ATTENTE');
    } else if (reservation.status === 'confirmed') {
      console.log('\n✅ La réservation est CONFIRMÉE');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkReservationStatus();

