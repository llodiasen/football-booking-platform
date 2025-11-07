const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Player = require('../models/Player');

const fixPlayer449 = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    // Supprimer l'ancien compte
    await User.deleteOne({ email: 'player449@221football.sn' });
    console.log('🗑️  Ancien compte player449 supprimé\n');

    // Récupérer les infos du joueur depuis Player (sans populate pour éviter l'erreur)
    const player = await Player.findOne({ email: 'player449@221football.sn' }).lean();

    if (player) {
      // Créer le nouveau compte avec le bon hashage
      const newUser = await User.create({
        firstName: player.firstName,
        lastName: player.lastName,
        email: player.email,
        phone: player.phone,
        password: 'password123', // Sera hashé par le pre-save hook
        role: 'player',
        isActive: true,
        playerProfile: {
          playerId: player._id,
          position: player.position,
          currentTeam: player.currentTeam?._id,
          currentTeamName: player.currentTeam?.name
        }
      });

      console.log('✅ Nouveau compte créé:');
      console.log('   Nom:', newUser.firstName, newUser.lastName);
      console.log('   Email:', newUser.email);
      console.log('   Rôle:', newUser.role);
      console.log('   Position:', player.position);
      console.log('   Équipe:', player.currentTeam?.name);
      console.log('');
      console.log('🔑 Mot de passe: password123');
      console.log('');
      console.log('✅ Vous pouvez maintenant vous connecter !');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixPlayer449();

