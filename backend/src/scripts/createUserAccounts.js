const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Team = require('../models/Team');
const Player = require('../models/Player');
const User = require('../models/User');

const createUserAccounts = async () => {
  try {
    console.log('🚀 Démarrage création comptes User pour capitaines et joueurs...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    // Hasher le mot de passe commun
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // =====================================================
    // 1. CRÉER DES COMPTES USER POUR LES 30 CAPITAINES
    // =====================================================
    console.log('👥 Création comptes User pour les 30 capitaines...\n');
    
    const teams = await Team.find().sort('name');
    let capitainesCreated = 0;

    for (const team of teams) {
      // Vérifier si le capitaine a déjà un compte User
      const existingUser = await User.findOne({ email: team.captain.email });
      
      if (!existingUser) {
        // Créer le compte User avec role 'team'
        const newUser = await User.create({
          firstName: team.captain.firstName,
          lastName: team.captain.lastName,
          email: team.captain.email,
          phone: team.captain.phone,
          password: hashedPassword,
          role: 'team', // IMPORTANT: role 'team' pour les capitaines
          isActive: true,
          teamProfile: {
            teamId: team._id,
            teamName: team.name
          }
        });

        console.log(`✅ Capitaine créé: ${newUser.email} → Équipe: ${team.name}`);
        capitainesCreated++;
      } else {
        console.log(`⚠️  Capitaine existe déjà: ${team.captain.email}`);
      }
    }

    console.log(`\n📊 Total capitaines créés: ${capitainesCreated}/30\n`);

    // =====================================================
    // 2. CRÉER DES COMPTES USER POUR LES 450 JOUEURS
    // =====================================================
    console.log('⚽ Création comptes User pour les 450 joueurs...\n');
    
    const players = await Player.find().populate('currentTeam', 'name').sort('email');
    let joueursCreated = 0;

    for (const player of players) {
      // Vérifier si le joueur a déjà un compte User
      const existingUser = await User.findOne({ email: player.email });
      
      if (!existingUser) {
        // Créer le compte User avec role 'player'
        const newUser = await User.create({
          firstName: player.firstName,
          lastName: player.lastName,
          email: player.email,
          phone: player.phone,
          password: hashedPassword,
          role: 'player', // IMPORTANT: role 'player' pour les joueurs
          isActive: true,
          playerProfile: {
            playerId: player._id,
            position: player.position,
            currentTeam: player.currentTeam?._id,
            currentTeamName: player.currentTeam?.name
          }
        });

        console.log(`✅ Joueur créé: ${newUser.email} → ${player.position} (${player.currentTeam?.name || 'Sans équipe'})`);
        joueursCreated++;
      } else {
        console.log(`⚠️  Joueur existe déjà: ${player.email}`);
      }
    }

    console.log(`\n📊 Total joueurs créés: ${joueursCreated}/450\n`);

    // =====================================================
    // 3. RÉSUMÉ FINAL
    // =====================================================
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ CRÉATION COMPTES TERMINÉE !                       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`📊 Capitaines créés: ${capitainesCreated}/30`);
    console.log(`📊 Joueurs créés: ${joueursCreated}/450`);
    console.log(`📊 TOTAL: ${capitainesCreated + joueursCreated} comptes User\n`);

    console.log('🔑 Tous les mots de passe: password123\n');
    console.log('✅ Vous pouvez maintenant vous connecter avec:');
    console.log('   - captain.team1@221football.sn / password123');
    console.log('   - player001@221football.sn / password123');
    console.log('   - etc.\n');

    mongoose.connection.close();
    console.log('✅ Script terminé avec succès !');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createUserAccounts();

