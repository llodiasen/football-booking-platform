const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Message = require('../models/Message');

async function checkUnreadMessages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    if (!ibrahima) {
      console.log('❌ Ibrahima non trouvé');
      process.exit(1);
    }

    const unreadMessages = await Message.find({ 
      recipient: ibrahima._id, 
      isRead: false 
    }).populate('sender', 'firstName lastName');

    console.log('📬 MESSAGES NON LUS pour Ibrahima:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔢 Nombre total: ${unreadMessages.length}\n`);

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((msg, i) => {
        console.log(`${i + 1}. 💬 De: ${msg.sender.firstName} ${msg.sender.lastName}`);
        console.log(`   Sujet: ${msg.subject}`);
        console.log(`   Message: ${msg.message.substring(0, 50)}...`);
        console.log(`   📅 Envoyé: ${new Date(msg.createdAt).toLocaleString('fr-FR')}\n`);
      });
    } else {
      console.log('✅ Aucun message non lu');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`💡 Le badge doit afficher: ${unreadMessages.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkUnreadMessages();

