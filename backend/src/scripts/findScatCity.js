const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');
const Team = require('../models/Team');

const findScatCity = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté\n');

    console.log('🔍 RECHERCHE DE L\'ÉQUIPE "SCAT CITY"...\n');
    
    // Chercher l'équipe
    const teams = await Team.find({ 
      name: { $regex: /scat/i } 
    }).lean();

    if (teams.length === 0) {
      console.log('❌ Aucune équipe trouvée avec "scat" dans le nom\n');
      console.log('📋 Voici toutes les équipes créées:\n');
      
      const allTeams = await Team.find({}).select('name captain').lean();
      allTeams.forEach((team, i) => {
        console.log(`${i + 1}. ${team.name}`);
        console.log(`   Capitaine: ${team.captain?.firstName} ${team.captain?.lastName}`);
        console.log(`   Email: ${team.captain?.email}`);
        console.log('');
      });
    } else {
      console.log('✅ ÉQUIPE(S) TROUVÉE(S):\n');
      
      for (const team of teams) {
        console.log('═══════════════════════════════════════════════════════');
        console.log(`🏆 ÉQUIPE: ${team.name}`);
        console.log('═══════════════════════════════════════════════════════');
        console.log(`📍 Ville: ${team.city || 'Non définie'}`);
        console.log(`👤 Capitaine: ${team.captain?.firstName} ${team.captain?.lastName}`);
        console.log(`📧 Email capitaine: ${team.captain?.email}`);
        console.log(`📱 Téléphone: ${team.captain?.phone || 'Non défini'}`);
        console.log(`🆔 Team ID: ${team._id}`);
        console.log('');

        // Chercher le compte User associé
        const user = await User.findOne({ email: team.captain?.email });
        
        if (user) {
          console.log('✅ COMPTE USER TROUVÉ:');
          console.log(`   Email: ${user.email}`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Actif: ${user.isActive}`);
          console.log(`   Team Profile: ${user.teamProfile?.teamName || 'Non défini'}`);
        } else {
          console.log('❌ AUCUN COMPTE USER TROUVÉ !');
          console.log('   → Le compte Team doit être créé');
        }
        console.log('');
      }

      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║  📝 COMMENT SE CONNECTER                             ║');
      console.log('╚═══════════════════════════════════════════════════════╝\n');
      console.log('Utilisez l\'email du capitaine (ci-dessus)');
      console.log('Mot de passe: celui que vous avez défini lors de la création\n');
    }

    // Chercher aussi les comptes User avec "scat" dans l'email
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 COMPTES USER AVEC "SCAT" DANS L\'EMAIL:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const users = await User.find({
      email: { $regex: /scat/i }
    }).lean();

    if (users.length === 0) {
      console.log('❌ Aucun compte trouvé\n');
    } else {
      users.forEach((user, i) => {
        console.log(`${i + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Team: ${user.teamProfile?.teamName || 'Aucune'}`);
        console.log('');
      });
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

findScatCity();

