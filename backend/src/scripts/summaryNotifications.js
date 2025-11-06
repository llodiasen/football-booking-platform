const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

async function summaryNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    const amdi = await User.findOne({ email: 'amdiallo@gmail.com' });

    console.log('══════════════════════════════════════════════════════════════');
    console.log('              🔔 RÉSUMÉ DU SYSTÈME DE NOTIFICATIONS');
    console.log('══════════════════════════════════════════════════════════════\n');

    // Messages non lus pour Ibrahima
    const ibrahimaUnreadMessages = await Message.countDocuments({
      recipient: ibrahima._id,
      isRead: false
    });

    // Notifications non lues pour Ibrahima
    const ibrahimaUnreadNotifs = await Notification.countDocuments({
      recipient: ibrahima._id,
      isRead: false
    });

    // Messages non lus pour am di
    const amdiUnreadMessages = await Message.countDocuments({
      recipient: amdi._id,
      isRead: false
    });

    // Notifications non lues pour am di
    const amdiUnreadNotifs = await Notification.countDocuments({
      recipient: amdi._id,
      isRead: false
    });

    console.log('👨‍💼 IBRAHIMA DIAGNE (Propriétaire)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   💬 Messages non lus: ${ibrahimaUnreadMessages}`);
    console.log(`   🔔 Notifications non lues: ${ibrahimaUnreadNotifs}`);
    console.log('');
    console.log('   📊 Ce qu\'il devrait voir:');
    console.log(`      • Badge rouge "${ibrahimaUnreadMessages}" sur icône Messages`);
    console.log(`      • Badge rouge "${ibrahimaUnreadNotifs}" sur icône Notifications`);
    console.log('');

    console.log('👤 AM DI (Client)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   💬 Messages non lus: ${amdiUnreadMessages}`);
    console.log(`   🔔 Notifications non lues: ${amdiUnreadNotifs}`);
    console.log('');
    console.log('   📊 Ce qu\'il devrait voir:');
    console.log(`      • Badge rouge "${amdiUnreadMessages}" sur icône Messages`);
    console.log(`      • Badge rouge "${amdiUnreadNotifs}" sur icône Notifications`);
    console.log('');

    console.log('══════════════════════════════════════════════════════════════');
    console.log('                   ✨ FONCTIONNALITÉS ACTIVES');
    console.log('══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('✅ Notifications sonores pour:');
    console.log('   • Nouveaux messages (💬)');
    console.log('   • Nouvelles réservations (🎉)');
    console.log('   • Réservations confirmées (✅)');
    console.log('   • Réservations annulées (❌)');
    console.log('');
    console.log('✅ Badges numériques:');
    console.log('   • Messages non lus (rouge pulsant)');
    console.log('   • Notifications non lues (rouge)');
    console.log('');
    console.log('✅ Redirections automatiques:');
    console.log('   • Clic notification → Section appropriée du dashboard');
    console.log('   • Modal avec détails complets');
    console.log('');
    console.log('✅ Actions rapides depuis notifications:');
    console.log('   • Propriétaire: Confirmer/Refuser réservations');
    console.log('   • Polling: 10 secondes (notifications), 5 secondes (messages)');
    console.log('');
    console.log('══════════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

summaryNotifications();

