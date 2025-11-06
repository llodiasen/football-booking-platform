const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

async function testMessageNotification() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    // Trouver l'expéditeur (am di) et le destinataire (Ibrahima)
    const sender = await User.findOne({ email: 'amdiallo@gmail.com' });
    const recipient = await User.findOne({ email: 'soonoup93@gmail.com' });

    if (!sender || !recipient) {
      console.log('❌ Utilisateurs non trouvés');
      process.exit(1);
    }

    console.log('📨 TEST D\'ENVOI DE MESSAGE ET NOTIFICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Expéditeur:', sender.firstName, sender.lastName);
    console.log('👨‍💼 Destinataire:', recipient.firstName, recipient.lastName);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Créer un message de test
    const conversationId = Message.getConversationId(sender._id, recipient._id);
    
    const message = await Message.create({
      sender: sender._id,
      recipient: recipient._id,
      subject: 'Test de notification',
      message: 'Ceci est un message de test pour vérifier les notifications sonores ! 🔔',
      conversation: conversationId
    });

    console.log('✅ Message créé avec succès\n');

    // Créer la notification
    const notification = await notificationService.createNotification({
      recipientId: recipient._id,
      type: 'new_message',
      title: '💬 Nouveau message',
      message: `${sender.firstName} ${sender.lastName} vous a envoyé un message : "Test de notification"`,
      link: '/dashboard?section=messages',
      relatedEntity: {
        id: message._id,
        type: 'Message'
      }
    });

    console.log('✅ Notification créée avec succès !');
    console.log('📧 Type:', notification.type);
    console.log('📌 Titre:', notification.title);
    console.log('💬 Message:', notification.message);
    console.log('🔔 Destinataire:', recipient.firstName, recipient.lastName);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCÈS ! Le destinataire devrait recevoir :');
    console.log('   1. 🔔 Notification dans le dropdown (avec badge)');
    console.log('   2. 🔊 Son de notification');
    console.log('   3. 💻 Notification système du navigateur');
    console.log('   💡 Polling toutes les 10 secondes');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testMessageNotification();

