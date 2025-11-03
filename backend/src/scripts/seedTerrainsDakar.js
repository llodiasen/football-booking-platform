const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');
require('dotenv').config();

// Charger les données des terrains
const terrainsDakar = require('../data/terrains-dakar.json');

const seedTerrains = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    let terrainsAjoutes = 0;
    let terrainsExistants = 0;
    let erreurs = 0;

    console.log(`\n📊 Traitement de ${terrainsDakar.length} terrains...\n`);

    for (const terrainData of terrainsDakar) {
      try {
        // Vérifier si le terrain existe déjà (par nom)
        const terrainExistant = await Terrain.findOne({ nom: terrainData.nom });

        if (terrainExistant) {
          console.log(`⚠️  Terrain existant: ${terrainData.nom}`);
          terrainsExistants++;
        } else {
          // Créer le nouveau terrain
          const nouveauTerrain = new Terrain(terrainData);
          await nouveauTerrain.save();
          console.log(`✅ Ajouté: ${terrainData.nom}`);
          terrainsAjoutes++;
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${terrainData.nom}:`, error.message);
        erreurs++;
      }
    }

    // Résumé
    console.log(`\n
╔═══════════════════════════════════════════════════════════╗
║                    RÉSUMÉ DE L'IMPORT                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ✅ Terrains ajoutés       : ${terrainsAjoutes.toString().padStart(3)}                      ║
║   ⚠️  Terrains existants     : ${terrainsExistants.toString().padStart(3)}                      ║
║   ❌ Erreurs                : ${erreurs.toString().padStart(3)}                      ║
║   📊 Total traité           : ${terrainsDakar.length.toString().padStart(3)}                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // Compter le nombre total de terrains dans la base
    const totalTerrains = await Terrain.countDocuments();
    console.log(`\n📦 Total de terrains dans la base de données : ${totalTerrains}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// Exécuter le script
seedTerrains();

