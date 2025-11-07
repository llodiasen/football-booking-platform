const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Terrain = require('../models/Terrain');
const Team = require('../models/Team');
const Player = require('../models/Player');

// Connexion MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
};

// Quartiers de Dakar avec coordonnées GPS
const quartiers = [
  { nom: 'Yoff', lat: 14.7515, lon: -17.4889 },
  { nom: 'Ngor', lat: 14.7394, lon: -17.5167 },
  { nom: 'Médina', lat: 14.6833, lon: -17.4500 },
  { nom: 'Pikine', lat: 14.7549, lon: -17.3973 },
  { nom: 'Parcelles Assainies', lat: 14.7756, lon: -17.4325 },
  { nom: 'Guédiawaye', lat: 14.7692, lon: -17.4081 },
  { nom: 'Ouakam', lat: 14.7167, lon: -17.4833 },
  { nom: 'Liberté 6', lat: 14.7000, lon: -17.4667 },
  { nom: 'HLM', lat: 14.7167, lon: -17.4500 },
  { nom: 'Fass', lat: 14.6922, lon: -17.4431 },
  { nom: 'Grand Dakar', lat: 14.7100, lon: -17.4500 },
  { nom: 'Plateau', lat: 14.6706, lon: -17.4378 },
  { nom: 'Sacré-Cœur', lat: 14.7028, lon: -17.4683 },
  { nom: 'Almadies', lat: 14.7392, lon: -17.5194 },
  { nom: 'Mermoz', lat: 14.7083, lon: -17.4750 }
];

// Prénoms et noms sénégalais
const prenoms = [
  'Moussa', 'Ibrahima', 'Mamadou', 'Cheikh', 'Pape', 'Abdou', 'Lamine', 
  'Ousmane', 'Amadou', 'Saliou', 'Malick', 'Babacar', 'Omar', 'Modou',
  'Seydou', 'Aliou', 'Demba', 'Youssouf', 'Baye', 'Khadim'
];

const noms = [
  'Diallo', 'Sy', 'Ndiaye', 'Fall', 'Sarr', 'Diouf', 'Sow', 'Gueye',
  'Diop', 'Ba', 'Sall', 'Kane', 'Thiam', 'Faye', 'Cisse', 'Ndao',
  'Toure', 'Mbaye', 'Seck', 'Camara'
];

// Noms de terrains
const nomsTerrains = [
  'Terrain de Yoff Aéroport',
  'Stade des Parcelles Assainies',
  'Terrain de la Médina',
  'Mini terrain Ngor',
  'Complexe Sportif Pikine',
  'Terrain Municipal Guédiawaye',
  'Arena Ouakam',
  'Stade Liberté 6',
  'Terrain HLM Grand Yoff',
  'Complexe Fass Delorme',
  'Stadium Grand Dakar',
  'Terrain Plateau Ville',
  'Sacré-Cœur Arena',
  'Les Almadies Football',
  'Mermoz Sports Complex',
  'Terrain Cambérène',
  'ASC Dieuppeul',
  'Stade Sicap Liberté',
  'Terrain Castors',
  'Complexe Nord Foire',
  'Terrain Point E',
  'Arena Mamelles',
  'Stade Amitié 3',
  'Terrain Golf Sud',
  'Complexe Cité Keur Gorgui',
  'Terrain Bopp',
  'Stadium Fann Résidence',
  'Arena Soumbédioune',
  'Terrain Gueule Tapée',
  'Complexe Fenêtre Mermoz'
];

// Noms d'équipes
const nomsEquipes = [
  'FC Médina', 'AS Pikine', 'FC Guédiawaye', 'Union de Yoff', 
  'Espoir Liberté 6', 'ASC Ouakam', 'Les Étoiles de Ngor',
  'FC Parcelles', 'Almadies FC', 'Mermoz United', 'HLM Stars',
  'Fass Football Club', 'Grand Dakar FC', 'Plateau Athletic',
  'Sacré-Cœur SC', 'Cambérène FC', 'Dieuppeul United',
  'Sicap FC', 'Castors Football', 'Nord Foire FC',
  'Point E Athletic', 'Mamelles FC', 'Amitié FC',
  'Golf Sud United', 'Keur Gorgui FC', 'Bopp Stars',
  'Fann FC', 'Soumbédioune United', 'Gueule Tapée FC',
  'Fenêtre Mermoz SC'
];

// Images de terrains (Unsplash)
const terrainImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d',
  'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7'
];

