const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

const showCancellationMessages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Trouver toutes les réservations confirmées ou pending
    const reservations = await Reservation.find({
      status: { $in: ['confirmed', 'pending'] }
    })
      .populate('client', 'email')
      .populate('terrain', 'name')
      .sort('date startTime')
      .limit(10);

    console.log('📋 Messages d\'annulation pour les réservations actives:\n');

    const now = new Date();
    
    for (const res of reservations) {
      const resDateTime = new Date(res.date);
      const [hours, minutes] = res.startTime.split(':').map(Number);
      resDateTime.setHours(hours, minutes, 0, 0);
      
      const hoursUntil = (resDateTime - now) / (1000 * 60 * 60);
      const canCancel = res.canBeCancelled();
      
      console.log(`🎫 ${res.terrain.name}`);
      console.log(`   Client: ${res.client.email}`);
      console.log(`   Date: ${res.date.toLocaleDateString('fr-FR')} à ${res.startTime}`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Heures avant: ${hoursUntil.toFixed(1)}h`);
      
      if (canCancel) {
        console.log(`   ✅ Bouton: "Annuler" visible`);
      } else {
        if (hoursUntil <= 0) {
          console.log(`   ❌ Message: "Cette réservation est terminée"`);
        } else if (hoursUntil <= 2) {
          console.log(`   ⏰ Message: "Annulation impossible (moins de 2h avant le début)"`);
        }
      }
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

showCancellationMessages();

