require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const users = await User.find().select('email firstName lastName role createdAt').lean();

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur dans la base de données');
      console.log('');
      console.log('💡 Créez un compte sur : http://localhost:5174/register');
    } else {
      console.log(`📊 ${users.length} utilisateur(s) trouvé(s) :\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email : ${user.email}`);
        console.log(`   Rôle  : ${user.role}`);
        console.log(`   Créé  : ${new Date(user.createdAt).toLocaleDateString()}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

listUsers();

