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

    // Trouver le terrain de l'admin "Complexe Be Sport"
    const adminTerrain = await Terrain.findById('690895d9fe9065f3cbdc8333');
    if (!adminTerrain) {
      console.log('❌ Terrain admin non trouvé');
      process.exit(1);
    }

    console.log('✅ Terrain trouvé:', adminTerrain.name);
    console.log('   Ancien propriétaire:', adminTerrain.owner);

    // Transférer la propriété à Ibrahima
    adminTerrain.owner = ibrahima._id;
    await adminTerrain.save();

    console.log('✅ Propriété transférée à Ibrahima !');
    console.log('   Nouveau propriétaire:', ibrahima._id);
    console.log('   Email:', ibrahima.email);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

transferOwnership();