// Fonction pour générer une variation de coordonnées
const getRandomCoords = (baseQuartier, index) => {
  const variation = 0.01 * (Math.random() - 0.5);
  return {
    lat: baseQuartier.lat + variation,
    lon: baseQuartier.lon + variation
  };
};

// 1. SEED PROPRIÉTAIRES (30)
const seedOwners = async () => {
  console.log('\n📦 Création de 30 propriétaires...');
  
  const owners = [];
  const password = await bcrypt.hash('password123', 10);

  for (let i = 1; i <= 30; i++) {
    const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
    const nom = noms[Math.floor(Math.random() * noms.length)];
    
    owners.push({
      firstName: prenom,
      lastName: nom,
      email: `owner${i}@221football.sn`,
      phone: `+221 77 ${String(i).padStart(3, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
      password,
      role: 'owner',
      isActive: true,
      ownerProfile: {
        businessName: `${nom} Sports & Loisirs`,
        approved: true
      }
    });
  }

  await User.insertMany(owners);
  console.log('✅ 30 propriétaires créés');
  return owners;
};

// 2. SEED TERRAINS (30)
const seedTerrains = async (owners) => {
  console.log('\n🏟️  Création de 30 terrains...');
  
  const terrains = [];

  for (let i = 0; i < 30; i++) {
    const quartier = quartiers[i % quartiers.length];
    const coords = getRandomCoords(quartier, i);
    const owner = owners[i];

    terrains.push({
      name: nomsTerrains[i],
      description: `Terrain de football de qualité situé au cœur de ${quartier.nom}. Idéal pour matchs amicaux et compétitions.`,
      address: {
        street: `${Math.floor(Math.random() * 200) + 1} Rue ${Math.floor(Math.random() * 50) + 1}`,
        city: 'Dakar',
        region: 'Dakar',
        postalCode: `${11000 + Math.floor(Math.random() * 100)}`,
        country: 'Sénégal'
      },
      location: {
        type: 'Point',
        coordinates: [coords.lon, coords.lat]
      },
      latitude: coords.lat,
      longitude: coords.lon,
      size: ['5v5', '7v7', '11v11'][Math.floor(Math.random() * 3)],
      surface: ['Gazon naturel', 'Gazon synthétique', 'Terre battue'][Math.floor(Math.random() * 3)],
      pricePerHour: 10000 + (Math.floor(Math.random() * 4) * 5000), // 10k, 15k, 20k, 25k
      images: [
        terrainImages[Math.floor(Math.random() * terrainImages.length)] + '?w=800',
        terrainImages[Math.floor(Math.random() * terrainImages.length)] + '?w=800'
      ],
      amenities: ['Éclairage', 'Vestiaires', 'Parking', 'Toilettes'].slice(0, Math.floor(Math.random() * 4) + 1),
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      },
      owner: owner._id,
      isApproved: true,
      isActive: true,
      rating: 4 + Math.random(),
      totalReviews: Math.floor(Math.random() * 50) + 10,
      viewCount: Math.floor(Math.random() * 500) + 50
    });
  }

  await Terrain.insertMany(terrains);
  console.log('✅ 30 terrains créés');
  return terrains;
};

// 3. SEED ÉQUIPES (30)
const seedTeams = async () => {
  console.log('\n👥 Création de 30 équipes...');
  
  const teams = [];
  const password = await bcrypt.hash('password123', 10);

  for (let i = 0; i < 30; i++) {
    const quartier = quartiers[i % quartiers.length];
    const coords = getRandomCoords(quartier, i);
    const capitainePrenom = prenoms[Math.floor(Math.random() * prenoms.length)];
    const capitaineNom = noms[Math.floor(Math.random() * noms.length)];

    teams.push({
      name: nomsEquipes[i],
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(nomsEquipes[i])}&background=random&size=200`,
      description: `Équipe de football du quartier ${quartier.nom}. Passionnés et déterminés !`,
      captain: {
        firstName: capitainePrenom,
        lastName: capitaineNom,
        email: `captain.team${i + 1}@221football.sn`,
        phone: `+221 77 ${String(i + 100).padStart(3, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        password
      },
      category: ['amateur', 'semi-pro', 'loisir'][Math.floor(Math.random() * 3)],
      matchType: ['11v11', '7v7', '5v5'][Math.floor(Math.random() * 3)],
      city: 'Dakar',
      region: 'Dakar',
      address: `Quartier ${quartier.nom}`,
      latitude: coords.lat,
      longitude: coords.lon,
      foundedYear: 2015 + Math.floor(Math.random() * 9),
      stats: {
        totalMatches: Math.floor(Math.random() * 50) + 10,
        wins: Math.floor(Math.random() * 30),
        draws: Math.floor(Math.random() * 15),
        losses: Math.floor(Math.random() * 20),
        goalsFor: Math.floor(Math.random() * 80) + 20,
        goalsAgainst: Math.floor(Math.random() * 60) + 10
      },
      isVerified: true,
      isActive: true,
      role: 'team'
    });
  }

  const createdTeams = await Team.insertMany(teams);
  console.log('✅ 30 équipes créées');
  return createdTeams;
};

// 4. SEED JOUEURS (450 - 15 par équipe)
const seedPlayers = async (teams) => {
  console.log('\n⚽ Création de 450 joueurs (15 par équipe)...');
  
  const players = [];
  const password = await bcrypt.hash('password123', 10);
  const positions = ['gardien', 'défenseur', 'milieu', 'attaquant'];
  const levels = ['débutant', 'intermédiaire', 'avancé', 'expert'];

  let playerCounter = 1;

  for (const team of teams) {
    const quartier = quartiers.find(q => team.address.includes(q.nom)) || quartiers[0];

    // 15 joueurs par équipe
    for (let j = 0; j < 15; j++) {
      const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
      const nom = noms[Math.floor(Math.random() * noms.length)];
      const coords = getRandomCoords(quartier, j);
      
      // 1 gardien, 4 défenseurs, 5 milieux, 5 attaquants
      let position;
      if (j === 0) position = 'gardien';
      else if (j <= 4) position = 'défenseur';
      else if (j <= 9) position = 'milieu';
      else position = 'attaquant';

      players.push({
        firstName: prenom,
        lastName: nom,
        email: `player${String(playerCounter).padStart(3, '0')}@221football.sn`,
        phone: `+221 77 ${String(playerCounter).padStart(3, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        password,
        avatar: `https://i.pravatar.cc/150?u=${playerCounter}`,
        position,
        preferredFoot: ['droit', 'gauche', 'ambidextre'][Math.floor(Math.random() * 3)],
        dateOfBirth: new Date(1990 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        height: 160 + Math.floor(Math.random() * 30),
        weight: 60 + Math.floor(Math.random() * 30),
        city: 'Dakar',
        region: 'Dakar',
        level: levels[Math.floor(Math.random() * levels.length)],
        yearsOfExperience: Math.floor(Math.random() * 15),
        currentTeam: team._id,
        stats: {
          matchesPlayed: Math.floor(Math.random() * 40) + 5,
          goals: position === 'attaquant' ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 5),
          assists: Math.floor(Math.random() * 15),
          yellowCards: Math.floor(Math.random() * 5),
          redCards: Math.floor(Math.random() * 2)
        },
        lookingForTeam: false,
        bio: `Joueur passionné de ${quartier.nom}. Position préférée: ${position}.`,
        isVerified: true,
        isActive: true,
        role: 'player'
      });

      playerCounter++;
    }
  }

  await Player.insertMany(players);
  console.log(`✅ ${players.length} joueurs créés`);
  return players;
};

// FONCTION PRINCIPALE
const seedAll = async () => {
  try {
    console.log('\n🌱 DÉMARRAGE DU SEED DE LA BASE DE DONNÉES\n');
    console.log('=' .repeat(60));

    await connectDB();

    // Nettoyer les collections
    console.log('\n🧹 Nettoyage des collections...');
    await User.deleteMany({ role: 'owner' });
    await Terrain.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    console.log('✅ Collections nettoyées');

    // Créer les données
    const owners = await seedOwners();
    const terrains = await seedTerrains(owners);
    const teams = await seedTeams();
    const players = await seedPlayers(teams);

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 SEED TERMINÉ AVEC SUCCÈS !\n');
    console.log('📊 RÉSUMÉ :');
    console.log(`   - ${owners.length} propriétaires`);
    console.log(`   - ${terrains.length} terrains`);
    console.log(`   - ${teams.length} équipes`);
    console.log(`   - ${players.length} joueurs`);
    console.log('\n✅ Vous pouvez maintenant tester l\'application !');
    console.log('\n🔑 CREDENTIALS DE TEST :');
    console.log('   - Propriétaire: owner1@221football.sn / password123');
    console.log('   - Équipe: captain.team1@221football.sn / password123');
    console.log('   - Joueur: player001@221football.sn / password123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR LORS DU SEED:', error);
    process.exit(1);
  }
};

// Lancer le seed
seedAll();

