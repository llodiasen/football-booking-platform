const nodemailer = require('nodemailer');

// Configuration du transporteur email
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Configuration email manquante - Les emails ne seront pas envoyés');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Helper pour envoyer un email
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log(`📧 Email simulé - À: ${to}, Sujet: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Réservation Terrains Football" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email envoyé: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};

// Email de bienvenue
exports.sendWelcomeEmail = async (user) => {
  const subject = 'Bienvenue sur la Plateforme de Réservation de Terrains';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Bienvenue ${user.firstName}!</h1>
      <p>Merci de vous être inscrit sur notre plateforme de réservation de terrains de football.</p>
      <p>Vous pouvez maintenant:</p>
      <ul>
        <li>Rechercher et réserver des terrains</li>
        <li>Créer ou rejoindre une équipe</li>
        <li>Gérer vos réservations</li>
      </ul>
      ${user.role === 'owner' ? `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>📋 Compte Propriétaire</strong></p>
          <p>Votre compte propriétaire est en attente d'approbation par un administrateur. 
          Vous serez notifié par email une fois votre compte approuvé.</p>
        </div>
      ` : ''}
      <p>À bientôt sur la plateforme!</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
      </p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

// Email de confirmation de réservation
exports.sendReservationConfirmation = async (reservation, terrain, user) => {
  const subject = 'Confirmation de réservation';
  const date = new Date(reservation.date).toLocaleDateString('fr-FR');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Réservation Confirmée! ⚽</h1>
      <p>Bonjour ${user.firstName},</p>
      <p>Votre réservation a bien été enregistrée.</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">${terrain.name}</h2>
        <p><strong>📅 Date:</strong> ${date}</p>
        <p><strong>🕐 Horaire:</strong> ${reservation.startTime} - ${reservation.endTime}</p>
        <p><strong>💰 Prix:</strong> ${reservation.finalPrice.toLocaleString()} FCFA</p>
        <p><strong>📍 Adresse:</strong> ${terrain.address.city}, ${terrain.address.region}</p>
      </div>

      <p><strong>Statut du paiement:</strong> ${
        reservation.paymentStatus === 'paid' ? '✅ Payé' : '⏳ En attente'
      }</p>

      ${reservation.notes ? `<p><strong>Notes:</strong> ${reservation.notes}</p>` : ''}

      <p>Merci de votre confiance!</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

// Email d'annulation de réservation
exports.sendReservationCancellation = async (reservation, terrain, user) => {
  const subject = 'Réservation annulée';
  const date = new Date(reservation.date).toLocaleDateString('fr-FR');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626;">Réservation Annulée</h1>
      <p>Bonjour ${user.firstName},</p>
      <p>Votre réservation a été annulée.</p>
      
      <div style="background-color: #fee2e2; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0;">${terrain.name}</h2>
        <p><strong>📅 Date:</strong> ${date}</p>
        <p><strong>🕐 Horaire:</strong> ${reservation.startTime} - ${reservation.endTime}</p>
      </div>

      ${reservation.cancellationReason ? `
        <p><strong>Raison:</strong> ${reservation.cancellationReason}</p>
      ` : ''}

      ${reservation.paymentStatus === 'refunded' ? `
        <p style="color: #16a34a;">
          💰 Le remboursement de ${reservation.finalPrice.toLocaleString()} FCFA 
          sera effectué sous 3-5 jours ouvrés.
        </p>
      ` : ''}

      <p>Nous espérons vous revoir bientôt!</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

// Email d'approbation du propriétaire
exports.sendOwnerApproval = async (owner) => {
  const subject = 'Votre compte propriétaire a été approuvé!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Compte Approuvé! 🎉</h1>
      <p>Bonjour ${owner.firstName},</p>
      <p>Excellente nouvelle! Votre compte propriétaire a été approuvé par notre équipe.</p>
      
      <p>Vous pouvez maintenant:</p>
      <ul>
        <li>Ajouter vos terrains</li>
        <li>Gérer les réservations</li>
        <li>Suivre vos revenus</li>
        <li>Créer des promotions</li>
      </ul>

      <p>Connectez-vous dès maintenant pour commencer!</p>
      <p>À très bientôt sur la plateforme!</p>
    </div>
  `;

  return sendEmail(owner.email, subject, html);
};

// Email de confirmation de paiement
exports.sendPaymentConfirmation = async (payment, reservation, terrain, user) => {
  const subject = 'Paiement confirmé';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Paiement Confirmé! ✅</h1>
      <p>Bonjour ${user.firstName},</p>
      <p>Votre paiement a été reçu avec succès.</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>💰 Montant:</strong> ${payment.amount.toLocaleString()} FCFA</p>
        <p><strong>💳 Méthode:</strong> ${payment.method.toUpperCase()}</p>
        <p><strong>🔖 Transaction ID:</strong> ${payment.transactionId}</p>
        <p><strong>📅 Date:</strong> ${new Date(payment.completedAt).toLocaleString('fr-FR')}</p>
      </div>

      <h3>Détails de la réservation:</h3>
      <p><strong>${terrain.name}</strong></p>
      <p>📅 ${new Date(reservation.date).toLocaleDateString('fr-FR')} 
         à ${reservation.startTime}</p>

      <p>Merci de votre confiance!</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

