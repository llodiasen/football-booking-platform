const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const resetScatPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    const user = await User.findOne({ email: 'scatcity@gmail.com' });

    if (!user) {
      console.log('❌ Compte scatcity@gmail.com non trouvé');
      mongoose.connection.close();
      process.exit(1);
    }

    console.log('✅ Compte trouvé:', user.email);
    console.log('   Role actuel:', user.role);
    console.log('   Roles:', user.roles);
    console.log('   Team:', user.teamProfile?.teamName || 'Aucune');
    console.log('');

    // Définir un nouveau mot de passe simple
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save({ validateBeforeSave: false });

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ MOT DE PASSE RÉINITIALISÉ !                       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('📧 Email: scatcity@gmail.com');
    console.log('🔑 Nouveau mot de passe: password123');
    console.log('🏆 Équipe:', user.teamProfile?.teamName || 'Non définie');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 TESTEZ MAINTENANT:');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('1. Allez sur http://localhost:5173/');
    console.log('2. Connectez-vous avec:');
    console.log('   📧 scatcity@gmail.com');
    console.log('   🔑 password123');
    console.log('3. Vous devriez rester connecté ✅\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

resetScatPassword();

