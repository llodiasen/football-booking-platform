const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Team = require('../models/Team');

const fixScatRoleCompletely = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    const user = await User.findOne({ email: 'scatcity@gmail.com' });
    const team = await Team.findOne({ name: /scat city/i });

    if (!user) {
      console.log('❌ Compte scatcity@gmail.com non trouvé');
      mongoose.connection.close();
      process.exit(1);
    }

    if (!team) {
      console.log('❌ Équipe scat city non trouvée');
      mongoose.connection.close();
      process.exit(1);
    }

    console.log('📊 ÉTAT ACTUEL:');
    console.log('   Email:', user.email);
    console.log('   role:', user.role);
    console.log('   roles:', user.roles);
    console.log('   primaryRole:', user.primaryRole);
    console.log('   teamProfile:', user.teamProfile);
    console.log('');

    // CORRECTION COMPLÈTE
    user.role = 'team';
    user.roles = ['team', 'team-captain'];
    user.primaryRole = 'team';
    user.teamProfile = {
      teamId: team._id,
      teamName: team.name
    };

    // Mot de passe simple
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save({ validateBeforeSave: false });

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ COMPTE COMPLÈTEMENT CORRIGÉ !                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log('📊 NOUVEL ÉTAT:');
    console.log('   📧 Email: scatcity@gmail.com');
    console.log('   🔑 Password: password123');
    console.log('   👤 role:', user.role);
    console.log('   👥 roles:', user.roles);
    console.log('   🎯 primaryRole:', user.primaryRole);
    console.log('   🏆 Team:', user.teamProfile.teamName);
    console.log('   🆔 Team ID:', user.teamProfile.teamId);
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 TESTEZ MAINTENANT:');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('1. Déconnectez-vous complètement');
    console.log('2. Videz le cache (Ctrl+Shift+Suppr)');
    console.log('3. Allez sur http://localhost:5173/');
    console.log('4. Connectez-vous:');
    console.log('   📧 scatcity@gmail.com');
    console.log('   🔑 password123');
    console.log('5. Vous devriez:');
    console.log('   ✅ Rester connecté');
    console.log('   ✅ Être redirigé vers /dashboard/team');
    console.log('   ✅ Voir "scat city" en haut');
    console.log('   ✅ Pouvoir inviter des joueurs\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixScatRoleCompletely();

