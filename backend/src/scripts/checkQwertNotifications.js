const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

const checkQwertNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver qwert
    const qwert = await User.findOne({ email: 'qwert@gmail.com' });
    
    if (qwert) {
      console.log('\n👤 Client qwert@gmail.com:');
      console.log('   ID:', qwert._id);
      console.log('   Role:', qwert.role);
      
      const qwertNotifs = await Notification.find({ recipient: qwert._id })
        .sort('-createdAt');
      
      console.log(`\n   📬 ${qwertNotifs.length} notifications:`);
      qwertNotifs.forEach((notif, i) => {
        console.log(`   ${i + 1}. ${notif.title}`);
        console.log(`      Type: ${notif.type}`);
        console.log(`      Message: ${notif.message}`);
        console.log(`      Lu: ${notif.isRead ? 'Oui' : 'Non'}`);
        console.log(`      Date: ${notif.createdAt.toLocaleString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('❌ Client qwert@gmail.com non trouvé');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkQwertNotifications();

