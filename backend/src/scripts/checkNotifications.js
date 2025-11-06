const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

const checkNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver Ibrahima (propriétaire)
    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    
    if (ibrahima) {
      console.log('\n👤 Propriétaire Ibrahima:');
      console.log('   ID:', ibrahima._id);
      
      const ibrahimaNotifs = await Notification.find({ recipient: ibrahima._id })
        .sort('-createdAt')
        .limit(10);
      
      console.log(`   📬 ${ibrahimaNotifs.length} notifications:`);
      ibrahimaNotifs.forEach((notif, i) => {
        console.log(`   ${i + 1}. ${notif.title}`);
        console.log(`      Type: ${notif.type}`);
        console.log(`      Lu: ${notif.isRead ? 'Oui' : 'Non'}`);
        console.log(`      Date: ${notif.createdAt.toLocaleString('fr-FR')}`);
      });
    }

    // Trouver les clients
    const clients = await User.find({ role: 'client' });
    console.log(`\n👥 ${clients.length} clients trouvés:`);
    
    for (const client of clients.slice(0, 3)) {
      console.log(`\n   📧 ${client.email}:`);
      const clientNotifs = await Notification.find({ recipient: client._id })
        .sort('-createdAt')
        .limit(5);
      
      console.log(`      📬 ${clientNotifs.length} notifications:`);
      clientNotifs.forEach((notif, i) => {
        console.log(`      ${i + 1}. ${notif.title} - ${notif.isRead ? 'Lu' : 'Non lu'}`);
      });
    }

    // Total notifications
    const totalNotifs = await Notification.countDocuments();
    console.log(`\n📊 Total notifications dans la BDD: ${totalNotifs}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkNotifications();

