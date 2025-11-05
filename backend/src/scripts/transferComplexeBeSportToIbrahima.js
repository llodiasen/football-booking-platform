const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
const User = require('../models/User');

const transferOwnership = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver Ibrahima
    const ibrahima = await User.findOne({ email: 'soonoup93@gmail.com' });
    if (!ibrahima) {
      console.log('❌ Ibrahima non trouvé');
      process.exit(1);
    }
    console.log('✅ Ibrahima trouvé:', ibrahima.firstName, ibrahima.lastName);

    // Trouver le Complexe BeSport
    const complexe = await Terrain.findOne({ name: /Complexe.*BeSport/i });
    if (!complexe) {
      console.log('❌ Complexe BeSport non trouvé');
      process.exit(1);
    }
    console.log('✅ Complexe BeSport trouvé:', complexe.name);
    console.log('   Ancien propriétaire:', complexe.owner);

    // Transférer la propriété
    complexe.owner = ibrahima._id;
    await complexe.save();

    console.log('✅ Propriété transférée !');
    console.log('   Nouveau propriétaire:', ibrahima._id);
    console.log('   Nom:', ibrahima.firstName, ibrahima.lastName);
    console.log('   Email:', ibrahima.email);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

transferOwnership();

