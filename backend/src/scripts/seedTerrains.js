const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
const User = require('../models/User');
require('dotenv').config();

const terrainsData = require('../data/terrains-senegal.json');

const seedTerrains = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un utilisateur propriétaire par défaut si n'existe pas
    let defaultOwner = await User.findOne({ email: 'proprietaire@footballsn.com' });
    
    if (!defaultOwner) {
      defaultOwner = await User.create({
        email: 'proprietaire@footballsn.com',
        password: 'Propriétaire123!',
        firstName: 'FootballSN',
        lastName: 'Gestion',
        phone: '+221700000001',
        role: 'owner',
        isVerified: true,
        isActive: true,
        ownerProfile: {
          businessName: 'FootballSN Management',
          approved: true
        }
      });
      console.log('✅ Utilisateur propriétaire créé');
    }

    // Supprimer les terrains existants (optionnel - commentez si vous voulez garder)
    // await Terrain.deleteMany({});
    // console.log('🗑️  Terrains existants supprimés');

    // Ajouter le propriétaire à chaque terrain
    const terrainsWithOwner = terrainsData.map(terrain => ({
      ...terrain,
      owner: defaultOwner._id,
      rating: {
        average: 4.0 + Math.random() * 1.0, // Rating entre 4.0 et 5.0
        count: Math.floor(Math.random() * 50) + 5 // Entre 5 et 55 avis
      },
      views: Math.floor(Math.random() * 500) + 50 // Entre 50 et 550 vues
    }));

    // Insérer les terrains
    const insertedTerrains = await Terrain.insertMany(terrainsWithOwner);
    
    console.log(`✅ ${insertedTerrains.length} terrains ajoutés avec succès!`);
    console.log('\n📊 Résumé des terrains:');
    console.log(`   - Dakar: ${insertedTerrains.filter(t => t.address.city === 'Dakar').length}`);
    console.log(`   - Thiès: ${insertedTerrains.filter(t => t.address.city === 'Thiès' || t.address.city === 'Mbour' || t.address.city === 'Saly').length}`);
    console.log(`   - Autres régions: ${insertedTerrains.filter(t => !['Dakar', 'Thiès', 'Mbour', 'Saly'].includes(t.address.city)).length}`);
    console.log(`\n   - Synthétiques: ${insertedTerrains.filter(t => t.type === 'synthetique').length}`);
    console.log(`   - Naturels: ${insertedTerrains.filter(t => t.type === 'naturel').length}`);
    console.log(`\n   - 5x5: ${insertedTerrains.filter(t => t.size === '5x5').length}`);
    console.log(`   - 7x7: ${insertedTerrains.filter(t => t.size === '7x7').length}`);
    console.log(`   - 11x11: ${insertedTerrains.filter(t => t.size === '11x11').length}`);

    console.log('\n🎉 Import terminé avec succès!');
    console.log('\n💡 Vous pouvez maintenant:');
    console.log('   1. Aller sur http://localhost:5174/terrains');
    console.log('   2. Voir tous les terrains sur la carte');
    console.log('   3. Tester la recherche et les filtres');
    console.log('   4. Tester "Terrains près de moi"');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    process.exit(1);
  }
};

// Exécuter le script
seedTerrains();

