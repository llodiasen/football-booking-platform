const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');
const Team = require('../models/Team');
const {
  initiateWavePayment,
  initiateOrangeMoneyPayment,
  initiateFreeMoneyPayment
} = require('../config/payment');

// @route   POST /api/payments/initiate
// @desc    Initiate payment
// @access  Private
exports.initiatePayment = async (req, res) => {
  try {
    const { reservationId, paymentMethod, phoneNumber } = req.body;

    // Vérifier que la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le client de la réservation
    if (reservation.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à payer cette réservation'
      });
    }

    // Vérifier que le paiement n'est pas déjà effectué
    if (reservation.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation a déjà été payée'
      });
    }

    // Vérifier que la réservation n'est pas annulée
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de payer une réservation annulée'
      });
    }

    // Créer l'enregistrement de paiement
    const payment = await Payment.create({
      reservation: reservationId,
      user: req.user.id,
      amount: reservation.finalPrice,
      currency: 'XOF',
      method: paymentMethod,
      phoneNumber,
      status: 'pending'
    });

    // Initier le paiement selon la méthode
    let paymentResponse;
    try {
      switch (paymentMethod) {
        case 'wave':
          paymentResponse = await initiateWavePayment(
            reservation.finalPrice,
            phoneNumber,
            payment._id
          );
          break;
        case 'orange_money':
          paymentResponse = await initiateOrangeMoneyPayment(
            reservation.finalPrice,
            phoneNumber,
            payment._id
          );
          break;
        case 'free_money':
          paymentResponse = await initiateFreeMoneyPayment(
            reservation.finalPrice,
            phoneNumber,
            payment._id
          );
          break;
        default:
          throw new Error('Méthode de paiement non supportée');
      }

      // Si le paiement est simulé (succès immédiat)
      if (paymentResponse.success) {
        payment.status = 'success';
        payment.transactionId = paymentResponse.transactionId;
        payment.completedAt = new Date();
        await payment.save();

        // Mettre à jour la réservation
        reservation.paymentStatus = 'paid';
        reservation.paymentId = payment._id;
        reservation.status = 'confirmed';
        await reservation.save();

        // Mettre à jour les stats de l'équipe si applicable
        if (reservation.team) {
          await Team.findByIdAndUpdate(reservation.team, {
            $inc: { 'stats.totalSpent': reservation.finalPrice }
          });
        }
      }

      res.json({
        success: true,
        message: paymentResponse.success 
          ? 'Paiement effectué avec succès' 
          : 'Paiement en cours de traitement',
        data: {
          paymentId: payment._id,
          status: payment.status,
          transactionId: payment.transactionId,
          ...paymentResponse
        }
      });

    } catch (paymentError) {
      // Marquer le paiement comme échoué
      await payment.markAsFailed(paymentError.message);

      throw paymentError;
    }

  } catch (error) {
    console.error('Erreur initiatePayment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initiation du paiement',
      error: error.message
    });
  }
};

// @route   GET /api/payments/verify/:id
// @desc    Verify payment status
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('reservation')
      .populate('user', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Vérifier l'autorisation
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à voir ce paiement'
      });
    }

    // TODO: Dans un environnement de production, vérifier le statut auprès de l'API
    // de paiement externe ici

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur verifyPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du paiement',
      error: error.message
    });
  }
};

// @route   POST /api/payments/webhook/:provider
// @desc    Handle payment webhook from provider
// @access  Public (but should verify signature)
exports.handleWebhook = async (req, res) => {
  try {
    const { provider } = req.params;
    const webhookData = req.body;

    console.log(`Webhook reçu de ${provider}:`, webhookData);

    // TODO: Vérifier la signature du webhook selon le provider
    // TODO: Extraire les données spécifiques au provider
    // TODO: Mettre à jour le paiement et la réservation

    // Pour l'instant, retourner un succès
    res.status(200).json({
      success: true,
      message: 'Webhook traité'
    });

  } catch (error) {
    console.error('Erreur handleWebhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement du webhook'
    });
  }
};

// @route   POST /api/payments/:id/refund
// @desc    Refund payment
// @access  Private (Admin)
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('reservation');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    if (payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les paiements réussis peuvent être remboursés'
      });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Ce paiement a déjà été remboursé'
      });
    }

    // TODO: Appeler l'API du provider pour effectuer le remboursement

    // Marquer le paiement comme remboursé
    await payment.refund();

    // Mettre à jour la réservation
    const reservation = await Reservation.findById(payment.reservation);
    if (reservation) {
      reservation.paymentStatus = 'refunded';
      await reservation.save();

      // Mettre à jour les stats de l'équipe si applicable
      if (reservation.team) {
        await Team.findByIdAndUpdate(reservation.team, {
          $inc: { 'stats.totalSpent': -payment.amount }
        });
      }
    }

    res.json({
      success: true,
      message: 'Remboursement effectué avec succès',
      data: payment
    });

  } catch (error) {
    console.error('Erreur refundPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du remboursement',
      error: error.message
    });
  }
};

// @route   GET /api/payments
// @desc    Get all payments (admin) or user payments
// @access  Private
exports.getPayments = async (req, res) => {
  try {
    let query = {};

    // Si pas admin, filtrer par utilisateur
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const payments = await Payment.find(query)
      .populate('reservation')
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
      .lean();

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });

  } catch (error) {
    console.error('Erreur getPayments:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements',
      error: error.message
    });
  }
};

