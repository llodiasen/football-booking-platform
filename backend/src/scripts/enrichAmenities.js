const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Terrain = require('../models/Terrain');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

// Liste complète des équipements possibles
const allAmenities = [
  'vestiaires',
  'douches',
  'parking',
  'eclairage',
  'tribune',
  'cafeteria',
  'wifi'
];

// Équipements supplémentaires à ajouter si nécessaire
const additionalAmenities = [
  'vestiaires',  // Plus probable
  'douches',     // Plus probable
  'parking',     // Plus probable
  'eclairage',   // Plus probable
  'wifi',        // Assez probable
  'tribune',     // Moins probable
  'cafeteria'    // Moins probable
];

async function enrichAmenities() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    console.log('📊 Récupération des terrains...');
    const terrains = await Terrain.find({ isApproved: true });
    console.log(`✅ ${terrains.length} terrains trouvés\n`);

    let enrichedCount = 0;
    let alreadyCompleteCount = 0;

    for (const terrain of terrains) {
      const currentAmenities = terrain.amenities || [];
      const amenitiesCount = currentAmenities.length;

      console.log(`\n🔄 ${terrain.name}`);
      console.log(`   Équipements actuels: ${amenitiesCount}`);

      if (amenitiesCount >= 6) {
        console.log(`   ✅ Déjà complet (${amenitiesCount} équipements)`);
        alreadyCompleteCount++;
        continue;
      }

      // Nombre d'équipements à ajouter
      const neededCount = 6 - amenitiesCount;
      console.log(`   ➕ Ajout de ${neededCount} équipements...`);

      // Créer une liste d'équipements disponibles (non déjà présents)
      const availableAmenities = allAmenities.filter(
        amenity => !currentAmenities.includes(amenity)
      );

      // Si on a assez d'équipements disponibles
      if (availableAmenities.length >= neededCount) {
        // Mélanger et prendre le nombre nécessaire
        const shuffled = availableAmenities.sort(() => 0.5 - Math.random());
        const toAdd = shuffled.slice(0, neededCount);
        
        terrain.amenities = [...currentAmenities, ...toAdd];
        console.log(`   ✅ Ajoutés: ${toAdd.join(', ')}`);
      } else {
        // Ajouter tous les équipements restants
        terrain.amenities = [...allAmenities];
        console.log(`   ✅ Tous les équipements ajoutés (7)`);
      }

      // Sauvegarder
      await terrain.save();
      enrichedCount++;
      console.log(`   💾 Sauvegardé (${terrain.amenities.length} équipements au total)`);
    }

    console.log(`\n\n🎉 Enrichissement des équipements terminé !`);
    console.log(`✅ ${enrichedCount} terrains enrichis`);
    console.log(`✅ ${alreadyCompleteCount} terrains déjà complets`);
    console.log(`✅ Total: ${terrains.length} terrains\n`);

    // Vérification finale
    console.log('🔍 Vérification finale...');
    const terrainsAfter = await Terrain.find({ isApproved: true });
    const withLessThan6 = terrainsAfter.filter(t => (t.amenities || []).length < 6);
    
    if (withLessThan6.length === 0) {
      console.log('✅ Tous les terrains ont maintenant au moins 6 équipements !\n');
    } else {
      console.log(`⚠️  ${withLessThan6.length} terrains ont encore moins de 6 équipements:`);
      withLessThan6.forEach(t => {
        console.log(`   - ${t.name}: ${t.amenities.length} équipements`);
      });
    }

    // Statistiques
    const stats = {
      6: 0,
      7: 0
    };

    terrainsAfter.forEach(t => {
      const count = (t.amenities || []).length;
      if (count === 6) stats[6]++;
      if (count === 7) stats[7]++;
    });

    console.log('\n📊 Statistiques finales:');
    console.log(`   Terrains avec 6 équipements: ${stats[6]}`);
    console.log(`   Terrains avec 7 équipements: ${stats[7]}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connexion fermée');
  }
}

enrichAmenities();

