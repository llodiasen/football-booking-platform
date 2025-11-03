require('dotenv').config();
const mongoose = require('mongoose');
const Terrain = require('../models/Terrain');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB:', err.message);
    process.exit(1);
  }
};

const deleteAndRenameTerrain = async () => {
  await connectDB();

  try {
    // 1. Supprimer l'ancien terrain "Complexe BeSport"
    console.log('🗑️  Suppression de l\'ancien terrain "Complexe BeSport"...');
    const deletedTerrain = await Terrain.findOneAndDelete({ name: 'Complexe BeSport' });
    
    if (deletedTerrain) {
      console.log('✅ Ancien terrain "Complexe BeSport" supprimé');
      console.log('   ID:', deletedTerrain._id);
    } else {
      console.log('⚠️  Ancien terrain "Complexe BeSport" non trouvé (peut-être déjà supprimé)');
    }
    console.log('');

    // 2. Renommer "CFPT Sénégal-Japon" en "Complexe BeSport"
    console.log('📝 Renommage de "CFPT Sénégal-Japon" en "Complexe BeSport"...');
    const cfptTerrain = await Terrain.findOne({ name: 'CFPT Sénégal-Japon' });

    if (!cfptTerrain) {
      console.log('❌ Terrain "CFPT Sénégal-Japon" non trouvé');
      process.exit(1);
    }

    console.log('✅ Terrain trouvé: CFPT Sénégal-Japon');
    console.log('   ID:', cfptTerrain._id);
    console.log('   Ville:', cfptTerrain.address.city);
    console.log('');

    // 3. Modifier le nom et ajouter les images
    cfptTerrain.name = 'Complexe BeSport';
    cfptTerrain.description = 'Complexe sportif moderne avec terrains synthétiques de qualité, éclairage LED, vestiaires premium et espace de restauration. Idéal pour matchs, entraînements et tournois.';
    
    // Ajouter les 7 images
    cfptTerrain.images = [
      {
        url: '/images/dakar-besport-main.jpg',
        alt: 'Complexe BeSport - Terrain éclairé de nuit',
        isPrimary: true
      },
      {
        url: '/images/dakar-besport-1.jpg',
        alt: 'Complexe BeSport - Vue principale',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-2.jpg',
        alt: 'Complexe BeSport - Terrain de jour',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-3.jpg',
        alt: 'Complexe BeSport - Installations',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-4.jpg',
        alt: 'Complexe BeSport - Vue extérieure',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-5.jpg',
        alt: 'Complexe BeSport - Cadre idéal',
        isPrimary: false
      },
      {
        url: '/images/dakar-besport-6.jpg',
        alt: 'Complexe BeSport - École de foot',
        isPrimary: false
      }
    ];

    await cfptTerrain.save();

    console.log('✅ Terrain renommé avec succès !');
    console.log('');
    console.log('📋 Nouveau terrain :');
    console.log('   Nom  : Complexe BeSport');
    console.log('   ID   :', cfptTerrain._id);
    console.log('   Ville:', cfptTerrain.address.city);
    console.log('');
    console.log('📸 Images (7) :');
    cfptTerrain.images.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.url} ${img.isPrimary ? '⭐ (Principale)' : ''}`);
    });
    console.log('');
    console.log('🎉 TERMINÉ ! Le terrain CFPT est maintenant "Complexe BeSport" avec 7 images !');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

deleteAndRenameTerrain();

