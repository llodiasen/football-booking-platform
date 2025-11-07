const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

const testScatLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    const user = await User.findOne({ email: 'scatcity@gmail.com' });

    if (!user) {
      console.log('❌ AUCUN UTILISATEUR TROUVÉ avec scatcity@gmail.com');
      console.log('\n📋 Recherche de comptes similaires...\n');
      
      const similarUsers = await User.find({ 
        $or: [
          { email: { $regex: /scat/i } },
          { firstName: { $regex: /scat/i } },
          { lastName: { $regex: /scat/i } }
        ]
      }).select('email firstName lastName role');
      
      if (similarUsers.length > 0) {
        console.log('Comptes trouvés:');
        similarUsers.forEach((u, i) => {
          console.log(`${i + 1}. ${u.email} - ${u.firstName} ${u.lastName} (${u.role})`);
        });
      } else {
        console.log('Aucun compte similaire trouvé');
      }
      
      mongoose.connection.close();
      process.exit(1);
    }

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  🔍 DIAGNOSTIC DU COMPTE                              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('📧 Email:', user.email);
    console.log('👤 Nom:', user.firstName, user.lastName);
    console.log('📱 Téléphone:', user.phone);
    console.log('🔑 Password Hash:', user.password.substring(0, 30) + '...');
    console.log('🎭 Role:', user.role);
    console.log('🎭 Roles:', user.roles);
    console.log('🎯 Primary Role:', user.primaryRole);
    console.log('🏆 Team:', user.teamProfile?.teamName || 'Aucune');
    console.log('✅ Actif:', user.isActive);
    console.log('');

    // TEST DES MOTS DE PASSE
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 TEST DES MOTS DE PASSE');
    console.log('═══════════════════════════════════════════════════════\n');

    const passwordsToTest = [
      'password123',
      'Password123',
      'scatcity',
      'Scatcity',
      '123456',
      'admin123'
    ];

    let foundPassword = null;

    for (const pwd of passwordsToTest) {
      const isMatch = await bcrypt.compare(pwd, user.password);
      console.log(`🔍 Test "${pwd}":`, isMatch ? '✅ MATCH !' : '❌');
      if (isMatch) {
        foundPassword = pwd;
        break;
      }
    }

    console.log('');

    if (foundPassword) {
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║  ✅ MOT DE PASSE TROUVÉ !                             ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log(`🔑 Le bon mot de passe est: ${foundPassword}\n`);
      console.log('Utilisez:');
      console.log(`   📧 scatcity@gmail.com`);
      console.log(`   🔑 ${foundPassword}\n`);
    } else {
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║  ⚠️  AUCUN MOT DE PASSE NE CORRESPOND                 ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log('Le mot de passe stocké ne correspond à aucun test.');
      console.log('Il a peut-être été défini manuellement.\n');
      console.log('🔧 SOLUTION: Réinitialiser le mot de passe\n');
      
      // Réinitialiser automatiquement
      const newPassword = 'password123';
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save({ validateBeforeSave: false });
      
      console.log('✅ Mot de passe réinitialisé à: password123');
      console.log('\nEssayez maintenant:');
      console.log('   📧 scatcity@gmail.com');
      console.log('   🔑 password123\n');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

testScatLogin();

