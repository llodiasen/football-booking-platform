const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

const testCancellationRules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver qwert
    const qwert = await User.findOne({ email: 'qwert@gmail.com' });
    
    // Trouver toutes ses réservations
    const reservations = await Reservation.find({ client: qwert._id })
      .populate('terrain', 'name')
      .sort('date startTime');

    console.log(`\n📋 ${reservations.length} réservations pour qwert@gmail.com:\n`);

    const now = new Date();
    
    for (const res of reservations) {
      const resDateTime = new Date(res.date);
      const [hours, minutes] = res.startTime.split(':').map(Number);
      resDateTime.setHours(hours, minutes, 0, 0);
      
      const hoursUntil = (resDateTime - now) / (1000 * 60 * 60);
      const canCancel = res.canBeCancelled();
      
      console.log(`📅 ${res.terrain.name}`);
      console.log(`   Date: ${res.date.toLocaleDateString('fr-FR')} à ${res.startTime}`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Heures restantes: ${hoursUntil.toFixed(1)}h`);
      console.log(`   Peut annuler: ${canCancel ? '✅ OUI' : '❌ NON'}`);
      
      if (!canCancel && (res.status === 'pending' || res.status === 'confirmed')) {
        if (hoursUntil <= 2 && hoursUntil > 0) {
          console.log(`   Raison: ⏰ Moins de 2h avant le début`);
        } else if (hoursUntil <= 0) {
          console.log(`   Raison: 📆 Réservation déjà passée`);
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

testCancellationRules();

