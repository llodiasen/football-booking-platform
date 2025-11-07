const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Team = require('../models/Team');

const cleanupAndSimplifyAccounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  🧹 NETTOYAGE ET SIMPLIFICATION DES COMPTES          ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // 1. SUPPRIMER tous les anciens comptes capitaines de test
    console.log('1️⃣  Suppression des comptes capitaines de test...\n');
    
    const captainEmails = [
      'captain.team1@221football.sn',
      'captain.team2@221football.sn',
      'captain.team3@221football.sn',
      'captain.team4@221football.sn',
      'captain.team5@221football.sn',
      'captain.team6@221football.sn',
      'captain.team7@221football.sn',
      'captain.team8@221football.sn',
      'captain.team9@221football.sn',
      'captain.team10@221football.sn'
    ];

    const deleteResult = await User.deleteMany({ 
      email: { $in: captainEmails } 
    });

    console.log(`   ✅ ${deleteResult.deletedCount} comptes capitaines supprimés\n`);

    // 2. RÉCUPÉRER toutes les équipes
    console.log('2️⃣  Création de comptes simples pour chaque équipe...\n');
    
    const teams = await Team.find({}).limit(30);
    console.log(`   📊 ${teams.length} équipes trouvées\n`);

    let created = 0;
    let updated = 0;

    for (const team of teams) {
      // Créer un email simple basé sur le nom de l'équipe
      const teamSlug = team.name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Retirer accents
        .replace(/[^a-z0-9\s]/g, '') // Retirer caractères spéciaux
        .replace(/\s+/g, '-') // Remplacer espaces par tirets
        .substring(0, 30); // Limiter la longueur
      
      const email = `${teamSlug}@221football.sn`;
      const password = 'password123';

      // Vérifier si un compte existe déjà
      let user = await User.findOne({ email });

      if (user) {
        // Mettre à jour le compte existant
        user.role = 'team';
        user.roles = ['team', 'team-captain'];
        user.primaryRole = 'team';
        user.firstName = team.captain?.firstName || team.name.split(' ')[0];
        user.lastName = team.captain?.lastName || team.name.split(' ').slice(1).join(' ') || 'Team';
        user.phone = team.captain?.phone || '+221771234567';
        user.teamProfile = {
          teamId: team._id,
          teamName: team.name
        };
        user.isActive = true;
        
        // Réinitialiser le mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save({ validateBeforeSave: false });
        updated++;
        console.log(`   ✅ Mis à jour: ${email} → ${team.name}`);
      } else {
        // Créer un nouveau compte
        // Générer TOUJOURS un numéro unique (ignorer team.captain.phone)
        let uniquePhone;
        let phoneExists = true;
        while (phoneExists) {
          uniquePhone = `+22177${Math.floor(1000000 + Math.random() * 9000000)}`;
          phoneExists = await User.findOne({ phone: uniquePhone });
        }

        user = await User.create({
          firstName: team.captain?.firstName || team.name.split(' ')[0],
          lastName: team.captain?.lastName || team.name.split(' ').slice(1).join(' ') || 'Team',
          email: email,
          phone: uniquePhone,
          password: password, // Sera hashé par le pre-save hook
          role: 'team',
          roles: ['team', 'team-captain'],
          primaryRole: 'team',
          isActive: true,
          teamProfile: {
            teamId: team._id,
            teamName: team.name
          }
        });
        created++;
        console.log(`   ✅ Créé: ${email} → ${team.name}`);
      }

      // Mettre à jour l'email du capitaine dans le Team
      team.captain.email = email;
      await team.save();
    }

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ NETTOYAGE TERMINÉ !                               ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`📊 Résumé:`);
    console.log(`   • ${deleteResult.deletedCount} anciens comptes supprimés`);
    console.log(`   • ${created} nouveaux comptes créés`);
    console.log(`   • ${updated} comptes mis à jour`);
    console.log(`   • Total: ${created + updated} équipes actives\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 COMPTES DISPONIBLES (EXEMPLES):');
    console.log('═══════════════════════════════════════════════════════\n');

    // Afficher les 10 premiers comptes
    const sampleTeams = await Team.find({}).limit(10);
    for (const team of sampleTeams) {
      const teamSlug = team.name
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
      const email = `${teamSlug}@221football.sn`;
      console.log(`   📧 ${email}`);
      console.log(`      → Équipe: ${team.name} (${team.city})`);
      console.log(`      → Mot de passe: password123`);
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 FORMAT DES EMAILS:');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('   Nom équipe → Email');
    console.log('   FC Médina → fc-medina@221football.sn');
    console.log('   AS Pikine → as-pikine@221football.sn');
    console.log('   scat city → scat-city@221football.sn');
    console.log('');
    console.log('   🔑 Tous les mots de passe: password123\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

cleanupAndSimplifyAccounts();

