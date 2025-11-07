const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const listAllTeamAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  📋 LISTE DE TOUS LES COMPTES ÉQUIPES                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Récupérer tous les users avec role='team'
    const teamUsers = await User.find({ 
      $or: [
        { role: 'team' },
        { roles: 'team' },
        { primaryRole: 'team' }
      ]
    }).select('email firstName lastName role roles primaryRole teamProfile isActive').sort('email');

    console.log(`📊 Total: ${teamUsers.length} comptes équipes trouvés\n`);

    if (teamUsers.length === 0) {
      console.log('❌ AUCUN COMPTE ÉQUIPE TROUVÉ !');
      console.log('\n🔧 Relancez le script de création:');
      console.log('   node src/scripts/cleanupAndSimplifyAccounts.js\n');
      mongoose.connection.close();
      process.exit(1);
    }

    console.log('═══════════════════════════════════════════════════════\n');

    teamUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Nom: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Roles: ${user.roles?.join(', ') || 'Non défini'}`);
      console.log(`   Primary: ${user.primaryRole || 'Non défini'}`);
      console.log(`   Équipe: ${user.teamProfile?.teamName || 'Aucune'}`);
      console.log(`   Actif: ${user.isActive ? '✅' : '❌'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log('🔑 MOT DE PASSE POUR TOUS: password123');
    console.log('═══════════════════════════════════════════════════════\n');

    // Vérifier spécifiquement scatcity
    console.log('🔍 RECHERCHE DE SCATCITY:\n');
    const scatUser = await User.findOne({ 
      $or: [
        { email: 'scatcity@gmail.com' },
        { email: /scat/i }
      ]
    });

    if (scatUser) {
      console.log('✅ Compte Scat City trouvé:');
      console.log(`   📧 Email: ${scatUser.email}`);
      console.log(`   👤 Nom: ${scatUser.firstName} ${scatUser.lastName}`);
      console.log(`   🎭 Role: ${scatUser.role}`);
      console.log(`   🎭 Roles: ${scatUser.roles?.join(', ')}`);
      console.log(`   🎯 Primary: ${scatUser.primaryRole}`);
      console.log(`   🏆 Équipe: ${scatUser.teamProfile?.teamName || 'Aucune'}`);
      console.log(`   ✅ Actif: ${scatUser.isActive}`);
      console.log(`   🔑 Mot de passe: password123\n`);
    } else {
      console.log('❌ Compte Scat City NON TROUVÉ !');
      console.log('   Le compte a peut-être été supprimé.\n');
      console.log('🔧 Pour le recréer:');
      console.log('   1. Allez sur /register/team');
      console.log('   2. OU utilisez un des 30 comptes ci-dessus\n');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

listAllTeamAccounts();

