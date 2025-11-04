const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function fixAdminRole() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté\n');

    const admin = await User.findOne({ email: 'admin@football-booking.sn' });

    if (!admin) {
      console.log('❌ Compte admin n\'existe pas');
      return;
    }

    console.log('📋 Compte trouvé:');
    console.log('   Email:', admin.email);
    console.log('   Role actuel:', admin.role);

    if (admin.role === 'admin') {
      console.log('\n✅ Le rôle est déjà "admin" - Rien à faire !');
      return;
    }

    // Changer le role à 'admin'
    admin.role = 'admin';
    await admin.save();

    console.log('\n✅ Rôle modifié avec succès !');
    console.log('   Nouveau role:', admin.role);
    console.log('\n🎉 Vous pouvez maintenant vous connecter avec:');
    console.log('   Email: admin@football-booking.sn');
    console.log('   Password: Admin123!');
    console.log('\n🚀 Et accéder au Dashboard Admin sur /dashboard');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

fixAdminRole();

