const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const migrateToMultipleRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  🔄 MIGRATION: role STRING → roles ARRAY             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const User = mongoose.model('User');
    
    // Récupérer tous les users
    const users = await User.find({});
    
    console.log(`📊 ${users.length} utilisateurs trouvés\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Si 'roles' existe déjà (array), skip
      if (Array.isArray(user.roles)) {
        skippedCount++;
        continue;
      }

      // Convertir role (string) → roles (array)
      const oldRole = user.role || 'client';
      const newRoles = [oldRole];

      // Si l'utilisateur a un teamProfile, ajouter 'team-captain'
      if (user.teamProfile && user.teamProfile.teamId) {
        if (!newRoles.includes('team')) {
          newRoles.push('team');
        }
        // Ajouter aussi 'team-captain' pour distinguer du simple membre
        newRoles.push('team-captain');
      }

      // Si l'utilisateur a un playerProfile, ajouter 'player'
      if (user.playerProfile && user.playerProfile.playerId) {
        if (!newRoles.includes('player')) {
          newRoles.push('player');
        }
      }

      // Mise à jour
      await User.updateOne(
        { _id: user._id },
        { 
          $set: { 
            roles: newRoles,
            primaryRole: oldRole // Garder le rôle principal pour compatibilité
          }
        }
      );

      console.log(`✅ ${user.email}`);
      console.log(`   Ancien: role='${oldRole}'`);
      console.log(`   Nouveau: roles=${JSON.stringify(newRoles)}\n`);

      migratedCount++;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Migration terminée !`);
    console.log(`   - ${migratedCount} utilisateurs migrés`);
    console.log(`   - ${skippedCount} utilisateurs déjà à jour`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('🎯 PROCHAINES ÉTAPES:\n');
    console.log('1. Mettre à jour le modèle User.js:');
    console.log('   - Remplacer "role: String" par "roles: [String]"');
    console.log('   - Ajouter "primaryRole: String"');
    console.log('');
    console.log('2. Mettre à jour AuthContext.jsx:');
    console.log('   - user.role → user.primaryRole');
    console.log('   - Ajouter user.roles (array)');
    console.log('');
    console.log('3. Tester la connexion avec scatcity@gmail.com\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

migrateToMultipleRoles();

