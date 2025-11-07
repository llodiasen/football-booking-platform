const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Team = require('../models/Team');

const convertScatToTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    // Trouver l'équipe Scat City
    const team = await Team.findOne({ name: /scat city/i });
    
    if (!team) {
      console.log('❌ Équipe "scat city" non trouvée');
      mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Équipe trouvée: ${team.name} (ID: ${team._id})\n`);

    // Trouver le compte User
    const user = await User.findOne({ email: 'scatcity@gmail.com' });

    if (!user) {
      console.log('❌ Compte scatcity@gmail.com non trouvé');
      mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ Compte trouvé: ${user.email} (Role actuel: ${user.role})\n`);

    // Convertir le compte en Team
    user.role = 'team';
    user.teamProfile = {
      teamId: team._id,
      teamName: team.name
    };

    await user.save({ validateBeforeSave: false });

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ CONVERSION RÉUSSIE !                              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`👤 Compte: ${user.email}`);
    console.log(`🔄 Role: client → team ✅`);
    console.log(`🏆 Équipe: ${team.name}`);
    console.log(`🆔 Team ID: ${team._id}\n`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 VOUS POUVEZ MAINTENANT:');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('1. Déconnectez-vous');
    console.log('2. Reconnectez-vous avec: scatcity@gmail.com');
    console.log('3. Vous serez sur le Dashboard Équipe ✅');
    console.log('4. Vous pourrez envoyer des invitations ✅\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

convertScatToTeam();

