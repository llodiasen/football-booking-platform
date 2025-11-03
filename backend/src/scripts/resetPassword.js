require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Email de l'utilisateur à réinitialiser
    const email = 'llodiasen92@gmail.com';
    const newPassword = 'Amadou123!'; // Nouveau mot de passe

    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      process.exit(1);
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log('✅ Mot de passe réinitialisé avec succès!');
    console.log('');
    console.log('📧 Email :', email);
    console.log('🔑 Nouveau mot de passe :', newPassword);
    console.log('');
    console.log('💡 Vous pouvez maintenant vous connecter avec ces identifiants');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

resetPassword();

