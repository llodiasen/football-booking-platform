const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');
const notificationService = require('../services/notificationService');

async function manuallyConfirmReservation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    // Trouver la dernière réservation pending
    const reservation = await Reservation.findOne({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('client', 'firstName lastName email')
      .populate('terrain', 'name owner');

    if (!reservation) {
      console.log('❌ Aucune réservation en attente trouvée');
      process.exit(0);
    }

    console.log('📋 RÉSERVATION À CONFIRMER:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Client:', reservation.client.firstName, reservation.client.lastName);
    console.log('🏟️  Terrain:', reservation.terrain.name);
    console.log('📅 Date:', new Date(reservation.date).toLocaleDateString('fr-FR'));
    console.log('⏰ Heure:', reservation.startTime, '-', reservation.endTime);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Trouver le propriétaire du terrain
    const owner = await User.findById(reservation.terrain.owner);
    console.log('👨‍💼 Propriétaire:', owner.firstName, owner.lastName, `(${owner.email})\n`);

    // Confirmer la réservation
    reservation.status = 'confirmed';
    reservation.confirmedAt = new Date();
    reservation.confirmedBy = owner._id;
    await reservation.save();

    console.log('✅ Réservation CONFIRMÉE dans la base de données !\n');

    // Créer une notification pour le client
    await notificationService.createNotification({
      recipientId: reservation.client._id,
      type: 'reservation_confirmed',
      title: '✅ Réservation confirmée !',
      message: `Votre réservation pour ${reservation.terrain.name} le ${new Date(reservation.date).toLocaleDateString('fr-FR')} de ${reservation.startTime} à ${reservation.endTime} a été confirmée par le propriétaire.`,
      link: '/dashboard?section=reservations',
      relatedEntity: {
        id: reservation._id,
        type: 'Reservation'
      }
    });

    console.log('📨 Notification envoyée au client !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCÈS ! La réservation est maintenant confirmée.');
    console.log('💡 Le client doit actualiser son dashboard pour voir le changement.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

manuallyConfirmReservation();

