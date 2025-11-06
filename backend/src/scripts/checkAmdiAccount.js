const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function checkAmdiAccount() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    const user = await User.findOne({ email: 'amdiallo@gmail.com' });

    if (!user) {
      console.log('❌ COMPTE NON TROUVÉ : amdiallo@gmail.com');
      console.log('\n🔧 Création du compte...\n');

      const newUser = await User.create({
        firstName: 'am',
        lastName: 'di',
        email: 'amdiallo@gmail.com',
        password: await bcrypt.hash('password123', 10),
        phone: '+221771234567',
        role: 'client'
      });

      console.log('✅ Compte créé avec succès !');
      console.log('📧 Email:', newUser.email);
      console.log('🔑 Mot de passe:', 'password123');
      console.log('👤 Rôle:', newUser.role);
    } else {
      console.log('✅ COMPTE TROUVÉ');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', user.email);
      console.log('👤 Nom:', user.firstName, user.lastName);
      console.log('📱 Téléphone:', user.phone);
      console.log('🎭 Rôle:', user.role);
      console.log('📅 Créé le:', new Date(user.createdAt).toLocaleString('fr-FR'));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      console.log('🔧 Réinitialisation du mot de passe...');
      user.password = await bcrypt.hash('password123', 10);
      await user.save();
      console.log('✅ Mot de passe réinitialisé : password123\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 INFORMATIONS DE CONNEXION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: amdiallo@gmail.com');
    console.log('🔐 Mot de passe: password123');
    console.log('🌐 URL: https://football-booking-platform-frontend.vercel.app');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkAmdiAccount();

