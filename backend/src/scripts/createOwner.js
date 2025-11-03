require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Supprimer les anciens comptes s'ils existent
    await User.deleteOne({ email: 'amadou@test.com' });
    await User.deleteOne({ phone: '+221777777777' });

    // Créer un nouveau propriétaire
    const newOwner = await User.create({
      email: 'amadou@test.com',
      password: 'Test123!',
      firstName: 'Amadou',
      lastName: 'Diallo',
      phone: '+221777777777',
      role: 'owner',
      isVerified: true,
      isActive: true,
      ownerProfile: {
        businessName: 'Galaxy Arena',
        approved: true,
        verified: false
      }
    });

    console.log('✅ Nouveau propriétaire créé avec succès!\n');
    console.log('╔══════════════════════════════════════╗');
    console.log('║  NOUVEAU COMPTE PROPRIÉTAIRE         ║');
    console.log('╠══════════════════════════════════════╣');
    console.log('║  📧 Email : amadou@test.com         ║');
    console.log('║  🔑 Mot de passe : Test123!         ║');
    console.log('║  👤 Nom : Amadou Diallo             ║');
    console.log('║  🏢 Entreprise : Galaxy Arena        ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('\n💡 Utilisez ces identifiants pour vous connecter sur :');
    console.log('   http://localhost:5174/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

createOwner();

