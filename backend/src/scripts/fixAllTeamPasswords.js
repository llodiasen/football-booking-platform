const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const fixAllTeamPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  🔧 RÉINITIALISATION DE TOUS LES MOTS DE PASSE       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Récupérer tous les comptes équipes
    const teamUsers = await User.find({ 
      $or: [
        { role: 'team' },
        { roles: 'team' }
      ]
    });

    console.log(`📊 ${teamUsers.length} comptes équipes trouvés\n`);

    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let updated = 0;

    for (const user of teamUsers) {
      // Utiliser updateOne pour bypass le pre-save hook
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            role: 'team',
            roles: ['team', 'team-captain'],
            primaryRole: 'team'
          }
        }
      );
      
      updated++;
      console.log(`✅ ${user.email} → password123`);
    }

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ TOUS LES MOTS DE PASSE RÉINITIALISÉS !            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`📊 ${updated} comptes mis à jour`);
    console.log(`🔑 Mot de passe universel: password123\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 COMPTES PRÊTS À TESTER:');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('   📧 fc-medina@221football.sn');
    console.log('   🔑 password123\n');
    console.log('   📧 as-pikine@221football.sn');
    console.log('   🔑 password123\n');
    console.log('   📧 scatcity@gmail.com');
    console.log('   🔑 password123\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

fixAllTeamPasswords();

