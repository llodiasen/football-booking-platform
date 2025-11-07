const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Player = require('../models/Player');
const Team = require('../models/Team');

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = process.argv[2] || 'player449@221football.sn';
    
    console.log('');
    console.log('🔍 Recherche de:', email);
    console.log('');
    
    // Chercher dans la collection User
    const user = await User.findOne({ email }).lean();
    
    // Chercher dans la collection Player
    const player = await Player.findOne({ email }).populate('currentTeam', 'name').lean();
    
    // Chercher dans la collection Team (capitaine)
    const team = await Team.findOne({ 'captain.email': email }).lean();
    
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║  RÉSULTATS DE LA RECHERCHE                       ║');
    console.log('╚═══════════════════════════════════════════════════╝');
    console.log('');
    
    if (user) {
      console.log('✅ Trouvé dans collection USER:');
      console.log('   Nom:', user.firstName, user.lastName);
      console.log('   Email:', user.email);
      console.log('   Rôle:', user.role);
      console.log('   Actif:', user.isActive);
      console.log('');
    } else {
      console.log('❌ PAS trouvé dans collection USER');
      console.log('');
    }
    
    if (player) {
      console.log('✅ Trouvé dans collection PLAYER:');
      console.log('   Nom:', player.firstName, player.lastName);
      console.log('   Email:', player.email);
      console.log('   Position:', player.position);
      console.log('   Équipe:', player.currentTeam?.name || 'Sans équipe');
      console.log('');
    } else {
      console.log('❌ PAS trouvé dans collection PLAYER');
      console.log('');
    }
    
    if (team) {
      console.log('✅ Trouvé comme CAPITAINE:');
      console.log('   Équipe:', team.name);
      console.log('   Capitaine:', team.captain.firstName, team.captain.lastName);
      console.log('');
    } else {
      console.log('❌ PAS trouvé comme capitaine');
      console.log('');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    if (player && !user) {
      console.log('⚠️  PROBLÈME DÉTECTÉ:');
      console.log('   Le joueur existe dans PLAYER mais pas dans USER');
      console.log('   → La connexion échouera');
      console.log('   → Relancez: npm run create-accounts');
      console.log('');
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkUser();

