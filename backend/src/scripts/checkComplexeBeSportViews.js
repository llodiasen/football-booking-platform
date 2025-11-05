const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');

const checkViews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver le Complexe BeSport
    const terrain = await Terrain.findOne({ name: /Complexe.*BeSport/i });

    if (!terrain) {
      console.log('❌ Terrain non trouvé');
      process.exit(1);
    }

    console.log('\n📊 Statistiques du Complexe BeSport:');
    console.log('   Nom:', terrain.name);
    console.log('   ID:', terrain._id);
    console.log('   👁️  Vues actuelles:', terrain.views);
    console.log('   ⭐ Note moyenne:', terrain.rating?.average || 0);
    console.log('   💬 Nombre d\'avis:', terrain.rating?.count || 0);

    // Réinitialiser les vues à 0 pour repartir sur une base propre
    console.log('\n🔄 Réinitialisation des vues à 0...');
    terrain.views = 0;
    await terrain.save();

    console.log('✅ Vues réinitialisées à 0');
    console.log('\n💡 Les vues vont maintenant augmenter à chaque visite de la page terrain');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkViews();

