const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

const checkReservations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer les 10 dernières réservations
    const reservations = await Reservation.find()
      .populate('client', 'firstName lastName email')
      .populate('terrain', 'name')
      .sort('-createdAt')
      .limit(10)
      .lean();

    console.log(`\n📋 ${reservations.length} dernières réservations:\n`);

    reservations.forEach((res, index) => {
      console.log(`${index + 1}. ${res.terrain?.name || 'Terrain inconnu'}`);
      console.log(`   ID: ${res._id}`);
      console.log(`   Client: ${res.client?.email || 'Client inconnu'} (${res.client?.firstName} ${res.client?.lastName})`);
      console.log(`   Date: ${new Date(res.date).toLocaleDateString('fr-FR')}`);
      console.log(`   Heure: ${res.startTime} - ${res.endTime}`);
      console.log(`   Statut: ${res.status}`);
      console.log(`   Paiement: ${res.paymentMethod}`);
      console.log(`   Créée le: ${new Date(res.createdAt).toLocaleString('fr-FR')}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkReservations();

