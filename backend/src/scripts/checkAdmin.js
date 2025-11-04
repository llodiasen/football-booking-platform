const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkAdmin() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté\n');

    const admin = await User.findOne({ email: 'admin@football-booking.sn' });

    if (admin) {
      console.log('✅ Compte admin trouvé:');
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Nom:', admin.firstName, admin.lastName);
      console.log('\n📋 Pour vous connecter:');
      console.log('   Email: admin@football-booking.sn');
      console.log('   Password: Admin123!');
    } else {
      console.log('❌ Compte admin n\'existe pas');
      console.log('\n💡 Créez-le avec:');
      console.log('   cd backend');
      console.log('   node src/scripts/createAdmin.js');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

checkAdmin();

