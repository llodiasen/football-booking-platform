const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Terrain = require('../models/Terrain');
const notificationService = require('../services/notificationService');

const confirmReservationForQwert = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver qwert
    const qwert = await User.findOne({ email: 'qwert@gmail.com' });
    console.log('👤 Client qwert:', qwert.email);

    // Trouver sa réservation confirmée (on va la passer en pending puis la re-confirmer)
    let reservation = await Reservation.findOne({
      client: qwert._id,
      status: 'confirmed'
    });

    if (!reservation) {
      console.log('❌ Aucune réservation confirmée trouvée pour qwert');
      
      // Chercher une réservation annulée qu'on peut réactiver
      reservation = await Reservation.findOne({
        client: qwert._id,
        status: 'cancelled'
      });
      
      if (!reservation) {
        console.log('❌ Aucune réservation trouvée pour qwert');
        process.exit(1);
      }
    }

    console.log('\n📋 Réservation trouvée:');
    console.log('   ID:', reservation._id);
    console.log('   Status actuel:', reservation.status);
    console.log('   Date:', reservation.date.toLocaleDateString('fr-FR'));
    console.log('   Créneau:', reservation.startTime, '-', reservation.endTime);

    // Passer en pending puis confirmer
    console.log('\n🔄 Passage en pending...');
    reservation.status = 'pending';
    await reservation.save();

    console.log('✅ Confirmation de la réservation...');
    reservation.status = 'confirmed';
    reservation.confirmedAt = new Date();
    await reservation.save();

    // Populer les données pour la notification (comme dans le controller)
    await reservation.populate('terrain', 'name');
    await reservation.populate('client', 'firstName lastName');

    console.log('\n📬 Création de la notification...');
    
    // Créer la notification (copie du code du controller)
    const notification = await notificationService.createNotification({
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

    if (notification) {
      console.log('✅ Notification créée avec succès !');
      console.log('   Titre:', notification.title);
    } else {
      console.log('❌ Échec de création de la notification');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

confirmReservationForQwert();

