const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Team = require('../models/Team');

const fixCaptainLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    // Liste des capitaines à fixer
    const captainEmails = [
      'captain.team1@221football.sn',
      'captain.team2@221football.sn',
      'captain.team3@221football.sn',
      'captain.team4@221football.sn',
      'captain.team5@221football.sn'
    ];

    console.log('🔧 Correction des comptes capitaines...\n');

    for (const email of captainEmails) {
      // Trouver l'équipe
      const team = await Team.findOne({ 'captain.email': email });
      
      if (!team) {
        console.log(`⚠️  Équipe non trouvée pour ${email}`);
        continue;
      }

      // Vérifier si le user existe
      let user = await User.findOne({ email });

      if (user) {
        // Mettre à jour le rôle
        user.role = 'team';
        user.teamProfile = {
          teamId: team._id,
          teamName: team.name
        };
        await user.save({ validateBeforeSave: false }); // Skip validation
        console.log(`✅ ${email} → role='team' (mis à jour)`);
      } else {
        // Créer le compte User s'il n'existe pas
        user = await User.create({
          firstName: team.captain.firstName,
          lastName: team.captain.lastName,
          email: team.captain.email,
          phone: team.captain.phone,
          password: 'password123', // Sera hashé par pre-save
          role: 'team',
          isActive: true,
          teamProfile: {
            teamId: team._id,
            teamName: team.name
          }
        });
        console.log(`✅ ${email} → Compte créé avec role='team'`);
      }
    }

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ CAPITAINES CORRIGÉS !                             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('🎯 Vous pouvez maintenant vous connecter avec:');
    console.log('   captain.team1@221football.sn / password123');
    console.log('   → Dashboard équipe FC Médina ✅\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixCaptainLogin();

