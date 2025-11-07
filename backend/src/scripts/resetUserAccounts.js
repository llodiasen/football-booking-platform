const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const resetUserAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    // Supprimer TOUS les comptes User sauf admin et owner
    const result = await User.deleteMany({ 
      role: { $in: ['team', 'player', 'client'] } 
    });

    console.log(`🗑️  ${result.deletedCount} comptes User supprimés (team, player, client)`);
    console.log('');
    console.log('✅ Base nettoyée !');
    console.log('');
    console.log('🔄 Relancez maintenant:');
    console.log('   npm run create-accounts');
    console.log('');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

resetUserAccounts();

