const paytechService = require('../services/paytechService');
const Reservation = require('../models/Reservation');

/**
 * Initier un paiement PayTech
 */
exports.initiatePayment = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // Récupérer la réservation
    const reservation = await Reservation.findById(reservationId)
      .populate('client', 'firstName lastName email phone')
      .populate('terrain', 'name');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien le client
    if (reservation.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    // Générer une référence unique
    const refCommand = `RES-${reservation._id}-${Date.now()}`;

    // Préparer les données de paiement
    const paymentData = {
      item_name: `Réservation ${reservation.terrain.name}`,
      item_price: Math.round(reservation.totalPrice), // PayTech accepte les entiers
      command_name: `Réservation terrain ${reservation.date.toLocaleDateString('fr-FR')}`,
      ref_command: refCommand,
      currency: 'XOF', // Franc CFA
      reservationId: reservation._id.toString(),
      clientId: reservation.client._id.toString(),
      terrainId: reservation.terrain._id.toString()
    };

    // Initier le paiement avec PayTech
    const result = await paytechService.initiatePayment(paymentData);

    // Sauvegarder la référence PayTech dans la réservation
    reservation.paymentReference = refCommand;
    reservation.paytechToken = result.token;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Paiement initié avec succès',
      data: {
        token: result.token,
        redirect_url: result.redirect_url,
        ref_command: refCommand
      }
    });
  } catch (error) {
    console.error('Erreur initiation paiement PayTech:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'initiation du paiement'
    });
  }
};

/**
 * Callback IPN de PayTech (Instant Payment Notification)
 */
exports.handleCallback = async (req, res) => {
  try {
    console.log('📥 PayTech IPN Callback reçu:', req.body);

    // Traiter les données du callback
    const ipnData = paytechService.processIPN(req.body);

    if (ipnData.type_event === 'sale_complete') {
      // Paiement réussi
      const reservation = await Reservation.findById(ipnData.reservationId);

      if (!reservation) {
        console.error('❌ Réservation introuvable:', ipnData.reservationId);
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      // Mettre à jour le statut de la réservation
      reservation.paymentStatus = 'completed';
      reservation.status = 'confirmed';
      reservation.paymentMethod = ipnData.payment_method;
      reservation.paymentReference = ipnData.payment_ref;
      reservation.paidAt = new Date();
      await reservation.save();

      console.log('✅ Réservation confirmée:', reservation._id);

      // Envoyer une notification au propriétaire (optionnel)
      // TODO: Implémenter système de notification

      res.status(200).json({
        success: true,
        message: 'Paiement confirmé'
      });
    } else {
      // Paiement échoué ou annulé
      console.log('⚠️ Paiement non complété:', ipnData.type_event);
      res.status(200).json({
        success: true,
        message: 'Callback reçu'
      });
    }
  } catch (error) {
    console.error('❌ Erreur traitement callback PayTech:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement du callback'
    });
  }
};

/**
 * Vérifier le statut d'un paiement
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { token } = req.params;

    // Vérifier le statut avec PayTech
    const result = await paytechService.checkPaymentStatus(token);

    // Trouver la réservation correspondante
    const reservation = await Reservation.findOne({ paytechToken: token });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Mettre à jour le statut si nécessaire
    if (result.status === 1 && reservation.paymentStatus !== 'completed') {
      reservation.paymentStatus = 'completed';
      reservation.status = 'confirmed';
      reservation.paidAt = new Date();
      await reservation.save();
    }

    res.status(200).json({
      success: true,
      data: {
        status: result.status,
        reservation: {
          id: reservation._id,
          status: reservation.status,
          paymentStatus: reservation.paymentStatus
        }
      }
    });
  } catch (error) {
    console.error('Erreur vérification statut PayTech:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du statut'
    });
  }
};

