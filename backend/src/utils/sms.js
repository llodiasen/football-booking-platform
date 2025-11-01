// Utilitaire pour envoyer des SMS
// TODO: Intégrer une vraie API SMS (ex: Twilio, MessageBird, ou provider local sénégalais)

// Helper pour envoyer un SMS
const sendSMS = async (phoneNumber, message) => {
  // Si pas de configuration SMS, simuler l'envoi
  if (!process.env.SMS_API_KEY) {
    console.log(`📱 SMS simulé - À: ${phoneNumber}, Message: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    // TODO: Implémenter l'appel à l'API SMS réelle
    // Exemple avec une API générique:
    /*
    const response = await fetch(process.env.SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMS_API_KEY}`
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message
      })
    });
    
    const data = await response.json();
    return { success: true, data };
    */

    console.log(`📱 SMS simulé - À: ${phoneNumber}, Message: ${message}`);
    return { success: true, simulated: true };

  } catch (error) {
    console.error('❌ Erreur envoi SMS:', error);
    return { success: false, error: error.message };
  }
};

// SMS de confirmation de réservation
exports.sendReservationSMS = async (reservation, terrain, userPhone) => {
  const date = new Date(reservation.date).toLocaleDateString('fr-FR');
  const message = `Réservation confirmée ✅\n${terrain.name}\n📅 ${date} à ${reservation.startTime}\n💰 ${reservation.finalPrice} FCFA`;
  
  return sendSMS(userPhone, message);
};

// SMS de rappel de réservation (24h avant)
exports.sendReservationReminder = async (reservation, terrain, userPhone) => {
  const date = new Date(reservation.date).toLocaleDateString('fr-FR');
  const message = `Rappel: Réservation demain!\n${terrain.name}\n📅 ${date} à ${reservation.startTime}\nÀ bientôt! ⚽`;
  
  return sendSMS(userPhone, message);
};

// SMS d'annulation
exports.sendCancellationSMS = async (reservation, terrain, userPhone) => {
  const date = new Date(reservation.date).toLocaleDateString('fr-FR');
  const message = `Réservation annulée\n${terrain.name}\n📅 ${date} à ${reservation.startTime}`;
  
  return sendSMS(userPhone, message);
};

// SMS de paiement confirmé
exports.sendPaymentSMS = async (payment, userPhone) => {
  const message = `Paiement confirmé ✅\n💰 ${payment.amount} FCFA\n🔖 ${payment.transactionId}`;
  
  return sendSMS(userPhone, message);
};

// Export de la fonction générique
exports.sendSMS = sendSMS;

