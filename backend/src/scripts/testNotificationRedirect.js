const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Notification = require('../models/Notification');

async function testNotificationRedirect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    if (!ibrahima) {
      console.log('❌ Ibrahima non trouvé');
      process.exit(1);
    }

    // Récupérer les dernières notifications
    const notifications = await Notification.find({ recipient: ibrahima._id })
      .sort('-createdAt')
      .limit(5);

    console.log('🔔 DERNIÈRES NOTIFICATIONS pour Ibrahima:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total: ${notifications.length} notifications\n`);

    notifications.forEach((notif, i) => {
      const typeEmoji = {
        'new_message': '💬',
        'new_reservation': '🎉',
        'reservation_confirmed': '✅',
        'reservation_cancelled': '❌'
      };

      console.log(`${i + 1}. ${typeEmoji[notif.type] || '🔔'} ${notif.title}`);
      console.log(`   Type: ${notif.type}`);
      console.log(`   Message: ${notif.message.substring(0, 60)}...`);
      console.log(`   📍 Redirection: ${notif.link}`);
      console.log(`   ${notif.isRead ? '✅ Lu' : '⚪ Non lu'}`);
      console.log(`   📅 ${new Date(notif.createdAt).toLocaleString('fr-FR')}\n`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Comportement attendu au clic sur notification :');
    console.log('');
    console.log('💬 Message → Redirige vers /dashboard?section=messages');
    console.log('🎉 Nouvelle réservation → Redirige vers /dashboard?section=reservations');
    console.log('✅ Réservation confirmée → Redirige vers /dashboard?section=reservations');
    console.log('❌ Réservation annulée → Redirige vers /dashboard?section=reservations');
    console.log('');
    console.log('💡 Et ouvre la modal avec les détails complets !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testNotificationRedirect();

