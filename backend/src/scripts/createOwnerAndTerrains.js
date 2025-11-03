const mongoose = require('mongoose');
const User = require('../models/User');
const Terrain = require('../models/Terrain');
require('dotenv').config();

// Fonction pour mapper la surface
const mapSurface = (surface) => {
  if (!surface) return 'synthetique';
  const lower = surface.toLowerCase();
  if (lower.includes('synthétique') || lower.includes('synthetique')) return 'synthetique';
  if (lower.includes('naturel')) return 'naturel';
  if (lower.includes('stabilisé') || lower.includes('stabilise') || lower.includes('sable')) return 'stabilise';
  return 'synthetique';
};

// Fonction pour mapper la taille
const mapSize = (capacite) => {
  if (capacite <= 14) return '5x5';
  if (capacite <= 18) return '7x7';
  return '11x11';
};

// Fonction pour mapper les équipements
const mapEquipements = (equipements) => {
  if (!equipements || equipements.length === 0) return [];
  
  const mapping = {
    'vestiaires': 'vestiaires',
    'vestiaire': 'vestiaires',
    'éclairage nocturne': 'eclairage',
    'eclairage': 'eclairage',
    'parking': 'parking',
    'gradins': 'tribune',
    'tribune': 'tribune',
    'espace détente': 'cafeteria',
    'espace jeux': 'cafeteria',
    'douches': 'douches',
  };
  
  const result = [];
  equipements.forEach(eq => {
    const lower = eq.toLowerCase();
    for (const [key, value] of Object.entries(mapping)) {
      if (lower.includes(key) && !result.includes(value)) {
        result.push(value);
      }
    }
  });
  
  return result;
};

// Fonction pour convertir les horaires
const mapHoraires = (horaires) => {
  if (!horaires) {
    return {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '22:00', closed: false },
      sunday: { open: '08:00', close: '22:00', closed: false }
    };
  }
  
  const dayMapping = {
    'lundi': 'monday',
    'mardi': 'tuesday',
    'mercredi': 'wednesday',
    'jeudi': 'thursday',
    'vendredi': 'friday',
    'samedi': 'saturday',
    'dimanche': 'sunday'
  };
  
  const result = {};
  for (const [frDay, enDay] of Object.entries(dayMapping)) {
    if (horaires[frDay]) {
      result[enDay] = {
        open: horaires[frDay].ouverture,
        close: horaires[frDay].fermeture,
        closed: false
      };
    } else {
      result[enDay] = { open: '08:00', close: '22:00', closed: false };
    }
  }
  
  return result;
};

// Données des terrains
const terrainsDakar = require('../data/terrains-dakar.json');

const createOwnerAndTerrains = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Créer ou récupérer l'utilisateur propriétaire
    let owner = await User.findOne({ email: 'admin@football-booking.sn' });
    
    if (!owner) {
      console.log('📝 Création du compte propriétaire...');
      owner = new User({
        firstName: 'Football',
        lastName: 'Booking Admin',
        email: 'admin@football-booking.sn',
        phone: '77 000 00 00',
        password: 'Admin2024!',
        role: 'owner',
        isVerified: true,
        ownerProfile: {
          businessName: 'Football Booking Platform',
          approved: true
        }
      });
      await owner.save();
      console.log('✅ Propriétaire créé avec succès\n');
    } else {
      console.log('✅ Propriétaire existant trouvé\n');
    }

    let terrainsAjoutes = 0;
    let terrainsExistants = 0;
    let erreurs = 0;

    console.log(`📊 Traitement de ${terrainsDakar.length} terrains...\n`);

    for (const data of terrainsDakar) {
      try {
        // Vérifier si le terrain existe déjà
        const terrainExistant = await Terrain.findOne({ name: data.nom });

        if (terrainExistant) {
          console.log(`⚠️  Terrain existant: ${data.nom}`);
          terrainsExistants++;
        } else {
          // S'assurer que la description a au moins 20 caractères
          let description = data.description || 'Terrain de football moderne';
          if (description.length < 20) {
            description = `${description}. Situé à ${data.quartier || data.ville}.`;
          }
          
          // Créer le nouveau terrain avec la bonne structure
          const nouveauTerrain = new Terrain({
            name: data.nom,
            owner: owner._id,
            description: description,
            address: {
              street: data.adresse || '',
              city: data.ville || 'Dakar',
              region: 'Dakar',
              coordinates: {
                type: 'Point',
                coordinates: data.geolocalisation?.coordinates || [-17.4441, 14.6937]
              }
            },
            images: data.images || [],
            type: mapSurface(data.surface),
            size: mapSize(data.capacite),
            amenities: mapEquipements(data.equipements),
            pricePerHour: data.prixHeure || 15000,
            openingHours: mapHoraires(data.horaires),
            isActive: true,
            isApproved: true
          });

          await nouveauTerrain.save();
          console.log(`✅ Ajouté: ${data.nom}`);
          terrainsAjoutes++;
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${data.nom}:`, error.message);
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
    console.log(`\n📦 Total de terrains dans la base de données : ${totalTerrains}`);
    console.log(`\n👤 Propriétaire : ${owner.email}`);
    console.log(`🔑 Mot de passe : Admin2024!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// Exécuter le script
createOwnerAndTerrains();

