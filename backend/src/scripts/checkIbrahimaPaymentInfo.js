const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const checkPaymentInfo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver l'utilisateur Ibrahima
    const user = await User.findOne({ email: 'soonoup93@gmail.com' });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      process.exit(1);
    }

    console.log('\n📋 Informations utilisateur:');
    console.log('Nom:', user.firstName, user.lastName);
    console.log('Email:', user.email);
    console.log('Rôle:', user.role);
    
    console.log('\n💳 OwnerProfile:');
    console.log('Business Name:', user.ownerProfile?.businessName);
    
    console.log('\n💰 PaymentInfo:');
    console.log('Wave Number:', user.ownerProfile?.paymentInfo?.waveNumber || 'NON CONFIGURÉ');
    console.log('Wave QR Code:', user.ownerProfile?.paymentInfo?.waveQRCode ? 'CONFIGURÉ (' + user.ownerProfile.paymentInfo.waveQRCode.substring(0, 50) + '...)' : 'NON CONFIGURÉ');
    console.log('Orange Money Number:', user.ownerProfile?.paymentInfo?.orangeMoneyNumber || 'NON CONFIGURÉ');
    console.log('Orange Money QR Code:', user.ownerProfile?.paymentInfo?.orangeMoneyQRCode ? 'CONFIGURÉ' : 'NON CONFIGURÉ');
    console.log('Free Money Number:', user.ownerProfile?.paymentInfo?.freeMoneyNumber || 'NON CONFIGURÉ');
    console.log('Free Money QR Code:', user.ownerProfile?.paymentInfo?.freeMoneyQRCode ? 'CONFIGURÉ' : 'NON CONFIGURÉ');

    console.log('\n✅ Vérification terminée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkPaymentInfo();

