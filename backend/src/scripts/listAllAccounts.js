const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function listAllAccounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-booking');
    console.log('✅ Connecté à MongoDB\n');

    const users = await User.find().select('firstName lastName email role phone createdAt').sort('role email');

    console.log('👥 LISTE DE TOUS LES COMPTES UTILISATEURS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const grouped = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});

    Object.keys(grouped).forEach(role => {
      const roleEmoji = {
        'admin': '👑',
        'owner': '👨‍💼',
        'client': '👤'
      };

      console.log(`${roleEmoji[role] || '👤'} ${role.toUpperCase()}S (${grouped[role].length})`);
      console.log('───────────────────────────────────────────────────────────────');
      
      grouped[role].forEach((user, i) => {
        console.log(`${i + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   📱 ${user.phone || 'N/A'}`);
        console.log(`   📅 Créé: ${new Date(user.createdAt).toLocaleDateString('fr-FR')}`);
        console.log('');
      });
    });

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 TOTAL:', users.length, 'utilisateurs');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('🔑 COMPTES DE TEST - MOTS DE PASSE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 admin@football-booking.sn     → admin123');
    console.log('📧 soonoup93@gmail.com           → password123');
    console.log('📧 amdiallo@gmail.com            → password123');
    console.log('📧 qwert@gmail.com               → password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

listAllAccounts();

