const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

const addMoreReservationsForStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Trouver Ibrahima (propriétaire)
    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    
    // Trouver son terrain
    const terrain = await Terrain.findOne({ owner: ibrahima._id });
    
    if (!terrain) {
      console.log('❌ Aucun terrain trouvé pour Ibrahima');
      process.exit(1);
    }

    console.log(`✅ Terrain trouvé: ${terrain.name}\n`);

    // Trouver des clients
    const clients = await User.find({ role: 'client' }).limit(3);
    
    if (clients.length === 0) {
      console.log('❌ Aucun client trouvé');
      process.exit(1);
    }

    console.log(`✅ ${clients.length} clients trouvés\n`);

    // Générer des réservations sur les 6 derniers mois
    const reservationsToCreate = [];
    const now = new Date();
    const statuses = ['confirmed', 'completed', 'pending'];
    const timeSlots = [
      { start: '08:00', end: '09:00' },
      { start: '10:00', end: '11:00' },
      { start: '14:00', end: '15:00' },
      { start: '16:00', end: '17:00' },
      { start: '18:00', end: '19:00' }
    ];

    // Générer 3-5 réservations par mois pour les 6 derniers mois
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const reservationsThisMonth = Math.floor(Math.random() * 3) + 3; // 3-5 réservations

      for (let i = 0; i < reservationsThisMonth; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, Math.floor(Math.random() * 28) + 1);
        const client = clients[Math.floor(Math.random() * clients.length)];
        const slot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const status = monthOffset === 0 ? statuses[Math.floor(Math.random() * statuses.length)] : 'completed';

        const totalPrice = terrain.pricePerHour * 1;
        
        reservationsToCreate.push({
          terrain: terrain._id,
          client: client._id,
          date: date,
          startTime: slot.start,
          endTime: slot.end,
          duration: 1,
          totalPrice: totalPrice,
          finalPrice: totalPrice,
          status: status,
          paymentMethod: 'wave',
          paymentStatus: status === 'completed' || status === 'confirmed' ? 'paid' : 'pending',
          confirmedAt: status === 'completed' || status === 'confirmed' ? date : null,
          completedAt: status === 'completed' ? date : null
        });
      }
    }

    console.log(`📊 Création de ${reservationsToCreate.length} réservations...\n`);

    // Insérer les réservations (ignorer les doublons)
    let successCount = 0;
    let errorCount = 0;

    for (const resData of reservationsToCreate) {
      try {
        // Vérifier si une réservation existe déjà pour ce créneau
        const existing = await Reservation.findOne({
          terrain: resData.terrain,
          date: resData.date,
          startTime: resData.startTime,
          status: { $in: ['pending', 'confirmed', 'completed'] }
        });

        if (!existing) {
          await Reservation.create(resData);
          successCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    console.log(`✅ ${successCount} réservations créées`);
    console.log(`⚠️ ${errorCount} doublons ignorés\n`);

    // Afficher le total de réservations pour Ibrahima
    const totalReservations = await Reservation.countDocuments({
      terrain: terrain._id
    });

    console.log(`📈 Total réservations pour ${terrain.name}: ${totalReservations}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addMoreReservationsForStats();

