const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

const checkReservationsDetails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver Ibrahima
    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    console.log('\n👤 Ibrahima:', ibrahima.email, '- Role:', ibrahima.role);
    console.log('   ID:', ibrahima._id);

    // Trouver les réservations récentes
    const recentReservations = await Reservation.find()
      .sort('-createdAt')
      .limit(5)
      .populate('client', 'firstName lastName email')
      .populate('terrain', 'name owner');

    console.log('\n📋 5 dernières réservations:');
    for (const res of recentReservations) {
      console.log(`\n   🎫 ${res.terrain.name}`);
      console.log(`      Client: ${res.client.email} (ID: ${res.client._id})`);
      console.log(`      Propriétaire terrain: ${res.terrain.owner}`);
      console.log(`      Status: ${res.status}`);
      console.log(`      Date: ${res.date.toLocaleDateString('fr-FR')}`);
      console.log(`      Créneau: ${res.startTime} - ${res.endTime}`);
      
      // Vérifier si Ibrahima est le client
      if (res.client._id.toString() === ibrahima._id.toString()) {
        console.log(`      ⚠️ IBRAHIMA EST LE CLIENT de cette réservation !`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkReservationsDetails();

