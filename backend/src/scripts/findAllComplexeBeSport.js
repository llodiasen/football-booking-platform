const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Terrain = require('../models/Terrain');

const findTerrains = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver TOUS les terrains avec "BeSport" ou "Complexe" dans le nom
    const terrains = await Terrain.find({ 
      name: /BeSport|Complexe/i 
    }).populate('owner', 'firstName lastName email');

    console.log(`\n📋 ${terrains.length} terrain(s) trouvé(s):\n`);

    terrains.forEach((terrain, index) => {
      console.log(`${index + 1}. ${terrain.name}`);
      console.log(`   ID: ${terrain._id}`);
      console.log(`   Propriétaire: ${terrain.owner?.email || 'NON TROUVÉ'}`);
      console.log(`   Nom: ${terrain.owner?.firstName} ${terrain.owner?.lastName}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

findTerrains();

