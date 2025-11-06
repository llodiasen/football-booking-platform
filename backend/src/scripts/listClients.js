const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const listClients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const clients = await User.find({ role: 'client' }).select('email firstName lastName');
    
    console.log('📋 Comptes CLIENTS disponibles:\n');
    clients.forEach((c, i) => {
      console.log(`${i+1}. ${c.email}`);
      console.log(`   Nom: ${c.firstName} ${c.lastName}\n`);
    });

    console.log(`\n💡 Pour accéder au Dashboard Client:`);
    console.log(`   1. Allez sur: http://localhost:5174/login`);
    console.log(`   2. Connectez-vous avec un email client ci-dessus`);
    console.log(`   3. Mot de passe par défaut: password123\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

listClients();

