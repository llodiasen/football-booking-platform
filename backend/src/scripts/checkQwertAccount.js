const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const checkQwertAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const qwert = await User.findOne({ email: 'qwert@gmail.com' });
    
    if (!qwert) {
      console.log('❌ Compte qwert@gmail.com non trouvé');
      process.exit(1);
    }

    console.log('👤 Compte trouvé:');
    console.log('   Email:', qwert.email);
    console.log('   Nom:', qwert.firstName, qwert.lastName);
    console.log('   Role:', qwert.role);
    console.log('   ID:', qwert._id);
    console.log('   Mot de passe hashé:', qwert.password.substring(0, 30) + '...');

    // Tester le mot de passe
    console.log('\n🔐 Test du mot de passe "password123"...');
    const isMatch = await bcrypt.compare('password123', qwert.password);
    
    if (isMatch) {
      console.log('✅ Mot de passe correct !');
    } else {
      console.log('❌ Mot de passe incorrect !');
      console.log('\n🔄 Réinitialisation du mot de passe à "password123"...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      qwert.password = hashedPassword;
      await qwert.save();
      
      console.log('✅ Mot de passe réinitialisé avec succès !');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkQwertAccount();

