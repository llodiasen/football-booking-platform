const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Terrain = require('../models/Terrain');
const Reservation = require('../models/Reservation');
const notificationService = require('../services/notificationService');

async function createTestReservation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    // Trouver le client am di
    const client = await User.findOne({ email: 'amdiallo@gmail.com' });
    if (!client) {
      console.log('❌ Client am di non trouvé');
      process.exit(1);
    }

    // Trouver le terrain Complexe BeSport
    const terrain = await Terrain.findOne({ name: 'Complexe BeSport' })
      .populate('owner', 'firstName lastName email');
    
    if (!terrain) {
      console.log('❌ Terrain Complexe BeSport non trouvé');
      process.exit(1);
    }

    console.log('📋 CRÉATION D\'UNE NOUVELLE RÉSERVATION TEST');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Client:', client.firstName, client.lastName);
    console.log('🏟️  Terrain:', terrain.name);
    console.log('👨‍💼 Propriétaire:', terrain.owner.firstName, terrain.owner.lastName, `(${terrain.owner.email})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Date de demain à 14h
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Créer la réservation
    const reservation = await Reservation.create({
      terrain: terrain._id,
      client: client._id,
      date: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      duration: 1,
      totalPrice: 40000,
      discount: 0,
      finalPrice: 40000,
      paymentMethod: 'wave',
      notes: 'Test de réservation depuis notification',
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log('✅ Réservation créée avec succès !');
    console.log('📅 Date:', tomorrow.toLocaleDateString('fr-FR'));
    console.log('⏰ Heure: 14:00 - 15:00');
    console.log('💰 Prix: 40,000 FCFA\n');

    // Créer une notification pour le propriétaire
    await notificationService.createNotification({
      recipientId: terrain.owner._id,
      type: 'new_reservation',
      title: '🎉 Nouvelle réservation',
      message: `${client.firstName} ${client.lastName} a réservé ${terrain.name} le ${tomorrow.toLocaleDateString('fr-FR')} de 14:00 à 15:00`,
      link: '/dashboard?section=reservations',
      relatedEntity: {
        id: reservation._id,
        type: 'Reservation'
      }
    });

    console.log('📨 Notification envoyée au propriétaire !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCÈS !');
    console.log('💡 Le propriétaire peut maintenant confirmer/refuser depuis la notification.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createTestReservation();

