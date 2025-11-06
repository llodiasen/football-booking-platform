const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const notificationService = require('../services/notificationService');
const User = require('../models/User');

const testNotificationCreation = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver qwert
    const qwert = await User.findOne({ email: 'qwert@gmail.com' });
    
    if (!qwert) {
      console.log('❌ Client qwert@gmail.com non trouvé');
      process.exit(1);
    }

    console.log('\n👤 Client trouvé:', qwert.email, '- ID:', qwert._id);

    // Tester la création d'une notification
    console.log('\n🧪 Test de création de notification...');
    
    const notification = await notificationService.createNotification({
      recipientId: qwert._id,
      type: 'reservation_confirmed',
      title: '✅ TEST: Réservation confirmée !',
      message: 'Ceci est un test de notification pour vérifier que le système fonctionne.',
      link: '/dashboard?section=reservations',
      relatedEntity: {
        id: new mongoose.Types.ObjectId(),
        type: 'Reservation'
      }
    });

    if (notification) {
      console.log('✅ Notification créée avec succès !');
      console.log('   ID:', notification._id);
      console.log('   Titre:', notification.title);
      console.log('   Recipient:', notification.recipient);
    } else {
      console.log('❌ Échec de création de la notification');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

testNotificationCreation();

