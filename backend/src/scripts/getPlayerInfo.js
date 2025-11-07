const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Player = require('../models/Player');
const Team = require('../models/Team');

const getPlayerInfo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const playerEmail = process.argv[2] || 'player442@221football.sn';
    
    const player = await Player.findOne({ email: playerEmail })
      .populate('currentTeam', 'name')
      .lean();
    
    if (player) {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════╗');
      console.log('║  ⚽ INFORMATIONS JOUEUR                           ║');
      console.log('╚═══════════════════════════════════════════════════╝');
      console.log('');
      console.log('👤 Nom complet  :', player.firstName, player.lastName);
      console.log('📧 Email        :', player.email);
      console.log('🔑 Mot de passe : password123');
      console.log('⚽ Position     :', player.position);
      console.log('👥 Équipe       :', player.currentTeam?.name || 'Sans équipe');
      console.log('🏙️  Ville        :', player.city);
      console.log('🦶 Pied         :', player.preferredFoot);
      console.log('📈 Niveau       :', player.level);
      console.log('');
      console.log('📊 Statistiques:');
      console.log('   Matchs       :', player.stats?.matchesPlayed || 0);
      console.log('   Buts         :', player.stats?.goals || 0);
      console.log('   Passes D.    :', player.stats?.assists || 0);
      console.log('   Cartons 🟨   :', player.stats?.yellowCards || 0);
      console.log('   Cartons 🟥   :', player.stats?.redCards || 0);
      console.log('');
    } else {
      console.log('❌ Joueur non trouvé');
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

getPlayerInfo();

